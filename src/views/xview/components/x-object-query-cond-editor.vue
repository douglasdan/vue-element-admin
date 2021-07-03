<template>
  <div style="display: flex;">
    <div v-show="cond.fieldType == 'json'">
      不支持
    </div>
    <div style="width: 120px;" v-show="cond.fieldType != 'json'">
      <el-col :span="24">
        <el-select v-model="cond.opType" filterable @change="handleChange" class="hanzi4">
          <el-option
            v-for="item in fieldOptions"
            :key="item.opType"
            :label="item.opName"
            :value="item.opType"
          />
        </el-select>
      </el-col>
    </div>
    <div v-if="cond.fieldType != 'json' && cond.opType === ''">
      <el-input size="mini" v-model="cond.values" placeholder="多个值用逗号分隔" @change="handleChange"/>
    </div>
    <el-switch v-model="cond.visible" active-color="#13ce66" inactive-color="#ff4949" @change="handleChange"
      style="margin-top: 5px;"
      v-if="cond.opType != ''">
    </el-switch>
  </div>
</template>

<script>

export default {
  name: 'x-object-query-cond-editor',
  props: {
    objectId: {
      type: String
    },
    cond: {
      type: Object
    }
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadData()
      },
      deep: true,
      immediate: true
    },
    'cond': {
      handler(nval, oval) {
        this.setOptions()
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      fieldDefines: [],
      fieldDefineMap: {},
      options: [
        { opType: '', opName: '常量' },       //0
        { opType: 'eq', opName: '等于' },     //1
        { opType: 'ne', opName: '不等于' },   //2
        { opType: 'in', opName: '属于' },     //3
        { opType: 'nin', opName: '不属于' },  //4
        { opType: 'like', opName: '模糊' },   //5
        { opType: 'ge', opName: '大于等于' },  //6
        { opType: 'gt', opName: '大于' },     //7
        { opType: 'le', opName: '小于' },     //8
        { opType: 'lt', opName: '小于等于' },  //9
        { opType: 'between', opName: '范围' } //10
      ],
      fieldOptions: []
    }
  },
  mounted() {
    let _this = this
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.$props.objectId) {
        console.log('x-object-query-cond-editor', this.$props.objectId)

        this.$store.dispatch('lowCode/getObjectDefine', this.$props.objectId).then(ret => {
          if (ret) {
            this.fieldDefines = ret.fields
            this.fieldDefineMap = {}
            ret.fields.forEach((item,i) => {
              this.fieldDefineMap[item.fieldCode] = item
            })
          }
        })
      }
    },
    setOptions() {
      if (this.$props.cond) {
        let cond = this.$props.cond

        if (!this.fieldDefineMap[cond.fieldCode]) {
          let _this = this
          setTimeout(function() {
            _this.setOptions()
          }, 500)
          return
        }

        this.fieldOptions = []
        if (this.fieldDefineMap[cond.fieldCode].fieldType == 'text') {
          this.fieldOptions.push(this.options[0])
          this.fieldOptions.push(this.options[1])
          // this.fieldOptions.push(this.options[2])
          this.fieldOptions.push(this.options[5])
        }
        else if (this.fieldDefineMap[cond.fieldCode].fieldType == 'int') {
          this.fieldOptions.push(this.options[0])
          this.fieldOptions.push(this.options[1])
          // this.fieldOptions.push(this.options[2])
          this.fieldOptions.push(this.options[6])
          this.fieldOptions.push(this.options[7])
          this.fieldOptions.push(this.options[8])
          this.fieldOptions.push(this.options[9])
          this.fieldOptions.push(this.options[10])
        }
        else if (this.fieldDefineMap[cond.fieldCode].fieldType == 'decimal') {
          this.fieldOptions.push(this.options[0])
          this.fieldOptions.push(this.options[1])
          // this.fieldOptions.push(this.options[2])
          this.fieldOptions.push(this.options[6])
          this.fieldOptions.push(this.options[7])
          this.fieldOptions.push(this.options[8])
          this.fieldOptions.push(this.options[9])
          this.fieldOptions.push(this.options[10])
        }
        else if (this.fieldDefineMap[cond.fieldCode].fieldType == 'date') {
          this.fieldOptions.push(this.options[0])
          this.fieldOptions.push(this.options[1])
          this.fieldOptions.push(this.options[10])
        }
        else if (this.fieldDefineMap[cond.fieldCode].fieldType == 'datetime') {
          this.fieldOptions.push(this.options[0])
          this.fieldOptions.push(this.options[10])
        }
        else if (this.fieldDefineMap[cond.fieldCode].fieldType == 'json') {
          //
          this.fieldOptions = []
        }
      }

    },
    handleChange() {
      if (this.$props.cond.opType == '') {
        this.$set(this.$props.cond, 'visible', false)
      }
      this.$emit('change', {})
    },
  }
}
</script>
