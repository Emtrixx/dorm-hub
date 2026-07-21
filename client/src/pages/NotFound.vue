
<template>
<section class="text-center">
    <base-card class="notfound-card">
        <span class="dh-chip notfound-code">404</span>
        <h2 class="mt-3">This note fell off the board</h2>
        <p class="mb-0">The page you're looking for doesn't exist — maybe check the <router-link to="/news">news</router-link> or the <router-link to="/blackboard/all">blackboard</router-link>.</p>
    </base-card>
</section>
</template>

<style scoped>
.notfound-card {
    max-width: 30rem;
    margin-top: 4rem;
    padding: 2.5rem 2rem;
}

.notfound-code {
    font-family: var(--dh-font-display);
    font-weight: 680;
    font-size: 1.4rem;
}
</style>
