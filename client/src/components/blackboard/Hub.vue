<template>
  <div>
    <h3>Test</h3>
    <p>{{ id }}</p>
    <p>{{ posts[0].title }}</p>
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
      await this.$store.dispatch("blackboard/fetchPosts");
    },
  },
};
</script>