<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import { useLoadingStore } from '@/stores'
import { Form } from 'ant-design-vue'
import type { Rule, RuleObject } from 'ant-design-vue/es/form'
import type { SelectProps, RadioGroupProps } from 'ant-design-vue'
import { usePostalCode } from '@/composables/usePostalCode'
import type { RespOption } from '@pages/applys/InsuredData.vue'
import type { GetIdInfoDto } from '@fubonlife/gise-api-axios-sdk'
import type { BeneficiaryType } from '@components/shared/forms/InsuredForm.vue'

interface BeneficiaryFormProp {
  isOpen: boolean
  isEdit: boolean
  editData: BeneficiaryType
  respOpts?: RespOption
  editIdx?: number
  beneficiaryList?: {
    id?: string
    bnfOrder?: string
    name?: string
    idNo?: string
    isLegalHeir?: string
    birthDate?: any
    nationality?: string
    insAttr?: string
    proportionNum?: string
    proportionDen?: string
    mobileNo?: string
    contactAddress?: string
    postalCode?: string
  }[]
}

interface FormType {
  bnfOrder: string
  bentype: string
  name: string
  idNo: string
  isLegalHeir?: string
  birthDate: any
  nationality: string
  relation: string
  proportionNum: string
  proportionDen: string
  mobileNo: string
  contactAddress: string
  postalCode: string
  town: string
  district: string
}

interface ErrorInfoType {
  idNo: string
  contactAddress: string
  mobileNo: string
}

const $props = withDefaults(defineProps<BeneficiaryFormProp>(), {
  isEdit: false,
})

const loadingStore = useLoadingStore()
const {
  proxy: { $giseEnum, $validateUtil, $user, $global, $commonApi, $dateTimeUtil, $modal },
} = getCurrentInstance()

const { modelRef, handleBeforeSubmit, validateInfos, isLEGDDisabledCol, fetchGetIdInfo } = useBnfForm()
const {
  nationalityOpts,
  relationOpts,
  bnfOrderOpts,
  bentypeOpts,
  town,
  townOpts,
  district,
  districtOpts,
  generateTown,
} = useOptios()

const isOpen = ref(false)
const bnfData = ref(null)

const $emit = defineEmits(['closeBnfModal', 'updateBnfItem', 'addBnfItem'])

watch(
  () => $props.isOpen,
  value => {
    if (value) {
      isOpen.value = value
      bnfData.value = $global.deepCopyData($props.editData)
      generateTown()
      if (!bnfData.value) return
      const { birthDate, road, ...rest } = bnfData.value
      modelRef.value = {
        birthDate: $dateTimeUtil.dateStringAddSlashAndToAD(birthDate),
        ...rest,
      }
      modelRef.value.contactAddress = road
      modelRef.value.isLegalHeir === 'Y' ? (modelRef.value.bentype = 'LEG') : (modelRef.value.bentype = 'NON')
      district.value = modelRef.value.postalCode

      console.log(bnfData.value)
    }
  },
  { deep: true, immediate: true },
)

const handleCancel = () => {
  $emit('closeBnfModal')
}

const handleOk = () => {
  if ($props.isEdit) {
    $emit('updateBnfItem', { data: modelRef.value, index: $props.editIdx })
  } else {
    $emit('addBnfItem', modelRef.value)
  }
}

// 表單驗證相關
function useBnfForm() {
  const modelRef = ref<FormType>({
    bnfOrder: null,
    bentype: 'NON',
    name: null,
    idNo: null,
    isLegalHeir: 'N',
    birthDate: null,
    nationality: null,
    relation: null,
    proportionNum: null,
    proportionDen: null,
    mobileNo: null,
    contactAddress: null,
    postalCode: null,
    town: null,
    district: null,
  })

  const isLEGDDisabledCol = ref<boolean>(false)

  const errorInfos = ref<ErrorInfoType>({
    idNo: null,
    contactAddress: null,
    mobileNo: null,
  })

  const validateIdNo = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.bentype !== 'LEG') return Promise.reject('身分證字號/居留證號')
    if (value && !/^[A-Za-z0-9]{8,10}$/.test(value)) return Promise.reject('請輸入完整之身分證字號/居留證號')
    if (errorInfos.value && errorInfos.value.idNo) return Promise.reject(errorInfos.value.idNo)
    return Promise.resolve()
  }

  const validateMobileNo = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.bentype !== 'LEG') return Promise.reject('請輸入行動電話')
    if (value && !$validateUtil.pattern.phoneNumber().test(value)) return Promise.reject('手機號碼格式不符')
    if (errorInfos.value && errorInfos.value.mobileNo) return Promise.reject(errorInfos.value.mobileNo)
    return Promise.resolve()
  }

  const validateContactAddress = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.bentype !== 'LEG') return Promise.reject('請輸入通訊地址')
    if (errorInfos.value && errorInfos.value.contactAddress) return Promise.reject(errorInfos.value.contactAddress)
    return Promise.resolve()
  }

  const validateBirthDate = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.bentype !== 'LEG') return Promise.reject('請選擇生日')
    return Promise.resolve()
  }

  const validateNationality = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.bentype !== 'LEG') return Promise.reject('請選擇國籍')
    return Promise.resolve()
  }

  const validateRelation = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.bentype !== 'LEG') return Promise.reject('請選擇與被保險人關係')
    return Promise.resolve()
  }

  const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
    bnfOrder: [{ required: true, message: '請選擇順位' }],
    name: [{ required: true, message: '請輸入受益人姓名' }],
    idNo: [{ required: true, validator: validateIdNo }],
    birthDate: [{ required: true, validator: validateBirthDate }],
    nationality: [{ required: true, validator: validateNationality }],
    relation: [{ required: true, validator: validateRelation }],
    proportionNum: [{ required: true, message: '請選擇比例' }],
    proportionDen: [{ required: true, message: '請選擇比例' }],
    mobileNo: [{ required: true, validator: validateMobileNo }],
    contactAddress: [{ required: true, validator: validateContactAddress }],
  })

  const { validate, validateInfos, clearValidate } = Form.useForm(modelRef, formRules)

  const handleBeforeSubmit = async () => {
    await validate()
      .then(() => {
        console.log(modelRef.value)
        handleOk()
      })
      .catch(err => {
        console.log('error', err)
      })
  }

  watch(
    () => modelRef.value.bentype,
    value => {
      // 若選法定繼承人，則下方資料直接帶入。
      // 受益人姓名：法定繼承人
      // 順位：依傳入之順位
      // 比例(分母)：1
      // 比例(分子)：1
      // 受益人類別：11
      // 判斷除了順位、比例(分子)、比例(分母)、受益人類別以外，其他欄位資料均DISABLE不需填寫
      if (value && value === 'LEG') {
        modelRef.value.name = '法定繼承人'
        modelRef.value.idNo = null
        modelRef.value.isLegalHeir = 'Y'
        modelRef.value.birthDate = null
        modelRef.value.nationality = null
        modelRef.value.relation = null
        modelRef.value.mobileNo = null
        modelRef.value.contactAddress = null
        modelRef.value.postalCode = null
        town.value = null
        district.value = null
        isLEGDDisabledCol.value = true
        modelRef.value.proportionNum = '1'
        modelRef.value.proportionDen = '1'
      } else {
        isLEGDDisabledCol.value = false
        modelRef.value.isLegalHeir = 'N'
      }
      clearValidate()
    },
    { deep: true },
  )

  // 比對身分證(idNo)在外層的受益人清單中是否有相同的，如果有相同的，回傳錯誤訊息「此受益人已在清單中，請確認」。
  const isIdNoExsit = (): boolean => {
    const target: any = $props.beneficiaryList.find((e: any) => e.idNo === modelRef.value.idNo)
    if (!$props.isEdit) {
      return target ? true : false
    } else {
      return target && target.idNo !== $props.editData.idNo ? true : false
    }
  }

  // 身分證連動被保險人資訊API
  // 1.若category 為"I"(被保險人資訊身分證查詢)
  // 2.若category 為"B"(受益人資訊身分證查詢)
  // 3.若category 為"L"(法定代理人)
  const fetchGetIdInfo = (category: 'I' | 'B' | 'L') => {
    if (modelRef.value.idNo.length !== 10) return
    if (isIdNoExsit()) {
      $modal.error({
        title: '錯誤',
        content: '此受益人已在清單中，請確認',
      })
      modelRef.value.idNo = ''
      return
    }
    loadingStore.setLoading(true)
    const requestData: GetIdInfoDto = {
      applyId: $global.handleApplyId('Get'),
      caseMainId: $user.getMe()?.caseMainId,
      category: category,
      crtNo: $user.getMe()?.crtNo,
      empCrtNo: $user.getMe()?.empCrtNo,
      empPolicyNo: $user.getMe()?.empPolicyNo,
      empPolicySeq: $user.getMe()?.empPolicySeq,
      idNo: modelRef.value.idNo,
      policyNo: $user.getMe()?.policyNo,
      policySeq: $user.getMe()?.policySeq,
    }
    $commonApi
      .getIdInfoUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          if (resp.data.data.haveInfo) {
            const { name, birthDate, nationality } = resp.data.data.infoDetail
            modelRef.value.name = name
            modelRef.value.birthDate = $dateTimeUtil.dateStringAddSlashAndToAD(birthDate)
            modelRef.value.nationality = nationality
            $modal.info({
              title: '提醒',
              content: `此為 ${name} 之身分證字號，請確認資料是否正確`,
            })
          }
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(resp.data.apiError),
          })
        }
      })
      // .catch(() => {
      // $modal.error({
      //   title: '錯誤',
      //   content: '系統有誤，請洽系統管理者',
      // })
      // })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  return {
    modelRef,
    handleBeforeSubmit,
    validateInfos,
    isLEGDDisabledCol,
    fetchGetIdInfo,
  }
}

// 取得下拉選單
function useOptios() {
  const { town, townOpts, district, districtOpts, generateTown } = usePostalCode()
  // 順位
  const bnfOrderOpts: SelectProps['options'] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ]
  // 受益人類別
  // 須卡控僅能新增一個法定繼承人
  const bentypeOpts: RadioGroupProps['options'] =
    $props?.editData?.isLegalHeir !== 'Y' && $props.beneficiaryList.map(i => i.isLegalHeir).includes('Y')
      ? $giseEnum.beneficiaryCategory.map(el => ({ ...el, disabled: !!(el.label === '法定繼承人') }))
      : $giseEnum.beneficiaryCategory
  // 非同步取得下拉選單(國籍、關係清單)
  const { nationalityOpts, relationOpts } = $props.respOpts

  watch(
    () => town.value,
    value => {
      if (value) {
        modelRef.value.town = value
      }
    },
    { deep: true },
  )

  watch(
    () => district.value,
    value => {
      if (value) {
        modelRef.value.district = value
        modelRef.value.postalCode = value
      }
    },
    { deep: true },
  )

  return {
    nationalityOpts,
    relationOpts,
    bnfOrderOpts,
    bentypeOpts,
    town,
    townOpts,
    district,
    districtOpts,
    generateTown,
  }
}
</script>

<template>
  <ModalMain
    v-model:visible="isOpen"
    :title="'新增/修改指定受益人'"
    width="824px"
    :after-close="handleCancel"
    :maskClosable="false"
  >
    <template #content>
      <!-- 受益人表單 -->
      <a-form layout="vertical">
        <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
          <a-form-item label="順位" name="bnfOrder" v-bind="validateInfos.bnfOrder">
            <SelectSearch
              v-model:value="modelRef.bnfOrder"
              style="width: 30%"
              placeholder="請選擇順位"
              :options="bnfOrderOpts"
            />
          </a-form-item>
          <a-form-item label="受益人類別" name="bentype">
            <a-radio-group v-model:value="modelRef.bentype" name="bentypeRadioGroup" :options="bentypeOpts" />
          </a-form-item>
        </div>
        <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
          <a-form-item label="身分證字號/居留證號" name="idNo" v-bind="validateInfos.idNo">
            <a-input
              @blur="fetchGetIdInfo('B')"
              v-model:value="modelRef.idNo"
              :disabled="isLEGDDisabledCol"
              :placeholder="isLEGDDisabledCol ? null : 'e.g. A123456789'"
            />
          </a-form-item>
          <a-form-item label="受益人姓名" name="name" v-bind="validateInfos.name">
            <a-input v-model:value="modelRef.name" :disabled="isLEGDDisabledCol" placeholder="e.g. 王小明" />
          </a-form-item>
        </div>
        <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
          <a-form-item label="生日" name="birthDate" v-bind="validateInfos.birthDate">
            <date-picker
              class="w-100"
              :disabled="isLEGDDisabledCol"
              v-model:value="modelRef.birthDate"
              format="YYYY/MM/DD"
              :placeholder="isLEGDDisabledCol ? null : '請選擇 日期'"
            />
          </a-form-item>
          <a-form-item label="國籍" name="nationality" v-bind="validateInfos.nationality">
            <SelectSearch
              v-model:value="modelRef.nationality"
              style="width: 100%"
              :placeholder="isLEGDDisabledCol ? null : '請選擇國籍'"
              :options="nationalityOpts"
              :disabled="isLEGDDisabledCol"
            />
          </a-form-item>
        </div>
        <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
          <a-form-item label="與被保險人關係" name="relation" v-bind="validateInfos.relation">
            <SelectSearch
              v-model:value="modelRef.relation"
              style="width: 100%"
              :placeholder="isLEGDDisabledCol ? null : '請選擇與被保險人關係'"
              :options="relationOpts"
              :disabled="isLEGDDisabledCol"
            />
          </a-form-item>
          <a-form-item label="比例" name="proportionNum" v-bind="validateInfos.proportionNum">
            <div class="flex items-center">
              <a-input
                class="w-[125px]"
                v-model:value="modelRef.proportionNum"
                placeholder="請輸入分子"
                allowClear
                :disabled="isLEGDDisabledCol"
              />
              <p class="mx-2 text-[20px]">/</p>
              <a-input
                class="w-[125px]"
                v-model:value="modelRef.proportionDen"
                placeholder="請輸入分母"
                allowClear
                :disabled="isLEGDDisabledCol"
              />
            </div>
          </a-form-item>
        </div>
        <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
          <a-form-item label="行動電話" v-bind="validateInfos.mobileNo">
            <a-input
              v-model:value="modelRef.mobileNo"
              :disabled="isLEGDDisabledCol"
              :placeholder="isLEGDDisabledCol ? null : 'e.g. 0912345678'"
              allowClear
            />
          </a-form-item>
        </div>
        <a-form-item class="w-[100%]" v-bind="validateInfos.contactAddress" label="通訊地址">
          <div class="grid grid-cols-2 gap-x-4 md:col-span-4 md:grid-cols-4 lg:flex">
            <div class="md:basis-[165px]">
              <SelectSearch
                v-model:value="town"
                :disabled="isLEGDDisabledCol"
                :options="townOpts"
                :placeholder="isLEGDDisabledCol ? null : '請選擇縣市'"
                class="h-[43px]"
                allowClear
              />
            </div>
            <div class="md:basis-[165px]">
              <SelectSearch
                v-model:value="district"
                :options="districtOpts"
                :placeholder="isLEGDDisabledCol ? null : '請選擇鄉鎮市區'"
                :disabled="isLEGDDisabledCol"
                class="h-[43px]"
                allowClear
              />
            </div>
            <div class="col-span-2 mt-3 md:mt-0 md:flex-1">
              <a-input
                v-model:value="modelRef.contactAddress"
                :disabled="isLEGDDisabledCol"
                :placeholder="isLEGDDisabledCol ? null : 'e.g. 敦化南路1段108號'"
                allowClear
              />
            </div>
          </div>
        </a-form-item>
      </a-form>
    </template>
    <template #footer>
      <div class="mb-4 flex justify-center md:mb-0">
        <ButtonRoundedSecondary @click="handleCancel">取消</ButtonRoundedSecondary>
        <ButtonRoundedPrimary class="ml-[15px] md:ml-[16px] lg:ml-[32px]" @click="handleBeforeSubmit">
          確定
        </ButtonRoundedPrimary>
      </div>
    </template>
  </ModalMain>
</template>
