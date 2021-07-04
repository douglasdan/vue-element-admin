<template>
  <section :class="eid">
    <el-row style="margin-bottom: 10px;">
      标签宽度：<el-input v-model="viewJson.queryDefine.labelWidth"
        @change="refreshConditions"
        placeholder="" style="width: 200px;" size="small"></el-input>
    </el-row>
    <el-table ref="table"
      :data="rows"
      :row-key="'fieldCode'"
      border style="width: 100%;" :height="tableHeight">
      <el-table-column prop="fieldName" label="字段名称" :formatter="formatter" />
      <el-table-column prop="fieldType" label="字段类型" :formatter="formatter" />
      <el-table-column prop="fieldCode" label="字段代码" :formatter="formatter" width="160"/>
      <el-table-column width="300">
        <template scope="scope">
          <x-object-query-cond-editor :object-id="objectId" :cond="scope.row" @change="refreshConditions" v-if="objectDefineLoaded">
          </x-object-query-cond-editor>
        </template>
      </el-table-column>

    </el-table>
  </section>
</template>

<script>

import { uuid } from 'vue-uuid'
import store from '@/store'
import { mapState } from 'vuex'
import { selectObjectFieldDefinePage, saveObjectFieldDefine } from '@/api/object-field-define'

import xObjectQueryCondEditor from '@/views/xview/components/x-object-query-cond-editor'

import Sortable from 'sortablejs'

export default {
  name: 'x-object-query-editor',
  components: {
    xObjectQueryCondEditor
  },
  props: {
    objectId: String,
    height: Number,
    viewJson: {
      type: Object
    }
  },
  data() {
    return {
      eid: 'e' + uuid.v1(),
      fieldMap: {},
      rows: [],

      objectDefineLoaded: false
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      }
    }),
    tableHeight() {
      if (this.$props.height > 0) {
        return this.$props.height + 'px'
      } else {
        const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
        return h
      }
    },
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadData()
      },
      deep: true,
      immediate: true
    },
    'viewJson': {
      handler(nval, oval) {
        console.log('x-object-query-editor watch viewJson changed')
        if (!oval && nval) {
          this.syncFilterField()
        }
        if (oval && nval) {
          if (JSON.stringify(oval.queryDefine) != JSON.stringify(nval.queryDefine)) {
            this.syncFilterField()
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.enableRowDrag()
    this.loadData()
  },
  methods: {
    enableRowDrag() {
      const tbody = document.querySelector('.' + this.eid + ' .el-table__body-wrapper table tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.rows.splice(oldIndex, 1)[0]
          _this.rows.splice(newIndex, 0, currRow)
          _this.refreshConditions()
        }
      })
    },
    formatter(row, column, cellValue, index) {
      if (column.property === 'fieldType' && this.mdm['fieldType']) {
        let name = ''
        JSON.parse(this.mdm['fieldType'].json).forEach((item) => {
          if (item.value === cellValue) {
            name = item.label
          }
        })
        return name
      }
      return cellValue
    },
    loadData() {
      this.$store.dispatch('lowCode/getObjectDefine', this.$props.objectId).then(ret => {
        if (ret) {
          this.objectDefineLoaded = true
          this.rows = []
          ret.fields.forEach((item,i) => {
            this.rows.push({
              fieldName: item.fieldName,
              fieldCode: item.fieldCode,
              fieldType: item.fieldType,
              opType: '',
              sortNo: i,
              values: '',
              visible: false
            })
          })

          this.syncFilterField()
        }
      })
    },
    loaded() {
      return this.rows.length > 0
    },
    syncFilterField() {
      console.log('syncFilterField ', this.$props.viewJson.queryDefine.conditions.length)


      let temp = []
      this.rows.forEach((row) => {
        console.log('syncFilterField init field', row.fieldCode)

        let cond = this.$props.viewJson.queryDefine.conditions.some(cond => cond.fieldCode === row.fieldCode)
        if (cond) {
          temp.push(cond)
        }
        else {
          temp.push({
            fieldName: row.fieldName,
            fieldCode: row.fieldCode,
            fieldType: row.fieldType,
            opType: '',
            sortNo: row.sortNo,
            values: '',
            visible: row.visible
          })
        }
      })

      this.$set(this.$props.viewJson.queryDefine, 'conditions', temp)


      // if (this.$props.viewJson.queryDefine.conditions.length == 0) {

      //   let temp = []
      //   this.rows.forEach((row) => {
      //     console.log('syncFilterField init field', row.fieldCode)
      //     temp.push({
      //       fieldName: row.fieldName,
      //       fieldCode: row.fieldCode,
      //       fieldType: row.fieldType,
      //       opType: '',
      //       sortNo: row.sortNo,
      //       values: '',
      //       visible: row.visible
      //     })
      //   })

      //   this.$set(this.$props.viewJson.queryDefine, 'conditions', temp)
      // }
      // else {
      //   this.rows = this.$props.viewJson.queryDefine.conditions
      //   this.rows.forEach((row) => {
      //     console.log('syncFilterField check field', row.fieldCode)
      //     if (typeof(row.visible) == undefined) {
      //       if (row.opType) {
      //         row.visible = true
      //       }
      //       else {
      //         row.visible = false
      //       }
      //     }
      //   })
      //   this.$set(this.$props.viewJson.queryDefine, 'conditions', this.rows)
      // }

    },
    getCondition(fieldCode) {

      if (this.$props.conditions) {
        let fs = this.$props.conditions.filter(a => a.fieldCode === conditions)
        if (fs.length > 0) {
          return fs[0]
        }
      }

      return null
    },
    refreshConditions() {
      //当condtion发生变化时，需要同步更新viewJson.queryDefine, 刷新预览的视图
      console.log('condition change refresh ')

      this.rows.forEach((row,i) => {
        row.sortNo = i
      })

      this.$set(this.$props.viewJson.queryDefine, 'conditions', JSON.parse(JSON.stringify(this.rows)))
    },
    handleValueChange(nval, oval) {
      console.log(oval+"===>"+nval)
      this.refreshConditions()
    }
  }
}

</script>
