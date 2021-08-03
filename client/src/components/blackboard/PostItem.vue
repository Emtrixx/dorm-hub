<template>
    
    <base-card @click="postLink" class="card">
    <h4>{{ title }}</h4>
    <p><i>hub/{{id}}</i></p>
    <p>{{ text }}</p>
    </base-card>
    
</template>

<script>
export default {
    props: ['id', 'postId', 'title', 'text'],
    methods: {
        postLink() {
            this.$router.push('/blackboard/'+this.id+'/'+this.postId);
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

.card:hover {
    cursor: pointer;
    transform: scale(1.01);
    transition: 200ms all ease;
}
</style>