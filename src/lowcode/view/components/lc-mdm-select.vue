<template>
  <el-select v-model="val" filterable clearable :disabled="disabled" :style="showStyle" @change="handleChange" v-if="editing">
    <el-option
      v-for="item in items"
      :key="item.item_code"
      :label="item.item_code+' '+item.item_name"
      :value="item.item_code"
    />
  </el-select>
  <span v-else-if="!editing">{{ showLabel }}</span>
</template>

<script>

import { selectObjectDefinePage } from '@/lowcode/api/lowcode'

export default {
  name: 'lc-mdm-select',
  props: {
    editing:{
      type: Boolean,
      default: true
    },
    mdmCode: String,
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
      items: [],
      val: null
    }
  },
  computed: {
    showStyle() {
      return 'width: ' + (this.width ? this.width + 'px;' : '200px;')
    }
  },
  watch: {
    'mdmCode': {
      handler(nval, oval) {
        this.loadData()
      },
      deep: true,
      immediate: true
    },
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
  computed: {
    showLabel() {
      if (this.val && this.items && this.items.length > 0) {
        let temp = this.items.filter(a => a.item_code == this.val)
        if (temp.length > 0) {
          return temp[0].item_name
        }
      }
      return ''
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$store.dispatch('lowCode/getMdmItems', this.mdmCode).then(ret => {
        this.items = ret
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
