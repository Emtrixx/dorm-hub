<template>
  <div class="row justify-content-center">
    <base-card v-if="!isAuthenticated" class="text-center col-md-12">
      <h2>Welcome to the Hagenbeckstraße Website!</h2>

      <img src="../assets/hagenbecks.png" alt="" >
      <p>Take a look around the website and sign-up if you want to create your own content!</p>
    </base-card>
    <news-widget class="col-md-5"></news-widget>

    <blackboard-widget class="col-md-5"></blackboard-widget>

    <wiki-widget class="col-md-5"></wiki-widget>

    <minecraft-widget class="col-md-5"></minecraft-widget>
  </div>
</template>

<script>
import NewsWidget from "../components/home/NewsWidget.vue";
import BlackboardWidget from "../components/home/BlackboardWidget.vue";
import WikiWidget from "../components/home/WikiWidget.vue";
import MinecraftWidget from "../components/home/MinecraftWidget.vue";

export default {
  components: {
    NewsWidget,
    BlackboardWidget,
    WikiWidget,
    MinecraftWidget
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated']
    }
  }
};
</script>

<style scoped>
img {
  width: 60%;
  margin: auto;
}
</style>
