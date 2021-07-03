<template>
  <div>
    <div style="margin-bottom:10px;">
      <el-button size="mini" type="primary" @click="handleAddTreeNode()">增加根节点</el-button>
    </div>
    <div class="custom-tree-container">
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
  </div>
</template>

<script>

export default {
  name: 'mdm-tree-editor',
  props: {
    roots: Array,
    editable: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    'roots': {
      handler(nval, oval) {

      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleAddTreeNode(node, data) {
      if (!data) {
        this.$.props.roots.push({ label: '', value: '' })
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
  }
}

</script>

<style scoped>
  .custom-tree-container .el-tree-node__content {
    height: 30px;
  }
  </style>
