<template>

    <base-card @click="postLink" class="dh-card-hover news-card">
    <h4 class="news-title">{{ title }}</h4>
    <p class="news-author">{{ `${author.firstName} ${author.lastName}` }}</p>
    <p class="news-text">{{ text }}</p>
    </base-card>

</template>

<script>
export default {
    props: ['newsId', 'title', 'text', 'author'],
    methods: {
        postLink() {
            this.$router.push('/news/'+this.newsId);
        }
    },
}
</script>

<style scoped>
.news-title {
    font-size: 1.25rem;
    margin-bottom: 0.15rem;
}

.news-author {
    color: var(--dh-mist);
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.news-text {
    color: var(--dh-ink-soft);
    margin-bottom: 0;
}
</style>
