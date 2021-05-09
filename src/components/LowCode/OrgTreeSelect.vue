<template>
  <tree-select
    :options="options"
    placeholder="请选择"
    :value="value"
    :disabled="disabled"
    :max-height="200"
    :normalizer="normalizer"
    @select="handleSelect"
  />
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'OrgTreeSelect',
  components: { TreeSelect },
  props: {
    value: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      options: [],
      sels: [],
      selectOne: null
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    //
    async loadData() {
      this.options = [{ orgId: '', orgName: '无' }].concat(await this.$store.dispatch('corpAdmin/getOrgTreeRoot'))
      console.log(JSON.stringify(this.options))
    },
    normalizer(node) {
      return {
        id: node.orgId,
        label: node.orgName,
        children: node.children
      }
    },
    handleSelect(node, instanceId) {
      console.log('org-tree-select', JSON.stringify(node))
      this.selectOne = node
      this.$emit('change', this.selectOne)
    }
  }
}
</script>
