<template>
  <section>
    <el-row style="border-top: 1px solid #eee" v-if="objectFieldDefine.length > 0">
      <div class="cond-parent">
        <div v-for="(cond, i) in viewJson.showFields" class="cond-child">
          <div :style="labelStyle">
            {{ cond.fieldName }}：
          </div>
          <div style="display: flex-inline; width: 180px;">
            <div v-if="cond.fieldType == 'text'">
              <el-input v-model="objectData[cond.fieldCode]" size="small" placeholder="" @change="handleChange"></el-input>
            </div>
            <div v-if="cond.fieldType == 'int'">
              <el-input type="number" v-model="objectData[cond.fieldCode]" size="small" placeholder="" @change="handleChange"></el-input>
            </div>
            <div v-if="cond.fieldType == 'decimal'">
              <el-input type="number" v-model="objectData[cond.fieldCode]" size="small" placeholder="" @change="handleChange"></el-input>
            </div>
            <div v-if="cond.fieldType == 'date'">
              <el-date-picker type="date" v-model="objectData[cond.fieldCode]" placeholder="选择日期"></el-date-picker>
            </div>
            <div v-if="cond.fieldType == 'datetime'">
              <el-date-picker type="datetime" v-model="objectData[cond.fieldCode]" placeholder=""></el-date-picker>
            </div>
          </div>
        </div>
      </div>
    </el-row>

    <el-row v-if="viewJson.viewButtons && viewJson.viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
      <div style="right: 10px; float: right; position: absolute;">
        <x-button v-for="(btn, index) in viewJson.viewButtons" :view="btn" :self="self" />
      </div>
    </el-row>

  </section>
</template>

<script>

import { getViewDefineById } from '@/api/view-define'
import { getObjectDefineById } from '@/api/object-define'
import { saveObjectData } from '@/api/object-data'

export default {
  name: 'x-object-edit-view',
  props: {
    objectId: {
      type: String,
      required: true
    },
    viewJson: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
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
    tableHeight() {
      const h = (window.innerHeight - 22 -
          this.$store.state.settings.navbarHeight -
          this.$store.state.settings.tagsViewHeight -
          this.$store.state.settings.tableFuncBarHeight -
          this.$store.state.settings.tablePaginationHeight) + 'px'
      return h
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
  created() {
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

    handleChange() {
      //
    },

    saveData() {

      saveObjectData(this.objectId, this.objectData).then(ret => {
        if (ret.success) {
          this.$message.info('操作成功')
        }
      })

    },

  }

}

</script>
