<template>
  <el-aside width="240px" style="background-color: white; border-right: 1px solid #eee;">
    <div>
      <el-input v-model="searchText" placeholder="请输入内容" prefix-icon="el-icon-search" />
    </div>
    <div class="custom-tree-container">
      <div class="block" style="margin-top:10px;">
        <el-tree
          style="font-size: 12px;"
          :data="orgTree"
          node-key="id"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ data.orgName }}</span>
            <!-- <span>
              <el-button
                type="text"
                size="mini"
                @click="() => append(data)"
              >
                增加下级
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                删除
              </el-button>
            </span> -->
          </span>
        </el-tree>
      </div>
    </div>
  </el-aside>
</template>

<script>

export default {
  name: 'OrgSideBar',
  data() {
    return {
      searchText: '',
      orgTree: []
    }
  },
  watch: {
    '$store.state.corpAdmin.root': async function() {
      this.orgTree = [].concat(await this.$store.dispatch('corpAdmin/getOrgTreeRoot'))
    }
  },
  created() {
    //
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.orgTree = [].concat(await this.$store.dispatch('corpAdmin/getOrgTreeRoot'))
    },
    handleNodeClick(data) {
      this.$store.dispatch('corpAdmin/setSelectOrg', data)
    }
  }
}
</script>
