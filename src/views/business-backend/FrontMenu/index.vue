<template>
  <div>
    <div>
      <el-input v-model="searchText" placeholder="请输入内容" prefix-icon="el-icon-search" />
    </div>
    <el-col :span="8">
      <div class="custom-tree-container">
        <div class="block" style="margin-top:10px;">
          <el-tree
            style="font-size: 14px;"
            :data="menuTree"
            node-key="id"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ data.menuName }}</span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="16" style="border-left: 1px solid #eee;">
      <el-form v-if="selectMenu" :model="selectMenu" :inline="true" style="margin-top: 10px; width: 400px;" label-width="120px">
        <el-form-item label="菜单名称:">
          <el-input v-model="selectMenu.menuName" />
        </el-form-item>
        <el-form-item label="菜单路径:">
          <el-input v-model="selectMenu.menuPath" />
        </el-form-item>
        <el-form-item label="视图:">
          <view-select v-model="selectMenu.viewId" />
        </el-form-item>
        <el-form-item label="外部地址:">
          <el-input v-model="selectMenu.extraUrl" />
        </el-form-item>
        <el-form-item label="状态:">
          <el-switch
            v-model="selectMenu.menuStatus"
            :active-value="0"
            :inactive-value="1"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" @click="submitEdit()">保存</el-button>
          <el-button type="primary" @click="addChildMenu()">添加下级菜单</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>

import { getRoutes } from '@/api/user'
import { saveMenu } from '@/api/back-end'

const DefaultMenu = {
  menuId: null,
  supMenuId: null,
  menuName: '空白菜单',
  menuType: 2,
  menuPath: 'view',
  viewId: null,
  extraUrl: '',
  menuStatus: 0,
  menuOrder: 1,
  children: []
}

export default {
  name: 'FrontMenu',
  data() {
    return {
      searchText: '',
      menuTree: [],
      selectMenu: null
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      getRoutes(2).then(ret => {
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
        }
      })
    },
    handleNodeClick(data) {
      this.selectMenu = data
    },
    submitEdit() {
      //
      const dd = JSON.parse(JSON.stringify(this.selectMenu))
      delete dd['children']

      saveMenu(dd).then(ret => {
        if (ret.success) {
          this.loadData()
        }
      })
    },
    addChildMenu() {
      console.log(this.selectMenu)
      if (this.selectMenu.menuId) {
        this.selectMenu.children.push(JSON.parse(JSON.stringify(DefaultMenu)))

        const newMenu = this.selectMenu.children[this.selectMenu.children.length - 1]
        newMenu.supMenuId = this.selectMenu.menuId
        this.selectMenu = newMenu
      } else {
        this.$message.error('请先保存')
      }
    }
  }
}
</script>
