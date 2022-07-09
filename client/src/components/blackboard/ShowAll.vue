<template>
  <div class="">
    <p v-if="loading">loading...</p>
    <div class="" v-else>
      <button class="btn btn-success" @click="toggleForm" v-if="isAuthenticated">Create Post</button>
      <post-form :hub="id.toString()" v-if="showForm" @save-data="createPost"></post-form>
      <div class="row">
        <post-item v-for="post in posts" :post="post" :key="post._id" :id="id"></post-item>
      </div>


    </div>
  </div>
</template>

<script>
import PostForm from "./PostForm";
import PostItem from "./PostItem";
export default {
  components: {
    PostForm,
    PostItem,
  },
  data() {
    return {
      showForm: false,
      loading: true
    };
  },
  watch: {
    id: function () {
      this.fetchData();
    },
  },
  computed: {
    posts() {
      return this.$store.getters["blackboard/getPosts"];
    },
    hubId() {
      this.fetchData();
      return this.id;
    },
    id() {
      return this.$route.params.id;
    },
    isAuthenticated() {
      return this.$store.getters['isAuthenticated']
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        await this.$store.dispatch("blackboard/fetchHub", { hub: this.id });
        this.loading = false
      } catch (error) {
        console.log(error)
      }

    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async createPost(data) {
      await this.$store.dispatch("blackboard/createPost", {
        hub: this.id,
        data,
      });
      this.toggleForm();
      this.fetchData();
    },
  },
};
</script>
