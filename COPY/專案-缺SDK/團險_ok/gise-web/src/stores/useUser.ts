import { defineStore } from 'pinia'

const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/api/users`
const LOGIN_STATE = 'login_state'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loginState: JSON.parse(sessionStorage.getItem(LOGIN_STATE)) ? JSON.parse(sessionStorage.getItem(LOGIN_STATE)) : {},
  }),
  getters: {
    getMe: state => (state.loginState ? state.loginState.me : null),
    getLoginState: state => state.loginState,
  },
  actions: {
    clearLoginState() {
      this.$state.loginState = null
      sessionStorage.setItem(LOGIN_STATE, null)
    },
    updateLoginState(payload) {
      this.$state.loginState = payload
      sessionStorage.setItem(LOGIN_STATE, JSON.stringify(payload))
    },
  },
})
