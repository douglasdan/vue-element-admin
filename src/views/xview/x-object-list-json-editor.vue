<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="字段显示" name="1">
      <ObjectFieldList
        ref="objectFieldSelector"
        :mode="'select'"
        :height="400"
        :object-id="objectId"
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

      <ObjectFieldConditionEditor
        ref="queryConditionEditor"
        :mode="'select'"
        :height="400"
        :viewJson="viewJson"
        :object-id="objectId"
      >
      </ObjectFieldConditionEditor>
    </el-collapse-item>

  </el-collapse>
</template>

<script>

// viewButtons
// rowButtons
// selectable
// showFields

import ObjectFieldList from '@/views/business-backend/ObjectMgr/ObjectFieldList'
import ObjectFieldConditionEditor from '@/views/business-backend/ObjectMgr/ObjectFieldConditionEditor'
import ObjectBtnEditor from './x-object-btn-editor'

export default {
  name: 'XObjectListJsonEditor',
  components: {
    ObjectFieldList, ObjectBtnEditor, ObjectFieldConditionEditor
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
        //
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.sync()
    })
  },
  methods: {
    sync() {
      console.log('x-object-list-json-editor sync field selection')
      if (this.$refs.objectFieldSelector && this.$props.viewJson.showFields && this.$refs.objectFieldSelector.loaded()) {
        const codes = this.$props.viewJson.showFields.map(a => a.fieldCode)
        this.$refs.objectFieldSelector.toggleRowSelection(codes, true)
      } else {
        setTimeout(() => {
          this.sync()
        }, 500)
      }
    },
    handleFieldChange(sels) {

      let temp = {}
      this.$props.viewJson.showFields.forEach((field)=>{
        temp[field.fieldCode] = field
      })

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
