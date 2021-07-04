<template>
  <section>
    <div style="width: 100%; padding-left: 10px; padding-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right; font-size: 14px;">
      应用：<app-select v-model="queryForm.appId" @change="loadData()" />
      对象：<x-object-select v-model="queryForm.objectId" :app-id="queryForm.appId" @change="loadData()" />
      类型：<el-select v-model="queryForm.viewType" placeholder="请选择" @change="loadData()" >
        <el-option :key="'object-list'" :label="'对象列表'" :value="'object-list'" />
        <el-option :key="'object-edit'" :label="'新建对象'" :value="'object-edit'" />
        <el-option :key="'object-view'" :label="'查看对象'" :value="'object-view'" />
      </el-select>
      <div style="display: inline-block; float: right;">
        <el-button type="primary" @click="handleAdd">新增视图</el-button>
      </div>
    </div>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="viewName" label="名称" :formatter="formatter" />
      <el-table-column width="240">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false" :fullscreen="true">
      <x-view-editor :view-define="editForm" @close="handleViewEditorClose" />
    </el-dialog>

  </section>
</template>

<script>

import store from '@/store'
import { mapState } from 'vuex'
import { selectViewDefinePage, saveViewDefine, deleteViewDefine } from '@/api/view-define'
import { selectAppPage } from '@/api/app'

import XViewEditor from '@/views/xview/x-view-editor'

import { repairObjectListViewJson } from '@/views/xview/template/object-list-template-compatible.js'
import { repairObjectEditViewJson } from '@/views/xview/template/object-edit-template-compatible.js'
import { repairObjectViewJson } from '@/views/xview/template/object-view-template-compatible.js'

const DefaultView = {
  id: null,
  viewName: '',
  viewType: '',
  viewContent: '{}'
}

export default {
  name: 'ViewList',
  components: {
    XViewEditor
  },
  data() {
    return {
      queryForm: {
        appId: '',
        objectId: '',
        viewType: ''
      },
      objectList:[],

      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editForm: JSON.parse(JSON.stringify(DefaultView))
    }
  },
  computed: {
    tableHeight() {
      const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
      return h
    }
  },
  created() {
  },
  mounted() {
    this.loadData()
  },
  methods: {
    formatter(row, column, cellValue, index) {
      return cellValue
    },
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    handleAppChange() {
      let query = {conditions:[]}
      if (this.queryForm.appId) {
        query.conditions.push({ field: 'app_id', op: 'eq', values: [this.queryForm.appId] })
      }
      selectAppPage(query).then(ret => {
        if (ret.success) {
          this.apps = ret.data.rows
        }
      })
    },
    loadData() {

      let query = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        conditions:[]
      }
      if (this.queryForm.objectId) {
        query.conditions.push({ field: 'object_id', op: 'eq', values: [this.queryForm.objectId] })
      }
      if (this.queryForm.viewType) {
        query.conditions.push({ field: 'view_type', op: 'eq', values: [this.queryForm.viewType] })
      }

      selectViewDefinePage(query).then(ret => {
        if (ret.success) {
          this.rows = ret.data.rows
          this.total = ret.data.total
        }
      })
    },
    handleClose() {
      this.editDialogVisible = false
    },
    cancelEdit() {
      this.editForm = JSON.parse(JSON.stringify(DefaultView))
      this.editDialogVisible = false
    },
    handleEdit(i, row) {
      if (row.viewContent) {
        let viewJson = JSON.parse(row.viewContent)
        if (row.viewType == 'object-list') {
          repairObjectListViewJson(viewJson)
          row.viewContent = JSON.stringify(viewJson)
        }
        else if (row.viewType == 'object-edit') {
          repairObjectEditViewJson(viewJson)
          row.viewContent = JSON.stringify(viewJson)
        }
        else if (row.viewType == 'object-view') {
          repairObjectViewJson(viewJson)
          row.viewContent = JSON.stringify(viewJson)
        }
      }

      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    handleAdd() {
      this.editForm = JSON.parse(JSON.stringify(DefaultView))
      this.editDialogVisible = true
    },
    handleDelete(i, row) {
      deleteViewDefine(row.id).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    },
    onJsonChange(str) {
      this.editForm.json = str
    },
    submitEdit() {
      // this.editForm.viewContent = this.$refs.refJsonEditor.getJsonStr()
      saveViewDefine(this.editForm).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    },
    handleViewEditorClose() {
      this.editDialogVisible = false
      this.loadData()
    }
  }
}

</script>
