<template>
  <el-row>
    <div class="cond-child" style="margin-top: 4px; margin-bottom: 4px;">
      <div :style="labelStyle">{{ label }}</div>
      <div>
        <slot></slot>
      </div>
    </div>
  </el-row>
</template>

<script>
export default {
  name: 'x-form-item',
  props: {
    label: String,
    labelWidth: {
      type: Number,
      default: 120
    },
  },
  computed: {
    labelStyle() {
      return 'display: flex-inline; text-align: right; line-height: 32px; width: ' + this.$props.labelWidth + 'px'
    }
  }
}

</script>
