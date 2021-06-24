<template>
  <section>
    <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex" v-if="metadata.viewButtons && metadata.viewButtons.length > 0">
      <div style="display: flex-inline;" />
      <div style="right: 10px; float: right; position: absolute;">
        <x-button v-for="(btn, index) in metadata.viewButtons" :view="btn" :self="self"/>
      </div>
    </el-row>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">

      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" />
      <el-table-column v-for="(f, i) in metadata.showFields" :prop="f.fieldCode"
                :label="fieldName(f.fieldCode)"
                :show-overflow-tooltip="sholdTooltip(f.fieldCode)"
                width="120" :formatter="formatter" />

      <el-table-column width="45">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <x-row-operator :buttons="metadata.rowButtons" :idx="scope.$index" :row="scope.row" :self="self"/>
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
  </section>
</template>

<script>

import { getViewDefineById } from '@/api/view-define'
import { getObjectDefineById } from '@/api/object-define'
import { selectObjectFieldDefinePage } from '@/api/object-field-define'
import { selectObjectDataPage } from '@/api/object-data'

export default {
  name: 'XObjectList',
  props: {
    viewId: {
      type: String,
      required: false
    },
    viewDefine: {
      type: Object,
      required: false
    }
  },
  watch: {
    'viewId': {
      handler(nval, oval) {
        this.loadMetaData()
      },
      deep: true,
      immediate: true
    },
    'viewDefine': {
      handler(nval, oval) {
        this.loadViewDefine()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      self: this,
      metadata: {
        viewId: 1,
        objectId: 1,
        objectDefine: null,
        objectFieldDefine: null,

        selectable: true,
        showFields: [],
        viewButtons: [],
        rowButtons: []
      },
      objectFieldDefineMap: {
      },

      query: {

      },

      rows: [],
      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      sels: []
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
  created() {
    this.loadMetaData()
    this.loadViewDefine()
  },
  methods: {
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    loadMetaData() {
      if (!this.$props.viewId) {
        return
      }

      getViewDefineById(this.$props.viewId).then(ret => {
        if (ret.success) {
          const viewContent = JSON.parse(ret.data.viewContent)

          this.metadata.objectId = ret.data.objectId

          this.metadata.selectable = viewContent.selectable
          this.metadata.showFields = viewContent.showFields
          this.metadata.viewButtons = viewContent.viewButtons
          this.metadata.rowButtons = viewContent.rowButtons
          return ret.data.objectId
        } else {
          return null
        }
      }
      )
        .then(objectId => {
          if (objectId) {
            return getObjectDefineById(objectId).then(ret => {
              if (ret.success) {
                this.metadata.objectDefine = ret.data
                return objectId
              } else {
                return null
              }
            })
          }
        })
        .then(objectId => {
          if (objectId) {
            return this.$store.dispatch('lowCode/getObjectDefine', objectId).then(ret => {
              this.metadata.objectFieldDefine = ret.fields
              return objectId
            })
          }
        })
        .then(objectId => {
        //
          this.objectFieldDefineMap = {}

          this.metadata.objectFieldDefine.forEach((item, index) => {
            this.objectFieldDefineMap[item.fieldCode] = item
          })

          return null
        })
        .then(ret => {
          this.loadData()
        })
    },
    loadViewDefine() {

      console.log('loadViewDefine')

      if (this.$props.viewDefine && this.$props.viewDefine.objectId && this.$props.viewDefine.viewContent) {

        const viewContent = JSON.parse(this.$props.viewDefine.viewContent)

        this.metadata.objectId = this.$props.viewDefine.objectId

        this.metadata.selectable = viewContent.selectable
        this.metadata.showFields = viewContent.showFields
        this.metadata.viewButtons = viewContent.viewButtons
        this.metadata.rowButtons = viewContent.rowButtons

        getObjectDefineById(this.metadata.objectId).then(ret => {
          if (ret.success) {
            this.metadata.objectDefine = ret.data
          }
        })

        this.$store.dispatch('lowCode/getObjectDefine', this.$props.viewDefine.objectId).then(ret => {

          if (ret) {
            this.metadata.objectFieldDefine = ret.fields

            this.objectFieldDefineMap = {}

            this.metadata.objectFieldDefine.forEach((item, index) => {
              this.objectFieldDefineMap[item.fieldCode] = item
            })
          }

        })
        .then(ret => {
          this.loadData()
        })
      }
    },
    fieldName(code) {
      if (this.objectFieldDefineMap[code]) {
        return this.objectFieldDefineMap[code].fieldName
      }
      return ''
    },
    sholdTooltip(code) {
      let fieldDefine = this.objectFieldDefineMap[code]
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
    loadData() {
      selectObjectDataPage(this.metadata.objectId, {
        conditions: []
      }).then(ret => {
        if (ret.success) {
          this.total = ret.data.total
          this.rows = ret.data.rows
        }
      })
    }
  }

}

</script>
