<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUtils } from '@composables/useUtils'
const $route = useRoute()
const { bgClass } = useUtils()
</script>
<template>
  <div class="flex-auto bg-right-bottom bg-no-repeat px-[32px] pt-[10px]" :class="bgClass($route.meta.bg)">
    <RouterView />
  </div>
</template>

<style scoped></style>
