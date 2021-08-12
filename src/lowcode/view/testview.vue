<template>
  <div>
    <!-- <lc-view-editor :view-define="viewDefine"/> -->
    <lc-object-list></lc-object-list>
  </div>
</template>

<script>

import { param2Obj } from '@/utils'
import { saveViewDefine, getViewDefineById } from '@/lowcode/api/lowcode'
import lcObjectList from '@/lowcode/admin/lc-object-list'

export default {
  components: { lcObjectList },
  data() {
    return {
      viewId: '',
      viewDefine: {
        objectCode: '',
        viewCode: '',
        templateCode: '',
        viewJson: {}
      }
    }
  },
  mounted() {
    let params = param2Obj(window.location.href)
    if (params.id) {
      this.viewId = params.id

      if (this.viewId) {
        getViewDefineById(this.viewId).then(ret => {
          if (ret.success && ret.data) {
            ret.data.viewJson = JSON.parse(ret.data.viewJson)
            this.viewDefine = ret.data
          }
        })
      }
    }
  }
}

</script>
