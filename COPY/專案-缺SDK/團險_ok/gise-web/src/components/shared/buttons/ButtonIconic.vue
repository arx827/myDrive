<script setup lang="ts">
import { computed, useAttrs } from 'vue'
interface ButtonIconicProp {
  btnStyle?: 'primary' | 'danger'
  tooltip?: string
  hoverWhite: boolean // hover後icon是否變白色
}

const $attrs = useAttrs()

const $props = withDefaults(defineProps<ButtonIconicProp>(), {
  hoverWhite: true,
})

const btnHoverStyle = computed<String>(() => {
  return $props.hoverWhite ? ' gise-button-iconic-hover-white' : ''
})

const btnStyle = computed<String>(() => {
  let style
  switch ($props.btnStyle) {
    case 'danger':
      style = 'bg-danger-light text-danger enabled:hover:bg-danger enabled:hover:text-white'
      break
    default:
      style = 'bg-[#EDF6FE] text-primary enabled:hover:bg-primary enabled:hover:text-white'
      break
  }
  return style
})
</script>

<template>
  <a-tooltip placement="top">
    <template #title>
      <span class="text-sm">{{ $props.tooltip }}</span>
    </template>
    <button
      class="flex h-[32px] w-[32px] items-center justify-center rounded p-0 text-base font-semibold leading-[0px] duration-300 ease-in-out disabled:cursor-not-allowed disabled:grayscale"
      :class="btnStyle + btnHoverStyle"
      :disabled="$attrs.disabled"
    >
      <div>
        <slot></slot>
      </div>
    </button>
  </a-tooltip>
</template>

<style scoped>
.gise-button-iconic-hover-white:enabled:hover > div {
  @apply brightness-0 invert;
}
</style>
