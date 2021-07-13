<template>
  <div>
    <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex" v-if="editing">
      <div style="right: 10px; float: right; position: absolute;">
        <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
      </div>
    </el-row>
    <el-table :data="conditions"
        border
        style="width: 100%;"
        highlight-current-row
        >
        <el-table-column type="index" label="序号" />
        <el-table-column prop="field" label="字段" width="180">
          <template scope="scope">
            <div v-if="editing">
              <el-select v-model="scope.row.field" size="small" style="width: 160px;">
                <el-option :label="item.fieldName" :value="item.fieldCode" v-for="(item,i) in CS_BILL_DEFINE.fields"></el-option>
              </el-select>
            </div>
            <div v-else>
              {{ getFieldShowName(scope.row.field) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="field" label="条件" width="180">
          <template scope="scope">
            <div v-if="editing">
              <el-select v-model="scope.row.op" size="small" style="width: 160px;">
                <el-option
                  v-for="item in options"
                  :key="item.opType"
                  :label="item.opName"
                  :value="item.opType"
                />
              </el-select>
            </div>
            <div v-else>
              {{ getOpName(scope.row.op) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="values" label="值" :show-overflow-tooltip="true">
          <template scope="scope">
            <div v-if="editing && scope.row.field">
              <x-object-field-control :editing="editing"
                v-model="scope.row.value"
                :field-define="getFieldDefine(scope.row.field)"></x-object-field-control>
            </div>
            <div v-else>
              {{ showValues(scope.row) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operate" width="160" v-if="editing">
          <template slot="header">
            <span>操作</span>
          </template>
          <template scope="scope">
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, scope.$index)"
          >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>

import { selectObjectFieldDefinePage } from '@/api/object-field-define'

export default {
  name: 'cs-share-input-bill-filter',
  props: {
    objectData: {
      type: Object
    },
    editing: {
      type: Boolean
    }
  },
  watch: {
    'objectData': {
      handler(nval, oval) {
        if (nval.filterJson && nval.filterJson.indexOf('[') == 0) {
          this.conditions = JSON.parse(nval.filterJson)
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      CS_OBJECT: 'CS_COST_BILL',
      CS_BILL_DEFINE: null,
      conditions: [],

      options: [
        { opType: '', opName: '常量' },       //0
        { opType: 'eq', opName: '等于' },     //1
        { opType: 'ne', opName: '不等于' },   //2
        { opType: 'in', opName: '属于' },     //3
        { opType: 'nin', opName: '不属于' },  //4
        { opType: 'like', opName: '模糊' },   //5
        { opType: 'ge', opName: '大于等于' },  //6
        { opType: 'gt', opName: '大于' },     //7
        { opType: 'le', opName: '小于' },     //8
        { opType: 'lt', opName: '小于等于' },  //9
        { opType: 'between', opName: '范围' } //10
      ],
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      //CS_COST_BILL 获取所有字段
      this.$store.dispatch('lowCode/getObjectDefineByCode', this.CS_OBJECT).then(ret => {
        if (ret) {
          this.CS_BILL_DEFINE = ret
        }
      })
    },
    handleAdd() {
      this.conditions.push({field:'id', op:'eq', value:'', values:[]})
      this.$set(this.objectData, 'filterJson', JSON.stringify(this.conditions))
    },
    handleDelete(row, i) {
      this.conditions.splice(i, 1)
    },
    multipleValue(row) {
      return row.op == 'in' || row.op == 'nin'
    },
    getOpName(op) {
      let temp = this.options.filter(a => a.opType == op)
      if (temp.length > 0) {
        return temp[0].opName
      }
      return ''
    },
    getFieldDefine(field) {
      if (this.CS_BILL_DEFINE) {
        let temp = this.CS_BILL_DEFINE.fields.filter(a => a.fieldCode == field)
        if (temp.length > 0) {
          return temp[0]
        }
      }
      return null
    },
    getFieldShowName(field) {
      let v = this.getFieldDefine(field)
      if (v) {
        return v.fieldName
      }
      return ''
    },
    showValues(row) {
      let fieldDefine = this.getFieldDefine(row.field)
      //获取值？？？
      return ''
    }
  }
}

</script>
