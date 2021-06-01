<template>
    <h3>{{ id }}</h3>
    <button class="btn btn-info" @click="fetchData">Refresh</button>
    <button class="btn btn-success" @click="toggleForm">Create Post</button>
    <post-form v-if="showForm" @save-data="createPost"></post-form>
  <div>
    <base-card v-for="post in posts" :key="post.id">
    <h4>{{ post.title }}</h4>
    <p>{{ post.text }}</p>
    </base-card>
  </div>
</template>

<script>
import PostForm from './PostForm'

export default {
  props: ["id"],
  components: {
    PostForm
  },
  data() {
    return {
      showForm: false
    }
  },
  computed: {
    posts() {
      return this.$store.getters["blackboard/getPosts"];
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await this.$store.dispatch("blackboard/fetchHub", {hub: this.id});
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async createPost(data) {
      await this.$store.dispatch("blackboard/createPost", {hub: this.id, data})
    }
  },
};
</script>