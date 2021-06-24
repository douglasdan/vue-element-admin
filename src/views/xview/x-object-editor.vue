<template>
  <el-dialog :title="title" :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true">
    <div v-show="showFields.length === 0">
      视图未定义编辑字段
    </div>
    <div>
      <x-form-item v-for="(item, i) in showFields" :label="fieldDefine(item).fieldName">
        <mdm-select v-model="values[i]" :code="fieldDefine(item).mdmCode"
          v-if="fieldDefine(item).fieldType =='select' && fieldDefine(item).mdmCode "/>
        <el-input v-model="values[i]" placeholder="" v-else-if="fieldDefine(item).fieldType == 'text'"></el-input>
        <el-input type="number" v-model="values[i]" placeholder="" v-else-if="fieldDefine(item).fieldType == 'decimal'"></el-input>
        <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="values[i]" placeholder="" v-else-if="fieldDefine(item).fieldType == 'date'"></el-date-picker>
        <div v-else></div>
      </x-form-item>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelEdit">取消</el-button>
      <el-button type="primary" @click="submitEdit()">确定</el-button>
    </div>
  </el-dialog>

</template>

<script>

import { getObjectDefineById } from '@/api/object-define'
import { selectObjectFieldDefinePage } from '@/api/object-field-define'

export default {
  name: 'xobject-editor',
  props: {
    objectId: {
      type: Number,
      required: true,
    },
    showFields: {
      type: Array,
      required: true,
    },
    beforeSubmit: {
      type: Function
    },
    objectData: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadObjectDefine()
      },
      deep: true,
      immediate: true
    },
    'showFields': {
      handler(nval, oval) {
        this.values = [].concat([])
        nval.forEach((item, i) => {
          this.values.push(null)
        })

        this.$forceUpdate()
      },
      deep: true,
      immediate: true
    },
    'beforeSubmit': {
      handler(nval, oval) {

      },
      deep: true,
      immediate: true
    },
    'objectData': {
      handler(nval, oval) {
        this.$forceUpdate()
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      values: [],

      viewDefine: {
        bindObjId: null,
        fields: [
          {fieldName: '抬头', fieldCode: 'title', fieldType: 'text'},
          {fieldName: '金额', fieldCode: 'amount', fieldType: 'decimal'},
          {fieldName: '会计年度', fieldCode: 'acYear', fieldType: 'select', mdmCode: 'year'}
        ]
      }
    }
  },
  computed: {
    title() {
      return '编辑'+this.viewDefine.obiectName
    }
  },
  mounted() {
    this.loadObjectDefine()
  },
  methods: {
    fieldDefine(fieldCode) {
      let f = null
      this.viewDefine.fields.forEach((item,i) => {
        if (!f && item.fieldCode === fieldCode) {
          f = item
        }
      })
      if (f) return f
      return {}
    },
    loadObjectDefine() {
      if (this.$props.objectId) {
        getObjectDefineById(this.$props.objectId).then(ret => {
          ret.data.fields = []
          this.viewDefine = ret.data

          this.loadObjectDefineFields()
        })
      }
    },
    loadObjectDefineFields() {
      selectObjectFieldDefinePage({
        conditions:[{ field: 'oid', op: 'eq', values: [this.$props.objectId]}]
      }).then(ret => {
        this.viewDefine.fields = [].concat(ret.data.rows)
      })
    },
    cancelEdit(){
      this.$props.visible = false
    },
    submitEdit(){
      if (this.$props.beforeSubmit) {
        //
        if (!this.$props.beforeSubmit.bind(this).apply()) {
          return
        }
      }
      //

    }
  }
}

</script>
