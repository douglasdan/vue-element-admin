<template>
  <section>
    <div style="width: 100%; padding-left: 10px; padding-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right; font-size: 14px;">
      应用：<app-select v-model="queryForm.appId" @change="handleAppChange()" />
      对象来源：<mdm-select v-model="queryForm.objectSource" :code="'objectDefineSource'" @change="handleAppChange()"/>
      <div style="display: inline-block; float: right;">
        <el-button type="primary" @click="handleAdd">新增对象</el-button>
      </div>
    </div>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="appId" label="应用" :formatter="formatter" width="160px" />
      <el-table-column prop="objectSource" label="对象定义来源" :formatter="formatter" />
      <el-table-column prop="objectName" label="对象名称" :formatter="formatter" width="200px" />
      <el-table-column prop="objectType" label="对象类型" :formatter="formatter" />
      <el-table-column prop="objectCode" label="对象编码" :formatter="formatter" />
      <!--
      <el-table-column prop="labelFieldCode" label="名称字段" :formatter="formatter" />
      <el-table-column prop="idField" label="ID字段" :formatter="formatter" />
      <el-table-column prop="idFieldType" label="ID字段类型" :formatter="formatter" />
      -->
      <el-table-column prop="objectIcon" label="图标" :formatter="formatter" />
      <el-table-column prop="version" label="当前版本" :formatter="formatter" />
      <el-table-column prop="deployVersion" label="已发布版本" :formatter="formatter" />
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
            type="primary"
            @click="createObjectDefaultViews(scope.$index, scope.row)"
          >创建默认视图</el-button>
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
      <object-editor ref="objectEditor" :obj="editForm" />
    </el-dialog>

  </section>
</template>

<script>

import store from '@/store'
import { mapState } from 'vuex'
import { selectObjectDefinePage, saveObjectDefine, deleteObjectDefine } from '@/api/object-define'
import { selectViewDefinePage, saveViewDefine } from '@/api/view-define'
import { selectAppPage } from '@/api/app'
import AppSelect from '../AppMgr/AppSelect'
import ObjectEditor from './ObjectEditor'

import objectListTemplate from '@/views/xview/template/object-list-template'
import objectEditTemplate from '@/views/xview/template/object-edit-template'
import objectViewTemplate from '@/views/xview/template/object-view-template'

const DefaultObject = {
  id: null,
  objectSource: '9'
}

export default {
  name: 'OrgList',
  components: {
    AppSelect,
    ObjectEditor
  },
  data() {
    return {
      metadata: {
        apps: []
      },
      queryForm: {
        appId: '',
        objectSource: '',
      },
      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editForm: JSON.parse(JSON.stringify(DefaultObject))
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    }),
    tableHeight() {
      const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
      return h
    },
    shouldDisableInput() {
      console.log('shouldDisableInput', typeof (this.editForm.editable))
      return !this.editForm.editable
    }
  },
  created() {
    this.loadMetaData()
  },
  mounted() {
    this.loadData()
  },
  methods: {
    formatter(row, column, cellValue, index) {
      if (column.property === 'appId') {
        let name = ''
        this.metadata.apps.forEach((item) => {
          if (item.id === cellValue) {
            name = item.appName
          }
        })
        return name
      }
      if (column.property === 'objectType') {
        if (cellValue === '1') {
          return '普通对象'
        } else if (cellValue === '2') {
          return '子对象'
        }
      }
      if (column.property === 'idFieldType' && this.mdm['fieldType']) {
        let name = ''
        JSON.parse(this.mdm['fieldType'].json).forEach((item) => {
          if (item.value === cellValue) {
            name = item.label
          }
        })
        return name
      }
      if (column.property === 'objectSource' && this.mdm['objectDefineSource']) {
        let name = ''
        JSON.parse(this.mdm['objectDefineSource'].json).forEach((item) => {
          if (item.value === cellValue) {
            name = item.label
          }
        })
        return name
      }
      return cellValue
    },
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    loadMetaData() {
      this.$store.dispatch('mdm/getMdmData', '')
      selectAppPage({}).then(ret => {
        this.metadata.apps = ret.data.rows
        this.rows = [].concat(this.rows)
      })
    },
    loadData() {
      const queryObj = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        conditions: []
      }

      if (this.queryForm.appId) {
        queryObj.conditions.push({ field: 'app_id', op: 'eq', values: [this.queryForm.appId] })
      }
      if (this.queryForm.objectSource) {
        queryObj.conditions.push({ field: 'object_source', op: 'eq', values: [this.queryForm.objectSource] })
      }

      selectObjectDefinePage(queryObj).then(ret => {
        if (ret.success) {
          this.rows = ret.data.rows
          this.total = ret.data.total
        }
      })
    },
    handleAppChange(val) {
      this.loadData()
    },
    handleClose() {
      this.editDialogVisible = false
    },
    cancelEdit() {
      this.editForm = {}
      this.editDialogVisible = false
    },
    handleEdit(i, row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    async createObjectDefaultViews(i, row) {

      if (row.id) {

        let editViewId = await this.createDefaultEditView(row)
        let viewId = await this.createDefaultViewView(row)

        if (editViewId && viewId) {
          this.createDefaultListView(row, editViewId, viewId)
        }
      }

    },
    createDefaultEditView(od) {

      return new Promise((resolve, reject) => {

        selectViewDefinePage({
          conditions: [
            {field: 'object_id', op:'eq', values:[''+od.id]},
            {field: 'view_type', op:'eq', values:['object-edit']},
          ]
        }).then(ret => {

          if (ret.success) {

            if (ret.data.rows.length == 0) {
              saveViewDefine({
                viewName: '创建 '+od.objectName,
                viewType: 'object-edit',
                objectId: od.id,
                viewContent: JSON.stringify(objectEditTemplate)
              })
              .then(ret => {
                if (ret.success) {
                  resolve(ret.data.id)
                }
                else {
                  reject(null)
                }
              })
            }
            else {
              resolve(ret.data.rows[0].id)
            }
          } else {
            reject(null)
          }
        })

      })

    },
    createDefaultViewView(od) {

      return new Promise((resolve, reject) => {

        selectViewDefinePage({
          conditions: [
            {field: 'object_id', op:'eq', values:[''+od.id]},
            {field: 'view_type', op:'eq', values:['object-view']},
          ]
        }).then(ret => {

          if (ret.success) {

            if (ret.data.rows.length == 0) {
              saveViewDefine({
                viewName: '查看 '+od.objectName,
                viewType: 'object-view',
                objectId: od.id,
                viewContent: JSON.stringify(objectViewTemplate)
              })
              .then(ret => {
                if (ret.success) {
                  resolve(ret.data.id)
                }
                else {
                  reject(null)
                }
              })
            }
            else {
              resolve(ret.data.rows[0].id)
            }
          } else {
            reject(null)
          }
        })

      })

    },
    createDefaultListView(od, editViewId, viewId) {

      return new Promise((resolve, reject) => {

        selectViewDefinePage({
          conditions: [
            {field: 'object_id', op:'eq', values:[''+od.id]},
            {field: 'view_type', op:'eq', values:['object-list']},
          ]
        }).then(ret => {

          if (ret.success) {

            if (ret.data.rows.length == 0) {

              let viewJson = JSON.parse(JSON.stringify(objectListTemplate))
              viewJson.viewButtons[0].action.viewId = editViewId

              //TODO 设置查看对象跳转的处理

              saveViewDefine({
                viewName: '列表 '+od.objectName,
                viewType: 'object-list',
                objectId: od.id,
                viewContent: JSON.stringify(viewJson)
              })
              .then(ret => {
                if (ret.success) {
                  resolve(ret.data.id)
                }
                else {
                  reject(null)
                }
              })
            }
            else {
              resolve(ret.data.rows[0].id)
            }
          } else {
            reject(null)
          }
        })

      })

    },

    handleAdd() {
      this.editForm = JSON.parse(JSON.stringify(DefaultObject))
      this.editDialogVisible = true
    },
    handleDelete(i, row) {
      deleteObjectDefine(row.id).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    }
  }
}

</script>
