<script setup lang="ts">
import { computed } from 'vue'
interface ButtonRoundedPrimaryProp {
  size?: 'full' | 'fixed' | 'custom'
}

const $props = withDefaults(defineProps<ButtonRoundedPrimaryProp>(), {
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
    class="gise-button-rounded-primary h-[40px] max-w-full rounded-full border border-transparent bg-gradient-primary text-lg font-semibold leading-none text-white duration-300 ease-in-out disabled:cursor-not-allowed disabled:border-neutral-entry disabled:bg-[#f5f5f5] disabled:bg-gradient-to-r disabled:text-neutral-entry"
    :class="btnWidth"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.gise-button-rounded-primary {
  background-size: 300% 100%;
}
.gise-button-rounded-primary:hover {
  background-position: 100% 0;
}
</style>
