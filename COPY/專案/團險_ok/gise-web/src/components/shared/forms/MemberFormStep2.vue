<script setup lang="ts">
import { ref, watchEffect, watch, getCurrentInstance, onMounted, computed } from 'vue'
import { Form } from 'ant-design-vue'
import moment from 'moment'
import type { Rule, RuleObject } from 'ant-design-vue/es/form'
import type { CardCollapsed } from '@components/shared/cards/CardCollapse.vue'
import type {
  EmpRegisterModel,
  EmpRegisterMidModel,
  EmpMobileProviderDto,
  ETermGroupDto,
  EmpRegisterMidDto,
  EmpCheckMidResultModel,
} from '@fubonlife/gise-api-axios-sdk'
import {
  MemberFormNameType,
  MemberFormSessionName,
  type PasswordValidateType,
  type IdentityOptionType,
  type FormStep2Type,
} from '@components/shared/forms/memberFormType'
import { useLoadingStore } from '@/stores'
import { ErrorType } from '@plugins/global/index'
import { useRouter } from 'vue-router'

interface FormNameProp {
  name: MemberFormNameType
}

interface ErrorInfoType {
  idNo: string
  password?: string
  newPassword?: string
  email: string
  birthday?: string
  identity?: string
  carrier?: string
  mobileNo?: string
}
interface PrePageQuery {
  companyNo: string
}
interface NextPageQueryType {
  accountId: string
  passCodeId: string
}
interface MidPostDataType {
  BusinessNo: string
  ApiVersion: string
  HashKeyNo: string
  VerifyNo: string
  Token: string
  IdentifyNo: string
  Birthday: string
  ReturnIdentifyNo: string
  CancelMsg: string
}

const {
  proxy: { $global, $modal, $authApi, $utilityApi, $selfPayEFormApi },
} = getCurrentInstance()

const loadingStore = useLoadingStore()

const $props = withDefaults(defineProps<FormNameProp>(), {
  name: MemberFormNameType.SIGNUP,
})

const carrierOptions = ref<EmpMobileProviderDto[]>([])

const midPostData = ref<MidPostDataType>({
  BusinessNo: '',
  ApiVersion: '',
  HashKeyNo: '',
  VerifyNo: '',
  Token: '',
  IdentifyNo: '',
  Birthday: '',
  ReturnIdentifyNo: '',
  CancelMsg: '',
}) // MID隱藏資料

const twidSignForm = ref<HTMLFormElement>(null) // MID隱藏表單名稱
const $router = useRouter()

const passwordValidates = ref<PasswordValidateType[]>([
  { name: '密碼長度須為8~12字元', isValid: false, regex: /^.{8,12}$/ },
  {
    name: '須包含大小寫字母及數字，請勿使用空白鍵及各種特殊符號',
    isValid: false,
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(^[A-Za-z0-9]+$)*$/,
  },
  { name: '不得為3碼(含)以上相同或連續的英文字母或數字', isValid: false, regex: 'custom' },
])

const modelRef = ref<FormStep2Type>({
  idNo: '',
  email: '',
  password: '',
  birthday: '',
  identity: '',
  carrier: '',
  mobileNo: '',
  newPassword: '',
})

const errorInfos = ref<ErrorInfoType>({
  idNo: null,
  password: null,
  email: null,
  birthday: null,
  identity: null,
  carrier: null,
  mobileNo: null,
  newPassword: null,
})

const prePageQuery = ref<PrePageQuery>(null)

const lockIdentity = ref<boolean>(false)

const allPass = ref<boolean>(false) // 是否通過全部規範

const identityOptions: IdentityOptionType[] = [
  { name: '員工電子信箱', children: ['以要保單位提供富邦人壽之員工電子信箱進行身份驗證'], value: 'email' },
  {
    name: '行動電話',
    children: [
      '限員工本人申請且登記為本來月租型門號(包括中華電信、台灣大哥大、台灣之星、亞太電信、遠傳電信 五家業者)',
      '目前不支援預付卡、外國人、企業、或其他功能受限門號',
      '請使用4g/5g網路進行驗證(勿使用WIFI)',
    ],
    value: 'MID',
  },
]

const validateIdNo = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('請輸入身分證字號/居留證號')
  if (!/^[A-Za-z0-9]{8,10}$/.test(value)) return Promise.reject('請輸入完整之身分證字號/居留證號')
  if (errorInfos.value && errorInfos.value.idNo) return Promise.reject(errorInfos.value.idNo)
  return Promise.resolve()
}
const validateMail = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('請輸入電子信箱')
  if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(value))
    return Promise.reject('請輸入有效電子信箱')
  if (errorInfos.value && errorInfos.value.email) return Promise.reject(errorInfos.value.email)
  return Promise.resolve()
}
const validatePassword = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('請輸入密碼')
  if (errorInfos.value && errorInfos.value.password) return Promise.reject(errorInfos.value.password)
  return Promise.resolve()
}

const validateNewPassword = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('請輸入密碼')
  if (errorInfos.value && errorInfos.value.newPassword) return Promise.reject(errorInfos.value.newPassword)
  return Promise.resolve()
}

const validateNewMobileNo = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('請輸入手機')
  if (errorInfos.value && errorInfos.value.mobileNo) return Promise.reject(errorInfos.value.mobileNo)
  return Promise.resolve()
}

const validateBirthday = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('請輸入生日')
  if (errorInfos.value && errorInfos.value.birthday) return Promise.reject(errorInfos.value.birthday)
  return Promise.resolve()
}

const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  idNo: [{ required: true, validator: validateIdNo }],
  email: [{ required: true, validator: validateMail }],
  password: [{ required: true, validator: validatePassword }],
  newPassword: [{ required: true, validator: validateNewPassword }],
  birthday: [{ required: true, validator: validateBirthday }],
  identity: [{ required: true, message: '請選擇身份驗證' }],
  carrier: [{ required: true, message: '請選擇電信業者' }],
  mobileNo: [{ required: true, validator: validateNewMobileNo }],
})

const { validate, validateInfos } = Form.useForm(modelRef, formRules)
const {
  fetchApplyForgetPasswordApi,
  fetchCheckVaildEmpMailApi,
  fetchCheckVaildIdNoApi,
  fetchTermsAndNoticeApi,
  fetchSearchMobileProviderApi,
  fetchCheckMidResultRecordApi,
  fetchRegisterApi,
} = useFetchFormApi()
const { getPageParam, goNextPage } = useRoute()
const { resetErrors, showFormError, disabledAfterToday, loginTWIDPortal } = useHandleForm()

const collapseItems = ref<CardCollapsed[]>([
  { checking: false, title: '富邦人壽團險自費E填表同意書', isCollapseOpen: false, slotName: 'description1' },
  { checking: false, title: '員工團保查詢約定事項', isCollapseOpen: false, slotName: 'description2' },
  { checking: false, title: '個人資料保護法應告知事項', isCollapseOpen: false, slotName: 'description3' },
])

watchEffect(() => {
  // 監聽檢核密碼全部規範&告知說明與約定事項
  const val = $props.name === MemberFormNameType.SIGNUP ? modelRef.value.password : modelRef.value.newPassword
  passwordValidates.value.forEach(element => {
    if (!val) {
      element.isValid = false
      return
    }
    if (element.regex === 'custom') {
      if (!/([0-9])\1{2}|(012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(val)) {
        element.isValid = true
        const counts = {}
        ;[...val].forEach(x => {
          counts[x] = (counts[x] || 0) + 1
        })
        const array: number[] = Object.values(counts)
        for (let index = 0; index < array.length; index++) {
          if (array[index] > 2) {
            element.isValid = false
            break
          }
        }
      } else {
        element.isValid = false
      }
    } else {
      ;(element.regex as RegExp).test(val) ? (element.isValid = true) : (element.isValid = false)
    }
  })
  if ($props.name === MemberFormNameType.SIGNUP) {
    allPass.value = passwordValidates.value.every(e => e.isValid) && collapseItems.value.every(e => e.checking)
  } else {
    allPass.value = passwordValidates.value.every(e => e.isValid)
  }
})

// 監聽身分證字號/居留證號欄位
watch(
  () => modelRef.value.idNo,
  async value => {
    if (value && value.length === 10 && $props.name === MemberFormNameType.SIGNUP) {
      await fetchCheckVaildIdNoApi()
    }
  },
  { immediate: true },
)

// 路由相關
function useRoute() {
  const prePageSessionName = computed(() =>
    $props.name === MemberFormNameType.SIGNUP
      ? `${MemberFormNameType.SIGNUP}_${MemberFormSessionName.STEP1}`
      : `${MemberFormNameType.FORGET_PASSWORD}_${MemberFormSessionName.STEP1}`,
  )

  // TODO: 取得前一頁資訊
  const getPageParam = () => {
    prePageQuery.value = JSON.parse(sessionStorage.getItem(prePageSessionName.value))
  }
  // 到步驟三
  const goNextPage = async (responseData: NextPageQueryType) => {
    // 加密密碼
    loadingStore.setLoading(true)
    let password: string
    await $utilityApi
      .encryptSthUsingPOST(
        $props.name === MemberFormNameType.SIGNUP ? modelRef.value.password : modelRef.value.newPassword,
      )
      .then(resp => {
        if (resp.data.status === 200) {
          password = resp.data.data
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(resp?.data?.apiError) || '系統有誤，請洽系統管理者',
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
    if (!password) return
    sessionStorage.setItem(
      `${$props.name === MemberFormNameType.SIGNUP ? MemberFormNameType.SIGNUP : MemberFormNameType.FORGET_PASSWORD}_${
        MemberFormSessionName.STEP2
      }`,
      JSON.stringify(
        $props.name === MemberFormNameType.SIGNUP
          ? {
              email: modelRef.value.email,
              accountId: responseData.accountId,
              newPassword: password,
              passCodeId: responseData.passCodeId,
            }
          : {
              email: modelRef.value.email,
              accountId: responseData.accountId,
              newPassword: password,
              passCodeId: responseData.passCodeId,
            },
      ),
    )
    $router.push({ name: $props.name === MemberFormNameType.SIGNUP ? 'VerifyEmail' : 'ForgetPasswordStep3' })
  }
  return { goNextPage, getPageParam, prePageSessionName }
}

// 表單相關API
function useFetchFormApi() {
  // [忘記密碼] 申請忘記密碼
  const fetchApplyForgetPasswordApi = () => {
    loadingStore.setLoading(true)
    const requestData = {
      companyNo: prePageQuery?.value?.companyNo,
      email: modelRef.value.email,
      idNo: modelRef.value.idNo,
      newPassword: modelRef.value.newPassword,
    }
    $authApi
      .empForgetPasswordUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          goNextPage({ accountId: resp.data.data.accountId, passCodeId: resp.data.data.passCodeId })
        } else {
          showFormError(resp)
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

  // [註冊] 檢查MID認證結果紀錄API
  const fetchCheckMidResultRecordApi = async () => {
    loadingStore.setLoading(true)
    const requestData: EmpCheckMidResultModel = {
      companyNo: prePageQuery?.value?.companyNo,
      idNo: modelRef.value.idNo,
      mobileNo: modelRef.value.mobileNo,
      email: modelRef.value.email,
    }
    await $authApi
      .checkMidResultRecordUsingPOST(requestData)
      .then(async resp => {
        if (resp.data.status === 200) {
          console.log(resp.data.data.result)
          switch (resp.data.data.result) {
            case '0':
              $modal.error({
                title: '驗證失敗已超過三次',
                content: resp.data.data.errorMessage,
              })
              break
            case '1':
              $modal.error({
                title: '當年度已認證成功',
                content: resp.data.data.errorMessage,
              })
              break
            case '2':
              // 成功
              fetchRegisterMIDApi()
              console.log('2')
              break
            case '3':
              // 成功
              fetchRegisterMIDApi()
              console.log('3')
              break
            case '4':
              // 過去一年已申請過MID認證，但未完成信箱驗證, 畫面須跳出提醒彈窗，並跳轉至信箱驗證頁
              $modal.warning({
                title: '尚未完成信箱驗證',
                content: '過去一年已申請過MID認證，但未完成信箱驗證。',
                okText: '繼續申請',
                onOk: () => {
                  goNextPage({ accountId: resp.data.data.accountId, passCodeId: resp.data.data.passCodeId })
                },
              })
              break

            default:
              break
          }
        } else {
          showFormError(resp)
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

  // 申請新使用者(信箱驗證)API
  const fetchRegisterApi = () => {
    loadingStore.setLoading(true)
    const twYear = moment(modelRef.value.birthday).year() - 1911
    const requestData: EmpRegisterModel = {
      companyNo: prePageQuery?.value?.companyNo,
      email: modelRef.value.email,
      idNo: modelRef.value.idNo,
      password: modelRef.value.password,
      birthday: `${twYear}/${moment(modelRef.value.birthday).format('MM/DD')}`,
    }
    $authApi
      .registerUsingPOST(requestData)
      .then(async resp => {
        if (resp.data.status === 200) {
          goNextPage({ accountId: resp.data.data.accountId, passCodeId: resp.data.data.passCodeId })
        } else {
          showFormError(resp)
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

  // 申請新使用者(MID)API
  const fetchRegisterMIDApi = () => {
    loadingStore.setLoading(true)
    const twYear = moment(modelRef.value.birthday).year() - 1911
    const requestData: EmpRegisterMidModel = {
      companyNo: prePageQuery?.value?.companyNo,
      email: modelRef.value.email,
      idNo: modelRef.value.idNo,
      birthday: `${twYear}/${moment(modelRef.value.birthday).format('MM/DD')}`,
      mobileNo: modelRef.value.mobileNo,
      mobileProviderId: modelRef.value.carrier,
      password: modelRef.value.password,
    }
    $authApi
      .registerMidUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          const respData = resp.data?.data
          if (respData.returnCode === '0' || respData.returnCode === '0000') {
            loginTWIDPortal(respData)
          } else {
            $modal.error({
              title: '錯誤',
              content: 'MID 認證失敗',
            })
          }
        } else {
          showFormError(resp)
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

  // [註冊] 檢核有效員工Email API
  // TODO: 測試
  const fetchCheckVaildEmpMailApi = async () => {
    loadingStore.setLoading(true)
    const requestData = {
      companyNo: prePageQuery?.value?.companyNo,
      email: modelRef.value.email,
      idNo: modelRef.value.idNo,
    }
    return await $authApi
      .checkEmpEmailUsingPOST(requestData)
      .then(async resp => {
        if (resp.data.status === 200) {
          return true
        } else {
          showFormError(resp)
          return false
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

  // [註冊] 查詢告知聲明與注意事項API
  const fetchTermsAndNoticeApi = async () => {
    const requestData: ETermGroupDto = {
      termsGroup: 'EMP_SIGNUP',
      route: 'FillOutForm',
    }
    await $selfPayEFormApi
      .getTermsAndNoticeUsingPOST(requestData)
      .then(async resp => {
        const respData = resp?.data
        if (respData?.status === 200) {
          collapseItems.value = respData.data.map((el, index) => {
            return {
              checking: false,
              title: el.title,
              isCollapseOpen: false,
              content: el.content,
              slotName: `description${index}`,
            }
          })
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
      //   // console.log('error status = ', error)
      // })
      .finally(() => {
        // loadingStore.setLoading(false)
      })
  }

  // [註冊] 檢核有效員工身分證API
  const fetchCheckVaildIdNoApi = async () => {
    loadingStore.setLoading(true)
    const requestData = {
      companyNo: prePageQuery?.value?.companyNo,
      idNo: modelRef.value.idNo,
    }
    await $authApi
      .empCheckValidIdNoUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          errorInfos.value.idNo = null
          validate('idNo')
          const { isEmailExist } = resp.data.data
          lockIdentity.value = false
          if (isEmailExist === '0') {
            // 身分驗證方式欄位則預設只能選擇【行動電話】
            modelRef.value.identity = 'MID'
            lockIdentity.value = true
          } else if (isEmailExist === '1') {
            // 身分驗證方式欄位則預設帶入【員工電子信箱】，但員工仍然可以手動選擇【行動電話】
            modelRef.value.identity = 'email'
          }
        } else {
          showFormError(resp)
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

  const fetchSearchMobileProviderApi = async () => {
    await $authApi
      .getMobileProviderInfoUsingPOST()
      .then(resp => {
        if (resp.data.status === 200) {
          carrierOptions.value = resp.data.data
        } else {
          showFormError(resp)
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
        // loadingStore.setLoading(false)
      })
  }

  return {
    fetchApplyForgetPasswordApi,
    fetchCheckVaildEmpMailApi,
    fetchTermsAndNoticeApi,
    fetchCheckVaildIdNoApi,
    fetchSearchMobileProviderApi,
    fetchCheckMidResultRecordApi,
    fetchRegisterApi,
    fetchRegisterMIDApi,
  }
}

function useHandleForm() {
  // 清空錯誤資訊
  const resetErrors = () => {
    errorInfos.value = {
      idNo: null,
      password: null,
      email: null,
      birthday: null,
      identity: null,
      carrier: null,
      mobileNo: null,
      newPassword: null,
    }
  }
  const showFormError = (resp: any) => {
    const errorType = $global.getApiErrorType(resp?.data?.errors)
    const getError = JSON.parse(JSON.stringify(resp?.data?.apiError))
    if (errorType === ErrorType.ColumnErrorException) {
      getError.map(i => {
        if (!modelRef.value[i.column]) {
          $modal.error({
            title: '錯誤',
            content: i.message || '部分欄位有誤',
          })
        } else {
          errorInfos.value[i.column] = i.message || '欄位有誤'
          validate(i.column)
        }
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
    console.log(errorInfos.value)
  }

  // 時間選擇日期不得大於今天
  const disabledAfterToday = date => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today
  }

  // 送出轉跳twid TEST:
  const loginTWIDPortal = (respData: EmpRegisterMidDto) => {
    twidSignForm.value.action = import.meta.env.VITE_APP_TWID_URL || 'https://online.fbl.com.tw:8181/IDPortalGW/SIGN'
    // 綁定表單資料
    midPostData.value.BusinessNo = respData.businessNo
    midPostData.value.ApiVersion = respData.apiVersion
    midPostData.value.HashKeyNo = respData.hashKeyNo
    midPostData.value.VerifyNo = respData.verifyNo
    midPostData.value.Token = respData.token
    midPostData.value.IdentifyNo = respData.identifyNo
    midPostData.value.Birthday = respData.birthday
    midPostData.value.ReturnIdentifyNo = respData.returnCode
    midPostData.value.CancelMsg = respData.cancelMsg

    // 送出隱藏FORM表單及跳轉頁面
    loadingStore.setLoading(true)
    setTimeout(() => {
      twidSignForm.value.submit()
    }, 300)
    loadingStore.setLoading(false)
  }
  return { resetErrors, showFormError, disabledAfterToday, loginTWIDPortal }
}

// 送出表單
const onSubmit = () => {
  const formName = $props.name
  // 判斷需驗證的欄位
  let validateFields: string[]
  switch (formName) {
    case MemberFormNameType.FORGET_PASSWORD:
      validateFields = ['idNo', 'email', 'newPassword']
      break

    default:
      modelRef.value.identity === 'MID'
        ? (validateFields = ['idNo', 'email', 'password', 'birthday', 'identity', 'carrier', 'mobileNo'])
        : (validateFields = ['idNo', 'email', 'password', 'birthday', 'identity'])
      break
  }
  // 驗證表單
  resetErrors()
  validate(validateFields)
    .then(async () => {
      if ($props.name === MemberFormNameType.SIGNUP) {
        if (modelRef.value.identity === 'email') {
          if (await fetchCheckVaildEmpMailApi()) fetchRegisterApi()
        } else {
          await fetchCheckMidResultRecordApi()
        }
      } else {
        fetchApplyForgetPasswordApi()
      }
    })
    .catch(() => {
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = document.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}

onMounted(async () => {
  await getPageParam()
  if ($props.name === MemberFormNameType.SIGNUP) {
    loadingStore.setLoading(true)
    await fetchSearchMobileProviderApi()
    await fetchTermsAndNoticeApi()
    loadingStore.setLoading(false)
  }
})
</script>

<template>
  <Loading />
  <FormTitle class="mt-0" title="填寫資料與密碼設定" />
  <a-form layout="vertical">
    <a-form-item v-bind="validateInfos.idNo" label="身分證字號/居留證號" required>
      <a-input
        v-model:value.trim="modelRef.idNo"
        @input="modelRef.idNo = $event.target.value.trim().toUpperCase()"
        :maxLength="10"
        placeholder="e.g. A123456789"
      />
    </a-form-item>
    <a-form-item v-if="$props.name === MemberFormNameType.SIGNUP" v-bind="validateInfos.birthday" label="生日" required>
      <date-picker
        class="w-full"
        v-model:value="modelRef.birthday"
        :disabled-date="disabledAfterToday"
        format="YYYY/MM/DD"
        placeholder="e.g. 081/01/01"
      />
    </a-form-item>
    <a-form-item
      v-if="$props.name === MemberFormNameType.SIGNUP"
      v-bind="validateInfos.identity"
      label="身分驗證方式"
      required
    >
      <a-select
        v-model:value="modelRef.identity"
        :disabled="!modelRef.idNo || modelRef.idNo.length === 0 || lockIdentity"
        placeholder="請選擇身分驗證方式"
      >
        <a-select-option v-for="(item, index) in identityOptions" :key="index" :value="item.value">
          <span class="font-semibold">{{ item.name }}</span> <br />
          <ul class="list-['－'] ps-3">
            <li v-for="(c, idx) in item.children" class="whitespace-break-spaces" :key="idx">
              {{ c }}
            </li>
          </ul>
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      v-if="$props.name === MemberFormNameType.SIGNUP && modelRef.identity === 'MID'"
      v-bind="validateInfos.carrier"
      label="電信業者"
      required
    >
      <a-select v-model:value="modelRef.carrier" placeholder="請選擇身分驗證方式">
        <a-select-option v-for="(c, index) in carrierOptions" :key="index" :value="c.mobileProviderId">
          {{ c.mobileProviderName }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      v-if="$props.name === MemberFormNameType.SIGNUP && modelRef.identity === 'MID'"
      v-bind="validateInfos.mobileNo"
      label="行動電話"
      required
    >
      <a-input v-model:value.trim="modelRef.mobileNo" :maxLength="10" placeholder="e.g. 0912345678" />
    </a-form-item>
    <a-form-item v-bind="validateInfos.email" label="電子信箱" required>
      <a-input v-model:value.trim="modelRef.email" placeholder="e.g. fubonlife123@fubon.com" />
    </a-form-item>
    <a-form-item
      v-bind="$props.name === MemberFormNameType.SIGNUP ? validateInfos.password : validateInfos.newPassword"
      label="設定密碼"
      required
    >
      <a-input-password
        v-if="$props.name === MemberFormNameType.SIGNUP"
        v-model:value.trim="modelRef.password"
        :maxLength="12"
        placeholder="8-12位數密碼，請留意英文大小寫"
      />
      <a-input-password
        v-if="$props.name === MemberFormNameType.FORGET_PASSWORD"
        v-model:value.trim="modelRef.newPassword"
        :maxLength="12"
        placeholder="8-12位數密碼，請留意英文大小寫"
      />
    </a-form-item>
    <div class="mb-[32px] mt-[8px] bg-[#F2F8FF] p-4 lg:text-lg">
      <p class="ps-[25px] font-semibold">須符合</p>
      <ul class="mt-[8px] space-y-1">
        <li
          v-for="(v, index) in passwordValidates"
          :key="index"
          class="relative pl-[23px] before:absolute before:left-0 before:top-[2px] before:h-[15px] before:w-[15px] before:bg-[url('@imgs/icon_check_off.svg')]"
          :class="{ 'gise-icon-check-active': v.isValid }"
        >
          {{ v.name }}
        </li>
        <li>－ 不可重複前3次使用之密碼</li>
        <li>－ 不得與「身分證字號/統一編號/出生年月日」相同</li>
      </ul>
    </div>
    <div v-if="$props.name === MemberFormNameType.SIGNUP">
      <FormTitle title="告知說明與約定事項(同意請打勾)" />
      <CardCollapse :htmlInsert="true" :items="collapseItems" class="mb-[32px]" />
    </div>
    <ButtonRoundedPrimary :disabled="!allPass" @click.prevent="onSubmit" size="full">下一步</ButtonRoundedPrimary>
  </a-form>

  <!-- twid系統需使用原生form submit方式 -->
  <div v-if="$props.name === MemberFormNameType.SIGNUP" id="twid-sign">
    <form ref="twidSignForm" method="post" target="_self" hidden>
      <input type="text" id="BusinessNo" name="BusinessNo" v-model="midPostData.BusinessNo" />
      <input type="text" id="ApiVersion" name="ApiVersion" v-model="midPostData.ApiVersion" />
      <input type="text" id="HashKeyNo" name="HashKeyNo" v-model="midPostData.HashKeyNo" />
      <input type="text" id="VerifyNo" name="VerifyNo" v-model="midPostData.VerifyNo" />
      <input type="text" id="Token" name="Token" v-model="midPostData.Token" />
      <input type="text" id="IdentifyNo" name="IdentifyNo" v-model="midPostData.IdentifyNo" />
      <input type="text" id="Birthday" name="Birthday" v-model="midPostData.Birthday" />
      <input type="text" id="ReturnIdentifyNo" name="ReturnIdentifyNo" v-model="midPostData.ReturnIdentifyNo" />
      <input type="text" id="CancelMsg" name="CancelMsg" v-model="midPostData.CancelMsg" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped>
.gise-icon-check-active::before {
  background-image: url(@imgs/icon_check_on.svg);
}
</style>
