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
  <a-sub-menu :key="$props.menuInfo.key">
    <!-- 有 Child 的 menu 樣式 -->
    <template #icon><FolderOpenOutlined /></template>
    <template #title>{{ $props.menuInfo.title }}</template>
    <template v-for="item in $props.menuInfo.children" :key="item.key">
      <template v-if="!item.children">
        <MenuItem :menuInfo="item" />
      </template>
      <template v-else>
        <FblSubMenu :menu-info="item" :key="item.key" />
      </template>
    </template>
  </a-sub-menu>
</template>

<style scoped></style>
