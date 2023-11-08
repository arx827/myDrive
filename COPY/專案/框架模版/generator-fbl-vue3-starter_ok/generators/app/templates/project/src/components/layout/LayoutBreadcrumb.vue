<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mainTitle = computed<String>(() => {
  return router.currentRoute.value.meta.breadcrumb?.mainTitle
})
const subTitle = computed<String[]>(() => {
  return router.currentRoute.value.meta.breadcrumb?.subTitle
})
</script>

<template>
  <div class="breadcrumb" v-if="mainTitle || mainTitle">
    <div class="breadcrumb__icon"></div>
    <div class="d-flex align-items-end">
      <h4 class="current__title">{{ mainTitle }}</h4>
      <span class="subTitle" v-for="(item, index) in subTitle" :key="index">{{ item }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.breadcrumb {
  display: flex;
  padding: 7.5px 15px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.12);
}
.breadcrumb__icon {
  width: 5px;
  align-items: stretch;
  background: $COLOR-MAIN2;
}
.current__title {
  margin-left: 12px;
  margin-bottom: 0;
  font-size: 25px;
}
.subTitle {
  color: $COLOR-GRAY4;
  &::before {
    content: '/';
    margin: 0 8px;
    color: $COLOR-GRAY1;
    font-size: 10px;
  }
}
</style>
