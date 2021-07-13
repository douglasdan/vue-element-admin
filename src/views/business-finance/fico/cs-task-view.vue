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
    </div>

    <div v-if="shouldShowErView" style="padding-left: 10px; padding-right: 10px;">
      <el-tabs>
        <el-tab-pane :label="er.objectName" :name="''+index" v-for="(er, index) in viewJson.ers.filter(a => a.visible)">
          <show-view :direct-show="{'objectId': er.objectId, viewType:'object-list'}"></show-view>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-divider></el-divider>

    <el-row style="margin-left: 20px; margin-right:20px; margin-top: 10px; font-size: 14px; height: 32px;" type="flex">
      选择待分摊单据：
    </el-row>
    <el-row style="margin-left: 20px; margin-right:20px;">
      <csShareInputBillFilter ref="objectInputFilter" :object-data="objectData" :editing="editing"></csShareInputBillFilter>
    </el-row>
  </section>

</template>

<script>

import { saveObjectData, getObjectDataById } from '@/api/object-data'

import xObjectViewView from '@/views/xview/components/x-object-view-view'
import csShareInputBillFilter from '@/views/business-finance/fico/cs-share-input-bill-filter'

export default {
  name: 'cs-task-view.vue',
  components: {
    csShareInputBillFilter
  },
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

      //
      erViews: {}
    }
  },
  methods: {
    saveData() {
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
