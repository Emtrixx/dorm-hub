<template>
  <div>
    <div v-if="loading">Loading…</div>
    <div v-else>
      <base-card>
        <post-editor
          :hubId="id"
          :current_post="post"
          v-if="post.author._id == currentUserId"
        ></post-editor>
        <h1>{{ post.title }}</h1>
        <p>
          by
          <strong
            >{{ post.author.firstName }} {{ post.author.lastName }}</strong
          >
        </p>
        <p>{{ post.text }}</p>
        <div class="d-flex">
          <div v-for="image_file in post.images" :key="image_file">
            <img
              v-bind:src="url + 'blackboard/post-images/' + image_file"
              class="img-fluid"
              alt="post image"
            />
          </div>
        </div>
      </base-card>
      <hr />
      <comment-form @save-data="createComment"></comment-form>
      <div v-if="post.comments">
        <base-card v-for="comment in post.comments" :key="comment.id">
          <p>{{ comment.text }}</p>
          <p>
            by
            <strong
              >{{ comment.author.firstName }}
              {{ comment.author.lastName }}</strong
            >
          </p>
        </base-card>
      </div>
    </div>
  </div>
</template>

<script>
import CommentForm from "./CommentForm.vue";
import PostEditor from "./PostEditor.vue";
import { api, BASE_URL } from "@/api.js";
import { useAuthStore } from "@/stores/auth.js";
import { useBlackboardStore } from "@/stores/blackboard.js";
export default {
  props: ["id", "postId"],
  components: { CommentForm, PostEditor },
  data() {
    return {
      loading: true,
      editing: false,
    };
  },
  computed: {
    post() {
      return useBlackboardStore().post;
    },
    currentUserId() {
      return useAuthStore().userId;
    },
    url() {
      return BASE_URL;
    },
  },
  created() {
    this.fetchPost();
  },
  methods: {
    async fetchPost() {
      await useBlackboardStore().fetchPost(this.id, this.postId);
      this.loading = false;
    },
    async createComment(data) {
      await api.post(`blackboard/secure/${this.id}/${this.postId}`, data, { auth: true });
      this.fetchPost();
    },
  },
};
</script>
