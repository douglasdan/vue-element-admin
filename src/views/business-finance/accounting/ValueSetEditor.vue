<template>
  <div>
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px;">
      <span style="margin-left: 10px;">数据项：</span>
      <el-button type="primary" style="margin-right: 10px; float: right;" @click="handleAdd">新增</el-button>
      <el-button type="primary" style="margin-right: 10px; float: right;" @click="handleSubmit">保存</el-button>
    </el-row>

    <el-row>
      <div v-for="(item, i) in values" style="margin-top:8px; margin-bottom:8px; margin-left: 10px;">
        <el-input v-model="values[i]" placeholder="" type="small" style="width: 200px;" />
        <i class="el-icon-minus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleDelete(i)" />
        <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleAdd(i)" />
      </div>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'ValueSetEditor',
  components: {},
  props: {
    value: Array
  },
  data() {
    return {
      values: []
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        this.values = [].concat(nval)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleAdd() {
      this.values.push('')
    },
    handleAdd(i) {
      this.values.splice(i + 1, 0, '')
    },
    handleDelete(i) {
      this.values.splice(i, 1)
    },
    handleSubmit() {
      this.$emit('input', this.values)
      this.$emit('submit', {})
    }
  }
}

</script>
