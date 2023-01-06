<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
const $router = useRouter()

const $props = defineProps({
  menuInfo: Object,
  mainMenuClass: String,
  subMenuClass: String,
})
const currentPage = route => {
  if (route) {
    const routeInMenuArr = $router.currentRoute.value.path.split('/')
    const currRouteArr = route.split('/')
    const lastRoute = currRouteArr.slice(-1)[0]
    return routeInMenuArr.includes(lastRoute)
  }
}
</script>

<template>
  <a-sub-menu :key="$props.menuInfo.key" :class="$props.mainMenuClass || 'mainMenuClass'">
    <template #title>
      <slot :name="'renderer'" :data="$props.menuInfo"></slot>
    </template>
    <template v-for="item in menuInfo.children">
      <a-menu-item
        v-if="!item.children"
        :key="item.key"
        :class="[$props.subMenuClass || 'subMenuClass', { 'ant-menu-item-selected': currentPage(item.route) }]"
      >
        <slot :name="'subrenderer'" :data="item"></slot>
      </a-menu-item>
      <FblSubMenu v-else :menu-info="item" :key="item.menuId" />
    </template>
  </a-sub-menu>
</template>
