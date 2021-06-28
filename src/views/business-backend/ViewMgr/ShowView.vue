<template>
  <div>

    <div v-if="objectId">
      <x-object-list-view v-if="viewType == 'object-list'"
        :object-id="objectId"
        :view-json="viewJson"
        />
      <x-object-edit-view v-if="viewType == 'object-edit'"
        :object-id="objectId"
        :view-json="viewJson"
        />
    </div>
    <div v-else-if="menu.extraUrl">
      <iframe ref="iframe" :src="menu.extraUrl" @load="loaded" />
    </div>

  </div>
</template>

<script>

import { param2Obj } from '@/utils'
import { getViewDefineById } from '@/api/view-define'

export default {
  name: 'ShowView',
  props: {
    viewDefine: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      menu: {},

      viewId: '',
      viewType: '',
      objectId: '',
      viewJson: null
    }
  },
  watch: {
    'viewDefine': {
      handler(nval, oval) {
        if (nval) {
          this.viewId = nval.viewId
          this.viewType = nval.viewType
          this.objectId = nval.objectId
          this.viewJson = JSON.parse(nval.viewContent)
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    let reg = new RegExp("^/view[0-9]*$");

    if (reg.test(this.$route.path)) {
      const menuId = (this.$route.path + '').replaceAll('/view', '')

      this.$store.dispatch('permission/getMenuDefine', menuId).then(ret => {
        this.menu = ret

        if (this.menu.viewId) {
          console.log('diaplay ', this.menu.viewId)

          getViewDefineById(this.menu.viewId).then(ret => {
            this.view = ret.data
            this.viewContent = JSON.parse(ret.data.viewContent)
          })
        } else if (this.menu.extraUrl) {
          console.log('diaplay ', this.menu.extraUrl)
        }
      })
    }
  },
  methods: {
    loaded() {
      //
    }
  }
}

</script>>
