<template>
  <el-select v-model="val" filterable :disabled="disabled" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.appName"
      :value="item.id"
      :disabled="disabled"
    />
  </el-select>
</template>

<script>

import { selectAppPage } from '@/api/app'

export default {
  name: 'AppSelect',
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
      selectAppPage({
        pageNo: 1, pageSize: 10000
      }).then(ret => {
        if (this.$props.appType) {
          this.options = ret.data.rows
        } else {
          this.options = ret.data.rows
        }
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
