<template>
  <el-select v-if="editing" v-model="val" clearable :style="showStyle" @input="handleChange">
    <el-option v-for="(item,i) in rows" :label="item.label" :value="item.value" />
  </el-select>
  <span v-else-if="!editing">{{ showLabel }}</span>
</template>

<script>
export default {
  name: 'lc-bool',
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
      rows: [{
        label: '是', value: '1'
      },{
        label: '否', value: '0'
      }],
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
