<template>
  <component
    :is="componentTag()"
    :value="val"
    :disabled="disabled"
    :code="code"
    :version="version"
    :multiple="multiple"
    @change="handleChange"
  />
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'MdmData',
  props: {
    code: {
      type: String,
      required: true
    },
    value: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    version:
    {
      type: Number,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      val: null,
      componentName: ''
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        console.log('MdmData value=', nval)
        this.val = nval
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.$store.dispatch('mdm/getMdmData', '')
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    })
  },
  mounted() {
    console.log(this.$props.value)
  },
  methods: {
    componentTag() {
      const mdmdata = this.mdm[this.$props.code]
      if (mdmdata.mdmType === '1' || mdmdata.mdmType === '2') {
        return 'mdm-select'
      }
      if (mdmdata.mdmType === '3') {
        return 'mdm-tree'
      }
      return 'div'
    },
    handleChange(val, oval) {
      console.log('mdm-data', this.$props.code, 'change to ', val)
      this.val = val
      this.$emit('change', this.val)
    }
  }
}
</script>
