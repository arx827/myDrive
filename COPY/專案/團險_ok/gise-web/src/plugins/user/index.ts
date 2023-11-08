import axios from 'axios'
import type { App } from 'vue'
import pinia from '@stores/pinia'
import { useAuthStore } from '@stores/useUser'
import VueJwtDecode from 'vue-jwt-decode'
import type { Router } from 'vue-router'
import type { LoginState } from './model'
import message from '@/plugins/message'
import modal from '@/plugins/modal'
import type { AuthenticationEmpResult } from '@fubonlife/gise-api-axios-sdk'

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
let isShowErrorModal: boolean = false

export class UserService {
  private $router
  private _loginState$ = userStore.loginState

  public get loginState$() {
    return this._loginState$
  }

  private isChangingToken: boolean = false

  private isSignOut: boolean = false

  public get loginState(): LoginState | null {
    const loginStateStr = userStore.getLoginState
    if (!loginStateStr) return null
    return loginStateStr
  }

  public get token(): string | null {
    if (!this.loginState) return null
    return this.loginState.accessToken
  }

  private setIntervalCheckItem = null

  private init(): boolean {
    console.log(this.hasValidToken())
    if (this.hasValidToken()) {
      this.signIn(this.token, this.loginState.me)
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

  public signIn(token: string, userInfo: AuthenticationEmpResult) {
    const loginState = {
      accessToken: null,
      me: userInfo,
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
      this.isSignOut = true
      await axios
        .post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/emp-auth/logout`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(resp => {
          this.clearLoginInfo()
        })
      // .catch(err => {
      //   modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      // })
    } else {
      this.clearLoginInfo()
    }
  }

  private clearLoginInfo() {
    sessionStorage.removeItem(LOGIN_STATE)
    sessionStorage.param = null
    clearInterval(this.setIntervalCheckItem)
    userStore.clearLoginState()
    console.log('clearLoginInfo')
  }

  public async changeToken() {
    // 避免頻繁換token，小於2分鐘才換
    const _this = this
    if (this.hasValidToken() && this.getTokenExp() < 28 && !this.isChangingToken) {
      this.isChangingToken = true
      await axios
        .post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/auth/current/account`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(resp => {
          if (resp.data.status == 200) {
            const getData = resp.data.data
            const loginStateObj = userStore.getLoginState || {}
            loginStateObj.accessToken = getData
            userStore.updateLoginState(loginStateObj)
            console.log(userStore.getLoginState)
          } else {
            // 失敗訊息
            console.log(resp.data.apiError)
            const errorMsg = []
            Object.values(resp.data.apiError).map(i => {
              ;(i as any).map(j => {
                errorMsg.push(j)
              })
            })
            modal.error({
              title: '錯誤',
              content: errorMsg.toString(),
              onOk() {
                _this.signOut(false)
              },
            })
          }
        })
        .catch(err => {
          // console.log(err);
        })
        .finally(() => {
          this.isChangingToken = false
        })
    }
  }

  private getTokenExp(): number {
    const tokenExp = VueJwtDecode.decode(this.token).exp
    const now = Date.now()
    // Token 剩餘時效 (分鐘)
    const lessTime = Math.floor((tokenExp - Math.floor(now / 1000)) / 60)
    return lessTime
  }

  // 確認Token時效
  public checkTokenExp() {
    if (!this.hasValidToken() && !this.isChangingToken) {
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

  public getMe(): AuthenticationEmpResult | null {
    if (!this.loginState) return null
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
        if (this.token && this.hasValidToken() && !this.isSignOut) {
          await this.changeToken()
        }
        if (response.data.status === 401 && !this.isChangingToken) {
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
        console.error(error)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          this.signOut()
          this.$router.replace({ path: '/login' })
          message.error({
            content: '權限不足',
          })
        }
        if (error?.response?.status === 500) this.$router.push({ path: '/server-error' })

        if (!isShowErrorModal) {
          isShowErrorModal = true
          modal.error({
            title: '錯誤',
            content: '系統有誤，請洽系統管理者',
            onOk: () => {
              isShowErrorModal = false
            },
          })
        }

        // return Promise.reject(error)
      },
    )
  }
}
export default new UserService()
