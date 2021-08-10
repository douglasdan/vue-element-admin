<template>
  <el-select v-if="rows" v-model="val" clearable :style="showStyle" @input="handleChange">
    <el-option v-for="(item,i) in rows" :label="item.appName" :value="item.appCode" />
  </el-select>
</template>

<script>
import { selectAppPage } from '@/lowcode/api/lowcode'

export default {
  name: 'LcObjectDataSelect',
  props: {
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
