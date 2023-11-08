<script setup lang="ts">
import { ref, watch, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form } from 'ant-design-vue'
import { usePostalCode } from '@/composables/usePostalCode'
import { useTermsAndNotice } from '@/composables/useTermsAndNotice'
import { useLoadingStore } from '@/stores'
import { ErrorType } from '@plugins/global/index'
import type { Rule } from 'ant-design-vue/es/form'
import type {
  EmpInfoTopicConfigDto,
  FilledInEmpInfoDto,
  EmpInfoDto,
  ETermGroupDto,
  CaseMainIdAndApplyInfoDto,
} from '@fubonlife/gise-api-axios-sdk'

interface FormModel extends FilledInEmpInfoDto {}

interface ErrorInfo {
  email: string
  mobileNo: string
  familyAnnualIncome: string
  contactAddress: string
}

const useForm = Form.useForm
const $router = useRouter()
const loadingStore = useLoadingStore()
const {
  proxy: { $user, $global, $modal, $selfPayEFormApi, $validateUtil, $dateTimeUtil },
} = getCurrentInstance()
// composable
const { town, townOpts, district, districtOpts, fetchPostalCode } = usePostalCode()
const { collapseItems, fetchTermsAndNotice } = useTermsAndNotice()

const { isAllChecked, empInfoTopicConfig, modelRef, validateInfos, submitForm } = useEmpForm()
const { handleCancel, nextStep } = useNavigator()

const applyId = $global.handleApplyId('Get')

function useEmpForm() {
  const caseMainId = $user.getMe()?.caseMainId

  const empInfoTopicConfig = ref<EmpInfoTopicConfigDto>({})

  // 是否全選告知事項
  const isAllChecked = ref<boolean>(false)

  const modelRef = ref<FormModel>({
    email: null,
    mobileNo: null,
    familyAnnualIncome: null,
    contactAddress: null,
  })

  const errorInfos = ref<ErrorInfo>({
    email: null,
    mobileNo: null,
    familyAnnualIncome: null,
    contactAddress: null,
  })

  // 清空錯誤資訊
  const resetErrors = () => {
    errorInfos.value = {
      email: null,
      mobileNo: null,
      familyAnnualIncome: null,
      contactAddress: null,
    }
  }

  const validateEmail = async (_rule: Rule, value: string) => {
    if (empInfoTopicConfig.value.emailIsShow === 'Y' && empInfoTopicConfig.value.emailRequired === 'Y' && !value)
      return Promise.reject('請輸入電子信箱')
    if (value && !$validateUtil.pattern.email().test(value)) return Promise.reject('電子信箱格式不符')
    if (errorInfos.value && errorInfos.value.email) return Promise.reject(errorInfos.value.email)
    return Promise.resolve()
  }

  const validateMobileNo = async (_rule: Rule, value: string) => {
    if (empInfoTopicConfig.value.mobileNoIsShow === 'Y' && empInfoTopicConfig.value.mobileNoRequired === 'Y' && !value)
      return Promise.reject('請輸入行動電話')
    if (value && !$validateUtil.pattern.phoneNumber().test(value)) return Promise.reject('手機號碼格式不符')
    if (errorInfos.value && errorInfos.value.mobileNo) return Promise.reject(errorInfos.value.mobileNo)
    return Promise.resolve()
  }

  const validateFamilyAnnualIncome = async (_rule: Rule, value: string) => {
    if (
      empInfoTopicConfig.value.familyAnnualIncomeIsShow === 'Y' &&
      empInfoTopicConfig.value.familyAnnualIncomeRequired === 'Y' &&
      !value
    )
      return Promise.reject('請輸入家庭年收入')
    if (value && !$validateUtil.pattern.num().test(value)) return Promise.reject('僅能輸入正整數')
    if (errorInfos.value && errorInfos.value.familyAnnualIncome)
      return Promise.reject(errorInfos.value.familyAnnualIncome)
    return Promise.resolve()
  }

  const validateContactAddress = async (_rule: Rule, value: string) => {
    if (
      empInfoTopicConfig.value.contactAddressIsShow === 'Y' &&
      empInfoTopicConfig.value.contactAddressRequired === 'Y' &&
      !value
    )
      return Promise.reject('請輸入通訊地址')
    if (errorInfos.value && errorInfos.value.contactAddress) return Promise.reject(errorInfos.value.contactAddress)
    return Promise.resolve()
  }

  const rulesRef = ref({
    email: [{ validator: validateEmail }],
    mobileNo: [{ validator: validateMobileNo }],
    familyAnnualIncome: [{ validator: validateFamilyAnnualIncome }],
    contactAddress: [{ validator: validateContactAddress }],
  })

  const { validate, validateInfos } = useForm(modelRef, rulesRef)

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

  const initPage = async (): Promise<void> => {
    loadingStore.setLoading(true)
    const termGroup: ETermGroupDto = {
      route: 'EmployeeData',
      termsGroup: 'EMP_INFO',
    }
    await fetchPostalCode()
    Promise.all([fetchTermsAndNotice(termGroup), fetchEmpInfoTopicConfig(), fetchFilledInEmpInfo()])
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      // })
      .finally(() => loadingStore.setLoading(false))
  }

  // API: 1.2.20 查詢已填寫之員工基本資料
  const fetchFilledInEmpInfo = (): Promise<void> => {
    const caseMainIdAndApplyInfo: CaseMainIdAndApplyInfoDto = {
      applyId,
      caseMainId,
      crtNo: $user.getMe()?.crtNo,
      policyNo: $user.getMe()?.policyNo,
      policySeq: $user.getMe()?.policySeq,
      times: $user.getMe()?.times,
    }
    return (
      $selfPayEFormApi
        .getFilledInEmpInfoUsingPOST(caseMainIdAndApplyInfo)
        .then(resp => {
          const respData = resp?.data
          if (respData.status === 200) {
            modelRef.value = respData.data
            district.value = respData.data?.postalCode
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
    )
  }

  // API: 1.2.21 查詢員工基本資料題目設定
  const fetchEmpInfoTopicConfig = (): Promise<void> => {
    return $selfPayEFormApi.getEmpInfoTopicConfigUsingPOST({ caseMainId }).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        empInfoTopicConfig.value = respData?.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  // API: 1.2.22 儲存員工基本資料API
  const saveEmpInfo = (): void => {
    loadingStore.setLoading(true)
    const { birthday, ...restForm } = modelRef.value
    const $form: EmpInfoDto = {
      applyId,
      caseMainId,
      birthday: birthday && birthday.replace(/\//g, ''),
      ...restForm,
      ...empInfoTopicConfig.value,
    }
    $selfPayEFormApi
      .saveEmpInfoUsingPOST($form)
      .then(resp => {
        const respData = resp?.data
        if (respData?.status === 200) {
          nextStep(respData.data?.applyId)
        } else {
          showFormError(resp)
        }
      })
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      // })
      .finally(() => loadingStore.setLoading(false))
  }

  const submitForm = () => {
    resetErrors()
    validate()
      .then(() => {
        saveEmpInfo()
      })
      .catch(() => document.querySelector('.ant-form-item-has-error')?.scrollIntoView())
  }

  watch(
    collapseItems,
    value => {
      isAllChecked.value = value.every(e => e.checking)
    },
    { deep: true },
  )

  watch(district, value => {
    modelRef.value.postalCode = value
  })

  onMounted(() => {
    if (applyId && $global.getParam()?.fromPage === 'Index') {
      $modal.warning({
        title: '系統將自動帶入您先前申請資料',
        content: '為節省您寶貴時間，系統將自動帶入您先前申請資料，以利您的申請作業',
        onOk: () => initPage(),
      })
    } else initPage()
  })

  return {
    isAllChecked,
    empInfoTopicConfig,
    modelRef,
    validateInfos,
    submitForm,
  }
}

function useNavigator() {
  const situation: 'applyArea' | 'searchArea' = $global.getQuery<any>()?.situation

  const handleCancel = () => {
    $router.push({
      path: situation === 'applyArea' ? '/' : '/fill-out-record',
    })
  }

  const nextStep = applyId => {
    if (applyId) $global.handleApplyId('Set', applyId)
    $global.changeRouterAndaddParam({
      toRouter: 'InsuredData',
      query: {
        idNo: modelRef.value.idNo,
        name: modelRef.value.name,
        birthDate: modelRef.value.birthday,
        situation,
      },
    })
  }

  return {
    handleCancel,
    nextStep,
  }
}
</script>
<template>
  <div>
    <FormTitle title="員工資料輸入" />
    <div class="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
      <div class="min-h-[50px] border-b-[1px] border-b-neutral-entry" v-if="empInfoTopicConfig.empNameIsShow === 'Y'">
        <div class="font-semibold text-black">員工姓名</div>
        <div class="py-1 font-semibold text-info">{{ modelRef.name }}</div>
      </div>
      <div class="min-h-[50px] border-b-[1px] border-b-neutral-entry" v-if="empInfoTopicConfig.idNoIsShow === 'Y'">
        <div class="font-semibold text-black">身分證字號/居留證號</div>
        <div class="py-1 font-semibold text-info">{{ modelRef.idNo }}</div>
      </div>
      <div class="min-h-[50px] border-b-[1px] border-b-neutral-entry" v-if="empInfoTopicConfig.birthDateIsShow === 'Y'">
        <div class="font-semibold text-black">生日</div>
        <div class="py-1 font-semibold text-info">
          {{ modelRef.birthday && $dateTimeUtil.dateStringAddSlash(modelRef.birthday) }}
        </div>
      </div>
      <div
        class="min-h-[50px] border-b-[1px] border-b-neutral-entry"
        v-if="empInfoTopicConfig.departmentIsShow === 'Y'"
      >
        <div class="font-semibold text-black">部門</div>
        <div class="py-1 font-semibold text-info">{{ modelRef.department }}</div>
      </div>
      <div
        class="min-h-[50px] border-b-[1px] border-b-neutral-entry"
        v-if="empInfoTopicConfig.factoryTypeIsShow === 'Y'"
      >
        <div class="font-semibold text-black">廠別</div>
        <div class="py-1 font-semibold text-info">{{ modelRef.factoryType }}</div>
      </div>
    </div>
    <a-form layout="vertical" class="mt-4">
      <div class="md:grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
        <a-form-item v-bind="validateInfos.email" v-if="empInfoTopicConfig.emailIsShow === 'Y'">
          <template #label>
            電子信箱
            <span v-if="empInfoTopicConfig.emailRequired === 'Y'" class="ml-1 font-mark text-base text-[#ff4d4f]"
              >*</span
            >
          </template>
          <a-input
            :maxLength="100"
            v-model:value="modelRef.email"
            placeholder="e.g. fubonlife123@fubon.com"
            allowClear
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.mobileNo" v-if="empInfoTopicConfig.mobileNoIsShow === 'Y'">
          <template #label>
            行動電話
            <span v-if="empInfoTopicConfig.mobileNoRequired === 'Y'" class="ml-1 font-mark text-base text-[#ff4d4f]"
              >*</span
            >
          </template>
          <a-input
            v-model:value="modelRef.mobileNo"
            placeholder="e.g. 0912345678"
            class="w-[calc((100%-16px)/2)] md:w-[70%]"
            allowClear
            :maxLength="10"
          />
        </a-form-item>
      </div>

      <div class="grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
        <div class="w-[100%] gap-x-4 md:col-span-2 md:flex" v-if="empInfoTopicConfig.contactAddressIsShow === 'Y'">
          <a-form-item class="w-[100%]" v-bind="validateInfos.contactAddress">
            <template #label>
              通訊地址
              <span
                v-if="empInfoTopicConfig.contactAddressRequired === 'Y'"
                class="ml-1 font-mark text-base text-[#ff4d4f]"
                >*</span
              >
            </template>
            <div class="grid grid-cols-2 gap-x-4 md:col-span-4 md:grid-cols-4 lg:flex">
              <div class="md:basis-[165px]">
                <SelectSearch
                  v-model:value="town"
                  :options="townOpts"
                  placeholder="請選擇縣市"
                  class="h-[43px]"
                  allowClear
                />
              </div>
              <div class="md:basis-[165px]">
                <SelectSearch
                  v-model:value="district"
                  :options="districtOpts"
                  placeholder="請選擇鄉鎮市區"
                  :disabled="districtOpts.length <= 0"
                  class="h-[43px]"
                  allowClear
                />
              </div>
              <div class="col-span-2 mt-3 md:mt-0 md:flex-1">
                <a-input v-model:value="modelRef.contactAddress" placeholder="e.g. 敦化南路1段108號" allowClear />
              </div>
            </div>
          </a-form-item>
        </div>
        <div v-if="empInfoTopicConfig.familyAnnualIncomeIsShow === 'Y'">
          <a-form-item v-bind="validateInfos.familyAnnualIncome">
            <template #label>
              家庭年收入
              <span
                v-if="empInfoTopicConfig.familyAnnualIncomeRequired === 'Y'"
                class="ml-1 font-mark text-base text-[#ff4d4f]"
                >*</span
              >
            </template>
            <div class="flex items-center">
              <a-input
                v-model:value="modelRef.familyAnnualIncome"
                placeholder="e.g. 100"
                class="w-[calc((100%-16px)/2)] md:w-[182px]"
                allowClear
                :maxLength="5"
              />
              <span class="ml-2">萬元</span>
            </div>
          </a-form-item>
        </div>
      </div>

      <FormTitle title="聲明事項(同意請打勾)" />
      <CardCollapse :items="collapseItems" />
    </a-form>

    <div class="mt-4 flex justify-center lg:mt-8">
      <ButtonRoundedSecondary @click="handleCancel">取消</ButtonRoundedSecondary>
      <ButtonRoundedPrimary class="ml-[15px] md:ml-[16px] lg:ml-[32px]" @click="submitForm" :disabled="!isAllChecked"
        >下一步</ButtonRoundedPrimary
      >
    </div>
  </div>
</template>

<style scoped></style>
