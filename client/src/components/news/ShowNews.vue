<template>
    <div>
        <div v-if="loading">Loading…</div>
        <div v-else>
            <base-card>
                <h1>{{news.title}}</h1>
                <p>by<strong>{{ news.author.firstName }} {{news.author.lastName}}</strong></p>
                <div class="content" v-for="item in news.content" :key="item._id">
                    <img v-if="item.contentType === 'img'" :src="item.content" class="img-fluid" alt="news image" />
                    <p v-else>{{item.content}}</p>
                </div>
            </base-card>
            <hr>
            <comment-form v-if="isAuthenticated" @save-data="createComment"></comment-form>
            <p v-else>Log in to leave a comment.</p>
            <div v-if="news.comments">
                <base-card v-for="comment in news.comments" :key="comment._id">
                    <p>{{comment.text}}</p>
                    <p>by <strong>{{ comment.author.firstName }} {{comment.author.lastName}}</strong></p>
                    <button v-if="canDeleteComment(comment)" class="btn btn-sm btn-outline-danger"
                        @click="deleteComment(comment)">
                        <i class="bi bi-trash"></i>
                    </button>
                </base-card>
            </div>
        </div>
    </div>
</template>

<script>
import CommentForm from '../blackboard/CommentForm.vue'
import { api } from '@/api.js'
import { useNewsStore } from '@/stores/news.js'
import { useAuthStore } from '@/stores/auth.js'
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
        },
        isAuthenticated() {
            return useAuthStore().isAuthenticated
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            await useNewsStore().fetchNewsItem(this.newsId)
            this.loading = false
        },
        canDeleteComment(comment) {
            const auth = useAuthStore()
            return comment.author && (comment.author._id === auth.userId || auth.hasRole('news'))
        },
        async createComment(data) {
            await api.post(`news/secure/${this.newsId}/comments`, data, { auth: true })
            this.fetchData()
        },
        async deleteComment(comment) {
            if (confirm('Delete this comment?')) {
                await api.delete(`news/secure/comments/${comment._id}`, undefined, { auth: true })
                this.fetchData()
            }
        }
    }
}
</script>
