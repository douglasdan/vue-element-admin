<template>
  <section>
    <el-table ref="table"
      :data="rows"
      :row-key="'fieldCode'"
      border style="width: 100%;" :height="tableHeight">
      <el-table-column prop="fieldName" label="字段名称" :formatter="formatter" />
      <el-table-column prop="fieldType" label="字段类型" :formatter="formatter" />
      <el-table-column prop="fieldCode" label="字段代码" :formatter="formatter" width="160"/>

      <el-table-column width="300">
        <template scope="scope">
          <div style="display: flex;">
            <div style="width: 120px;">
              <el-col :span="24">
                <x-query-op-select v-model="scope.row.opType" @change="refreshRow"></x-query-op-select>
              </el-col>
            </div>
            <div v-if="scope.row.opType === ''">
              <el-input size="mini" v-model="scope.row.values" placeholder="多个值用逗号分隔" @change="handleValueChange"/>
            </div>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </section>
</template>

<script>

import store from '@/store'
import { mapState } from 'vuex'
import { selectObjectFieldDefinePage, saveObjectFieldDefine } from '@/api/object-field-define'

import  xQueryOpSelect from '@/views/xview/x-query-op-select'

export default {
  name: 'ObjectFieldConditionEditor',
  components: {
    xQueryOpSelect
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
      fieldMap: {},
      rows: [],
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
    this.loadData()
  },
  methods: {
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
          this.rows = ret.fields

          this.rows.forEach((row, i) => {
            row.opType = ''
            row.sortNo = i
            row.values = ''
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

      if (this.$props.viewJson.queryDefine.conditions.length == 0) {

        let temp = []
        this.rows.forEach((row) => {
          temp.push({
            fieldName: row.fieldName,
            fieldCode: row.fieldCode,
            fieldType: row.fieldType,
            opType: '',
            sortNo: row.sortNo,
            values: ''
          })
        })

        this.$set(this.$props.viewJson.queryDefine, 'conditions', temp)
      }
      else {
        this.rows = this.$props.viewJson.queryDefine.conditions
      }

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
    refreshRow(nval) {
      console.log('====> '+nval)
      this.rows = [].concat(this.rows)
    },
    handleValueChange(nval, oval) {
      console.log(oval+"===>"+nval)
    }
  }
}

</script>
