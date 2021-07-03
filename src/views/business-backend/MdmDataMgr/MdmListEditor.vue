<template>
  <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="value"
      border
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
          <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleAdd(0)" />
        </template>
        <template slot-scope="scope">
          <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleAdd(scope.$index)" />
          <i class="el-icon-minus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleMinus(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
</template>

<script>

export default {
  name: 'mdm-list-editor',
  props: {
    tableData: Array,
    editable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleAdd() {
      this.$props.tableData.splice(0, 0, { label: '', value: '' })
    },
    handleAdd(index) {
      this.$props.tableData.splice(index+1,0, { label: '', value: '' })
    },
    handleMinus(index) {
      this.$props.tableData.splice(index+1, 1)
    },
  }
}

</script>
