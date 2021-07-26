<template>
    <router-link :to="postLink">
    <base-card>
    <h4>{{ title }}</h4>
    <p><i>hub/{{id}}</i></p>
    <p>{{ text }}</p>
    </base-card>
    </router-link>
</template>

<script>
export default {
    props: ['id', 'postId', 'title', 'text'],
    computed: {
        postLink() {
            return '/blackboard/'+this.id+'/'+this.postId;
        }
}
}
</script>

<style scoped>
a {
    text-decoration: none;
    color: black;
    padding: 0;
}
</style>