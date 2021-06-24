<temp<template>
  <el-select v-model="value" filterable :disabled="disabled" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"
    />
  </el-select>
</template>

<script>

import { selectFiBookSetPage } from '@/api/finance'

export default {
  name: 'SegmentValueSelect',
  props: {
    value: String,
    valueSet: Object,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      val: '',
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
    'valueSet': {
      handler(nval, oval) {
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.options = []
      if (this.$props.valueSet) {
        this.$props.valueSet.values.forEach((item) => {
          this.options.push(item)
        })
        for (a in this.$props.valueSet.groups) {
          this.options.push('组：'+a)
        }
      }
    },
    handleChange(nval, oval) {
      this.val = nval
      this.$emit('input', nval)
      this.$emit('change', nval, oval)
    }
  }
}
</script>
