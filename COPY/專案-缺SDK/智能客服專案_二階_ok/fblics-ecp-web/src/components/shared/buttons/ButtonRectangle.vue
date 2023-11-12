<script setup lang="ts">
import { computed } from 'vue'
interface ButtonRectangleProp {
  btnStyle?: 'primary' | 'outline' | 'danger'
  size?: 'small'
  letter?: boolean // 增加字距
  disabled?: boolean
}
const $props = defineProps<ButtonRectangleProp>()

const btnStyle = computed<String>(() => {
  let style
  switch ($props.btnStyle) {
    case 'outline':
      style = 'bg-white border-neutral-entry text-black hover:bg-neutral-light'
      break
    case 'danger':
      style = 'bg-danger border-danger text-white hover:bg-danger-light hover:text-danger'
      break
    default:
      style = 'bg-primary border-primary text-white hover:bg-[#69B7F5]'
      break
  }
  return style
})

const letterStyle = computed<string>(() => {
  return $props.letter ? 'tracking-[5px] indent-[5px] px-[6px]' : 'px-4'
})

const sizeStyle = computed<string>(() => {
  return $props.size === 'small' ? 'px-[10px]' : 'h-[32px] py-[6px]'
})
</script>

<template>
  <button
    class="items-center justify-center break-keep rounded border text-base duration-300 ease-in-out disabled:cursor-not-allowed disabled:border-neutral-entry disabled:bg-[#f5f5f5] disabled:text-[#B7B7B7]"
    :class="[btnStyle, letterStyle, sizeStyle]"
    :disabled="$props.disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
