<template>
  <section>
    <div>
      <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="display: flex-inline;">
          <lc-form-item label="应用">
            <lc-app-select v-model="query.appCode"></lc-app-select>
          </lc-form-item>
        </div>
        <div style="right: 10px; float: right; position: absolute;">
          <el-button size="small" type="primary" @click="handleAdd">新建</el-button>
          <el-button size="small" type="primary" @click="loadData">查询</el-button>
        </div>
      </el-row>
    </div>

    <el-table
        :data="rows"
        border
        :row-key="'id'"
        style="width: 100%;"
        highlight-current-row
        :height="tableHeight"
        @selection-change="handleSelectionChange"
      >
      <el-table-column prop="id" label="对象ID"/>
      <el-table-column prop="appCode" label="应用">
        <template scope="scope">
          <lc-app-select :editing="false" v-model="scope.row.appCode"></lc-app-select>
        </template>
      </el-table-column>
      <el-table-column prop="storeSystem" label="存储类型">
        <template scope="scope">
          <lc-mdm-select :editing="false" :mdm-code="LC.storeSystem" v-model="scope.row.storeSystem"></lc-mdm-select>
        </template>
      </el-table-column>
      <el-table-column prop="objectName" label="对象名称"/>
      <el-table-column width="300">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <i class="el-icon-edit btn-icon-primary" @click="handleEdit(scope.row)" />
          <i class="el-icon-delete btn-icon-danger" @click="handleDelete(scope.row)" />
          <i class="el-icon-document-add btn-icon-primary" @click="createObjectDefaultViews(scope.row)" />
          <i class="el-icon-copy-document btn-icon-primary" @click="handleClone(scope.row)" />
        </template>
      </el-table-column>

    </el-table>

    <el-row>
      <div class="block" style="margin: 5px; float: right;">
        <el-pagination
          :current-page.sync="pageNo"
          :page-size="pageSize"
          :page-sizes="[10, 20]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false" :fullscreen="true">
      <lc-object-editor ref="objectEditor" :obj="editForm" />
    </el-dialog>

  </section>
</template>

<script>

import { isRootPageView, isShowInDialog } from '@/utils'
import { selectObjectDefinePage, LowcodeConst } from '@/lowcode/api/lowcode'
import LcObjectEditor from './lc-object-editor'

const DefaultObject = {
  id: null,
  storeSystem: '0',
}

export default {
  name: 'lc-object-list',
  components: {LcObjectEditor},
  data() {
    return {
      LC: LowcodeConst(),
      pageNo:1,
      pageSize: 10,
      total: 0,
      rows: [],
      sels: [],
      query: {
        appCode: ''
      },

      editForm: JSON.parse(JSON.stringify(DefaultObject)),
      editDialogVisible: false,

    }
  },
  computed: {
    tableHeight() {
      let h
      if (isRootPageView(this)) {
        h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight)
      } else {
        h = (window.innerHeight / 2)
      }
      return h + 'px'
    },
  },
  methods: {
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    handleSelectionChange(sels) {
      this.sels = sels
    },
    loadData() {

      selectObjectDefinePage({

      }).then(ret => {
        this.total = ret.data.total
        this.rows = ret.data.rows
      })
    },
    handleAdd() {
      this.editForm = JSON.parse(JSON.stringify(DefaultObject))
      this.editDialogVisible = true
    },
    handleEdit(row) {
      this.editForm = row
      this.editDialogVisible = true
    },
  }
}

</script>
