<template>
    <div>
        <div v-if="loading">Loading…</div>
        <div v-else>
            <base-card>
                <h1>{{news.title}}</h1>
                <p>by<strong>{{ news.author.firstName }} {{news.author.lastName}}</strong></p>
                <div class="content" v-for="item in news.content" :key="item.id">
                    <p>{{item.content}}</p>
                </div>
            </base-card>
            <hr>
            <comment-form @save-data="createComment" ></comment-form>
            <div v-if="news.comments">
                <base-card v-for="comment in news.comments" :key="comment.id">
                    <p>{{comment.text}}</p>
                    <p>by <strong>{{ comment.author.firstName }} {{comment.author.lastName}}</strong></p>
                </base-card>
            </div>
        </div>
    </div>
</template>

<script>
import CommentForm from '../blackboard/CommentForm.vue'
import { useNewsStore } from '@/stores/news.js'
export default {
    props: ['newsId'],
    components: {CommentForm},
    data() {
        return {
            loading: true,
            
        }
    },
    computed: {
        news() {
            return useNewsStore().newsItem
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            await useNewsStore().fetchNewsItem(this.newsId)
            this.loading = false
        }
    }
}
</script>