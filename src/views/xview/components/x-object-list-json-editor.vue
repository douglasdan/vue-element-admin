<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="字段显示" name="1">
      <ObjectFieldList
        ref="objectFieldSelector"
        :mode="'edit-view'"
        :height="400"
        :object-id="objectId"
        :viewJson="viewJson"
        :dragSort="true"
        @selection-change="handleFieldChange"
      />
    </el-collapse-item>

    <el-collapse-item v-if="viewJson.viewButtons" title="页面功能按钮" name="2">
      <ObjectBtnEditor :height="400" :btns="viewJson.viewButtons" />
    </el-collapse-item>

    <el-collapse-item v-if="viewJson.rowButtons" title="数据行功能按钮" name="3">
      <ObjectBtnEditor :height="400" :btns="viewJson.rowButtons" />
    </el-collapse-item>

    <el-collapse-item title="查询条件" name="4">

      <x-object-query-editor
        ref="queryConditionEditor"
        :mode="'select'"
        :height="400"
        :viewJson="viewJson"
        :object-id="objectId"
      >
      </x-object-query-editor>
    </el-collapse-item>

  </el-collapse>
</template>

<script>

// viewButtons
// rowButtons
// selectable
// showFields

import ObjectFieldList from '@/views/business-backend/ObjectMgr/ObjectFieldList'

import xObjectQueryEditor from '@/views/xview/components/x-object-query-editor'
import ObjectBtnEditor from './x-object-btn-editor'

export default {
  name: 'x-object-list-json-editor',
  components: {
    ObjectFieldList, ObjectBtnEditor, xObjectQueryEditor
  },
  props: {
    objectId: {
      type: String,
      required: true
    },
    viewJson: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeNames: '1'
    }
  },
  watch: {
    'viewJson': {
      handler(nval, oval) {
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    handleFieldChange(sels) {

      let temp = {}
      this.$props.viewJson.showFields.forEach((field)=>{
        temp[field.fieldCode] = field
      })
      debugger
      this.$set(this.$props.viewJson, 'showFields', sels.map(s => {
        return {
          'sortable': false,
          'fieldCode': s.fieldCode,
          'fieldName': s.fieldName,
          'formatter': null,
          'width': temp[s.fieldCode] ? temp[s.fieldCode].width : 100
        }
      }))
    }
  }

}

</script>
