<template>
<base-card class="text-center">
    <h3>Latest Blackboard Post</h3>
    <div v-if="loading">
        Loading
    </div>
    <div v-else>
    from <router-link :to="hubLink">{{post.hub.name}}</router-link>
    <post-item 
        :id ="post.hub.name"
        :postId="post._id"
        :title="post.title"
        :text="post.text"></post-item>
    </div>
</base-card>
</template>

<script>
import PostItem from '../blackboard/PostItem.vue'
import BaseCard from '../UI/BaseCard.vue'
export default {
    components: {PostItem, BaseCard},
    data() {
        return {
            loading: true,
            post: {}
        }
    },
    created() {
        this.fetchLatestPost()
    },
    methods: {
        async fetchLatestPost() {
            const res = await fetch(`http://localhost:8081/blackboard/latestPost`)
            const resData = await res.json()

        if(!res.ok) {
            const error = new Error(resData.message || 'Failed to fetch post!')
            console.log(error.message);
            throw error        
        }
        this.post = resData
        console.log(this.post)
        this.loading = false
        }
    },
    computed: {
        hubLink() {
            return `/blackboard/${this.post.hub.name}/index`
        }
    }
}
</script>

<style scoped>

</style>