<template>
  <section>
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增主数据</el-button>
    </el-row>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="mdmName" label="名称" :formatter="formatter"/>
      <el-table-column prop="mdmType" label="类型" :formatter="formatter"/>
      <el-table-column prop="mdmCode" label="编码" :formatter="formatter"/>
      <el-table-column width="240">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <el-button v-if="!scope.row.editable"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >查看</el-button>
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
        <el-form-item label="类型">
          <el-select v-model="editForm.mdmType" placeholder="" :disabled="shouldDisableInput">
            <el-option :label="item.label" :value="item.value" v-for="(item) in MdmTypeOptions"></el-option>
          </el-select>
        </el-form-item>
        <div></div>
        <el-form-item label="编码">
          <el-input v-model="editForm.mdmCode" placeholder="" :disabled="shouldDisableInput"/>
        </el-form-item>
        <div></div>
        <el-form-item label="内容">
        </el-form-item>
          <mdm-json-editor ref="refJsonEditor" :json="editForm.json" :type.sync="editForm.mdmType" :editable="!shouldDisableInput"
            @change="onJsonChange"
          ></mdm-json-editor>
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
import { getMdmTypeAll, saveMdm, deleteMdm } from '@/api/mdm'
import MdmJsonEditor from './MdmJsonEditor'

const MdmTypeOptions = [
  {label: "布尔", value: "1"},
  {label: "列表", value: "2"},
  {label: "树", value: "3"}
]

const DefaultMdm = {
  id: null,
  mdmName:'',
  mdmType:"1",
  mdmCode:'',
  json: '[]',
  editable: true
}

export default {
  name: 'OrgList',
  components:{
    MdmJsonEditor
  },
  data() {
    return {
      MdmTypeOptions: MdmTypeOptions,

      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editForm: JSON.parse(JSON.stringify(DefaultMdm))
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
      if (column.property === 'mdmType') {
        return MdmTypeOptions.filter(a => a.value === cellValue)[0].label
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
      getMdmTypeAll().then(ret => {
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

    },
    handleDelete(i, row) {
      deleteMdm(row.id).then(ret => {
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
      console.log('RoleList save', this.editForm)

      this.editForm.json = this.$refs.refJsonEditor.getJsonStr()
      saveMdm(this.editForm).then(ret => {
        if (ret.success) {
          this.loadData()
          this.editDialogVisible = false
        }
      })
    },
  }
}

</script>
