<template>
  <el-container style="border: 1px solid #eee" class="main-content-full">
    <el-aside width="240px" style="background-color: white; border-right: 1px solid #eee;">
      <div>
        <el-input v-model="searchText" placeholder="请输入内容" prefix-icon="el-icon-search" />
      </div>
      <div class="custom-tree-container">
        <div class="block" style="margin-top:10px;">
          <el-tree
            :data="orgTree"
            node-key="id"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ data.orgName }}</span>
              <span>
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
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-aside>
    <el-container>
      <el-main style="padding: 10px;">
        <OrgList />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import OrgList from './orgList'
import store from '@/store'

export default {
  name: 'CompanyMgr',
  components: { OrgList },
  data() {
    return {
      searchText: '',
      orgTree: []
    }
  },
  watch: {
    '$store.state.corpAdmin.root': async function() {
      this.orgTree = [].concat(await store.dispatch('corpAdmin/getOrgTreeRoot'))
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
      this.orgTree = [].concat(await store.dispatch('corpAdmin/getOrgTreeRoot'))
    },
    handleNodeClick(data) {
      store.dispatch('corpAdmin/setSelectOrg', data)
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '../../../../src/styles/variables.scss';

  .main-content-full {
    min-height: calc(100vh - #{$navbarHeight} - #{$tagsViewHeight});
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .custom-tree-container {
    min-height: calc(100vh - #{$navbarHeight} - #{$tagsViewHeight} - 42px);
  }

  .el-tree {
    display: inline-block;
    min-width: 100%;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 8px;
    font-weight: bold;
  }

</style>
