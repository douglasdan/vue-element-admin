<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="字段显示" name="1">
      <ObjectFieldList ref="objectFieldSelector"
        :mode="'select'" :height="400" :object-id="objectId"
        @selection-change="handleFieldChange"
        />
    </el-collapse-item>

    <el-collapse-item title="页面功能按钮" name="2" v-if="viewJson.viewButtons">
      <ObjectBtnEditor :height="400" :btns="viewJson.viewButtons">
      </ObjectBtnEditor>
    </el-collapse-item>

    <el-collapse-item title="数据行功能按钮" name="3" v-if="viewJson.rowButtons">
      <ObjectBtnEditor :height="400" :btns="viewJson.rowButtons">
      </ObjectBtnEditor>
    </el-collapse-item>

    <el-collapse-item title="查询条件" name="4">
      <ObjectFieldList ref="queryConditionEditor"
        :mode="'select'" :height="400" :object-id="objectId"
        @selection-change="handleFieldChange"
        />
    </el-collapse-item>

  </el-collapse>
</template>

<script>

//viewButtons
//rowButtons
//selectable
//showFields

import ObjectFieldList from '@/views/business-backend/ObjectMgr/ObjectFieldList'
import ObjectBtnEditor from './x-object-btn-editor'

export default {
  name: 'x-object-list-json-editor',
  components: {
    ObjectFieldList, ObjectBtnEditor
  },
  props: {
    objectId: {
      type: String,
      required: true
    },
    viewJson: {
      type: Object,
      required: true,
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
  data() {
    return {
      activeNames: '1',
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
        let codes = this.$props.viewJson.showFields.map(a => a.fieldCode)
        this.$refs.objectFieldSelector.toggleRowSelection(codes, true)
      }
      else {
        setTimeout(()=>{
          this.sync()
        }, 500)
      }
    },
    handleFieldChange(sels) {
      this.$set(this.$props.viewJson, 'showFields', sels.map(s => {
        return {
          "sortable": false,
          "fieldCode": s.fieldCode,
          "fieldName": s.fieldName,
          "formatter": null
        }
      }))
    },
  },

}

</script>
