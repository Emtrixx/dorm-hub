<template>
<div class="row justify-content-center">

    <news-widget class="col-md-10"></news-widget>

    <blackboard-widget class="col-md-10"></blackboard-widget>

    <wiki-widget class="col-md-10"></wiki-widget>

    <minecraft-widget class="col-md-10"></minecraft-widget>
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
