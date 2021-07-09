<template>
  <section>
    <div>
      <el-row v-if="viewButtons && viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="display: flex-inline;" >
          <el-link type="primary" style="line-height: 32px;" @click="toggleQueryPanel" v-show="queryBtnVisible()">筛选</el-link>
        </div>
        <div style="right: 10px; float: right; position: absolute;">
          <x-button v-for="(btn, index) in viewButtons" :view="btn" :self="self" />
        </div>
      </el-row>

      <x-object-filter :object-id="objectId" :viewJson="viewJson"
        ref="refObjectFilter"
        v-show="queryPanelVisible" >
      </x-object-filter>

      <el-table :data="rows"
        border
        :row-key="(objectDefine && objectDefine.treeFlag ? objectDefine.idFieldCode : 'id')"
        style="width: 100%;"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @header-dragend="handleHeaderDragend"
        :height="tableHeight"
        lazy
        :load="loadTreeNode"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >

        <el-table-column width="45" v-if="objectDefine && objectDefine.treeFlag">
        </el-table-column>
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
            <x-object-field-control v-if="mdmReady"
              v-model="scope.row[f.fieldCode]"
              :field-define="objectFieldDefineMap[f.fieldCode]"
              >
            </x-object-field-control>
          </template>
        </el-table-column>

        <el-table-column prop="operate" v-if="!hideRowOpearte"
          :width=" (viewJson.operate && viewJson.operate.width) ? viewJson.operate.width : 100">
          <template slot="header">
            <span>操作</span>
          </template>
          <template scope="scope">
            <x-button :size="'mini'" :view="btn" :self="self" :row="scope.row"
              v-for="(btn, index) in viewJson.rowButtons"
              v-if="btn.visible"/>
            <el-button size="mini" type="primary" @click="beginExecute(scope.row)">执行</el-button>
            <!-- <el-button size="mini" type="primary" @click="viewExecution(scope.row)">执行日志</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <div class="block" style="margin: 5px; float: right;">
          <el-pagination
            :current-page.sync="pageNo"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-row>

      <el-row v-if="mode == 'select'" style="margin: 10px; font-size: 14px; height: 32px; text-align: right;">
        <el-button type="primary" size="small" @click="submitSelection">确定</el-button>
      </el-row>

    </div>

    <el-dialog ref="showViewDialog" :visible.sync="showView.visible" width="80%" append-to-body>
      <show-view :view-define="showView.viewDefine" :data-id="showView.dataId" v-if="showView.visible">
      </show-view>
    </el-dialog>

    <el-dialog :visible.sync="executeDialogVisible" title="执行分摊" width="50%" append-to-body>
      <el-form>
        <el-form-item label="会计年度">
          <mdm-select v-model="executeTaskParams.year" :code="'year'"/>
        </el-form-item>
        <el-form-item label="会计期间">
          <mdm-select v-model="executeTaskParams.month" :code="'month'"/>
        </el-form-item>
      </el-form>
      <el-row style="margin: 10px; font-size: 14px; height: 32px; text-align: right;">
        <el-button type="primary" size="small" @click="submitExecution">确定</el-button>
      </el-row>
    </el-dialog>

  </section>
</template>


<script>

import xObjectListView from '@/views/xview/components/x-object-list-view'

import { executeStrategy } from '@/api/fico'

export default {
  name: 'fc-share-strategy-list',
  extends: xObjectListView,
  data() {
    return {
      self: this,
      mdmReady: false,

      defaultQueryConditions:[],

      objectDefine: null,
      objectFieldDefine: null,
      objectFieldDefineMap: {},

      queryPanelVisible: false,
      query: {
        //
      },
      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      sels: [],

      showView: {
        visible: false,
        viewDefine: null,
        dataId: null,
      },

      treeProps: {
        label: '',
        children: 'children',
        isLeaf: 'leaf'
      },

      executeDialogVisible: false,
      executeTaskParams: {
        year: '',
        month: '',
      },
      selectRow: null
    }
  },
  mounted() {
    if (this.$props.viewJson) {
     this.$set(this.$props.viewJson.operate, 'width', 300)
    }
  },
  methods: {
    beginExecute(row) {
      this.selectRow = row
      this.executeDialogVisible = true
    },
    submitExecution() {

      executeStrategy(this.selectRow.id, this.executeTaskParams.year, this.executeTaskParams.month).then(ret => {
        if (ret.success) {
          //
          this.executeDialogVisible = false
        }
      })

    },
    viewExecution() {
      //

    },

  }
}

</script>
