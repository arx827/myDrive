<script setup lang="ts">
import { ref, watch, getCurrentInstance, computed } from 'vue'
import { Form } from 'ant-design-vue'
import { useLoadingStore } from '@/stores'
import { ErrorType } from '@plugins/global/index'
import type { Rule } from 'ant-design-vue/es/form'
import type { DescriptionsData } from '@shared/Descriptions.vue'
import type { RadioGroupBorderedProp } from '@/components/shared/RadioGroupBordered.vue'
import type {
  CaseMainWithPlanDto,
  HealthDeclarationTopicDto,
  HealthDeclarationInfoDto,
  ModifyDetailDto,
} from '@fubonlife/gise-api-axios-sdk'

interface FormNameProp {
  isEdit?: boolean
  infoData: HealthDeclarationInfoDto
  isOpenModal?: boolean
}

interface BasicInfom {
  age?: string
  insAttr?: string
  name?: string
  policyPlan?: string
  sex?: string
  idNo?: string
}

interface FormType {
  certificateOfDisability: string
  declarationOfGuardian: string
  description: string
  healthInsurance: string
  height: string
  injuryInsurance: string
  lifeInsurance: string
  lifeMemo: string
  weight: string
}

interface Enum {
  key: string
  value: string
}

interface ErrorInfo {
  certificateOfDisability: string
  declarationOfGuardian: string
  description: string
  healthInsurance: string
  height: string
  injuryInsurance: string
  lifeInsurance: string
  lifeMemo: string
  weight: string
}

const $props = withDefaults(defineProps<FormNameProp>(), {
  isEdit: false,
})

const $emit = defineEmits(['close', 'closeAndRefreash'])

const {
  proxy: { $user, $giseEnum, $selfPayEFormApi, $modal, $global, $validateUtil },
} = getCurrentInstance()

const loadingStore = useLoadingStore()
const { modelRef, validateInfos, beforeSubmitForm, clearValidate, resetFields } = useEditForm()
const { insuredDiscriptions, healthDeclarationQuestion, trueOrFalseOptions } = useCommon()

// 編輯時的表單
function useEditForm() {
  const modelRef = ref<FormType>({
    certificateOfDisability: null,
    declarationOfGuardian: null,
    description: null,
    healthInsurance: null,
    height: null,
    injuryInsurance: null,
    lifeInsurance: null,
    lifeMemo: null,
    weight: null,
  })

  const errorInfos = ref<ErrorInfo>({
    certificateOfDisability: null,
    declarationOfGuardian: null,
    description: null,
    healthInsurance: null,
    height: null,
    injuryInsurance: null,
    lifeInsurance: null,
    lifeMemo: null,
    weight: null,
  })

  // 清空錯誤資訊
  const resetErrors = () => {
    errorInfos.value = {
      certificateOfDisability: null,
      declarationOfGuardian: null,
      description: null,
      healthInsurance: null,
      height: null,
      injuryInsurance: null,
      lifeInsurance: null,
      lifeMemo: null,
      weight: null,
    }
  }

  const validateHeight = async (_rule: Rule, value: string) => {
    if (!value) return Promise.reject('請輸入身高')
    if (!$validateUtil.pattern.num().test(value)) return Promise.reject('僅能輸入數字')
    if (JSON.parse(value) < 30) return Promise.reject('最小值不得小於30公分')
    if (JSON.parse(value) > 250) return Promise.reject('最大值不得大於250公分')
    return Promise.resolve()
  }

  const validateWeight = async (_rule: Rule, value: string) => {
    if (!value) return Promise.reject('請輸入體重')
    if (!$validateUtil.pattern.num().test(value)) return Promise.reject('僅能輸入數字')
    if (JSON.parse(value) < 1) return Promise.reject('最小值不得小於1公斤')
    if (JSON.parse(value) > 300) return Promise.reject('最大值不得大於300公斤')
    return Promise.resolve()
  }

  const validateDescription = async (_rule: Rule, value: string) => {
    if (
      (modelRef.value.lifeInsurance === 'Y' ||
        modelRef.value.healthInsurance === 'Y' ||
        modelRef.value.injuryInsurance === 'Y') &&
      !value
    )
      return Promise.reject('該欄位必填')
    return Promise.resolve()
  }

  const validateCertificateOfDisability = async (_rule: Rule, value: string) => {
    if (!value) return Promise.reject('請填答')
    return Promise.resolve()
  }

  const validateDeclarationOfGuardian = async (_rule: Rule, value: string) => {
    if (!value) return Promise.reject('請填答')
    return Promise.resolve()
  }

  const rulesRef = ref({
    height: [{ validator: validateHeight }],
    weight: [{ validator: validateWeight }],
    certificateOfDisability: [{ validator: validateCertificateOfDisability }],
    declarationOfGuardian: [{ validator: validateDeclarationOfGuardian }],
    lifeInsurance: [{ required: true, message: '請填答' }],
    healthInsurance: [{ required: true, message: '請填答' }],
    injuryInsurance: [{ required: true, message: '請填答' }],
    description: [{ validator: validateDescription }],
  })

  const useForm = Form.useForm
  const { validate, validateInfos, clearValidate, resetFields } = useForm(modelRef, rulesRef)

  // API: 1.2.44.	編輯健康聲明書填寫內容API
  const modifyHealthDeclarationDetail = (): Promise<void> => {
    const category = healthDeclarationQuestion.value.map(i => i.category)
    const { healthInsurance, injuryInsurance, lifeInsurance, ...other } = modelRef.value
    const $form: ModifyDetailDto = {
      applyId: $global.handleApplyId('Get'),
      detailDto: {
        hdid: $props.infoData.hdid,
        status: 'Y',
        insuredId: $props.infoData.insuredId,
        healthInsurance: category.includes('healthInsurance') ? healthInsurance : null,
        injuryInsurance: category.includes('injuryInsurance') ? injuryInsurance : null,
        lifeInsurance: category.includes('lifeInsurance') ? lifeInsurance : null,
        ...other,
      },
    }
    return $selfPayEFormApi.modifyHealthDeclarationDetailUsingPOST($form).then(async resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        console.log(respData?.data)
        $emit('closeAndRefreash')
      } else showFormError(resp)
    })
    // .catch(() => {
    //   $modal.error({
    //     title: '錯誤',
    //     content: '系統有誤，請洽系統管理者',
    //   })
    // })
  }

  const beforeSubmitForm = () => {
    let validations = ['height', 'weight', 'certificateOfDisability', 'heigdeclarationOfGuardianht', 'description']
    healthDeclarationQuestion.value.forEach(obj => {
      validations.push(obj.category)
    })
    resetErrors()
    validate(validations)
      .then(() => {
        modifyHealthDeclarationDetail()
      })
      .catch(() => {
        // 驗證失敗 要捲到 輸入框
        const getErrorEle = document.querySelector('.ant-form-item-has-error')
        if (getErrorEle) {
          getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
        }
      })
  }

  const showFormError = (resp: any) => {
    const errorType = $global.getApiErrorType(resp?.data?.errors)
    const getError = JSON.parse(JSON.stringify(resp?.data?.apiError))
    console.log(errorType)
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

  watch(
    modelRef,
    () => {
      validate('description')
    },
    { deep: true },
  )

  return {
    modelRef,
    validateInfos,
    beforeSubmitForm,
    clearValidate,
    resetFields,
  }
}

// 編輯/預覽
function useCommon() {

  // 基本資料
  const basicInfom = computed<BasicInfom>(() => $props.infoData)

  const insuredDiscriptions = ref<DescriptionsData[]>([
    {
      type: 'PLAIN',
      label: '與員工關係',
      key: 'insAttr',
      isRequired: false,
    },
    {
      type: 'PLAIN',
      label: '姓名',
      key: 'name',
      isRequired: false,
    },
    {
      type: 'PLAIN',
      label: '身分證字號/居留證號',
      key: 'idNo',
      isRequired: false,
    },
    {
      type: 'PLAIN',
      label: '性別',
      key: 'sex',
      isRequired: false,
    },
    {
      type: 'PLAIN',
      label: '年齡',
      key: 'age',
      isRequired: false,
    },
    {
      type: 'PLAIN',
      label: '身高(公分)',
      key: 'height',
      isRequired: false,
    },
    {
      type: 'PLAIN',
      label: '體重(公斤)',
      key: 'weight',
      isRequired: false,
    },
  ])

  const healthDeclarationQuestion = ref<HealthDeclarationTopicDto[]>([])

  const trueOrFalseOptions: RadioGroupBorderedProp['options'] = [
    { label: '否', value: 'N' },
    { label: '是', value: 'Y' },
  ]

  // API: 1.2.42.	查詢健康聲明書題目API
  const fetchHealthDeclarationQuestion = (): Promise<void> => {
    const categoryEnum: Enum[] = [
      { key: 'L', value: 'lifeInsurance' },
      { key: 'H', value: 'healthInsurance' },
      { key: 'I', value: 'injuryInsurance' },
    ]
    const caseMainWithPlanDto: CaseMainWithPlanDto = {
      caseMainId: $user.getMe()?.caseMainId,
      insAttr: $giseEnum.getValue('insAttr', basicInfom.value?.insAttr),
      policyPlan: basicInfom.value?.policyPlan,
    }
    return $selfPayEFormApi.getHealthDeclarationQuestionUsingPOST(caseMainWithPlanDto).then(resp => {
      if (resp.data.status === 200) {
        healthDeclarationQuestion.value = resp.data?.data.map(obj => {
          const { category, ...rest } = obj
          return {
            category: categoryEnum.find(el => el.key === category).value,
            ...rest,
          }
        })
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
  }

  // API: 1.2.43.	查詢健康聲明書填寫內容API
  const fetchInsuredData = () => {
    return $selfPayEFormApi.getHealthDeclarationDetailUsingPOST({ hdid: $props.infoData.hdid }).then(resp => {
      if (resp.data.status === 200) {
        const { idNo, ...rest } = resp.data.data
        modelRef.value = JSON.parse(JSON.stringify(rest))
        basicInfom.value.idNo = idNo
      } else {
        $emit('close')
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
  }

  // 將被保險人基本資料整理成前端顯示用的資料格式
  const mapToInsuredDiscriptions = (): void => {
    Object.entries(basicInfom.value).forEach(([key, value]) => {
      const item = insuredDiscriptions.value.find(el => el.key === key)
      if (!item) return
      if (key === 'sex') {
        Object.assign(item, { value: $giseEnum.getLabel('sexEnum', value) })
      } else {
        Object.assign(item, { value })
      }
    })
    // 身高、體重另外處理
    const heightDesc = insuredDiscriptions.value.find(el => el.key === 'height')
    heightDesc.type = $props.isEdit ? 'TEMPLATE' : 'PLAIN'
    heightDesc.template = $props.isEdit && 'height'
    heightDesc.isRequired = $props.isEdit
    heightDesc.value = modelRef.value.height

    const weightDesc = insuredDiscriptions.value.find(el => el.key === 'weight')
    weightDesc.type = $props.isEdit ? 'TEMPLATE' : 'PLAIN'
    weightDesc.template = $props.isEdit && 'weight'
    weightDesc.isRequired = $props.isEdit
    weightDesc.value = modelRef.value.weight
  }

  watch(
    () => $props.isOpenModal,
    async value => {
      if (!value) return
      loadingStore.setLoading(true)
      fetchHealthDeclarationQuestion()
      if ($props.infoData.hdid) await fetchInsuredData()
      mapToInsuredDiscriptions()
      loadingStore.setLoading(false)
    },
    { deep: true, immediate: true },
  )

  return {
    insuredDiscriptions,
    healthDeclarationQuestion,
    trueOrFalseOptions,
  }
}

defineExpose({
  beforeSubmitForm,
  clearValidate,
  resetFields,
})
</script>

<template>
  <a-form layout="vertical" class="healthDelarationForm">
    <div>
      <FormTitle title="被保險人基本資料" />
      <div class="divide-y-[1px] divide-dashed divide-neutral-entry">
        <Descriptions class="descriptionForm lg:mb-3 lg:mt-[-8px]" :column="1" :data="insuredDiscriptions">
          <template #height>
            <a-form-item class="mb-0" v-bind="validateInfos.height">
              <a-input class="max-w-[164px]" v-model:value="modelRef.height" placeholder="e.g. 180" />
            </a-form-item>
          </template>
          <template #weight>
            <a-form-item class="mb-0" v-bind="validateInfos.weight">
              <a-input class="max-w-[164px]" v-model:value="modelRef.weight" placeholder="e.g. 60" />
            </a-form-item>
          </template>
        </Descriptions>
        <a-form-item
          class="pt-4"
          label="被保險人是否領有身心障礙手冊或身心障礙證明?(請勾選，若勾選是者，請提供手冊或證明。)"
          name="certificateOfDisability"
          v-bind="validateInfos.certificateOfDisability"
        >
          <RadioGroupBordered
            :disabled="!$props.isEdit"
            v-model:value="modelRef.certificateOfDisability"
            :options="trueOrFalseOptions"
          />
        </a-form-item>
        <a-form-item
          class="pt-4"
          label="被保險人目前是否受有監護宣告?(請勾選，若勾選是者，請提供相關證明文件。)"
          name="declarationOfGuardian"
          v-bind="validateInfos.declarationOfGuardian"
        >
          <RadioGroupBordered
            :disabled="!$props.isEdit"
            v-model:value="modelRef.declarationOfGuardian"
            :options="trueOrFalseOptions"
          />
        </a-form-item>
      </div>
    </div>
    <div>
      <FormTitle title="團體保險健康聲明書" class="mt-4 lg:mt-8" />
      <div class="divide-y-[1px] divide-dashed divide-neutral-entry text-base lg:text-lg">
        <ul class="mb-4 list-decimal divide-y-[1px] divide-dashed divide-neutral-entry">
          <!-- API: -->
          <div v-for="(quesItem, index) in healthDeclarationQuestion" :key="index" class="relative">
            <span v-html="quesItem.context"></span>
            <span
              v-if="quesItem.category === 'lifeInsurance'"
              class="absolute bottom-[calc(40px+0.5rem)] right-[calc(100%-21rem)] flex items-end lg:right-[calc(100%-23rem)]"
            >
              <a-form-item class="mx-1 mb-0 inline-block" v-bind="validateInfos.lifeMemo">
                <a-input-number
                  :disabled="!$props.isEdit"
                  class="max-w-[62px]"
                  v-model:value="modelRef.lifeMemo"
                  :min="1"
                  :max="99"
                  placeholder="e.g. 5" /></a-form-item
              >週
            </span>
            <!-- 是非題 -->
            <a-form-item class="my-2" :name="quesItem.category" v-bind="validateInfos[quesItem.category]">
              <RadioGroupBordered
                :disabled="!$props.isEdit"
                v-model:value="modelRef[quesItem.category]"
                :options="trueOrFalseOptions"
              />
            </a-form-item>
          </div>
        </ul>
        <div class="pt-4">
          <span class="text-base font-semibold lg:text-lg">
            <span class="font-semibold text-danger">上列問題中，若「是」，請註明</span
            >問題號碼、病名、罹病時間、治療情形、醫院名稱及目前狀況於下： </span
          ><span class="text-sm">(限200字以內)</span>
          <a-form-item class="my-2" name="description" v-bind="validateInfos.description">
            <a-textarea
              :disabled="!$props.isEdit"
              v-model:value="modelRef.description"
              placeholder="請輸入"
              :autoSize="{ minRows: 1, maxRows: 6 }"
              allow-clear
              :maxlength="210"
            />
          </a-form-item>
        </div>
        <div class="pt-2 text-sm font-semibold text-danger lg:text-base">
          被保險人就上列告知事項應詳實告知，並應親自填寫，如違反誠實告知影響危險評估，依保險法第 64 條及第 25
          條之規定，本公司得解除契約且 無須退還所交之保費，保險事故發生後亦同，請特別注意。
        </div>
      </div>
    </div>
  </a-form>
</template>

<style scoped></style>
