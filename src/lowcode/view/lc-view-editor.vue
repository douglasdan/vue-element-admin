<template>
  <section>
    <div style="padding-bottom: 10px; border-bottom: 1px solid #eee;">
      <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <lc-form-item label="模板" :label-width="60">
          <el-select v-model="viewDefine.templateCode" clearable @change="handleChange">
            <el-option label="列表" value="list" />
            <el-option label="新建" value="create" />
            <el-option label="编辑" value="edit" />
          </el-select>
        </lc-form-item>
        <lc-form-item label="应用" :label-width="60">
          <lc-app-select v-model="appCode" />
        </lc-form-item>
        <lc-form-item label="对象" :label-width="60">
          <lc-object-select v-model="viewDefine.objectCode" :app-code="appCode" @change="handleChange" />
        </lc-form-item>
        <lc-form-item label="视图代码" :label-width="100">
          <el-input v-model="viewDefine.viewCode" placeholder="" style="width: 200px;"></el-input>
        </lc-form-item>
        <lc-form-item label="视图名称" :label-width="100">
          <el-input v-model="viewDefine.viewName" placeholder="" style="width: 200px;"></el-input>
        </lc-form-item>
        <div style="right: 10px; float: right; position: absolute;">
          <el-button size="small" type="primary" @click="doSave">保存</el-button>
        </div>
      </el-row>
    </div>

    <div>
      <component
        :is="renderComponent"
        v-if="viewDefine.templateCode && viewDefine.objectCode"
        ref="view"
        :object-code="viewDefine.objectCode"
        :template-code="viewDefine.templateCode"
        :view-json="viewDefine.viewJson"
      />
    </div>

  </section>
</template>

<script>

import { saveViewDefine, getViewDefineById } from '@/lowcode/api/lowcode'

import ObjectListTemplate from './view-editor/object-list-template.json'
import ObjectCreateTemplate from './view-editor/object-create-template.json'
import ObjectEditTemplate from './view-editor/object-edit-template.json'

export default {
  name: 'LcViewEditor',
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
  data() {
    return {
      appCode: '',
      objects: []
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
  create() {
    this.loadData()
  },
  methods: {

    loadData() {

    },
    handleChange() {
      // 初始化对象
      if (this.viewDefine.templateCode == 'list') {
        this.$set(this.viewDefine, 'viewJson', JSON.parse(JSON.stringify(ObjectListTemplate)))
      } else if (this.viewDefine.templateCode == 'create') {
        this.$set(this.viewDefine, 'viewJson', JSON.parse(JSON.stringify(ObjectCreateTemplate)))
      } else if (this.viewDefine.templateCode == 'edit') {
        this.$set(this.viewDefine, 'viewJson', JSON.parse(JSON.stringify(ObjectEditTemplate)))
      }
      this.$forceUpdate()
    },
    doSave() {
      console.log(JSON.stringify(this.viewDefine))

      saveViewDefine({
        id: this.viewDefine.id,
        objectCode: this.viewDefine.objectCode,
        templateCode: this.viewDefine.templateCode,
        viewCode: this.viewDefine.viewCode,
        viewName: this.viewDefine.viewName,
        viewJson: JSON.stringify(this.viewDefine.viewJson)
      }).then(ret => {
        if (ret.success) {
          this.$message.info('创建视图成功')
        }
      })
    }
  }

}

</script>
