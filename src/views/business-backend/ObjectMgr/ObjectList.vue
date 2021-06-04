<template>
  <section>
    <div style="width: 100%; padding-left: 10px; padding-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right; font-size: 14px;">
      应用：<app-select v-model="queryForm.appId" @change="handleAppChange()"></app-select>
      <div style="display: inline-block; float: right;">
        <el-button type="primary" @click="handleAdd">新增对象</el-button>
      </div>
    </div>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="appId" label="应用" :formatter="formatter" width="160px"/>
      <el-table-column prop="obiectName" label="对象名称" :formatter="formatter" width="200px"/>
      <el-table-column prop="objectType" label="对象类型" :formatter="formatter"/>
      <el-table-column prop="objectCode" label="对象编码" :formatter="formatter"/>
      <el-table-column prop="labelFieldCode" label="名称字段" :formatter="formatter"/>
      <el-table-column prop="idField" label="ID字段" :formatter="formatter"/>
      <el-table-column prop="idFieldType" label="ID字段类型" :formatter="formatter"/>
      <el-table-column prop="objectIcon" label="图标" :formatter="formatter"/>
      <el-table-column prop="version" label="当前版本" :formatter="formatter"/>
      <el-table-column prop="deployVersion" label="已发布版本" :formatter="formatter"/>
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
      <object-editor ref="objectEditor" :obj="editForm"></object-editor>
    </el-dialog>

  </section>
</template>

<script>

import store from '@/store'
import { mapState } from 'vuex'
import { selectObjectDefinePage, saveObjectDefine, deleteObjectDefine } from '@/api/object-define'
import { selectAppPage } from '@/api/app'
import AppSelect from '../AppMgr/AppSelect'
import ObjectEditor from './ObjectEditor'

const DefaultObject = {
  id: null,
}

export default {
  name: 'OrgList',
  components:{
    AppSelect,
    ObjectEditor
  },
  data() {
    return {
      metadata: {
        apps: [],
      },
      queryForm:{
        appId: ''
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
      console.log("shouldDisableInput", typeof(this.editForm.editable))
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
        let name = ""
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
        }else if (cellValue === '2') {
          return '子对象'
        }
      }
      if (column.property === 'idFieldType' && this.mdm['fieldType']) {
        let name = ""
        JSON.parse(this.mdm['fieldType'].json).forEach((item) => {
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
        this.metadata.apps = ret.data.rows;
        this.rows = [].concat(this.rows)
      })
    },
    loadData() {
      let queryObj = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        conditions: []
      }

      if (this.queryForm.appId) {
        queryObj.conditions = [{field:'app_id', op:'eq', values:[this.queryForm.appId]}]
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
    },
  }
}

</script>
