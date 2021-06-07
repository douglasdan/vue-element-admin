<template>
  <el-select v-model="val" filterable :disabled="disabled" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.setName"
      :value="item.id"
    />
  </el-select>
</template>

<script>

import { selectFiBookSetPage } from '@/api/finance'

export default {
  name: 'BookSetSelect',
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
      selectFiBookSetPage({
        pageNo: 1, pageSize: 10000
      }).then(ret => {
        this.options = ret.data.rows
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
