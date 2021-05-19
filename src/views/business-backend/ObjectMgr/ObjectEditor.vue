<template>
  <el-container style="border-top: 1px solid #eee;">
    <el-aside :style="sidebarStyle" width="160px">
      <el-menu default-active="1" @select="handleSelect" style="height: 100%;">
        <el-menu-item index="1">
          <span slot="title">基本信息</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">字段</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span slot="title">字段</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px; line-height: 60px;  border-bottom: 1px solid #eee;">
        <el-button type="primary">新增字段</el-button>
      </el-header>

      <el-main>
        <div v-if="selectIndex === '1'">
          <el-form :model="tableDefine" :inline="true" style="width: 300px;">
            <el-form-item label="对象名称">
              <el-input v-model="tableDefine.obiectName"></el-input>
            </el-form-item>
            <el-form-item label="对象代码">
              <el-input v-model="tableDefine.objectCode"></el-input>
            </el-form-item>
            <el-form-item label="对象类型">
              <el-select v-model="tableDefine.objectType">
                <el-option label="普通对象" value="1"></el-option>
                <el-option label="子对象" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-divider></el-divider>
            <el-form-item label="主键字段">
              <el-input v-model="tableDefine.idField"></el-input>
            </el-form-item>
            <el-form-item label="字段类型">
              <mdm-select v-model="tableDefine.idFieldType" :value="tableDefine.idFieldType" :code="'fieldType'" @change="handleIdTypeChange" />
            </el-form-item>
            <el-form-item label="名称字段">
              <el-input v-model="tableDefine.labelFieldCode"></el-input>
            </el-form-item>

            <el-divider></el-divider>
            <el-form-item label="版本">
              <el-input v-model="tableDefine.version" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="已发布版本">
              <el-input v-model="tableDefine.deployVersion":disabled="true"></el-input>
            </el-form-item>

            <el-divider></el-divider>
            <el-form-item>
              <el-button type="primary" @click="onSubmit1">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="selectIndex === '2'">
          22
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

export default {
  name: 'ObjectEditor',
  props: {
    obj: {
      type: Object
    }
  },
  data() {
    return {
      selectIndex: '1',
      tableDefine:{},
      tableFieldDefines: [],
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    }),
    sidebarStyle() {
      return 'padding: 0px;  height:'+this.sidebarHeight;
    },
    sidebarHeight() {
      const h = (window.innerHeight - 20 - 54) + 'px'
      return h
    },
    editComponent() {
      if (this.selectIndex === 1) {

      }else {

      }
    }
  },
  methods: {
    loadData(){
      //
    },
    handleSelect(key, keyPath) {
      debugger
      this.selectIndex = key;
    },
    onSubmit1(){
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
