<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      <i class="el-icon-arrow-down el-icon--right" style="font-weight:bold;" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(btn, index) in buttons" :command="btn.name">{{ btn.name }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'XRowOperator',
  props: {
    buttons: {
      type: Array
    },
    idx: {
      type: Number
    },
    row: {
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
    'buttons': {
      handler(nval, oval) {
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCommand(command) {
      console.log('x-row-operator @click', command)
      if (this.$props.view.action) {

        let actionDefine = JSON.parse(this.$props.view.action)

        if (actionDefine.type == '1') {
          this.$props.self.openView(actionDefine.viewId, this.$props.row)
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

</script>>
