<template>
  <base-card>
    <news-widget></news-widget>
  </base-card>
  <base-card>
    <blackboard-widget></blackboard-widget>
  </base-card>
  <base-card>
    <wiki-widget></wiki-widget>
  </base-card>
</template>

<script>
import NewsWidget from "../components/home/NewsWidget.vue";
import BlackboardWidget from "../components/home/BlackboardWidget.vue";
import WikiWidget from "../components/home/WikiWidget.vue";

export default {
  components: {
    NewsWidget,
    BlackboardWidget,
    WikiWidget
  },
};
</script>
