<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="字段显示" name="1">
      <el-row style="margin-bottom: 10px;">
        显示字段名称：<el-input v-model="viewJson.labelWidth"
          placeholder="" style="width: 200px;" size="small"></el-input>
      </el-row>
      <el-row style="margin-bottom: 10px;">
        显示字段值宽度：<el-input v-model="viewJson.contentWidth"
          placeholder="" style="width: 200px;" size="small"></el-input>
      </el-row>
      <el-row style="margin-bottom: 10px;">
        显示列数：<el-input v-model="viewJson.cols"
          placeholder="" style="width: 200px;" size="small"></el-input>
      </el-row>

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

  </el-collapse>
</template>

<script>

import ObjectFieldList from '@/views/business-backend/ObjectMgr/ObjectFieldList'
import ObjectBtnEditor from './x-object-btn-editor'

export default {
  name: 'XObjectViewJsonEditor',
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
  },
  methods: {
    handleFieldChange(sels) {

      let temp = {}
      this.$props.viewJson.showFields.forEach((field)=>{
        temp[field.fieldCode] = field
      })

      this.$set(this.$props.viewJson, 'showFields', sels.map(s => {
        return {
          'fieldCode': s.fieldCode,
          'fieldName': s.fieldName,
        }
      }))
    }
  }

}

</script>
