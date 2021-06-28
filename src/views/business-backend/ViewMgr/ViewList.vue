<template>
  <section>
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增视图</el-button>
    </el-row>
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

import XViewEditor from '@/views/xview/x-view-editor'

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
    loadData() {
      selectViewDefinePage({
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(ret => {
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
      if (!row.viewContent || row.viewContent == '{}') {
        //

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
