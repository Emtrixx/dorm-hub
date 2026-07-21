<template>
  <base-card class="text-center">
    <h3>Latest Blackboard Posts</h3>
    <div v-if="loading">
      Loading
    </div>
    <div v-else-if="notFound">
      Not Found
    </div>
    <div v-else class="row">
      <post-item
        v-for="post in posts"
        :key="post.id"
        :id="post.hub.name"
        :post="post"
        class=""
      ></post-item>
    </div>
  </base-card>
</template>

<script>
import PostItem from "../blackboard/PostItem.vue";
import BaseCard from "../UI/BaseCard.vue";
import { api } from "@/api.js";
export default {
  components: { PostItem, BaseCard },
  data() {
    return {
      loading: true,
      notFound: false,
      posts: [],
    };
  },
  created() {
    this.fetchLatestPosts();
  },
  methods: {
    async fetchLatestPosts() {
      try {
        this.posts = await api.get("blackboard/latestPosts?count=3");
      } catch (error) {
        console.log(error.message);
        this.notFound = true;
      }
      this.loading = false;
    },
  },
  computed: {
    // hubLink() {
    //   return `/blackboard/${this.posts[0].hub.name}/index`;
    // },
  },
};
</script>

<style scoped></style>
