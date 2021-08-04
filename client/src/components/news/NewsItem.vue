<template>
    
    <base-card @click="postLink" class="card">
    <h4>{{ title }}</h4>
    <p><strong>{{ `${author.firstName} ${author.lastName}` }}</strong></p>
    <p>{{ text }}</p>
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
a {
    text-decoration: none;
    color: black;
    padding: 0;
}

.card:hover {
    cursor: pointer;
    transform: scale(1.01);
    transition: 200ms all ease;
}
</style>