<template>
  <el-card v-bind="view.props">
    <a slot="extra" href="#">{{ view.props.extra }}</a>
    <!-- <x-element :view="item" v-for="item in view.children"></x-element> -->

  </el-card>
</template>

<script>

export default {
  name: 'XCard',
  components: {
  },
  props: {
    view: {
      type: Object
    }
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
  }
}
</script>
