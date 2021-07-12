<template>
  <section>
    <el-table :data="orgs" border style="width: 100%">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="orgName" label="组织名称" />
      <el-table-column prop="orgType" label="组织性质" :formatter="formatter" />
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
            @click="handleAdd(scope.$index, scope.row)"
          >增加下级</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑" :visible="editDialogVisible">
      <el-row>
        <el-form :inline="true">
          <el-form-item label="上级组织">
            <org-tree-select v-model="editForm.supOrgId" @change="handleSupOrgSelect" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true">
          <el-form-item label="组织类型">
            <mdm-data :value="editForm.orgType" :code="'orgType'" @change="handleOrgTypeChange" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true">
          <el-form-item label="组织名称">
            <el-input v-model="editForm.orgName" placeholder="" />
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

export default {
  name: 'OrgList',
  data() {
    return {
      orgs: [],
      editDialogVisible: false,
      editForm: {},
      editSupOrg: null
    }
  },
  watch: {
    '$store.state.corpAdmin.selectOrg': async function() {
      await store.dispatch('mdm/getMdmData', 'orgType')
      console.log('state.corpAdmin.selectOrg changed refresh org list')
      this.orgs = [].concat(await store.dispatch('corpAdmin/getOrgSubTreePlain'))
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
    }
  },
  methods: {
    formatter(row, column, cellValue, index) {
      if (column.property === 'orgType') {
        const options = JSON.parse(this.mdm['orgType'].json)
        return options.filter(a => a.value === cellValue)[0].label
      }
      return cellValue
    },
    cancelEdit() {
      this.editForm = {}
      this.editDialogVisible = false
    },
    handleEdit(i, row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    handleAdd(i, row) {
      Object.assign(this.editForm, { supOrgId: row.orgId })
      this.editDialogVisible = true
    },
    handleDelete(i, row) {
      store.dispatch('corpAdmin/deleteOrgAction', row.orgId).then(ret => {
        if (ret.success) {
          this.editDialogVisible = false
        }
      })
    },
    handleSupOrgSelect(supOrg) {
      this.editSupOrg = supOrg
      this.editForm.supOrgId = supOrg.orgId
    },
    handleOrgTypeChange(val) {
      this.editForm.orgType = val
    },
    submitEdit() {
      console.log('orgList save', this.editForm)

      let dd = JSON.parse(JSON.stringify(this.editForm))
      delete dd['id']
      delete dd['supId']
      delete dd['children']
      delete dd['depth']
      delete dd['virtual']

      store.dispatch('corpAdmin/saveOrUpdateOrgAction', dd).then(ret => {
        if (ret.success) {
          this.editDialogVisible = false
        }
      })
    }
  }
}

</script>
