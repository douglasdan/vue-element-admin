<template>
  <div>
    <tree-select v-if="objectDefine && objectDefine.treeFlag"
      style="width: 100%;"
      :options="rows"
      placeholder="请选择"
      :multiple="true"
      :disabled="disabled"
      :max-height="480"
      :normalizer="normalizer"
      :flat="true"
      :value-consists-of="'LEAF_PRIORITY'"
      :value="vals"
      @select="handleSelect"
      @deselect="handleDeSelect"
    />
    <el-select v-model="vals" v-if="!(objectDefine && objectDefine.treeFlag)" multiple clearable @change="handleChange" style="width: 100%;">
      <el-option :label="item[objectDefine.labelFieldCode]" :value="item[objectDefine.idFieldCode]" v-for="(item,i) in rows"></el-option>
    </el-select>
  </div>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@/styles/tree-select.scss'

import { selectObjectDataPage, selectTreeRootPage, getTree, getObjectDataById } from '@/api/object-data'

export default {
  name: 'x-object-select',
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
    objectCode: [String]
  },
  data() {
    return {
      objectDefine: null,
      total:0,
      rows:[],
      sels: [],

      vals:[]
      // options: [],
      // selectOne: null
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        if (Array.isArray(nval)) {
          this.vals = [].concat(nval)
        }
        else {
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
    loadMetadata() {
      if (this.objectCode) {
        this.$store.dispatch('lowCode/getObjectDefineByCode', this.objectCode).then(ret => {
          this.objectDefine = ret
          this.loadData()
        })
      }
    },
    loadData() {
      if (this.objectDefine.treeFlag) {
        selectTreeRootPage(this.objectDefine.id, {
          conditions: [{field: 'lazy', values:['Y']}]
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
        selectObjectDataPage(this.objectDefine.id, {}).then(ret => {
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
      let val = ''+(this.objectDefine.idFieldCode ? node[this.objectDefine.idFieldCode] : node.id)
      this.vals.push(val)
      this.$emit('input', this.vals)
    },
    handleDeSelect(node, instanceId) {
      let val = ''+(this.objectDefine.idFieldCode ? node[this.objectDefine.idFieldCode] : node.id)
      let idx = -1
      for (let i=0;i<this.vals.length;i++) {
        if (this.vals[i] == val) {
          idx = i
        }
      }

      if (idx > -1) {
        this.vals.splice(idx,1)
      }
      this.$emit('input', this.vals)
    },

    handleChange() {
      this.$emit('input', this.vals)
    }
  }
}
</script>

<style scoped="true">

</style>
