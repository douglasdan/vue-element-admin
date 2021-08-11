<template>
  <component
    ref="view"
    :is="renderComponent"
    :object-code="objectCode"
    :template-code="templateCode"
    :view-json="viewJson"
  />
</template>

<script>

import { ViewOverride } from './view-override'
import { ViewTemplate } from './view-template'

export default {
  name: 'LcView',
  props: {
    objectCode: String,
    viewCode: String,
    viewId: [String, Number],

    templateCode: String,
    viewJson: Object
  },
  computed: {
  },
  watch: {
    'objectCode': {
      handler(nval, oval) {
        this.loadMetadata()
      },
      immediate: true,
      deep: true
    },
    'viewCode': {
      handler(nval, oval) {
        this.loadMetadata()
      },
      immediate: true,
      deep: true
    }
  },
  date() {
    return {
      viewDefine: null
    }
  },
  computed: {
    renderComponent: {
      get() {
        if (this.templateCode == 'list') {
          return 'lc-view-list'
        }
        if (this.templateCode == 'create') {
          return 'lc-view-create'
        }
        if (this.templateCode == 'edit') {
          return 'lc-view-edit'
        }
        return 'div'
      }
    }
  },
  created() {

  },
  methods: {
    isRootPageView() {
      return this.$parent.$options._componentTag == 'app-main'
    },
    async loadMetadata() {
      if (this.objectCode && this.viewCode) {
        //
      }
    },

    renderView() {
      if (!this.viewJson) {
        //
        if (this.viewJson && this.templateCode) {
          //从后台获取
        }
        else if (this.viewId) {
          //

        }
      }

    }

  }
}
</script>
