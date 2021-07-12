<template>
  <section :class="eid">
    <el-table ref="table"
      :row-key="'id'"
      :data="rows" border style="width: 100%;"
      :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column prop="fieldName" label="字段名称" width="120"/>
      <el-table-column prop="fieldType" label="字段类型"/>
      <el-table-column prop="fieldCode" label="字段代码" width="180"/>

      <el-table-column prop="refTableId" label="关联对象">
        <template scope="scope">
          {{ getRelationObjName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="refFieldCode" label="关联字段">
        <template scope="scope">
          {{  getRelationFieldName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="erType" label="关系">
        <template scope="scope">
          <el-select v-model="scope.row.erType" @change="handleErChange(scope.row)">
            <el-option :key="''" :label="'无'" value="''" />
            <el-option :key="'1'" :label="'一对一'" value="1" />
            <el-option :key="'N'" :label="'多对一'" value="N" />
          </el-select>
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

import store from '@/store'
import { mapState } from 'vuex'
import { selectObjectFieldDefinePage, saveObjectFieldDefine } from '@/api/object-field-define'

import { uuid } from 'vue-uuid'

export default {
  name: 'ObjectFieldList',
  components: {
  },
  props: {
    objectId: String,
    height: Number,
  },
  data() {
    return {
      eid: 'e' + uuid.v1(),
      defaultQueryConditions:[],
      rows: [],

      total: 0,
      pageSize: 20,
      pageNo: 1,
      pageSizes: [10, 20, 40],

      sels: [],

      relations: {

      }
    }
  },
  computed: {
    ...mapState({
      mdm: function(state) {
        return state.mdm.data
      },
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
    }
  },
  created() {
    this.$store.dispatch('mdm/getMdmData', '')
  },
  mounted() {
  },
  methods: {
    handleSizeChange(val) {
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    loadData() {

      let queryObj = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        conditions: [
          {field: 'oid', op: 'eq', values: [this.$props.objectId]},
          {field: 'value_ref_type', op:'eq', values:['4']},
          {field: 'ref_field_code', op:'eq', values:['id']},
        ]
      }

      selectObjectFieldDefinePage(queryObj).then(ret => {
        if (ret.success) {
          this.showFields = ret.data.rows
          this.total = ret.data.total
          this.rows = ret.data.rows

          this.rows.forEach((item) => {
            this.loadRelationObjectDefines(item.refTableId)
          })
        }
      })
    },

    loadRelationObjectDefines(id) {
      this.$store.dispatch('lowCode/getObjectDefine', id).then(ret => {
        if (ret) {
          console.log('load ',id, ret)
          this.relations[''+ret.id] = ret
          this.rows = [].concat(this.rows)
        }
      })
    },

    getRelationObjName(row) {
      console.log('getRelationObjName', this.relations[''+row.refTableId])
      if (this.relations[''+row.refTableId]) {
        return this.relations[''+row.refTableId].objectName
      }
      return ''
    },
    getRelationFieldName(row) {
      let name = ''
      if (this.relations[''+row.refTableId]) {
        this.relations[''+row.refTableId].fields.forEach(f => {
          if (f.fieldCode == row.refFieldCode) {
            name = f.fieldName
          }
        })
      }
      return name
    },

    loaded() {
      return this.rows.length > 0
    },
    handleSelectionChange(sels) {
      this.sels = sels
      this.$emit('selection-change', this.sels)
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },

    handleErChange(row) {
      debugger
      saveObjectFieldDefine(row).then(ret => {
        if (ret.success) {
          this.$message.info('操作成功');
        }
      })
    }

  }
}

</script>
