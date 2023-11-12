<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue'
import { useLoadingStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import router from '@/router'
import type { EmpVerifyMidResultDto } from '@fubonlife/gise-api-axios-sdk'
import { MemberFormNameType, MemberFormSessionName } from '@components/shared/forms/memberFormType'

const {
  proxy: { $authApi, $modal, $global },
} = getCurrentInstance()
const loadingStore = useLoadingStore()
const $route = useRoute()
const $router = useRouter()
const goNextPage = (responseData: EmpVerifyMidResultDto) => {
  sessionStorage.setItem(
    `${MemberFormNameType.SIGNUP}_${MemberFormSessionName.STEP2}`,
    JSON.stringify({
      email: responseData.email,
      accountId: responseData.accountId,
      newPassword: responseData.password,
      passCodeId: responseData.passCodeId,
    }),
  )
  router.push({ name: 'VerifyEmail' })
}

// 核對MID認證結果API
const fetchVerifyhMidResult = () => {
  loadingStore.setLoading(true)
  $authApi
    .verifyMidResultUsingPOST({ ...$route.query })
    .then(resp => {
      if (resp.data.status === 200) {
        if (resp.data.data.result === '1') {
          goNextPage(resp.data.data)
        } else {
          $modal.error({
            title: 'MID認證失敗',
            content: $route?.query.returnCodeDesc,
          })
          $router.replace({ name: 'VerifyQualification' })
        }
      } else {
        $modal.error({
          title: '錯誤 ',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
    // .catch(() => {
    //   $modal.error({
    //     title: '錯誤',
    //     content: '系統有誤，請洽系統管理者',
    //   })
    //   // console.log('error status = ', error)
    // })
    .finally(() => {
      loadingStore.setLoading(false)
    })
}

onMounted(() => {
  fetchVerifyhMidResult()
})
</script>

<template>
  <div>
    <Loading />
    <router-view />
  </div>
</template>

<style scoped></style>
