<template>
  <section>
    <el-row v-if="viewJson.viewButtons && viewJson.viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
      <div style="display: flex-inline;" >
        <el-link type="primary" style="line-height: 32px;" @click="toggleQueryPanel" v-show="queryBtnVisible()">筛选</el-link>
      </div>
      <div style="right: 10px; float: right; position: absolute;">
        <x-button v-for="(btn, index) in viewJson.viewButtons" :view="btn" :self="self" />
      </div>
    </el-row>

    <x-object-filter :object-id="objectId" :viewJson="viewJson"
      ref="refObjectFilter"
      v-show="queryPanelVisible" >
    </x-object-filter>

    <el-table :data="rows" border style="width: 100%;"
      highlight-current-row
      @header-dragend="handleHeaderDragend"
      :height="tableHeight">

      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" />
      <el-table-column
        v-for="(f, i) in viewJson.showFields"
        :prop="f.fieldCode"
        :label="fieldName(f.fieldCode)"
        :show-overflow-tooltip="showTooltip(f.fieldCode)"
        :width=" !!f.width ? f.width : 100"
        :formatter="formatter"
      />

      <el-table-column width="45">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <x-row-operator :buttons="viewJson.rowButtons" :idx="scope.$index" :row="scope.row" :self="self" />
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="margin: 5px; float: right;">
      <el-pagination
        :current-page.sync="pageNo"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog ref="showViewDialog" :visible.sync="showView.visible" width="80%" append-to-body>
      <show-view :view-define="showView.viewDefine">
      </show-view>
    </el-dialog>

  </section>
</template>

<script>

import { getObjectDefineById } from '@/api/object-define'
import { selectObjectFieldDefinePage } from '@/api/object-field-define'
import { selectObjectDataPage } from '@/api/object-data'
import { getViewDefineById } from '@/api/view-define'

import xObjectFilter from '@/views/xview/x-object-filter'

export default {
  name: 'x-object-list-view',
  components: {
    'x-object-filter': xObjectFilter
  },
  props: {
    objectId: {
      type: String,
      required: false
    },
    viewJson: {
      type: Object,
      required: false
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      self: this,
      objectDefine: null,
      objectFieldDefine: null,
      objectFieldDefineMap: {},

      queryPanelVisible: false,
      query: {
        //
      },
      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      sels: [],

      showView: {
        visible: false,
        viewDefine: null
      }

    }
  },
  computed: {
    tableHeight() {
      const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
      return h
    }
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadObject()
      },
      deep: true,
      immediate: true
    },
    'viewJson': {
      handler(nval, oval) {
        //
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  methods: {
    queryBtnVisible() {
      if (this.viewJson.queryDefine && this.viewJson.queryDefine.conditions) {
        return this.viewJson.queryDefine.conditions.filter(a => a.visible && a.visible && a.opType != '').length > 0
      }
      return false
    },
    toggleQueryPanel() {
      this.queryPanelVisible = !this.queryPanelVisible
      console.log('toggle query panel')
    },
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      this.$props.viewJson.showFields.forEach((item) => {
        if (item.fieldCode == column.property) {
          item.width = newWidth
        }
      })
    },
    loadObject() {
      if (this.objectId) {
        this.$store.dispatch('lowCode/getObjectDefine', this.objectId).then(ret => {
          this.objectDefine = ret
          this.objectFieldDefine = ret.fields

          this.objectFieldDefineMap = {}
          this.objectFieldDefine.forEach((item, index) => {
            this.objectFieldDefineMap[item.fieldCode] = item
          })
        })

        this.loadData()
      }
    },

    fieldName(code) {
      if (this.objectFieldDefineMap[code]) {
        return this.objectFieldDefineMap[code].fieldName
      }
      return ''
    },
    showTooltip(code) {
      const fieldDefine = this.objectFieldDefineMap[code]
      if (fieldDefine) {
        if (fieldDefine.fieldType == 'text' && fieldDefine.fieldLength >= 20) {
          return true
        }
      }
      return false
    },
    formatter(row, column, cellValue, index) {
      // if (column.property == '') {
      // }
      return cellValue
    },
    resetQueryCond() {
      if (!this.$refs.refObjectFilter) {
        this.$nextTick(() => {
          this.resetQueryCond()
        })
        return
      }

      this.$refs.refObjectFilter.resetValues()
    },

    loadData() {

      if (!this.$refs.refObjectFilter) {
        this.$nextTick(() => {
          this.loadData()
        })
        return
      }

      let queryObj = {
        conditions: []
      }
      queryObj.conditions = this.$refs.refObjectFilter.getConditions()

      selectObjectDataPage(this.objectId, queryObj).then(ret => {
        if (ret.success) {
          this.total = ret.data.total
          this.rows = ret.data.rows
        }
      })
    },

    openView(viewId) {
      //
      console.log('x-object-list-view showView', viewId)

      if (viewId) {

        getViewDefineById(viewId).then(ret => {
          if (ret.success) {
            this.showView.viewDefine = ret.data
            this.showView.visible = true
          }
          else {
            //
          }

        })

      }
      //
    },

    deleteDataRow() {
      //TODO

    }

  }

}

</script>
