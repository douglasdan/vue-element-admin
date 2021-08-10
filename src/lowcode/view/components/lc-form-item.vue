<template>
  <!-- <el-row> -->
  <div class="cond-child" style="margin-top: 4px; margin-bottom: 4px;">
    <div :style="labelStyle">{{ label }}{{ (colon ? '：': '') }}</div>
    <div>
      <slot />
    </div>
  </div>
  <!-- </el-row> -->
</template>

<script>
export default {
  name: 'LcFormItem',
  props: {
    label: String,
    colon: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: Number,
      default: 120
    }
  },
  computed: {
    labelStyle() {
      return 'display: flex-inline; text-align: right; line-height: 32px; width: ' + this.$props.labelWidth + 'px'
    }
  }
}

</script>
