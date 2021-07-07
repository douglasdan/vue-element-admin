<template>
  <section>
    <div>
      <el-row v-if="viewJson.viewButtons && viewJson.viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="display: flex-inline;" >
          <el-link type="primary" style="line-height: 32px;" @click="toggleQueryPanel" v-show="queryBtnVisible()">筛选</el-link>
        </div>
        <div style="right: 10px; float: right; position: absolute;">
          <x-button v-for="(btn, index) in viewJson.viewButtons" :view="btn" :self="self" />
        </div>
      </el-row>

      <x-object-filter :object-id="objectId" :viewJson="viewJson"
        ref="refObjectFilter"
        v-show="queryPanelVisible" >
      </x-object-filter>

      <el-table :data="rows"
        border
        :row-key="(objectDefine && objectDefine.treeFlag ? objectDefine.idFieldCode : 'id')"
        style="width: 100%;"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @header-dragend="handleHeaderDragend"
        :height="tableHeight"
        lazy
        :load="loadTreeNode"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >

        <el-table-column width="45" v-if="objectDefine && objectDefine.treeFlag">
        </el-table-column>
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
            <x-object-field-control v-if="mdmReady"
              v-model="scope.row[f.fieldCode]"
              :field-define="objectFieldDefineMap[f.fieldCode]"
              >
            </x-object-field-control>
          </template>
        </el-table-column>

        <el-table-column prop="operate" v-if="!hideRowOpearte"
          :width=" (viewJson.operate && viewJson.operate.width) ? viewJson.operate.width : 100">
          <template slot="header">
            <span>操作</span>
          </template>
          <template scope="scope">
            <x-button :size="'mini'" v-for="(btn, index) in viewJson.rowButtons" :view="btn" :self="self" :row="scope.row"/>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
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

    <el-dialog ref="showViewDialog" :visible.sync="showView.visible" width="80%" append-to-body>
      <show-view :view-define="showView.viewDefine" :data-id="showView.dataId" v-if="showView.visible">
      </show-view>
    </el-dialog>

  </section>
</template>

<script>

import { mapState } from 'vuex'
import { getObjectDefineById } from '@/api/object-define'
import { selectObjectFieldDefinePage } from '@/api/object-field-define'
import { selectObjectDataPage, selectTreeRootPage, getTree } from '@/api/object-data'
import { getViewDefineById } from '@/api/view-define'

export default {
  name: 'x-object-list-view',
  components: {
  },
  props: {
    objectId: {
      type: String,
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
      type: String,     //select 选择模式
      default: ''
    }
  },
  data() {
    return {
      self: this,
      mdmReady: false,

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
        dataId: null,
      },

      treeProps: {
        label: '',
        children: 'children',
        isLeaf: 'leaf'
      },

    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      },
      mdmList: function(state) {
        return state.mdm.rows
      },
    }),
    checkShowInDialog() {
      let flag = false
      let p = this.$parent
      while(p) {
        if (p.$options._componentTag == 'el-dialog') {
          flag = true
          break
        }
        p = p.$parent
      }
      return flag
    },
    tableHeight() {
      if (this.checkShowInDialog) {
        return (window.innerHeight/2)+'px'
      }
      else {
        const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
        return h
      }
    },
    hideRowOpearte() {
      return this.mode == 'select'
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
    }
  },
  async created() {
    await this.$store.dispatch('mdm/getMdmData', '')
    this.mdmReady = true
  },
  methods: {
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
      }
      else {
        this.$props.viewJson.showFields.forEach((item) => {
          if (item.fieldCode == column.property) {
            item.width = newWidth
          }
        })
      }
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

        let fd = this.objectFieldDefineMap[column.property]
        if (fd && fd.valueRefType) {
          if (fd.valueRefType == '1') {
            let dd = JSON.parse(this.mdm['bool'].json).find(a => a.value == cellValue)
            if (dd) {
              return dd.label
            }
          }
          else if (fd.valueRefType == '2') {
            let mm = this.mdmList.find(a => a.id == fd.mdmDataId)
            if (mm) {
              let dd = JSON.parse(this.mdm[mm.mdmCode].json).find(a => a.value == cellValue)
              if (dd) {
                return dd.label
              }
            }
          }
          else if (fd.valueRefType == '3') {
            //TODO select

          }
          else if (fd.valueRefType == '4') {
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

      let queryObj = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        conditions: []
      }
      queryObj.conditions = this.$refs.refObjectFilter.getConditions()

      if (this.objectDefine.treeFlag) {
        selectTreeRootPage(this.objectId, queryObj).then(ret => {
          if (ret.success) {
            ret.data.rows.forEach((row) => {
              row.hasChildren = true
            })

            this.total = ret.data.total
            this.rows = ret.data.rows
          }
        })
      }
      else {
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

      getTree(this.objectDefine.id, tree.id).then(ret => {
        if (ret.success) {
          //肯定为root节点
          if (ret.data.children && ret.data.children.length > 0) {
            resolve(ret.data.children)
            // tree.hasChildren = true
          }
          else {
            resolve([])
            tree.hasChildren = false
          }
        }
        else {
          this.$message.error('没有下级数据')
        }
      })

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
              this.$router.push({path: '/singleview/' + ret.data.id});
            }
            else if (ret.data.viewType == 'object-view') {
              this.$router.push({path: '/singleview/' + ret.data.id+'/'+row.id});
            }
            else {
              this.showView.viewDefine = ret.data
              this.showView.visible = true
            }
          }
          else {
            //
            this.$message.error('试图定义错误')
          }
        })

      }
      //
    },

    handleSelectionChange(sels){
      this.sels = sels
    },

    getParentView(tag) {
      let p = this.$parent
      while(p) {
        if (p.$options._componentTag == tag) {
          break
        }
        p = p.$parent
      }
      return p
    },
    submitSelection() {
      this.$emit('object-relation', {
        objectId: this.objectId,
        row: this.sels[0]
      })

      let p = this.getParentView('x-object-field-control')
      if (p) {
        p.closeDialog()
      }
    },

    deleteDataRow(row) {
      //TODO

    }

  }

}

</script>
