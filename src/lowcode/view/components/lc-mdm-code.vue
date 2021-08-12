<template>
  <el-select v-model="val" filterable clearable :disabled="disabled" :style="showStyle" @change="handleChange">
    <el-option
      v-for="item in rows"
      :key="item.mdm_code"
      :label="item.mdm_code+' '+item.mdm_name"
      :value="item.mdm_code"
    />
  </el-select>
</template>

<script>

import { selectObjectDefinePage } from '@/lowcode/api/lowcode'

export default {
  name: 'lc-mdm-code',
  props: {
    value: String,
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    width: [String, Number]
  },
  data() {
    return {
      rows: [],
      val: null
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
    },
    'disabled': {
      handler(nval, oval) {
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    loadData() {
      this.$store.dispatch('lowCode/getMdmList').then(ret => {
        this.rows = ret
      })
    },
    handleChange(nval, oval) {
      this.val = nval
      this.$emit('input', nval)
      this.$emit('change', nval, oval)
    }
  }
}

</script>
