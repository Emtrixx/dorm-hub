<template>
    <h3>{{ id }}</h3>
    <button class="btn btn-info" @click="fetchData">Refresh</button>
    <button class="btn btn-success" @click="toggleForm">Create Post</button>
    <post-form v-if="showForm" @save-data="createPost"></post-form>
  <post-item v-for="post in posts" :key="post._id" :id="post._id" :title="post.title" :text="post.text">
  </post-item>
</template>

<script>
import PostForm from './PostForm'
import PostItem from './PostItem'
export default {
  props: ["id"],
  components: {
    PostForm,
    PostItem
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