<script setup lang="ts">
import { computed } from 'vue'
interface ButtonRectangleProp {
  btnStyle?: 'primary' | 'secondary' | 'danger'
}
const $props = defineProps<ButtonRectangleProp>()

const btnStyle = computed<String>(() => {
  let style
  switch ($props.btnStyle) {
    case 'secondary':
      style = 'bg-[#EDF6FE] min-w-[44px] text-primary hover:bg-primary hover:text-white'
      break
    case 'danger':
      style = 'bg-danger-light min-w-[44px] text-danger hover:bg-danger hover:text-white'
      break
    default:
      style = 'bg-primary text-white hover:bg-[#69B7F5]'
      break
  }
  return style
})
</script>

<template>
  <button
    class="h-[32px] items-center justify-center rounded px-[8px] py-[6px] text-base font-semibold leading-none duration-300 ease-in-out disabled:cursor-not-allowed disabled:bg-[#f5f5f5] disabled:text-[#B7B7B7]"
    :class="btnStyle"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
