<template>
  <div>
    <div style="width: 100%; padding-left: 10px; padding-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right; font-size: 14px;">
      应用：<app-select v-model="selectAppId"></app-select>
      对象：<x-object-select v-model="viewDefine.objectId" :appId="selectAppId"></x-object-select>
      类型：<el-select v-model="viewDefine.viewType" placeholder="请选择" @change="handleViewTypeChange">
            <el-option :key="'object-list'" :label="'对象列表'" :value="'object-list'">
            </el-option>
            <el-option :key="'object-edit'" :label="'对象视图'" :value="'object-edit'">
            </el-option>
            <el-option :key="'custom'" :label="'自定义'" :value="'custom'">
           </el-option>
           </el-select>
      名称：<el-input v-model="viewDefine.viewName" style="width: 200px;" />
      <div style="display: inline-block; float: right;">
        <el-button type="primary" @click="submitSave">保存</el-button>
      </div>
    </div>

    <div style="width: 100%; margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <x-run ref="xrun"  :view-define="viewDefine" />
    </div>
  </div>
</template>

<script>

import XRun from '@/views/xview-editor/run'
import { saveViewDefine } from '@/api/view-define'

import ObjectListTemplate from './object-list-template.json'
import ObjectEditTemplate from './object-edit-template.json'

export default {
  name: 'ViewList',
  components: { XRun },
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
    handleViewTypeChange() {

      if (!this.$props.viewDefine.viewContent || this.$props.viewDefine.viewContent == '{}' ) {
        if (this.$props.viewDefine.viewType == 'object-list') {
          this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(ObjectListTemplate))
        }
        else if (this.$props.viewDefine.viewType == 'object-edit') {
          //
        }
      }
    },
    submitSave() {
      console.log('save json ' + this.$refs.xrun.getJsonContent())
      this.viewDefine.viewContent = this.$refs.xrun.getJsonContent()

      saveViewDefine(this.viewDefine).then(ret => {
        if (ret.success) {
          this.$emit('close', {})
        }
      })
    }
  }

}
</script>
