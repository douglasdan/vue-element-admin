<template>
  <div>
    <div style="width: 100%; padding-left: 10px; padding-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right; font-size: 14px;">
      应用：<app-select v-model="selectAppId" />
      对象：<x-object-select v-model="viewDefine.objectId" :app-id="selectAppId" />
      类型：<el-select v-model="viewDefine.viewType" placeholder="请选择" @change="handleViewTypeChange">
        <el-option :key="'object-list'" :label="'对象列表'" :value="'object-list'" />
        <el-option :key="'object-edit'" :label="'新建对象'" :value="'object-edit'" />
        <el-option :key="'object-view'" :label="'查看对象'" :value="'object-view'" />
        <el-option :key="'custom'" :label="'自定义'" :value="'custom'" />
      </el-select>
      名称：<el-input v-model="viewDefine.viewName" style="width: 200px;" />
      <div style="display: inline-block; float: right;">
        <el-button type="primary" @click="submitSave">保存</el-button>
      </div>
    </div>

    <div style="width: 100%; margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <x-preview ref="xrun" :view-define="viewDefine" />
    </div>

  </div>
</template>

<script>

import xPreview from '@/views/xview/x-preview'
import { saveViewDefine } from '@/api/view-define'
import { selectObjectFieldDefinePage } from '@/api/object-field-define'

import ObjectListTemplate from './template/object-list-template.json'
import ObjectEditTemplate from './template/object-edit-template.json'
import ObjectViewTemplate from './template/object-view-template.json'

import { repairObjectListViewJson } from './template/object-list-template-compatible.js'
import { repairObjectEditViewJson } from './template/object-edit-template-compatible.js'
import { repairObjectViewJson } from './template/object-view-template-compatible.js'

export default {
  name: 'x-view-editor',
  components: { xPreview },
  props: {
    viewDefine: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectAppId: null
    }
  },
  methods: {
    handleViewTypeChange(nval, oval) {

      if (this.$props.viewDefine.objectId) {

        if (this.$props.viewDefine.viewType == 'object-list') {

          if (!this.$props.viewDefine.viewContent || this.$props.viewDefine.viewContent == '{}') {
            this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(ObjectListTemplate))
          }
          else {
            let viewJson = JSON.parse(this.$props.viewDefine.viewContent)

            repairObjectListViewJson(viewJson)

            this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(viewJson))
          }
        }
        else if (this.$props.viewDefine.viewType == 'object-edit') {

          if (!this.$props.viewDefine.viewContent || this.$props.viewDefine.viewContent == '{}') {
            this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(ObjectEditTemplate))
          }
          else {
            let viewJson = JSON.parse(this.$props.viewDefine.viewContent)

            repairObjectEditViewJson(viewJson)

            this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(viewJson))
          }
        }
        else if (this.$props.viewDefine.viewType == 'object-view') {

          if (!this.$props.viewDefine.viewContent || this.$props.viewDefine.viewContent == '{}') {
            this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(ObjectViewTemplate))
          }
          else {
            let viewJson = JSON.parse(this.$props.viewDefine.viewContent)

            repairObjectViewJson(viewJson)

            this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(viewJson))
          }

        }
      }
    },
    submitSave() {
      console.log('x-view-editor save json', this.$props.viewDefine.viewContent)
      saveViewDefine(this.viewDefine).then(ret => {
        if (ret.success) {
          this.$emit('close', {})
        }
      })
    }
  }

}
</script>
