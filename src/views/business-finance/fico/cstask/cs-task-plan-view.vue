<template>
  <div>
    <el-row style="border-bottom: 1px solid #eee;">
      <div class="cond-parent" style="margin: 0px;">
        <div class="cond-child" v-for="(cond,i) in conditions">
          <div :style="labelStyle">
            {{ cond.fieldName }}：
          </div>

          <div :style="'width: 200px'">
            <x-object-condition :hide-op="true" :cond="cond"></x-object-condition>
          </div>
        </div>

        <div style="margin-top: 10px; right: 10px; float: right; position: absolute;">
          <el-button size="small" @click="resetQueryCond">重置</el-button>
          <el-button type="primary" size="small" @click="loadStatisData">查询</el-button>
          <el-button type="primary" size="small" @click="doExport">导出</el-button>
        </div>
      </div>

    </el-row>

    <el-row style="margin-top: 10px; margin-bottom: 10px;">
      <el-col :span="12">
        <div style="width: 100%; text-align: center;">
          发送方
        </div>
      </el-col>
      <el-col :span="12">
        <div style="width: 100%; text-align: center;">
          分摊结果
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px; margin-bottom: 10px;">
      <el-col :span="12">
        <show-view :object-id="97" :view-type="'object-list'" ref="page1" :page-props="{'hideFuncBar': true}"></show-view>
      </el-col>
      <el-col :span="12">
        <show-view :object-id="91" :view-type="'object-list'" ref="page2" :page-props="{'hide-func-bar': true}"></show-view>
      </el-col>
    </el-row>

    <el-dialog>
      <!-- <el-col :span="8">
        <div>
          SQL语句：
        </div>
        <div>
          {{objectData.sourceSql}}
        </div>
        <codemirror ref="sql1" v-model="objectData.sourceSql" :options="options()">
        </codemirror>
      </el-col>
      <el-col :span="8">
        <codemirror ref="sql1" :options="options()">
        </codemirror>
      </el-col>
      <el-col :span="8">
        <codemirror ref="sql1" :options="options()">
        </codemirror>
      </el-col> -->
    </el-dialog>
  </div>
</template>

<script>

import { mapState } from 'vuex'

import xObjectViewView from '@/views/xview/components/x-object-view-view'
import { saveObjectData, getObjectDataById, callObjectAction, exportTaskResult } from '@/api/object-data'
import { codemirror } from 'vue-codemirror'

import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";

let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");

export default {
  name: 'cs-task-plan-view',
  components: {
    codemirror
  },
  extends: xObjectViewView,
  data() {
    return {
      self: this,
      mdmReady: false,
      pageEditing: false,

      objectDefine: null,
      objectFieldDefine: [],
      objectFieldDefineMap: {},

      // 对象数据
      objectData: {

      },
      objectDataBak: null,

      colspan: 0,
      showCols: 1,
      cols: [],
      showFieldGroups: [],

      //er关系
      erViews: {},

      //extend data
      ext: {
        taskSibling: [],
      },
      statisObjectDefine: null,
      statisFieldMap: null,
    }
  },
  computed: {
    'conditions': {
      get() {
        return [
          {fieldName: '部门', objectCode: 'CS_COST_RESULT', field: 'departCodeProd', op: 'eq', values: []},
          {fieldName: '科目', objectCode: 'CS_COST_RESULT', field: 'subjectCode', op: 'eq', values: []}
        ]
      }
    }
  },
  mounted() {
    this.$store.dispatch('lowCode/getObjectDefine', 99).then(ret => {
      this.statisObjectDefine = ret
      this.statisFieldMap = {}

      this.statisObjectDefine.fields.forEach((item, index) => {
        this.statisFieldMap[item.fieldCode] = item
      })
    })

  },
  methods: {
    options() {
      return {
        tabSize: 4, // 缩进格式
        theme: 'text/x-mariadb', // 主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true,
        styleActiveLine: true, // 高亮选中行
        hintOptions: {
          completeSingle: true // 当匹配只有一项的时候是否自动补全
        }
      }
    },
    loadObjectData() {
      if (this.objectId) {
        if (!this.objectDataId) {
          this.$message.error('未指定数据ID')
        } else {
          getObjectDataById(this.objectId, this.objectDataId).then(ret => {
            if (ret.success && ret.data) {
              this.objectData = ret.data

              if (this.objectData['sourceSql']) {

              }
              if (this.objectData['targetSql']) {

              }
              if (this.objectData['shareSQL']) {

              }
              let _this = this
              setTimeout(() => {
                _this.loadStatisData()
              }, 1000)

              this.loadStatisData()
              // callObjectAction(this.objectDefine.id, this.objectData.id, 'siblings', {}).then(ret => {
              //   if (ret.success) {
              //     this.taskSibling = ret.data
              //     let _this = this
              //     setTimeout(() => {
              //       _this.loadStatisData()
              //     }, 1000)
              //   }
              // })
            }
          })
        }
      }
    },
    resetQueryCond() {

    },
    loadStatisData() {
      console.log(this.objectData['year'], this.objectData['period'])
      console.log(this.objectData['id'])
      console.log(this.objectDefine.objectCode)

      //找到上次任务

      // let preTaskId = -1
      // let thisIdx = 0
      // this.taskSibling.forEach((item,i) => {
      //   if (item.id === this.objectData.id) {
      //     thisIdx = i
      //   }
      // })

      // if (thisIdx > 0) {
      //   preTaskId = this.taskSibling[thisIdx-1].id
      // }

      let temp = []
      this.conditions.forEach((cond,i) => {
        if (cond.values.length > 0) {
          temp.push({'field': cond.field, 'op': cond.op, 'values': cond.values})
        }
      })
      this.$refs.page1.invoke('setDefaultQueryConditions', temp.concat([
        {
          field: 'taskPlanId', op: 'eq', values: [this.objectData.id]
        }
      ]))
      this.$refs.page1.invoke('loadData', {})

      this.$refs.page2.invoke('setDefaultQueryConditions', temp.concat([
        {
          field: 'taskPlanId', op: 'eq', values: [this.objectData.id]
        }
      ]))
      this.$refs.page2.invoke('loadData', {})

    },

    doExport() {
      // exportTaskResult(this.objectData.id)
      window.open('http://localhost:9001/openapi/costResult/export?taskPlanId='+this.objectData.id)
    }
  }
}


</script>
