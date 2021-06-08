<template>
    <router-link :to="postLink">
    <base-card>
    <h4>{{ title }}</h4>
    <p>{{ text }}</p>
    </base-card>
    </router-link>
</template>

<script>
export default {
    props: ['id', 'title', 'text'],
    computed: {
        postLink() {
            return this.$route.path + '/' + this.id;
        }
}
}
</script>