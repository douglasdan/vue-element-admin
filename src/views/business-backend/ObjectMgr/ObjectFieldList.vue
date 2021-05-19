<template>
  <section>
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增字段</el-button>
    </el-row>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="appId" label="名称" :formatter="formatter"/>
      <el-table-column prop="obiectName" label="对象名称" :formatter="formatter"/>
      <el-table-column prop="objectType" label="对象类型" :formatter="formatter"/>
      <el-table-column prop="objectCode" label="对象编码" :formatter="formatter"/>
      <el-table-column prop="labelFieldCode" label="名称字段" :formatter="formatter"/>
      <el-table-column prop="idField" label="ID字段" :formatter="formatter"/>
      <el-table-column prop="objectIcon" label="图标" :formatter="formatter"/>
      <el-table-column prop="version" label="当前版本" :formatter="formatter"/>
      <el-table-column width="240">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <el-button v-if="scope.row.editable"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button v-if="scope.row.editable"
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

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :inline="true" label-width="120px" style="width: 100%;">
        <el-form-item label="名称">
          <el-input v-model="editForm.mdmName" placeholder="" :disabled="shouldDisableInput"/>
        </el-form-item>
        <div></div>
        <div></div>
        <el-form-item label="编码">
          <el-input v-model="editForm.mdmCode" placeholder="" :disabled="shouldDisableInput"/>
        </el-form-item>
        <div></div>
        <el-form-item label="内容">
        </el-form-item>
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
import { selectObjectFieldDefinePage, saveObjectFieldDefine } from '@/api/object-field-define'

const DefaultField = {
  id: null,
  mdmName:'',
  mdmType:"1",
  mdmCode:'',
  json: '[]',
  editable: true
}

export default {
  name: 'ObjectFieldList',
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
      editForm: JSON.parse(JSON.stringify(DefaultField))
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
  watch: {
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
      selectObjectFieldDefinePage({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }).then(ret => {
        if (ret.success) {
          this.rows = ret.data
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
      Object.assign(this.editForm, DefaultMdm)
      this.editDialogVisible = true
    },
    handleMdmTypeChange() {
      //
    },
    handleDelete(i, row) {
      deleteMdm(row.id).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    },
  }
}

</script>
