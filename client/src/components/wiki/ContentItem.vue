<template>
  <div class="content">
    <div v-if="!$parent.editingArticle">
      <h3>{{ $parent.selectedArticle.title }}</h3>
      <p v-html="$parent.selectedArticle.textAsHtml">
      </p>
    </div>
    <div v-else class="form-group">
      <p>Title</p>
      <input type="text" class="form-control" v-model="$parent.selectedArticle.title" />
      <p>Article</p>
      <textarea class="form-control" v-model="$parent.selectedArticle.text"></textarea>
      <div>
        <button class="btn btn-primary"
          @click="
            setArticleToCategory(
              $parent.selectedArticle,
              $parent.currentCategoryId
            )
          "
        >
          Save Article
        </button>
        <button @click="dismiss()" class="btn btn-outline-primary">Dismiss</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    async setArticleToCategory(article, categoryID) {
      let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
      console.log("sending article " + article);
      await fetch(url + "wiki/setArticleToCategory", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categoryID, article: article }),
      });
      this.$emit("updatedwikidata");
      this.$parent.editingArticle = false;
    },
    dismiss(){
      this.$parent.editingArticle = false;
      this.$parent.selectedArticle = {};
    }
  },
};
</script>