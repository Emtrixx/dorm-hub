import { defineStore } from 'pinia'
import { api } from '@/api'

export const useBlackboardStore = defineStore('blackboard', {
  state: () => ({
    hub: {},
    post: {}
  }),
  getters: {
    posts: (state) => state.hub.posts
  },
  actions: {
    async fetchHub(hub) {
      this.hub = await api.get(`blackboard/${hub}`)
    },
    async fetchPost(hub, postId) {
      this.post = await api.get(`blackboard/${hub}/${postId}`)
    },
    async createPost(data) {
      const created = await api.post('blackboard/secure/setPost', data, { auth: true })
      this.hub.posts.push(created)
    }
  }
})
