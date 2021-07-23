<template>
  <section>
    <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
      <div style="right: 10px; float: right; position: absolute;">
        <el-button type="primary" size="small" @click="handleAddTask">新增</el-button>
        <!-- <el-button type="primary" size="small" @click="handleSave">保存</el-button> -->
        <!-- <el-button type="primary" size="small" @click="handleAddSubTask">新增下级</el-button> -->
      </div>
    </el-row>

    <el-row :gutter="20" style="max-height: 600px;">
      <el-col :span="24">
        <x-object-filter
          v-show="queryPanelVisible"
          ref="refObjectFilter"
          :object-id="objectId"
          :view-json="viewJson"
        />

        <el-table
          :data="rows"
          border
          :row-key="(objectDefine && objectDefine.treeFlag ? objectDefine.idFieldCode : 'id')"
          style="width: 100%;"
          highlight-current-row
          lazy
          :load="loadTreeNode"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @selection-change="handleSelectionChange"
          @header-dragend="handleHeaderDragend"
          @row-click="haneldRowClick"
        >

          <el-table-column v-if="objectDefine && objectDefine.treeFlag" :width="checkBoxWidth" />
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" />
          <el-table-column
            v-for="(f, i) in viewJson.showFields"
            :prop="f.fieldCode"
            :label="fieldName(f.fieldCode)"
            :show-overflow-tooltip="showTooltip(f.fieldCode)"
            :width=" !!f.width ? f.width : 100"
            :formatter="formatter"
          >
            <template scope="scope">
              <x-object-field-control
                v-if="mdmReady"
                v-model="scope.row[f.fieldCode]"
                :field-define="objectFieldDefineMap[f.fieldCode]"
              />
            </template>
          </el-table-column>

          <el-table-column
            v-if="!hideRowOpearte"
            prop="operate"
            :width=" (viewJson.operate && viewJson.operate.width) ? viewJson.operate.width : 100"
          >
            <template slot="header">
              <span>操作</span>
            </template>
            <template scope="scope">
              <x-button
                v-for="(btn, index) in viewJson.rowButtons"
                v-if="btn.visible"
                :size="'mini'"
                :view="btn"
                :self="self"
                :row="scope.row"
              />
            </template>
          </el-table-column>
        </el-table>

        <el-row v-if="mode == 'select'" style="margin: 10px; font-size: 14px; height: 32px; text-align: right;">
          <el-button type="primary" size="small" @click="submitSelection">确定</el-button>
        </el-row>
      </el-col>

      <!-- <el-col :span="12">
        <show-view :page-props="{'editing': editing}" v-if="ext.selectTask"
          :object-id="objectId" :view-type="'object-view'" :data-id="ext.selectTask.id" />
      </el-col> -->
    </el-row>

    <el-dialog ref="showViewDialog" :visible.sync="showView.visible" :fullscreen="true" append-to-body v-if="showView.visible">
      <show-view :object-id="objectId" :view-type="'object-edit'" :params="params"/>
    </el-dialog>

  </section>
</template>

<script>

import xObjectListView from '@/views/xview/components/x-object-list-view'

import { getViewByObjectCodeAndType } from '@/api/view-define'
import { deleteObjectData } from '@/api/object-data'

export default {
  name: 'cs-task-list-view',
  extends: xObjectListView,
  created() {
    this.pageSize = 5000
    getViewByObjectCodeAndType('CS_TASK', 'object-list').then(ret => {
      if (ret.data) {
        this.$set(this.ext, 'taskListViewDefine', ret.data)
        this.$set(this.ext, 'taskListViewJson', JSON.parse(ret.data.viewContent))
      }
    })
  },
  methods: {
    haneldRowClick(	row, column, event) {
      this.$set(this.ext, 'selectTask', row)
    },
    handleSave() {

    },
    handleAddTask() {
      this.showView.visible = true
    },
    handleAddSubTask() {

    },
    deleteDataRow(row) {
      deleteObjectData(this.objectDefine.id, row.id).then(ret => {
        if (ret.success) {
          this.loadData()
        }
      })
    }
  }

}


</script>
