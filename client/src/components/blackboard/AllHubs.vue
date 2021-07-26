<template>
  <div>
    <h3>All Hubs</h3>
    <div>
      <button class="btn btn-info" @click="fetchData">Refresh</button>
      <post-item
        v-for="post in posts"
        :key="post._id"
        :id ="post.hub.name"
        :postId="post._id"
        :title="post.title"
        :text="post.text"
      ></post-item>
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
        const res = await fetch(`http://localhost:8081/blackboard/allPosts`)
        const resData = await res.json()

        if(!res.ok) {
            const error = new Error(resData.message || 'Failed to fetch post!')
            console.log(error.message);
            throw error        
        }

        console.log(resData)
        this.posts = resData
    }
  },
};
</script>