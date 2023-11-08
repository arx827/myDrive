<script setup lang="ts">
import { defineProps, computed } from 'vue'

interface IBadgeDotProp {
  type: string
  text: string
}

const $props = withDefaults(defineProps<IBadgeDotProp>(), {
  type: 'neutral',
})

const $twClass = computed<string>(() => {
  return `bg-${$props.type}`
})
</script>

<template>
  <div class="flex items-center">
    <div class="mr-[5px] h-3 w-3 rounded-full" :class="$twClass" />
    <div>{{ $props.text }}</div>
  </div>
</template>

<style lang="css" scoped></style>
