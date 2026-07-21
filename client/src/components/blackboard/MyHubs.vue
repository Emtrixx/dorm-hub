<template>
    <div class="">
        <h3 class="text-center">My Hubs</h3>
        <p v-if="loading">Loading</p>
        <div v-else>
            <div class="row">
                <post-item v-for="post in posts" :post="post" :key="post._id" :id="post.hub.name"></post-item>
            </div>

        </div>
    </div>
</template>


<script>
import PostItem from "./PostItem.vue";
import { api } from "@/api.js";
export default {
    components: {
        PostItem
    },
    data() {
        return {
            loading: true,
            posts: []
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            this.posts = await api.get('blackboard/secure/myPosts', { auth: true })
            this.loading = false
        }
    },
};
</script>