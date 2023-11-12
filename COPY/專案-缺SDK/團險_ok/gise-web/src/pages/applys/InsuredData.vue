<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { Empty } from 'ant-design-vue'
import { useLoadingStore } from '@/stores'
import { useGetInsuredInfo, type InsuredData } from '@/composables/useGetInsuredInfo'
import { useNationalities } from '@/composables/useNationalities'
import { useRelation } from '@/composables/useRelation'
import { useDownloadFile } from '@/composables/useDownloadFile'
// import { ErrorType } from '@plugins/global/index'
import type {
  ApplyInfoDto,
  WebRestResponse,
  CaseMainIdAndVersionDto,
  InsuredProveDto,
  ModifyInsureDto,
  CancelInsuredDto,
  CaseMainIdDto,
  CaseMainIdAndSituationDto,
} from '@fubonlife/gise-api-axios-sdk'
import type { SelectProps } from 'ant-design-vue'

interface ModalInfo {
  isOpen: boolean
  formType: string
  title: string
  insured: {
    isEdit: boolean
  }
  beneficiary: {
    isEdit: boolean
  }
}

export interface RespOption {
  nationalityOpts?: SelectProps['options']
  relationOpts?: SelectProps['options']
}

export interface InsuredPageQuery {
  idNo: string
  name: string
  birthDate: string
  situation: 'applyArea' | 'searchArea'
}

const loadingStore = useLoadingStore()
const {
  proxy: { $modal, $selfPayEFormApi, $blobUtils, $global, $user, $dateTimeUtil, $giseEnum },
} = getCurrentInstance()

// 空白圖示
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

// 注意事項
const cautionContext = ref<string>('')

// composables
const { basicCardLabelsList, bnfTableColumns, rpsCardLabels, cardDataList, getInsuredData, caseInsuredSettings } =
  useGetInsuredInfo()
const { downloadFile } = useDownloadFile()

const { bnfCardGridData, manipulateCard } = useInsuredCard()
const { modalInfo, optionsObj, handleOpen, handleCancel, handleModalHeader } = useModal()
const {
  insuredEditData,
  insuredFormRef,
  createInsuredItem,
  editInsuredItem,
  isAllowCreateInsured,
  manipulateBtnStatus,
  downloadInsurance,
  handleSubmit,
} = useInsuredForm()
const { nextStep, prevStep } = useNavigatePage()
const {
  fetchSetExistInsuredInfoLog,
  fetchDownloadInsurancePlan,
  fetchDownloadInsuranceInsuredprove,
  fetchModifyInsuredInfo,
  fetchCancelInsuredInfo,
  fetchGetCaseInsuredSettings,
  fetchCaution,
} = useFormApi()

function useInsuredCard() {
  // 受益人Table
  const bnfCardGridData = ref({
    rowKey: 'txCode',
    data: [],
    pagination: false,
    columns: bnfTableColumns,
    scroll: { x: 1000 },
  })

  // 取消時的提示訊息
  const getCancelInfo = (action): { title: string; content: string } => {
    switch (action) {
      case 'D':
        return {
          title: '您確定要取消申請退保嗎？',
          content: '點選確定將取消申請退保，還原申請退保前之資料',
        }
      case 'M':
        return {
          title: '您確定要取消申請資料變更嗎？',
          content: '點選確定將取消申請資料變更，還原申請資料變更前之資料',
        }
      default:
        return {
          title: '您確定要取消此筆加保嗎？',
          content: '點選確定將取消此筆申請加保之被保險人資料',
        }
    }
  }

  // 操作卡片按鈕群: 修改、取消、退保
  const manipulateCard = async (btnData, insuredData: InsuredData): Promise<void> => {
    if (btnData?.type === 'cancel') {
      // 取消
      const { title, content } = getCancelInfo(btnData?.action)
      $modal.confirm({
        title,
        content,
        okText: '確定',
        okType: 'danger',
        onOk: () => {
          fetchCancelInsuredInfo(insuredData)
        },
      })
    } else if (btnData?.type === 'delete') {
      // 退保
      let insAttr: string = insuredData.insuredInfo.insAttr.value
      if (insAttr === '本人') {
        let checkRestrictMsg: string = await fetchGetCaseInsuredSettings()
        if (checkRestrictMsg === 'Y') {
          $modal.confirm({
            title: '提醒',
            content: '員工退保則眷屬將一同退保，請確認是否仍要退保？',
            okText: '確認',
            okType: 'danger',
            onOk: () => {
              // 將所有被保險人退保，呼叫[編輯被保險人API]。
              fetchModifyInsuredInfo(insuredData, true, 'D')
            },
          })
        } else if (checkRestrictMsg === 'N') {
          // 直接將員工退保，呼叫[編輯被保險人API]。
          fetchModifyInsuredInfo(insuredData, true, 'D')
        } else {
          $modal.error({
            title: '錯誤',
            content: checkRestrictMsg,
          })
        }
      } else {
        // 退保眷屬
        $modal.confirm({
          title: '您確定要申請退保嗎？',
          content: `請確認是否要退保被保險人${insuredData.insuredInfo?.name?.value}？`,
          okText: '退保',
          okType: 'danger',
          onOk: () => {
            // 將該被保險人退保，呼叫[編輯被保險人API]。
            fetchModifyInsuredInfo(insuredData, true, 'D')
          },
        })
      }
    } else {
      editInsuredItem(insuredData)
    }
  }

  return { bnfCardGridData, manipulateCard }
}

function useInsuredForm() {
  const insuredEditData = ref()

  const insuredFormRef = ref(null)

  const createInsuredItem = (): void => {
    handleOpen('insured', { title: '申請加保-請填寫被保險人資料', addAndEdit: 'add' })
  }

  const editInsuredItem = (data): void => {
    const $data = $global.deepCopyData(data.rawAfterData)
    insuredEditData.value = $data
    insuredEditData.value.birthDate = $dateTimeUtil.dateStringAddSlashAndToAD($data.birthDate)
    console.log(insuredEditData.value)
    handleOpen('insured', { title: '申請資料變更-請修改被保險人資料', addAndEdit: 'edit' })
  }

  const isAllowCreateInsured = computed(() => {
    // 新增被保險人：需在加保開放區間內方能顯示
    // 1. 依據為查看登入資訊回傳是否為加保區間(isAddPolicy)
    return $user.getMe()?.isAddPolicy === 'Y'
    // return true
  })

  const isAllowReturnInsured = beforeData => {
    // 退保：需在退保開放區間內方能顯示，且該筆資料為已承保的被保險人。
    // 1. 依據為查看登入資訊回傳是否為加保區間(isDeletePolicy)
    // 2. 是否為已承保被保險人判斷依據為[查詢被保險人資料清單API]各被保險人的before部分有無資料資料。
    return $user.getMe()?.isDeletePolicy === 'Y' && beforeData
    // return true
  }

  const isAllowModifyInsured = (beforeData, btn) => {
    // 變更：需在變更開放區間內方能顯示，且該筆資料為已承保的被保險人。
    // 1. [申請變更/申請加保之卡片]的按鈕直接開放
    // 2. [既有被保險人之卡片]依據為查看登入資訊回傳是否為加保區間(isModifyPolicy)&&是否為已承保被保險人判斷依據為[查詢被保險人資料清單API]各被保險人的before部分有無資料資料。
    if (btn.action === 'M' || btn.action === 'C') return true
    return $user.getMe()?.isModifyPolicy === 'Y' && beforeData
  }

  const manipulateBtnStatus = (btn, beforeData): boolean => {
    let bool: boolean
    const caseInsuredSettingsAttrs = caseInsuredSettings.value.insPlanList.map(e => e.attr)
    switch (btn.text) {
      case '退保':
        bool = isAllowReturnInsured(beforeData) && caseInsuredSettingsAttrs.includes(beforeData.insAttr)
        break
      case '修改':
        bool = isAllowModifyInsured(beforeData, btn) && caseInsuredSettingsAttrs.includes(beforeData.insAttr)
        break

      default:
        bool = caseInsuredSettingsAttrs.includes(beforeData.insAttr)
        break
    }
    return bool
  }

  const downloadInsurance = (action, insuranceData?) => {
    if (action === 'C' || action === 'M') {
      fetchDownloadInsurancePlan()
    } else if (action === 'E') {
      fetchDownloadInsuranceInsuredprove(insuranceData)
    }
  }

  const handleSubmit = () => {
    insuredFormRef.value.handleOk()
  }

  return {
    insuredEditData,
    insuredFormRef,
    createInsuredItem,
    editInsuredItem,
    isAllowCreateInsured,
    manipulateBtnStatus,
    downloadInsurance,
    handleSubmit,
  }
}

function useModal() {
  const { nationalityOpts, fetchNationalities } = useNationalities()
  const { relationOpts, fetchRelation } = useRelation()
  const modalInfo = ref<ModalInfo>({
    isOpen: false,
    formType: 'insured',
    title: '',
    insured: {
      isEdit: false,
    },
    beneficiary: {
      isEdit: false,
    },
  })

  const optionsObj = ref<RespOption>({
    nationalityOpts: [],
    relationOpts: [],
  })

  // 重置被保險人表格
  const resetInsuredForm = () => {
    insuredFormRef.value.handleCancel()
    insuredEditData.value = null
  }

  const handleOpen = (type: 'insured' | 'beneficiary', options): void => {
    handleModalHeader({ type, options })
    modalInfo.value.isOpen = true
  }

  const handleModalHeader = ({ type, options }) => {
    const { title = '', addAndEdit = '' } = options
    modalInfo.value.formType = type
    modalInfo.value.title = title
    modalInfo.value[type].isEdit = !!(addAndEdit === 'edit')
  }

  const handleCancel = (): void => {
    const tmpType = modalInfo.value.formType
    console.log(tmpType)
    if (tmpType === 'insured') {
      modalInfo.value.isOpen = false
      resetInsuredForm()
    } else {
      const tmpEdit = modalInfo.value.insured.isEdit
      modalInfo.value.formType = 'insured'
      modalInfo.value.title = tmpEdit ? '申請資料變更-請修改被保險人資料' : '申請加保-請填寫被保險人資料'
      modalInfo.value.beneficiary.isEdit = false
    }
  }

  onMounted(() => {
    Promise.all([fetchNationalities(), fetchRelation()])
      .then(() => {
        Object.assign(optionsObj.value, {
          nationalityOpts,
          relationOpts,
        })
      })
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      // })
      .finally(() => loadingStore.setLoading(false))
  })

  return {
    modalInfo,
    optionsObj,
    handleOpen,
    handleCancel,
    handleModalHeader,
  }
}

function useNavigatePage() {
  const situation: 'applyArea' | 'searchArea' = $global.getQuery<any>()?.situation

  const nextStep = () => {
    // action為C則檢查登入回傳資訊的加保區間(isAddPolicy=Y表示在加保區間內)；
    // 同理action為M及action為D者分別檢查編輯區間(isModifyPolicy=Y表示在編輯區間內)及退保區間(isDeletePolicy=Y表示在退保區間內)。
    // 若皆符合才跳頁(至到健康聲明書填寫紀錄頁面)，若有不符者跳出訊息”XX(加保/退保/編輯)被保險人操作不再開放期間範圍內，請確認”。
    const userInfo = $user.getMe()
    let errors: string[] = []
    cardDataList.value.forEach(el => {
      if (el.action === 'C' && userInfo?.isAddPolicy !== 'Y') errors.push(`${el.insuredInfo.name.value}(加保)`)
      if (el.action === 'M' && userInfo?.isModifyPolicy !== 'Y') errors.push(`${el.insuredInfo.name.value}(編輯)`)
      if (el.action === 'D' && userInfo?.isDeletePolicy !== 'Y') errors.push(`${el.insuredInfo.name.value}(退保)`)
    })
    if (errors.length > 0) {
      $modal.error({
        title: '錯誤',
        content: `${[...new Set(errors)]}被保險人操作不再開放期間範圍內，請確認`,
      })
    } else {
      $global.changeRouterAndaddParam({
        toRouter: 'HealthStatement',
        query: { situation },
      })
    }
  }

  const prevStep = () => {
    $global.changeRouterAndaddParam({
      toRouter: 'EmployeeData',
      query: { situation },
    })
  }
  return { nextStep, prevStep }
}

function useFormApi() {
  /**
   * @summary 建置當前既有被保險人相關資料API
   * @return {string | null} applyId 申請編號
   **/
  const fetchSetExistInsuredInfoLog = async (): Promise<string> => {
    const requestData: ApplyInfoDto = {
      applyId: $global.handleApplyId('Get'),
      crtNo: $user.getMe()?.crtNo,
      policyNo: $user.getMe()?.policyNo,
      policySeq: $user.getMe()?.policySeq,
      times: $user.getMe()?.times,
    }
    return await $selfPayEFormApi
      .setExistInsuredInfoLogUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          return resp.data.data.applyId
        }
        return null
      })
      .catch(() => {
        // $modal.error({
        //   title: '錯誤',
        //   content: '系統有誤，請洽系統管理者',
        // })
        return null
      })
  }

  // 投保計劃下載API
  const fetchDownloadInsurancePlan = () => {
    loadingStore.setLoading(true)
    const requestData: CaseMainIdAndVersionDto = {
      caseMainId: $user.getMe()?.caseMainId,
      version: $user.getMe()?.version,
    }
    $selfPayEFormApi
      .downloadInsurancePlanUsingPOST(requestData, { responseType: 'blob' })
      .then(async resp => {
        console.log('resp', resp)
        const disposition = resp.headers['content-disposition']
        if (disposition) {
          const filename = $blobUtils.getFileName(resp.headers)
          $blobUtils.download(resp.data as Blob, filename, resp.headers['content-type'])
        } else {
          let errorMsg: WebRestResponse = await $blobUtils.convertErrorBlobToString(resp.data)
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(errorMsg.apiError),
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
  }

  // 投保證明下載API
  const fetchDownloadInsuranceInsuredprove = insuranceData => {
    loadingStore.setLoading(true)
    const $userInfo = $user.getMe()
    const requestData: InsuredProveDto = {
      authority: 'Y',
      crtNo: $userInfo?.crtNo,
      crtSeq: $userInfo?.crtSeq,
      jnDate: insuranceData?.jnDate?.value,
      policyModel: {
        policyNo: $userInfo?.policyNo,
        policySeq: $userInfo?.policySeq,
        times: parseInt($userInfo?.times),
      },
      userId: $userInfo?.idNo,
      version: 'C',
    }
    $selfPayEFormApi
      .downloadInsuranceInsuredproveUsingPOST(requestData, { responseType: 'blob' })
      .then(async resp => {
        console.log('resp', resp)
        const disposition = resp.headers['content-disposition']
        if (disposition) {
          const filename = $blobUtils.getFileName(resp.headers)
          $blobUtils.download(resp.data as Blob, filename, resp.headers['content-type'])
        } else {
          let errorMsg: WebRestResponse = await $blobUtils.convertErrorBlobToString(resp.data)
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(errorMsg.apiError),
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
  }

  // 編輯被保險人API
  const fetchModifyInsuredInfo = (insuredData: InsuredData | any, isRawData: boolean, action: 'C' | 'M' | 'D') => {
    loadingStore.setLoading(true)
    const requestData: ModifyInsureDto = {
      action: action,
      applyId: $global.handleApplyId('Get'),
      caseMainId: $user.getMe()?.caseMainId,
      insuredInfoModel: isRawData ? { ...insuredData.rawAfterData } : { ...insuredData.insuredInfoModel },
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

  // 取消被保險人API
  const fetchCancelInsuredInfo = (insuredData: InsuredData | any) => {
    loadingStore.setLoading(true)
    const requestData: CancelInsuredDto = {
      action: insuredData?.insuredInfo?.action.value,
      applyId: $global.handleApplyId('Get'),
      caseMainId: $user.getMe()?.caseMainId,
      insAttr: $giseEnum.getValue('insAttr', insuredData?.insuredInfo?.insAttr.value),
      insuredId: insuredData?.insuredId?.value,
    }
    $selfPayEFormApi
      .cancelInsuredInfoUsingPOST(requestData)
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

  // 查詢被保險人自費案設定
  const fetchGetCaseInsuredSettings = async (): Promise<string> => {
    loadingStore.setLoading(true)
    const requestData: CaseMainIdDto = {
      caseMainId: $user.getMe()?.caseMainId,
    }
    return await $selfPayEFormApi
      .getCaseInsuredSettingsUsingPOST(requestData)
      .then(resp => {
        if (resp.data.status === 200) {
          // 查看RESTRICT1(投保限制一)判斷是否「員工退保將一併退保眷屬」
          return resp.data.data.restrict1
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(resp?.data?.apiError, resp?.data?.errors),
          })
          return $global.getApiErrorMsg(resp?.data?.apiError, resp?.data?.errors)
        }
      })
      .catch(error => {
        // $modal.error({
        //   title: '錯誤',
        //   content: '系統有誤，請洽系統管理者',
        // })
        return error
      })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  // API: 1.2.54.	E填表取得注意事項API
  const fetchCaution = (): Promise<void> => {
    const caseMainIdAndSituation: CaseMainIdAndSituationDto = {
      caseMainId: $user.getMe()?.caseMainId,
      situation: 'F',
    }
    return $selfPayEFormApi.getCautionUsingPOST(caseMainIdAndSituation).then(resp => {
      if (resp.data.status === 200) {
        cautionContext.value = resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  return {
    fetchSetExistInsuredInfoLog,
    fetchDownloadInsurancePlan,
    fetchDownloadInsuranceInsuredprove,
    fetchModifyInsuredInfo,
    fetchCancelInsuredInfo,
    fetchGetCaseInsuredSettings,
    fetchCaution,
  }
}

onMounted(async () => {
  loadingStore.setLoading(true)
  await Promise.all([fetchSetExistInsuredInfoLog(), fetchCaution()])
  await getInsuredData({ applyId: $global.handleApplyId('Get'), caseMainId: $user.getMe()?.caseMainId })
  loadingStore.setLoading(false)
})
</script>

<template>
  <div class="mb-2 flex items-center justify-between lg:mb-4">
    <h4 class="border-l-4 pl-2 text-lg font-bold leading-[22px] text-info lg:text-2xl">被保險人資料</h4>
    <ButtonRectangle :disabled="!isAllowCreateInsured" @click="createInsuredItem">新增被保險人</ButtonRectangle>
  </div>
  <section>
    <div v-if="cardDataList.length > 0" class="grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      <CardInfo
        v-for="(insuredData, index) in cardDataList"
        :key="index"
        :title="insuredData.title"
        :type="insuredData.type"
        :columns="basicCardLabelsList[index]"
        :data="insuredData.insuredInfo"
        :class="insuredData.action === 'D' ? 'text-neutral-entry' : 'text-black'"
      >
        <template #headerControl>
          <ButtonRectangle
            v-for="(btn, btnIndex) in insuredData.buttons"
            :key="btnIndex"
            :btn-style="btn.style"
            :disabled="!manipulateBtnStatus(btn, insuredData.rawBeforeData)"
            @click="manipulateCard(btn, insuredData)"
          >
            {{ btn.text }}
          </ButtonRectangle>
        </template>
        <template #customCell="{ data, column }">
          <span
            v-if="column.key === 'policyPlan'"
            class="flex-1 text-right font-semibold"
            :class="{
              'text-warning': insuredData.action === 'M' && data[column.key]?.isEdit,
              'cursor-pointer text-primary underline':
                insuredData.action === 'C' || insuredData.action === 'M' || insuredData.action === 'E',
            }"
            @click="downloadInsurance(insuredData.action, insuredData)"
          >
            {{ data[column.key]?.value }}
          </span>
          <span
            v-else
            class="flex-1 break-all text-right font-semibold"
            :class="insuredData.action === 'M' && data[column.key]?.isEdit && 'text-warning'"
          >
            {{ data[column.key]?.value?.trim() }}
          </span>
        </template>
        <FblDataGrid
          v-if="
            insuredData.beneficiaryList &&
            insuredData.beneficiaryList.length > 0 &&
            insuredData.insuredInfo.benType.value == '指定受益人'
          "
          class="mx-[-1rem] mb-2"
          :dataSource="insuredData.beneficiaryList"
          :columns="bnfCardGridData.columns"
          :scroll="bnfCardGridData.scroll"
          :pagination="bnfCardGridData.pagination"
          :size="'small'"
          :class="insuredData.action === 'D' ? 'opacity-40' : ''"
        >
          <template #proportion="{ scope: { text } }"> {{ text }} </template>
        </FblDataGrid>
        <div v-if="insuredData.fileInfo.length > 0" class="flex pb-2">
          <span class="flex-1">附件</span>
          <div>
            <div
              class="mb-2 flex flex-1 items-center justify-end text-right"
              v-for="(atch, atchIdx) in insuredData.fileInfo"
              :key="atchIdx"
            >
              <paper-clip-outlined class="text-base text-[#595959] lg:text-lg" />
              <a
                @click.prevent="downloadFile({ fileId: atch.fileId.value, source: 'emp' })"
                href="#"
                class="ml-[5px] text-base text-[#1890FF]"
              >
                {{ `${atch.originalFileName?.value}.${atch.fileExtension?.value}` }}
              </a>
            </div>
          </div>
        </div>
        <div
          v-if="insuredData.legalRepresentative && Object.values(insuredData.legalRepresentative).some(el => el)"
          class="relative mt-2 border-t border-dashed border-neutral-entry pt-3"
        >
          <span class="absolute right-[calc((100%-(5*12px))/2)] top-[-9px] bg-white px-1 text-sm text-neutral-entry">
            法定代理人
          </span>
          <div class="flex pb-2" v-for="(labelInfo, labelIdx) in rpsCardLabels" :key="labelIdx">
            <span class="flex-1">{{ labelInfo.label }}</span>
            <span class="flex-1 break-all text-right font-semibold">
              {{
                insuredData.legalRepresentative[labelInfo.key] &&
                insuredData.legalRepresentative[labelInfo.key].value?.trim()
              }}
            </span>
          </div>
        </div>
      </CardInfo>
    </div>
    <div v-else class="rounded-[4px] border-[1px] border-neutral-entry">
      <a-empty
        :image="simpleImage"
        class="m-auto flex min-h-[222px] w-[calc(12*14px)] flex-col justify-center lg:w-[calc(12*16px)]"
      >
        <template #description>
          <span class="text-base text-[#6A6A6A] lg:text-lg">目前尚無任何被保險人資料請點選右上角新增被保險人</span>
        </template>
      </a-empty>
    </div>
  </section>
  <CardNotice class="my-[16px] lg:m-[16px_0_32px_0]">
    <template #description>
      <div class="whitespace-pre-line" v-html="cautionContext"></div>
    </template>
  </CardNotice>
  <div class="flex justify-center">
    <ButtonRoundedSecondary @click="prevStep">上一步</ButtonRoundedSecondary>
    <ButtonRoundedPrimary class="ml-[15px] md:ml-[16px] lg:ml-[32px]" @click="nextStep">下一步</ButtonRoundedPrimary>
  </div>

  <ModalMain
    v-model:visible="modalInfo.isOpen"
    :title="modalInfo.title"
    width="824px"
    :after-close="handleCancel"
    :maskClosable="false"
  >
    <template #content>
      <!-- 被保險人表單 -->
      <InsuredForm
        v-model:modalOpen="modalInfo.isOpen"
        ref="insuredFormRef"
        :isEdit="modalInfo.insured.isEdit"
        :editData="insuredEditData"
        :respOpts="optionsObj"
        @handle-cancel="handleCancel"
        @handle-header="handleModalHeader"
      />
    </template>
    <template #footer>
      <div class="mb-4 flex justify-center md:mb-0">
        <ButtonRoundedSecondary @click="handleCancel">取消</ButtonRoundedSecondary>
        <ButtonRoundedPrimary class="ml-[15px] md:ml-[16px] lg:ml-[32px]" @click="handleSubmit">
          確定
        </ButtonRoundedPrimary>
      </div>
    </template>
  </ModalMain>
</template>

<style scoped>
/* Ant design vue - icon */
:deep(.anticon > svg) {
  width: 1rem;
  height: 1rem;
}
:deep(.anticon-question-circle > svg) {
  width: 20px;
  height: 20px;
}
</style>
