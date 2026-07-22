<template>
  <div class="dh-card p-3">
    <div class="mb-2">
      <input type="text" class="form-control" placeholder="Title" v-model="title" />
    </div>
    <div v-for="(block, idx) in blocks" :key="idx" class="mb-2 d-flex gap-2 align-items-start">
      <div class="flex-grow-1">
        <textarea
          v-if="block.contentType === 'text'"
          class="form-control"
          rows="4"
          placeholder="Text"
          v-model="block.content"
        ></textarea>
        <div v-else>
          <input type="text" class="form-control" placeholder="Image URL" v-model="block.content" />
          <img v-if="block.content" :src="block.content" class="img-fluid mt-1 block-preview" alt="preview" />
        </div>
      </div>
      <button
        class="btn btn-sm btn-outline-danger"
        title="Remove block"
        :disabled="blocks.length === 1"
        @click="blocks.splice(idx, 1)"
      >
        <i class="bi bi-trash"></i>
      </button>
    </div>
    <div class="btn-group btn-group-sm mb-3">
      <button class="btn btn-outline-primary" @click="blocks.push({ contentType: 'text', content: '' })">
        <i class="bi bi-text-paragraph"></i> Add text
      </button>
      <button class="btn btn-outline-primary" @click="blocks.push({ contentType: 'img', content: '' })">
        <i class="bi bi-image"></i> Add image
      </button>
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" @click="save">{{ news ? "Save" : "Publish" }}</button>
      <button class="btn btn-outline-primary" @click="$emit('dismiss')">Dismiss</button>
    </div>
  </div>
</template>

<script>
import { api } from "@/api.js";

// Create/edit form for a news item: a title plus the News model's typed
// content blocks (text and image URLs). Pass `news` to edit, omit to create.
export default {
  props: { news: { type: Object, default: null } },
  emits: ["saved", "dismiss"],
  data() {
    return {
      title: this.news?.title || "",
      blocks: this.news?.content?.length
        ? this.news.content.map(({ contentType, content }) => ({ contentType, content }))
        : [{ contentType: "text", content: "" }],
    };
  },
  methods: {
    async save() {
      if (!this.title.trim()) return;
      const content = this.blocks.filter((block) => block.content.trim());
      const path = this.news ? `news/secure/${this.news._id}` : "news/secure";
      await api.post(path, { title: this.title, content }, { auth: true });
      this.$emit("saved");
    },
  },
};
</script>

<style scoped>
.block-preview {
  max-height: 10rem;
}
</style>
