<template>
  <el-card v-bind="view.props">
    <div slot="header" class="clearfix">
      <span>{{ view.name }}</span>
      <x-button v-for="item in view.header.buttons" v-bind="item.props" :view="item"></x-button>
    </div>
    <x-element v-for="item in view.children" :view="item" />
  </el-card>
</template>

<script>

export default {
  name: 'x-card',
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
