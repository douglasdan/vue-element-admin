<template>
  <section>
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </el-row>
    <el-table :data="users" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="userAccount" label="账号" />
      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop="userPhone" label="电话" />
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

    <el-dialog title="编辑" :visible.sync="editDialogVisible">
      <el-row>
        <el-form :inline="true">
          <el-form-item label="所属组织">
            <org-tree-select v-model="editForm.orgId" @change="handleOrgSelect" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true">
          <el-form-item label="用户名称">
            <el-input v-model="editForm.userName" placeholder="" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true">
          <el-form-item label="用户账号">
            <el-input v-model="editForm.userAccount" placeholder="" />
          </el-form-item>
        </el-form>
      </el-row>
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
import { selectUserPage, saveUser, deleteUser } from '@/api/user'

export default {
  name: 'OrgList',
  data() {
    return {
      users: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editForm: {}
    }
  },
  watch: {
    '$store.state.corpAdmin.selectOrg': async function() {
      await store.dispatch('mdm/getMdmData', 'orgType')
      console.log('state.corpAdmin.selectOrg changed refresh org list')

      this.loadData()
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    }),
    supOrgEditable() {
      return !!this.editForm.orgId
    },
    tableHeight() {
      const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
      console.log(h)
      return h
    }
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
      selectUserPage({
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        conditions: [
          { field: 'under_org_id', values: [this.$store.state.corpAdmin.selectOrg.orgId], op: 'eq' }
        ]
      }).then(ret => {
        this.total = ret.data.total
        this.users = [].concat(ret.data.rows)
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
      Object.assign(this.editForm, row)
      this.editDialogVisible = true
    },
    handleAdd() {
      Object.assign(this.editForm, {})
      this.editDialogVisible = true
    },
    handleDelete(i, row) {
      deleteUser()
    },
    handleOrgSelect(org) {
      this.editForm.orgId = org.orgId
    },
    submitEdit() {
      console.log('orgList save', JSON.stringify(this.editForm))

      saveUser(this.editForm).then(ret => {
        if (ret.success) {
          this.loadData()
        }
      })
    }
  }
}

</script>
