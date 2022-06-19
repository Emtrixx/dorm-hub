<template>
  <div>
    <h3 class="text-center">{{ id.charAt(0).toUpperCase() + id.slice(1) }}</h3>
    <router-view class=""></router-view>
  </div>
</template>

<script>
export default {
  props: ["id"],
};


</script>
