<template>
  <div style="display: inline-flex;">
    <!-- 非编辑模式下：
      显示Label：true

      字段引用对象，且是keyFieldCode，则显示LabelField
      如果相同refGroup存在，且引用LabelField，则显示
      否则，查找引用LabelField值
    -->
    <span v-if="!editing">{{ val }}</span>

    <!-- 编辑模式下：
      input
      input-number
      datetimepicker
      mdmselect

    -->
  </div>
</template>

<script>

export default {
  name: 'lc-field-input',
  props: {
    value: [String, Number],
    objectCode: String,
    fieldCode: String,
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      val: ''
    }
  },
  watch: {
    'value': {
      handler(nval, oval) {
        if (nval != oval) {
          this.val = nval
        }
      },
      immediate: true
    },
    'objectCode': {
      handler(nval, oval) {
        if (nval != oval) {
          this.loadMetadata()
        }
      },
      immediate: true
    },
    'fieldCode': {
      handler(nval, oval) {
        if (nval != oval) {
          this.loadMetadata()
        }
      },
      immediate: true
    },
  },
  methods: {
    loadMetadata() {

    }
  }
}


</script>
