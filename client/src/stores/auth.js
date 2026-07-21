import { defineStore } from 'pinia'
import { api } from '@/api'

let timer

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    userId: null,
    roles: [],
    didAutoLogout: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    // UI convenience only — the server re-checks roles on every request
    hasRole: (state) => (role) =>
      state.roles.includes(role) || state.roles.includes('admin')
  },
  actions: {
    async signup(body) {
      return this.authenticate(body, 'register')
    },
    async login(body) {
      return this.authenticate(body, 'login')
    },
    async authenticate(body, mode) {
      const resData = await api.post(`auth/${mode}`, body)

      const expiresIn = +resData.expiresIn
      const expirationDate = Date.now() + expiresIn

      localStorage.setItem('token', resData.token)
      localStorage.setItem('userId', resData.userId)
      localStorage.setItem('roles', JSON.stringify(resData.roles || []))
      localStorage.setItem('tokenExpiration', expirationDate)

      timer = setTimeout(() => {
        this.autoLogout()
      }, expiresIn)

      this.token = resData.token
      this.userId = resData.userId
      this.roles = resData.roles || []
      this.didAutoLogout = false
    },
    tryLogin() {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const tokenExpiration = localStorage.getItem('tokenExpiration')

      const expiresIn = +tokenExpiration - Date.now()
      if (expiresIn < 1000) {
        return
      }

      timer = setTimeout(() => {
        this.autoLogout()
      }, expiresIn)

      if (token && userId) {
        this.token = token
        this.userId = userId
        try {
          this.roles = JSON.parse(localStorage.getItem('roles')) || []
        } catch {
          this.roles = []
        }
        this.didAutoLogout = false
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('roles')
      localStorage.removeItem('tokenExpiration')

      clearTimeout(timer)

      this.token = null
      this.userId = null
      this.roles = []
    },
    autoLogout() {
      this.logout()
      this.didAutoLogout = true
    }
  }
})
