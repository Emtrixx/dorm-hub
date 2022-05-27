<template>
    <div>
        <div v-if="loading">LOADING</div>
        <div v-else>
            <base-card>
            <h1>{{post.title}}</h1>
            <p>by <strong>{{ post.author.firstName }} {{post.author.lastName}}</strong></p>
            <p>{{post.text}}</p>
            </base-card>
            <hr>
            <comment-form @save-data="createComment" ></comment-form>
            <div v-if="post.comments">
            <base-card v-for="comment in post.comments" :key="comment.id">
            <p>{{comment.text}}</p>
            <p>by <strong>{{ comment.author.firstName }} {{comment.author.lastName}}</strong></p>
            </base-card>
            </div>
        </div>
    </div>
</template>

<script>
import CommentForm from './CommentForm.vue'
export default {
    props: ['id','postId'],
    components: {CommentForm},
    data() {
        return {
            loading: true
        }
    },
    computed: {
        post() {
            return this.$store.getters['blackboard/getPost']
        }
    },
    created() {
        this.fetchPost()
    },
    methods: {
        async fetchPost() {
            await this.$store.dispatch('blackboard/fetchPost', {hubId: this.id, postId: this.postId})
            this.loading = false
        },
        async createComment(data) {
            const payload = {
                hubId: this.id,
                postId: this.postId,
                data,
            };
            let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
            const res = await fetch(url + 'blackboard/'+payload.hubId+'/'+payload.postId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem('token')
                },
                method: 'POST',
                body: JSON.stringify(payload.data)
            })

            const resData = await res.json()

            if(!res.ok) {
                const error = new Error(resData.message || 'Failed to create comment!')
                console.log(error.message);
                throw error        
            }
            this.fetchPost()
            },
    }
}
</script>