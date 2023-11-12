<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@stores/index'
import { useDownloadFile } from '@/composables/useDownloadFile'
import success5sJSON from '@assets/success5s.json'
import downloadSVG from '@/assets/imgs/Icon_download.svg?url'
import sendSVG from '@/assets/imgs/Icon_send.svg?url'
import type {
  CaseMainIdAndSituationDto,
  CaseMainAndApplyInfoDto,
  ApplyIdAndFileIdDto,
} from '@fubonlife/gise-api-axios-sdk'

const {
  proxy: { $selfPayEFormApi, $modal, $global, $user },
} = getCurrentInstance()
const $router = useRouter()
const loadingStore = useLoadingStore()

// composables
const { downloadFile } = useDownloadFile()

// 檔案代號
let fileId: string = ''

// 申請編號
const applyId = $global.handleApplyId('Get')

const email = ref<string>('')

// 注意事項
const cautionContext = ref<string>('')

// API: 1.2.58 查詢註冊信箱
const fetchRegisterEmail = (): Promise<void> => {
  return $selfPayEFormApi.getRegisterEmailUsingPOST({ applyId }).then(resp => {
    if (resp.data.status === 200) {
      email.value = resp.data.data?.email
    } else {
      $modal.error({
        title: '錯誤',
        content: $global.getApiErrorMsg(resp?.data?.apiError),
      })
    }
  })
}

// API: 1.2.52.	建置自費表單文件API
const generateApplicationDocument = (): Promise<void> => {
  const caseMainAndApplyInfo: CaseMainAndApplyInfoDto = {
    applyId,
    caseMainId: $user.getMe()?.caseMainId,
    companyNo: $user.getMe()?.companyNo,
    crtNo: $user.getMe()?.crtNo,
    policyNo: $user.getMe()?.policyNo,
    policySeq: $user.getMe()?.policySeq,
    times: $user.getMe()?.times,
    idNo: $user.getMe()?.idNo,
  }
  return $selfPayEFormApi.generateApplicationDocumentUsingPOST(caseMainAndApplyInfo).then(resp => {
    if (resp.data.status === 200) {
      fileId = resp.data.data?.fileId
    } else {
      $modal.error({
        title: '錯誤',
        content: $global.getApiErrorMsg(resp?.data?.apiError),
      })
    }
  })
}

// API: 1.2.53.	寄送E填表API
const sendEmail = () => {
  loadingStore.setLoading(true)
  const applyIdAndFileId: ApplyIdAndFileIdDto = {
    applyId,
    fileId,
  }
  $selfPayEFormApi
    .mailApplicationUsingPOST(applyIdAndFileId)
    .then(resp => {
      if (resp.data.status === 200) {
        console.log('resp', resp)
        if (resp.data.data.success) {
          $modal.success({
            title: '寄送成功',
          })
        } else {
          $modal.error({
            title: '寄送失敗',
          })
        }
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
    // .catch(() =>
    //   $modal.error({
    //     title: '錯誤',
    //     content: '系統有誤，請洽系統管理者',
    //   }),
    // )
    .finally(() => loadingStore.setLoading(false))
}

// API: 1.2.54.	E填表取得注意事項API
const fetchCaution = (): Promise<void> => {
  const caseMainIdAndSituation: CaseMainIdAndSituationDto = {
    caseMainId: $user.getMe()?.caseMainId,
    situation: 'S',
  }
  return $selfPayEFormApi.getCautionUsingPOST(caseMainIdAndSituation).then(resp => {
    if (resp.data.status === 200) {
      cautionContext.value = resp.data.data
    } else {
      $modal.error({
        title: '錯誤',
        content: $global.getApiErrorMsg(resp?.data?.apiError),
      })
    }
  })
}

onMounted(async () => {
  loadingStore.setLoading(true)
  await Promise.all([fetchRegisterEmail(), generateApplicationDocument(), fetchCaution()])
    .then(promiseResp => {
      console.log('promiseResp', promiseResp)
    })
    // .catch(() =>
    //   $modal.error({
    //     title: '錯誤',
    //     content: '系統有誤，請洽系統管理者',
    //   }),
    // )
    .finally(() => loadingStore.setLoading(false))
})

const handleDownload = () => {
  loadingStore.setLoading(true)
  downloadFile({ fileId, source: 'emp' })
  loadingStore.setLoading(false)
}

// 回首頁
const handleGoToIndex = () => {
  $router.push({ path: '/index' })
}
</script>

<template>
  <Vue3Lottie class="mb-[16px]" :animationData="success5sJSON" :height="170" :width="190" />
  <div class="pb-2 text-center text-xl font-semibold text-[#1489D1] lg:text-2xl">送出成功，請列印簽名並將正本寄出</div>
  <div class="text-center text-xl font-semibold lg:text-2xl">
    『團險自費表單文件』請選擇<span class="underline">下載</span>或<span class="underline">寄送至{{ email }}</span>
  </div>
  <div class="flex justify-center gap-4 py-4 md:gap-8">
    <ButtonIconicLarge @click="handleDownload">
      <template #icon>
        <img :src="downloadSVG" alt="下載表單文件圖片" />
      </template>
      <template #text>
        <div class="text-lg lg:text-xl">下載表單文件</div>
      </template>
    </ButtonIconicLarge>
    <ButtonIconicLarge @click="sendEmail">
      <template #icon>
        <img :src="sendSVG" alt="寄送至Email圖片" />
      </template>
      <template #text>
        <div class="text-lg lg:text-xl">寄送至Email</div>
      </template>
    </ButtonIconicLarge>
  </div>
  <CardNotice class="mx-auto max-w-[824px]">
    <template #description>
      <div v-html="cautionContext"></div>
    </template>
  </CardNotice>
  <div class="mt-4 text-center lg:mt-8">
    <ButtonRoundedPrimary class="w-full md:w-[356px]" size="custom" @click="handleGoToIndex"
      >回首頁</ButtonRoundedPrimary
    >
  </div>
</template>

<style scoped></style>
