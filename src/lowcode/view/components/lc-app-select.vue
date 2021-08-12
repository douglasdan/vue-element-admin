<template>
  <el-select v-if="editing" v-model="val" clearable :style="showStyle" @input="handleChange">
    <el-option v-for="(item,i) in rows" :label="item.appName" :value="item.appCode" />
  </el-select>
  <span v-else-if="!editing">{{ showLabel }}</span>
</template>

<script>
import { selectAppPage } from '@/lowcode/api/lowcode'

export default {
  name: 'LcObjectDataSelect',
  props: {
    editing:{
      type: Boolean,
      default: true
    },
    value: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    width: [String, Number],
    filter: {
      type: Object,
      default: function() {
        return {
          conditions: []
        }
      }
    }
  },
  data() {
    return {
      val: '',
      objectDefine: null,
      total: 0,
      rows: [],
      sels: []

    }
  },
  computed: {
    showStyle() {
      return 'width: ' + (this.width ? this.width + 'px;' : '200px;')
    },
    showLabel() {
      if (this.val && this.rows && this.rows.length > 0) {
        let temp = this.rows.filter(a => a.appCode == this.val)
        if (temp.length > 0) {
          return temp[0].appName
        }
      }
      return ''
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        this.val = nval
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      selectAppPage(this.filter).then(ret => {
        if (ret.success) {
          this.total = ret.data.total
          this.rows = ret.data.rows
        }
      })
    },
    handleChange(nval, oval) {
      this.$emit('input', nval)
      this.$emit('change', {
        nval: nval, oval: oval
      })
    }
  }
}
</script>

<style scoped="true">

</style>
