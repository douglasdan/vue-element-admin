<template>
  <component
    :is="componentTag()"
    :key="eid"
    :ref="view.refName"
    :view-data="viewData"
    v-bind="view.props"
    :view="view"
    :ref-name="view.refName"
  >

    {{ view.content }}

    <x-element v-for="item in view.children" :view="item" :view-data="viewData" />

  </component>
</template>

<script>

import { uuid } from 'vue-uuid'

export default {
  name: 'XElement',
  components: {
  },
  props: {
    view: {
      type: Object
    },
    viewData: {
      type: Object
    }
  },
  data() {
    return {
      eid: ''
    }
  },
  watch: {
    viewData: {
      handler(newVal) {
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.eid = this.$uuid.v4()
  },
  compute: {

  },
  methods: {
    componentTag() {
      if (this.view.component == 'String') {
        return 'span'
      }
      if (typeof this.view !== 'object') {
        return 'span'
      }

      return this.view.component
    }
  }
}
</script>

<style>

</style>
