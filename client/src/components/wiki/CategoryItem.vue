<template>
  <li class="list-group-item">
    <p v-if="!renamingCategory">{{ category.name }}</p>
    <div v-else class="form-group">
      <input type="text" v-model="editingCategoryName" />
      <button class="btn btn-primary" @click="renameCategory(editingCategoryName, category._id)">
        OK
      </button>
      <button @click="renamingCategory = false" class="btn btn-outline-primary">
        Dismiss
      </button>
    </div>
    <span v-if="
      $parent.editing && category.modifiable && category.articles.length == 0
    ">
      <a href="#" @click="removeCategory(category.name)"><i class="bi bi-trash"></i></a>
    </span>
    <span v-if="category.modifiable">
      <a href="#" @click="openCategoryEditor(category.name)" v-if="$parent.editing"><i class="bi bi-pen"></i></a>
    </span>
    <ul>
      <li class="list-group-item" href="#" @click="$parent.selectedArticle = article"
        v-for="(article, articleIdx) in category.articles" :key="article.id">
        <a class="" href="#" @click="$parent.editingArticle = false">
          {{ article.title }}
        </a>
        <div v-if="($parent.editing && category.modifiable) && article.author._id === userId()">
          <a href="#" @click="removeArticle(article)"><i class="bi bi-trash"></i></a>
          <a href="#" @click="openArticleEditor(articleIdx)"><i class="bi bi-pen"></i></a>
        </div>
        <div v-else>
          <div v-if="$parent.editing && article.author._id !== userId()">editable by {{ article.author.firstName + " " +
              article.author.lastName
          }}</div>
        </div>
      </li>
      <li v-if="$parent.editing && category.modifiable" class="list-group-item">
        <a href="#" @click="openArticleCreator()">Add Article</a>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  props: { thisCategory: { type: Object } },
  data() {
    return {
      renamingCategory: false,
      editingCategoryName: "",
    };
  },
  computed: {
    category() {
      return this.thisCategory;
    },
  },
  methods: {
    userId() {
      return this.$store.getters['userId']
    },
    openCategoryEditor(categoryName) {
      this.renamingCategory = true;
      this.editingCategoryName = categoryName;
    },
    async renameCategory(categoryName, categoryId) {
      let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
      this.renamingCategory = false;
      await fetch(url + "wiki/renameCategory", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: categoryName, categoryId: categoryId }),
      });
      this.category.name = categoryName;
      this.$emit("updatedwikidata");
    },
    async removeCategory(category) {
      if (confirm("Do you want to delete " + category + "?")) {
        let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
        let res = await fetch(url + "wiki/removeCategory", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: category }),
        });
        if (!res.ok) alert("Could not delete category " + category + ".");
        this.$parent.selectedArticle = {};
        this.$emit("updatedwikidata");
        //this.editingArticle = false;
      }
    },
    async removeArticle(article) {
      console.log(article);
      if (confirm("Do you want to delete " + article.title + "?")) {
        let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
        await fetch(url + "wiki/removeArticle", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId: article._id }),
        });
        this.category.articles = this.category.articles.filter(
          (wikiArticle) => wikiArticle._id !== article._id
        );
        this.$emit("updatedwikidata");
      }
    },
    openArticleEditor(articleIdx) {
      this.$parent.editingArticle = true;
      this.$parent.selectedArticle = this.category.articles[articleIdx];
      this.$parent.selectedArticle.author = this.userId();
      this.$parent.selectedArticleIndex.categoryId = this.category._id;
      this.$parent.selectedArticleIndex.articleIdx = articleIdx;
    },
    openArticleCreator() {
      this.$parent.addingArticle = true;
      this.$parent.selectedArticleIndex.categoryId = this.category._id;
      this.$parent.selectedArticleIndex.articleIdx = this.category.articles.length;
      this.$parent.selectedArticle = { title: "", text: "" };
      this.$parent.selectedArticle.author = this.userId();
    },
  },
};
</script>