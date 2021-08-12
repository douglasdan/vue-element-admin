<template>
  <section>
    <div>
      <el-row style="margin: 10px 10px 20px 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="display: flex-inline;">
          <lc-form-item label="字段代码">
            <el-input v-model="query.fieldCode" clearable ></el-input>
          </lc-form-item>
        </div>
        <div style="right: 10px; float: right; position: absolute;">
          <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
          <el-button size="small" type="primary" @click="loadData">查询</el-button>
        </div>
      </el-row>
    </div>

    <el-table ref="table"
      :row-key="'id'"
      :data="rows" border style="width: 100%;"
      :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" />
      <el-table-column prop="fieldName" label="字段名称" width="120"/>
      <el-table-column prop="fieldType" label="字段类型">
        <template scope="scope">
          <lc-mdm-select :editing="false" :mdm-code="LC.fieldType" v-model="scope.row.fieldType"></lc-mdm-select>
        </template>
      </el-table-column>
      <el-table-column prop="fieldCode" label="字段代码"width="180"/>

      <el-table-column prop="valueRefType" label="值类型" width="100">
        <template scope="scope">
          <lc-mdm-select :editing="false" :mdm-code="LC.refType" v-model="scope.row.valueRefType"></lc-mdm-select>
        </template>
      </el-table-column>
      <el-table-column prop="fieldNullable" label="可为空">
        <template scope="scope">
          <lc-bool :editing="false" v-model="scope.row.fieldNullable"></lc-bool>
        </template>
      </el-table-column>
      <el-table-column prop="fieldUnique" label="是否唯一">
        <template scope="scope">
          <lc-bool :editing="false" v-model="scope.row.fieldUnique"></lc-bool>
        </template>
      </el-table-column>
      <el-table-column prop="maxLength" label="最大长度" />
      <el-table-column prop="fieldPrecision" label="小数位"/>

      <el-table-column prop="fieldTip" label="提示" width="120"/>
      <el-table-column prop="fieldDesc" label="描述" width="120"/>

      <el-table-column width="100">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <i class="el-icon-edit btn-icon-primary" @click="handleEdit(scope.row)" v-if="scope.row.editable == '1'"/>
          <i class="el-icon-delete btn-icon-danger" @click="handleDelete(scope.row)" v-if="scope.row.editable == '1'"/>
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

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false" :append-to-body="true">
      <lc-object-field-editor :field-define="editForm"></lc-object-field-editor>
    </el-dialog>

  </section>
</template>

<script>

import { isRootPageView, isShowInDialog } from '@/utils'
import { selectObjectFieldDefinePage, LowcodeConst } from '@/lowcode/api/lowcode'
import lcObjectFieldEditor from './lc-object-field-editor'

const DefaultField = {
  id: null,
}

export default {
  name: 'lc-object-field-list',
  components: {
    lcObjectFieldEditor
  },
  props: {
    objectCode: String,
  },
  data() {
    return {
      LC: LowcodeConst(),
      pageNo:1,
      pageSize: 20,
      total: 0,
      rows: [],
      sels: [],
      query: {
        fieldCode: ''
      },

      editForm: JSON.parse(JSON.stringify(DefaultField)),
      editDialogVisible: false,
    }
  },
  watch: {
    'objectCode': {
      handler(nval, oval) {
        if (nval != oval) {
          this.loadData()
        }
      },
      immediate: true
    },
  },
  computed: {
    tableHeight() {
      let h = (window.innerHeight - 180)
      return h + 'px'
    },
    condLabelWidth() {
      return 120
    },
    condInputWidth() {
      return 200
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

      if (!this.objectCode) {
        return
      }

      let queryObj = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        conditions:[{
          fieldCode: 'object_code',
          op: 'eq',
          values: [this.objectCode]
        }]
      }
      if (this.query.fieldCode) {
        queryObj.conditions.push({
          fieldCode: 'field_code',
          op: 'like',
          values: [this.query.fieldCode]
        })
      }

      selectObjectFieldDefinePage(queryObj).then(ret => {
        this.total = ret.data.total
        this.rows = ret.data.rows
      })
    },
    handleDelete(row) {
      this.$message.error('不支持删除字段')
    },
    handleEdit(row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    handleAdd() {
      this.editForm = JSON.parse(JSON.stringify(DefaultField))
      this.editDialogVisible = true
    },
    cancelEdit() {
      this.editDialogVisible = false
      this.loadData()
    },
  }

}

</script>
