<template>
  <el-select v-model="val" filterable :disabled="disabled" :clearable="true" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.viewName"
      :value="item.id"
    />
  </el-select>
</template>

<script>

export default {
  name: 'ViewSelect',
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
      val: null,
      options: []
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        this.val = nval
      },
      deep: true,
      immediate: true
    },
    'disabled': {
      handler(nval, oval) {
      },
      immediate: true
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$store.dispatch('lowCode/getViews').then(ret => {
        this.options = ret
      })
    },
    handleChange(nval, oval) {
      this.val = nval
      this.$emit('input', nval)
      this.$emit('change', nval, oval)
    }
  }
}
</script>
