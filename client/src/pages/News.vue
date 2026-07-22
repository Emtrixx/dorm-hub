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
      <news-editor v-else @saved="onSaved" @dismiss="addingNews = false"></news-editor>
    </div>
    <p v-if="loading">loading ...</p>
    <div v-else>
      <div v-for="news in newsList" :key="news._id" class="position-relative">
        <news-editor
          v-if="editingNewsId === news._id"
          class="my-3"
          :news="news"
          @saved="onSaved"
          @dismiss="editingNewsId = null"
        ></news-editor>
        <template v-else>
          <news-item
            :newsId="news._id"
            :title="news.title"
            :author="news.author"
            :text="previewText(news)"
          ></news-item>
          <div v-if="canEdit" class="btn-group edit-buttons">
            <button class="btn btn-sm btn-outline-primary" @click="editingNewsId = news._id">
              <i class="bi bi-pen"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="deleteNews(news)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import NewsItem from "../components/news/NewsItem.vue";
import NewsEditor from "../components/news/NewsEditor.vue";
import { api } from "@/api.js";
import { useAuthStore } from "@/stores/auth.js";
export default {
  components: { NewsItem, NewsEditor },
  data() {
    return {
      newsList: [],
      loading: true,
      addingNews: false,
      editingNewsId: null
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
    onSaved() {
      this.addingNews = false;
      this.editingNewsId = null;
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
.edit-buttons {
  position: absolute;
  top: 2rem;
  right: 1rem;
}
</style>
