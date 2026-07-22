<template>
  <div>
    <div v-if="loading">Loading…</div>
    <div v-else>
      <base-card>
        <post-editor
          :hubId="id"
          :current_post="post"
          v-if="canEditPost"
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
      <comment-form v-if="isAuthenticated" @save-data="createComment"></comment-form>
      <p v-else>Log in to leave a comment.</p>
      <div v-if="post.comments">
        <base-card v-for="comment in post.comments" :key="comment._id">
          <p>{{ comment.text }}</p>
          <p>
            by
            <strong
              >{{ comment.author.firstName }}
              {{ comment.author.lastName }}</strong
            >
          </p>
          <button
            v-if="canDeleteComment(comment)"
            class="btn btn-sm btn-outline-danger"
            @click="deleteComment(comment)"
          >
            <i class="bi bi-trash"></i>
          </button>
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
    isAuthenticated() {
      return useAuthStore().isAuthenticated;
    },
    // 'hubs' role users moderate the blackboard (matches server enforcement)
    canEditPost() {
      const auth = useAuthStore();
      return (
        (this.post.author && this.post.author._id === auth.userId) ||
        auth.hasRole("hubs")
      );
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
    canDeleteComment(comment) {
      const auth = useAuthStore();
      return (
        comment.author &&
        (comment.author._id === auth.userId || auth.hasRole("hubs"))
      );
    },
    async createComment(data) {
      await api.post(`blackboard/secure/${this.id}/${this.postId}`, data, { auth: true });
      this.fetchPost();
    },
    async deleteComment(comment) {
      if (confirm("Delete this comment?")) {
        await api.delete(`blackboard/secure/comments/${comment._id}`, undefined, { auth: true });
        this.fetchPost();
      }
    },
  },
};
</script>
