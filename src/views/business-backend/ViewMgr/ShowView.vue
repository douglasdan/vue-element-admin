<template>
  <div>

    <div v-if="objectId">
      <component :is="renderComponent" v-if="viewType == 'object-list'"
        :object-id="objectId"
        :view-json="viewJson"
        />

        <component :is="renderComponent" v-if="viewType == 'object-edit'"
        :object-id="objectId"
        :view-json="viewJson"
        />

        <component :is="renderComponent" v-if="viewType == 'object-view'"
        :object-id="objectId"
        :object-data-id="objectDataId"
        :view-json="viewJson"
        />

    </div>
    <div v-else-if="menu.extraUrl">
      <iframe ref="iframe" :src="menu.extraUrl" @load="loaded" />
    </div>

  </div>
</template>

<script>

import { param2Obj } from '@/utils'
import { getViewDefineById, selectViewDefinePage } from '@/api/view-define'

import { repairObjectListViewJson } from '@/views/xview/template/object-list-template-compatible.js'
import { repairObjectEditViewJson } from '@/views/xview/template/object-edit-template-compatible.js'
import { repairObjectViewJson } from '@/views/xview/template/object-view-template-compatible.js'

import fcShareStrategyView from '@/views/business-finance/fico/fc-share-strategy-view'
import fcShareStrategyList from '@/views/business-finance/fico/fc-share-strategy-list'
// import fcShareTraceView from '@/views/business-finance/fico/fc-share-trace-view'
import fcGatherResultTrace from '@/views/business-finance/fico/fc-gather-result-trace'
import csCostObjectConfig from '@/views/business-finance/fico/cs-cost-object-config'

import { CustomViewDefines } from '@/views/business-backend/ViewMgr/customer-view-override'

export default {
  name: 'ShowView',
  components: {
    fcShareStrategyView,
    fcShareStrategyList,
    // fcShareTraceView,
    fcGatherResultTrace,
    csCostObjectConfig
  },
  props: {
    viewDefine: {
      type: Object,
      required: false
    },
    dataId: [String, Number],
    directShow: {
      objectId: [String, Number],
      viewType: ''
    }
  },
  data() {
    return {
      menu: {},

      viewId: '',
      viewType: '',
      objectId: '',
      objectDefine: null,
      viewJson: null,
      objectDataId: null,
    }
  },
  watch: {
    'viewDefine': {
      handler(nval, oval) {
        if (nval) {
          this.viewId = nval.viewId
          this.viewType = nval.viewType
          this.objectId = nval.objectId
          this.viewJson = JSON.parse(nval.viewContent)
        }
      },
      deep: true,
      immediate: true
    },
    'dataId': {
      handler(nval, oval) {
        this.objectDataId = nval
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    renderComponent: {
      get() {
        if (this.objectDefine && CustomViewDefines[this.objectDefine.objectCode]
            && CustomViewDefines[this.objectDefine.objectCode][this.viewType]) {

          let def = CustomViewDefines[this.objectDefine.objectCode][this.viewType]
          return def
        }

        if (this.viewType == 'object-list') {
          return 'x-object-list-view'
        }
        else if (this.viewType == 'object-edit') {
            return 'x-object-edit-view'
        }
        else if (this.viewType == 'object-view') {
          return 'x-object-view-view'
        }
      },
    }
  },
  created() {

    let reg = new RegExp("^/view[0-9]*$");
    if (this.$props.viewDefine) {
      // 由外部传递viewContent，来渲染页面

    }
    else if (this.directShow && this.directShow.objectId && this.directShow.viewType == 'object-list') {

      //组件内部引用，根据ObjectId + viewType查询显示页面
      selectViewDefinePage({
          conditions: [
            {field: 'object_id', op:'eq', values:[''+this.directShow.objectId]},
            {field: 'view_type', op:'eq', values:['object-list']},
          ]
        }).then(ret => {

          if (ret.success && ret.data.rows.length > 0) {
            this.viewId = ret.data.rows[0].id
            this.getAndShowViewById()
          }
        })
    }
    else if (this.$route.params.viewId) {
      // 从后台获取viewContent来渲染
      this.viewId = this.$route.params.viewId
      this.getAndShowViewById()
    }
    else if (reg.test(this.$route.path)) {
      const menuId = (this.$route.path + '').replaceAll('/view', '')

      this.$store.dispatch('permission/getMenuDefine', menuId).then(ret => {
        this.menu = ret
        this.viewId = this.menu.viewId
        this.getAndShowViewById()
      })
    }
  },
  methods: {
    loaded() {
      //
    },
    getAndShowViewById() {
      if (!this.viewId) {
        return
      }
      getViewDefineById(this.viewId).then(ret => {
        if (ret.success) {
          this.view = ret.data
          this.viewType = this.view.viewType

          if (this.view.viewType == 'object-view' && !this.$route.params.dataId) {
            this.$message.error('参数错误：必须指定数据ID');
            return
          }

          this.objectDataId = this.$route.params.dataId

          this.objectId = this.view.objectId

          this.$store.dispatch('lowCode/getObjectDefine', this.objectId).then(ret => {
              this.objectDefine = ret
          })

          let viewJson = JSON.parse(ret.data.viewContent)

          if (this.viewType == 'object-list') {
            repairObjectListViewJson(viewJson)
          }
          else if (this.viewType == 'object-edit') {
            repairObjectEditViewJson(viewJson)
          }
          else if (this.viewType == 'object-view') {
            repairObjectViewJson(viewJson)
          }
          this.viewJson = viewJson

          if (!this.menu.menuId) {
            console.log(this.$route)
            console.log(this.$route.meta.title,'||', this.view.viewName)

            let tagsView = Object.assign({}, this.$route, {
              meta:{
                title: this.$route.meta.title || this.view.viewName
              }
            })
            this.$store.dispatch('tagsView/addView', tagsView)
          }
        }
        else {
          this.$message.error('页面不存在');
        }
      })
    },
  }
}

</script>>
