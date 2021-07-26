<template>
  <div>
    <h3>{{ id.toUpperCase() }}</h3>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: ["id"],
};
</script>
