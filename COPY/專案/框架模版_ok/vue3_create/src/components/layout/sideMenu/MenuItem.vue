<script setup lang="ts">
interface menuInfo {
  menuId?: string
  title?: string
  caseCount?: number
  route?: string
  key?: string
  level?: number
  children?: menuInfo[]
}

const $props = withDefaults(
  defineProps<{
    menuInfo: menuInfo
  }>(),
  {
    menuInfo: () => ({}),
  },
)
</script>
<template>
  <a-menu-item :key="$props.menuInfo.key">
    <template #icon><FileOutlined /></template>
    {{ $props.menuInfo.title }}
  </a-menu-item>
</template>

<style scoped></style>
