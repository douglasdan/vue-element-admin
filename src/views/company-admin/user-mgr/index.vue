<template>
  <el-container style="border: 1px solid #eee" class="main-content-full">
    <org-side-bar>></org-side-bar>
    <el-container>
      <el-main style="padding: 10px;">
        <UserList />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import UserList from './UserList'
import OrgSideBar from '../OrgSideBar.vue'

export default {
  name: 'UserMgr',
  components: {
    UserList,
    OrgSideBar
  },
  data() {
    return {
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
