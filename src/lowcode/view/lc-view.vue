<template>
  <div>
    信息
  </div>
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
      if (this.viewJson && this.templateCode) {

      }
    }

  }
}
</script>
