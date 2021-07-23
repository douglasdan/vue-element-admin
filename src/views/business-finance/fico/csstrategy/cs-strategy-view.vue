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

export default {
  name: 'cs-strategy-view',
  extends: xObjectViewView,
  created() {
    this.$set(this.ext, 'executeDialogVisible', false)
    this.$set(this.ext, 'year', ''+(new Date().getYear()+1900))
    this.$set(this.ext, 'period', ''+(new Date().getMonth()+1))
  },
  methods: {
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
