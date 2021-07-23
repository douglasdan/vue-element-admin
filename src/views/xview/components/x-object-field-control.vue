<template>
  <div style="line-height: 32px; display: inline-block; width: 200px;">
    <span v-if="ready && !editing">{{ fieldValue() }}</span>

    <mdm-select v-else-if="ready() && fieldDefine.valueRefType == '1'" v-model="val" :code="'bool'" @change="handleChange" />

    <mdm-select v-else-if="ready() && fieldDefine.valueRefType == '2' && fieldDefine.mdmDataCode" v-model="val" :code="fieldDefine.mdmDataCode" @change="handleChange" />

    <mdm-select v-else-if="ready() && fieldDefine.valueRefType == '3' && fieldDefine.mdmDataCode" v-model="val" :code="fieldDefine.mdmDataCode" @change="handleChange" />

    <el-input v-else-if="ready() && fieldDefine.fieldType == 'text'" v-model="val" :type="fieldDefine.fieldLength > 100 ? 'textarea' : 'text'" placeholder="" @focus="handleFocus" @change="handleChange" />

    <el-input v-else-if="ready() && fieldDefine.fieldType == 'int'" v-model="val" type="number" @focus="handleFocus" @change="handleChange" />

    <el-input v-else-if="ready() && fieldDefine.fieldType == 'decimal'" v-model="val" type="number" :precision="fieldDefine.decicmalLength" @focus="handleFocus" @change="handleChange" />

    <el-date-picker v-else-if="ready() && fieldDefine.fieldType == 'date'" v-model="val" type="date" placeholder="选择日期" @focus="handleFocus" @change="handleChange" />

    <el-date-picker v-else-if="ready() && fieldDefine.fieldType == 'datetime'" v-model="val" type="datetime" placeholder="选择日期" @focus="handleFocus" @change="handleChange" />

    <el-link v-if="ready() && multiple" type="primary" @click="handleFocus">选择</el-link>

    <el-dialog
      title="选择"
      :visible.sync="selectDataRowDialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      :destroy-on-close="true"
    >

      <x-object-list-view
        v-if="selectDataRowDialogVisible"
        :object-id="objectId"
        :mode="'select'"
        :view-json="refObjectViewJson"
        @object-relation="handleObjectRelation"
      />

    </el-dialog>

  </div>
</template>

<script>

import { mapState } from 'vuex'
import { selectViewDefinePage } from '@/api/view-define'

export default {
  name: 'XObjectFieldControl',
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
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      val: null,

      objectId: null,
      refObjectViewJson: {},
      selectDataRowDialogVisible: false
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    })
  },
  watch: {
    'value': {
      handler(nval, oval) {
        this.val = nval
      },
      deep: true,
      immediate: true
    }
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
                { field: 'object_id', op: 'eq', values: ['' + this.objectId] },
                { field: 'view_type', op: 'eq', values: ['object-list'] }
              ]
            }).then(ret => {
              if (ret.success) {
                if (ret.data.rows.length > 0) {
                  this.refObjectViewJson = JSON.parse(ret.data.rows[0].viewContent)
                  this.selectDataRowDialogVisible = true
                } else {
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

      const fd = this.$props.fieldDefine
      const cellValue = this.$props.value

      // work around
      if (fd && fd.valueRefType == '1') {
        fd.mdmDataCode = 'bool'
      }

      if (fd && fd.valueRefType && fd.mdmDataCode) {
        if (fd.valueRefType == '1') {
          const dd = JSON.parse(this.mdm[fd.mdmDataCode].json).find(a => a.value == cellValue)
          if (dd) {
            return dd.label
          }
        } else if (fd.valueRefType == '2') {
          const dd = JSON.parse(this.mdm[fd.mdmDataCode].json).find(a => a.value == cellValue)
          if (dd) {
            return dd.label
          }
        } else if (fd.valueRefType == '3') {
          // TODO select
        } else if (fd.valueRefType == '4') {
          // 引用字段，如果是不读的值，则应当创建另外一个字段来保存值

        }
      }

      return cellValue
    },

    handleObjectRelation(dd) {
      console.log('field-control handleObjectRelation', JSON.stringify(dd.rows))
      if (dd.rows.length == 1) {
        this.$emit('input', dd.rows[0][this.fieldDefine.refFieldCode])
      }
      this.$emit('object-relation', dd)
    }

  }
}

</script>
