<template>
  <div>
    <el-form :inline="true" label-width="160px" v-if="fieldDefine">
      <el-form-item label="字段名称：">
        <el-input v-model="fieldDefine.fieldName" placeholder=""/>
      </el-form-item>
      <el-form-item label="字段类型：">
        <lc-mdm-select :mdm-code="LC.fieldType" v-model="fieldDefine.fieldType" @change="handleFieldTypeChange"></lc-mdm-select>
      </el-form-item>
      <el-form-item label="字段代码：">
        <el-input v-model="fieldDefine.fieldCode" placeholder=""/>
      </el-form-item>

      <el-form-item label="可为空：" v-show="showInputFor('fieldNullable')">
        <lc-bool v-model="fieldDefine.fieldNullable" :width="180"></lc-bool>
      </el-form-item>

      <el-form-item label="是否唯一：" v-show="showInputFor('fieldUnique')">
        <lc-bool v-model="fieldDefine.fieldUnique" :width="180"></lc-bool>
      </el-form-item>

      <el-form-item label="长度：" v-show="showInputFor('maxLength')">
        <el-input v-model="fieldDefine.maxLength" type="number"/>
      </el-form-item>

      <el-form-item label="值定义：" v-show="showInputFor('valueRefType')">
        <lc-mdm-select :mdm-code="LC.refType" v-model="fieldDefine.valueRefType"></lc-mdm-select>
      </el-form-item>

      <el-form-item label="引用主数据：" v-if="fieldDefine.valueRefType == '2'">
        <lc-mdm-code v-model="fieldDefine.mdmCode"></lc-mdm-code>
      </el-form-item>

      <el-form-item label="引用字段：" v-if="fieldDefine.valueRefType == '3'">

      </el-form-item>

      <el-form-item label="小数位：" v-show="showInputFor('fieldPrecision')">
        <el-input v-model="fieldDefine.fieldPrecision" type="number" placeholder=""/>
      </el-form-item>
      <el-form-item label="提示：">
        <el-input v-model="fieldDefine.fieldTip" placeholder="" />
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="fieldDefine.fieldDesc" type="textarea" placeholder="" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="height: 40px;">
      <div style="float: right; margin-right: 20px;">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="submitEdit()">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import { LowcodeConst } from '@/lowcode/api/lowcode'
import { getParentDialog } from '@/utils'

export default {
  name: 'lc-object-field-editor',
  props: {
    fieldDefine: Object
  },
  computed: {
    editForUpdate() {
      return !!this.fieldDefine.id
    },
    editForCreate() {
      return !this.fieldDefine.id
    },


  },
  data() {
    return {
      LC: LowcodeConst(),
      InputShowMap:{
        text: ['fieldNullable', 'fieldUnique', 'maxLength', 'valueRefType'],
        int:  ['fieldNullable', 'fieldUnique', 'maxLength'],
        decimal: ['fieldNullable', 'fieldUnique', 'maxLength', 'fieldPrecision'],
        date: ['fieldNullable', 'fieldUnique'],
        datetime: ['fieldNullable'],
        json: [],
      }
    }
  },
  methods: {
    showInputFor(fieldCode) {
      if (!this.fieldDefine.fieldType) {
        return false
      }
      return this.InputShowMap[this.fieldDefine.fieldType].indexOf(fieldCode) > -1
    },
    handleFieldTypeChange(nval, oval) {
      if (nval == 'text') {
        this.fieldDefine.fieldPrecision = null
      }
      else if (nval == 'int') {
        this.fieldDefine.fieldPrecision = null
        this.fieldDefine.valueRefType = null
      }
      else if (nval == 'decimal') {
        this.fieldDefine.valueRefType = null
      }
      else if (nval == 'date') {
        this.fieldDefine.maxLength = null
        this.fieldDefine.valueRefType = null
        this.fieldDefine.fieldPrecision = null
      }
      else if (nval == 'datetime') {
        this.fieldDefine.fieldUnique = null
        this.fieldDefine.maxLength = null
        this.fieldDefine.valueRefType = null
        this.fieldDefine.fieldPrecision = null
      }
      else if (nval == 'json') {

      }
    },
    cancelEdit() {
      //cancelEdit
      if (getParentDialog(this)) {
        getParentDialog(this).cancelEdit()
      }
    },
    submitEdit() {

      saveObjectFieldDefine(this.fieldDefine).then(ret => {
        if (ret.success) {
          this.$message.info('操作成功');
          this.$store.dispatch('lowCode/invalidateObjectDefine', this.fieldDefine.id)
          this.cancelEdit()
        }
      })

    }
  }
}

</script>
