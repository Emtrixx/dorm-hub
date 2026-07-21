<template>
  <base-card>
    <form class="needs-validation" @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="text" class="form-label">Title</label>
        <input class="form-control" type="text" id="title" name="title" v-model="title" required />
      </div>
      <div class="mb-3">
        <label for="text" class="form-label">Text</label>
        <textarea class="form-control" name="text" id="text" cols="30" rows="10" minlength="6" required
          v-model="text"></textarea>
      </div>
      <div>
        <input class="form-control" @change="updateImages($event)" type="file" multiple="true"
          accept="image/png, image/gif, image/jpeg">
      </div>

      <button class="btn btn-success">Submit</button>
    </form>
  </base-card>
</template>

<script>
import { api } from "@/api.js";
import { useAuthStore } from "@/stores/auth.js";

export default {
  props: ['hub'],
  data() {
    return {
      title: "",
      text: "",
      images: new FormData()
    };
  },
  methods: {
    updateImages(event) {
      let data = new FormData();

      for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files.item(i);
        data.append(file.name, file);
      }
      this.images = data
    },
    async submitForm() {
      //get post id
      let postId = await api.get('blackboard/secure/new-post-id/' + this.hub, { auth: true })

      let data = this.images
      //postId is there and in data object
      data.append("postId", postId)
      await api.post('blackboard/secure/upload-images', data, { auth: true })

      let formData = {
        title: this.title,
        text: this.text,
        comments: [],
      };

      const { userId } = useAuthStore()
      if (userId) {
        formData = {
          ...formData,
          author: userId,
          _id: postId
        };
      }

      this.$emit("save-data", formData);
    },
  },
};
</script>