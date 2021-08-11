<template>
  <section>
    <div>
      <el-row v-if="!showFuncBar" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="display: flex-inline;">
          <el-link v-show="showFilterBtn" type="primary" style="line-height: 32px;" @click="toggleQueryPanel">筛选</el-link>
        </div>
        <div style="right: 10px; float: right; position: absolute;">
          <x-button v-for="(btn, index) in viewButtons" :view="btn" :self="self" />
        </div>
      </el-row>
    </div>

    <div v-show="queryPanelVisible">
      <lc-form-item v-for="(cond,i) in conditions" :label="cond.fieldName" :label-width="condLabelWidth">
        <lc-condition :object-code="objectCode" :hide-op="true" :cond="cond" :width="condInputWidth"></lc-condition>
      </lc-form-item>
    </div>

  </section>
</template>
<script>

  import { mapState } from 'vuex'
  import { selectTreeRootPage, selectObjectDataPage } from '@/lowcode/api/lowcode.js'

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
        },
        deep: true,
        immediate: true
      },
    },
    computed: {
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
      checkBoxWidth() {
        return 31 + this.treeMaxDepth * 14
      }
    },
    created() {
      console.log('lc-view-list '+this.objectCode+' '+this.viewCode+' created')
    },
    mounted() {
      console.log('lc-view-list '+this.objectCode+' '+this.viewCode+' mounted')
    },
    methods: {

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
      }
    }
  }
</script>
