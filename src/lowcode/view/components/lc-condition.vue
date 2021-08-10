<template>
  <div style="display: inline-flex;">

    <el-select v-model="cond.op" placeholder="" style="width: 120px;" size="small" v-show="!hideOp">
      <el-option :label="item.label" :value="item.value" v-for="(item,i) in options"></el-option>
    </el-select>

    <div :style="showStyle" v-if="showSelect">
      <lc-object-data-select v-model="cond.values"
        :object-code="refObjectDefine.objectCode"
        :value-field-code="valueFieldCode"
        :mdm-code="mdmCode"
        @change="handleChange">
      </lc-object-data-select>
    </div>

    <div v-else-if="showSingle">

      <el-select v-model="val" placeholder="" :style="showStyle" size="small" v-if="fieldDefine && fieldDefine.valueRefType == '1'">
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>

      <el-input size="small" v-model="val" :style="showStyle"
        :maxlength="fieldDefine.maxLength"
        v-else-if="fieldDefine && fieldDefine.fieldType == 'text'">
      </el-input>

      <el-input-number size="small" v-model="val" :style="showStyle"
        v-else-if="fieldDefine && fieldDefine.fieldType == 'int'">
      </el-input-number>

      <el-input-number size="small" v-model="val" :style="showStyle"
        :precision="fieldDefine.fieldPrecision"
        v-else-if="fieldDefine && fieldDefine.fieldType == 'decimal'">
      </el-input-number>

      <el-date-picker v-model="val" value-format="yyyy-MM-dd" type="date" placeholder=""
        v-else-if="fieldDefine.fieldType == 'date'">
      </el-date-picker>

      <el-date-picker v-model="val" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder=""
        v-else-if="fieldDefine.fieldType == 'datetime'">
      </el-date-picker>

    </div>

    <div v-else-if="showCouple">

    </div>

    <div v-else-if="showMultiple">

    </div>

  </div>
</template>

<script>

export default {
  name: 'lc-condition',
  props: {
    cond: Object,
    objectCode: String,
    hideOp: {
      type: Boolean,
      default: true
    },
    width: [Number, String]
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
    },
  },
  data() {
    return {
      objectDefine: null,
      fieldDefine: null,
      //final ref object
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
          return 'width: '+this.width+'px;'
        }
        else {
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
    },

  },
  created() {
    this.setDefaultOptions()
  },
  methods: {
    setDefaultOptions() {
      this.options = []
      this.options.push({label: '等于',         value: 'eq'})
      this.options.push({label: '不等于',       value: 'ne'})
    },
    handleChange(c) {
      //TODO??
    },
    async loadMetadata() {
      if (this.objectCode && this.cond && this.cond.fieldCode) {

      }
    }
  }
}


</script>
