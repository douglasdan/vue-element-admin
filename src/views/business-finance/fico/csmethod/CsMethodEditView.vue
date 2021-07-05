<template>
  <section>
    <el-row style="border-top: 1px solid #eee" v-if="objectFieldDefine.length > 0">
      <div class="cond-parent">
        <div class="cond-child">
          <div :style="labelStyle">成本对象名称： </div>
          <div style="display: flex-inline; width: 180px;">
            <span>选择</span>
          </div>
        </div>
        <div class="cond-child">
          <div :style="labelStyle">分摊对象名称： </div>
          <div style="display: flex-inline; width: 180px;">
            <span>选择</span>
          </div>
        </div>
      </div>
    </el-row>

    <el-row style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
      <div style="right: 10px; float: right; position: absolute;">
        <el-button type="primary" size="small" @click="submit">保存</el-button>
      </div>
    </el-row>

  </section>
</template>

<script>

export default {
  name: 'cs-method-edit-view',
  props: {
  },
  data() {
    return {
      mdmReady: false,
      self: this,
      objectDefine: null,
      objectFieldDefine: [],
      objectFieldDefineMap: {},

      //对象数据
      objectData: {

      }
    }
  },
  computed: {
    checkShowInDialog() {
      let flag = false
      let p = this.$parent
      while(p) {
        if (p.$options._componentTag == 'el-dialog') {
          flag = true
          break
        }
        p = p.$parent
      }
      return flag
    },
    tableHeight() {
      if (this.checkShowInDialog) {
        return (window.innerHeight/2)+'px'
      }
      else {
        const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
        return h
      }
    },
    labelStyle: {
      get() {
        let str = 'display: flex-inline; text-align: right; line-height: 30px;'
        if (this.$props.viewJson.labelWidth > 0) {
          str += 'width: '+ this.$props.viewJson.labelWidth +'px;'
        }
        else {
          str += 'width: 120px;'
        }
        return str
      }
    },
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadObject()
      },
      deep: true,
      immediate: true
    },
    'viewJson': {
      handler(nval, oval) {

      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    await this.$store.dispatch('mdm/getMdmData', '')
    this.mdmReady = true
  },
  methods: {
    loadObject() {
      if (this.objectId) {
        this.$store.dispatch('lowCode/getObjectDefine', this.objectId).then(ret => {
          this.objectDefine = ret
          this.objectFieldDefine = ret.fields

          this.objectFieldDefineMap = {}
          this.objectFieldDefine.forEach((item, index) => {
            this.objectFieldDefineMap[item.fieldCode] = item

            this.$set(this.objectData, item.fieldCode, '')
          })
        })
      }
    },

    fieldName(code) {
      if (this.objectFieldDefineMap[code]) {
        return this.objectFieldDefineMap[code].fieldName
      }
      return ''
    },

    handleObjectRelation(dd) {

      this.objectFieldDefine.forEach(f => {
        if (f.valueRefType == '4' && f.refTableId == dd.objectId && f.refFieldCode) {
          this.objectData[f.fieldCode] = dd.row[f.refFieldCode]
        }
      })
    },

    saveData() {

      saveObjectData(this.objectId, this.objectData).then(ret => {
        if (ret.success) {
          this.$message.info('操作成功')
          this.cancel()
        }
      })

    },
    cancel() {
      console.log(this.$parent.$options._componentTag == 'show-view')
      console.log(this.$parent.$parent.$options._componentTag == 'el-dialog')
      console.log(this.$parent.$parent.$parent.$options._componentTag == 'x-object-list-view')

      if (this.$parent.$options._componentTag == 'show-view'
        && this.$parent.$parent.$options._componentTag == 'el-dialog'
        && this.$parent.$parent.$parent.$options._componentTag == 'x-object-list-view') {

          this.$parent.$parent.$parent.loadData()
          this.$parent.$parent.$parent.closeDialog()
      }
    }

  }

}

</script>
