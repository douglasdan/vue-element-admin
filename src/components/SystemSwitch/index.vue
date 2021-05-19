<template>
  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
    <div class="sys-func-btn">
      <i class="rot90 el-icon-sort" @click="handleClick" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <router-link to="/backend">
        <el-dropdown-item><span style="font-weight: 600;">业务后台系统</span></el-dropdown-item>
      </router-link>
      <router-link to="/profile/index">
        <el-dropdown-item><span style="font-weight: 600;">企业后台管理</span></el-dropdown-item>
      </router-link>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>

export default {
  name: 'SystemSwitch',
  data() {
    return {}
  },
  created() {

  },
  methods: {
    handleClick() {

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
