<template>
  <div />
</template>

<script>

export default {
  name: 'FiCostDist',
  data() {
    return {

    }
  }

}

</script><template>
  <div>
    <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
      <el-step title="选择待分摊对象" ></el-step>
      <el-step title="选择分摊对象" ></el-step>
      <el-step title="选择分摊因子" ></el-step>
      <el-step title="试算运行" ></el-step>
    </el-steps>
  </div>
</template>

<script>

export default {
  name: 'fi-cost-distribute',
  data() {
    return {

    }
  },

}

</script>
