<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 步驟條 Data
const progressbarArr = ['員工資料', '被保險人', '健康聲明', '繳費方式', '資料確認', '簽名送出']

const nowStep = computed<number>(() => {
  return parseInt(route.path.slice(-1))
})
</script>

<template>
  <div class="pb-[24px]">
    <ProgressbarStep class="p-[16px_0_32px] lg:p-[24px_0_32px]" :stepArr="progressbarArr" :now="nowStep" />
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
