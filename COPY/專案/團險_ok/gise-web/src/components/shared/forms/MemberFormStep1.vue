<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { Form } from 'ant-design-vue'
import type { Rule, RuleObject } from 'ant-design-vue/es/form'
import { MemberFormNameType, MemberFormSessionName } from '@components/shared/forms/memberFormType'
import { useLoadingStore } from '@/stores'
import { ErrorType } from '@plugins/global/index'
import { useRouter } from 'vue-router'

interface FormNameProp {
  name: MemberFormNameType
}

interface FormType {
  companyNo: string
}

interface ErrorInfoType {
  companyNo: string
}

const $props = withDefaults(defineProps<FormNameProp>(), {
  name: MemberFormNameType.SIGNUP,
})
const {
  proxy: { $global, $authApi, $modal },
} = getCurrentInstance()
const loadingStore = useLoadingStore()
const modelRef = ref<FormType>({
  companyNo: '',
})
const errorInfos = ref<ErrorInfoType>({
  companyNo: null,
})
const $router = useRouter()

const validateCompanyNo = async (_rule: Rule, value: string) => {
  if (!value) {
    resetErrors()
    return Promise.reject('請輸入公司統一編號')
  }
  if (value.length < 8) {
    resetErrors()
    return Promise.reject('請輸入完整之統一編號')
  }
  if (errorInfos.value && errorInfos.value.companyNo) return Promise.reject(errorInfos.value.companyNo)

  return Promise.resolve()
}

const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  companyNo: [{ required: true, validator: validateCompanyNo, trigger: 'change' }],
})

const { validate, validateInfos } = Form.useForm(modelRef, formRules)
const { fetchCheckCompanyNoApi } = useFetchFormApi()
const { goNextPage, pageSessionName } = useRoute()
const { resetErrors } = useHandleForm()

// 路由相關
function useRoute() {
  // 到步驟二
  const goNextPage = () => {
    sessionStorage.setItem(
      `${$props.name === MemberFormNameType.SIGNUP ? MemberFormNameType.SIGNUP : MemberFormNameType.FORGET_PASSWORD}_${
        MemberFormSessionName.STEP1
      }`,
      JSON.stringify({ companyNo: modelRef.value.companyNo }),
    )
    $router.push({
      name: $props.name === MemberFormNameType.SIGNUP ? 'FillOutForm' : 'ForgetPasswordStep2',
    })
  }

  const pageSessionName = computed(() =>
    $props.name === MemberFormNameType.SIGNUP
      ? `${MemberFormNameType.SIGNUP}_${MemberFormSessionName.STEP1}`
      : `${MemberFormNameType.FORGET_PASSWORD}_${MemberFormSessionName.STEP1}`,
  )
  return { goNextPage, pageSessionName }
}

// 表單相關API
function useFetchFormApi() {
  // API: [忘記密碼/註冊] 檢核公司統編
  // TODO: 註冊頁待測試
  const fetchCheckCompanyNoApi = () => {
    loadingStore.setLoading(true)
    const requestData = {
      companyNo: modelRef.value.companyNo,
      isRegister: $props.name === MemberFormNameType.SIGNUP ? true : false,
    }
    $authApi
      .checkCompanyNoUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          goNextPage()
        } else {
          const errorType = $global.getApiErrorType(resp?.data?.errors)
          const getError = JSON.parse(JSON.stringify(resp?.data?.apiError))
          if (errorType === ErrorType.ColumnErrorException) {
            getError.map(i => {
              errorInfos.value[i.column] = i.message || '欄位有誤'
              validate(i.column)
            })
            // 捲到錯誤欄
            setTimeout(() => {
              document.querySelector('.ant-form-item-has-error')?.scrollIntoView()
            }, 100)
          } else {
            $modal.error({
              title: '錯誤',
              content: $global.getApiErrorMsg(resp?.data?.apiError) || '欄位有誤',
            })
          }
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

  return {
    fetchCheckCompanyNoApi,
  }
}

function useHandleForm() {
  // 清空錯誤資訊
  const resetErrors = () => {
    errorInfos.value = {
      companyNo: null,
    }
  }
  return { resetErrors }
}

// 送出表單
const onSubmit = () => {
  resetErrors()
  validate()
    .then(() => {
      fetchCheckCompanyNoApi()
    })
    .catch(err => {
      console.log('error', err)
    })
}

onMounted(async () => {
  // 獲取暫存的form資料
  if (sessionStorage.getItem(pageSessionName.value)) {
    modelRef.value.companyNo = JSON.parse(sessionStorage.getItem(pageSessionName.value))?.companyNo
  }
})
</script>

<template>
  <Loading />
  <FormTitle class="mt-0" title="填寫統一編號" />
  <a-form layout="vertical">
    <a-form-item v-bind="validateInfos.companyNo" label="公司統一編號" required>
      <a-input
        v-model:value.trim="modelRef.companyNo"
        :maxLength="8"
        oninput="this.value = this.value.replace(/[^0-9.]/g, '')"
        placeholder="e.g. 12345678"
      />
    </a-form-item>
    <ButtonRoundedPrimary class="mt-4" @click.prevent="onSubmit" size="full">下一步</ButtonRoundedPrimary>
  </a-form>
</template>

<style scoped></style>
