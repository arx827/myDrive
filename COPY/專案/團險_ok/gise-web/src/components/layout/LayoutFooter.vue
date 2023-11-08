<script setup lang="ts">
import { onMounted, getCurrentInstance } from 'vue'
import { useLoadingStore } from '@/stores'
import { useSystemLink } from '../../composables/useSystemLink'

const loadingStore = useLoadingStore()
const { links, fetchSystemLinks } = useSystemLink()
const {
  proxy: { $modal },
} = getCurrentInstance()

onMounted(() => {
  loadingStore.setLoading(true)
  Promise.all([
    fetchSystemLinks('LINK_FAIR_DEALING'), //公平待客原則
    fetchSystemLinks('LINK_IBGOV'), //主管機關相關連結
    fetchSystemLinks('LINK_EC_SELF_REGULATION'), //法令公告
    fetchSystemLinks('LINK_PRIVACY'), //隱私權聲明
  ])
    // .catch(() => {
    //   $modal.error({
    //     title: '錯誤',
    //     content: '系統有誤，請洽系統管理者',
    //   })
    // })
    .finally(() => loadingStore.setLoading(false))
})
</script>

<template>
  <footer class="flex min-h-[76px] items-center justify-center bg-[#F7F7F7]">
    <div class="container-xl text-sm text-[#6A6A6A] lg:text-base">
      <ul class="flex flex-wrap justify-center">
        <li class="before:p-[0_5px] before:content-['|']">
          <a target="_blank" :href="links.LINK_FAIR_DEALING">公平待客原則</a>
        </li>
        <li class="before:p-[0_5px] before:content-['|']">
          <a target="_blank" :href="links.LINK_PRIVACY">隱私權聲明</a>
        </li>
        <li class="before:p-[0_5px] before:content-['|']">
          <a target="_blank" :href="links.LINK_IBGOV">主管機關相關連結</a>
        </li>
        <li class="before:p-[0_5px] before:content-['|'] after:p-[0_5px] after:content-['|']">
          <a :href="links.LINK_EC_SELF_REGULATION">法令公告</a>
        </li>
      </ul>
      <div class="flex justify-center text-center text-sm">
        建議瀏覽器版本：最新版本chrome、Safari、Edge © Fubon Life Insurance Co.Ltd. All Rights Reserved
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
