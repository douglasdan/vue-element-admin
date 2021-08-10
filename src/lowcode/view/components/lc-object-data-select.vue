<template>
  <div>
    <tree-select
      v-if="objectDefine && objectDefine.treeFlag == '1'"
      style="width: 100%;"
      :options="rows"
      placeholder="请选择"
      :multiple="muliple"
      :disabled="disabled"
      :max-height="480"
      :normalizer="normalizer"
      :flat="true"
      :value-consists-of="'LEAF_PRIORITY'"
      :value="vals"
      @select="handleSelect"
      @deselect="handleDeSelect"
    />
    <el-select v-if="!(objectDefine && objectDefine.treeFlag)" v-model="vals" :multiple="muliple" clearable style="width: 100%;" @input="handleChange">
      <el-option v-for="(item,i) in rows" :label="item[objectDefine.labelFieldCode]" :value="item[objectDefine.keyFieldCode]" />
    </el-select>
  </div>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@/styles/tree-select.scss'

import { selectObjectDataPage, selectTreeRootPage, getTree, getObjectDataById } from '@/lowcode/api/lowcode'

export default {
  name: 'LcObjectDataSelect',
  components: { TreeSelect },
  props: {
    value: Array,
    muliple: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    objectCode: String,
    valueFieldCode: String,
    mdmCode: String,
    filter: {
      type: Object,
      default: {
        conditions: []
      }
    }
  },
  data() {
    return {
      objectDefine: null,
      total: 0,
      rows: [],
      sels: [],

      vals: []
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        if (Array.isArray(nval)) {
          this.vals = [].concat(nval)
        } else {
          this.vals = [].concat([nval])
        }
      },
      immediate: true,
      deep: true
    },
    'objectCode': {
      handler(nval, oval) {
        this.loadMetadata()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.loadMetadata()
  },
  methods: {
    async loadMetadata() {
      if (this.objectCode) {
        this.objectDefine = await this.$store.dispatch('lowCode/getObjectDefineByCode', this.objectCode)
        this.loadData()
      }
    },
    loadData() {
      if (this.objectDefine.treeFlag == '1') {
        selectTreeRootPage(this.objectDefine.id, {
          conditions: [{ field: 'lazy', values: ['Y'] }]
        }).then(ret => {
          if (ret.success) {
            ret.data.rows.forEach((row) => {
              row.level = 1
              row.hasChildren = true
            })
            this.total = ret.data.total
            this.rows = ret.data.rows
          }
        })
      } else {
        selectObjectDataPage(this.objectCode, this.filter).then(ret => {
          if (ret.success) {
            this.total = ret.data.total
            this.rows = ret.data.rows
          }
        })
      }
    },
    normalizer(node) {
      return {
        id: this.objectDefine.idFieldCode ? node[this.objectDefine.idFieldCode] : node.id,
        label: node[this.objectDefine.labelFieldCode],
        children: node.children
      }
    },
    handleSelect(node, instanceId) {
      const oval = JSON.parse(JSON.stringify(this.vals))

      const val = '' + (this.objectDefine.idFieldCode ? node[this.objectDefine.idFieldCode] : node.id)
      this.vals.push(val)
      this.$emit('input', this.vals)
      this.$emit('change', {
        nval: this.vals, oval: oval
      })
    },
    handleDeSelect(node, instanceId) {
      const oval = JSON.parse(JSON.stringify(this.vals))

      const val = '' + (this.objectDefine.idFieldCode ? node[this.objectDefine.idFieldCode] : node.id)
      let idx = -1
      for (let i = 0; i < this.vals.length; i++) {
        if (this.vals[i] == val) {
          idx = i
        }
      }

      if (idx > -1) {
        this.vals.splice(idx, 1)
      }
      this.$emit('input', this.vals)

      this.$emit('change', {
        nval: this.vals, oval: oval
      })
    },

    handleChange(nval, oval) {
      this.$emit('input', this.vals)
      this.$emit('change', {
        nval: nval, oval: oval
      })
    }
  }
}
</script>

<style scoped="true">

</style>
