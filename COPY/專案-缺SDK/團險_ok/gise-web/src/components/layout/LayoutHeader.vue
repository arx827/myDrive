<script setup lang="ts">
import logoSvg from '@/assets/imgs/image_logo.svg?component'
import idBlackSvg from '@/assets/imgs/button_ID_black.svg?component'
import { ref, getCurrentInstance, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showAvatar = computed<boolean>(() => {
  return $user.hasValidToken()
})

const showMemberCard = ref(false)

const {
  proxy: { $user, $modal },
} = getCurrentInstance()

const userName = computed<Object>(() => {
  console.log($user.getMe())
  return $user.getMe()?.name || ''
})

// 登出
function logout(): void {
  $modal.confirm({
    title: '您確定要登出嗎？',
    content: '謝謝您的使用，您確定要執行系統登出嗎？',
    okText: '登出',
    cancelText: '先不要',
    okButtonProps: {
      danger: true,
    },
    onOk: async () => {
      await $user.signOut(true)
      router.replace({ path: '/login' })
    },
  })
}

// 回首頁
function routerToHome() {
  router.push({
    path: '/',
  })
}
</script>

<template>
  <header
    class="z-50 flex h-[60px] bg-white pt-[8px] shadow-[0px_3px_6px_#00000029] before:absolute before:top-0 before:h-[8px] before:w-[100%] before:bg-gradient-header lg:h-[80px]"
  >
    <div class="container relative mx-auto flex items-center justify-center lg:justify-between">
      <div class="flex flex-wrap items-end">
        <logoSvg class="scale-[0.82] cursor-pointer lg:scale-100" @click="routerToHome" />
        <div class="text-sm lg:ml-[10px] lg:text-base lg:leading-none">團險自費E填表</div>
      </div>
      <div class="absolute right-[1rem] top-[calc((100%-26px)/2)] lg:relative lg:right-0 lg:top-0" v-if="showAvatar">
        <idBlackSvg @click="showMemberCard = !showMemberCard" class="scale-[0.92] cursor-pointer" />
        <div
          v-show="showMemberCard"
          class="absolute right-0 top-[36px] z-10 flex min-h-[144px] w-[165px] flex-col items-center justify-between rounded-[4px] bg-white shadow-[0px_3px_6px_#00000033] lg:min-h-[148px]"
        >
          <div class="relative mb-[20px] h-[40px] w-[100%] rounded-[4px_4px_0_0] bg-gradient-cardHeader">
            <div
              class="absolute right-[calc((100%-48px)/2)] top-[15px] flex h-[48px] w-[48px] items-center justify-center rounded-[50vh] bg-white"
            >
              <idBlackSvg class="scale-[1.38]" />
            </div>
          </div>
          <h2 class="p-[5px_12px_16px]">{{ userName }}</h2>
          <div
            class="flex w-[100%] cursor-pointer items-center border-t-[1px] border-solid border-t-[#00000017] p-[12px_16px]"
            @click="logout"
          >
            <logout-outlined />
            <p class="ml-[8px]">登出</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
