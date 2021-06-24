<template>
  <el-select v-model="val" filterable :disabled="disabled" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.obiectName"
      :value="item.id"
    />
  </el-select>
</template>

<script>

import { selectObjectDefinePage } from '@/api/object-define'

export default {
  name: 'ObjectSelect',
  props: {
    value: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    appId: {
      type: String,
      required: false,
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
    'appId': {
      handler(nval, oval) {
        this.loadData()
      },
      immediate: true
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {

      let query = {
        pageNo: 1, pageSize: 10000,
        conditions: []
      }

      if (this.$props.appId) {
        query.conditions.push({
          field: 'app_id', op: 'eq', values:[this.$props.appId]
        })
      }

      selectObjectDefinePage(query).then(ret => {
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
