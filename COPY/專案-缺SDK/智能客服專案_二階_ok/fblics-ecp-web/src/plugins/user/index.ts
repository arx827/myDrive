import axios from 'axios'
import type { App } from 'vue'
import { nextTick } from 'vue'
import pinia from '@stores/pinia'
import { useUser } from '@stores/useUser'
import VueJwtDecode from 'vue-jwt-decode'
import type { Router } from 'vue-router'
import type { LoginState } from './model'
import message from '@/plugins/message'
import modal from '@/plugins/modal'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'

export const LOGIN_STATE = 'login_state'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $user: UserService
  }
}

interface options {
  Router: Router
}

const { getLoginState, loginState } = storeToRefs(useUser(pinia))
const { updateLoginState, clearLoginState } = useUser(pinia)

export class UserService {
  private $router
  private _loginState$ = getLoginState.value

  public get loginState$() {
    return this._loginState$
  }

  public get loginState(): LoginState {
    const loginStateStr = getLoginState.value
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

  public async signIn(token: string) {
    const $loginState = {
      accessToken: null,
      me: null,
    }
    $loginState.accessToken = token
    updateLoginState($loginState)
  }

  public async signOut(clearToken?: boolean) {
    this.clearLoginInfo()
  }

  private clearLoginInfo() {
    sessionStorage.removeItem(LOGIN_STATE)
    sessionStorage.clear()
    clearLoginState()
  }

  public changeToken(newToken) {
    const loginStateObj = loginState.value || {}
    loginStateObj.accessToken = newToken
    updateLoginState(loginStateObj)
  }

  // 確認Token時效
  // public checkTokenExp() {
  //   if (!this.hasValidToken()) {
  //     const $router = this.$router
  //     // 彈出視窗
  //     modal.error({
  //       title: '閒置超過30分鐘',
  //       content: '請重新登入系統',
  //       onOk() {
  //         // TODO:
  //         // $router.replace({ path: '/login' })
  //       },
  //     })
  //     this.signOut()
  //   }
  // }
  // getNowBase64Encode() {
  //   const $nowDataTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
  //   return btoa($nowDataTime)
  // }

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
      async config => {
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
            },
          })
        }
        return response
      },
      error => {
        if (error.response.status === 401 || error.response.status === 403) {
          this.signOut()
          modal.error({
            content: '權限不足',
          })
        } else if (error.response.status === 500) {
          modal.error({
            content: `智能客服系統發生異常，請稍後再重新操作`,
          })
        }

        // 2023/10/25 改為各自實作，因有些錯誤 不彈窗 (不適合使用攔截器出錯誤訊息)
        // } else {
        //   modal.error({
        //     content: `${error.response.data.message || error.response.data.error}，請重新操作`,
        //   })
        // }

        return Promise.reject(error)
      },
    )
  }
}
export default new UserService()
