<template>
  <div style="display: inline-flex;">

    <el-select v-show="!hideOp" v-model="cond.op" placeholder="" style="width: 120px;" size="small">
      <el-option v-for="(item,i) in options" :label="item.label" :value="item.value" />
    </el-select>

    <div v-if="showSelect" :style="showStyle">
      <lc-object-data-select
        v-model="cond.values"
        :object-code="refObjectDefine.objectCode"
        :value-field-code="valueFieldCode"
        :mdm-code="mdmCode"
        @change="handleChange"
      />
    </div>

    <div v-else-if="showSingle">

      <el-select v-if="fieldDefine && fieldDefine.valueRefType == '1'" v-model="val" placeholder="" :style="showStyle" size="small">
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>

      <el-input
        v-else-if="fieldDefine && fieldDefine.fieldType == 'text'"
        v-model="val"
        size="small"
        :style="showStyle"
        :maxlength="fieldDefine.maxLength"
      />

      <el-input-number
        v-else-if="fieldDefine && fieldDefine.fieldType == 'int'"
        v-model="val"
        size="small"
        :style="showStyle"
      />

      <el-input-number
        v-else-if="fieldDefine && fieldDefine.fieldType == 'decimal'"
        v-model="val"
        size="small"
        :style="showStyle"
        :precision="fieldDefine.fieldPrecision"
      />

      <el-date-picker
        v-else-if="fieldDefine.fieldType == 'date'"
        v-model="val"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder=""
      />

      <el-date-picker
        v-else-if="fieldDefine.fieldType == 'datetime'"
        v-model="val"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder=""
      />

    </div>

    <div v-else-if="showCouple" />

    <div v-else-if="showMultiple" />

  </div>
</template>

<script>

export default {
  name: 'LcCondition',
  props: {
    cond: Object,
    objectCode: String,
    hideOp: {
      type: Boolean,
      default: true
    },
    width: [Number, String]
  },
  data() {
    return {
      objectDefine: null,
      fieldDefine: null,
      // final ref object
      mdmCode: null,
      valueFieldCode: null,
      refObjectDefine: null,
      refObjectField: null,

      val: null,
      options: []
    }
  },
  computed: {
    'showSelect': {
      get() {
        return mdmCode || (refObjectDefine && refObjectField)
      }
    },
    'showStyle': {
      get() {
        if (this.width) {
          return 'width: ' + this.width + 'px;'
        } else {
          return 'width: 200px;'
        }
      }
    },
    'showSingle': {
      get() {
        return ['eq', 'ne', 'ge', 'gt', 'le', 'lt', 'like'].indexOf(cond.op) > -1
      }
    },
    'showCouple': {
      get() {
        return ['between'].indexOf(cond.op) > -1
      }
    },
    'showMultiple': {
      get() {
        return ['in', 'nin'].indexOf(cond.op) > -1
      }
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
    this.setDefaultOptions()
  },
  methods: {
    setDefaultOptions() {
      this.options = []
      this.options.push({ label: '等于', value: 'eq' })
      this.options.push({ label: '不等于', value: 'ne' })
    },
    handleChange(c) {
      // TODO??
    },
    async loadMetadata() {
      if (this.objectCode && this.cond && this.cond.fieldCode) {

      }
    }
  }
}

</script>
