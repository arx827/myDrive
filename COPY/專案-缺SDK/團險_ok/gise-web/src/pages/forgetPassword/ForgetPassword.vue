<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 步驟條
const progressbarArr = ['資格驗證', '資料填寫', '電子信箱驗證', '完成申請']

const nowStep = computed<number>(() => {
  return parseInt(route.path.slice(-1))
})
</script>

<template>
  <LayoutHeader :is-login="true" />
  <div
    class="flex flex-1 bg-none bg-cover bg-fixed bg-center bg-no-repeat md:bg-[url('@/assets/imgs/image_loginbg.jpg')] lg:items-center"
  >
    <div class="container grid justify-items-center p-0 lg:justify-items-end lg:px-[15px]">
      <div class="w-full md:my-[40px] md:w-[540px] lg:w-[612px]">
        <CardShadowRound title="忘記/重設密碼">
          <ProgressbarStep class="pb-[12px] pt-4" :stepArr="progressbarArr" :now="nowStep" />
          <router-view></router-view>
        </CardShadowRound>
      </div>
    </div>
  </div>
  <LayoutFooter />
</template>

<style scoped></style>
