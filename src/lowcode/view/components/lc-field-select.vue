<template>
  <el-select v-model="val" filterable clearable :disabled="disabled" @change="handleChange" :style="showStyle">
    <el-option
      v-for="item in objectDefine.fields"
      :key="item.fieldCode"
      :label="item.fieldCode+' '+item.fieldName"
      :value="item.fieldCode"
    />
  </el-select>
</template>

<script>

export default {
  name: 'ls-field-select',
  props: {
    objectCode: String,
    value: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    width: [String, Number]
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
    'objectCode': {
      handler(nval, oval) {
        this.loadData()
      },
      immediate: true
    }
  },
  computed: {
    showStyle() {
      return 'width: '+ (this.width ? this.width+'px;' : '200px;')
    }
  },
  data() {
    return {
      objectDefine: {
        fields: []
      },
      val: null,
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      if (this.objectCode) {
        this.objectDefine = await this.$store.dispatch('lowCode/getObjectDefineByCode', this.objectCode)
      }
    },
    handleChange(nval, oval) {
      this.val = nval
      this.$emit('input', nval)
      this.$emit('change', nval, oval)

      if (nval) {
        this.$emit('selectField', this.objectDefine.fields.filter(a => a.fieldCode == nval)[0])
      }
    },
  }
}

</script>
