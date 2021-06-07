<template>
  <div>
    <div v-if="!menu">
      页面定义错误
    </div>
    <div v-if="menu.viewId">
      <div>
        <x-element :view-data="viewData" :view="viewDefine" />
      </div>
    </div>
    <div v-else="menu.extraUrl" />
  </div>
</template>

<script>

import { param2Obj } from '@/utils'
import { getViewDefineById } from '@/api/view-define'

export default {
  name: 'ShowView',
  data() {
    return {
      menu: null,
      viewDefine: {},
      viewData: {
        name: '',
        password: ''
      }
    }
  },
  created() {
    const menuId = (this.$route.path + '').replaceAll('/view', '')

    this.$store.dispatch('permission/getMenuDefine', menuId).then(ret => {
      this.menu = ret

      if (this.menu.viewId) {
        console.log('diaplay ', this.menu.viewId)

        getViewDefineById(this.menu.viewId).then(ret => {
          this.viewDefine = JSON.parse(ret.data.viewContent)
        })
      } else if (this.menu.extraUrl) {
        console.log('diaplay ', this.menu.extraUrl)
      }
    })
  }
}

</script>>
