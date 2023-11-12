<script setup lang="ts">
interface CardShadowRoundProp {
  title?: string
}
const $props = defineProps<CardShadowRoundProp>()
</script>
<template>
  <div class="bg-white px-[15px] py-4 md:rounded-[10px] md:px-[65px] md:py-8 md:shadow-[0_3px_6px_rgba(0,0,0,0.3)]">
    <div class="mb-1 border-b-[3px] border-info pb-1">
      <div class="text-3xl font-semibold text-info">{{ $props.title }}</div>
    </div>
    <slot />
  </div>
</template>

<style scoped></style>
