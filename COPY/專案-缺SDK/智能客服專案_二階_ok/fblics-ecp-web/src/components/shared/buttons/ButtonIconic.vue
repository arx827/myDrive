<script setup lang="ts">
import { computed, useAttrs } from 'vue'
interface ButtonIconicProp {
  btnStyle?: 'primary' | 'danger' | 'gradient' | 'white'
  type?: 'card' | 'roundFull'
  tooltip?: string
  hoverWhite?: boolean // hover後icon是否變白色
}

const $attrs = useAttrs()

const $props = withDefaults(defineProps<ButtonIconicProp>(), {
  hoverWhite: false,
})

const btnHoverStyle = computed<String>(() => {
  return $props.hoverWhite ? ' gise-button-iconic-hover-white' : ''
})

const btnStyle = computed<String>(() => {
  let style
  switch ($props.btnStyle) {
    case 'danger':
      style = 'bg-danger-light text-danger enabled:hover:bg-danger'
      break
    case 'gradient':
      style = 'bg-gradient text-danger enabled:hover:bg-gradient'
      break
    case 'white':
      style = 'bg-white text-primary enabled:hover:bg-neutral-light'
      break
    default:
      style = 'text-primary'
      break
  }
  return style
})

const typeStyle = computed<String>(() => {
  let style
  switch ($props.type) {
    case 'card':
      style = ''
      break
    case 'roundFull':
      style = 'rounded-full'
      break
    default:
      style = ''
      break
  }
  return style
})
</script>

<template>
  <a-tooltip placement="top" v-if="$props.tooltip">
    <template #title>
      <span class="text-sm">{{ $props.tooltip }}</span>
    </template>
    <button
      class="flex h-[32px] w-[32px] items-center justify-center rounded p-0 text-base font-semibold leading-[0px] duration-300 ease-in-out disabled:cursor-not-allowed disabled:grayscale"
      :class="[btnStyle, btnHoverStyle, typeStyle]"
      :disabled="$attrs.disabled as boolean"
    >
      <div>
        <slot></slot>
      </div>
    </button>
  </a-tooltip>
  <template v-else-if="$props.type === 'card'">
    <button
      class="flex h-[32px] w-[32px] items-center justify-center rounded p-0 text-base font-semibold leading-[0px] shadow-md duration-300 ease-in-out disabled:cursor-not-allowed disabled:grayscale"
      :class="[btnStyle, btnHoverStyle, typeStyle]"
      :disabled="$attrs.disabled as boolean"
    >
      <div>
        <slot></slot>
      </div>
    </button>
  </template>
  <template v-else>
    <button
      class="flex h-[32px] w-[32px] items-center justify-center rounded p-0 text-base font-semibold leading-[0px] duration-300 ease-in-out disabled:cursor-not-allowed disabled:grayscale"
      :class="[btnStyle, btnHoverStyle, typeStyle]"
      :disabled="$attrs.disabled as boolean"
    >
      <div>
        <slot></slot>
      </div>
    </button>
  </template>
</template>

<style scoped lang="postcss">
.gise-button-iconic-hover-white:enabled:hover > div {
  @apply brightness-0 invert;
}
</style>
