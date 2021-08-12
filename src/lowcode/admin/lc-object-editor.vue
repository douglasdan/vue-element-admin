<template>
  <el-container :style="pageStyle">
    <el-aside :style="sidebarStyle" width="160px">
      <el-menu default-active="1" style="height: 100%;" @select="handleSelect">
        <el-menu-item index="1">
          <span slot="title">基本信息</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">对象字段</span></span>
        </el-menu-item>
        <el-menu-item index="3">
          <span slot="title">对象关系</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main style="padding: 0px;">
        <div v-if="selectIndex === '1'">

          <el-row class="cond-parent" style="width: 400px; border-top: 0px;">

            <lc-form-item label="应用">
              <lc-app-select v-model="tableDefine.appCode"></lc-app-select>
            </lc-form-item>

            <lc-form-item label="对象名称">
              <el-input v-model="tableDefine.objectName" style="width: 200px;"></el-input>
            </lc-form-item>

            <lc-form-item label="对象代码">
              <el-input v-model="tableDefine.objectCode" style="width: 200px;" :disabled="editForUpdate"></el-input>
            </lc-form-item>

            <lc-form-item label="主数据">
              <lc-bool v-model="tableDefine.mdmFlag"></lc-bool>
            </lc-form-item>

            <lc-form-item label="名称Code">
              <el-input v-model="tableDefine.labelFieldCode" style="width: 200px;"/>
            </lc-form-item>

            <lc-form-item label="KeyCode">
              <el-input v-model="tableDefine.keyFieldCode" style="width: 200px;"/>
            </lc-form-item>

            <lc-form-item label="树">
              <lc-bool v-model="tableDefine.treeFlag"></lc-bool>
            </lc-form-item>

            <lc-form-item label="父KeyCode" v-if="tableDefine.treeFlag == '1'">
              <el-input v-model="tableDefine.supFieldCode" style="width: 200px;"/>
            </lc-form-item>

          </el-row>
          <el-row style="width: 400px;">
            <div style="float: right; margin-right: 60px;">
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button type="primary" @click="genJavaBean">生成JavaBean</el-button>
            </div>
          </el-row>
        </div>

        <div v-else-if="selectIndex === '2'">
          <lc-object-field-list :object-code="tableDefine.objectCode" v-if="tableDefine.id"></lc-object-field-list>
        </div>

        <div v-else-if="selectIndex === '3'">

        </div>

      </el-main>
    </el-container>

  </el-container>
</template>

<script>

import { isRootPageView, isShowInDialog } from '@/utils'
import { selectObjectDefinePage, LowcodeConst, saveObjectDefine } from '@/lowcode/api/lowcode'
import lcObjectFieldList from './lc-object-field-list'

export default {
  name: 'lc-object-editor',
  components: {lcObjectFieldList},
  props: {
    obj: {
      type: Object
    }
  },
  watch: {
    'obj': {
      handler(nval, oval) {
        this.tableDefine = nval
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      selectIndex: '1',
      tableDefine: {},
      filterAppType: ''
    }
  },
  computed: {
    pageStyle() {
      return 'border-top: 1px solid #eee;'
    },
    sidebarStyle() {
      return 'padding: 0px;  height:' + this.sidebarHeight
    },
    sidebarHeight() {
      const h = (window.innerHeight - 20 - 54) + 'px'
      return h
    },
    editForUpdate() {
      return !!this.tableDefine.id
    },
    editForCreate() {
      return !this.tableDefine.id
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.selectIndex = key
    },
    onSubmit() {
      saveObjectDefine(this.tableDefine).then(ret => {
        if (ret.success) {
          this.tableDefine = ret.data
          this.$store.dispatch('lowCode/updateObjectDefine', this.tableDefine.id)
          this.$message.info('操作成功');
        }
      })
    },
    genJavaBean() {

    }
  }
}

</script>
