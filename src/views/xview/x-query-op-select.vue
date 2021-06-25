<template>
  <el-select v-model="val" filterable :disabled="disabled" @change="handleChange" class="hanzi4">
    <el-option
      v-for="item in options"
      :key="item.opType"
      :label="item.opName"
      :value="item.opType"
    />
  </el-select>
</template>

<script>

export default {
  name: 'x-query-op-select',
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
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.options.push({ opType: '', opName: '常量' })
      this.options.push({ opType: 'eq', opName: '等于' })
      this.options.push({ opType: 'ne', opName: '不等于' })
      this.options.push({ opType: 'in', opName: '属于' })
      this.options.push({ opType: 'nin', opName: '不属于' })
      this.options.push({ opType: 'like', opName: '模糊' })
      this.options.push({ opType: 'ge', opName: '大于等于' })
      this.options.push({ opType: 'gt', opName: '大于' })
      this.options.push({ opType: 'le', opName: '小于' })
      this.options.push({ opType: 'lt', opName: '小于等于' })
      this.options.push({ opType: 'between', opName: '范围' })
    },
    handleChange(nval, oval) {
      this.val = nval
      this.$emit('input', nval)
      this.$emit('change', nval, oval)
    }
  }
}
</script>
