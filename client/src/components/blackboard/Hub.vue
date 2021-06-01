<template>
    <h3>{{ id }}</h3>
  <div>
    <base-card v-for="post in posts.posts" :key="post.id">
    <h4>{{ post.title }}</h4>
    <p>{{ post.text }}</p>
    </base-card>
  </div>
</template>

<script>
export default {
  props: ["id"],
  computed: {
    posts() {
      return this.$store.getters["blackboard/getPosts"];
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await this.$store.dispatch("blackboard/fetchPosts", {hub: this.id});
    },
  },
};
</script>