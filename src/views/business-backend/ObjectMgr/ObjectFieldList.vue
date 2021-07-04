<template>
  <section :class="eid">
    <el-row v-if="mode != 'edit-view'" style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增字段</el-button>
    </el-row>
    <el-table ref="table"
      :row-key="'id'"
      :data="rows" border style="width: 100%;"
      :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column v-if="!forViewEdit" type="selection" width="55" />
      <el-table-column v-if="!forViewEdit" type="index" label="序号" />
      <el-table-column prop="fieldName" label="字段名称" :formatter="formatter" width="200"/>
      <el-table-column prop="fieldType" label="字段类型" :formatter="formatter" />
      <el-table-column prop="fieldCode" label="字段代码" :formatter="formatter" width="200"/>
      <el-table-column prop="visible" label="是否显示" v-if="forViewEdit" width="160">
        <template scope="scope">
          <el-switch v-model="scope.row.visible"
            active-color="#13ce66" inactive-color="#ff4949"
            @change="handleChange"
            style="margin-top: 5px;">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column v-if="!forViewEdit" prop="valueRefType" label="值类型" :formatter="formatter" width="160"/>

      <el-table-column v-if="!forViewEdit" prop="fieldTip" label="提示" :formatter="formatter" width="160"/>
      <el-table-column v-if="!forViewEdit" prop="fieldDesc" label="描述" :formatter="formatter" width="200"/>

      <el-table-column v-if="!forViewEdit" prop="fieldNullable"     label="可为空" :formatter="formatter" />
      <el-table-column v-if="!forViewEdit" prop="fieldAutoGenerate" label="自动自增" :formatter="formatter" />
      <el-table-column v-if="!forViewEdit" prop="fieldUnique" label="是否唯一" :formatter="formatter" />
      <el-table-column v-if="!forViewEdit" prop="fieldLength" label="最大长度" :formatter="formatter" />
      <el-table-column v-if="!forViewEdit" prop="decicmalLength" label="小数位" :formatter="formatter"/>
      <el-table-column v-if="!forViewEdit" prop="version" label="版本" :formatter="formatter" />

      <el-table-column v-if="mode != 'edit-view'" width="240">
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

    <div v-if="mode != 'edit-view'" class="block" style="margin: 5px; float: right;">
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
      <el-form :inline="true" label-width="160px">
        <el-form-item label="字段名称：">
          <el-input v-model="editForm.fieldName" placeholder="" :disabled="shouldDisableInput" />
        </el-form-item>
        <el-form-item label="字段类型：">
          <mdm-select v-model="editForm.fieldType" :code="'fieldType'" :disabled="shouldDisableInput" @change="handleFieldTypeChange"/>
        </el-form-item>
        <el-form-item label="字段代码：">
          <el-input v-model="editForm.fieldCode" placeholder="" :disabled="shouldDisableInput" />
        </el-form-item>

        <el-form-item label="可为空：">
          <el-select v-model="editForm.fieldNullable" placeholder="">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否唯一：">
          <el-select v-model="editForm.fieldUnique" placeholder="">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="自动自增：" v-if="editForm.fieldType == 'int'">
          <el-select v-model="editForm.fieldAutoGenerate" placeholder="">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>

        <el-divider></el-divider>

        <el-form-item label="值定义：">
          <mdm-select v-model="editForm.valueRefType" :code="'valueRefType'" @change="handleValueRefTypeChange"/>
        </el-form-item>

        <el-form-item label="引用主数据："  v-if="editForm.valueRefType == '2' || editForm.valueRefType == '3'">
          <el-link @click="showMdmDialog">{{ selectMdmName }}</el-link>
        </el-form-item>

        <el-divider></el-divider>

        <el-form-item label="长度：">
          <el-input v-model="editForm.fieldLength" type="number" placeholder=""
            :disabled="shouldDisableInput" />
        </el-form-item>
        <el-form-item label="小数位：" v-show="editForm.fieldType == 'decimal'">
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

    <el-dialog title="选择" :visible.sync="selectMdmDialogVisible" :close-on-click-modal="false" :append-to-body="true" :destroy-on-close="true">
      <mdm-list :mode="'select'" :mdm-type="editForm.valueRefType" @select="handleMdmSelect">
      </mdm-list>
    </el-dialog>

    <el-dialog title="选择" :visible.sync="selectObjectFieldDialogVisible" :close-on-click-modal="false" :append-to-body="true" :destroy-on-close="true">

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
  fieldAutoGenerate: false,
  fieldNullable: true,
  fieldUnique: false,
  fieldLength: 20,
  decicmalLength: 2,
  valueRefType: '',
  mdmDataId: '',
  mdmMultiple: false,   //多值，存储不好处理，暂时不支持
  mdmDdata: '[]',         //编辑修改原Mdm的值，暂不支持
  refTableCode: '',
  refFieldCode: '',
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
    },

    viewJson: {
      type: Object,
      required: false
    }

  },
  data() {
    return {
      eid: 'e' + uuid.v1(),
      rows: [],

      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      editDialogVisible: false,
      editForm: JSON.parse(JSON.stringify(DefaultField)),

      sels: [],

      selectMdmDialogVisible: false,
      selectMdmName: '',

      selectObjectFieldDialogVisible: false,
      selectObjectName: '',
      selectFieldName: '',
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      },
      mdmList: function(state) {
        return state.mdm.rows
      },
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
    },
    forViewEdit() {
      return this.$props.mode == 'edit-view'
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
        if (nval == 'edit-view') {
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
    this.$store.dispatch('mdm/getMdmData', '')
  },
  mounted() {
    if (this.$props.dragSort) {
      this.enableRowDrag()
    }
  },
  methods: {

    enableRowDrag() {
      const tbody = document.querySelector('.' + this.eid + ' .el-table__body-wrapper table tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.rows.splice(oldIndex, 1)[0]
          _this.rows.splice(newIndex, 0, currRow)

          console.log('drag end: '+JSON.stringify(_this.rows.map(a => a.fieldCode)))

          //实时同步给父组件this.$emit('selection-change', this.sels)
          // _this.handleSelectionChange(newSels)

          _this.handleChange()
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
      else if (column.property === 'fieldUnique') {
        return ''+cellValue
      }
      else if (column.property == 'valueRefType') {
        if (cellValue) {
          let text = ''
          let dd = JSON.parse(this.mdm['valueRefType'].json).find(a => a.value == cellValue)
          if (dd) {
            if (dd.value == '1') {
              text += dd.label
            }
            else if (dd.value == '2' || dd.value == '3') {
              text += dd.label
              if (row.mdmDataId) {
                let refMdm = this.mdmList.find(a => a.id == row.mdmDataId)
                if (refMdm) {
                  text += " "+refMdm.mdmName
                }
              }
            }
          }
          return text
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

          this.showFields = ret.data.rows
          this.total = ret.data.total

          if (this.forViewEdit) {
            ret.data.rows.forEach((item, i) => {
              item.visible = false
              item.width = 100
              item.sortNo = i
            })

            this.rows = ret.data.rows
            this.syncViewJsonFields()
          }
          else {
            this.rows = ret.data.rows
          }
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

    handleValueRefTypeChange() {
      if (this.editForm.valueRefType == '2' || this.editForm.valueRefType == '3') {
        console.log(this.mdmList)

        let selectMdm = this.mdmList.some(a => a.id == this.editForm.mdmDataId)
        if (selectMdm) {
          this.selectMdmName = selectMdm.mdmName
        }
        else {
          this.selectMdmName = "选择"
        }
      }
    },

    handleEdit(i, row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleValueRefTypeChange()
      this.editDialogVisible = true
    },
    handleAdd() {
      this.editForm = JSON.parse(JSON.stringify(DefaultField))
      this.editDialogVisible = true
    },
    cancelEdit() {
      this.editDialogVisible = false
    },
    handleFieldTypeChange() {

      if (this.editForm.fieldType == 'text') {
        this.editForm.fieldLength = 40
        this.editForm.decicmalLength = 0
      }
      else if (this.editForm.fieldType == 'int') {
        this.editForm.fieldLength = 20
        this.editForm.decicmalLength = 0
      }
      else if (this.editForm.fieldType == 'decimal') {
        this.editForm.fieldLength = 20
        this.editForm.decicmalLength = 2
      }

      if (this.editForm.fieldType != 'int') {
        this.editForm.fieldAutoGenerate = false
      }
    },

    submitEdit() {
      this.editForm.oid = this.$props.objectId

      delete this.editForm.visible
      delete this.editForm.width
      delete this.editForm.sortNo

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
      this.sels = sels
      this.$emit('selection-change', this.sels)
    },
    handleHeaderDragend() {

    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },

    //发生变化时，触发viewJson
    handleChange() {
      let temp = []
      this.rows.forEach((item,i ) => {
        item.sortNo = i
        if (item.visible) {
          temp.push(item)
        }
      })

      this.$props.viewJson.showFields.splice(0, this.$props.viewJson.showFields.length, ...temp)
    },

    syncViewJsonFields() {

      if (this.forViewEdit && this.$props.viewJson.showFields.length > 0 && this.rows.length > 0) {

        let fieldMap = {}
        this.rows.forEach((item) => {
          fieldMap[item.fieldCode] = item
        })

        let temp = []
        let tempMap = {}
        this.$props.viewJson.showFields.forEach((item, i) => {
          try {
            fieldMap[item.fieldCode].sortNo = i
            fieldMap[item.fieldCode].width = item.width
            fieldMap[item.fieldCode].visible = item.visible

            temp.push(fieldMap[item.fieldCode])
            tempMap[item.fieldCode] = fieldMap[item.fieldCode]
          }
          catch(e) {
            console.error(item.fieldCode, e)
          }
        })

        this.rows.forEach((item, i) => {
          if (!tempMap[item.fieldCode]) {
            item.visible = false
            item.sortNo = temp.length
            temp.push(item)
          }
        })
      }

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

    },

    showMdmDialog() {
      this.selectMdmDialogVisible = true
    },
    handleMdmSelect(row) {
      this.editForm.mdmDataId = row.id
      this.selectMdmName = row.mdmName
      this.selectMdmDialogVisible = false
    }
  }
}

</script>
