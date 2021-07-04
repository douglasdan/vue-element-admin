<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="直接编辑" name="first">
      <vue-json-editor
        v-model="tableData"
        :mode="'code'"
        lang="zh"
        :disabled="true"
        style="width: 100%;"
        @json-save="onJsonSave"
      />
    </el-tab-pane>
    <el-tab-pane label="图形编辑" name="second">
      <mdm-list-editor v-if="type === '2'" :table-data="tableData">
      </mdm-list-editor>
      <mdm-tree-editor v-if="type === '3'" :roots="tableData">
      </mdm-tree-editor>
    </el-tab-pane>
  </el-tabs>

</template>

<script>

import vueJsonEditor from 'vue-json-editor'

import MdmListEditor from '@/views/business-backend/MdmDataMgr/MdmListEditor'
import MdmTreeEditor from '@/views/business-backend/MdmDataMgr/MdmTreeEditor'

export default {
  name: 'MdmJsonEditor',
  components: {
    vueJsonEditor, MdmListEditor, MdmTreeEditor
  },
  props: {
    type: String,
    json: String,
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeName: 'first',
      tableData: []
    }
  },
  watch: {
    'type': {
      handler(nval, oval) {
        this.tableData = JSON.parse(this.$props.json)
        if (this.$props.type === '3') {
          this.tableData = [{ label: '', value: '' }]
        }
      },
      deep: true,
      immediate: true
    },
    'json': {
      handler(nval, oval) {
       this.parseJsonData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.parseJsonData()
  },
  methods: {
    parseJsonData() {
      this.tableData = JSON.parse(this.$props.json)
      if (this.$props.type === '3') {
        this.tableData = [{ label: '', value: '' }]
      }
    },
    handleAdd(index) {
      this.tableData.splice(index, 1, { label: '', value: '' })
    },
    handleMinus(row) {

    },
    onJsonSave() {
      try {
        this.tableData = JSON.parse(this.editJsonStr)
        this.$emit('change', this.editJsonStr)
      } catch (e) {
        console.error(e)
      }
    },
    getJsonStr() {
      return JSON.stringify(this.tableData)
    }
  }
}
</script>

<style scoped>
.custom-tree-container .el-tree-node__content {
  height: 30px;
}
</style>
