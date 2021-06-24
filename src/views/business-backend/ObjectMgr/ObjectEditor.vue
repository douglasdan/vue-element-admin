<template>
  <el-container style="border-top: 1px solid #eee;">
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
      <el-main>
        <div v-if="selectIndex === '1'">
          <el-form :model="tableDefine" :inline="true" style="width: 400px;" label-width="120px">
            <el-form-item label="应用:">
              <app-select v-model="tableDefine.appId" :disabled="shouldDisable" :appType="filterAppType"/>
            </el-form-item>
            <el-form-item label="对象名称:">
              <el-input v-model="tableDefine.obiectName" />
            </el-form-item>
            <el-form-item label="对象代码:">
              <el-input v-model="tableDefine.objectCode" :disabled="shouldDisable" />
            </el-form-item>
            <el-form-item label="对象类型:">
              <el-select v-model="tableDefine.objectType" :disabled="shouldDisable">
                <el-option label="普通对象" value="1" />
                <el-option label="子对象" value="2" />
              </el-select>
            </el-form-item>

            <!-- <el-divider />
            <el-form-item label="主键字段:">
              <el-input v-model="tableDefine.idField" :disabled="shouldDisable" />
            </el-form-item>
            <el-form-item label="字段类型:">
              <mdm-select v-model="tableDefine.idFieldType" :value="tableDefine.idFieldType" :code="'fieldType'" :disabled="shouldDisable" />
            </el-form-item> -->
            <!-- <el-form-item label="名称代码:">
              <el-input v-model="tableDefine.labelFieldCode"></el-input>
            </el-form-item> -->

            <el-divider />
            <el-form-item label="版本:">
              <el-input v-model="tableDefine.version" :disabled="true" />
            </el-form-item>
            <el-form-item label="已发布版本:">
              <el-input v-model="tableDefine.deployVersion":disabled="true" />
            </el-form-item>

            <el-divider />
            <el-form-item>
              <el-button type="primary" @click="onSubmit1">保存</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-else-if="selectIndex === '2'">
          <ObjectFieldList :object-id="tableDefine.id" />
        </div>
        <div v-else-if="selectIndex === '3'">
          33
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import { mapState } from 'vuex'
import { saveObjectDefine } from '@/api/object-define.js'
import { selectAppPage } from '@/api/app.js'
import AppSelect from '../AppMgr/AppSelect'

import ObjectFieldList from './ObjectFieldList'

export default {
  name: 'ObjectEditor',
  components: { AppSelect, ObjectFieldList },
  props: {
    obj: {
      type: Object
    }
  },
  data() {
    return {
      apps: [],
      selectIndex: '1',
      tableDefine: {},
      filterAppType: ''
    }
  },
  watch: {
    'obj': {
      handler(nval, oval) {
        this.tableDefine = nval
        if (nval.id) {
          this.filterAppType = ''
        } else {
          this.filterAppType = '9'
        }
        this.$forceUpdate()
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
    shouldDisable() {
      return !!this.tableDefine.id
    },
    editComponent() {
      if (this.selectIndex === 1) {
        //

      } else {

      }
    }
  },
  methods: {
    loadData() {
      //
      selectAppPage({}).then(ret => {
        this.apps = ret.data.rows
      })
    },
    handleSelect(key, keyPath) {
      this.selectIndex = key
    },
    onSubmit1() {
      saveObjectDefine(this.tableDefine).then(ret => {
        if (ret.success) {
          this.loadData()
        }
      })
    },
    handleIdTypeChange(val) {
      // this.tableDefine.idFieldType = val;
    }
  }
}

</script>
