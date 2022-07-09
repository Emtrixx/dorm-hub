<template>
  <div>
    <div v-if="loading">LOADING</div>
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
      return this.$store.getters["blackboard/getPost"];
    },
    currentUserId() {
      return this.$store.getters["userId"];
    },
    url() {
      return process.env.VUE_APP_HOST || "http://localhost:8081/";
    },
  },
  created() {
    this.fetchPost();
  },
  methods: {
    async fetchPost() {
      await this.$store.dispatch("blackboard/fetchPost", {
        hubId: this.id,
        postId: this.postId,
      });
      this.loading = false;
    },
    async createComment(data) {
      const payload = {
        hubId: this.id,
        postId: this.postId,
        data,
      };
      let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
      const res = await fetch(
        url + "blackboard-secure/" + payload.hubId + "/" + payload.postId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          method: "POST",
          body: JSON.stringify(payload.data),
        }
      );

      const resData = await res.json();

      if (!res.ok) {
        const error = new Error(resData.message || "Failed to create comment!");
        console.log(error.message);
        throw error;
      }
      this.fetchPost();
    },
  },
};
</script>
