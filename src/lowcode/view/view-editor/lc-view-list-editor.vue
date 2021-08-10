<template>

  <el-row>
    <el-col :span="8" style="border-right: 1px solid #eee;">
      <div style="margin-left: 10px;">
        <el-collapse v-model="activeNames">

          <el-collapse-item title="字段显示" name="1">
            <lc-show-fields-editor
              :object-code="objectCode"
              :view-json="viewJson"
            />
          </el-collapse-item>

          <el-collapse-item v-if="viewJson.viewButtons" title="页面功能按钮" name="2" >
            <lc-view-btn-editor :btns="viewJson.viewButtons"></lc-view-btn-editor>
          </el-collapse-item>

          <el-collapse-item v-if="viewJson.rowButtons" title="数据行功能按钮" name="3">
            <lc-view-btn-editor :btns="viewJson.rowButtons"></lc-view-btn-editor>
          </el-collapse-item>

          <el-collapse-item title="查询条件" name="4" >

          </el-collapse-item>

        </el-collapse>
      </div>
    </el-col>

    <el-col :span="16">
      <lc-view :template-code="templateCode" :object-code="objectCode" />
    </el-col>
  </el-row>

</template>

<script>

import { uuid } from 'vue-uuid'
import Sortable from 'sortablejs'

export default {
  name: 'LcViewListEditor',
  props: {
    objectCode: String,
    templateCode: String,
    viewJson: {
      type: Object,
      default: function() {
        return {
          viewButtons: [],
          showFields: [],
          rowButtons: []
        }
      }
    }
  },
  data() {
    return {
      eid: 'e' + uuid.v1(),
      activeNames: '1',
      selectField: null

    }
  },
  mounted() {

  },
  methods: {

  }
}

</script>
