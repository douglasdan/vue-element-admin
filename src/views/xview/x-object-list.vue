<template>
  <section>
    <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
      <div style="display: flex-inline;">

      </div>
      <div style="right: 10px; float: right; position: absolute;">
        <x-button v-for="(btn, index) in metadata.viewButtons" :view="btn"></x-button>
      </div>
    </el-row>
    <el-table :data="rows" border style="width: 100%;" :height="tableHeight">
      <el-table-column type="index" label="序号" />
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column v-for="(f, i) in metadata.showFields" :prop="f.fieldCode" :label="fieldName(f.fieldCode)" width="120" :formatter="formatter"></el-table-column>

      <el-table-column width="45" >
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <x-row-operator :buttons="metadata.rowButtons" :idx="scope.$index" :row="scope.row"></x-row-operator>
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
  name: 'x-object-list',
  props: {
    viewId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
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
  created() {
    this.loadMetaData()
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
  methods: {
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    loadMetaData() {
      if (!this.$props.viewId) {
        this.$message.error('页面定义错误')
        return
      }

      getViewDefineById(this.$props.viewId).then(ret => {
          if (ret.success) {
            let viewContent = JSON.parse(ret.data.viewContent)

            this.metadata.objectId = ret.data.objectId

            this.metadata.selectable = viewContent.selectable
            this.metadata.showFields = viewContent.showFields
            this.metadata.viewButtons = viewContent.viewButtons
            this.metadata.rowButtons = viewContent.rowButtons
            return ret.data.objectId
          }
          else {
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
            }
            else {
              return null
            }
          })
        }
      })
      .then(objectId => {
        if (objectId) {
          return selectObjectFieldDefinePage({
            conditions:[
              {
                field: 'oid',
                op: 'eq',
                values: [objectId]
              }
            ]
          }).then(ret => {
            if (ret.success) {
              this.metadata.objectFieldDefine = ret.data.rows
              return objectId
            }
            else {
              return null
            }
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
    fieldName(code) {
      if (this.objectFieldDefineMap[code]) {
        return this.objectFieldDefineMap[code].fieldName
      }
      return ''
    },
    formatter(row, column, cellValue, index) {
      // if (column.property == '') {
      // }
      return cellValue
    },
    loadData() {
      //
      selectObjectDataPage(this.metadata.objectId, {
        conditions:[]
      }).then(ret => {

        if (ret.success) {
          this.total = ret.data.total
          this.rows = ret.data.rows
        }

      })

    },
  }

}

</script>
