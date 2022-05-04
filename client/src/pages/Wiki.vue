<template>
  <div>
    <h1>Wiki</h1>
    <div>
      <a v-if="!editing" href="#" @click="editing = !editing">Edit</a>
      <a href="#" @click="editing = !editing" v-else>End editing</a>
    </div>
    <div class="with-sidebar">
      <div class="sidebar">
        <div class="list-group">
          <li
            class="list-group-item"
            v-for="category in wikiContent"
            :key="category.id"
          >
            <p v-if="!renamingCategory">{{ category.name }}</p>
            <div v-else>
              <input type="text" v-model="editingCategoryName" />
              <button
                @click="renameCategory(editingCategoryName, category._id)"
              >
                OK
              </button>
              <button @click="renamingCategory = false">Dismiss</button>
            </div>
            <div
              v-if="
                editing && category.modifiable && category.articles.length == 0
              "
            >
              <a href="#" @click="removeCategory(category.name)"
                ><i class="bi bi-trash"></i
              ></a>
              <a href="#" @click="openCategoryEditor(category.name)"
                ><i class="bi bi-pen"></i
              ></a>
            </div>
            <ul>
              <li
                class="list-group-item"
                href="#"
                @click="selectedArticle = article"
                v-for="article in category.articles"
                :key="article.id"
              >
                <a class="" href="#">
                  {{ article.title }}
                </a>
                <div v-if="editing && category.modifiable">
                  <a href="#" @click="removeArticle(article)"
                    ><i class="bi bi-trash"></i
                  ></a>
                  <a href="#" @click="openArticleEditor(article)"
                    ><i class="bi bi-pen"></i
                  ></a>
                </div>
              </li>
              <li v-if="editing && category.modifiable" class="list-group-item">
                <a
                  href="#"
                  @click="
                    openArticleEditor({});
                    currentCategoryID = category._id;
                  "
                  >Add Article</a
                >
              </li>
            </ul>
          </li>
          <li v-if="editing" class="list-group-item">
            <a href="#" v-if="!addingCategory" @click="addingCategory = true"
              >Add Category</a
            >
            <div v-else>
              <input type="text" v-model="newCategoryInput" />
              <button @click="addCategory(newCategoryInput)">Add</button>
              <button @click="addingCategory = false">Dismiss</button>
            </div>
          </li>
        </div>
      </div>

      <div class="content">
        <div v-if="!editingArticle">
          <h3>{{ selectedArticle.title }}</h3>
          <p>
            {{ selectedArticle.text }}
          </p>
        </div>
        <div v-else>
          <p>Title</p>
          <input type="text" v-model="selectedArticle.title" />
          <p>Article</p>
          <textarea v-model="selectedArticle.text"></textarea>
          <div>
            <button
              @click="addArticleToCategory(selectedArticle, currentCategoryID)"
            >
              Save Article
            </button>
            <button @click="editingArticle=false">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wikiContent: [],
      selectedArticle: {},
      loading: true,
      addingCategory: false,
      currentCategoryID: "",
      editingArticle: false,
      newCategoryInput: "",
      editing: false,
      renamingCategory: false,
      editingCategoryName: "",
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    openArticleEditor(article) {
      this.editingArticle = true;
      this.selectedArticle = article;
    },
    async fetchData() {
      let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
      const res = await fetch(url + "wiki/all");
      const resData = await res.json();
      if (!res.ok) {
        const error = new Error(resData.message || "Failed to fetch post!");
        console.log(error.message);
        throw error;
      }
      this.wikiContent = resData;
      this.loading = false;
      this.$forceUpdate();
    },
    openCategoryEditor(categoryName) {
      this.renamingCategory = true;
      this.editingCategoryName = categoryName;
    },
    async addCategory(category) {
      let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
      await fetch(url + "wiki/addCategory", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: category }),
      });
      this.addingCategory = false;
      this.fetchData();
    },
    async renameCategory(categoryName, categoryId) {
      this.editingCategoryName = false;
      console.log(categoryName);
      console.log(categoryId);
      this.fetchData();
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
        this.fetchData();
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
        this.fetchData();
      }
    },
    async addArticleToCategory(article, categoryID) {
      let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
      await fetch(url + "wiki/addArticleToCategory", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categoryID, article: article }),
      });
      this.fetchData();
      this.editingArticle = false;
    },
    async editArticle(article, newContent) {
      console.log(article);
      console.log(newContent);
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

.with-sidebar > :first-child {
  flex-grow: 1;
}

.with-sidebar > :last-child {
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