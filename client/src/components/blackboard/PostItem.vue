<template>
  <div class="col col-md-12 col-lg-4 d-flex">
    <base-card @click="postLink" class="dh-card-hover dh-taped post-card w-100">
      <span class="hub-tag">{{ id }}</span>
      <h4 class="post-title">{{ title.slice(0, 40) + (title.length > 40 ? "…" : "") }}</h4>
      <p class="post-text">{{ text.slice(0, 200) + (text.length > 200 ? "…" : "") }}</p>
      <p class="post-date">{{ created_at.toDateString() }}</p>
    </base-card>
  </div>
</template>

<script>
import { computed, toRefs  } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
export default {
    props: {
        id: String,
        post: Object,
    },
    setup(props) {
        const authStore = useAuthStore();
        const router = useRouter();
        const { post } = toRefs(props);
        const { _id, author, title, text, createdAt } = toRefs(post.value);
        const currentUserId = computed(() => {
            return authStore.userId;
        });
        const isAuthenticated = computed(() => {
            return authStore.isAuthenticated;
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
.post-card {
  display: flex;
  flex-direction: column;
}

.hub-tag {
  align-self: flex-start;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dh-mist);
  border: 1px solid var(--dh-line);
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
  margin-bottom: 0.6rem;
}

.post-title {
  font-size: 1.15rem;
  margin-bottom: 0.35rem;
}

.post-text {
  color: var(--dh-ink-soft);
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.post-date {
  margin-top: auto;
  margin-bottom: 0;
  color: var(--dh-mist);
  font-size: 0.78rem;
}
</style>
