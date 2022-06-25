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
import PostItem from "./PostItem";
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
            let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
            const res = await fetch(url + `blackboard-secure/myPosts`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem('token')
                },
                method: 'GET',
            })
            const resData = await res.json()

            if (!res.ok) {
                const error = new Error(resData.message || 'Failed to fetch post!')
                console.log(error.message);
                throw error
            }

            this.posts = resData
            this.loading = false
        }
    },
};
</script>