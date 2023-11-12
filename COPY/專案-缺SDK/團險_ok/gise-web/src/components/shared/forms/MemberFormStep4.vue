<script setup lang="ts">
import { onMounted } from 'vue'
import success5sJSON from '@assets/success5s.json'
import { MemberFormNameType } from '@components/shared/forms/memberFormType'

interface FormNameProp {
  name: MemberFormNameType
}

const $props = withDefaults(defineProps<FormNameProp>(), {
  name: MemberFormNameType.SIGNUP,
})

onMounted(() => {
  // 標記流程成功session
  sessionStorage.setItem('complete', 'success')
})
</script>

<template>
  <Loading />
  <div class="mb-[32px] text-center">
    <Vue3Lottie class="mb-[16px]" :animationData="success5sJSON" :height="170" :width="190" />
    <p class="mb-[8px] text-xl font-semibold text-[#1589D1] lg:text-2xl">
      {{ $props.name === MemberFormNameType.SIGNUP ? '會員註冊成功' : '密碼設定成功' }}
    </p>
    <p class="text-base lg:text-lg">
      {{ $props.name === MemberFormNameType.SIGNUP ? '您的申請與密碼皆已設定完成!' : '您的密碼已設定完成!' }}
    </p>
    <p class="text-base lg:text-lg">請立即以新密碼登入系統。</p>
  </div>
  <router-link to="/login">
    <ButtonRoundedPrimary size="full">返回至登入頁 </ButtonRoundedPrimary>
  </router-link>
</template>

<style scoped></style>
