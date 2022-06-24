<template>
    <base-card class="text-center">
        <h3>Latest Blackboard Post</h3>
        <div v-if="loading">
            Loading
        </div>
        <div v-else>
            from <router-link :to="hubLink">{{ post.hub.name }}</router-link>
            <div>
                <post-item :id="post.hub.name" :post="post"></post-item>
            </div>

        </div>
    </base-card>
</template>

<script>
import PostItem from '../blackboard/PostItem.vue'
import BaseCard from '../UI/BaseCard.vue'
export default {
    components: {
        PostItem,
        BaseCard
    },
    data() {
        return {
            loading: true,
            post: {}
        }
    },
    mounted() {
        this.fetchLatestPost()
    },
    methods: {
        async fetchLatestPost() {
            let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
            const res = await fetch(url + 'blackboard/latestPost')
            const resData = await res.json()

            if (!res.ok) {
                const error = new Error(resData.message || 'Failed to fetch post!')
                console.log(error.message);
                this.loading = false
                // throw error
            }
            this.loading = false
            this.post = resData
            this.$forceUpdate();
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