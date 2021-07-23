<template>
  <div style="display: inline-flex;">
    <el-select v-model="cond.op" placeholder="" style="width: 130px;" size="small">
      <el-option :label="item.label" :value="item.value" v-for="(item,i) in options"></el-option>
    </el-select>
    <div style="width: 240px;" v-if="cond.op == 'eq'">
      <x-object-data-select v-model="cond.values" :object-code="refObjectDefine.objectCode" v-if="refObjectDefine">
      </x-object-data-select>
    </div>
  </div>
</template>

<script>

export default {
  name: 'cs-receiver-field-edit',
  props: {
    cond: Object,
    objectCode: String,
    hideOp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      objectDefine: null,
      fieldDefine: null,
      refObjectDefine: {},

      options: [
        {label: '与发送方一致', value: 'same'},
        {label: '等于', value: 'eq'},
        {label: '空', value: 'nil'}
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
  created() {
    this.loadMetadata()
  },
  methods: {
    loadMetadata() {

      if (this.objectCode) {
        this.$store.dispatch('lowCode/getObjectDefineByCode', this.objectCode).then(ret => {
          this.objectDefine = ret
          this.fieldDefine = this.objectDefine.fields.filter(a => a.fieldCode == this.cond.field)[0]
          this.loadRefObjectDefine()
        })
      }
    },
    loadRefObjectDefine() {
      if (this.fieldDefine) {
        this.$store.dispatch('lowCode/getObjectDefine', this.fieldDefine.refTableId).then(ret => {
          this.refObjectDefine = ret
        })
      }
    }
  }
}


</script>
