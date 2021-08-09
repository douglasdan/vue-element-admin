<template>
  <div>

  </div>
</template>
<script>

  import { selectTreeRootPage } from '@/lowcode/api/lowcode.js'

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
        default: {
          visible: true,
          pageSizes: [10, 20, 40]
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

        objectDefine: null,

        total: 0,
        rows: [],
        pageNo: 1,
        pageSize: 20,

        defaultConds:[],
        //viewJson定义的筛选条件
        conds: [],
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
          //
        },
        deep: true,
        immediate: true
      },
    },
    computed: {

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
      funcBtnVisible(btn) {
        return btn.visible && true
      },
      rowBtnVisible(row, btn) {
        return btn.visible && true
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

      loadData() {
        let query = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          conditions: []
        }
        query.conditions = query.conditions.concat(this.defaultConds)
        query.conditions = query.conditions.concat(this.conds)

        if (this.objectDefine.treeFlag) {
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
          selectObjectDataPage(this.objectCode, queryObj).then(ret => {
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
