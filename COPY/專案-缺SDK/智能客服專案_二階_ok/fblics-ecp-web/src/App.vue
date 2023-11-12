<script setup lang="ts">
import { ref, watch, computed, onBeforeMount, getCurrentInstance, onBeforeUnmount } from 'vue'
import zhTW from 'ant-design-vue/es/locale/zh_TW'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import { useLoadingStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useUser } from '@stores/useUser'

const {
  proxy: { $authApi, $user },
} = getCurrentInstance()

dayjs.locale('zh-tw')
const locale = ref(zhTW)
// 解決 下拉選單 跟隨頁面滾動
const getPopupContainer = triggerNode => {
  return triggerNode ? triggerNode.parentNode : document.body
}

const appRef = ref(null)
const $route = useRoute()
const { getLoginState } = storeToRefs(useUser())
const { setServiceInfo, clearServiceInfo } = useUser()
const { setLoading } = useLoadingStore()

// 處理網址 query:id
const getUserId = id => {
  setServiceInfo({ userId: id })
}

// TEST: 測試用menu
const showTestMenu = computed<boolean>(() => {
  return import.meta.env.VITE_SHOW_MENU
})

const tokenLoaded = ref(false)

/**
 * API
 */
// TEST:
const getNowBase64Encode = () => {
  const $nowDataTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
  return btoa($nowDataTime)
}
// TEST: API: 發行訪客專用的Token
const postAPI_getVisitorToken = base64Encode => {
  setLoading(true)
  $authApi
    .getVisitorTokenUsingPOST(base64Encode)
    .then(async res => {
      $user.signIn(res.data.accessToken)
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * Hook
 */
onBeforeMount(() => {
  // TEST:
  postAPI_getVisitorToken(getNowBase64Encode())

  //提供給 Webview Host 呼叫用 (CSWR Client是 host)
  //eslint-disable-next-line
  window.setToken = async (tokenFromCswr, userId) => {
    await setCswrToken(tokenFromCswr, userId)
  }

  const setCswrToken = (token, userId): Promise<String> => {
    $user.signIn(token)
    setServiceInfo({ userId: userId })
    return Promise.resolve('SUCCESS')
  }
})

onBeforeUnmount(() => {
  sessionStorage.clear()
})

/**
 * 監聽
 */
watch(
  () => $route.query,
  () => {
    if ($route.query.userId) {
      getUserId($route.query.userId)
    } else {
      clearServiceInfo()
    }
    //透過URL傳遞的方式取得CSWR Web傳遞的資料
    //k : token, a : userId
    if ($route.query.k && $route.query.a) {
      $user.signIn($route.query.k.toString())
      setServiceInfo({ userId: $route.query.a.toString() })
    } else {
      clearServiceInfo()
    }
  },
  { deep: true },
)
watch(
  () => getLoginState.value,
  newVal => {
    if (newVal) {
      tokenLoaded.value = true
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <a-config-provider :locale="locale" :getPopupContainer="getPopupContainer">
    <div ref="appRef" class="main__content flex flex-col">
      <!-- TEST: -->
      <template v-if="showTestMenu">
        <!-- <div>
          系統管理：
          <RouterLink class="testRouter" :to="{ name: 'Holiday' }">假日查詢</RouterLink>
          <RouterLink class="testRouter" :to="{ name: 'SystemSetting' }">系統設定</RouterLink>
          <RouterLink class="testRouter" :to="{ name: 'WorkingStatus' }">工作狀態新增/修改</RouterLink>
          <RouterLink class="testRouter" :to="{ name: 'ServiceClosed' }">文字客服關閉服務</RouterLink>
          <RouterLink class="testRouter" :to="{ name: 'ServiceHours' }">客服人員服務時段</RouterLink>
          <RouterLink class="testRouter" :to="{ name: 'NonServiceMessage' }">非服務時段宣告文字訊息</RouterLink>
          <RouterLink class="testRouter" :to="{ name: 'MaintenMessage' }">系統維護宣告文字訊息</RouterLink>
        </div> -->
        <!-- <div>
          字卡管理：
          <RouterLink class="testRouter" :to="{ name: 'CardManagementIndex' }">卡片管理</RouterLink>
          <RouterLink class="testRouter" :to="{ name: 'CardTypeManagementIndex' }">卡片類型管理</RouterLink>
        </div> -->
        <!-- <div>
          覆核功能：
          <RouterLink class="testRouter" :to="{ name: 'ReviewIndex' }">覆核功能</RouterLink>
        </div> -->
        <!-- <div>
          即時交談監控： <RouterLink class="testRouter" :to="{ name: 'ChatMonitoringIndex' }">即時交談監控</RouterLink>
        </div> -->

        <div>值機： <RouterLink class="testRouter" :to="{ name: 'OnDuty' }">值機</RouterLink></div>
      </template>
      <RouterView v-if="tokenLoaded" />
      <div class="justify-cente flex min-h-screen items-center justify-center text-neutral" v-else>尚未連線...</div>
    </div>
  </a-config-provider>
</template>

<style lang="postcss">
#app {
  min-height: 100vh;
}

/* TEST: */
.testRouter {
  + .testRouter {
    &::before {
      content: '|';
      display: inline-block;
      margin: 0 5px;
    }
  }
}

.previewBox {
  & a {
    @apply text-primary underline decoration-primary;
  }
}
</style>
