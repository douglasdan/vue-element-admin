<template>
  <el-button v-bind="view.props" @click="handleClick">{{ view.name }}</el-button>
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
        // 覆盖后台定义好的action
        const action = this.$props.view.action
        // let code = `function runit(){${this.view.action}}`
        const fun = new Function(`return function(){${action}}`)()
        console.log(fun)

        fun.bind(this.$props.self).apply()
      } else {

      }
    }
  }
}
</script>
