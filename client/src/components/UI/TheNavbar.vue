<template>
<header class="dh-header">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start py-2">
        <a href="/" class="dh-brand d-flex align-items-center mb-2 mb-lg-0 text-decoration-none">
          <span class="dh-wordmark">dorm<span class="dh-chip">hub</span></span>
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ms-lg-4">
          <li><router-link to="/" exact-active-class="dh-active" class="nav-link dh-nav-link">Home</router-link></li>
          <li><router-link to="/news" active-class="dh-active" class="nav-link dh-nav-link">News</router-link></li>
          <li><router-link to="/blackboard/all" active-class="dh-active" class="nav-link dh-nav-link">Blackboard</router-link></li>
          <li><router-link to="/wiki" active-class="dh-active" class="nav-link dh-nav-link">Wiki</router-link></li>
          <li><router-link to="/meet" active-class="dh-active" class="nav-link dh-nav-link">Meet</router-link></li>
          <li><router-link to="/calendar" active-class="dh-active" class="nav-link dh-nav-link">Calendar</router-link></li>
          <li v-if="isAdmin"><router-link to="/admin" active-class="dh-active" class="nav-link dh-nav-link">Admin</router-link></li>
        </ul>

        <div class="text-end">
          <button type="button" class="btn btn-outline-light btn-sm me-2" v-if="isAuthenticated" @click="logout">Log out</button>
          <div v-else>
          <router-link to="/login"><button type="button" class="btn btn-outline-light btn-sm me-2">Log in</button></router-link>
          <router-link to="/signup"><button type="button" class="btn btn-warning btn-sm">Sign up</button></router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
  computed: {
    isAuthenticated() {
      return useAuthStore().isAuthenticated
    },
    isAdmin() {
      return useAuthStore().hasRole('admin')
    }
  },
  methods: {
    logout() {
      useAuthStore().logout();
    }
  }
}
</script>

<style scoped>
.dh-header {
  background: var(--dh-ink);
  color: #fff;
}

.dh-wordmark {
  font-family: var(--dh-font-display);
  font-weight: 680;
  font-size: 1.45rem;
  letter-spacing: -0.02em;
  color: #fff;
}

.dh-wordmark .dh-chip {
  margin-left: 0.18em;
  font-size: 0.92em;
}

.dh-brand:hover .dh-chip {
  transform: rotate(1.5deg);
  transition: transform 160ms ease;
}

.dh-nav-link {
  color: rgba(255, 255, 255, 0.78);
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  position: relative;
}

.dh-nav-link:hover,
.dh-nav-link:focus {
  color: #fff;
}

.dh-nav-link.dh-active {
  color: #fff;
}

.dh-nav-link.dh-active::after {
  content: "";
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.28rem;
  height: 3px;
  border-radius: 2px;
  background: var(--dh-note);
}

.btn-outline-light {
  --bs-btn-border-color: rgba(255, 255, 255, 0.45);
}

@media (prefers-reduced-motion: reduce) {
  .dh-brand:hover .dh-chip {
    transform: rotate(-2deg);
    transition: none;
  }
}
</style>
