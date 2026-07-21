import { defineStore } from 'pinia'
import { api } from '@/api'

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsItem: {}
  }),
  actions: {
    async fetchNewsItem(newsId) {
      this.newsItem = await api.get(`news/${newsId}`)
    }
  }
})
