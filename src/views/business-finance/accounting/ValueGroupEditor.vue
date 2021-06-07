<template>
  <div>
    <el-row style="margin-right: 10px; margin-top: 10px; margin-bottom: 10px;">
      <span style="margin-left: 10px;">数据组：</span>
      <el-button type="primary" @click="handleAddGroup" style="margin-right: 10px; float: right;">新增</el-button>
      <el-button type="primary" @click="handleSubmit" style="margin-right: 10px; float: right;">保存</el-button>
    </el-row>

    <el-tag v-for="(v, a) in groups"
        closable @close="removeGroup(a)" @click="selectGroup(a, v)"
        style="margin-top:8px; margin-bottom:8px; margin-left: 10px;">{{ a }}</el-tag>

    <div v-if="editName != null">
      <el-divider></el-divider>
      <el-row>
        组名：<el-input placeholder="" type="small" style="width: 200px;" v-model="editName"></el-input>
      </el-row>
      <div v-for="(item, i) in editValues" style="margin-top:8px; margin-bottom:8px; margin-left: 10px;">
        <el-input placeholder="" type="small" style="width: 200px;" v-model="editValues[i]"></el-input>
        <i class="el-icon-minus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleDelete(i)" />
        <i class="el-icon-plus" style="font-weight: 600; margin: 8px;" size="mini" @click="handleAdd(i)" />
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'value-set-editor',
  props: {
    value: Object
  },
  data() {
    return {
      groups: {},
      editName: null,
      editValues: []
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        this.groups = nval
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    handleAddGroup() {
      this.save()

      this.editName = ''
      this.editValues = ['']
    },
    selectGroup(a) {
      this.editName = a
      this.editValues = this.groups[a]
      if (this.editValues.length === 0) {
        this.editValues = [].concat('')
      }
    },
    removeGroup(a) {
      this.$delete(this.groups, a);
    },
    handleAdd(i) {
      this.editValues.splice(i+1, 0, '');
    },
    handleDelete(vals, i) {
      this.editValues.splice(i, 1);
      if (this.editValues.length === 0) {
        this.editValues = [].concat('')
      }
    },
    save() {
      if (this.editName) {
        this.editValues = [].concat(this.editValues.filter(x=>x))
        this.$set(this.groups, this.editName, this.editValues)
        this.groups[this.editName] = this.editValues
        this.$emit('input', this.groups)
        this.editName = null
        this.editValues = []
      }
    },

    handleSubmit() {
      this.save()
      this.$emit('submit')
    }
  }
}


</script>
