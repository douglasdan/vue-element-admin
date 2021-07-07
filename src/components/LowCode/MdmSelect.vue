<template>
  <el-select v-model="val" placeholder="" :disabled="disabled" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="''+item.value"
      :label="''+item.label"
      :value="''+item.value"
    />
  </el-select>
</template>

<script>

export default {
  name: 'MdmSelect',
  props: {
    code: String,
    value: String,
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
      val: null,
      options: []
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        console.log('MdmSelect value=', nval)
        this.val = nval
      },
      deep: true,
      immediate: true
    },
    'disabled': {
      handler(nval, oval) {
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const mdm = await this.$store.dispatch('mdm/getMdmData', this.$props.code)
      this.options = JSON.parse(mdm.json)
    },
    handleChange(nval, oval) {
      console.log('mdm-select', this.$props.code, 'change to ', nval)
      this.val = nval
      this.$emit('input', nval)
      this.$emit('change', nval, oval)
    }
  }
}
</script>
