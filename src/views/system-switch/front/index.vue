<template>
  <div />
</template>

<script>

export default {

  data() {
    return {}
  },

  created() {
    window.localStorage.setItem('SYS', 2)
    this.$store.dispatch('tagsView/delAllViews')
      .then(ret => {
        this.$store.dispatch('permission/clearRoutes')
      })
      .then(ret => {
        return this.$store.dispatch('permission/generateRoutes')
      })
      .then(ret => {
        this.$router.replace({ path: '/' })
        location.reload()
      })
  }
}

</script>
