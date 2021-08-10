<template>
  <el-select v-model="val" filterable clearable :disabled="disabled" @change="handleChange" :style="showStyle">
    <el-option
      v-for="item in objects"
      :key="item.objectCode"
      :label="item.objectCode+' '+item.objectName"
      :value="item.objectCode"
    />
  </el-select>
</template>

<script>

import { selectObjectDefinePage } from '@/lowcode/api/lowcode'

export default {
  name: 'ls-field-select',
  props: {
    appCode: String,
    value: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    width: [String, Number]
  },
  watch: {
    'appCode' :{
      handler(nval, oval) {
        this.loadData()
      },
      deep: true,
      immediate: true
    },
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
  computed: {
    showStyle() {
      return 'width: '+ (this.width ? this.width+'px;' : '200px;')
    }
  },
  data() {
    return {
      objects: [],
      val: null,
    }
  },
  mounted() {
  },
  methods: {
    loadData() {
      selectObjectDefinePage({
        conditions: [{
          field: 'app_code', op:'eq', values:[this.appCode]
        }]
      }).then(ret => {
        this.objects = ret.data.rows
      })
    },
    handleChange(nval, oval) {
      this.val = nval
      this.$emit('input', nval)
      this.$emit('change', nval, oval)

      if (nval) {
        this.$emit('selectObject', this.objects.filter(a => a.objectCode == nval)[0])
      }
    },
  }
}

</script>
