<template>
  <el-button :size="size ? size : 'small'"v-bind="view.props" @click="handleClick">{{ view.name }}</el-button>
</template>

<script>

export default {
  name: 'XButton',
  components: {
  },
  props: {
    view: {
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
  watch: {
    'view': {
      handler(nval, oval) {
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      // 加载按钮资源信息，权限
      // this.$props.view.btnId = '1'
    },
    handleClick() {
      console.log('x-button @click', this.$props.view.name)
      if (this.$props.view.action) {

        let actionDefine = {}
        if (typeof (this.$props.view.action) == 'string') {
          if (this.$props.view.action.indexOf('{') == 0) {
            actionDefine = JSON.parse(this.$props.view.action)
          }
          else {
            actionDefine = {
              type: '2',
              script: this.$props.view.action
            }
          }
        }else {
          actionDefine = this.$props.view.action
        }

        if (actionDefine.type == '1') {
          this.$props.self.openView(actionDefine.viewId, this.row)
        }
        else if (actionDefine.type == '2') {
          const fun = new Function(`return function(){${actionDefine.script}}`)()
          console.log(fun)

          fun.bind(this.$props.self).apply()
        }

      }
      else {
        this.$message.error('未定义按钮功能逻辑')
      }
    }
  }
}
</script>
