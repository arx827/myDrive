<script setup lang="ts">
import { computed } from 'vue'
interface ButtonRoundedSecondaryProp {
  size?: 'full' | 'fixed' | 'custom'
}

const $props = withDefaults(defineProps<ButtonRoundedSecondaryProp>(), {
  size: 'fixed',
})
const btnWidth = computed<string>(() => {
  let style: string
  switch ($props.size) {
    case 'full':
      style = 'w-full'
      break

    case 'custom':
      style = ''
      break

    default:
      style = 'w-full md:w-[170px] lg:w-[182px]'
      break
  }
  return style
})
</script>

<template>
  <button
    class="h-[40px] max-w-full rounded-full border border-primary bg-white text-lg font-semibold leading-none text-primary duration-300 ease-in-out hover:bg-[#EDF6FE] disabled:cursor-not-allowed disabled:border-neutral-entry disabled:bg-[#f5f5f5] disabled:bg-gradient-to-r disabled:text-neutral-entry"
    :class="btnWidth"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
