<template>
  <section>
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增角色</el-button>
    </el-row>
    <el-table :data="roles" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleDesc" label="角色描述" />
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
          <el-button
            size="mini"
            type="danger"
            @click="editPerm(scope.$index, scope.row)"
          >分配权限</el-button>
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
          <el-form-item label="角色名称">
            <el-input v-model="editForm.roleName" placeholder="" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true">
          <el-form-item label="角色描述">
            <el-input v-model="editForm.roleDesc" type="textarea" autosize placeholder="" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true">
          <el-form-item label="数据权限范围">
            <mdm-data :value="editForm.dataPermType" :code="'dataPermType'" @change="handleDataPermChange" />
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
import { selectRolePage, saveRole, deleteRole } from '@/api/role'

export default {
  name: 'VoucherList',
  data() {
    return {
      roles: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      }
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
      selectRolePage({
        'pageNo': this.pageNo,
        'pageSize': this.pageSize
      }).then(ret => {
        this.total = ret.data.total
        this.roles = [].concat(ret.data.rows)
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
      this.editForm = {}
      this.editDialogVisible = true
    },
    handleDelete(i, row) {
      deleteRole(row.roleId).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    },
    submitEdit() {
      console.log('RoleList save', this.editForm)
      saveRole(this.editForm).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    },
    editPerm(row) {
      //

    },
    handleDataPermChange() {

    }
  }
}

</script>
