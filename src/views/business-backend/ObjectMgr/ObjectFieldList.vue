<template>
  <section :class="eid">
    <el-row v-if="mode != 'select'" style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增字段</el-button>
    </el-row>
    <el-table ref="table"
      :row-key="'id'"
      :data="showFields" border style="width: 100%;"
      :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column v-if="mode == 'select'" type="selection" width="55" />
      <el-table-column v-if="mode != 'select'" type="index" label="序号" />
      <el-table-column prop="fieldName" label="字段名称" :formatter="formatter" />
      <el-table-column prop="fieldType" label="字段类型" :formatter="formatter" />
      <el-table-column prop="fieldCode" label="字段代码" :formatter="formatter" />
      <el-table-column v-if="mode != 'select'" prop="fieldTip" label="提示" :formatter="formatter" />
      <el-table-column v-if="mode != 'select'" prop="fieldDesc" label="描述" :formatter="formatter" />
      <el-table-column v-if="mode != 'select'" prop="fieldUnique" label="是否唯一" :formatter="formatter" />
      <el-table-column v-if="mode != 'select'" prop="fieldLength" label="最大长度" :formatter="formatter" />
      <el-table-column v-if="mode != 'select'" prop="decicmalLength" label="小数位" :formatter="formatter" />
      <el-table-column v-if="mode != 'select'" prop="version" label="版本" :formatter="formatter" />

      <slot>

      </slot>

      <el-table-column v-if="mode != 'select'" width="240">
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

    <div v-if="mode != 'select'" class="block" style="margin: 5px; float: right;">
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

import { uuid } from 'vue-uuid'
import Sortable from 'sortablejs'

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
    objectId: String,
    height: Number,
    mode: String,
    dragSort: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      eid: 'e' + uuid.v1(),
      showFields:[],
      rows: [],

      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editForm: JSON.parse(JSON.stringify(DefaultField)),

      sels: []
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    }),
    tableHeight() {
      if (this.$props.height > 0) {
        return this.$props.height + 'px'
      } else {
        const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
        return h
      }
    },
    shouldDisableInput() {
      return !!this.editForm.id
    }
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadData()
      },
      deep: true,
      immediate: true
    },
    'mode': {
      handler(nval, oval) {
        if (nval == 'select') {
          this.pageSize = 1000
        } else {
          this.pageSize = 20
        }
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    if (this.$props.dragSort) {
      this.enableRowDrag()
    }
    this.loadData()
  },
  methods: {

    enableRowDrag() {
      const tbody = document.querySelector('.' + this.eid + ' .el-table__body-wrapper table tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.showFields.splice(oldIndex, 1)[0]
          _this.showFields.splice(newIndex, 0, currRow)

          console.log('drag end: '+JSON.stringify(_this.showFields.map(a => a.fieldCode)))

          //实时同步给父组件this.$emit('selection-change', this.sels)

          let selectFieldCodes = _this.sels.map(a => a.fieldCode)
          let newSels = []
          _this.showFields.forEach((row) => {
            if (selectFieldCodes.indexOf(row.fieldCode) > -1) {
              newSels.push(row)
            }
          })

          _this.handleSelectionChange(newSels)
        }
      })
    },

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
        pageSize: this.pageSize,
        conditions: [
          {
            field: 'oid', op: 'eq', values: [this.$props.objectId]
          }
        ]
      }).then(ret => {
        if (ret.success) {
          this.rows = ret.data.rows
          this.showFields = ret.data.rows
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

          this.$store.dispatch('lowCode/updateObjectDefine', this.$props.objectId)
        }
      })
    },

    loaded() {
      return this.rows.length > 0
    },
    handleSelectionChange(sels) {
      // this.sels.splice(0, this.sels.length)
      // this.sels.push(...newSels)
      this.sels = sels
      this.$emit('selection-change', this.sels)
    },
    handleHeaderDragend() {

    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    toggleRowSelection(codes, selected) {

      console.log('toggleRowSelection ', selected, codes.length + '/' + this.rows.length)

      this.clearSelection()
      this.showFields = []

      codes.forEach((code) => {

        this.rows.forEach((row) => {
          if (code == row.fieldCode) {
            this.showFields.push(row)
            console.log('toggleRowSelection show ', row.fieldCode)
          }
        })
      })

      this.rows.forEach((row) => {
        if (codes.indexOf(row.fieldCode) == -1) {
          this.showFields.push(row)
          console.log('toggleRowSelection hide ', row.fieldCode)
        }
      })

      this.$nextTick(() => {
        this.showFields.forEach((row) => {
          if (codes.indexOf(row.fieldCode) > -1) {
            this.$refs.table.toggleRowSelection(row, selected)
          }
        })
      })

    }
  }
}

</script>
