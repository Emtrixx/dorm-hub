<template>
    <base-card class="text-center">
        <h3>Latest News</h3>

            <news-item v-for="news in latest_news" :key="news._id" :newsId="news._id" :title="news.title" text="" :author="news.author">
                {{ news.title }}</news-item>


    </base-card>
</template>
<script>
import NewsItem from "../news/NewsItem.vue";
export default {
    components: {
        NewsItem
    },
    data() {
        return {
            latest_news: []
        }
    },
    mounted() {
        this.getLatestNews();
    },
    methods: {
        async getLatestNews() {
            let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
            let res = await fetch(url + "news/latest", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            let news = await res.json()
            console.log(JSON.stringify(news))
            this.latest_news = news
            return news
        }
    }
}
</script>

<style scoped>
</style>