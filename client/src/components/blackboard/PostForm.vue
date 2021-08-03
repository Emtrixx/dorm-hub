<template>
<base-card>
  <form class="needs-validation" @submit.prevent="submitForm">
    <div class="mb-3">
      <label for="text" class="form-label">Title</label>
      <input
        class="form-control"
        type="text"
        id="title"
        name="title"
        v-model="title"
        required
      />
    </div>
    <div class="mb-3">
      <label for="text" class="form-label">Text</label>
      <textarea
        class="form-control"
        name="text"
        id="text"
        cols="30"
        rows="10"
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
      title: "",
      text: "",
    };
  },
  methods: {
    submitForm() {
      let formData = {
        title: this.title,
        text: this.text,
        comments: [],
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