<template>
  <div>
    <h3 class="text-center">{{ id.toUpperCase() }}</h3>
    <router-view class=""></router-view>
  </div>
</template>

<script>
export default {
  props: ["id"],
};
</script>
