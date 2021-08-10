<template>
  <div style="display: inline-flex;">

    <el-select v-show="!hideOp" v-model="cond.op" placeholder="" style="width: 80px;margin-right: 10px;" size="small" @change="handleOpChange">
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

      <el-input v-model="val" size="small" :style="showStyle" :maxlength="fieldDefine.maxLength"
        v-else-if="fieldDefine && fieldDefine.fieldType == 'text'"
      />

      <el-input-number v-model="val" size="small" :style="showStyle"
        v-else-if="fieldDefine && fieldDefine.fieldType == 'int'"
      />

      <el-input-number v-model="val" size="small" :style="showStyle" :precision="fieldDefine.fieldPrecision"
        v-else-if="fieldDefine && fieldDefine.fieldType == 'decimal'"
      />

      <el-date-picker v-model="val" type="date" value-format="yyyy-MM-dd"
        v-else-if="fieldDefine.fieldType == 'date'"
      />

      <el-date-picker v-model="val" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
        v-else-if="fieldDefine.fieldType == 'datetime'"
      />

    </div>

    <div v-else-if="showCouple">
      <el-input-number v-if="fieldDefine && fieldDefine.fieldType == 'int'"
        :controls="false" v-model="val1" size="small" :style="showCoupleStyle" />
      <span v-if="fieldDefine && fieldDefine.fieldType == 'int'">-</span>
      <el-input-number v-if="fieldDefine && fieldDefine.fieldType == 'int'"
        :controls="false" v-model="val2" size="small" :style="showCoupleStyle" />

      <el-input-number v-if="fieldDefine && fieldDefine.fieldType == 'decimal'"
        :controls="false" v-model="val1" size="small" :style="showCoupleStyle" :precision="fieldDefine.fieldPrecision"/>
      <span v-if="fieldDefine && fieldDefine.fieldType == 'decimal'">-</span>
      <el-input-number v-if="fieldDefine && fieldDefine.fieldType == 'decimal'"
        :controls="false" v-model="val2" size="small" :style="showCoupleStyle" :precision="fieldDefine.fieldPrecision"/>

      <el-date-picker v-if="fieldDefine && fieldDefine.fieldType == 'date'" :style="showStyle"
        v-model="cond.values"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-date-picker v-if="fieldDefine && fieldDefine.fieldType == 'datetime'" :style="showStyle"
        v-model="cond.values"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

    </div>

    <div v-else-if="showMultiple">
      <!-- 这里一定是引用对象 -->
    </div>

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

      val1: null,
      val2: null,

      options: []
    }
  },
  computed: {
    'showSelect': {
      get() {
        return this.mdmCode || (this.refObjectDefine && this.refObjectField)
      }
    },
    'showCoupleStyle': {
      get() {
        if (this.width) {
          return 'width: ' + (this.width-10)/2 + 'px;'
        } else {
          return 'width: 90px;'
        }
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
        return this.fieldDefine &&['eq', 'ne', 'ge', 'gt', 'le', 'lt', 'like'].indexOf(this.cond.op) > -1
      }
    },
    'showCouple': {
      get() {
        return this.fieldDefine && ['between'].indexOf(this.cond.op) > -1
      }
    },
    'showMultiple': {
      get() {
        return this.fieldDefine && ['in', 'nin'].indexOf(this.cond.op) > -1
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
    },
    'val': {
      handler(nval, oval) {
        this.cond.values = [nval]
      },
      immediate: true,
    },
    'val1': {
      handler(nval, oval) {
        this.cond.values[0] = nval
      },
      immediate: true,
    },
    'val2': {
      handler(nval, oval) {
        this.cond.values[1] = nval
      },
      immediate: true,
    }
  },
  created() {

  },
  methods: {
    smartShowOptions() {
      this.options = []

      if (this.fieldDefine.fieldType == 'text') {
        this.options.push({ label: '=', value: 'eq' })
        this.options.push({ label: '!=', value: 'ne' })
        this.options.push({ label: '模糊', value: 'like' })
      }
      else if (this.fieldDefine.fieldType == 'int' || this.fieldDefine.fieldType == 'decimal') {
        this.options.push({ label: '=', value: 'eq' })
        this.options.push({ label: '!=', value: 'ne' })
        this.options.push({ label: '>=', value: 'ge' })
        this.options.push({ label: '>', value: 'gt' })
        this.options.push({ label: '<=', value: 'le' })
        this.options.push({ label: '<', value: 'lt' })
        this.options.push({ label: '介于', value: 'between' })
      }
      else if (this.fieldDefine.fieldType == 'date' || this.fieldDefine.fieldType == 'datetime') {
        this.options.push({ label: '=', value: 'eq' })
        this.options.push({ label: '!=', value: 'ne' })
        this.options.push({ label: '>=', value: 'ge' })
        this.options.push({ label: '>', value: 'gt' })
        this.options.push({ label: '<=', value: 'le' })
        this.options.push({ label: '<', value: 'lt' })
        this.options.push({ label: '介于', value: 'between' })
      }
      else if (this.fieldDefine.fieldType == 'json') {
        return
      }

      if (this.mdmCode) {
        this.options.push({ label: '属于', value: 'in' })
        this.options.push({ label: '不属于', value: 'nin' })
      }
      else if (this.refObjectDefine && this.refObjectField) {
        this.options.push({ label: '属于', value: 'in' })
        this.options.push({ label: '不属于', value: 'nin' })
      }
    },
    handleChange(c) {
      // TODO??
    },
    handleOpChange() {
      if (this.cond.op == 'between') {
        this.cond.values = ['', '']
      } else {
        this.cond.values = []
      }
    },
    async loadMetadata() {
      if (this.objectCode && this.cond && this.cond.fieldCode) {
        this.objectDefine = await this.$store.dispatch('lowCode/getObjectDefineByCode', this.objectCode)
        this.fieldDefine = this.objectDefine.fields.filter(a => a.fieldCode == this.cond.fieldCode)[0]

        await this.findFinalFieldRef(this.fieldDefine)
        this.smartShowOptions()
      }
    },

    async findFinalFieldRef(fieldDefine) {
      if (fieldDefine.valueRefType == '2') {
        this.mdmCode = fieldDefine.mdmCode
      }
      else if (fieldDefine.valueRefType == '3') {
        this.refObjectDefine = await this.$store.dispatch('lowCode/getObjectDefineByCode', fieldDefine.refObjectCode)
        this.refObjectField = refObj.fields.filter(a => a.fieldCode == this.refObjectDefine.refFieldCode)[0]

        if (this.refObjectField.valueRefType == '2') {
          this.mdmCode = this.refObjectField.mdmCode
        }
        else if (this.refObjectField.valueRefType == '3') {
          await this.findFinalFieldRef(this.refObjectField)
        }
      }
    }

  }
}

</script>
