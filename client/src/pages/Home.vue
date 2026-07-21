<template>
<div>
  <header class="dh-page-head">
    <span class="dh-eyebrow">Studentenwohnheim Hagenbeckstraße</span>
    <h1>What's happening in the house</h1>
  </header>

  <div class="row g-4">
    <div class="col-lg-7">
      <news-widget></news-widget>
    </div>
    <div class="col-lg-5">
      <wiki-widget></wiki-widget>
      <minecraft-widget></minecraft-widget>
    </div>
  </div>

  <blackboard-widget class="mt-4"></blackboard-widget>
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
};
</script>
