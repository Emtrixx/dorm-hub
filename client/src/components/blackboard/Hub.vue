<template>
  <div>
    <h3>{{ id }}</h3>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: ["id"],
};
</script>
