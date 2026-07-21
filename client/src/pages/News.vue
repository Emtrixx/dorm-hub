<template>
  <div>
    <header class="dh-page-head">
      <span class="dh-eyebrow">From the dorm council & friends</span>
      <h1>News</h1>
    </header>
    <div v-if="canEdit" class="my-3">
      <button v-if="!addingNews" class="btn btn-primary" @click="addingNews = true">
        Write news
      </button>
      <div v-else class="dh-card p-3">
        <div class="mb-2">
          <input
            type="text"
            class="form-control"
            placeholder="Title"
            v-model="newTitle"
          />
        </div>
        <div class="mb-2">
          <textarea
            class="form-control"
            rows="6"
            placeholder="Text"
            v-model="newText"
          ></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" @click="createNews">Publish</button>
          <button class="btn btn-outline-primary" @click="addingNews = false">
            Dismiss
          </button>
        </div>
      </div>
    </div>
    <p v-if="loading">loading ...</p>
    <div v-else>
      <div v-for="news in newsList" :key="news._id" class="position-relative">
        <news-item
          :newsId="news._id"
          :title="news.title"
          :author="news.author"
          :text="previewText(news)"
        ></news-item>
        <button
          v-if="canEdit"
          class="btn btn-sm btn-outline-danger delete-button"
          @click="deleteNews(news)"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NewsItem from "../components/news/NewsItem.vue";
import { api } from "@/api.js";
import { useAuthStore } from "@/stores/auth.js";
export default {
  components: { NewsItem },
  data() {
    return {
      newsList: [],
      loading: true,
      addingNews: false,
      newTitle: "",
      newText: ""
    };
  },
  computed: {
    canEdit() {
      return useAuthStore().hasRole('news');
    },
  },
  mounted() {
      this.fetchData()
  },
  methods: {
    previewText(news) {
      const textBlock = news.content.find((c) => c.contentType === "text");
      return (textBlock?.content || "").substring(0, 80);
    },
    async fetchData() {
      this.newsList = await api.get("news/all");
      this.loading = false
    },
    async createNews() {
      if (!this.newTitle.trim()) return;
      await api.post("news/secure", {
        title: this.newTitle,
        content: [{ contentType: "text", content: this.newText }],
      }, { auth: true });
      this.addingNews = false;
      this.newTitle = "";
      this.newText = "";
      this.fetchData();
    },
    async deleteNews(news) {
      if (confirm(`Delete "${news.title}"?`)) {
        await api.delete(`news/secure/${news._id}`, undefined, { auth: true });
        this.fetchData();
      }
    },
  },
};
</script>

<style scoped>
.delete-button {
  position: absolute;
  top: 2rem;
  right: 1rem;
}
</style>
