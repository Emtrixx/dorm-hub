<template>
  <base-card class="auth-card">
    <h1 class="auth-title">Log in</h1>
    <p class="auth-sub">Welcome back to the house.</p>
    <form class="needs-validation" @submit.prevent="sendForm">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="email"
          aria-describedby="emailHelp"
          v-model="email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100">Log in</button>
    </form>
    <p class="signup-note">
      No account yet? Sign-up is currently deactivated —
      ask the dorm council to set one up for you.
    </p>
    <div v-if="error" class="alert alert-danger mt-3" role="alert">
  {{error}}
</div>
  </base-card>
</template>

<style scoped>
.auth-card {
  max-width: 26rem;
  margin-top: 3rem;
  padding: 2rem;
}

.auth-title {
  font-size: 1.6rem;
  margin-bottom: 0.25rem;
}

.auth-sub {
  color: var(--dh-mist);
  margin-bottom: 1.5rem;
}

.signup-note {
  color: var(--dh-mist);
  font-size: 0.85rem;
  margin: 1.25rem 0 0;
  text-align: center;
}
</style>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
    data() {
        return {
            email: '',
            password: '',
            error: ''
        }
    },
    methods: {
        async sendForm(){
          const user = {
            email: this.email,
            password: this.password
          }
          try {
            await useAuthStore().login(user)
            this.$router.replace('/')
          } catch (error) {
            this.password = ''
            this.error = 'Failed to authenticate!'
            console.log(error)
          }
        }
    }
}
</script>
