<script setup lang="ts">
import { getCurrentInstance, ref, watch, onMounted } from 'vue'
import { Form } from 'ant-design-vue'
import editSvg from '@/assets/imgs/button_edit.svg?url'
import deleteSvg from '@assets/imgs/button_delete.svg?url'
import type { RadioGroupProps } from 'ant-design-vue'
import type { Rule, RuleObject } from 'ant-design-vue/es/form'
import { useUpload } from '@/composables/useUpload'
import { useLoadingStore } from '@/stores'
import type { FileUploadConfig } from '@/composables/useUpload'
import { useDownloadFile } from '@/composables/useDownloadFile'
import type {
  CaseMainIdDto,
  InsPlanDto,
  InsAttributesDto,
  GetIdInfoDto,
  ModifyInsureDto,
  CheckModifyInsureDto,
  FileInfoDto,
  CaseMainIdAndVersionDto,
} from '@fubonlife/gise-api-axios-sdk'
import type { RespOption } from '@pages/applys/InsuredData.vue'
import moment from 'moment'
import { usePostalCode } from '@/composables/usePostalCode'
import { usePolicyplan } from '@/composables/usePolicyplan'
import type { InsuredPageQuery } from '@/pages/applys/InsuredData.vue'
import type { UploadFile } from 'ant-design-vue'

interface InsuredFormProp {
  isEdit?: boolean
  editData?: InsuredModalData
  respOpts?: RespOption
  modalOpen?: boolean
}

interface FormType {
  insAttr?: string
  name?: string
  engName?: string
  idNo?: string
  birthDate?: any
  sex?: string
  nationality?: string
  policyPlan?: string
  accMedIns?: string
  medIns?: string
  benType?: string
  fileInfo?: FileInfoDto[]
  legalRepresentative?: {
    name?: string
    idNo?: string
    birthDate?: any
    nationality?: string
    relation?: string
    rpsId?: string
    sex?: string
  }
}

interface InsuredModalData extends FormType {
  action?: string
  beneficiaryList?: {
    id?: string
    bnfOrder?: string
    name?: string
    idNo?: string
    birthDate?: any
    nationality?: string
    insAttr?: string
    proportionNum?: string
    proportionDen?: string
    mobileNo?: string
    contactAddress?: string
    postalCode?: string
  }[]
  insuredId?: string
  jnDate?: string
  crtSeq?: string
}

export interface BeneficiaryType {
  bnfOrder: string
  bentype?: string
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
  bnfId?: string
  road?: string
}

interface CautionContentType {
  MEDICAL_ORIGINAL: string // 是否已投保其他商業實支實付型傷害醫療保險
  HOSPITAL_ORIGINAL: string //是否已投保其他商業實支實付型醫療保險
  BENEFICIARY_DROPDOWN: string // 身故保險金受益人說明
}

interface ErrorInfoType {
  idNo: string
  legalRepresentative: {
    idNo: string
  }
}

interface FileListType extends UploadFile, FileInfoDto {}

const $props = withDefaults(defineProps<InsuredFormProp>(), {
  isEdit: false,
})

const isPlanPDFVisiable = ref<boolean>(false)
const planPDFFileDetail = ref<CaseMainIdAndVersionDto>(null)

const editData = ref<InsuredModalData>(null) // 被保險人資料
const beneficiaryEditData = ref<BeneficiaryType>(null) // 受益人資料
const beneficiaryEditIdx = ref<number>(null) // 受益人序號
const isShowBeneficiary = ref<boolean>(false)
const $emit = defineEmits(['handleCancel', 'handleHeader'])
const {
  proxy: { $global, $giseEnum, $modal, $selfPayEFormApi, $commonApi, $user, $dateTimeUtil },
} = getCurrentInstance()
const loadingStore = useLoadingStore()
// 說明內容
const cautionContent = ref<CautionContentType>({
  MEDICAL_ORIGINAL: '',
  HOSPITAL_ORIGINAL: '',
  BENEFICIARY_DROPDOWN: '',
})
const { policyplanOpts, fetchPolicyplan } = usePolicyplan()
const { nationalityOpts, trueOrFalseOpts, sexOpts, insAttrOpts, relationOpts } = useOptios()
const {
  hasLegalRepresentative,
  isShowAccMedInsQ,
  isShowMedInsQ,
  modelRef,
  fileUploadConfig,
  validateInfos,
  insPlanList,
  fetchGetIdInfo,
  isColReadOnly,
  handleOk,
  handleCancel,
  fetchCaseInsuredSetting,
  checkBenType,
  openPlanDetailModal,
} = useInsuredAndRpsForm()
const {
  bnfFormGridData,
  handleEditBnf,
  handleDeleteBnf,
  createBnfItem,
  editBnfItem,
  addBnfItem,
  beneficiaryModalOpen,
  closeBnfModal,
} = useBenficiaryTable()
const uploadedFileList = ref<FileListType[]>([])
const { uploadFlie, beforeUpload, handleChange, deleteFile } = useUpload(fileUploadConfig, uploadedFileList)
const { downloadFile } = useDownloadFile()
const { getPostalAddress } = usePostalCode()

watch(
  () => $props.modalOpen,
  async value => {
    if (value) {
      loadingStore.setLoading(true)
      await fetchCaseInsuredSetting()
      loadingStore.setLoading(false)
      // 篩選「與員工關係」的選項
      insAttrOpts.value = $giseEnum.insAttr.filter(el => insPlanList.value.map(i => i.attr).includes(el.value))
      editData.value = $global.deepCopyData($props.editData)
      if (!editData.value) return
      const { beneficiaryList, legalRepresentative, fileInfo, ...rest } = editData.value
      modelRef.value = rest
      if (fileInfo) {
        uploadedFileList.value = fileInfo.map(e => ({
          uid: e?.fileId,
          name: `${e?.originalFileName}`,
          fileExtension: e?.fileExtension,
        }))
      }
      if (!legalRepresentative) {
        modelRef.value.legalRepresentative = {
          idNo: '',
          birthDate: '',
          nationality: '',
          relation: '',
          name: '',
        }
      } else {
        const { birthDate, ...rest } = legalRepresentative
        modelRef.value.legalRepresentative = rest
        modelRef.value.legalRepresentative.birthDate = $dateTimeUtil.dateStringAddSlashAndToAD(birthDate)
      }
      //
      if (beneficiaryList) {
        bnfFormGridData.value.data = beneficiaryList
          .map(({ birthDate, postalCode, contactAddress, ...rest }) => ({
            birthDate: $dateTimeUtil.dateStringAddSlash(birthDate),
            contactAddress: `${postalCode} ${getPostalAddress(postalCode)}${contactAddress ? contactAddress : ''}`,
            road: contactAddress,
            postalCode: postalCode,
            ...rest,
          }))
          .sort((a, b) => parseInt(a.bnfOrder) - parseInt(b.bnfOrder))
      }
      // bnfFormGridData.value.data = beneficiaryList
    }
    editData.value = null
  },
  { deep: true, immediate: true },
)

// 被保險人及法定代理人表單
function useInsuredAndRpsForm() {
  const hasLegalRepresentative = ref<boolean>(false)

  const isShowAccMedInsQ = ref<boolean>(false)

  const isShowMedInsQ = ref<boolean>(false)

  const insPlanList = ref<InsPlanDto[]>([])

  const empBeneficiaryType = ref<string>(null)

  const depBeneficiaryType = ref<string>(null)

  const isColReadOnly = ref<boolean>(false) // 用於判斷若新增被保險人時，選員工本人[身分證字號、被保險人姓名、生日、性別]唯讀

  const modelRef = ref<InsuredModalData>({
    insAttr: '',
    name: '',
    idNo: '',
    birthDate: null,
    sex: '',
    nationality: null,
    policyPlan: null,
    accMedIns: '',
    medIns: '',
    benType: '',
    fileInfo: [],
    legalRepresentative: {
      name: '',
      idNo: '',
      birthDate: '',
      nationality: '',
      relation: '',
    },
    beneficiaryList: [],
  })

  const errorInfos = ref<ErrorInfoType>({
    idNo: null,
    legalRepresentative: {
      idNo: null,
    },
  })

  // 附件 - 身分證明
  const fileUploadConfig = ref<FileUploadConfig>({
    uploadDisabled: false,
    multiple: true,
    showDownload: true,
    acceptFileType: 'image/jpeg,.pdf,.doc,.tif,.docx',
    acceptType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    acceptFileSize: 5, // 可上傳的檔案大小(MB)
    maxNumber: 3,
    showRemoveIcon: true,
  })

  const validateInsattr = async (_rule: Rule, value: string) => {
    if (!$props.isEdit && !value) return Promise.reject('請選擇與員工關係')
    return Promise.resolve()
  }

  const validateIdNo = async (_rule: Rule, value: string) => {
    if (!value) return Promise.reject('身分證字號/居留證號')
    if (!/^[A-Za-z0-9]{8,10}$/.test(value)) return Promise.reject('請輸入完整之身分證字號/居留證號')
    if (errorInfos.value && errorInfos.value.idNo) return Promise.reject(errorInfos.value.idNo)
    return Promise.resolve()
  }

  const validateMedIns = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.insAttr === '1') return Promise.reject('請填答')
    return Promise.resolve()
  }

  const validateAccMedIns = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.insAttr === '1') return Promise.reject('請填答')
    return Promise.resolve()
  }

  const validateLIdNo = async (_rule: Rule, value: string) => {
    if (!value) return Promise.reject('身分證字號/居留證號')
    if (!/^[A-Za-z0-9]{8,10}$/.test(value)) return Promise.reject('請輸入完整之身分證字號/居留證號')
    if (errorInfos.value && errorInfos.value.legalRepresentative.idNo)
      return Promise.reject(errorInfos.value.legalRepresentative.idNo)
    return Promise.resolve()
  }

  const validateEngName = async (_rule: Rule, value: string) => {
    if (!value && modelRef.value.nationality !== '001') return Promise.reject('若國籍非台灣, 則此欄位為必填')
    return Promise.resolve()
  }

  const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
    insAttr: [{ validator: validateInsattr, trigger: 'blur' }],
    idNo: [{ validator: validateIdNo }],
    name: [{ required: true, message: '請輸入姓名' }],
    engName: [{ validator: validateEngName }],
    birthDate: [{ required: true, message: '請選擇生日' }],
    sex: [{ required: true, message: '請選擇性別' }],
    nationality: [{ required: true, message: '請選擇國籍' }],
    policyPlan: [{ required: true, message: '請選擇保險計劃' }],
    accMedIns: [{ validator: validateAccMedIns }],
    medIns: [{ validator: validateMedIns }],
    relation: [{ required: true, message: '請選擇與被保險人關係' }],
    'legalRepresentative.idNo': [{ validator: validateLIdNo }],
    'legalRepresentative.name': [{ required: true, message: '請輸入姓名' }],
    'legalRepresentative.birthDate': [{ required: true, message: '請選擇生日' }],
    'legalRepresentative.nationality': [{ required: true, message: '請選擇國籍' }],
    'legalRepresentative.relation': [{ required: true, message: '請選擇與被保險人關係' }],
  })

  const { validate, validateInfos, resetFields, clearValidate } = Form.useForm(modelRef, formRules)

  // API: 查詢被保險人自費案設定API
  const fetchCaseInsuredSetting = async () => {
    // TEST:
    const $input: CaseMainIdDto = { caseMainId: $user.getMe()?.caseMainId }
    await $selfPayEFormApi.getCaseInsuredSettingsUsingPOST($input).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        insPlanList.value = respData?.data?.insPlanList
        depBeneficiaryType.value = respData?.data?.depBeneficiaryType
        empBeneficiaryType.value = respData?.data?.empBeneficiaryType
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
    //     content: $global.getApiErrorMsg(resp?.data?.apiError),
    //   })
    // })
  }

  // API: 1.2.38 確認投保關係API
  const fetchCheckAttributes = (empIdNo: string, insAttr: string) => {
    const $input: InsAttributesDto = {
      applyId: $global.handleApplyId('Get'),
      caseMainId: $user.getMe()?.caseMainId,
      idNo: empIdNo,
      insAttr,
      policyNo: $user.getMe()?.policyNo,
      policySeq: $user.getMe()?.policySeq,
    }
    $selfPayEFormApi.checkAttributesUsingPOST($input).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        if (respData.data?.pass) return
        //若回傳的pass=false則將message的錯誤訊息顯示，按下確定後重置表單內容
        $modal.error({
          title: '錯誤',
          content: respData.data?.message,
          onOk: () => {
            resetFields()
            isColReadOnly.value = false
          },
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
    // })
  }

  // 身分證連動被保險人資訊API
  // 1.若category 為"I"(被保險人資訊身分證查詢)
  // 2.若category 為"B"(受益人資訊身分證查詢)
  // 3.若category 為"L"(法定代理人
  const fetchGetIdInfo = (category: 'I' | 'B' | 'L') => {
    let model
    switch (category) {
      case 'I':
        model = modelRef.value
        break
      case 'L':
        model = modelRef.value?.legalRepresentative
        break

      default:
        break
    }
    if (model?.idNo?.length !== 10) return
    loadingStore.setLoading(true)
    const requestData: GetIdInfoDto = {
      applyId: $global.handleApplyId('Get'),
      caseMainId: $user.getMe()?.caseMainId,
      category: category,
      crtNo: $user.getMe()?.crtNo,
      empCrtNo: $user.getMe()?.empCrtNo,
      empPolicyNo: $user.getMe()?.empPolicyNo,
      empPolicySeq: $user.getMe()?.empPolicySeq,
      idNo: model?.idNo,
      policyNo: $user.getMe()?.policyNo,
      policySeq: $user.getMe()?.policySeq,
    }
    $commonApi
      .getIdInfoUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          if (resp.data.data?.haveInfo) {
            const { name, birthDate, sex, nationality } = resp.data.data.infoDetail
            model.name = name
            model.sex = sex
            model.birthDate = $dateTimeUtil.dateStringAddSlashAndToAD(birthDate)
            model.nationality = nationality
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
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      // })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  // 1.2.57.	取得填答注意事項API
  const fetchGetFillInCaution = (gpCode: string, groupId: string): Promise<void> => {
    return $selfPayEFormApi.getFillInCautionUsingPOST(gpCode, groupId).then(resp => {
      if (resp.data.status === 200) {
        cautionContent.value[gpCode] = resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp.data.apiError),
        })
      }
    })
    // .catch(() => {
    //   $modal.error({
    //     title: '錯誤',
    //     content: '系統有誤，請洽系統管理者',
    //   })
    // })
  }

  onMounted(() => {
    loadingStore.setLoading(true)
    Promise.all([
      fetchGetFillInCaution('MEDICAL_ORIGINAL', 'EMP_FILL_IN_CAUTION'),
      fetchGetFillInCaution('HOSPITAL_ORIGINAL', 'EMP_FILL_IN_CAUTION'),
      fetchGetFillInCaution('BENEFICIARY_DROPDOWN', 'EMP_FILL_IN_CAUTION'),
    ]).finally(() => loadingStore.setLoading(false))
  })

  const checkBenType = () => {
    modelRef.value.insAttr === '1'
      ? (modelRef.value.benType = empBeneficiaryType.value)
      : (modelRef.value.benType = depBeneficiaryType.value)
  }

  watch(
    () => modelRef.value.insAttr,
    value => {
      const $userInfo: InsuredPageQuery = $global.getQuery<any>()
      if (value) {
        fetchPolicyplan(value)
        if (!$props.isEdit) {
          fetchCheckAttributes($userInfo.idNo, value)
          if (value === '1') {
            // 若新增被保險人時，選員工本人，則直接將前一頁資訊的員工之資料帶入對應之欄位。並且將以下欄位唯讀：
            // 身分證字號、被保險人姓名、生日、性別
            modelRef.value.idNo = $userInfo?.idNo
            modelRef.value.name = $userInfo?.name
            modelRef.value.birthDate = $dateTimeUtil.dateStringAddSlashAndToAD($userInfo?.birthDate)
            modelRef.value.sex = $userInfo?.idNo ? $userInfo?.idNo.substring(1, 2) : '' // 先用身分證判斷
            isColReadOnly.value = true
          }
        }
      }
      if (value && modelRef.value.policyPlan) {
        const plan = insPlanList.value.find(i => i.attr === value && i.policyPlan === modelRef.value.policyPlan)
        isShowAccMedInsQ.value = !!(plan?.medicalOriginal === 'Y')
        isShowMedInsQ.value = !!(plan?.hospitalOriginal === 'Y')
      }
      if (value && modelRef.value.benType === 'DES' && modelRef.value.policyPlan) {
        const plan = insPlanList.value.find(i => i.attr === value && i.policyPlan === modelRef.value.policyPlan)
        isShowBeneficiary.value = plan?.healthDeclar !== '1' && plan?.healthDeclar !== '4'
      } else {
        isShowBeneficiary.value = false
      }
    },
    { deep: true, immediate: true },
  )

  watch(
    () => modelRef.value.birthDate,
    value => {
      // 若換算為18歲以下需顯示法定代理人區塊
      const age = moment().diff(moment(value, 'YYYYMMDD'), 'years')
      console.log(age)
      if (value && age < 18) {
        hasLegalRepresentative.value = true
      } else {
        hasLegalRepresentative.value = false
        modelRef.value.legalRepresentative = {
          name: '',
          idNo: '',
          birthDate: '',
          nationality: '',
          relation: '',
        }
      }
    },
    { deep: true, immediate: true },
  )

  watch(
    () => modelRef.value.policyPlan,
    value => {
      if (value && modelRef.value.insAttr) {
        const plan = insPlanList.value.find(i => i.policyPlan === value && i.attr === modelRef.value.insAttr)
        isShowAccMedInsQ.value = !!(plan?.medicalOriginal === 'Y')
        isShowMedInsQ.value = !!(plan?.hospitalOriginal === 'Y')
      }
      if (value && modelRef.value.benType === 'DES' && modelRef.value.insAttr) {
        const plan = insPlanList.value.find(i => i.policyPlan === value && i.attr === modelRef.value.insAttr)
        isShowBeneficiary.value = plan?.healthDeclar !== '1' && plan?.healthDeclar !== '4'
      } else {
        isShowBeneficiary.value = false
      }
    },
    { deep: true, immediate: true },
  )

  const legalRepresentativeHasVals = (data): boolean => {
    if (!data) return false
    let bool = false
    Object.values(data).forEach((e: any) => {
      if (e && e.length !== 0) bool = true
    })
    return bool
  }

  // 整理後端所需格式
  const mapData = (data: InsuredModalData, bnfData: BeneficiaryType[]): CheckModifyInsureDto => {
    const requestData: CheckModifyInsureDto = {
      action: $props.isEdit ? 'M' : 'C',
      applyId: $global.handleApplyId('Get'),
      caseMainId: $user.getMe()?.caseMainId,
      insuredInfoModel: {
        accMedIns: data?.accMedIns,
        action: $props.isEdit ? 'M' : 'C',
        benType: data?.benType,
        beneficiaryList: bnfData.map(el => ({
          birthDate: $dateTimeUtil.dateStringRemoveSlash(el?.birthDate),
          bnfId: el?.bnfId,
          bnfOrder: el?.bnfOrder,
          contactAddress: el?.road,
          idNo: el?.idNo,
          isLegalHeir: el?.isLegalHeir,
          mobileNo: el?.mobileNo,
          name: el?.name,
          nationality: el?.nationality,
          postalCode: el?.contactAddress && el?.contactAddress.substring(0, 3),
          proportionDen: el?.proportionDen,
          proportionNum: el?.proportionNum,
          relation: el?.relation,
        })),
        birthDate: $dateTimeUtil.dateToRocDateWithoutSlashString(data?.birthDate),
        crtSeq: parseInt(data?.crtSeq),
        fileInfo: uploadedFileList.value
          ? uploadedFileList.value.map(e => ({
              fileId: e.uid,
              originalFileName: e.fileExtension ? e.name : e.name?.substring(0, e.name?.lastIndexOf('.')),
              fileExtension: e.fileExtension ? e.fileExtension : e.name?.substring(e.name?.lastIndexOf('.') + 1),
            }))
          : null,
        idNo: data?.idNo,
        insAttr: data?.insAttr,
        insuredId: data?.insuredId,
        jnDate: data?.jnDate,
        legalRepresentative: legalRepresentativeHasVals(data?.legalRepresentative)
          ? {
              birthDate: $dateTimeUtil.dateToRocDateWithoutSlashString(data?.legalRepresentative?.birthDate),
              idNo: data?.legalRepresentative?.idNo,
              name: data?.legalRepresentative?.name,
              nationality: data?.legalRepresentative?.nationality,
              relation: data?.legalRepresentative?.relation,
              rpsId: data?.legalRepresentative?.rpsId,
              sex: data?.legalRepresentative?.sex,
            }
          : null,
        medIns: data?.medIns,
        name: data?.name,
        nationality: data?.nationality,
        policyPlan: data?.policyPlan,
        sex: data?.sex,
        engName: data?.engName,
      },
      policyNo: $user.getMe()?.policyNo,
      policySeq: $user.getMe()?.policySeq,
      times: $user.getMe()?.times,
    }
    return requestData
  }

  // 編輯被保險人前檢核API
  const fetchCheckBeforeModifyInsuredInfo = async (data: CheckModifyInsureDto): Promise<boolean> => {
    loadingStore.setLoading(true)
    return await $selfPayEFormApi
      .checkBeforeModifyInsuredInfoUsingPOST(data)
      .then(resp => {
        console.log(resp)
        if (resp.data.status === 200) return true
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError, resp?.data?.errors),
        })
        return false
      })
      .catch(error => {
        console.log(error)
        // $modal.error({
        //   title: '錯誤',
        //   content: '系統有誤，請洽系統管理者',
        // })
        return false
      })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  // 編輯被保險人API TEST:
  const fetchModifyInsuredInfo = (insuredData: CheckModifyInsureDto, action: 'C' | 'M') => {
    loadingStore.setLoading(true)
    const requestData: ModifyInsureDto = {
      action: action,
      applyId: $global.handleApplyId('Get'),
      caseMainId: $user.getMe()?.caseMainId,
      insuredInfoModel: { ...insuredData.insuredInfoModel },
    }
    console.log(requestData)
    $selfPayEFormApi
      .modifyInsuredInfoUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          window.location.reload()
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(resp?.data?.apiError, resp?.data?.errors),
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
  }

  const handleOk = () => {
    let validations = [
      'insAttr',
      'idNo',
      'name',
      'engName',
      'birthDate',
      'sex',
      'nationality',
      'policyPlan',
      'benType',
      'relation',
    ]
    if (hasLegalRepresentative.value) {
      validations.push(
        'legalRepresentative.idNo',
        'legalRepresentative.name',
        'legalRepresentative.birthDate',
        'legalRepresentative.nationality',
        'legalRepresentative.relation',
      )
    } else {
      validations.filter(
        e =>
          e !== 'legalRepresentative.idNo' &&
          e !== 'legalRepresentative.name' &&
          e !== 'legalRepresentative.birthDate' &&
          e !== 'legalRepresentative.nationality' &&
          e !== 'legalRepresentative.relation',
      )
    }
    if (isShowAccMedInsQ.value) {
      validations.push('accMedIns', 'medIns')
    } else {
      validations.filter(e => e !== 'accMedIns' && e !== 'medIns')
    }
    if (modelRef.value.benType === 'DES' && bnfFormGridData.value.data.length === 0) {
      $modal.error({
        title: '錯誤',
        content: '請輸入指定受益人資料',
      })
      return
    }
    // console.log($props.editData.birthDate, modelRef.value.birthDate)
    // 檢核如果變更姓名/身份證字號/居留證號碼/生日/國籍時，需上傳證明文件
    if (
      $props.isEdit &&
      (modelRef.value.name !== $props.editData.name ||
        modelRef.value.idNo !== $props.editData.idNo ||
        modelRef.value.birthDate !== $props.editData.birthDate ||
        modelRef.value.nationality !== $props.editData.nationality) &&
      uploadedFileList.value.length === 0
    ) {
      $modal.error({
        title: '錯誤',
        content: '變更姓名/身份證字號/居留證號碼/生日/國籍時，需上傳證明文件!',
      })
      return
    }
    validate(validations)
      .then(async () => {
        const $requestData = mapData(modelRef.value, bnfFormGridData.value.data)
        console.log($requestData)
        if (await fetchCheckBeforeModifyInsuredInfo($requestData)) {
          fetchModifyInsuredInfo($requestData, $props.isEdit ? 'M' : 'C')
          $emit('handleCancel')
          bnfFormGridData.value.data = []
          uploadedFileList.value = []
        }
      })
      .catch(err => {
        console.log('error', err)
      })
  }

  const handleCancel = () => {
    resetFields()
    clearValidate()
    bnfFormGridData.value.data = []
  }

  const openPlanDetailModal = (): void => {
    isPlanPDFVisiable.value = true
    planPDFFileDetail.value = {
      caseMainId: $user.getMe()?.caseMainId,
      version: $user.getMe()?.version,
    }
  }

  return {
    hasLegalRepresentative,
    isShowAccMedInsQ,
    isShowMedInsQ,
    modelRef,
    fileUploadConfig,
    validateInfos,
    insPlanList,
    fetchGetIdInfo,
    isColReadOnly,
    handleOk,
    handleCancel,
    fetchCaseInsuredSetting,
    checkBenType,
    openPlanDetailModal,
  }
}

// 受益人相關
function useBenficiaryTable() {
  const beneficiaryModalOpen = ref(false)

  const bnfFormGridData = ref({
    rowKey: 'idNo',
    data: [],
    pagination: false,
    columns: [
      {
        type: 'PLAIN',
        title: '順位',
        dataIndex: 'bnfOrder',
        key: 'bnfOrder',
      },
      {
        type: 'PLAIN',
        title: '受益人姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        type: 'PLAIN',
        title: '身份證字號',
        dataIndex: 'idNo',
        key: 'idNo',
      },
      {
        type: 'PLAIN',
        title: '生日',
        dataIndex: 'birthDate',
        key: 'birthDate',
        // formatter: data => $dateTimeUtil.dateToRocDateString(data),
      },
      {
        type: 'PLAIN',
        title: '國籍',
        dataIndex: 'nationality',
        key: 'nationality',
        formatter: data => nationalityOpts.find(e => e.value == data.nationality)?.label,
      },
      {
        type: 'PLAIN',
        title: '與被保險人關係',
        dataIndex: 'relation',
        key: 'relation',
        formatter: data => relationOpts.find(e => e.value == data.relation)?.label,
      },
      {
        type: 'PLAIN',
        title: '比例',
        dataIndex: 'proportionNum',
        key: 'proportionNum',
        formatter: data => `${data?.proportionNum}/${data?.proportionDen}`,
      },
      {
        type: 'PLAIN',
        title: '連絡電話',
        dataIndex: 'mobileNo',
        key: 'mobileNo',
      },
      {
        type: 'PLAIN',
        title: '地址',
        dataIndex: 'contactAddress',
        key: 'contactAddress',
        // formatter: data => `${data?.town} ${getPostalAddress(data?.district)} ${data?.contactAddress}`,
      },
      {
        type: 'TEMPLATE',
        title: '修改',
        dataIndex: 'edit',
        key: 'edit',
        fixed: 'right',
        bodyCellTemp: 'actionEdit',
        width: '50',
      },
      {
        type: 'TEMPLATE',
        title: '刪除',
        dataIndex: 'delete',
        key: 'delete',
        fixed: 'right',
        width: '50',
        bodyCellTemp: 'actionDel',
      },
    ],
    scroll: { x: 1500 },
  })

  const createBnfItem = () => {
    beneficiaryModalOpen.value = true
    beneficiaryEditIdx.value = null
  }

  const editBnfItem = (data: BeneficiaryType, index: number) => {
    beneficiaryEditData.value = data
    beneficiaryModalOpen.value = true
    beneficiaryEditIdx.value = index
  }

  const handleDeleteBnf = (index: number) => {
    bnfFormGridData.value.data.splice(index, 1)
  }

  const addBnfItem = (data: BeneficiaryType) => {
    // 檢核資料是否已滿6筆,
    // 否：帶至新增受益人資料頁面;
    // 是：顯示訊息「受益人最多僅能新增6筆資料，請確認。」
    if (bnfFormGridData.value.data.length > 6) {
      $modal.error({
        title: '錯誤',
        content: '受益人最多僅能新增6筆資料，請確認。',
      })
      return
    }
    const { birthDate, postalCode, contactAddress, ...rest } = data
    bnfFormGridData.value.data.push({
      birthDate: $dateTimeUtil.dateToRocDateString(birthDate),
      road: contactAddress,
      postalCode: postalCode,
      contactAddress: `${postalCode || ''} ${postalCode ? getPostalAddress(postalCode) : ''}${contactAddress || ''}`,
      ...rest,
    })
    bnfFormGridData.value.data.sort((a, b) => parseInt(a.bnfOrder) - parseInt(b.bnfOrder))
    closeBnfModal()
  }

  const handleEditBnf = async ({ data, index }) => {
    console.log(data, index)
    const { birthDate, postalCode, contactAddress, ...rest } = data
    bnfFormGridData.value.data[index] = {
      birthDate: $dateTimeUtil.dateToRocDateString(birthDate),
      ...rest,
    }
    bnfFormGridData.value.data[index].road = contactAddress
    bnfFormGridData.value.data[index].postalCode = postalCode
    ;(bnfFormGridData.value.data[index].contactAddress = `${postalCode || ''} ${
      postalCode ? getPostalAddress(postalCode) : ''
    }${contactAddress || ''}`),
      bnfFormGridData.value.data.sort((a, b) => parseInt(a.bnfOrder) - parseInt(b.bnfOrder))
    closeBnfModal()
  }

  const closeBnfModal = () => {
    beneficiaryModalOpen.value = false
    beneficiaryEditData.value = null
    beneficiaryEditIdx.value = null
  }

  watch(
    () => modelRef.value.benType,
    value => {
      if (value && value === 'DES' && modelRef.value.insAttr && modelRef.value.policyPlan) {
        const plan = insPlanList.value.find(
          i => i.policyPlan === modelRef.value.policyPlan && i.attr === modelRef.value.insAttr,
        )
        isShowBeneficiary.value = plan?.healthDeclar !== '1' && plan?.healthDeclar !== '4'
      } else {
        isShowBeneficiary.value = false
      }
    },
    { deep: true, immediate: true },
  )

  return {
    isShowBeneficiary,
    bnfFormGridData,
    handleEditBnf,
    handleDeleteBnf,
    createBnfItem,
    editBnfItem,
    addBnfItem,
    beneficiaryModalOpen,
    closeBnfModal,
  }
}

// 取得下拉選單
function useOptios() {
  // 是非題
  const trueOrFalseOpts: RadioGroupProps['options'] = $giseEnum.trueOrFalseEnum
  // 性別
  const sexOpts: RadioGroupProps['options'] = $giseEnum.sexEnum
  // 與員工關係
  const insAttrOpts = ref<RadioGroupProps['options']>([])

  // 非同步取得下拉選單(國籍、保險計劃)
  const { nationalityOpts, relationOpts } = $props.respOpts

  return {
    nationalityOpts,
    relationOpts,
    trueOrFalseOpts,
    sexOpts,
    insAttrOpts,
  }
}

defineExpose({
  handleOk,
  handleCancel,
  modelRef,
})
</script>

<template>
  <a-form layout="vertical">
    <a-form-item name="insAttr" v-bind="validateInfos.insAttr">
      <template #label>
        與員工關係
        <span v-if="!$props.isEdit" class="ml-1 font-mark text-base text-[#ff4d4f]">*</span>
      </template>
      <a-radio-group
        :disabled="$props.isEdit"
        v-model:value="modelRef.insAttr"
        @change="checkBenType"
        :options="insAttrOpts"
        name="insattrRadioGroup"
      />
    </a-form-item>
    <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
      <a-form-item label="身分證字號/居留證號" name="idNo" v-bind="validateInfos.idNo" required>
        <a-input
          v-model:value.trim="modelRef.idNo"
          :disabled="isColReadOnly"
          @blur="fetchGetIdInfo('I')"
          placeholder="e.g. A123456789"
        />
      </a-form-item>
      <a-form-item label="姓名" name="name" v-bind="validateInfos.name" required>
        <a-input v-model:value.trim="modelRef.name" :disabled="isColReadOnly" placeholder="e.g. 王小明" />
      </a-form-item>
    </div>
    <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
      <a-form-item
        :class="{ 'input-engName-required': modelRef.nationality !== '001' }"
        label="英文姓名"
        name="engName"
        v-bind="validateInfos.engName"
      >
        <a-input v-model:value.trim="modelRef.engName" :disabled="isColReadOnly" placeholder="e.g. Xiaoming Wang" />
      </a-form-item>
      <a-form-item label="生日" name="birthDate" v-bind="validateInfos.birthDate" required>
        <date-picker
          class="w-100"
          v-model:value="modelRef.birthDate"
          :disabled="isColReadOnly"
          format="YYYY/MM/DD"
          placeholder="請選擇 日期"
        />
      </a-form-item>
    </div>
    <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
      <a-form-item label="性別" name="sex" v-bind="validateInfos.sex" required>
        <a-radio-group v-model:value="modelRef.sex" :disabled="isColReadOnly" name="sexRadioGroup" :options="sexOpts" />
      </a-form-item>
      <a-form-item label="國籍" name="nationality" v-bind="validateInfos.nationality" required>
        <SelectSearch
          v-model:value="modelRef.nationality"
          style="width: 100%"
          placeholder="請選擇國籍"
          :options="nationalityOpts"
        />
      </a-form-item>
    </div>
    <a-form-item name="policyPlan" v-bind="validateInfos.policyPlan">
      <div class="flex items-center pb-2">
        <p
          class="test-base font-semibold after:mr-1 after:font-mark after:text-base after:text-[#ff4d4f] after:content-['*'] lg:text-lg"
        >
          保險計劃
        </p>
        <question-circle-filled @click="openPlanDetailModal" class="ml-1 cursor-pointer text-[#6A6A6A]" />
      </div>
      <SelectSearch
        v-model:value="modelRef.policyPlan"
        style="width: 100%"
        placeholder="請選擇保險計劃"
        :options="policyplanOpts"
        :disabled="$props.isEdit && $props.editData?.policyPlan === '非計劃保障內容'"
      />
    </a-form-item>
    <a-form-item name="accMedIns" v-bind="validateInfos.accMedIns" required v-if="isShowAccMedInsQ">
      <div class="flex items-center pb-2">
        <p
          class="test-base font-semibold after:mr-1 after:font-mark after:text-base after:text-[#ff4d4f] after:content-['*'] lg:text-lg"
        >
          是否已投保其他商業實支實付型傷害醫療保險？
        </p>
        <a-tooltip placement="topRight" trigger="click">
          <template #title>
            <span>{{ cautionContent.MEDICAL_ORIGINAL }}</span>
          </template>
          <question-circle-filled class="ml-1 text-[#6A6A6A]" />
        </a-tooltip>
      </div>
      <a-radio-group v-model:value="modelRef.accMedIns" name="accMedInsRadioGroup" :options="trueOrFalseOpts" />
    </a-form-item>
    <a-form-item name="medIns" v-bind="validateInfos.medIns" required v-if="isShowMedInsQ">
      <div class="flex items-center pb-2">
        <p
          class="test-base font-semibold after:mr-1 after:font-mark after:text-base after:text-[#ff4d4f] after:content-['*'] lg:text-lg"
        >
          是否已投保其他商業實支實付型醫療保險？
        </p>
        <a-tooltip placement="topRight" trigger="click">
          <template #title>
            <span>{{ cautionContent.HOSPITAL_ORIGINAL }}</span>
          </template>
          <question-circle-filled class="ml-1 text-[#6A6A6A]" />
        </a-tooltip>
      </div>
      <a-radio-group v-model:value="modelRef.medIns" name="medInsRadioGroup" :options="trueOrFalseOpts" />
    </a-form-item>
    <a-form-item label="身故保險金受益人" name="benType">
      <a-input
        disabled
        class="cursor-not-allowed"
        placeholder="請選擇與員工關係以綁定身故保險金受益人"
        :value="$giseEnum.getLabel('beneficiaryType', modelRef.benType)"
      />
      <p class="mt-2 text-sm lg:text-base">
        {{ cautionContent.BENEFICIARY_DROPDOWN }}
      </p>
    </a-form-item>
    <div v-show="isShowBeneficiary">
      <div class="flex w-full items-center justify-between pb-2">
        <p
          class="text-base font-semibold after:mr-1 after:font-mark after:text-base after:text-[#ff4d4f] after:content-['*'] lg:text-lg"
        >
          指定受益人
        </p>
        <ButtonRectangle @click="createBnfItem">新增受益人</ButtonRectangle>
      </div>
      <FblDataGrid
        class="mb-4"
        :dataSource="bnfFormGridData.data"
        :columns="bnfFormGridData.columns"
        :scroll="bnfFormGridData.scroll"
        :pagination="bnfFormGridData.pagination"
        :size="'small'"
      >
        <template #actionEdit="{ scope: { record, index } }">
          <ButtonIconic tooltip="編輯" :hoverWhite="true" @click="editBnfItem(record, index)">
            <img :src="editSvg" alt="" />
          </ButtonIconic>
        </template>
        <template #actionDel="{ scope: { index } }">
          <ButtonIconic tooltip="刪除" :hoverWhite="true" btnStyle="danger" @click="handleDeleteBnf(index)">
            <img :src="deleteSvg" alt="刪除" />
          </ButtonIconic>
        </template>
      </FblDataGrid>
    </div>
    <a-form-item label="附件上傳" name="fileInfo" v-bind="validateInfos.fileInfo">
      <p class="mb-2 text-sm text-danger lg:text-base">
        變更姓名/身份證字號/居留證號碼/生日/國籍時，需上傳證明文件(身分證正反面、護照或居留證)
      </p>
      <a-upload
        v-model:file-list="uploadedFileList"
        name="file"
        class="w-full"
        :accept="fileUploadConfig.acceptFileType"
        :multiple="fileUploadConfig.multiple"
        :showUploadList="false"
        :custom-request="uploadFlie"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <div class="flex items-center md:items-end">
          <ButtonRectangle
            class="flex w-[80px] justify-around"
            :disabled="fileUploadConfig.uploadDisabled || uploadedFileList.length > fileUploadConfig.maxNumber - 1"
          >
            <upload-outlined></upload-outlined>
            上傳
          </ButtonRectangle>
          <div class="ml-2 text-sm md:grid md:grid-cols-2 lg:text-base">
            <p>檔案格式：jpg, pdf, doc, tiff</p>
            <p>檔案大小&數量：5MB，最多3個</p>
          </div>
        </div>
      </a-upload>
      <!-- 上傳列表 -->
      <ul class="mb-0 mt-[11px] pl-0" v-if="uploadedFileList.length > 0">
        <li
          class="flex items-center justify-between text-base hover:bg-neutral-light"
          v-for="item in uploadedFileList"
          :key="item.uid"
        >
          <div class="flex items-center">
            <paper-clip-outlined class="text-[#00000073]" />
            <a class="ml-2 text-[#1890FF]" @click="downloadFile({ fileId: item?.uid })">
              {{ item.fileExtension ? `${item.name}.${item.fileExtension}` : item.name }}
            </a>
          </div>
          <span v-if="fileUploadConfig.showRemoveIcon">
            <delete-outlined class="text-[#00000073]" @click="deleteFile(item)" />
          </span>
        </li>
      </ul>
    </a-form-item>
    <a-form-item v-if="hasLegalRepresentative" label="法定代理人" required>
      <div v-if="modelRef.legalRepresentative" class="bg-neutral-light p-[16px_8px] lg:p-[2rem]">
        <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
          <a-form-item
            label="身分證字號/居留證號"
            name="idNo"
            v-bind="validateInfos['legalRepresentative.idNo']"
            required
          >
            <a-input
              v-model:value.trim="modelRef.legalRepresentative.idNo"
              @blur="fetchGetIdInfo('L')"
              placeholder="e.g. A123456789"
            />
          </a-form-item>
          <a-form-item label="姓名" name="name" v-bind="validateInfos['legalRepresentative.name']" required>
            <a-input v-model:value.trim="modelRef.legalRepresentative.name" placeholder="e.g. 王小明" />
          </a-form-item>
        </div>
        <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
          <a-form-item label="生日" name="birthDate" v-bind="validateInfos['legalRepresentative.birthDate']" required>
            <date-picker
              class="w-100"
              v-model:value="modelRef.legalRepresentative.birthDate"
              format="YYYY/MM/DD"
              placeholder="請選擇 日期"
            />
          </a-form-item>
          <a-form-item
            label="國籍"
            name="nationality"
            v-bind="validateInfos['legalRepresentative.nationality']"
            required
          >
            <SelectSearch
              v-model:value="modelRef.legalRepresentative.nationality"
              style="width: 100%"
              placeholder="請選擇國籍"
              :options="nationalityOpts"
            />
          </a-form-item>
        </div>
        <div class="md:grid md:grid-cols-2 md:gap-4 lg:gap-8">
          <a-form-item
            label="與被保險人關係"
            name="relation"
            v-bind="validateInfos['legalRepresentative.relation']"
            required
          >
            <SelectSearch
              v-model:value="modelRef.legalRepresentative.relation"
              style="width: 100%"
              placeholder="請選擇與被保險人關係"
              :options="relationOpts"
            />
          </a-form-item>
        </div>
      </div>
    </a-form-item>
  </a-form>
  <!-- 受益人表單 -->
  <BeneficiaryForm
    v-if="beneficiaryModalOpen"
    ref="beneficiaryFormRef"
    :isOpen="beneficiaryModalOpen"
    :isEdit="beneficiaryEditData ? true : false"
    :editData="beneficiaryEditData"
    :editIdx="beneficiaryEditIdx"
    :beneficiaryList="bnfFormGridData.data"
    :respOpts="$props.respOpts"
    @closeBnfModal="closeBnfModal"
    @updateBnfItem="handleEditBnf"
    @addBnfItem="addBnfItem"
  />
  <ModalPDFViewer v-model:visible="isPlanPDFVisiable" :fileDetail="planPDFFileDetail" />
</template>

<style scoped>
:deep(.ant-upload) {
  @apply w-full;
}
:deep(.input-engName-required [for='form_item_engName']::before) {
  @apply absolute right-[-18px] mt-[4px] inline-block text-base
  leading-none text-[#ff4d4f];
  font-family: SimSun, sans-serif;
  content: '*';
}
</style>
