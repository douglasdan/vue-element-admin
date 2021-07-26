<template>

  <el-row style="border-top: 1px solid #eee">
    <div class="cond-parent" style="margin: 0px;">
      <div class="cond-child" v-for="(cond,i) in conditions">
        <div :style="labelStyle">
          {{ cond.fieldName }}：
        </div>

        <div :style="'width: '+(viewJson.contentWidth ? viewJson.contentWidth : 200)+'px'">
          <x-object-field-query
            v-if="mdmReady"
            :cond="cond"
            :editing="true"
            :field-define="fieldMap[cond.field]"
          />
        </div>
      </div>
    </div>
  </el-row>

</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'x-object-filter',
  props: {
    objectId: {
      type: [String, Number],
      required: true
    },
    viewJson: {
      type: Object,
    }
  },
  data() {
    let dd = {
      mdmReady: false,
      fields: [],
      fieldMap: {},
      conditions: []
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
        this.conditions.splice(0, this.conditions.length)

        this.$props.viewJson.queryDefine.conditions.forEach((cond) => {
          if (cond.visible) {
            this.conditions.push({
              fieldName: cond.fieldName,
              field: cond.fieldCode,
              op: cond.opType,
              values: []
            })
          }
        })

        // this.$props.viewJson.queryDefine.conditions.forEach((cond) => {
        //   let values = ''
        //   if (cond.opType) {
        //     if (cond.fieldType == 'text') {
        //       if (cond.opType == 'eq' || cond.opType == 'like') {
        //         values = ''
        //       }
        //     }
        //     else if (cond.fieldType == 'int') {
        //       if (cond.opType == 'eq' || cond.opType == 'gt' || cond.opType == 'ge'
        //         || cond.opType == 'lt' || cond.opType == 'le') {
        //           values = ''
        //       }
        //       else if (cond.opType == 'between') {
        //         values = {
        //           begin: '',
        //           end: ''
        //         }
        //       }
        //     }
        //     else if (cond.fieldType == 'decimal') {
        //       if (cond.opType == 'eq' || cond.opType == 'gt' || cond.opType == 'ge'
        //         || cond.opType == 'lt' || cond.opType == 'le') {
        //           values = ''
        //       }
        //       else if (cond.opType == 'between') {
        //         values = {
        //           begin: '',
        //           end: ''
        //         }
        //       }
        //     }
        //     else if (cond.fieldType == 'date') {
        //       if (cond.opType == 'eq') {
        //         values = ''
        //       }
        //       else if (cond.opType == 'between') {
        //         values = {
        //           begin: '',
        //           end: ''
        //         }
        //       }
        //     }
        //     else if (cond.fieldType == 'datetime') {
        //       if (cond.opType == 'eq') {
        //         values = ''
        //       }
        //       else if (cond.opType == 'between') {
        //         values = {
        //           begin: '',
        //           end: ''
        //         }
        //       }
        //     }
        //   }
        //   else {
        //     //目前只会是字符串
        //     //TODO 后续还要处理多个值，数组的情况
        //     values = cond.values
        //   }
        //   this.$set(this.queryValues, cond.fieldCode, {
        //     field: cond.fieldCode,
        //     op: cond.opType,
        //     values: values
        //   })
        // })

      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    await this.$store.dispatch('mdm/getMdmData', '')
    this.mdmReady = true
  },
  mounted() {
    this.loadMetaData()
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    }),
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
    ready() {
      return Object.keys(this.mdm).length > 0 && this.$props.fieldDefine
    },
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

    //给外部调用，获取查询条件
    getConditions() {
      let temp = JSON.parse(JSON.stringify(this.conditions))
      temp.forEach((item, i) => {
        delete item.fieldName
      })
      return temp
    },

    resetValues() {
      this.conditions.forEach((item,i) => {
        item.values.splice(0, item.values.length)
      })
    },
  }
}

</script>
