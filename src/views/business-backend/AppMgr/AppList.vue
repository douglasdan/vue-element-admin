<template>
  <section>
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增应用</el-button>
    </el-row>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="appName" label="名称" :formatter="formatter"/>
      <el-table-column prop="appType" label="类型" :formatter="formatter"/>
      <el-table-column prop="appDesc" label="描述" :formatter="formatter"/>
      <el-table-column width="240">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <el-button v-if="scope.row.appType == '9'"
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

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :inline="true" label-width="120px" style="width: 100%;">
        <el-form-item label="名称">
          <el-input v-model="editForm.appName" placeholder=""/>
        </el-form-item>
        <div></div>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="editForm.appDesc" style="width: 380px;" placeholder=""/>
        </el-form-item>
        <div></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="submitEdit()">确定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>

import store from '@/store'
import { mapState } from 'vuex'
import { getAppById, saveApp, selectAppPage } from '@/api/app'

const DefaultApp = {
  id: null,
  appName:'',
  appType: '9',
  appDesc:'',
}

export default {
  name: 'AppList',
  components:{
  },
  data() {
    return {
      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editForm: {
        id: null,
        appName:'',
        appType: '',
        appDesc:'',
      }
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
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.loadData()
  },
  methods: {
    formatter(row, column, cellValue, index) {
      if (column.property == 'appType') {
        if (cellValue === '0') {
          return '系统'
        }
        if (cellValue === '1') {
          return '标准应用'
        }
        if (cellValue === '9') {
          return '低代码应用'
        }
      }
      return cellValue
    },
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    loadData() {
      selectAppPage({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }).then(ret => {
        if (ret.success) {
          this.total = ret.data.total
          this.rows = ret.data.rows
        }
      })
    },
    handleClose() {
      this.editDialogVisible = false
    },
    cancelEdit() {
      this.editForm = {}
      this.editDialogVisible = false
    },
    handleEdit(i, row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    handleAdd() {
      Object.assign(this.editForm, DefaultApp)
      this.editDialogVisible = true
    },
    submitEdit() {
      console.log('AppList save', this.editForm)

      saveApp(this.editForm).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    },
  }
}

</script>
