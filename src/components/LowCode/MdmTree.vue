<template>
  <tree-select v-model="value" :options="options" placeholder="请选择分类..." />
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'MdmTree',
  components: { TreeSelect },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    code: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    version: {
      type: Number,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      options: []
    }
  },
  methods: {

  }
}
</script>
