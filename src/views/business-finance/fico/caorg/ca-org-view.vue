<template>
  <section>
    <div :style="pageStyle" v-if="viewJson">
      <el-row v-if="viewJson.viewButtons && viewJson.viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="right: 10px; float: right; position: absolute;">
          <x-button v-for="(btn, index) in viewJson.viewButtons" :view="btn" :self="self" v-if="btn.visible"/>
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

    <div style="padding-left: 10px; padding-right: 10px;">
      <el-tabs>
        <el-tab-pane label="责任中心映射" name="1">
          <el-row style="height:400px;">
            <el-tag class="tag-item" closable >
              党办
            </el-tag>
            <el-tag class="tag-item" closable >
              党委宣传部
            </el-tag>
            <div style="display:inline-block; margin-top: 4px; margin-bottom: 4px; margin-right: 10px;">
              <i class="el-icon-plus" style="line-height: 24px; font-weight: 900; cursor:pointer;"></i>
            </div>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

  </section>
</template>

<script>

import xObjectViewView from '@/views/xview/components/x-object-view-view'

export default {
  name: 'ca-org-view',
  extends: xObjectViewView,
  created() {
    this.pageEditing = true
  }
}

</script>
