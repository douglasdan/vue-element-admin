<template>
  <el-row style="border-top: 1px solid #eee">
    <div class="cond-parent">
      <div v-for="(cond, i) in viewJson.queryDefine.conditions" class="cond-child" v-if="cond.visible && cond.opType">
        <div :style="labelStyle">
          {{ cond.fieldName }}：
        </div>
        <div style="display: flex-inline; width: 180px;" v-if="showCond(cond)">
          <div v-if="cond.fieldType == 'text'">
            <el-input v-model="queryValues[cond.fieldCode].values" size="small" placeholder="" @change="handleChange"></el-input>
          </div>
          <div v-if="cond.fieldType == 'int'">
            text
          </div>
          <div v-if="cond.fieldType == 'decimal'">
            text
          </div>
          <div v-if="cond.fieldType == 'date'">
            text
          </div>
          <div v-if="cond.fieldType == 'datetime'">
            text
          </div>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>

export default {
  name: 'x-object-filter',
  props: {
    objectId: {
      type: String,
      required: true
    },
    viewJson: {
      type: Object,
    }
  },
  data() {
    let dd = {
      fields: [],
      fieldMap: {},
      queryValues: {

      }
    }
    return dd
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadMetaData()
      },
      deep: true,
      immediate: true
    },
    'viewJson': {
      handler(nval, oval) {
        this.queryValues = {}

        this.$props.viewJson.queryDefine.conditions.forEach((cond) => {

          let values = ''

          if (cond.opType) {
            if (cond.fieldType == 'text') {
              if (cond.opType == 'eq' || cond.opType == 'like') {
                values = ''
              }
            }
            else if (cond.fieldType == 'int') {
              if (cond.opType == 'eq' || cond.opType == 'gt' || cond.opType == 'ge'
                || cond.opType == 'lt' || cond.opType == 'le') {
                  values = ''
              }
              else if (cond.opType == 'between') {
                values = {
                  begin: '',
                  end: ''
                }
              }
            }
            else if (cond.fieldType == 'decimal') {
              if (cond.opType == 'eq' || cond.opType == 'gt' || cond.opType == 'ge'
                || cond.opType == 'lt' || cond.opType == 'le') {
                  values = ''
              }
              else if (cond.opType == 'between') {
                values = {
                  begin: '',
                  end: ''
                }
              }
            }
            else if (cond.fieldType == 'date') {
              if (cond.opType == 'eq') {
                values = ''
              }
              else if (cond.opType == 'between') {
                values = {
                  begin: '',
                  end: ''
                }
              }
            }
            else if (cond.fieldType == 'datetime') {
              if (cond.opType == 'eq') {
                values = ''
              }
              else if (cond.opType == 'between') {
                values = {
                  begin: '',
                  end: ''
                }
              }
            }
          }
          else {
            //目前只会是字符串
            //TODO 后续还要处理多个值，数组的情况
            values = cond.values
          }

          this.$set(this.queryValues, cond.fieldCode, {
            field: cond.fieldCode,
            op: cond.opType,
            values: values
          })
        })

      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.loadMetaData()
    console.log()
  },
  computed: {
    labelStyle: {
      get() {
        let str = 'display: flex-inline; text-align: right; line-height: 30px;'
        if (this.$props.viewJson.queryDefine.labelWidth > 0) {
          str += 'width: '+ this.$props.viewJson.queryDefine.labelWidth +'px;'
        }
        else {
          str += 'width: 120px;'
        }
        return str
      }
    },
  },
  methods: {
    loadMetaData() {
      if(this.$props.objectId) {
        this.$store.dispatch('lowCode/getObjectDefine', this.$props.objectId).then(ret => {
          if (ret) {
            this.fields = ret.fields
            this.fields.forEach((item) => {
              this.fieldMap[item.fieldCode] = item
            })
          }
        })
      }
    },
    showCond(cond) {
      return cond.visible && cond.opType && this.queryValues[cond.fieldCode]
    },
    condLabel(cond) {
      if (cond.fieldType == 'text') {
        //
      }
      else if (cond.fieldType == 'int') {

      }
      else if (cond.fieldType == 'decimal') {

      }
      else if (cond.fieldType == 'date') {

      }
      else if (cond.fieldType == 'datetime') {

      }
    },

    getConditions() {
      let conditions = []

      Object.keys(this.queryValues).forEach((fieldCode) => {

        let cond = this.queryValues[fieldCode]

        if (cond.values) {

          if (cond.values.hasOwnProperty('begin')) {
            conditions.push({
              field: cond.field,
              op: !cond.op ? 'eq' : cond.op,
              values: [cond.values.begin, cond.values.end]
            })
          }
          else {
            conditions.push({
              field: cond.field,
              op: !cond.op ? 'eq' : cond.op,
              values: [cond.values]
            })
          }
        }

      })

      return conditions
    },
    resetValues() {
      Object.keys(this.queryValues).forEach((fieldCode) => {
        let cond = this.queryValues[fieldCode]

        if (cond.values.hasOwnProperty('begin')) {
          cond.values.begin = ''
          cond.values.end = ''
        }
        else {
          cond.values = ''
        }
      })
    },
    handleChange() {
      console.log('queryValues', JSON.stringify(this.queryValues))
    },
  }
}

</script>
