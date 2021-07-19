<template>
  <div>

    <div v-if="pageDefine.objectId && pageDefine.viewType && viewJson">

      <component
        v-if="pageDefine.viewType == 'object-list'"
        :is="renderComponent"
        v-bind="pageProps"
        :object-id="pageDefine.objectId"
        :view-json="viewJson"
      />

      <component
        v-if="pageDefine.viewType == 'object-edit'"
        :is="renderComponent"
        v-bind="pageProps"
        :object-id="pageDefine.objectId"
        :view-json="viewJson"
      />

      <component
        v-if="pageDefine.viewType == 'object-view' && pageDefine.dataId"
        :is="renderComponent"
        v-bind="pageProps"
        :object-id="pageDefine.objectId"
        :object-data-id="pageDefine.dataId"
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

// import fcShareStrategyView from '@/views/business-finance/fico/fc-share-strategy-view'
// import fcShareStrategyList from '@/views/business-finance/fico/fc-share-strategy-list'
// import fcShareTraceView from '@/views/business-finance/fico/fc-share-trace-view'
// import fcGatherResultTrace from '@/views/business-finance/fico/fc-gather-result-trace'
// import csCostObjectConfig from '@/views/business-finance/fico/cs-cost-object-config'

import { CustomViewDefines } from '@/views/business-backend/ViewMgr/customer-view-override'



export default {
  name: 'ShowView',
  components: {
    // fcShareStrategyView,
    // fcShareStrategyList,
    // fcShareTraceView,
    // fcGatherResultTrace,
    // csCostObjectConfig
  },
  props: {
    viewDefine: {
      type: Object,
      required: false
    },
    viewId: [String, Number],
    objectId: [String, Number],
    viewType: [String],
    dataId: [String, Number],

    pageProps: {
      type: Object
    }
  },
  data() {
    return {
      menu: {},
      viewJson: null,
      objectDefine: null,

      pageDefine: {
        viewId: null,
        objectId: null,
        viewType: null,
        dataId: null
      }
    }
  },
  computed: {

  },
  watch: {
    'viewDefine': {
      handler(nval, oval) {
        if (nval) {
          if (nval.viewId) {
            this.pageDefine.viewId = nval.viewId
          }
          if (nval.viewType) {
            this.pageDefine.viewType = nval.viewType
          }
          if (nval.objectId) {
            this.pageDefine.objectId = nval.objectId
          }
          this.viewJson = JSON.parse(nval.viewContent)
        }
      },
      deep: true,
      immediate: true
    },
    'viewId': {
      handler(nval, oval) {
        if (nval) {
          this.pageDefine.viewId = nval
        }
      },
      deep: true,
      immediate: true
    },
    'objectId': {
      handler(nval, oval) {
        if (nval) {
          this.pageDefine.objectId = nval
        }
      },
      deep: true,
      immediate: true
    },
    'viewType': {
      handler(nval, oval) {
        if (nval) {
          this.pageDefine.viewType = nval
        }
      },
      deep: true,
      immediate: true
    },
    'dataId': {
      handler(nval, oval) {
        if (nval) {
          this.pageDefine.dataId = nval
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    renderComponent: {
      get() {

        if (this.pageDefine.objectId && this.pageDefine.viewType && this.objectDefine) {
          if (this.objectDefine && CustomViewDefines[this.objectDefine.objectCode] &&
            CustomViewDefines[this.objectDefine.objectCode][this.pageDefine.viewType]) {
            const def = CustomViewDefines[this.objectDefine.objectCode][this.pageDefine.viewType]
            return def
          }

          if (this.pageDefine.viewType == 'object-list') {
            return 'x-object-list-view'
          } else if (this.pageDefine.viewType == 'object-edit') {
            return 'x-object-edit-view'
          } else if (this.pageDefine.viewType == 'object-view') {
            return 'x-object-view-view'
          }
        }
        else {
          return 'div'
        }
      }
    }
  },
  mounted() {
    this.show()
  },
  methods: {

    isRootPageView() {
      return this.$parent.$options._componentTag == 'app-main'
    },

    show() {

      if (this.isRootPageView()) {
        if (this.$route.params.dataId) {
          this.pageDefine.dataId = this.$route.params.dataId
        }
        else if (this.dataId) {
          this.pageDefine.dataId = this.dataId
        }
      }

      //如果有viewDefine
      if (this.viewDefine) {
        // 由外部传递viewContent，来渲染页面

      }
      else if (this.isRootPageView() && this.$route.params.viewId) {
        this.pageDefine.viewId = this.$route.params.viewId
        this.getAndShowViewById()
      }
      else if (this.objectId && this.viewType) {

        selectViewDefinePage({
          conditions: [
            { field: 'object_id', op: 'eq', values: ['' + this.pageDefine.objectId] },
            { field: 'view_type', op: 'eq', values: [this.pageDefine.viewType] }
          ]
        }).then(ret => {
          if (ret.success && ret.data.rows.length > 0) {
            this.pageDefine.viewId = ret.data.rows[0].id
            this.getAndShowViewById()
          }
        })
      }
      else if (new RegExp('^/view[0-9]*$').test(this.$route.path)) {
        const menuId = (this.$route.path + '').replaceAll('/view', '')

        this.$store.dispatch('permission/getMenuDefine', menuId).then(ret => {
          this.menu = ret
          this.pageDefine.viewId = this.menu.viewId
          this.getAndShowViewById()
        })
      }
    },

    getAndShowViewById() {
      if (!this.pageDefine.viewId) {
        return
      }
      getViewDefineById(this.pageDefine.viewId).then(ret => {
        if (ret.success) {

          this.view = ret.data
          this.pageDefine.viewType = this.view.viewType

          if (this.view.viewType == 'object-view' && !this.$route.params.dataId) {
            this.$message.error('参数错误：必须指定数据ID')
            return
          }

          this.pageDefine.objectId = this.view.objectId

          this.$store.dispatch('lowCode/getObjectDefine', this.pageDefine.objectId).then(ret => {
            this.objectDefine = ret
          })

          const viewJson = JSON.parse(ret.data.viewContent)

          if (this.pageDefine.viewType == 'object-list') {
            repairObjectListViewJson(viewJson)
          } else if (this.pageDefine.viewType == 'object-edit') {
            repairObjectEditViewJson(viewJson)
          } else if (this.pageDefine.viewType == 'object-view') {
            repairObjectViewJson(viewJson)
          }
          this.viewJson = viewJson

          if (!this.menu.menuId) {
            console.log(this.$route)
            console.log(this.$route.meta.title, '||', this.view.viewName)

            const tagsView = Object.assign({}, this.$route, {
              meta: {
                title: this.$route.meta.title || this.view.viewName
              }
            })
            this.$store.dispatch('tagsView/addView', tagsView)
          }

        } else {
          this.$message.error('页面不存在')
        }
      })
    }
  }
}

</script>>
