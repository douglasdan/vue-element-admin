<template>
  <section>
    <div style="padding-bottom: 10px; border-bottom: 1px solid #eee;">
      <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <lc-form-item label="模板">
          <el-select v-model="viewDefine.templateCode" clearable @change="handleChange">
            <el-option label="列表" value="list"></el-option>
            <el-option label="新建" value="create"></el-option>
            <el-option label="编辑" value="edit"></el-option>
          </el-select>
        </lc-form-item>
        <lc-form-item label="应用">
          <lc-app-select v-model="appCode"></lc-app-select>
        </lc-form-item>
        <lc-form-item label="对象">
          <lc-object-select :app-code="appCode" v-model="viewDefine.objectCode" @change="handleChange"></lc-object-select>
        </lc-form-item>
        <div style="right: 10px; float: right; position: absolute;">
          <el-button size="small" type="primary" @click="doSave">保存</el-button>
        </div>
      </el-row>
    </div>

    <div>
      <component
        v-if="viewDefine.templateCode"
        :is="renderComponent"
        :object-code="viewDefine.objectCode"
        :template-code="viewDefine.templateCode"
        :view-json="viewDefine.viewJson"
        ref="view"
      />
    </div>

  </section>
</template>

<script>

import ObjectListTemplate from './view-editor/object-list-template.json'
import ObjectCreateTemplate from './view-editor/object-create-template.json'
import ObjectEditTemplate from './view-editor/object-edit-template.json'

export default {
  name: 'lc-view-editor',
  props: {
    viewDefine: {
      type: Object,
      default: function() {
        return {
          objectCode: '',
          viewCode: '',
          templateCode: '',
          viewJson: {}
        }
      }
    }
  },
  computed: {
    renderComponent: {
      get() {
        if (this.viewDefine.templateCode == 'list') {
            return 'lc-view-list-editor'
        }
        if (this.viewDefine.templateCode == 'create') {
            return 'lc-view-create-editor'
        }
        if (this.viewDefine.templateCode == 'edit') {
            return 'lc-view-edit-editor'
        }
        return 'div'
      }
    }
  },
  data() {
    return {
      appCode: '',
      objects: [],

    }
  },
  create() {
  },
  methods: {

    loadData() {

    },
    handleChange() {
      //初始化对象
      if ('list' == this.viewDefine.templateCode) {

        this.$set(this.viewDefine, 'viewJson', JSON.parse(JSON.stringify(ObjectListTemplate)))
      }
      else if ('create' == this.viewDefine.templateCode) {
        this.$set(this.viewDefine, 'viewJson', JSON.parse(JSON.stringify(ObjectCreateTemplate)))
      }
      else if ('edit' == this.viewDefine.templateCode) {
        this.$set(this.viewDefine, 'viewJson', JSON.parse(JSON.stringify(ObjectEditTemplate)))
      }
      this.$forceUpdate()
    },
    doSave() {
      console.log(JSON.stringify(this.viewDefine))
    }
  }

}


</script>
