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
      <x-object-view-view v-if="viewType == 'object-view'"
        :object-id="objectId"
        :object-data-id="dataId"
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

import { repairObjectListViewJson } from '@/views/xview/template/object-list-template-compatible.js'
import { repairObjectEditViewJson } from '@/views/xview/template/object-edit-template-compatible.js'
import { repairObjectViewJson } from '@/views/xview/template/object-view-template-compatible.js'

export default {
  name: 'ShowView',
  props: {
    viewDefine: {
      type: Object,
      required: false
    },
    dataId: [String, Number]
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

    if (this.$props.viewDefine) {
      //

    }
    else if (reg.test(this.$route.path)) {
      const menuId = (this.$route.path + '').replaceAll('/view', '')

      this.$store.dispatch('permission/getMenuDefine', menuId).then(ret => {
        this.menu = ret

        if (this.menu.viewId) {
          console.log('diaplay ', this.menu.viewId)

          getViewDefineById(this.menu.viewId).then(ret => {
            this.view = ret.data
            this.viewType = this.view.viewType
            this.objectId = this.view.objectId

            let viewJson = JSON.parse(ret.data.viewContent)

            if (this.viewType == 'object-list') {
              repairObjectListViewJson(viewJson)
            }
            else if (this.viewType == 'object-edit') {
              repairObjectEditViewJson(viewJson)
            }
            else if (this.viewType == 'object-view') {
              repairObjectViewJson(viewJson)
            }
            debugger
            this.viewJson = viewJson
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
