<template>
  <div>
    <h1>Wiki</h1>
    <div>
      <div v-if="isAuthenticated()">
        <a v-if="!editing" href="#" @click="editing = !editing">Edit</a>
        <a href="#" @click="editing = !editing" v-else>End editing</a>
      </div>
    </div>

    <!--
      TODO write help page
       <div v-if="editing">
      <a href="" >Help on this Wiki</a>
      </div> -->
    <div class="with-sidebar">
      <div class="sidebar">
        <div class="list-group">
          <category-item v-for="category in wikiContent" :key="category.id" v-on:updatedwikidata="fetchData"
            :thisCategory="category"></category-item>
          <li v-if="editing" class="list-group-item">
            <a href="#" v-if="!addingCategory" @click="addingCategory = true">Add Category</a>
            <div v-else class="form-group">
              <input type="text" v-model="newCategoryInput" />
              <button class="btn btn-primary" @click="addCategory(newCategoryInput)">
                Add
              </button>
              <button class="btn btn-outline-primary" @click="addingCategory = false">
                Dismiss
              </button>
            </div>
          </li>
        </div>
      </div>

      <div class="content">
        <content-item v-on:updatedwikidata="fetchData"></content-item>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryItem from "../components/wiki/CategoryItem.vue";
import ContentItem from "../components/wiki/ContentItem.vue";
import { api } from "@/api.js";
import { useAuthStore } from "@/stores/auth.js";
export default {
  components: { CategoryItem, ContentItem },
  data() {
    return {
      loading: true,
      addingCategory: false,
      newCategoryInput: "",
      editingArticle: false,
      addingArticle: false,
      editing: false,
      selectedArticleIndex: { categoryId: "", articleIdx: 0 },
      selectedArticle: {},
      wikiContent: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    isAuthenticated() {
      return useAuthStore().isAuthenticated
    },
    async fetchData() {
      this.wikiContent = await api.get("wiki/all");
      this.loading = false;
      this.updateSelectedArticle();
    },
    updateSelectedArticle() {
      //set selected article to selectedArticleIndex
      try {
        let selectedCategory = this.wikiContent.filter(
          (cat) => cat._id === this.selectedArticleIndex.categoryId
        )[0];
        console.log(JSON.stringify(selectedCategory))
        this.selectedArticle =
          selectedCategory["articles"][this.selectedArticleIndex.articleIdx];
        console.log("article idx " + this.selectedArticleIndex.articleIdx)
        console.log("selected article " + JSON.stringify(this.selectedArticle))
      } catch {
        console.log("article " + this.selectedArticleIndex.articleIdx);
        console.log("category " + this.currentCategoryId);
      }
    },
    async addCategory(category) {
      await api.post("wiki/addCategory", { name: category });
      this.addingCategory = false;
      this.fetchData();
    },
  },
};
</script>


<style scoped>
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1);
}

.with-sidebar> :first-child {
  flex-grow: 1;
}

.with-sidebar> :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-width: 60%;
}

.sidebar {
  border-right: 2px black solid;
  padding-right: 3rem;
}

.content {
  padding-left: 2rem;
}
</style>