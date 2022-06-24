<template>
    <div >
        <base-card @click="postLink" class="card">
            <h4>{{ title }}</h4>
            <p><i>hub/{{ id }}</i></p>
            <p>{{ text.slice(0,100) + (text.length > 100? "...": "" )}}</p>
            <p style="color:grey; font-size: 10px;">{{created_at.toDateString()}}</p>   
        </base-card>
    </div>
</template>

<script>
export default {
    props: ['id', 'post'],
    data() {
        return {
            postId: this.post._id,
            author: this.post.author,
            title: this.post.title,
            text: this.post.text,
            created_at: new Date(this.post.createdAt)
        };
    },
    computed: {
        currentUserId() {
            return this.$store.getters["userId"];
        },
        isAuthenticated() {
            return this.$store.getters['isAuthenticated']
        }
    },
    methods: {
        postLink() {
            this.$router.push('/blackboard/' + this.id + '/' + this.postId);
        }
    }
}
</script>

<style scoped>
/* a {
    text-decoration: none;
    color: black;
    padding: 0;
} */

.card:hover {
    cursor: pointer;
    transform: scale(1.01);
    transition: 200ms all ease;
}
</style>