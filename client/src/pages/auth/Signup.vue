<template>
<base-card>
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
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</base-card>
</template>

<script>
export default {
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    },
    methods: {
        sendForm(){
          const user = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
          }

          this.$store.dispatch('signup', user)
        }
    }
}
</script>