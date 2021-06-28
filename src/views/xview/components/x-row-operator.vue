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
      console.log('click on item ' + command + ' ' + this.$props.idx + ' ' + JSON.stringify(this.$props.row))

      const btn = this.$props.buttons.filter(a => a.name == command)[0]

      const fun = new Function(`return function(row){${btn.action}}`)()
      console.log(fun)

      fun.call(this.$props.self, this.$props.row)
    }
  }
}

</script>>
