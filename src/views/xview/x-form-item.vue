<template>
  <el-row style="margin: 10px; font-size: 14px;" type="flex">
    <div :style="labelStyle">
      <span v-if="label">{{ label }}：</span>
      <slot name="header" />
    </div>
    <div>
      <slot />
    </div>
  </el-row>
</template>

<script>
export default {
  name: 'XFormItem',
  props: {
    label: String,
    labelWidth: {
      type: Number,
      default: 100
    },
    value: String
  },
  data() {
    return {

    }
  },
  computed: {
    labelStyle() {
      return 'display: flex-inline; text-align: right; line-height: 30px; width: ' + this.$props.labelWidth + 'px'
    }
  },
  methods: {

  }
}

</script>
