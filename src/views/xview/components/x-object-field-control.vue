<template>
  <div style="line-height: 30px; display: inline-block;">
    <span v-if="ready && !editing">{{ fieldValue() }}</span>

    <mdm-select v-model="val" :code="'bool'" @change="handleChange" v-else-if="ready() && fieldDefine.valueRefType == '1'">
    </mdm-select>

    <mdm-select v-model="val" :code="fieldDefine.mdmDataCode" @change="handleChange" v-else-if="ready() && fieldDefine.valueRefType == '2' && fieldDefine.mdmDataCode">
    </mdm-select>

    <mdm-select v-model="val" :code="fieldDefine.mdmDataCode" @change="handleChange" v-else-if="ready() && fieldDefine.valueRefType == '3' && fieldDefine.mdmDataCode">
    </mdm-select>

    <el-input :type="fieldDefine.fieldLength > 100 ? 'textarea' : 'text'" v-model="val" placeholder="" @focus="handleFocus" @change="handleChange" v-else-if="ready() && fieldDefine.fieldType == 'text'">
    </el-input>

    <el-input type="number" v-model="val" @focus="handleFocus" @change="handleChange" v-else-if="ready() && fieldDefine.fieldType == 'int'">
    </el-input>

    <el-input type="number" v-model="val" :precision="fieldDefine.decicmalLength" @focus="handleFocus" @change="handleChange" v-else-if="ready() && fieldDefine.fieldType == 'decimal'">
    </el-input>

    <el-date-picker v-model="val" type="date" @focus="handleFocus" @change="handleChange" placeholder="选择日期" v-else-if="ready() && fieldDefine.fieldType == 'date'">
    </el-date-picker>

    <el-date-picker v-model="val" type="datetime" @focus="handleFocus" @change="handleChange" placeholder="选择日期" v-else-if="ready() && fieldDefine.fieldType == 'datetime'">
    </el-date-picker>

    <el-dialog title="选择" :visible.sync="selectDataRowDialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      :destroy-on-close="true">

      <x-object-list-view :object-id="objectId"
        :mode="'select'"
        @object-relation="handleObjectRelation"
        :view-json="refObjectViewJson"
        v-if="selectDataRowDialogVisible"/>

    </el-dialog>

  </div>
</template>

<script>

import { mapState } from 'vuex'
import { selectViewDefinePage } from '@/api/view-define'

export default {
  name: 'x-object-field-control',
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fieldDefine: Object,
    value: [String, Number],
  },
  data() {
    return {
      val: null,

      objectId: null,
      refObjectViewJson: {},
      selectDataRowDialogVisible: false,
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      },
    })
  },
  watch: {
    'value': {
      handler(nval, oval) {
        this.val = nval
      },
      deep: true,
      immediate: true
    },
  },
  created() {
    //
  },
  methods: {
    ready() {
      return Object.keys(this.mdm).length > 0 && this.$props.fieldDefine
    },

    handleFocus() {

      if (this.fieldDefine.valueRefType == '4' && this.fieldDefine.refTableId && this.fieldDefine.refFieldCode) {

        this.$store.dispatch('lowCode/getObjectDefine', this.fieldDefine.refTableId).then(ret => {
          if (ret) {
            this.objectId = this.fieldDefine.refTableId

            selectViewDefinePage({
              conditions: [
                {field: 'object_id', op:'eq', values:[''+this.objectId]},
                {field: 'view_type', op:'eq', values:['object-list']},
              ]
            }).then(ret => {

              if (ret.success) {

                if (ret.data.rows.length > 0) {
                  this.refObjectViewJson = JSON.parse(ret.data.rows[0].viewContent)
                  this.selectDataRowDialogVisible = true
                }
                else {
                  this.$message.error('未定义应用对象视图')
                }
              }
            })


          }
        })

      }
    },

    handleChange(nval) {
      this.$emit('input', nval)
    },

    closeDialog() {
      this.selectDataRowDialogVisible = false
    },

    fieldValue() {

      if (!this.ready()) {
        return ''
      }

      let fd = this.$props.fieldDefine
      let cellValue = this.$props.value

      //work around
      if (fd && fd.valueRefType == '1') {
        fd.mdmDataCode = 'bool'
      }

      if (fd && fd.valueRefType && fd.mdmDataCode) {
        if (fd.valueRefType == '1') {
          debugger
          let dd = JSON.parse(this.mdm[fd.mdmDataCode].json).find(a => a.value == cellValue)
          if (dd) {
            return dd.label
          }
        }
        else if (fd.valueRefType == '2') {
          let dd = JSON.parse(this.mdm[fd.mdmDataCode].json).find(a => a.value == cellValue)
          if (dd) {
            return dd.label
          }
        }
        else if (fd.valueRefType == '3') {
          //TODO select
        }
        else if (fd.valueRefType == '4') {
          // 引用字段，如果是不读的值，则应当创建另外一个字段来保存值

        }
      }

      return cellValue
    },

    handleObjectRelation(dd) {
      console.log('handleObjectRelation', JSON.stringify(dd))
      this.$emit('object-relation', dd)
    },

  }
}

</script>
