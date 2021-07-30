<template>
  <section>
    <div>
      <el-row v-if="!hideFuncBar && viewButtons && viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="display: flex-inline;">
          <el-link v-show="queryBtnVisible()" type="primary" style="line-height: 32px;" @click="toggleQueryPanel">筛选</el-link>
        </div>
        <div style="right: 10px; float: right; position: absolute;">
          <x-button v-for="(btn, index) in viewButtons" :view="btn" :self="self" />
        </div>
      </el-row>

      <x-object-filter
        v-show="queryPanelVisible"
        ref="refObjectFilter"
        :object-id="objectId"
        :view-json="viewJson"
      />

      <el-table
        :data="rows"
        border
        :row-key="(objectDefine && objectDefine.treeFlag ? objectDefine.idFieldCode : 'id')"
        style="width: 100%;"
        highlight-current-row
        :height="tableHeight"
        lazy
        :load="loadTreeNode"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
        @header-dragend="handleHeaderDragend"
        @row-click="haneldRowClick"
      >

        <el-table-column v-if="objectDefine && objectDefine.treeFlag" :width="checkBoxWidth" />
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" />
        <el-table-column
          v-for="(f, i) in viewJson.showFields"
          :prop="f.fieldCode"
          :label="fieldName(f.fieldCode)"
          :show-overflow-tooltip="showTooltip(f.fieldCode)"
          :width=" !!f.width ? f.width : 100"
          :formatter="formatter"
        >
          <template scope="scope">
            <x-object-field-control
              v-if="mdmReady"
              v-model="scope.row[f.fieldCode]"
              :field-define="objectFieldDefineMap[f.fieldCode]"
            />
          </template>
        </el-table-column>

        <el-table-column
          v-if="!hideRowOpearte"
          prop="operate"
          :width=" (viewJson.operate && viewJson.operate.width) ? viewJson.operate.width : 100"
        >
          <template slot="header">
            <span>操作</span>
          </template>
          <template scope="scope">
            <x-button
              v-for="(btn, index) in viewJson.rowButtons"
              v-if="btn.visible"
              :size="'mini'"
              :view="btn"
              :self="self"
              :row="scope.row"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-row v-if="pagination">
        <div class="block" style="margin: 5px; float: right;">
          <el-pagination
            :current-page.sync="pageNo"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-row>

      <el-row v-if="mode == 'select'" style="margin: 10px; font-size: 14px; height: 32px; text-align: right;">
        <el-button type="primary" size="small" @click="submitSelection">确定</el-button>
      </el-row>

    </div>

    <el-dialog ref="showViewDialog" :visible.sync="showView.visible" width="80%" append-to-body v-if="showView.visible">
      <show-view v-if="showView.visible" :view-define="showView.viewDefine" :data-id="showView.dataId" />
    </el-dialog>

  </section>
</template>

<script>

import { mapState } from 'vuex'
import { getObjectDefineById } from '@/api/object-define'
import { selectObjectFieldDefinePage } from '@/api/object-field-define'
import { selectObjectDataPage, selectTreeRootPage, getTree, getObjectDataById, deleteObjectData } from '@/api/object-data'
import { getViewDefineById } from '@/api/view-define'

export default {
  name: 'XObjectListView',
  components: {
  },
  props: {
    objectId: {
      type: [String, Number],
      required: false
    },
    viewJson: {
      type: Object,
      required: false
    },
    edit: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String, // select 选择模式
      default: ''
    },
    maxHeight: {
      type: Number,
      default: 0
    },
    rowEdit: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Boolean,
      default: true
    },
    editing: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object
    },
    hideFuncBar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      self: this,
      mdmReady: false,

      defaultQueryConditions: [],

      objectDefine: null,
      objectFieldDefine: null,
      objectFieldDefineMap: {},

      queryPanelVisible: false,
      query: {
        //
      },
      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      sels: [],

      showView: {
        visible: false,
        viewDefine: null,
        dataId: null
      },

      treeProps: {
        label: '',
        children: 'children',
        isLeaf: 'leaf'
      },

      treeMaxDepth: 1,

      ext: {

      }
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      },
      mdmList: function(state) {
        return state.mdm.rows
      }
    }),
    checkShowInErView() {
      return this.$parent.$options._componentTag == 'show-view' &&
        this.$parent.$parent.$options._componentTag == 'el-tab-pane' &&
        this.$parent.$parent.$parent.$options._componentTag == 'el-tabs' &&
        this.$parent.$parent.$parent.$parent.$options._componentTag == 'x-object-view-view'
    },
    checkShowInDialog() {
      let flag = false
      let p = this.$parent
      while (p) {
        console.log(p.$options._componentTag)
        if (p.$options._componentTag == 'el-dialog') {
          flag = true
          break
        }
        p = p.$parent
      }
      return flag
    },
    tableHeight() {
      let h
      if (this.checkShowInDialog || this.checkShowInErView) {
        h = (window.innerHeight / 2)
      } else {
        h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight)
      }

      if (this.$props.maxHeight > 0 && h > this.$props.maxHeight) {
        h = this.$props.maxHeight
      }
      return h + 'px'
    },
    hideRowOpearte() {
      return this.mode == 'select' || this.viewJson.rowButtons.filter(a => a.visible).length == 0
    },
    viewButtons() {
      return this.viewJson.viewButtons.filter(a => a.visible)
    },
    checkBoxWidth() {
      return 31 + this.treeMaxDepth * 14
    }
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadObject()
      },
      deep: true,
      immediate: true
    },
    'viewJson': {
      handler(nval, oval) {
        //
      },
      deep: true,
      immediate: true
    },
    'objectDefine': {
      handler(nval, oval) {
        if (nval) {
          this.treeProps.label = this.objectDefine['labelFieldCode']
        }
      },
      deep: true,
      immediate: true
    },
  },
  async created() {
    await this.$store.dispatch('mdm/getMdmData', '')
    this.mdmReady = true
  },
  methods: {
    smartAddDefaultCondition() {
      if (this.$parent.$options._componentTag == 'show-view' &&
        this.$parent.$parent.$options._componentTag == 'el-tab-pane' &&
        this.$parent.$parent.$parent.$options._componentTag == 'el-tabs' &&
        this.$parent.$parent.$parent.$parent.$options._componentTag == 'x-object-view-view') {
        const oid = this.$parent.$parent.$parent.$parent.$props.objectId
        const did = this.$parent.$parent.$parent.$parent.$props.objectDataId

        this.objectFieldDefine.forEach((f) => {
          if (f.valueRefType == '4' && f.refFieldCode == 'id' && f.refTableId == oid) {
            this.defaultQueryConditions = [{
              field: f.fieldCode, op: 'eq', values: [did]
            }].concat(this.defaultQueryConditions)
          }
        })
      }
    },
    queryBtnVisible() {
      if (this.viewJson.queryDefine && this.viewJson.queryDefine.conditions) {
        return this.viewJson.queryDefine.conditions.filter(a => a.visible && a.visible && a.opType != '').length > 0
      }
      return false
    },
    toggleQueryPanel() {
      this.queryPanelVisible = !this.queryPanelVisible
      console.log('toggle query panel')
    },
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      console.log('x-object-list-view handleHeaderDragend', column)

      if (column.property == 'operate') {
        this.$props.viewJson.operate.width = newWidth
      } else {
        this.$props.viewJson.showFields.forEach((item) => {
          if (item.fieldCode == column.property) {
            item.width = newWidth
          }
        })
      }
    },
    haneldRowClick(	row, column, event) {
      this.$emit('row-click', { row, column, event })
    },
    loadObject() {
      if (this.objectId) {
        this.$store.dispatch('lowCode/getObjectDefine', this.objectId).then(ret => {
          this.objectDefine = ret
          this.objectFieldDefine = ret.fields

          this.objectFieldDefineMap = {}
          this.objectFieldDefine.forEach((item, index) => {
            this.objectFieldDefineMap[item.fieldCode] = item
          })

          this.treeProps.label = this.objectDefine['labelFieldCode']
          this.smartAddDefaultCondition()
          this.loadData()
        })
      }
    },

    fieldName(code) {
      if (this.objectFieldDefineMap[code]) {
        return this.objectFieldDefineMap[code].fieldName
      }
      return ''
    },
    showTooltip(code) {
      const fieldDefine = this.objectFieldDefineMap[code]
      if (fieldDefine) {
        if (fieldDefine.fieldType == 'text' && fieldDefine.fieldLength >= 20) {
          return true
        }
      }
      return false
    },
    formatter(row, column, cellValue, index) {
      if (this.objectFieldDefineMap[column.property]) {
        const fd = this.objectFieldDefineMap[column.property]
        if (fd && fd.valueRefType) {
          if (fd.valueRefType == '1') {
            const dd = JSON.parse(this.mdm['bool'].json).find(a => a.value == cellValue)
            if (dd) {
              return dd.label
            }
          } else if (fd.valueRefType == '2') {
            const mm = this.mdmList.find(a => a.id == fd.mdmDataId)
            if (mm) {
              const dd = JSON.parse(this.mdm[mm.mdmCode].json).find(a => a.value == cellValue)
              if (dd) {
                return dd.label
              }
            }
          } else if (fd.valueRefType == '3') {
            // TODO select

          } else if (fd.valueRefType == '4') {
            // 引用字段，如果是不读的值，则应当创建另外一个字段来保存值

          }
        }
      }

      return cellValue
    },
    resetQueryCond() {
      if (!this.$refs.refObjectFilter) {
        this.$nextTick(() => {
          this.resetQueryCond()
        })
        return
      }

      this.$refs.refObjectFilter.resetValues()
      this.loadData()
    },

    setDefaultQueryConditions(conds) {
      this.defaultQueryConditions = conds
      this.loadData()
    },
    loadData() {

      if (!this.objectDefine) {
        return
      }
      if (!this.$refs.refObjectFilter) {
        this.$nextTick(() => {
          this.loadData()
        })
        return
      }

      const queryObj = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        conditions: []
      }
      queryObj.conditions = this.defaultQueryConditions.concat(this.$refs.refObjectFilter.getConditions())

      if (this.objectDefine.treeFlag) {
        selectTreeRootPage(this.objectId, queryObj).then(ret => {
          if (ret.success) {
            ret.data.rows.forEach((row) => {
              row.level = 1
              row.hasChildren = true
            })

            this.total = ret.data.total
            this.rows = ret.data.rows
          }
        })
      } else {
        selectObjectDataPage(this.objectId, queryObj).then(ret => {
          if (ret.success) {
            this.total = ret.data.total
            this.rows = ret.data.rows
          }
        })
      }
    },

    loadTreeNode(tree, treeNode, resolve) {
      console.log(tree, treeNode)
      selectObjectDataPage(this.objectDefine.id, {
        pageNo: 1,
        pageSize: 10000,
        conditions: [{ field: this.objectDefine['parentFieldCode'], op: 'eq', values: [tree[this.objectDefine['idFieldCode']]] }]
      }).then(ret => {
        if (ret.success) {
          if (ret.data.rows.length == 0) {
            this.$message.error('没有下级数据')
            resolve([])
          } else {
            ret.data.rows.forEach(item => {
              item.children = []
              item.hasChildren = true
              item.level = tree.level + 1

              this.treeMaxDepth = Math.max(this.treeMaxDepth, item.level)
            })
            resolve(ret.data.rows)
          }
        }
      })

      // getTree(this.objectDefine.id, tree.id).then(ret => {
      //   if (ret.success) {
      //     //肯定为root节点
      //     if (ret.data.children && ret.data.children.length > 0) {
      //       this.autoFixTreeNodeHasChildren(ret.data)
      //       resolve(ret.data.children)
      //       // tree.hasChildren = true
      //     }
      //     else {
      //       resolve([])
      //       tree.hasChildren = false
      //     }
      //   }
      //   else {
      //     this.$message.error('没有下级数据')
      //   }
      // })
    },

    autoFixTreeNodeHasChildren(node) {
      if (node.children && node.children.length > 0) {
        node.hasChildren = true
        node.children.forEach((item) => {
          this.autoFixTreeNodeHasChildren(item)
        })
      } else {
        node.hasChildren = false
      }
    },

    closeDialog() {
      this.showView.visible = false
    },
    openView(viewId, row) {
      //
      console.log('x-object-list-view showView', viewId)

      if (viewId) {
        getViewDefineById(viewId).then(ret => {
          if (ret.success) {
            if (ret.data.viewType == 'object-list') {
              this.$router.push({ path: '/singleview/' + ret.data.id })
            } else if (ret.data.viewType == 'object-view') {
              this.$router.push({ path: '/singleview/' + ret.data.id + '/' + row.id })
            } else {
              this.showView.viewDefine = ret.data
              this.showView.visible = true
            }
          } else {
            //
            this.$message.error('试图定义错误')
          }
        })
      }
      //
    },

    handleSelectionChange(sels) {
      this.sels = sels
    },

    getParentView(tag) {
      let p = this.$parent
      while (p) {
        if (p.$options._componentTag == tag) {
          break
        }
        p = p.$parent
      }
      return p
    },
    submitSelection() {
      if (this.sels.length > 0) {
        this.$emit('object-relation', {
          objectId: this.objectId,
          rows: this.sels
        })

        const p = this.getParentView('x-object-field-control')
        if (p) {
          p.closeDialog()
        }
      }
    },

    deleteDataRow(row) {
      // TODO
      deleteObjectData(this.objectDefine.id, row.id).then(ret => {
        if (ret.success) {
          this.loadData()
        }
      })
    }

  }

}

</script>
