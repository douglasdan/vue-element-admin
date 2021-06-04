<template>
  <div>
    <div style="width: 100%; padding-left: 10px; padding-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right; font-size: 14px;">
      名称：<el-input v-model="viewDefine.viewName" style="width: 200px;"></el-input>
      <div style="display: inline-block; float: right;">
        <el-button type="primary" @click="submitSave">保存</el-button>
      </div>
    </div>

    <div style="width: 100%; margin-right: 10px; margin-top: 10px; margin-bottom: 10px; float: right;">
      <x-run ref="xrun" :viewJson="viewDefine.viewContent"></x-run>
    </div>
  </div>
</template>

<script>

import XRun from '@/views/xview-editor/run'
import { saveViewDefine } from '@/api/view-define'

export default {
  name: 'ViewList',
  components: { XRun },
  props: {
    viewDefine: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      //
    }
  },
  methods: {
    submitSave() {
      console.log('save json '+this.$refs.xrun.getJsonContent())
      this.viewDefine.viewContent = this.$refs.xrun.getJsonContent()

      saveViewDefine(this.viewDefine).then(ret => {
        if (ret.success) {
          this.$emit('close', {})
        }
      })

    }
  }

}
</script>
