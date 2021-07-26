<template>
<header class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <h3><span class="dorm">Dorm</span><span class="hub btn-warning">Hub</span></h3>
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><router-link to="/" class="nav-link px-2 text-white">Home</router-link></li>
          <li><router-link to="/news" class="nav-link px-2 text-white">News</router-link></li>
          <li><router-link to="/blackboard/all" class="nav-link px-2 text-white">Blackboard</router-link></li>
          <li><router-link to="/wiki" class="nav-link px-2 text-white">Wiki</router-link></li>
          <li><router-link to="/meet" class="nav-link px-2 text-white">Meet</router-link></li>
        </ul>

        <div class="text-end">
          <button type="button" class="btn btn btn-outline-light me-2" v-if="isAuthenticated" @click="logout">Logout</button>
          <div v-else>
          <router-link to="/login"><button type="button" class="btn btn-outline-light me-2">Login</button></router-link>
          <router-link to="/signup"><button type="button" class="btn btn-warning">Sign-up</button></router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated']
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    }
  }
}
</script>

<style scoped>

.dorm {
    padding-right: 2px;
}

.hub {
    color: black;
    border-radius: 10%;
    padding: 2px 8px;
}


</style>