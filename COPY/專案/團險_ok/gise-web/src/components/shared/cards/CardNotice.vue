<script setup lang="ts">
interface CardNoticeProp {
  title?: string
}

const $props = withDefaults(defineProps<CardNoticeProp>(), {
  title: '注意事項',
})
</script>

<template>
  <div class="notice rounded border-0 bg-secondary p-[8px_16px_16px] leading-normal text-white">
    <p class="pb-2 text-center text-lg font-bold lg:text-2xl">{{ $props.title }}</p>
    <slot name="description">沒有任何資訊</slot>
  </div>
</template>

<style scoped>
/* 設定 description 有 連結文字時的樣式 */
.notice a {
  @apply underline underline-offset-4;
}
</style>
