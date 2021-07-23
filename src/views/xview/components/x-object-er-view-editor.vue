<template>
  <div>
    <el-table ref="table"
      :row-key="'id'"
      :data="relations" border style="width: 100%;"
      :height="300">
      <el-table-column prop="objectId" label="对象ID" width="120"/>
      <el-table-column prop="objectName" label="对象名称" width="120"/>
      <el-table-column prop="visible" label="是否显示">
        <template scope="scope">
          <el-switch v-model="scope.row.visible"
            active-color="#13ce66" inactive-color="#ff4949"
            @change="handleChange(scope.row)"
            style="margin-top: 5px;">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { selectObjectFieldDefinePage } from '@/api/object-field-define'
import { selectViewDefinePage } from '@/api/view-define'

export default {
  name:'x-object-er-view-editor',
  props: {
    objectId: [String, Number],
    viewJson: Object
  },
  data() {
    return {
      relations: [],
      objectDefine: {},
      objectListViewId: {},
    }
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadEntityRelation()
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
    },
  },
  mounted() {
    this.loadEntityRelation()
  },
  methods: {
    loadEntityRelation() {
      selectObjectFieldDefinePage({
        conditions: [
          {field: 'ref_table_id', op: 'eq', values: [this.$props.objectId]},
          {field: 'ref_field_code', op: 'eq', values: ['id']},
          {field: 'er_type', op: 'in', values: ['N']},
        ]
      }).then(ret => {
        if (ret.success) {
          this.relations = []
          ret.data.rows.forEach((item) => {
            this.relations.push({
              objectId: item.oid,
              objectName: '',
              visible: false
            })
          })

          this.loadEntityDefine()
        }
      })
    },

    getRelation(objectId) {
      let temp = this.relations.filter(a => a.objectId == objectId)
      if (temp.length > 0) {
        return temp[0]
      }
      return null
    },

    loadEntityDefine() {
      this.relations.forEach((item) => {
        this.$store.dispatch('lowCode/getObjectDefine', item.objectId).then(ret => {
          this.objectDefine[''+item.objectId] = ret
          this.getRelation(item.objectId)['objectName'] = ret.objectName
          this.checkAndRender()
        })

        selectViewDefinePage({
          conditions: [
            {field: 'object_id', op:'eq', values:[''+item.objectId]},
            {field: 'view_type', op:'eq', values:['object-list']},
          ]
        }).then(ret => {
          if (ret.success && ret.data.rows.length > 0) {
            this.objectListViewId[''+item.objectId] = ret.data.rows[0]
          }
          else {
            this.objectListViewId[''+item.objectId] = 'UNDEFINED'
          }
          this.checkAndRender()
        })
      })
    },

    checkAndRender() {
      let flag = true
      this.relations.forEach((item) => {
        if (!this.relations[''+item.objectId]) {
          flag = false
        }
        if (!this.objectListViewId[''+item.objectId]) {
          flag = false
        }
      })
      if (flag) {
        if (this.viewJson.ers) {
          this.viewJson.ers.forEach((er) => {
            if (er.visible) {
              this.getRelation(er.objectId).visible = true
            }
          })
        }

        this.relations = [].concat(this.relations)
      }
    },

    handleChange(row) {
      if (row.visible && this.objectListViewId[''+row.objectId] == 'UNDEFINED') {
        this.$message.error('该对象没有定义列表视图')
        row.visible = false
      }

      this.$set(this.viewJson, 'ers', JSON.parse(JSON.stringify(this.relations)))
    }
  }
}

</script>
