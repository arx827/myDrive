<script setup lang="ts">
import { ref } from 'vue'
import zhTW from 'ant-design-vue/es/locale/zh_TW'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
dayjs.locale('zh-tw')
const locale = ref(zhTW)
// 解決 下拉選單 跟隨頁面滾動
const getPopupContainer = triggerNode => {
  return triggerNode ? triggerNode.parentNode : document.body
}
</script>

<template>
  <a-config-provider :locale="locale" :getPopupContainer="getPopupContainer">
    <RouterView />
  </a-config-provider>
</template>

<style lang="scss">
#app {
  min-height: 100%;
}
</style>
