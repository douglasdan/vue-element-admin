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
      <div style="margin-bottom:10px;">
        <el-button v-if="type === '3'" size="mini" type="primary" @click="handleAddTreeNode()">增加根节点</el-button>
      </div>
      <div v-if="type === '3'" class="custom-tree-container">
        <el-tree
          style="font-size: 12px;"
          :data.sync="tableData"
          node-key="id"
          :default-expand-all="true"
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span v-if="!editable">{{ data.label }}:{{ data.value }}</span>
            <span>
              名称：<el-input v-model="data.label" size="mini" style="width: 140px; height:24px;" />
              代码：<el-input v-model="data.value" size="mini" style="width: 140px; height:24px;" />
              <span>
                <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleAddTreeNode(node, data)" />
                <i class="el-icon-minus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleMinusTreeNode(node, data)" />
              </span>
            </span>
          </span>
        </el-tree>
      </div>

      <el-table
        v-else
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="value"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          prop="label"
          label="名称"
          sortable
          width="180"
        >
          <template scope="scope">
            <el-input v-if="editable" v-model="scope.row.label" />
            <span v-else>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="代码"
          sortable
          width="180"
        >
          <template scope="scope">
            <el-input v-if="editable" v-model="scope.row.value" />
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="editable">
          <template slot="header" slot-scope="scope">
            <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleAdd()" />
          </template>
          <template slot-scope="scope">
            <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleAdd(scope.row)" />
            <i class="el-icon-minus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleMinus(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>

</template>

<script>

import vueJsonEditor from 'vue-json-editor'

export default {
  name: 'MdmJsonEditor',
  components: {
    vueJsonEditor
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
      editJson: null,
      tableData: []
    }
  },
  watch: {
    'type': {
      handler(nval, oval) {
        this.tableData = JSON.parse(this.$props.json)
        this.editJsonStr = this.$props.json
        if (this.$props.type === '3') {
          this.tableData = [{ label: '', value: '' }]
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.tableData = JSON.parse(this.$props.json)
    this.editJsonStr = this.$props.json
    if (this.$props.type === '3') {
      this.tableData = [{ label: '', value: '' }]
    }
  },
  methods: {
    handleAdd(row) {
      row.children.push({ label: '', value: '' })
    },
    handleMinus(row) {
      //
    },
    onJsonSave() {
      try {
        this.tableData = JSON.parse(this.editJsonStr)
        this.$emit('change', this.editJsonStr)
      } catch (e) {
        console.error(e)
      }
    },
    handleAddTreeNode(node, data) {
      if (!data) {
        this.tableData.push({ label: '', value: '' })
      } else {
        const newChild = { id: 100, label: '', value: '', children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      }
    },
    handleMinusTreeNode(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
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
