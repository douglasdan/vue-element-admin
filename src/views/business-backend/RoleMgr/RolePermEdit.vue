<template>
  <el-container style="border-top: 1px solid #eee;">
    <el-aside :style="sidebarStyle" width="160px">
      <el-menu default-active="1" style="height: 100%;" @select="handleSelect">
        <el-menu-item index="1">
          <span slot="title">基本信息</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">菜单权限</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main style="padding: 10px;">
        <div style="height: 30px; width: 100%; padding-left: 10px; padding-right: 10px; float: right; font-size: 14px;">
          <div style="display: inline-block; float: right;">
            <el-button size="small" type="primary" @click="handleMenuSave">保存</el-button>
          </div>
        </div>
        <div v-if="selectIndex === '1'" style="padding-top: 10px;">
          <div style="width: 400px;">
            <el-form width="400px" label-width="120px">
              <el-form-item label="角色名称：">
                <el-input placeholder="" />
              </el-form-item>
              <el-form-item label="角色描述：">
                <el-input placeholder="" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="selectIndex === '2'" style="padding-top: 10px;">
          <div class="custom-tree-container">
            <div class="block" style="margin-top:30px; border-top: 1px solid #eee;">
              <el-tree
                ref="tree1"
                show-checkbox
                style="font-size: 14px;"
                :data="menuTree"
                node-key="id"
                :expand-on-click-node="false"
              >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <span>{{ data.menuName }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import { mapState } from 'vuex'
import { getAllRoutes } from '@/api/user'
import { selectRolePage, getRoleLinkMenuList, updateRoleLinkMenu } from '@/api/role'

export default {
  name: 'role-perm-edit',
  props: {
    roleId: [String, Number]
  },
  data() {
    return {
      selectIndex: '1',
      menuTree: [],
    }
  },
  watch: {
    'roleId': {
      handler(nval, oval) {
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    }),
    sidebarStyle() {
      return 'padding: 0px;  height:' + this.sidebarHeight
    },
    sidebarHeight() {
      const h = (window.innerHeight - 20 - 54) + 'px'
      return h
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    handleSelect(key, keyPath) {
      this.selectIndex = key
      this.loadData()
    },
    loadData() {
      if (this.selectIndex == '1') {
        getAllRoutes(2).then(ret => {
          if (ret.success) {
            if (!ret.data.menuTree.root) {
              this.menuTree = [JSON.parse(JSON.stringify(DefaultMenu))]
            } else {
              if (ret.data.menuTree.root.virtual) {
                this.menuTree = [].concat(ret.data.menuTree.root.children)
              } else {
                this.menuTree = [].concat([ret.data.menuTree.root])
              }
            }

            this.loadUserLinkRole()
          }
        })
      }
    },
    loadUserLinkRole() {
      getRoleLinkMenuList(this.$props.roleId).then(ret => {
        if (ret.success) {
          this.syncMenuSelect(ret.data)
        }
      })
    },
    syncMenuSelect(ids) {
      console.log(this.$refs.tree1)
      this.$refs.tree1.setCheckedKeys(ids)
      // this.$nextTick(() => {
      //   ids.forEach(id => {
      //     this.$refs.tree1.setCurrentKey(id)
      //   })
      // })
    },
    handleMenuSave() {
      let ids = this.$refs.tree1.getCheckedNodes().map(item => item.id)
      if (this.$props.roleId) {
        updateRoleLinkMenu(this.$props.roleId, ids).then(ret => {
          if (ret.success) {
            this.loadData()
          }
        })
      }
    }

  }

}

</script>
