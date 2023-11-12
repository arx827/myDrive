<script setup lang="ts">
import { useRouter } from 'vue-router'
const $router = useRouter()
const handleReturn = () => $router.go(-1)
</script>

<template>
  <div class="container mt-[120px] flex flex-col items-center justify-center">
    <img class="h-[165px] w-[165px]" src="@/assets/imgs/404.png" alt="server error 圖片" />
    <div class="mt-4 text-center text-[#788088]">
      <div class="mt-4 text-[54px] leading-[54px]">404</div>
      <div class="py-2">Page not found</div>
      <div>頁面不存在，查詢的網頁可能已經移除了</div>
    </div>
    <ButtonRoundedPrimary class="mt-[40px]" @click="handleReturn">返回</ButtonRoundedPrimary>
  </div>
</template>

<style scoped></style>
