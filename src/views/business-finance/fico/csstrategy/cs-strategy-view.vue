<template>
  <section>
    <div :style="pageStyle">
      <el-row v-if="viewJson.viewButtons && viewJson.viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="right: 10px; float: right; position: absolute;">
          <x-button v-for="(btn, index) in viewJson.viewButtons" :view="btn" :self="self" />
        </div>
      </el-row>

      <el-row v-for="i of showFieldGroups.length" v-if="colspan > 0" style="border-top: 1px solid #eee">
        <el-col v-for="(item, j) in cols" :span="colspan">
          <div class="cond-parent" style="margin: 0px;">
            <div v-if="showFieldGroups[i-1][j]" class="cond-child">
              <div :style="labelStyle">
                {{ showFieldGroups[i-1][j].fieldName }}：
              </div>

              <div :style="'width: '+(viewJson.contentWidth ? viewJson.contentWidth : 200)+'px'">
                <x-object-field-control
                  v-if="mdmReady"
                  v-model="objectData[showFieldGroups[i-1][j].fieldCode]"
                  :editing="pageEditing"
                  :field-define="objectFieldDefineMap[showFieldGroups[i-1][j].fieldCode]"
                  @object-relation="handleObjectRelation"
                />
              </div>

            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- <el-row>
      <div style="margin-left: 10px; width: 120px; text-align: right;font-size: 13px; font-weight: bold; height: 32px; line-height: 32px;">
        发送条件：
      </div>
      <x-form-item :label="cond.fieldName+'：'" v-for="(cond) in ext.sender" v-if="cond.origin == '1'">
        <el-row style="width: 360px;">
          <x-object-condition :cond="cond" :object-code="cond.objectCode"></x-object-condition>
        </el-row>
      </x-form-item>
    </el-row> -->

    <div v-if="shouldShowErView" style="padding-left: 10px; padding-right: 10px;">
      <el-tabs>
        <el-tab-pane v-for="(er, index) in viewJson.ers.filter(a => a.visible)" :label="er.objectName" :name="''+index">
          <show-view :object-id="er.objectId"
            :view-type="'object-list'"
            :params="{strategyId: objectDataId}"
            :page-props="{'editing': pageEditing}"/>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog :visible.sync="ext.executeDialogVisible" title="执行分摊" width="50%" append-to-body>
      <el-form>
        <el-form-item label="会计年度">
          <mdm-select v-model="ext.year" :code="'year'"/>
        </el-form-item>
        <el-form-item label="会计期间">
          <mdm-select v-model="ext.period" :code="'month'"/>
        </el-form-item>
      </el-form>
      <el-row style="margin: 10px; font-size: 14px; height: 32px; text-align: right;">
        <el-button type="primary" size="small" @click="submitExecution">确定</el-button>
      </el-row>
    </el-dialog>

  </section>
</template>

<script>

import xObjectViewView from '@/views/xview/components/x-object-view-view'
import { executeStrategy } from '@/api/fico'
import { selectObjectDataPage } from '@/api/object-data'
import { saveObjectData, getObjectDataById } from '@/api/object-data'

export default {
  name: 'cs-strategy-view',
  extends: xObjectViewView,
  created() {
    this.$set(this.ext, 'executeDialogVisible', false)
    this.$set(this.ext, 'year', ''+(new Date().getYear()+1900))
    this.$set(this.ext, 'period', ''+(new Date().getMonth()+1))

    this.loadDefaultBillSender()
  },
  methods: {
    loadObjectData() {
      if (this.objectId) {
        if (!this.objectDataId) {
          this.$message.error('未指定数据ID')
        } else {
          getObjectDataById(this.objectId, this.objectDataId).then(ret => {
            if (ret.success && ret.data) {
              this.objectData = ret.data

              if (!this.objectData.sender || this.objectData.sender == '' || JSON.parse(this.objectData.sender).length == 0) {
                this.loadDefaultBillSender()
              }
              else {
                this.ext.sender = JSON.parse(this.objectData.sender)
              }
            }
          })
        }
      }
    },

    loadDefaultBillSender() {

      this.$store.dispatch('fico/getSendConditions', 'origin').then(ret => {
        if (ret) {
        }
      })
    },

    saveData() {

      this.objectData.sender = JSON.stringify(this.ext.sender)

      saveObjectData(this.objectId, this.objectData).then(ret => {
        if (ret.success) {
          this.pageEditing = false
          this.$message.info('操作成功')
        }
      })
    },

    showPeriodDialog() {
      this.ext.executeDialogVisible = true
    },
    submitExecution() {
      console.log(JSON.stringify(this.objectData))
      console.log(this.ext.year, this.ext.period)
      executeStrategy(this.objectData.id, this.ext.year, this.ext.period).then(ret => {
        if (ret.success) {
          this.$message.info('成功，请去<分摊计算>查看结果')
        }
      })
    }
  }

}


</script>
