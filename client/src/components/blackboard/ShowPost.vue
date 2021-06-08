<template>
    <base-card>
    <h1>{{post.title}}</h1>
    <p>by <strong>{{ post.author.firstName }} {{post.author.lastName}}</strong></p>
    <p>{{post.text}}</p>
    </base-card>
</template>

<script>
export default {
    props: ['hub','postId'],
    computed: {
        post() {
            return this.$store.getters['blackboard/getPost']
        }
    },
    created() {
        this.fetchPost()
    },
    methods: {
        fetchPost() {
            this.$store.dispatch('blackboard/fetchPost', {hubId: this.$router.hubId, postId: this.postId})
        }
    }
}
</script>