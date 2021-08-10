<template>
  <div :class="eid">
    <el-row style="margin: 10px;">
      <lc-form-item label="选择字段">
        <lc-field-select :object-code="objectCode" @selectField="handleSelectField" />
        <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="showField" />
      </lc-form-item>
    </el-row>

    <el-table
      ref="table"
      :row-key="'id'"
      :data="viewJson.showFields"
      border
      style="width: 100%;"
    >
      <el-table-column prop="fieldCode" label="字段代码" width="120" />
      <el-table-column prop="fieldName" label="字段名称">
        <template scope="scope">
          <el-input v-model="scope.row.fieldName" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="visible" label="是否显示">
        <template scope="scope">
          <el-switch v-model="scope.row.visible"
            active-color="#13ce66" inactive-color="#ff4949"
            style="margin-top: 5px;">
          </el-switch>
        </template>
      </el-table-column>>
      <el-table-column prop="width" label="宽度" width="90">
        <template scope="scope">
          <el-input v-model="scope.row.width" type="number" size="mini" />
        </template>
      </el-table-column>

      <!-- <el-table-column prop="visible" label="是否显示" width="80">
        <template scope="scope">
          <el-switch v-model="scope.row.visible"
            active-color="#13ce66" inactive-color="#ff4949"
            @change="handleChange"
            style="margin-top: 5px;">
          </el-switch>
        </template>
      </el-table-column> -->

      <el-table-column width="60">
        <template slot="header">
          <span />
        </template>
        <template slot-scope="scope">
          <i class="el-icon-delete" style="color: red;" @click="deleteEle(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { uuid } from 'vue-uuid'
import Sortable from 'sortablejs'

export default {
  name: 'LcShowFieldsEditor',
  props: {
    objectCode: String,
    viewJson: Object,
    repeat: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      eid: 'e' + uuid.v1(),
      selectField: null
    }
  },
  mounted() {
    setTimeout(() => {
      this.enableDraggable()
    }, 300)
  },
  methods: {
    enableDraggable() {
      const tbody = document.querySelector('.' + this.eid + ' .el-table__body-wrapper table tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.viewJson.showFields.splice(oldIndex, 1)[0]
          _this.viewJson.showFields.splice(newIndex, 0, currRow)
          console.log('drag end: ' + JSON.stringify(_this.viewJson.showFields.map(a => a.fieldCode)))
          _this.handleChange()
        }
      })
    },
    handleChange() {
      const temp = []
      this.viewJson.showFields.forEach((item, i) => {
        item.sortNo = i
        if (item.visible) {
          temp.push(item)
        }
      })

      this.$props.viewJson.showFields.splice(0, this.$props.viewJson.showFields.length, ...temp)
    },

    handleSelectField(field) {
      this.selectField = field
    },
    showField() {
      if (this.selectField) {
        if (!this.repeat && this.viewJson.showFields.filter(a => a.fieldCode == this.selectField.fieldCode).length > 0) {
          this.$message.error('已经存在')
        } else {
          this.viewJson.showFields.push({
            id: this.selectField.id,
            fieldCode: this.selectField.fieldCode,
            fieldName: this.selectField.fieldName,
            visible: true,
            width: 100
          })
        }
      }
    },
    deleteEle(ele) {
      for (const item of this.viewJson.showFields) {
        if (item.id === ele.id) {
          const index = this.viewJson.showFields.indexOf(item)
          this.viewJson.showFields.splice(index, 1)
          break
        }
      }
    }

  }

}

</script>
