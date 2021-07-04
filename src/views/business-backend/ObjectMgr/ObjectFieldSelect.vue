<template>
  <el-select v-model="val" filterable :disabled="disabled" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.fieldCode"
      :label="item.fieldName"
      :value="item.fieldCode"
    />
  </el-select>
</template>

<script>

import { selectObjectFieldDefinePage } from '@/api/object-field-define'

export default {
  name: 'ObjectSelect',
  props: {
    value: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    objectId: {
      type: [String, Number],
      required: true
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
    'objectId': {
      handler(nval, oval) {
        this.loadData()
      },
      immediate: true
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.options = []
      if (this.objectId) {
        const query = {
          pageNo: 1, pageSize: 10000,
          conditions: [{
            field: 'oid', op: 'eq', values: [this.$props.objectId]
          }]
        }

        selectObjectFieldDefinePage(query).then(ret => {
          this.options = ret.data.rows
        })
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
