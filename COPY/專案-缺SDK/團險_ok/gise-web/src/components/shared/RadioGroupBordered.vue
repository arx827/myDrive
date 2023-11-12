<script setup lang="ts">
import type { RadioChangeEvent } from 'ant-design-vue/es/radio/interface'
import type { RadioGroupProps } from 'ant-design-vue'
import { defineProps } from 'vue'

export interface RadioGroupBorderedProp extends RadioGroupProps {}

// $props 給 IDE 提示用
// eslint-disable-next-line no-unused-vars
const $props = defineProps<RadioGroupBorderedProp>()

const $emit = defineEmits(['update:value'])

const handleChange = (event: RadioChangeEvent) => {
  $emit('update:value', event.target.value)
}
</script>

<template>
  <a-radio-group class="radio-bordered flex flex-wrap gap-2" v-bind="$attrs" @change="handleChange" />
</template>

<style lang="css" scoped>
.radio-bordered > :deep(label.ant-radio-wrapper) {
  @apply flex h-[36px] items-center rounded border-[1px] border-neutral-entry bg-white px-4 text-base lg:h-[40px] lg:text-lg;
}
.radio-bordered > :deep(label.ant-radio-wrapper > .ant-radio) {
  @apply top-0;
}
/* .radio-bordered > :deep(label.ant-radio-wrapper > span) {
  @apply text-base lg:text-lg;
} */
</style>
