<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const $route = useRoute()

const isIndex = computed<boolean>(() => {
  return $route.path === '/' || $route.path === '/index'
})

const pageTitle = computed<string>(() => {
  return $route.meta.mainTitle
})
</script>
<template>
  <div class="flex flex-1 flex-col">
    <LayoutHeader class="w-full" />
    <Loading />
    <LayoutContent class="flex-1">
      <template #layoutContentSlot>
        <!-- 首頁不顯示頁面標題 -->
        <div v-if="!isIndex" class="container">
          <h1 class="text-3xl font-semibold">{{ pageTitle }}</h1>
          <router-view />
        </div>
      </template>
    </LayoutContent>
    <LayoutFooter />
  </div>
</template>
<style scoped></style>
