<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      <i class="el-icon-arrow-down el-icon--right" style="font-weight:bold;"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :command="btn.name" v-for="(btn, index) in buttons">{{ btn.name }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'x-row-operator',
  props: {
    buttons: {
      type: Array
    },
    idx: {
      type: Number
    },
    row: {
      type: Object
    }
  },
  watch: {
    'buttons': {
      handler(nval, oval) {
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {}
  },
  methods: {
    handleCommand(command) {
      console.log('click on item ' + command+ ' '+this.$props.idx+' '+JSON.stringify(this.$props.row));
    }
  }
}


</script>>
