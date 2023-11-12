<script setup lang="ts">
  const props = defineProps({
    menuInfo: Object,
    mainMenuClass: String,
    subMenuClass: String,
  })
</script>

<template>
  <a-sub-menu :key="props.menuInfo.key" :class="mainMenuClass || 'mainMenuClass'">
    <template #title>
      <slot :name="'renderer'" :data="props.menuInfo" />
    </template>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key" :class="subMenuClass || 'subMenuClass'">
        <slot :name="'subrenderer'" :data="item" />
      </a-menu-item>
      <FblSubMenu v-else :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
