<template>
  <section>
    <h2 class="dh-section-title">Fresh on the blackboard</h2>
    <p v-if="loading" class="dh-muted">Loading…</p>
    <p v-else-if="notFound" class="dh-muted">The blackboard is unreachable right now.</p>
    <div v-else class="row">
      <post-item
        v-for="post in posts"
        :key="post.id"
        :id="post.hub.name"
        :post="post"
      ></post-item>
    </div>
    <router-link to="/blackboard/all" class="dh-more">Open the blackboard <i class="bi bi-arrow-right"></i></router-link>
  </section>
</template>

<script>
import PostItem from "../blackboard/PostItem.vue";
import { api } from "@/api.js";
export default {
  components: { PostItem },
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
};
</script>

<style scoped>
.dh-muted {
  color: var(--dh-mist);
}

.dh-more {
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}
</style>
