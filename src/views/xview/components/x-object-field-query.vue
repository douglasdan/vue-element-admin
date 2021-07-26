<template>
  <div style="line-height: 32px; display: inline-block; width: 200px;">

    <mdm-select v-if="ready() && fieldDefine.valueRefType == '1'" v-model="val" :code="'bool'" @change="handleChange" />

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
  name: 'x-object-field-query',
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    cond: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fieldDefine: Object,
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      val: '',
      vals: [],

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
    'val': {
      handler(nval, oval) {
        if (this.$props.cond) {
          this.$props.cond.values.splice(0, this.$props.cond.values.length)
          if (nval) {
            this.cond.values.push(nval)
          }

          console.log(this.val+" "+this.vals)
        }
      },
      deep: true,
      immediate: true
    },
    'vals': {
      handler(nval, oval) {

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

    handleObjectRelation(dd) {
      console.log('field-control handleObjectRelation', JSON.stringify(dd.rows))
      this.vals = dd.rows.map( a => a[this.fieldDefine.refFieldCode])

      if (this.vals.length > 0) {
        this.selectDataRowDialogVisible = false
      }

      if (this.$props.cond.op == 'eq' && this.vals.length > 0) {
        this.val = this.vals[0]
        this.$props.cond.values = [].concat(this.vals)
      }
    }

  }
}

</script>
