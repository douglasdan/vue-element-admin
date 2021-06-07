<template>
  <section>
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增字段</el-button>
    </el-row>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="fieldName" label="字段名称" :formatter="formatter" />
      <el-table-column prop="fieldType" label="字段类型" :formatter="formatter" />
      <el-table-column prop="fieldCode" label="字段代码" :formatter="formatter" />
      <el-table-column prop="fieldTip" label="提示" :formatter="formatter" />
      <el-table-column prop="fieldDesc" label="描述" :formatter="formatter" />
      <el-table-column prop="fieldUnique" label="是否唯一" :formatter="formatter" />
      <el-table-column prop="fieldLength" label="最大长度" :formatter="formatter" />
      <el-table-column prop="decicmalLength" label="小数位" :formatter="formatter" />
      <el-table-column prop="version" label="版本" :formatter="formatter" />
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

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :inline="true" label-width="120px" style="width: 400px;">
        <el-form-item label="字段名称：">
          <el-input v-model="editForm.fieldName" placeholder="" :disabled="shouldDisableInput" />
        </el-form-item>
        <el-form-item label="字段类型：">
          <mdm-select v-model="editForm.fieldType" :code="'fieldType'" :disabled="shouldDisableInput" />
        </el-form-item>
        <el-form-item label="字段代码：">
          <el-input v-model="editForm.fieldCode" placeholder="" :disabled="shouldDisableInput" />
        </el-form-item>
        <el-form-item label="长度：">
          <el-input v-model="editForm.fieldLength" type="number" placeholder="" :disabled="shouldDisableInput" />
        </el-form-item>
        <el-form-item label="小数位：">
          <el-input v-model="editForm.decicmalLength" type="number" placeholder="" :disabled="shouldDisableInput" />
        </el-form-item>
        <el-form-item label="提示：">
          <el-input v-model="editForm.fieldTip" placeholder="" />
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="editForm.fieldDesc" type="textarea" placeholder="" />
        </el-form-item>
        <el-form-item label="版本：">
          <el-input v-model="editForm.version" placeholder="" :disabled="true" />
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
  oid: null,
  fieldName: '',
  fieldType: '',
  fieldCode: '',
  fieldTip: '',
  fieldDesc: '',
  fieldUnique: false,
  fieldLength: 20,
  decicmalLength: 2,
  mdmDataId: null,
  mdmMultiple: false,
  mdmDdata: '[]',
  logicDelete: false,
  tenantId: null,
  version: null
}

export default {
  name: 'ObjectFieldList',
  components: {
  },
  props: {
    objectId: Number
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
      return !!this.editForm.id
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
      if (column.property === 'fieldType' && this.mdm['fieldType']) {
        let name = ''
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
    loadData() {
      selectObjectFieldDefinePage({
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
      this.editForm = {}
      this.editDialogVisible = false
    },
    handleEdit(i, row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    handleAdd() {
      this.editForm = JSON.parse(JSON.stringify(DefaultField))
      this.editDialogVisible = true
    },
    cancelEdit() {
      this.editDialogVisible = false
    },
    submitEdit() {
      this.editForm.oid = this.$props.objectId
      saveObjectFieldDefine(this.editForm).then(ret => {
        if (ret.success) {
          this.editDialogVisible = false
          this.loadData()
        }
      })
    }
  }
}

</script>
