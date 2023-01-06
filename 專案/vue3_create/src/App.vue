<script setup lang="ts">
import { ref } from 'vue'
import zhTW from 'ant-design-vue/es/locale/zh_TW'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
dayjs.locale('zh-tw')
const locale = ref(zhTW)
</script>

<template>
  <a-config-provider :locale="locale">
    <RouterView />
  </a-config-provider>
</template>

<style lang="scss">
#app {
  min-height: 100%;
}
</style>
