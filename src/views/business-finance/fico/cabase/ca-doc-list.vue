<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="档案定义" name="1">
      <show-view :object-id="107" :view-type="'object-list'"></show-view>
    </el-tab-pane>
    <el-tab-pane label="档案数据" name="2">
      <show-view :object-id="108" :view-type="'object-list'"></show-view>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

export default {
  data() {
    return {
      activeName: '1'
    }
  },
}

</script>
