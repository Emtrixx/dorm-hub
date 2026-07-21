<template>
<section>
  <h2 class="dh-section-title">Latest news</h2>
  <p v-if="loading" class="dh-muted">Loading…</p>
  <p v-else-if="!newsList.length" class="dh-muted">Nothing posted yet.</p>
  <div v-else>
    <news-item
      v-for="news in newsList"
      :key="news._id"
      :newsId="news._id"
      :title="news.title"
      :author="news.author"
      :text="previewText(news)"
    ></news-item>
  </div>
  <router-link to="/news" class="dh-more">All news <i class="bi bi-arrow-right"></i></router-link>
</section>
</template>

<script>
import NewsItem from "../news/NewsItem.vue";
import { api } from "@/api.js";

export default {
  components: { NewsItem },
  data() {
    return {
      loading: true,
      newsList: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    previewText(news) {
      const textBlock = news.content.find((c) => c.contentType === "text");
      return (textBlock?.content || "").substring(0, 120);
    },
    async fetchData() {
      try {
        const all = await api.get("news/all");
        this.newsList = all.slice(0, 3);
      } catch (error) {
        console.log(error.message);
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
