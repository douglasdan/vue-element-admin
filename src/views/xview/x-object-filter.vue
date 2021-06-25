<template>
  <el-row style="border-top: 1px solid #eee">
    <div style="margin: 20px;">
      xxx
      <el-form ref="form" label-width="80px">
        <div v-for="(cond, i) in viewJson.queryDefine.conditions">
          {{ cond.fieldCode }} op: {{ cond.opType }} values: {{ cond.values }}
        </div>
      </el-form>
    </div>
  </el-row>
</template>

<script>

export default {
  name: 'x-object-filter',
  props: {
    objectId: {
      type: String,
      required: true
    },
    viewJson: {
      type: Object,
    }
  },
  data() {
    return {
      fields: [],
      fieldMap: {},

      queryObj: {},
      values: []
    }
  },
  watch: {
    'objectId': {
      handler(nval, oval) {
        this.loadMetaData()
      },
      deep: true,
      immediate: true
    },
    'viewJson': {
      handler(nval, oval) {
        if (!nval.queryDefine) {
          this.$set(this.$props.viewJson, 'queryDefine', {
            labelWidth: 100,
            conditions: []
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.loadMetaData()
  },
  methods: {
    loadMetaData() {
      if(this.$props.objectId) {
        this.$store.dispatch('lowCode/getObjectDefine', this.$props.objectId).then(ret => {
          if (ret) {
            this.fields = ret.fields
            this.fields.forEach((item) => {
              this.fieldMap[item.fieldCode] = item
            })
          }
        })
      }
    }
  }
}

</script>
