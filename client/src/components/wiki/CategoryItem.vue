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
        <div v-if="$parent.editing && category.modifiable">
          <a href="#" @click="removeArticle(article)"><i class="bi bi-trash"></i></a>
          <a href="#" @click="openArticleEditor(articleIdx)"><i class="bi bi-pen"></i></a>
        </div>
      </li>
      <li v-if="$parent.editing && category.modifiable" class="list-group-item">
        <a href="#" @click="openArticleCreator()">Add Article</a>
      </li>
    </ul>
  </li>
</template>

<script>
import { api } from "@/api.js";

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
    openCategoryEditor(categoryName) {
      this.renamingCategory = true;
      this.editingCategoryName = categoryName;
    },
    async renameCategory(categoryName, categoryId) {
      this.renamingCategory = false;
      await api.post("wiki/secure/renameCategory", { newName: categoryName, categoryId: categoryId }, { auth: true });
      this.category.name = categoryName;
      this.$emit("updatedwikidata");
    },
    async removeCategory(category) {
      if (confirm("Do you want to delete " + category + "?")) {
        try {
          await api.post("wiki/secure/removeCategory", { name: category }, { auth: true });
        } catch {
          alert("Could not delete category " + category + ".");
        }
        this.$parent.selectedArticle = {};
        this.$emit("updatedwikidata");
        //this.editingArticle = false;
      }
    },
    async removeArticle(article) {
      if (confirm("Do you want to delete " + article.title + "?")) {
        await api.post("wiki/secure/removeArticle", { articleId: article._id }, { auth: true });
        this.category.articles = this.category.articles.filter(
          (wikiArticle) => wikiArticle._id !== article._id
        );
        this.$emit("updatedwikidata");
      }
    },
    openArticleEditor(articleIdx) {
      this.$parent.editingArticle = true;
      this.$parent.selectedArticle = this.category.articles[articleIdx];
      this.$parent.selectedArticleIndex.categoryId = this.category._id;
      this.$parent.selectedArticleIndex.articleIdx = articleIdx;
    },
    openArticleCreator() {
      this.$parent.addingArticle = true;
      this.$parent.selectedArticleIndex.categoryId = this.category._id;
      this.$parent.selectedArticleIndex.articleIdx = this.category.articles.length;
      // the server stamps the author from the JWT
      this.$parent.selectedArticle = { title: "", text: "" };
    },
  },
};
</script>