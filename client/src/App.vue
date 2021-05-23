<template>
<the-navbar></the-navbar>
<div class="container">
<router-view></router-view>
</div>
</template>

<script>
import TheNavbar from './components/UI/TheNavbar.vue'

export default {
  components: {
    TheNavbar
  },
  created() {
      this.$store.dispatch('tryLogin')
  },
}
</script>

<style>

</style>
