<template>
  <el-button :size="size ? size : 'small'" v-bind="btn.props" @click="handleClick" :icon="btn.icon"
    v-if="btn.name && btn.icon">{{ btn.name }}</el-button>
  <el-button :size="size ? size : 'small'" v-bind="btn.props" @click="handleClick" v-else-if="btn.name">{{ btn.name }}</el-button>
  <i :class="btn.icon" v-bind="btn.props" @click="handleClick" v-else="btn.icon"
    :style="iconStyle"></i>
</template>

<script>

import { type2Color } from '@/utils'

export default {
  name: 'lc-button',
  components: {
  },
  props: {
    btn: {
      type: Object
    },
    self: {
      type: Object
    },
    size: String,
    row: {
      type: Object,
      required: false
    }
  },
  data() {
    return {}
  },
  computed: {
    iconStyle() {
      let c = type2Color(this.btn.props.type)
      return 'font-size: 14px; font-weight: 600; margin-right: 10px; color: '+c+';'
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      // 加载按钮资源信息，权限
      // this.btn.btnId = '1'
    },
    handleClick() {
      console.log('x-button @click', this.btn.name)
      if (this.btn.action) {

        let actionDefine = {}
        if (typeof (this.btn.action) == 'string') {
          if (this.btn.action.indexOf('{') == 0) {
            actionDefine = JSON.parse(this.btn.action)
          }
          else {
            actionDefine = {
              type: '2',
              script: this.btn.action
            }
          }
        }else {
          actionDefine = this.btn.action
        }

        if (actionDefine.type == '1') {
          this.$props.self.openView(actionDefine.viewId, this.row)
        }
        else if (actionDefine.type == '2') {
          const fun = new Function('row',`return function(row){${actionDefine.script}}`)()
          console.log(fun)

          let d = this.$props.row
          fun.bind(this.$props.self)(d)
        }

      }
      else {
        this.$message.error('未定义按钮功能逻辑')
      }
    }
  }
}
</script>
