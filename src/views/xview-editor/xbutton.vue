<template>
  <el-button v-bind="view.props" @click="handleClick">{{ view.name }}</el-button>
</template>

<script>

export default {
  name: 'x-button',
  components: {
  },
  props: {
    view: {
      type: Object
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {

      //加载按钮资源信息，权限
      //this.$props.view.btnId = '1'

    },
    handleClick() {
      if (this.view.action) {
        // 覆盖后台定义好的action
        let action = this.view.action
        // let code = `function runit(){${this.view.action}}`
        let fun = new Function(`return function(){${action}}`)()
        console.log(fun)

        fun.bind(this).apply()

      } else {

      }
    }
  }
}
</script>
