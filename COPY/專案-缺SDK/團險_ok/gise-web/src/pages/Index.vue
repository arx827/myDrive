<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@stores/index'
import type { WebRestResponse } from '@fubonlife/gise-api-axios-sdk'
import searchSVG from '@/assets/imgs/Icon_search.svg?url'
import applySVG from '@/assets/imgs/Icon_apply.svg?url'
import downloadSVG from '@/assets/imgs/Icon_download.svg?url'
import insuranceSVG from '@/assets/imgs/Icon_insurance.svg?url'

const $router = useRouter()
const loadingStore = useLoadingStore()

const {
  proxy: { $selfPayEFormApi, $user, $modal, $global, $blobUtils },
} = getCurrentInstance()

// 自費案代號
const caseMainId = $user.getMe()?.caseMainId
const version = $user.getMe()?.version

function handleDownloadInsurancePlan() {
  loadingStore.setLoading(true)
  $selfPayEFormApi
    .downloadInsurancePlanUsingPOST({ caseMainId, version }, { responseType: 'blob' })
    .then(async resp => {
      const disposition = resp.headers['content-disposition']
      if (disposition) {
        const filename = $blobUtils.getFileName(resp.headers)
        $blobUtils.download(resp.data as Blob, filename, resp.headers['content-type'])
      } else {
        let errorMsg: WebRestResponse = await $blobUtils.convertErrorBlobToString(resp.data)
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(errorMsg?.apiError),
        })
      }
    })
    .finally(() => loadingStore.setLoading(false))
}

function handleFillOutRecord() {
  $router.push({ path: 'fill-out-record' })
}

function handleDownload() {
  $router.push({ path: 'download-area' })
}

onMounted(() => {
  $global.clearParam()
  $global.handleApplyId('Delete')
})

const { navigateApplyPage } = useApply()

function useApply() {
  // 導至申請頁
  const navigateApplyPage = (): void => {
    // API: 1.2.19 檢核是否已完成自費申請API
    loadingStore.setLoading(true)
    $selfPayEFormApi
      .checkApplyStatusUsingPOST({ caseMainId })
      .then(async resp => {
        const respData = resp?.data
        if (respData.status === 200) {
          if (respData?.data?.applyId) $global.handleApplyId('Set', respData.data.applyId)
          $global.changeRouterAndaddParam({
            toRouter: 'EmployeeData',
            query: { situation: 'applyArea' },
          })
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(respData.apiError),
          })
        }
      })
      .finally(() => loadingStore.setLoading(false))
  }

  return {
    navigateApplyPage,
  }
}
</script>
<template>
  <div class="aspect-[750/400] w-full md:aspect-[1536/600] lg:aspect-[2732/700]">
    <picture>
      <source srcset="@/assets/imgs/image_homebg_web.png" media="(min-width: 992px)" />
      <source srcset="@/assets/imgs/image_homebg_tablet.png" media="(min-width: 768px)" />
      <img src="@/assets/imgs/image_homebg_mobile.png" alt="首頁banner" />
    </picture>
  </div>
  <div class="container mx-auto px-4">
    <div
      class="mx-auto -mt-[52px] mb-8 grid max-w-[346px] grid-cols-2 gap-4 md:max-w-[559px] md:grid-cols-3 md:gap-8 lg:-mt-[60px] lg:max-w-[824px] lg:grid-cols-4"
    >
      <ButtonIconicLarge @click="handleDownloadInsurancePlan">
        <template #icon>
          <img :src="insuranceSVG" alt="保險計劃內容圖示" />
        </template>
        <template #text> 保險計劃內容 </template>
      </ButtonIconicLarge>
      <ButtonIconicLarge @click="handleFillOutRecord">
        <template #icon>
          <img :src="searchSVG" alt="查詢專區圖示" />
        </template>
        <template #text> 查詢專區 </template>
      </ButtonIconicLarge>
      <ButtonIconicLarge @click="navigateApplyPage">
        <template #icon>
          <img :src="applySVG" alt="申請專區圖示" />
        </template>
        <template #text> 申請專區 </template>
      </ButtonIconicLarge>
      <ButtonIconicLarge @click="handleDownload">
        <template #icon>
          <img :src="downloadSVG" alt="下載專區圖示" />
        </template>
        <template #text> 下載專區 </template>
      </ButtonIconicLarge>
    </div>
  </div>
</template>

<style scoped></style>
