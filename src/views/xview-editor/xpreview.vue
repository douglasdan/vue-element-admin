<template>
  <el-row>
    <el-col :span="8">
      <!-- <vue-json-editor
        v-model="viewJson"
        :show-btns="false"
        :mode="'code'"
        lang="zh"
        style="height: 865px"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
        @has-error="onError"
      /> -->

      <div style="margin-left: 10px; margin-right: 10px;" v-if="">
        <x-object-list-json-editor v-if="viewDefine.viewType == 'object-list' && (viewDefine.id || viewDefine.viewContent)" :object-id="viewDefine.objectId" :viewJson="viewJson"></x-object-list-json-editor>
      </div>

    </el-col>

    <el-col :span="16" style="border: 1px solid; min-height: 600px;">

      <div v-if="viewDefine.objectId">
        <x-object-list v-if="viewDefine.viewType == 'object-list' && (viewDefine.id || viewDefine.viewContent)" :view-id="viewDefine.id" :viewDefine="viewDefine"/>
      </div>

      <div v-else>
        <x-element :view="viewJson" />
      </div>

    </el-col>
  </el-row>
</template>

<script>

import vueJsonEditor from 'vue-json-editor'
import XObjectListJsonEditor from '@/views/xview/x-object-list-json-editor'

export default {
  name: 'XPreview',
  components: {
    vueJsonEditor, XObjectListJsonEditor
  },
  props: {
    viewDefine: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      viewJson: null
    }
  },
  watch: {
    'viewDefine': {
      handler(nval, oval) {
        console.log('run watch viewDefine changed')
        this.viewJson = JSON.parse(nval.viewContent)
      },
      deep: true,
      immediate: true
    },
    'viewJson': {
      handler(nval, oval) {
        this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(this.viewJson))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onJsonChange(value) {
      console.log('value:', value)
      // this.$props.viewDefine.viewContent = JSON.parse(JSON.stringify(this.viewJson))

      this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(value))
    },
    onJsonSave(value) {
      console.log('value:', value)
      this.$set(this.$props.viewDefine, 'viewContent', JSON.stringify(this.viewJson))
      this.$emit('input', JSON.stringify(this.viewData))
    },
    onError(value) {
      console.log('value:', value)
    },
    // getJsonContent() {
    //   return JSON.stringify(this.viewJson)
    // }
  }

}
</script>

<style>
  .jsoneditor-poweredBy{
    display: none;
  }
  .jsoneditor-vue{
	    height: 100%;
	}

</style>
