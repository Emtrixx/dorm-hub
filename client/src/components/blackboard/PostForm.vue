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
export default {
  props: ['hub'],
  data() {
    return {
      title: "adfsfasdfasdf",
      text: "asdfasdfsadfadsf",
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
      let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
      //get post id
      let res = await fetch(url + 'blackboard-secure/new-post-id/' + this.hub, {
        headers: {
          'Authorization': "Bearer " + localStorage.getItem('token')
        },
        method: 'GET'
      }
      );
      let postId = await res.json()
      console.log("postID " + postId)
      this.images.append("postId", postId)
      await fetch(url + 'blackboard-secure/upload-images', {
        headers: {
          'Authorization': "Bearer " + localStorage.getItem('token')
        },
        method: 'POST',
        body: this.images
      })

      let formData = {
        title: this.title,
        text: this.text,
        comments: [],
      };

      if (this.$store.getters.userId) {
        formData = {
          ...formData,
          author: this.$store.getters.userId,
        };
      }

      this.$emit("save-data", formData);
    },
  },
};
</script>