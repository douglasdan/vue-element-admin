<template>
  <div style="display: inline-flex;">
    <span v-if="!editing">{{ val }}</span>
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
