<template>
<base-card>
  <form class="needs-validation" @submit.prevent="submitForm">
    <div class="mb-3">
      <label for="text" class="form-label">Leave a Comment</label>
      <textarea
        class="form-control"
        name="text"
        id="text"
        cols="30"
        rows="6"
        minlength="6"
        required
        v-model="text"
      ></textarea>
    </div>
    <button class="btn btn-success">Submit</button>
  </form>
</base-card>
</template>

<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  methods: {
    submitForm() {
      let formData = {
        text: this.text,
      };

      if (this.$store.getters.userId) {
        formData = {
          ...formData,
          author: this.$store.getters.userId,
        };
      }
      this.$emit("save-data", formData);
    },
  },
};
</script>