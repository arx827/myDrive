import axios from 'axios'
import type { App } from 'vue'
import pinia from '@stores/pinia'
import { useAuthStore } from '@stores/useUser'
import VueJwtDecode from 'vue-jwt-decode'
import type { Router } from 'vue-router'
import type { LoginState } from './model'
import message from '@/plugins/message'
import modal from '@/plugins/modal'

export const LOGIN_STATE = 'login_state'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $user: UserService
  }
}

interface options {
  Router: Router
}

const userStore = useAuthStore(pinia)

export class UserService {
  private $router
  private _loginState$ = userStore.loginState

  public get loginState$() {
    return this._loginState$
  }

  public get loginState(): LoginState {
    const loginStateStr = userStore.getLoginState
    if (loginStateStr) {
      return loginStateStr
    }
    return null
  }

  public get token(): string {
    if (this.loginState) {
      return this.loginState.accessToken
    }
    return null
  }

  private setIntervalCheckItem = null

  private init(): boolean {
    if (this.hasValidToken()) {
      this.signIn(this.token)
      return true
    }
    this.signOut()
    return false
  }

  public hasValidToken(): boolean {
    const jwtStr = this.token
    if (jwtStr) {
      return !this.isTokenExpired(jwtStr)
    }
    return false
  }

  public signIn(token: string) {
    const loginState = {
      accessToken: null,
      me: null,
    }
    loginState.accessToken = token
    userStore.updateLoginState(loginState)
    this.setIntervalCheckItem = setInterval(() => {
      this.checkTokenExp()
    }, 5000)
  }

  public async signOut(clearToken?: boolean) {
    if (clearToken) {
      // 強制登出API, 後端銷毀token用
      await axios
        .post(`${process.env.VITE_APP_API_BASE_URL}/api/oss-auth/logout`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(resp => {
          this.clearLoginInfo()
        })
        .catch(err => {
          // console.log(err);
        })
    } else {
      this.clearLoginInfo()
    }
  }

  private clearLoginInfo() {
    sessionStorage.removeItem(LOGIN_STATE)
    sessionStorage.clear()
    clearInterval(this.setIntervalCheckItem)
    userStore.clearLoginState()
  }

  public changeToken(newToken) {
    const loginStateObj = userStore.getLoginState || {}
    loginStateObj.accessToken = newToken
    userStore.updateLoginState(loginStateObj)
  }

  // 確認Token時效
  public checkTokenExp() {
    if (!this.hasValidToken()) {
      const $router = this.$router
      // 彈出視窗
      modal.error({
        title: '閒置超過30分鐘',
        content: '請重新登入系統',
        onOk() {
          $router.replace({ path: '/login' })
        },
      })
      this.signOut()
    }
  }

  public getMe() {
    if (!this.loginState) {
      return null
    }
    return this.loginState.me
  }

  private isTokenExpired(token: string): boolean {
    const decoded = VueJwtDecode.decode(token)
    const now = Date.now()
    return Math.floor(now / 1000) > decoded.exp
  }

  public install(app: App, options?: options) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$user = this

    this.init()
    this.$router = options.Router

    // intercept jwt token
    axios.interceptors.request.use(
      config => {
        if (this.hasValidToken() && !('Authorization' in config.headers.common)) {
          const token = this.token
          config.headers.common.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error),
    )

    // logout on 401/403
    axios.interceptors.response.use(
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      async response => {
        if (this.token && response.data.jwtTokenPair) {
          await this.changeToken(response.data.jwtTokenPair.accessToken)
        }
        if (response.data.status === 401) {
          modal.error({
            title: 'TOKEN失效',
            content: '請重新登入系統。',
            onOk: () => {
              this.signOut()
              this.$router.replace({ path: '/login' })
            },
          })
        }
        return response
      },
      error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.log(error)
        if (error.response.status === 401 || error.response.status === 403) {
          this.signOut()
          this.$router.replace({ path: '/login' })
          message.error({
            content: '權限不足',
          })
        }
        return Promise.reject(error)
      },
    )
  }
}
export default new UserService()
