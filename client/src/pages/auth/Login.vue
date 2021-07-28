<template>
  <base-card>
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
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <div v-if="error" class="alert alert-danger mt-3" role="alert">
  {{error}}
</div>
  </base-card>
</template>

<script>
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
            await this.$store.dispatch('login', user)
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
