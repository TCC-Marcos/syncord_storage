import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken
  },

  actions: {
    login (accessToken, refreshToken, user = null) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.user = user

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },

    logout () {
      this.accessToken = null
      this.refreshToken = null
      this.user = null

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
})
