<template>
  <div class="col col-md-12 col-lg-4">
    <base-card @click="postLink" class="card">
      <h4>{{ title.slice(0, 15) + (title.length > 15 ? "..." : "") }}</h4>
      <p>
        <em>hub/{{ id }}</em>
      </p>
      <p>{{ text.slice(0, 200) + (text.length > 200 ? "..." : "") }}</p>
      <p style="color:grey; font-size: 10px;">
        {{ created_at.toDateString() }}
      </p>
    </base-card>
  </div>
</template>

<script>
import { computed, toRefs  } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    props: {
        id: String,
        post: Object,
    },
    setup(props) {
        const store = useStore();
        const router = useRouter();
        const { post } = toRefs(props);
        const { _id, author, title, text, createdAt } = toRefs(post.value);
        const currentUserId = computed(() => {
            return store.getters.userId;
        });
        const isAuthenticated = computed(() => {
            return store.getters.isAuthenticated;
        });
        function postLink() {
            router.push('/blackboard/' + props.id + '/' + _id.value);
        }
        return {
            postId: _id,
            author: author,
            title: title,
            text: text,
            created_at: new Date(createdAt.value),
            currentUserId,
            isAuthenticated,
            postLink
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
