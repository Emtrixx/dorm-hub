<template>
  <div>
    <h1>Coming soon</h1>
    <p v-if="loading">loading ...</p>
    <div v-else>
      <news-item
        v-for="news in newsList"
        :key="news._id"
        :newsId="news._id"
        :title="news.title"
        :author="news.author"
        :text="news.content[1].content.substring(0, 80)"
      ></news-item>
    </div>
  </div>
</template>

<script>
import NewsItem from "../components/news/NewsItem.vue";
export default {
  components: { NewsItem },
  data() {
    return {
      newsList: [],
      loading: true
    };
  },
  computed: {
    text() {
      return this.new;
    },
  },
  mounted() {
      this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await fetch(process.env.VUE_APP_HOST + "news/all");
      const resData = await res.json();

      if (!res.ok) {
        const error = new Error(resData.message || "Failed to fetch post!");
        console.log(error.message);
        throw error;
      }
        console.log(resData)
      this.newsList = resData;
      this.loading = false
    },
  },
};
</script>
