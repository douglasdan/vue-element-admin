<template>
  <section>
    <div  :style="pageStyle">
      <el-row v-if="viewJson.viewButtons && viewJson.viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="right: 10px; float: right; position: absolute;">
          <x-button v-for="(btn, index) in viewJson.viewButtons" :view="btn" :self="self" />
        </div>
      </el-row>

      <el-row style="border-top: 1px solid #eee" v-for="i of showFieldGroups.length" v-if="colspan > 0">
        <el-col :span="colspan" v-for="(item, j) in cols">
          <div class="cond-parent" style="margin: 0px;">
            <div class="cond-child" v-if="showFieldGroups[i-1][j]">
              <div :style="labelStyle">
                {{ showFieldGroups[i-1][j].fieldName }}：
              </div>

              <div :style="'width: '+(viewJson.contentWidth ? viewJson.contentWidth : 200)+'px'">
                <x-object-field-control v-if="mdmReady"
                  @object-relation="handleObjectRelation"
                  v-model="objectData[showFieldGroups[i-1][j].fieldCode]"
                  :editing="editing"
                  :field-define="objectFieldDefineMap[showFieldGroups[i-1][j].fieldCode]">
                </x-object-field-control>
              </div>

            </div>
          </div>
        </el-col>
      </el-row>

      <el-divider></el-divider>

      <el-row style="margin-left: 20px; margin-right: 20px;">
        <div style="margin-bottom: 20px;">分摊任务：</div>
        <x-object-list-view ref="taskRef"
          :max-height="200"
          :object-id="shareTaskObjectId"
          :view-json="shareTaskViewJson"
          v-if="shareTaskViewJson">
        </x-object-list-view>
      </el-row>

      <el-divider></el-divider>
      <el-row style="margin-left: 20px; margin-right: 20px;">
        <div style="margin-bottom: 20px;">影响因素：</div>
      </el-row>

      <el-row style="border-top: 1px solid #eee">

          <div class="cond-parent" style="margin: 0px;">
            <div class="cond-child">
              <div :style="labelStyle">
                费用类型：
              </div>
              <div style="width: 200px;">
                <x-object-field-control v-if="mdmReady"
                  @object-relation="handleObjectRelation2"
                  v-model="fetchConfig.query.DEF1"
                  :editing="editing"
                  :field-define="feeCodeFieldDefine">
                </x-object-field-control>
              </div>
            </div>

            <div class="cond-child">
              <div :style="labelStyle">
                部门编码：
              </div>
              <div style="width: 200px;">
                <x-object-field-control v-if="mdmReady"
                  @object-relation="handleObjectRelation3"
                  v-model="fetchConfig.query.PK_DEPTDOC"
                  :editing="editing"
                  :field-define="deptCodeFieldDefine">
                </x-object-field-control>
              </div>
            </div>

          </div>
      </el-row>

    </div>
  </section>
</template>

<script>

import xObjectViewView from '@/views/xview/components/x-object-view-view'

import { getViewDefineById } from '@/api/view-define.js'
import { saveObjectData, getObjectDataById } from '@/api/object-data'

export default {
  name: 'fc-share-strategy-view',
  extends: xObjectViewView,
  data() {
    return {
      self: this,
      mdmReady: false,
      editing: false,

      objectDefine: null,
      objectFieldDefine: [],
      objectFieldDefineMap: {},

      //对象数据
      objectData: {

      },
      objectDataBak: null,

      colspan: 0,
      showCols: 1,
      cols: [],
      showFieldGroups:[],

      fetchConfig: {
        fields: ['DEF1', 'DEF2', 'PK_DEPTDOC'],
        query: {
          DEF1: '',
          PK_DEPTDOC: ''
        }
      },
      feeCodeFieldDefine: {
        fieldType: 'text',
        valueRefType: '4',
        refTableId: 30,
        refFieldCode: 'fee_code'
      },
      deptCodeFieldDefine: {
        fieldType: 'text',
        valueRefType: '4',
        refTableId: 28,
        refFieldCode: 'csDepartCode'
      },

      shareTaskObjectId: 55,
      shareTaskObjectViewId: 67,
      shareTaskViewJson: null,
      shareTasks:[],
    }
  },

  methods: {
    handleObjectRelation2(dd) {
      this.fetchConfig.query.DEF1 = dd.row['fee_code']
    },
    handleObjectRelation3(dd) {
      this.fetchConfig.query.PK_DEPTDOC = dd.row['csDepartCode']
    },
    loadObjectData() {
      if (this.objectId) {
        if (!this.objectDataId) {
          this.$message.error('未指定数据ID')
        }
        else {
          getObjectDataById(this.objectId, this.objectDataId).then(ret => {
            if ( ret.success && ret.data) {
              this.objectData = ret.data

              if (this.objectData['fetchConfig']) {
                Object.assign(this.fetchConfig, JSON.parse(this.objectData['fetchConfig']))
              }
            }
          })

          getViewDefineById(this.shareTaskObjectViewId).then(ret => {
            this.shareTaskViewJson = JSON.parse(ret.data.viewContent)
            // delete this.shareTaskViewJson.viewButtons[1]
            // delete this.shareTaskViewJson.viewButtons[2]

            this.filterTask()
          })

        }
      }
    },

    filterTask() {
      this.$nextTick(() => {
        //objectData

        this.$refs.taskRef.setDefaultQueryConditions([
          {
            field: 'STRATEGY_ID', op:'eq', values:[this.objectData['id']]
          }
        ])

      })
    },

    saveData() {
      this.objectData['fetchConfig'] = JSON.stringify(this.fetchConfig)

      saveObjectData(this.objectId, this.objectData).then(ret => {
        if (ret.success) {
          this.editing = false
          this.$message.info('操作成功')
        }
      })
    },
  }
}

</script>
