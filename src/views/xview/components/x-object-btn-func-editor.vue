<template>
  <div>
    <el-row>
      <el-select v-model="actionJson.type">
        <el-option label="打开页面" value="1" />
        <el-option label="执行脚本" value="2" />
      </el-select>

      <view-select v-model="actionJson.viewId" @change="handleChange" v-if="actionJson.type == '1'"></view-select>
    </el-row>
    <el-row v-if="actionJson.type == '2'">
      <el-input v-model="actionJson.script" type="textarea" placeholder="" style="width: 400px;" @change="handleChange"/>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'x-object-btn-func-editor',
  props: {
    value: [String, Object]
  },
  watch: {
    'value': {
      handler(nval, oval) {
        this.actionJson = nval
        if(nval && typeof(nval) == 'string') {
          if (nval.indexOf('{') == 0) {
            this.actionJson = JSON.parse(nval)
          }
          else {
            this.actionJson = {
              type: '2',
              viewId: '',
              script: nval
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
  },
  data(){
    return {
      actionJson: {
        type: '',   //1, 2
        viewId: '', //type=1,打开viewId的页面
        script: ''
      }
    }
  },
  methods: {
    handleChange() {
      if (this.actionJson.type == '1') {
        this.actionJson.script = ''
      }

      this.$emit('input', JSON.stringify(this.actionJson))
      this.$emit('change', JSON.stringify(this.actionJson))
    }
  }
}

</script>
