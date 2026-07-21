<template>
<base-card class="auth-card">
  <template v-if="!registrationEnabled">
    <span class="dh-chip closed-chip">Closed for now</span>
    <h1 class="auth-title mt-3">Sign-up is deactivated</h1>
    <p class="auth-sub">
      New accounts can't be created at the moment. If you live in the house
      and need one, get in touch with the dorm council.
    </p>
    <router-link to="/login" class="btn btn-primary w-100">Log in instead</router-link>
  </template>

  <template v-else>
  <h1 class="auth-title">Sign up</h1>
  <p class="auth-sub">New in the house? Get your account here.</p>
  <form class="needs-validation" @submit.prevent="sendForm">
  <div class="mb-3">
      <label for="firstname">First name</label>
      <input type="text" class="form-control" id="firstname" v-model="firstName" required>
  </div>
  <div class="mb-3">
      <label for="firstname">Last name</label>
      <input type="text" class="form-control" id="lastname" v-model="lastName" required>
  </div>
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
      <div id="emailHelp" class="form-text">
        We'll never share your email with anyone else.
      </div>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" v-model="password" required/>
    </div>
    <button type="submit" class="btn btn-primary w-100">Create account</button>
  </form>
<div v-if="error" class="alert alert-danger mt-3" role="alert">
  {{error}}
</div>
  </template>
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

.closed-chip {
  font-weight: 600;
  font-size: 0.85rem;
}
</style>

<script>
import { useAuthStore } from '@/stores/auth.js'

// the server's /register route is disabled (see routes/auth.js);
// flip this back on when registration is re-enabled
const REGISTRATION_ENABLED = false

export default {
    data() {
        return {
            registrationEnabled: REGISTRATION_ENABLED,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            error: ''
        }
    },
    methods: {
        async sendForm(){
          const user = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
          }
          try {
            await useAuthStore().signup(user)
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
