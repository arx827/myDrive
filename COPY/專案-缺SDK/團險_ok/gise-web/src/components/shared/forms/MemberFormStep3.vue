<script setup lang="ts">
import { ref, watch, onMounted, getCurrentInstance, computed } from 'vue'
import type VOtpInput from 'vue3-otp-input'
import { MemberFormNameType, MemberFormSessionName } from '@components/shared/forms/memberFormType'
import type { EmpVerifyPassCodeModel, EmpResendPassCodeModel } from '@fubonlife/gise-api-axios-sdk'
import { useLoadingStore } from '@/stores'
import { useRouter } from 'vue-router'

interface FormNameProp {
  name: MemberFormNameType
}
interface PrePageQuery {
  accountId: string
  email: string
  passCodeId: string
  newPassword: string
}

const formPass = ref(false)
const countdown = ref(90)
const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null)
const otpInputModal = ref('')
const $props = withDefaults(defineProps<FormNameProp>(), {
  name: MemberFormNameType.SIGNUP,
})
const loadingStore = useLoadingStore()
const {
  proxy: { $global, $modal, $authApi, $utilityApi },
} = getCurrentInstance()
const $router = useRouter()

const { getPageParam, goNextPage } = useRoute()
const { fetchVerifyPassCode, fetchResendPassCode } = useFetchFormApi()
const rePassCodeId = ref<string>(null) // 重新發送驗證碼新產生的PassCodeId
const prePageQuery = ref<PrePageQuery>(null)
const prePageSessionName = computed(() =>
  $props.name === MemberFormNameType.SIGNUP
    ? `${MemberFormNameType.SIGNUP}_${MemberFormSessionName.STEP2}`
    : `${MemberFormNameType.FORGET_PASSWORD}_${MemberFormSessionName.STEP2}`,
)

// 每秒倒數計時器
const runTimer = () => {
  const counting = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(counting)
    }
  }, 1000)
}

// 重新發信
const sendMail = async () => {
  await fetchResendPassCode()
  countdown.value = 90
  runTimer()
}

// 監聽驗證碼input
watch(
  otpInputModal,
  newNum => {
    formPass.value = newNum.length === 6
  },
  {
    deep: true,
  },
)

// 路由相關
function useRoute() {
  // TODO: 取得前一頁資訊
  const getPageParam = async () => {
    prePageQuery.value = JSON.parse(sessionStorage.getItem(prePageSessionName.value))
    // 解密密碼
    loadingStore.setLoading(true)
    await $utilityApi
      .decryptSthUsingPOST(prePageQuery.value.newPassword)
      .then(resp => {
        if (resp.data.status === 200) {
          prePageQuery.value.newPassword = resp.data.data
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(resp?.data?.apiError) || '系統忙線中，請稍後再試',
          })
        }
      })
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      //   // console.log('error status = ', error.status)
      // })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  // 到完成頁
  const goNextPage = () => {
    sessionStorage.setItem(
      `${$props.name === MemberFormNameType.SIGNUP ? MemberFormNameType.SIGNUP : MemberFormNameType.FORGET_PASSWORD}_${
        MemberFormSessionName.STEP3
      }`,
      JSON.stringify({ status: 'success' }),
    )
    $router.push({ name: $props.name === MemberFormNameType.SIGNUP ? 'SignUpComplete' : 'ForgetPasswordStep4' })
  }
  return { goNextPage, getPageParam }
}

// 表單相關API
function useFetchFormApi() {
  // 核對驗證密碼API
  // TODO: 測試
  const fetchVerifyPassCode = () => {
    loadingStore.setLoading(true)
    const requestData: EmpVerifyPassCodeModel = {
      accountId: prePageQuery.value.accountId,
      email: prePageQuery.value.email,
      isUpdatePwd: $props.name === MemberFormNameType.FORGET_PASSWORD,
      newPassword: prePageQuery.value.newPassword,
      passCode: otpInputModal.value,
      passCodeId: rePassCodeId.value || prePageQuery.value.passCodeId,
    }
    $authApi
      .verifyPassCodeUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          goNextPage()
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(Object.values(resp?.data?.apiError).map(e => e.message)).join(''),
          })
        }
      })
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      //   // console.log('error status = ', error.status)
      // })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  // 重新發送驗證碼API
  // TODO: 測試
  const fetchResendPassCode = () => {
    loadingStore.setLoading(true)
    const requestData: EmpResendPassCodeModel = {
      accountId: prePageQuery.value.accountId,
      email: prePageQuery.value.email,
      procedureType: $props.name === MemberFormNameType.SIGNUP ? '0' : '1',
    }
    $authApi
      .resendPassCodeUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          rePassCodeId.value = resp.data.data.passCodeId
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(resp?.data?.apiError),
          })
        }
      })
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      //   // console.log('error status = ', error.status)
      // })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }
  return { fetchVerifyPassCode, fetchResendPassCode }
}

// 送出表單
const onSubmit = () => {
  fetchVerifyPassCode()
}

onMounted(async () => {
  await getPageParam()
  runTimer()
})
</script>

<template>
  <Loading />
  <p class="mb-4 text-center text-2xl font-semibold">請至電子信箱收取驗證碼</p>
  <p class="text-center text-base lg:text-lg">
    {{ $props.name === MemberFormNameType.SIGNUP ? '首次登入' : '重設密碼' }}「驗證碼」已發送至{{
      prePageQuery ? prePageQuery.email : 'test@fubon.com'
    }}，請至電子信箱取得驗證碼，並請於5分鐘內輸入下方空格中，逾時即失效。
  </p>
  <div class="gise-otp my-[32px] text-center">
    <v-otp-input
      ref="otpInput"
      v-model:value="otpInputModal"
      input-classes="otp-input"
      separator=" "
      :num-inputs="6"
      :should-auto-focus="true"
      input-type="letter-numeric"
    />
  </div>
  <ButtonRoundedPrimary class="mb-[32px]" :disabled="!formPass" @click.prevent="onSubmit" size="full"
    >下一步</ButtonRoundedPrimary
  >
  <div class="space-y-[8px] text-center text-base lg:text-lg">
    <div class="text-neutral">還沒收到驗證碼？</div>
    <div>
      <button
        @click="sendMail"
        :disabled="countdown !== 0"
        class="font-semibold text-[#B7B7B7] underline enabled:hover:text-[#B7B7B7] enabled:hover:underline"
      >
        重新發送 (倒數{{ countdown }}秒)
      </button>
    </div>
  </div>
</template>

<style scoped>
:deep(.otp-input) {
  @apply h-[42px] w-[38px] border-b-2 border-b-neutral-entry text-center text-[30px] font-semibold outline-none focus:border-b-primary;
}
:deep(.otp-input.is-complete) {
  @apply border-b-primary;
}

.gise-otp > div {
  @apply items-center justify-center space-x-[16px];
}
</style>
