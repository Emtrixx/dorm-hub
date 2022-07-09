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
      let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
      const res = await fetch(url + "blackboard/latestPosts?count=3");
      const resData = await res.json();
      if (!res.ok) {
        const error = new Error(resData.message || "Failed to fetch post!");
        console.log(error.message);
        this.loading = false;
        this.notFound = true;
        // throw error
      }

      this.posts = resData;
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
