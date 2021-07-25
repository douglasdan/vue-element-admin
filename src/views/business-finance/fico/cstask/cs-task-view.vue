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
          <x-object-condition :hide-op="true" :cond="extendsFrom" :object-code="'CS_TASK'"
            @change="handleSenderChange"
            v-if="objectDefine"></x-object-condition>
        </x-form-item>
      </div>
    </el-row>

    <el-divider></el-divider>

    <el-row style="margin-top: 10px; margin-bottom: 10px;">
      <el-col :span="extendsFrom.values.length > 0 ? 8 : 24">
        <div style="width: 100%; text-align: center;">
          发送方
        </div>
      </el-col>
      <el-col :span="8" v-if="extendsFrom.values.length > 0">
        <div style="width: 100%; text-align: center;">
          接收方
        </div>
      </el-col>
      <el-col :span="8" v-if="extendsFrom.values.length > 0">
        <div style="width: 100%; text-align: center;">
          动因
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top: 10px; margin-bottom: 10px;">
      <el-col :span="extendsFrom.values.length > 0 ? 8 : 24">
        <div>
          <x-form-item :label="cond.fieldName+'：'" v-for="(cond) in sender">
            <el-row style="width: 360px;">
              <x-object-condition :cond="cond" :object-code="sendBy" v-if="objectDefine"></x-object-condition>
            </el-row>
          </x-form-item>
        </div>
      </el-col>
      <el-col :span="8" v-if="extendsFrom.values.length > 0">
        <x-form-item :label="cond.fieldName+'：'" v-for="(cond) in receiver">
          <el-row style="width: 360px;">
            <csReceiverFieldEdit :cond="cond" :object-code="receiveBy" v-if="objectDefine"></csReceiverFieldEdit>
          </el-row>
        </x-form-item>
      </el-col>
      <el-col :span="8" v-if="extendsFrom.values.length > 0">
        <x-form-item label="动因：">
          <el-select v-model="objectData['factor']">
            <el-option :label="item.factorName" :value="item.factorCode" v-for="(item, i) in fico.factors"></el-option>
          </el-select>
          <!-- <el-input v-model="objectData['factor']" placeholder="" style="width: 100%;"></el-input> -->
        </x-form-item>
      </el-col>
    </el-row>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import { saveObjectData, getObjectDataById } from '@/api/object-data'

import xObjectViewView from '@/views/xview/components/x-object-view-view'
import CsTaskInputFilter from './cs-task-input-filter'

import csReceiverFieldEdit from '@/views/business-finance/fico/cstask/cs-receiver-field-edit'

export default {
  name: 'cs-task-view',
  components: {
    CsTaskInputFilter, csReceiverFieldEdit
  },
  extends: xObjectViewView,
  data() {
    return {
      self: this,
      mdmReady: false,
      pageEditing: false,

      objectDefine: null,
      objectFieldDefine: [],
      objectFieldDefineMap: {},

      // 对象数据
      objectData: {

      },
      objectDataBak: null,

      colspan: 0,
      showCols: 1,
      cols: [],
      showFieldGroups: [],

      //er关系
      erViews: {},

      //extend data
      ext: {

      },
      extendsFrom: {
        field: 'extendsFrom', op: 'eq', values: []
      },
      sender: [
      ],
      receiver: [
      ],
      keyAttribute: [
      ],

      sendBy: '',
      receiveBy: 'CS_FORCAL_DATA',
    }
  },
  computed: {
    ...mapState({
      lowCode: function(state) {
        return state.lowCode
      },
      fico: function(state) {
        return state.fico
      },
    })
  },
  created() {
    this.loadFactors()
  },
  methods: {
    loadFactors() {
      this.$store.dispatch('fico/getFactors')
    },
    autoConfigSenderObject() {
      let condType = this.extendsFrom.values.length == 0 ? 'origin' : 'sender'

      if (condType == 'origin') {
        this.sendBy = 'CS_COST_BILL'
      } else {
        this.sendBy = 'CS_COST_RESULT'
      }
    },
    loadObjectData() {
      if (this.objectId) {
        if (!this.objectDataId) {
          this.$message.error('未指定数据ID')
        } else {
          getObjectDataById(this.objectId, this.objectDataId).then(ret => {
            if (ret.success && ret.data) {
              this.objectData = ret.data


              if (this.objectData.extendsFrom && JSON.parse(this.objectData.extendsFrom).length > 0) {
                this.extendsFrom.values = [].concat(JSON.parse(this.objectData.extendsFrom))
              }

              this.autoConfigSenderObject()

              if(this.objectData['sender'] && JSON.parse(this.objectData['sender']).length > 0) {
                this.sender = JSON.parse(this.objectData['sender'])
              }
              else {
                this.loadSenderCondition()
              }
              if(this.objectData['receiver'] && JSON.parse(this.objectData['receiver']).length > 0) {
                this.receiver = JSON.parse(this.objectData['receiver'])
              }
              else {
                this.loadReceiverCondition()
              }
            }
          })
        }
      }
    },

    handleSenderChange(c) {
      if (c.nval.length == 0 || c.nval.length == 1) {
        this.loadSenderCondition()
      }
    },

    loadSenderCondition() {

      let condType = this.extendsFrom.values.length == 0 ? 'origin' : 'sender'
      this.autoConfigSenderObject()

      this.$store.dispatch('fico/getSendConditions', condType).then(ret => {
        if (ret) {
          this.sender = ret
        }
      })
    },
    loadReceiverCondition() {
      this.$store.dispatch('fico/getSendConditions', 'receiver').then(ret => {
        if (ret) {
          this.receiver = ret
        }
      })
    },

    saveData() {
      this.objectData['extendsFrom'] = JSON.stringify(this.extendsFrom.values)
      this.objectData['sender'] = JSON.stringify(this.sender)
      this.objectData['receiver'] = JSON.stringify(this.receiver)
      this.objectData['keyAttribute'] = JSON.stringify(this.keyAttribute)

      saveObjectData(this.objectId, this.objectData).then(ret => {
        if (ret.success) {
          this.$message.info('操作成功')
        }
      })
    },
  }
}

</script>
