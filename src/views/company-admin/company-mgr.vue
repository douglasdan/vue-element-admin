<template>
  <div style="width: 600px; margin: 20px;">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="企业名称">
        <el-input v-model="form.companyName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CompanyMgr',
  data() {
    return {
      form: {
        companyName: ''
      }
    }
  },
  created() {

  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>
