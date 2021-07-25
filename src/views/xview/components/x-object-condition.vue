<template>
  <div style="display: inline-flex;">
    <el-select v-model="cond.op" placeholder="" style="width: 120px;" size="small" v-show="!hideOp">
      <el-option :label="item.label" :value="item.value" v-for="(item,i) in options"></el-option>
    </el-select>
    <div style="width: 280px;" v-if="showDataSelect">
      <x-object-data-select v-model="cond.values"
        :object-code="refObjectDefine.objectCode"
        v-if="refObjectDefine" @change="handleChange">
      </x-object-data-select>
    </div>
  </div>
</template>

<script>

export default {
  name: 'cs-receiver-field-edit',
  props: {
    cond: Object,
    objectCode: {
      type: String,
      default: 'CS_FORCAL_DATA'
    },
    hideOp: {
      type: Boolean,
      default: false
    },
    selectDataFilter: [
    ],
  },
  data() {
    return {
      objectDefine: null,
      fieldDefine: null,
      refObjectDefine: {},

      options: [
        {label: '空',           value: ''},
        {label: '与发送方一致',   value: 'same'},
        {label: '等于',         value: 'eq'},
        {label: '不等于',       value: 'ne'}
      ]
    }
  },
  watch: {
    'cond': {
      handler(nval, oval) {
        this.loadMetadata()
      },
      immediate: true,
      deep: true
    },
    'objectCode': {
      handler(nval, oval) {
        this.loadMetadata()
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    'showDataSelect': {
      get() {
        return !(this.cond.op == '' || this.cond.op == 'same')
      }
    },
    'isAssistCond': {
      get() {
        return this.objectCode != this.cond.objectCode
      }
    }
  },
  created() {
  },
  methods: {

    setDefaultOptions() {
      this.options = []
      this.options.push({label: '等于',         value: 'eq'})
      this.options.push({label: '不等于',       value: 'ne'})
    },

    loadMetadata() {
      if (!this.cond || !this.objectCode) {
        return
      }

      this.setDefaultOptions()

      if (this.objectCode) {
        this.$store.dispatch('lowCode/getObjectDefineByCode', this.objectCode).then(ret => {
          this.objectDefine = ret
          this.fieldDefine = this.objectDefine.fields.filter(a => a.fieldCode == this.cond.field)[0]

          console.log(this.cond.fieldName, this.cond.objectCode+'.'+this.cond.departTypeCode, this.fieldDefine)
          this.loadRefObjectDefine()
        })
      }
    },
    loadRefObjectDefine() {
      if (this.fieldDefine) {
        this.$store.dispatch('lowCode/getObjectDefine', this.fieldDefine.refTableId).then(ret => {
          this.refObjectDefine = ret

          console.log(this.cond.fieldName, this.cond.objectCode+'.'+this.cond.departTypeCode, ' ref ', this.refObjectDefine)

          if (this.refObjectDefine.treeFlag) {

            this.setDefaultOptions()
            this.options.push({label:'选中末级', value:'leaf'})
            this.options.push({label:'选中下级', value:'children'})
            this.options = [].concat(this.options)
          }
        })
      }
    },

    handleChange(c) {
      this.$emit('change', c)
    }
  }
}


</script>
