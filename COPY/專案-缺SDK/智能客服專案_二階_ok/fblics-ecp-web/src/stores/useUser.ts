import { defineStore } from 'pinia'
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
// import { useLoadingStore } from '@/stores'
// import dayjs from 'dayjs'
// const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/api/users`
const LOGIN_STATE = 'login_state'

interface serviceInfo {
  userId: string
}

const loginState = ref(null)
loginState.value = JSON.parse(sessionStorage.getItem(LOGIN_STATE)) || {}

const serviceInfo = ref<serviceInfo>(null)
serviceInfo.value = {
  userId: (JSON.parse(sessionStorage.getItem('serviceInfo'))?.userId as string) || '',
}

export const useUser = defineStore('auth', () => {
  /**
   * getter
   */
  const getMe = computed(() => {
    return loginState.value ? loginState.value.me : null
  })

  const getLoginState = computed(() => {
    return loginState.value
  })

  const getServiceInfo = computed(() => {
    return serviceInfo.value
  })

  /**
   * Event
   */
  const clearLoginState = () => {
    loginState.value = null
    sessionStorage.setItem(LOGIN_STATE, null)
  }

  const updateLoginState = payload => {
    loginState.value = JSON.parse(JSON.stringify(payload))
    sessionStorage.setItem(LOGIN_STATE, JSON.stringify(payload))
  }

  const setServiceInfo = payload => {
    Object.keys(payload).map(i => {
      serviceInfo.value[i] = payload[i]
    })
    sessionStorage.setItem('serviceInfo', JSON.stringify(payload))
  }

  const clearServiceInfo = () => {
    sessionStorage.removeItem('serviceInfo')
  }

  return {
    getMe,
    loginState,
    getLoginState,
    clearLoginState,
    updateLoginState,

    setServiceInfo,
    getServiceInfo,
    clearServiceInfo,
  }
})
