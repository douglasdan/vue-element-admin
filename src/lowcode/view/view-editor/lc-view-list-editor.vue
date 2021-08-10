<template>

  <el-row>
    <el-col :span="8">
      <div style="margin-left: 10px; width: 450px;">
        <el-collapse v-model="activeNames">

          <el-collapse-item title="字段显示" name="1">
            <lc-show-fields-editor style="width: 420px;"
              :object-code="objectCode"
              :view-json="viewJson">
            </lc-show-fields-editor>
          </el-collapse-item>

          <el-collapse-item v-if="viewJson.viewButtons" title="页面功能按钮" name="2">

          </el-collapse-item>

          <el-collapse-item v-if="viewJson.rowButtons" title="数据行功能按钮" name="3">

          </el-collapse-item>

          <el-collapse-item title="查询条件" name="4">

          </el-collapse-item>
        </el-collapse>
      </div>
    </el-col>
    <el-col :span="16">
      <lc-view :template-code="templateCode" :object-code="objectCode"></lc-view>
    </el-col>
  </el-row>

</template>

<script>

import { uuid } from 'vue-uuid'
import Sortable from 'sortablejs'

export default {
  name: 'lc-view-list-editor',
  props: {
    objectCode: String,
    templateCode: String,
    viewJson: {
      type: Object,
      default: function(){
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
      selectField: null,

    }
  },
  mounted() {

  },
  methods: {

  }
}

</script>

<style lang="scss" scoped>
/* .list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  background: #4AB7BD;
}

.list-complete-item.sortable-ghost {
  background: #30B08F;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
} */
</style>
