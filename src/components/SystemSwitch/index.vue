<template>
  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
    <div class="sys-func-btn">
      <i class="rot90 el-icon-sort" @click="handleClick" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item><span style="font-weight: 600;" v-show="sys === 2" @click="switchSys(1)">业务后台系统</span></el-dropdown-item>
      <el-dropdown-item><span style="font-weight: 600;" v-show="sys === 1" @click="switchSys(2)">业务前台系统</span></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>

import { resetRouter } from '@/router'

export default {
  name: 'SystemSwitch',
  data() {
    return {
      sys: 1
    }
  },
  mounted() {
    let sys = parseInt(window.localStorage.getItem('SYS'))
    if (!sys) {
      this.sys = 1
    }
    else {
      this.sys = sys
    }
  },
  methods: {
    handleClick() {
      //
    },
    switchSys(val){
      window.localStorage.setItem('SYS', val)

      this.$store.dispatch('tagsView/delAllViews')
      .then(ret => {
        return this.$store.dispatch('permission/clearRoutes')
      })
      .then(ret => {
        return this.$store.dispatch('permission/generateRoutes')
      })
      .then(accessRoutes => {
        resetRouter(accessRoutes)
        this.sys = val
        window.location.replace('/#/')
      })
    }
  }
}

</script>

<style>

  .sys-func-btn{
    display: inline-block;
    height: 50px;
    width: 50px;
    text-align: center;
    vertical-align: top;
  }

  .sys-func-btn:hover {
    background-color: rgb(238, 238, 247);
  }

  .sys-func-btn > i.rot90 {
    vertical-align: middle;
    font-size:24px;
    font-weight: 400;
    color:gray;
    transform: rotate(90deg);
  }
</style>
