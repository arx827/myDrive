<script setup lang="ts">
import type { SelectValue } from 'ant-design-vue/es/select'
import type { SelectProps } from 'ant-design-vue'
import { defineProps } from 'vue'

interface SelectSearchProp extends SelectProps {}

// $props 給 IDE 提示用
// eslint-disable-next-line no-unused-vars
const $props = defineProps<SelectSearchProp>()

const $emit = defineEmits(['update:value'])

// 模糊查詢，只設定查 label 裡的文字
const filterOption = (input, option) => {
  return option.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
}

const handleChange = (value: SelectValue) => {
  $emit('update:value', value)
}
</script>

<template>
  <a-select show-search :filter-option="filterOption" v-bind="$attrs" @change="handleChange">
    <slot />
  </a-select>
</template>

<style lang="css" scoped></style>
