<template>
<section>
  <h2 class="dh-section-title">House wiki</h2>
  <base-card class="dh-card-hover" @click="$router.push('/wiki')">
    <p class="mb-2">Washing machines, internet, moving in and out — the how-tos for living here.</p>
    <span class="dh-more">Open the wiki <i class="bi bi-arrow-right"></i></span>
  </base-card>
</section>
</template>

<style scoped>
.dh-more {
  font-weight: 600;
  font-size: 0.9rem;
}
</style>
