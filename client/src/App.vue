

<template>
<div>

<the-navbar></the-navbar>
<div id="main" class="container">
  <router-view></router-view>
</div>
<the-footer></the-footer>
</div>
</template>

<script>
import TheNavbar from './components/UI/TheNavbar.vue'
import TheFooter from './components/UI/TheFooter.vue'
import { useAuthStore } from './stores/auth.js'

export default {
  components: {
    TheNavbar,
    TheFooter
  },
  created() {
      useAuthStore().tryLogin()
  },
}


</script>

<style>
#main {
  min-height: 95vh;
}
</style>
