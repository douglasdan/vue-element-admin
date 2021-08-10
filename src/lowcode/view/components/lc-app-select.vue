<template>
  <el-select v-model="val" v-if="rows" clearable @input="handleChange" :style="showStyle">
    <el-option :label="item.appName" :value="item.appCode" v-for="(item,i) in rows"></el-option>
  </el-select>
</template>

<script>
import { selectAppPage } from '@/lowcode/api/lowcode'

export default {
  name: 'lc-object-data-select',
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
  watch: {
    'value': {
      handler(nval, oval) {
        this.val = nval
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    showStyle() {
      return 'width: '+ (this.width ? this.width+'px;' : '200px;')
    }
  },
  data() {
    return {
      val: '',
      objectDefine: null,
      total:0,
      rows:[],
      sels: [],

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
