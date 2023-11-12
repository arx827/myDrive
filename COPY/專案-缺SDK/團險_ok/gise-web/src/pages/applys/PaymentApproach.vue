<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance, nextTick, onMounted } from 'vue'
import { Form } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores'
import { ErrorType } from '@plugins/global/index'
import type { DefaultOptionType } from 'ant-design-vue/lib/select/index'
import type { FormInstance } from 'ant-design-vue'
import type { Rule, RuleObject } from 'ant-design-vue/es/form'
import type { SelectProps } from 'ant-design-vue'
import type { PaymentDetailModel, PaymentCautionModel, EEmpPaymentDetailDto } from '@fubonlife/gise-api-axios-sdk'

interface FormType {
  method?: string
  crdBank?: string
  crdCardNo?: string
  crdExp?: {
    mon: string
    year: string
  }
  traBank?: string
  traAccountNo?: string
  agree?: {
    C: boolean[]
    T: boolean[]
    U: boolean[]
  }
}

interface ApiErrorInfo {
  crdCardNo: string
  crdExp: string
  traAccountNo: string
}

const $router = useRouter()
const loadingStore = useLoadingStore()
const {
  proxy: { $giseEnum, $numberUtil, $global, $user, $modal, $selfPayEFormApi, $commonApi },
} = getCurrentInstance()

const useForm = Form.useForm
const formRef = ref<FormInstance>(null)

const { paymentData, getPaymentName, modifyPayment, fetchPaymentCaution, fetchPaymentDetail } = usePaymantData()
const {
  isAgreePass,
  isLockPayment,
  paymentCautionList,
  modelRef,
  validateInfos,
  paymentFilterOpts,
  showFormError,
  onSubmit,
} = usePaymentForm()
const {
  crdNoMaskRef,
  crdNoUnMaskRef,
  isCrdNoHasMask,
  monthOpts,
  getCreditCardYearOpts,
  cardBankOpts,
  updateCrdNo,
  clearCrdNo,
  fetchCardBankOption,
} = useCreditCard()
const { traBankOpts, fetchTraBankOption } = useDebitCard()
const { prevStep, nextStep } = useNavigatePage()

const userName = $user.getMe()?.name
const applyId = $global.handleApplyId('Get')

// API資料相關
function usePaymantData() {
  const caseMainId = $user.getMe()?.caseMainId

  const paymentLog = ref<EEmpPaymentDetailDto>({})

  const paymentData = ref<EEmpPaymentDetailDto>({})

  const getPaymentName = computed<string>(() => {
    return $giseEnum.getLabel('payment', modelRef.value.method)
  })

  // 比對前後資料是否有修改
  const compareBeforeAndAfter = (): 'M' | 'E' => {
    let hasChange = false
    hasChange = Object.entries(paymentData.value).some(([key, value]) => {
      return value !== paymentLog.value[key]
    })
    // 若有變動填寫資訊帶入'M'，否則帶入'E'
    return hasChange ? 'M' : 'E'
  }

  // API: 1.2.45.	查詢繳費方式設定API
  const fetchPaymentMethod = (): Promise<void> => {
    return $selfPayEFormApi.getPaymentMethodUsingPOST(caseMainId).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        // 判斷是否鎖住繳費方式 -> 只有一個是 Y 代表沒有其他選擇
        const count = Object.values(respData.data).reduce((acc, item) => {
          if (item === 'Y') return acc + 1
          else return acc
        }, 0)
        isLockPayment.value = !!(count === 1)

        // 取得繳費方式的選項
        Object.entries(respData.data).map(([key, value]) => {
          if (value === 'Y') {
            switch (key) {
              case 'bankAccount':
                paymentFilterOpts.value.push($giseEnum.getObject('payment', 'T'))
                if (isLockPayment.value) modelRef.value.method = 'T'
                break
              case 'creditCard':
                paymentFilterOpts.value.push($giseEnum.getObject('payment', 'C'))
                if (isLockPayment.value) modelRef.value.method = 'C'
                break
              case 'unitWithholding':
                paymentFilterOpts.value.push($giseEnum.getObject('payment', 'U'))
                if (isLockPayment.value) modelRef.value.method = 'U'
                break
              default:
                break
            }
          }
        })
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  // API: 1.2.46.	查詢繳費填寫內容API
  const fetchPaymentDetail = (): Promise<void> => {
    const paymentDetail: PaymentDetailModel = {
      applyId,
      idNo: $user.getMe()?.idNo,
      crtNo: $user.getMe()?.crtNo,
      policyNo: $user.getMe()?.policyNo,
      policySeq: $user.getMe()?.policySeq,
      times: $user.getMe()?.times,
    }
    return $selfPayEFormApi.getPaymentDetailUsingPOST(paymentDetail).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        paymentLog.value = JSON.parse(JSON.stringify(respData?.data?.before))
        isCrdNoHasMask.value = !!respData.data.after?.crdCardNo
        // assign to Form
        const { crdExpMon, crdExpYear, crdCardNo, ...rest } = respData.data.after
        modelRef.value.crdExp.mon = crdExpMon
        modelRef.value.crdExp.year = crdExpYear
        modelRef.value.crdCardNo = crdCardNo && crdCardNo.replace(/\d{12}/, '*')
        paymentData.value.crdCardNo = crdCardNo
        for (const [key, value] of Object.entries(rest)) {
          if (key === 'method' && isLockPayment.value) continue
          modelRef.value[key] = value
        }
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  // API: 1.2.48.	取得客製化聲明事項API
  const fetchPaymentCaution = (paymentCaution: PaymentCautionModel): Promise<void> => {
    loadingStore.setLoading(true)
    return (
      $selfPayEFormApi
        .getPaymentCautionUsingPOST(paymentCaution)
        .then(resp => {
          const respData = resp?.data
          if (respData?.status === 200) {
            paymentCautionList.value = respData.data
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
        // })
        .finally(() => {
          loadingStore.setLoading(false)
        })
    )
  }

  // API: 1.2.49.	編輯繳費紀錄API
  const modifyPayment = (): void => {
    loadingStore.setLoading(true)
    paymentData.value.paymentId = paymentLog.value.paymentId
    paymentData.value.applyId = paymentLog.value.applyId
    paymentData.value.method = modelRef.value.method
    paymentData.value.traBank = paymentData.value.method === 'T' ? modelRef.value.traBank : null
    paymentData.value.traAccountNo = paymentData.value.method === 'T' ? modelRef.value.traAccountNo : null
    paymentData.value.crdExpMon = paymentData.value.method === 'C' ? modelRef.value.crdExp.mon : null
    paymentData.value.crdExpYear = paymentData.value.method === 'C' ? modelRef.value.crdExp.year : null
    paymentData.value.crdBank = paymentData.value.method === 'C' ? modelRef.value.crdBank : null
    paymentData.value.crdCardNo = paymentData.value.method === 'C' ? paymentData.value.crdCardNo : null
    paymentData.value.action = compareBeforeAndAfter()
    $selfPayEFormApi
      .modifyPaymentUsingPOST(paymentData.value)
      .then(resp => {
        const respData = resp?.data
        if (respData?.status === 200) {
          nextStep()
        } else {
          showFormError(resp)
        }
      })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  onMounted(async () => {
    loadingStore.setLoading(true)
    await Promise.all([
      fetchPaymentMethod(),
      fetchTraBankOption(caseMainId),
      fetchCardBankOption(),
      fetchPaymentDetail(),
    ])
    loadingStore.setLoading(false)
  })

  return {
    paymentData,
    getPaymentName,
    modifyPayment,
    fetchPaymentCaution,
    fetchPaymentDetail,
  }
}

// 表單相關
function usePaymentForm() {
  const isLockPayment = ref<boolean>(false)

  // 繳費方式下拉
  const paymentFilterOpts = ref<SelectProps['options']>([])

  // 聲明事項
  const paymentCautionList = ref<string[]>([])

  const modelRef = ref<FormType>({
    method: null,
    crdBank: null,
    crdCardNo: null,
    crdExp: {
      mon: null,
      year: null,
    },
    traBank: null,
    traAccountNo: null,
    agree: {
      C: [false, false, false],
      T: [false],
      U: [false],
    },
  })

  const isAgreePass = ref<boolean>(false)

  const validateCrdBank = async (_rule: Rule, value: string) => {
    if (modelRef.value.method === 'C' && !value) return Promise.reject('請選擇發卡銀行')
    return Promise.resolve()
  }

  const validateCrdCardNo = async (_rule: Rule, value: string) => {
    if (modelRef.value.method === 'C' && !value) return Promise.reject('請輸入卡號')
    if (modelRef.value.method === 'C' && value.length < 12) return Promise.reject('請輸入完整卡號')
    if (errorInfos.value && errorInfos.value.crdCardNo) return Promise.reject(errorInfos.value.crdCardNo)
    return Promise.resolve()
  }
  const validateCrdExp = async (_rule: Rule, value: { [key: string]: string }) => {
    const { mon, year } = value
    if (modelRef.value.method === 'C' && (!mon || !year)) return Promise.reject('請選擇到期日')
    if (errorInfos.value && errorInfos.value.crdExp) return Promise.reject(errorInfos.value.crdExp)
    return Promise.resolve()
  }

  const validateTraAccountNo = async (_rule: Rule, value: string) => {
    if (modelRef.value.method === 'T' && !value) return Promise.reject('請輸入卡號')
    if (modelRef.value.method === 'T' && value.length < 12) return Promise.reject('請輸入完整銀行帳號')
    if (errorInfos.value && errorInfos.value.traAccountNo) return Promise.reject(errorInfos.value.traAccountNo)
    return Promise.resolve()
  }

  const validateTraBank = async (_rule: Rule, value: string) => {
    if (modelRef.value.method === 'T' && !value) return Promise.reject('請選擇扣款銀行')
    return Promise.resolve()
  }

  const checkAgreement = () => {
    const method = modelRef.value.method
    isAgreePass.value = !!modelRef.value.agree[method]?.every(i => i)
  }

  const rulesRef = ref<{ [k: string]: RuleObject | RuleObject[] }>({
    method: [{ required: true, message: '請選擇繳費方式' }],
    crdBank: [{ validator: validateCrdBank }],
    crdCardNo: [{ validator: validateCrdCardNo }],
    crdExp: [{ validator: validateCrdExp }],
    traBank: [{ validator: validateTraBank }],
    traAccountNo: [{ validator: validateTraAccountNo }],
  })

  const { validate, validateInfos, clearValidate } = useForm(modelRef, rulesRef)

  const errorInfos = ref<ApiErrorInfo>({
    crdCardNo: null,
    crdExp: null,
    traAccountNo: null,
  })

  // 清空錯誤資訊
  const resetErrors = () => {
    errorInfos.value = {
      crdCardNo: null,
      crdExp: null,
      traAccountNo: null,
    }
  }

  const showFormError = (resp: any) => {
    const errorType = $global.getApiErrorType(resp?.data?.errors)
    const getError = JSON.parse(JSON.stringify(resp?.data?.apiError))
    if (errorType === ErrorType.ColumnErrorException) {
      getError.map(i => {
        if (Object.keys(errorInfos.value).includes(i.column)) {
          errorInfos.value[i.column] = i.message || '欄位有誤'
          validate(i.column)
        } else {
          $modal.error({
            title: '錯誤',
            content: i.message || '欄位有誤',
          })
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
    // console.log(errorInfos.value)
  }

  const resetAgree = () => {
    modelRef.value.agree = {
      C: [false, false, false],
      T: [false],
      U: [false],
    }
  }

  // 送出表單
  const onSubmit = async () => {
    resetErrors()
    if (paymentCautionList.value?.length == 0) {
      nextStep()
      return
    }
    validate()
      .then(() => {
        modifyPayment()
      })
      .catch(() => {
        document.querySelector('.ant-form-item-has-error')?.scrollIntoView()
      })
  }

  watch(
    () => modelRef.value.agree,
    () => checkAgreement(),
    { deep: true },
  )

  watch(
    () => modelRef.value.method,
    value => {
      resetAgree()
      paymentCautionList.value = []
      if (!value) return
      Promise.all([
        fetchPaymentCaution({
          method: value || '',
          name: $user.getMe()?.name,
        }),
      ])
    },
    { deep: true },
  )

  return {
    isAgreePass,
    isLockPayment,
    paymentCautionList,
    modelRef,
    validateInfos,
    paymentFilterOpts,
    showFormError,
    onSubmit,
    clearValidate,
    validate,
  }
}

// 信用卡授權付款
function useCreditCard() {
  // 卡號欄位(有隱碼) ref DOM
  const crdNoMaskRef = ref<HTMLElement | null>(null)

  // 卡號欄位(無隱碼) ref DOM
  const crdNoUnMaskRef = ref<HTMLElement | null>(null)

  // 卡號是否隱碼
  const isCrdNoHasMask = ref<boolean>(false)

  // 下拉：月份
  const monthOpts = ref<DefaultOptionType[]>([
    ...Array(12)
      .fill(null)
      .map((_, i) => ({ value: $numberUtil.padStart(i + 1, 2) })),
  ])

  // 下拉：年份 (取得 前後5年內資料)
  const getCreditCardYearOpts = computed<DefaultOptionType[]>(() => {
    const nowYear = new Date().getFullYear()
    const $return = []
    for (let i = -5; i < 6; i++) {
      // 取年份末兩碼
      $return.push((i + nowYear).toString().substring(2))
    }
    return [...$return.map(i => ({ value: i, label: i }))]
  })

  // 清空卡號並取消隱碼
  const clearCrdNo = async (): Promise<void> => {
    modelRef.value.crdCardNo = ''
    isCrdNoHasMask.value = false

    // 卡號欄位(無隱碼) DOM 渲染完成
    await nextTick()
    crdNoUnMaskRef.value.focus()
  }

  // 更新卡號
  const updateCrdNo = (): void => {
    paymentData.value.crdCardNo = modelRef.value.crdCardNo.replace(/-/g, '')
  }

  const cardBankOpts = ref<DefaultOptionType[]>([])

  // API: 1.2.47.	發卡銀行下拉選單API
  const fetchCardBankOption = (): Promise<void> => {
    return $commonApi.getCardBankOptionUsingPOST().then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        cardBankOpts.value = Object.entries(respData.data).map(([key, value]) => {
          return {
            label: value,
            value: key,
          }
        })
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  return {
    crdNoMaskRef,
    crdNoUnMaskRef,
    cardBankOpts,
    isCrdNoHasMask,
    monthOpts,
    getCreditCardYearOpts,
    updateCrdNo,
    clearCrdNo,
    fetchCardBankOption,
  }
}

// 銀行自動轉帳付款表單
function useDebitCard() {
  const traBankOpts = ref<DefaultOptionType[]>([])

  // API: 1.2.50.	扣款銀行下拉選單API
  const fetchTraBankOption = (caseMainId): Promise<void> => {
    return $selfPayEFormApi.getTraBankOptionUsingPOST(caseMainId).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        traBankOpts.value = Object.entries(respData.data).map(([key, value]) => {
          return {
            label: value,
            value: key,
          }
        })
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  return {
    traBankOpts,
    fetchTraBankOption,
  }
}

// 導頁
function useNavigatePage() {
  const situation: 'applyArea' | 'searchArea' = $global.getQuery<any>()?.situation

  const prevStep = (): void => {
    $router.push({
      path: '/apply/step3',
      query: { situation },
    })
  }
  const nextStep = (): void => {
    $global.changeRouterAndaddParam({
      toRouter: 'ConfirmData',
      query: { situation },
    })
  }

  return {
    prevStep,
    nextStep,
  }
}
</script>
<template>
  <FormTitle title="繳費方式(授權人為員工本人)" />

  <a-form ref="formRef" layout="vertical" class="mt-2 lg:mt-4">
    <div class="gap-x-4 gap-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      <!-- 付款方式 -->
      <div class="mb-4 border-b-[1px] border-b-neutral-entry text-base lg:text-lg" v-if="isLockPayment">
        <div class="font-semibold text-black">繳費方式</div>
        <div class="py-2 font-semibold text-info">{{ getPaymentName }}</div>
      </div>
      <a-form-item label="繳費方式" class="text-base lg:text-lg" v-else v-bind="validateInfos.method">
        <SelectSearch
          placeholder="請選擇繳費方式"
          :options="paymentFilterOpts"
          allowClear
          v-model:value="modelRef.method"
        />
      </a-form-item>
      <!-- 授權人姓名 -->
      <div
        class="mb-4 border-b-[1px] border-b-neutral-entry text-base lg:text-lg"
        v-if="['C', 'T'].includes(modelRef.method)"
      >
        <div class="font-semibold text-black">授權人姓名</div>
        <div class="font-semibold text-info" :class="isLockPayment ? 'py-2' : 'mt-[20px]'">{{ userName }}</div>
      </div>
    </div>
    <div class="gap-x-4 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      <!-- 信用卡 -->
      <template v-if="['C'].includes(modelRef.method)">
        <a-form-item class="text-base lg:text-lg" v-bind="validateInfos.crdBank">
          <template #label>
            發卡銀行
            <span class="ml-1 font-mark text-base text-[#ff4d4f]">*</span>
          </template>
          <SelectSearch
            placeholder="請選發卡銀行"
            :options="cardBankOpts"
            allowClear
            v-model:value="modelRef.crdBank"
          />
        </a-form-item>
        <a-form-item class="text-base lg:text-lg" v-bind="validateInfos.crdCardNo">
          <template #label>
            卡號
            <span class="ml-1 font-mark text-base text-[#ff4d4f]">*</span>
          </template>
          <a-input
            ref="crdNoMaskRef"
            v-if="isCrdNoHasMask"
            placeholder="eg. 0000-0000-0000-0000"
            :maxlength="19"
            @focus="clearCrdNo"
            allowClear
            v-model:value="modelRef.crdCardNo"
            v-mask="'****-****-****-####'"
          />
          <a-input
            ref="crdNoUnMaskRef"
            v-else
            placeholder="eg. 0000-0000-0000-0000"
            :maxlength="19"
            @change="updateCrdNo"
            allowClear
            v-model:value="modelRef.crdCardNo"
            v-mask="'####-####-####-####'"
          />
        </a-form-item>
        <a-form-item class="text-base lg:text-lg" v-bind="validateInfos.crdExp">
          <template #label>
            到期日
            <span class="ml-1 font-mark text-base text-[#ff4d4f]">*</span>
          </template>
          <div class="flex items-center gap-2">
            <div class="basis-[80px] lg:basis-[100px]">
              <SelectSearch
                placeholder="請選擇"
                class="h-[43px]"
                v-model:value="modelRef.crdExp.mon"
                allowClear
                :options="monthOpts"
              />
            </div>
            <span>月 /</span>
            <div class="basis-[80px] lg:basis-[100px]">
              <SelectSearch
                placeholder="請選擇"
                class="h-[43px]"
                v-model:value="modelRef.crdExp.year"
                allowClear
                :options="getCreditCardYearOpts"
              />
            </div>
            <span>年</span>
          </div>
        </a-form-item>
      </template>
      <!-- 銀行 -->
      <template v-else-if="['T'].includes(modelRef.method)">
        <a-form-item class="text-base lg:text-lg" v-bind="validateInfos.traBank">
          <template #label>
            扣款銀行
            <span class="ml-1 font-mark text-base text-[#ff4d4f]">*</span>
          </template>
          <SelectSearch
            placeholder="請選擇繳費方式"
            :options="traBankOpts"
            allowClear
            v-model:value="modelRef.traBank"
          />
        </a-form-item>
        <a-form-item class="text-base lg:text-lg" v-bind="validateInfos.traAccountNo">
          <template #label>
            銀行帳號
            <span class="ml-1 font-mark text-base text-[#ff4d4f]">*</span>
          </template>
          <a-input
            v-mask="'################'"
            :maxlength="16"
            placeholder="請輸入銀行帳號"
            allowClear
            v-model:value="modelRef.traAccountNo"
          />
        </a-form-item>
      </template>
    </div>
    <!-- 聲明事項 -->
    <div class="col-span-2 lg:col-span-3">
      <a-form-item v-bind="validateInfos.agree" v-if="modelRef.method">
        <div class="mt-2 lg:text-lg" v-for="(item, index) in paymentCautionList" :key="index">
          <a-checkbox v-model:checked="modelRef.agree[modelRef.method][index]" class="items-start">
            <span>{{ item }}</span>
          </a-checkbox>
        </div>
      </a-form-item>
    </div>
  </a-form>

  <div class="mt-4 flex justify-center lg:mt-8">
    <ButtonRoundedSecondary @click="prevStep">上一步</ButtonRoundedSecondary>
    <ButtonRoundedPrimary
      class="ml-[15px] md:ml-[16px] lg:ml-[32px]"
      :disabled="!modelRef.method || (paymentCautionList?.length > 0 && !isAgreePass)"
      @click="onSubmit"
      >下一步</ButtonRoundedPrimary
    >
  </div>
</template>

<style scoped>
/* error 狀態下 checkbox 紅框 */
::v-deep(.ant-form-item-has-error .ant-checkbox-inner) {
  @apply border-[#ff0000];
}
</style>
