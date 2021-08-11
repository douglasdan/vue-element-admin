<template>
  <section>
    <div>
      <el-row v-if="showFuncBar" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="display: flex-inline;">
          <el-link v-show="showFilterBtn" type="primary" style="line-height: 32px;" @click="toggleQueryPanel">筛选</el-link>
        </div>
        <div style="right: 10px; float: right; position: absolute;">
          <lc-button v-if="btn.visible" v-for="(btn, index) in viewButtons" :btn="btn" :self="self" />
        </div>
      </el-row>
    </div>

    <div v-show="queryPanelVisible">
      <lc-form-item v-for="(cond,i) in conditions" :label="cond.fieldName" :label-width="condLabelWidth">
        <lc-condition :object-code="objectCode" :hide-op="true" :cond="cond" :width="condInputWidth"></lc-condition>
      </lc-form-item>
    </div>

    <el-table
        :data="rows"
        border
        :row-key="rowKey"
        style="width: 100%;"
        highlight-current-row
        :height="tableHeight"
        lazy
        :load="loadTreeNode"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
        @row-click="haneldRowClick"
      >

        <el-table-column v-if="isTree" :width="dropdownWidth" />
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" />
        <el-table-column
          v-for="(f, i) in viewJson.showFields"
          v-if="f.visible"
          :prop="f.fieldCode"
          :label="f.fieldName"
          :show-overflow-tooltip="showTooltip(f.fieldCode)"
          :width=" !!f.width ? f.width : 100"
        >
          <template scope="scope">
            <lc-field-input
              v-model="scope.row[f.fieldCode]"
              :object-code="objectCode"
              :field-code="f.fieldCode"
            />
          </template>
        </el-table-column>

        <el-table-column
          v-if="showRowOperate"
          prop="operate"
          :width="operateWidth"
        >
          <template slot="header">
            <span>操作</span>
          </template>
          <template scope="scope">
            <lc-button
              v-for="(btn, index) in rowButtons"
              v-if="btn.visible"
              :size="'mini'"
              :btn="btn"
              :self="self"
              :row="scope.row"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-row v-if="pagination.visible">
        <div class="block" style="margin: 5px; float: right;">
          <el-pagination
            :current-page.sync="pageNo"
            :page-size="pageSize"
            :page-sizes="pagination.pageSizes"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-row>

      <el-row v-if="selectMode" style="margin: 10px; font-size: 14px; height: 32px; text-align: right;">
        <el-button type="primary" size="small" @click="submitSelection">确定</el-button>
      </el-row>

  </section>
</template>
<script>

  import { mapState } from 'vuex'
  import { selectTreeRootPage, selectObjectDataPage } from '@/lowcode/api/lowcode.js'
  import { isRootPageView, isShowInDialog } from '@/utils'

  export default {
    name: 'lc-view-list',
    props: {
      objectCode: String,

      viewCode: String,
      //viewJson由外部加载，传入
      viewJson: Object,
      //选择模式,
      selectMode:  {
        type: Boolean,
        default: false
      },
      //树形模式，且对象支持
      treeMode: {
        type: Boolean,
        default: true
      },
      pagination: {
        type: Object,
        default() {
          return {
            visible: true,
            pageSizes: [10, 20, 40]
          }
        }
      },
      //行编辑
      rowEditable: {
        type: Boolean,
        default: false
      },
      rowOperateVisible: {
        type: Boolean,
        default: true
      },
      funcVisible: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        self: this,
        objectDefine: null,

        total: 0,
        rows: [],
        pageNo: 1,
        pageSize: 20,

        conditions: [],
        extraConds: [],
        queryPanelVisible: false,

        sels: [],
        treeProps: {
          label: '',
          children: 'children',
          isLeaf: 'leaf'
        },
        treeMaxDepth: 1,
      }
    },
    watch: {
      'objectCode': {
        handler(nval, oval) {
          if (nval != oval) {
            this.loadMetadata()
          }
        },
        immediate: true
      },
      'viewJson': {
        handler(nval, oval) {
          if (nval && nval.queryDefine.conditions) {
            this.conditions = JSON.parse(JSON.stringify(nval.queryDefine.conditions))
          }
          console.log('lc-view-list show field ', this.viewJson.showFields.map(a => a.fieldCode))
          this.$nextTick(() => {
            this.$forceUpdate()
            this.rows = [].concat(this.rows)
          })
        },
        deep: true,
        immediate: true
      },
    },
    computed: {
      rowKey() {
        return this.isTree ? this.objectDefine.keyFieldCode : 'id'
      },
      isTree() {
        return this.objectDefine && this.objectDefine.treeFlag == '1'
      },
      dropdownWidth() {
        return 31 + this.treeMaxDepth * 14
      },
      showFuncBar() {
        if (!this.funcVisible) {
          return false
        }
        return this.viewButtons.filter(a => a.visible).length > 0
      },
      showFilterBtn() {
        return this.conditions.filter(a => a.visible).length > 0
      },
      condLabelWidth() {
        if (this.viewJson && this.viewJson.queryDefine && this.viewJson.queryDefine.labelWidth) {
          return parseInt(this.viewJson.queryDefine.labelWidth)
        }
        return 120
      },
      condInputWidth() {
        if (this.viewJson && this.viewJson.queryDefine && this.viewJson.queryDefine.inputWidth) {
          return parseInt(this.viewJson.queryDefine.inputWidth)
        }
        return 200
      },
      viewButtons() {
        return this.viewJson ? this.viewJson.viewButtons : []
      },
      rowButtons() {
        return this.viewJson ? this.viewJson.rowButtons : []
      },
      showRowOperate() {
        return this.rowOperateVisible && this.rowButtons.filter(a => a.visible).length > 0
      },
      operateWidth() {
        return (this.viewJson.operate && this.viewJson.operate.width) ? this.viewJson.operate.width : 100
      },
      tableHeight() {
        let h
        if (isRootPageView(this)) {
          h = (window.innerHeight - 22 -
            this.$store.state.settings.navbarHeight -
            this.$store.state.settings.tagsViewHeight -
            this.$store.state.settings.tableFuncBarHeight -
            this.$store.state.settings.tablePaginationHeight)
        } else {
          h = (window.innerHeight / 2)
        }
        if (this.viewJson.maxHeight > 0 && h > this.viewJson.maxHeight) {
          h = this.viewJson.maxHeight
        }
        return h + 'px'
      },
    },
    created() {
      console.log('lc-view-list '+this.objectCode+' '+this.viewCode+' created')
    },
    mounted() {
      console.log('lc-view-list '+this.objectCode+' '+this.viewCode+' mounted')
    },
    methods: {
      showTooltip(code) {
        return true
        // const fieldDefine = this.objectDefine.filter(a => a.fieldCode == code)[0]
        // if (fieldDefine) {
        //   if (fieldDefine.fieldType == 'text' && fieldDefine.fieldLength >= 20) {
        //     //TODO 且有内容超过长度？
        //     return true
        //   }
        // }
        // return false
      },
      async loadMetadata() {
        //同步加载，对象信息
        this.objectDefine = await this.$store.dispatch('lowCode/getObjectDefineByCode', this.objectCode)
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
      resetQueryCond() {
        this.conditions = JSON.parse(JSON.stringify(this.viewJson.queryDefine.conditions))
        this.loadData()
      },
      loadData() {
        let query = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          conditions: []
        }
        query.conditions = query.conditions.concat(this.conditions)
        query.conditions = query.conditions.concat(this.extraConds)

        if (this.objectDefine.treeFlag == '') {
          selectTreeRootPage(this.objectCode, query).then(ret => {
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
          selectObjectDataPage(this.objectCode, query).then(ret => {
            if (ret.success) {
              this.total = ret.data.total
              this.rows = ret.data.rows
            }
          })
        }
      },
      loadTreeNode(tree, treeNode, resolve) {
        selectObjectDataPage(this.objectCode, {
          conditions: [{ fieldCode: this.objectDefine['supFieldCode'], op: 'eq', values: [tree[this.objectDefine['keyFieldCode']]] }]
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
      },

      haneldRowClick(	row, column, event) {
        this.$emit('row-click', { row, column, event })
      },
      handleSelectionChange(sels) {
        this.sels = sels
      },

      //****** 选择模式

      submitSelection() {

      },
    }
  }
</script>
