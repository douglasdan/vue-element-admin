<template>
  <section>

    <el-row v-if="viewJson.viewButtons && viewJson.viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
      <div style="right: 10px; float: right; position: absolute;">
        <x-button v-for="(btn, index) in viewJson.viewButtons" :view="btn" :self="self" />
      </div>
    </el-row>

    <el-row v-if="objectData" style="margin-top: 10px; border-top: 1px solid #eee">
      <div class="cond-parent">
        <x-form-item label="任务编码：">
          <x-object-field-control
              v-if="mdmReady"
              v-model="objectData['taskCode']"
              :editing="true"
              :field-define="objectFieldDefineMap['taskCode']"
              @object-relation="handleObjectRelation"
            />
        </x-form-item>
        <x-form-item label="任务名称：">
          <x-object-field-control
              v-if="mdmReady"
              v-model="objectData['taskName']"
              :editing="true"
              :field-define="objectFieldDefineMap['taskName']"
              @object-relation="handleObjectRelation"
            />
        </x-form-item>
        <x-form-item label="发送比例：">
          <el-row>
            <el-input size="small" v-model="objectData['shareRate']" type="number" placeholder=""/>
          </el-row>
        </x-form-item>
        <x-form-item label="承接任务：">
          <x-object-condition :hide-op="true" :cond="extendsFrom" :object-code="'CS_TASK'" v-if="objectDefine"></x-object-condition>
        </x-form-item>
      </div>
    </el-row>

    <el-divider></el-divider>

    <el-row style="margin-top: 10px; margin-bottom: 10px;">
      <el-col :span="8">
        <div style="width: 100%; text-align: center;">
          发送方
        </div>
      </el-col>
      <el-col :span="8">
        <div style="width: 100%; text-align: center;">
          接收方
        </div>
      </el-col>
      <el-col :span="8">
        <div style="width: 100%; text-align: center;">
          动因
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top: 10px; margin-bottom: 10px;">
      <el-col :span="8">
        <div>
          <x-form-item :label="cond.fieldName+'：'" v-for="(cond) in sender">
            <el-row style="width: 360px;">
              <x-object-condition :cond="cond" :object-code="cond.objectCode" v-if="objectDefine"></x-object-condition>
            </el-row>
          </x-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <x-form-item :label="cond.fieldName+'：'" v-for="(cond) in receiver">
          <el-row style="width: 360px;">
            <x-object-condition :cond="cond" :object-code="cond.objectCode" v-if="objectDefine"></x-object-condition>
          </el-row>
        </x-form-item>
        <x-form-item :label="cond.fieldName+'：'" v-for="(cond) in keyAttribute">
          <el-row style="width: 360px;">
            <csReceiverFieldEdit :cond="cond" :object-code="cond.objectCode" v-if="objectDefine"></csReceiverFieldEdit>
          </el-row>
        </x-form-item>
      </el-col>
      <el-col :span="8">
        <x-form-item label="动因：">
          <el-select v-model="objectData['factor']">
            <el-option :label="item.fieldName" :value="item.fieldCode" v-for="(item, i) in forcals"></el-option>
          </el-select>
          <el-sel v-model="objectData['factor']" placeholder="" style="width: 100%;"></el-sel>
        </x-form-item>
      </el-col>
    </el-row>

  </section>
</template>


<script>

import xObjectEditView from '@/views/xview/components/x-object-edit-view'
import { saveObjectData } from '@/api/object-data'

export default {
  name: 'cs-task-create-view',
  extends: xObjectEditView,
  data() {
    return {
      mdmReady: false,
      self: this,
      objectDefine: null,
      objectFieldDefine: [],
      objectFieldDefineMap: {},

      // 对象数据
      objectData: {

      },
      extendsFrom: {
        field: 'extendsFrom', op: 'eq', values: []
      },
      sender: [
        {fieldName:'部门',    objectCode: 'CS_COST_BILL', field: 'departCode', op: 'eq', values: []},
        {
          fieldName:'部门类型', objectCode: 'CS_DEPART',    field: 'departTypeCode',
          op: 'eq', values: [], dataField: 'departTypeCode', refField:'departTypeCode'
        },
        {fieldName:'费用分类', objectCode: 'CS_COST_BILL', field: 'feeCode', op: 'eq', values: []},
        {fieldName:'产品',    objectCode: 'CS_COST_BILL', field: 'prdCode', op: 'eq', values: []},
        {fieldName:'产品类型', objectCode: 'CS_PRODUCT', field: 'prdTypeCode', op: 'eq', values: [], dataField: 'prdCode', refField:'prdCode'},
      ],
      receiver: [
        {fieldName:'部门',    objectCode: 'CS_COST_BILL', field: 'departCode', op: 'eq', values: []},
        {
          fieldName:'部门类型', objectCode: 'CS_DEPART',    field: 'departTypeCode',
          op: 'eq', values: [], dataField: 'departTypeCode', refField:'departTypeCode'
        },
      ],
      keyAttribute: [
        {fieldName:'费用分类', objectCode: 'CS_COST_BILL', field: 'feeCode', op: 'same', values: []},
        {fieldName:'资产',    objectCode: 'CS_COST_BILL', field: 'assetCode', op: 'same', values: []},
        {fieldName:'产品',    objectCode: 'CS_COST_BILL', field: 'prdCode', op: 'same', values: []},
      ],

      //动因字段
      forcals:[]
    }
  },
  created() {
    //处理URL参数
    this.loadForcalData()
  },
  methods: {
    loadForcalData() {
      this.$store.dispatch('lowCode/getObjectDefineByCode', 'CS_DEPART_FORCAL').then(ret => {
        this.forcals = ret.fields.filter(a => this.lowCode.defaultFields.indexOf(a.fieldCode) == -1
          && (a.fieldCode != 'departId')
          && (a.fieldType == 'decimal' || a.fieldType == 'int'))
      })
    },
    saveData() {
      this.objectData['strategyId'] = this.params.strategyId
      this.objectData['extendsFrom'] = JSON.stringify(this.extendsFrom.values)
      this.objectData['sender'] = JSON.stringify(this.sender)
      this.objectData['receiver'] = JSON.stringify(this.receiver)
      this.objectData['keyAttribute'] = JSON.stringify(this.keyAttribute)

      saveObjectData(this.objectId, this.objectData).then(ret => {
        if (ret.success) {
          this.$message.info('操作成功')
          this.cancel()
        }
      })
    },
  }

}

</script>
