<template>
  <section :class="eid">
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </el-row>
    <el-table ref="table" :data="btns" border style="width: 100%;" :height="tableHeight">
      <!-- <el-table-column type="selection" width="55" /> -->
      <!-- <el-table-column type="index" label="序号" /> -->
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="code" label="编码"/>
      <el-table-column prop="icon" label="图标"/>
      <el-table-column prop="visible" label="是否显示">
        <template scope="scope">
          <el-switch v-model="scope.row.visible"
            active-color="#13ce66" inactive-color="#ff4949"
            style="margin-top: 5px;">
          </el-switch>
        </template>
      </el-table-column>>
      <el-table-column width="100">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <i class="el-icon-edit btn-icon-primary" @click="handleEdit(scope.row, scope.$index)" />
          <i class="el-icon-delete btn-icon-danger" @click="handleDelete(scope.row, scope.$index)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :inline="true" label-width="120px" style="width: 400px;">
        <el-form-item label="名称：">
          <el-input v-model="editForm.name" placeholder="" clearable style="width: 180px;"/>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="120px" style="width: 800px;">
        <el-form-item label="编码：">
          <el-input v-model="editForm.code" placeholder="设置编码，才可以配置权限" />
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="120px" style="width: 800px;">
        <el-form-item label="颜色：">
          <el-select v-model="editForm.props.type">
            <el-option label="默认" value="无" />
            <el-option label="蓝色" value="primary" />
            <el-option label="绿色" value="success" />
            <el-option label="灰色" value="info" />
            <el-option label="橙色" value="warning" />
            <el-option label="红色" value="danger" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="120px" style="width: 800px;">
        <el-form-item label="动作：">
          <x-object-btn-func-editor v-model="editForm.action"></x-object-btn-func-editor>
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

import { uuid } from 'vue-uuid'
import Sortable from 'sortablejs'

import xObjectBtnFuncEditor from '@/views/xview/components/x-object-btn-func-editor'

export default {
  name: 'lc-view-btn-editor',
  components: {
    xObjectBtnFuncEditor
  },
  props: {
    btns: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      eid: 'e' + uuid.v1(),
      editForm: {
        name: '',
        action: {
          type: '',
          viewId: '',
          script: ''
        },
        props: {
          type: '',
          disabled: false
        }
      },
      editIndex: null,
      editDialogVisible: false
    }
  },
  computed: {
    tableHeight() {
      if (this.$props.height > 0) {
        return this.$props.height + 'px'
      } else {
        return '300px'
      }
    }
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    rowDrop() {
      const tbody = document.querySelector('.' + this.eid + ' .el-table__body-wrapper table tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.$props.btns.splice(oldIndex, 1)[0]
          _this.$props.btns.splice(newIndex, 0, currRow)
        }
      })
    },
    handleAdd() {
      this.$props.btns.push({
        'name': '修改我',
        'code': '',
        'props': {
          'size': 'small',
          'type': 'primary',
          'disabled': false
        },
        'action': null
      })
    },
    handleEdit(row, i) {
      this.editIndex = i
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    cancelEdit() {
      this.editDialogVisible = false
    },
    submitEdit() {
      this.$props.btns.splice(this.editIndex, 1, this.editForm)
      this.editDialogVisible = false
    },
    handleDelete(row, i) {
      this.$props.btns.splice(i, 1)
    }
  }
}

</script>
