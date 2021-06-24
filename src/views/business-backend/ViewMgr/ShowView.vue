<template>
  <div>
    <div v-if="!view" />
    <div v-else>
      <div v-if="view.objectId">
        <x-object-list v-if="view.viewType == 'object-list'" :view-id="view.id" />
      </div>
      <div v-else-if="menu.extraUrl">
        <iframe ref="iframe" :src="menu.extraUrl" @load="loaded" />
      </div>
      <div v-else>
        <x-element :view-data="viewData" :view="viewContent" />
      </div>
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
      view: null,

      viewData: {
        name: '',
        password: ''
      },
      viewContent: null
    }
  },
  watch: {
    'viewDefine': {
      handler(nval, oval) {
        if (nval) {
          this.view = JSON.parse(JSON.stringify(nval))
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    const menuId = (this.$route.path + '').replaceAll('/view', '')

    if (menuId) {
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
    } else if (this.$props.viewDefine) {
      this.view = this.$props.viewDefine
    }
  },
  methods: {
    loaded() {
      //
    }
  }
}

</script>>
