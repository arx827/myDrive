<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router';
// import HelloWorld from '@/components/HelloWorld.vue';
import { ref } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
const locale = ref(zhCN);
</script>

<template>
  <a-config-provider :locale="locale">
    <RouterView />
  </a-config-provider>
</template>

<style lang="scss">
@import "@/assets/base.css";
@import "@style/bootstrap.module.scss";
@import '@style/custom.module.scss';

#app {
  height: 100%;
}
</style>
