<template>
  <section>
    <div  :style="pageStyle">
      <el-row v-if="viewJson.viewButtons && viewJson.viewButtons.length > 0" style="margin: 10px; font-size: 14px; height: 32px;" type="flex">
        <div style="right: 10px; float: right; position: absolute;">
          <x-button v-for="(btn, index) in viewJson.viewButtons" :view="btn" :self="self" />
        </div>
      </el-row>

      <el-row style="border-top: 1px solid #eee" v-for="i of showFieldGroups.length" v-if="colspan > 0">
        <el-col :span="colspan" v-for="(item, j) in cols">
          <div class="cond-parent" style="margin: 0px;">
            <div class="cond-child" v-if="showFieldGroups[i-1][j]">
              <div :style="labelStyle">
                {{ showFieldGroups[i-1][j].fieldName }}：
              </div>

              <div style="display: flex-inline; width: 180px;" v-if="editing">
                <div v-if="cond.fieldType == 'text'">
                  <el-input v-model="objectData[cond.fieldCode]" size="small" placeholder="" @change="handleChange"></el-input>
                </div>
              </div>

              <div v-else class="field-content" :style="'width: '+(viewJson.contentWidth ? viewJson.contentWidth : 200)+'px'"
                :title="objectData[showFieldGroups[i-1][j].fieldCode]">
                {{ objectData[showFieldGroups[i-1][j].fieldCode] }}
              </div>

            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- <el-row style="border-top: 1px solid #eee" v-if="colspan == 0">
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
    </el-row> -->



  </section>
</template>

<script>

import { getViewDefineById } from '@/api/view-define'
import { getObjectDefineById } from '@/api/object-define'
import { saveObjectData, getObjectDataById } from '@/api/object-data'

export default {
  name: 'x-object-view-view',
  props: {
    objectId: {
      type: String,
      required: true
    },
    viewJson: {
      type: Object,
      required: true
    },
    objectDataId: [String, Number]
  },
  data() {
    return {
      self: this,
      editing: false,

      objectDefine: null,
      objectFieldDefine: [],
      objectFieldDefineMap: {},

      //对象数据
      objectData: {

      },

      colspan: 0,
      showCols: 1,
      cols: [],
      showFieldGroups:[]
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
    // colspan: {
    //   get() {
    //     if (this.showCols > 0) {
    //       return 24/this.showCols
    //     }
    //     else {
    //       return 0
    //     }
    //   }
    // },
    // showCols: {
    //   get() {
    //     return this.$props.viewJson.cols > 0 ? this.$props.viewJson.cols : 0
    //   }
    // },
    // showFieldGroups: {
    //   get() {
    //     let groups = []
    //     if (this.showCols > 0) {

    //       let temp = []
    //       for (let i=0; i<this.viewJson.showFields.length; i++) {

    //         temp.push(this.viewJson.showFields[i])

    //         if (temp.length == this.showCols) {
    //           groups.push(temp)
    //           temp = []
    //         }
    //       }

    //       if (temp.length > 0) {
    //         groups.push(temp)
    //       }

    //       return groups
    //     }
    //     else {
    //       return []        }
    //   }
    // },
    pageStyle: {
      get() {
        let str = ''
        if (this.viewJson.maxHeight) {
          str += 'max-height: '+this.viewJson.maxHeight+'px;'
        }
        return str
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
        this.loadObjectData()

        this.colspan = 0
        this.showCols = 1
        this.showFieldGroups = []

        this.$nextTick(() => {
          this.updateViewDisplay()
        })
      },
      deep: true,
      immediate: true
    },
    'objectDataId': {
      handler(nval, oval) {
        this.loadObjectData()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  methods: {
    updateViewDisplay() {

      this.showCols = this.$props.viewJson.cols > 0 ? this.$props.viewJson.cols : 1
      this.colspan = 24/this.showCols

      this.cols = []
      for (let i=0;i<this.showCols; i++) {
        this.cols.push({})
      }

      let groups = []
      if (this.showCols > 0) {

        let temp = []
        for (let i=0; i<this.viewJson.showFields.length; i++) {
          temp.push(this.viewJson.showFields[i])
          if (temp.length == this.showCols) {
            groups.push(temp)
            temp = []
          }
        }

        if (temp.length > 0) {
          groups.push(temp)
        }

        this.showFieldGroups = groups
      }
      else {
        this.showFieldGroups = []
      }

      console.log("showFieldGroups = ", JSON.stringify(this.showFieldGroups))
    },
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

    loadObjectData() {
      if (this.objectId) {
        if (!this.objectDataId) {
          this.$message.error('未指定数据ID')
        }
        else {
          getObjectDataById(this.objectId, this.objectDataId).then(ret => {
            if ( ret.success && ret.data) {
              this.objectData = ret.data
            }
          })
        }
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
