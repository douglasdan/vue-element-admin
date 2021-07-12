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
              <app-select v-model="tableDefine.appId" :disabled="shouldDisable"/>
            </el-form-item>
            <el-form-item label="对象名称:">
              <el-input v-model="tableDefine.objectName" />
            </el-form-item>
            <el-form-item label="对象代码:">
              <el-input v-model="tableDefine.objectCode" :disabled="shouldDisable" />
            </el-form-item>

            <!-- <el-form-item label="对象类型:">
              <el-select v-model="tableDefine.objectType" :disabled="shouldDisable">
                <el-option label="普通对象" value="1" />
                <el-option label="子对象" value="2" />
              </el-select>
            </el-form-item> -->

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

            <el-form-item label="树:">
              <el-select v-model="tableDefine.treeFlag" placeholder="">
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>

            <el-form-item label="名称Code:" v-if="tableDefine.treeFlag">
              <el-input v-model="tableDefine.labelFieldCode"/>
            </el-form-item>

            <el-form-item label="IdCode:" v-if="tableDefine.treeFlag">
              <el-input v-model="tableDefine.idFieldCode"/>
            </el-form-item>

            <el-form-item label="父IdCode:" v-if="tableDefine.treeFlag">
              <el-input v-model="tableDefine.parentFieldCode"/>
            </el-form-item>

            <el-divider />
            <el-form-item>
              <el-button type="primary" @click="onSubmit1">保存</el-button>
              <el-button type="primary" @click="genJavaBean">生成JavaBean</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-else-if="selectIndex === '2'">
          <ObjectFieldList :object-id="tableDefine.id"/>
        </div>
        <div v-else-if="selectIndex === '3'">
          <ObjectRelationList :object-id="tableDefine.id"/>
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
import ObjectRelationList from './ObjectRelationList'

export default {
  name: 'ObjectEditor',
  components: { AppSelect, ObjectFieldList, ObjectRelationList },
  props: {
    obj: {
      type: Object
    }
  },
  data() {
    return {
      apps: [],
      selectIndex: '1',
      tableDefine: {
        objectType: '1'
      },
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
          this.tableDefine = ret.data
          this.$store.dispatch('lowCode/updateObjectDefine', this.tableDefine.id)
          this.loadData()

          this.$message.info('操作成功');
        }
      })
    },
    handleIdTypeChange(val) {
      // this.tableDefine.idFieldType = val;
    },
    camelCase(str) {
      let s =
      str.toLowerCase() &&
      str.toLowerCase()
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
      return s.slice(0, 1).toLowerCase() + s.slice(1);
    },
    genJavaBean() {

      this.$store.dispatch('lowCode/getObjectDefine', this.tableDefine.id).then(ret => {
        if (ret) {

          let sb = "";

          ret.fields.forEach((item) => {
            if (item.fieldType == 'text' || item.fieldType == 'textarea' || item.fieldType == 'json' ) {

              sb += `@JSONField(name = \"${item.fieldCode}\")\r\n`
              sb += `@JsonProperty("${item.fieldCode}") \r\n`
              sb += "private String "+this.camelCase(item.fieldCode)+";\r\n"
              sb += "\r\n"
            }
            else if (item.fieldType == 'int') {
              sb += `@JSONField(name = \"${item.fieldCode}\")\r\n`
              sb += `@JsonProperty("${item.fieldCode}") \r\n`
              sb += "private Long "+this.camelCase(item.fieldCode)+";\r\n"
              sb += "\r\n"
            }
            else if (item.fieldType == 'date') {
              sb += `@JSONField(name = \"${item.fieldCode}\", format = \"XDateUtil.YYYY_MM_DD\")\r\n`
              sb += `@JsonProperty("${item.fieldCode}") \r\n`
              sb += "private Date "+this.camelCase(item.fieldCode)+";\r\n"
              sb += "\r\n"
            }
            else if (item.fieldType == 'datetime') {
              sb += `@JSONField(name = \"${item.fieldCode}\", format = \"XDateUtil.YYYY_MM_DD_HH_MM_SS\")\r\n`
              sb += `@JsonProperty("${item.fieldCode}") \r\n`
              sb += "private Date "+this.camelCase(item.fieldCode)+";\r\n"
              sb += "\r\n"
            }
            else if (item.fieldType == 'decimal') {
              sb += `@JSONField(name = \"${item.fieldCode}\")\r\n`
              sb += `@JsonProperty("${item.fieldCode}") \r\n`
              sb += "private BigDecimal "+this.camelCase(item.fieldCode)+";\r\n"
              sb += "\r\n"
            }

          })

          console.log(sb)
        }
      })
    }
  }
}

</script>
