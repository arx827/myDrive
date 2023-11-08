<script setup lang="ts">
import { ref, getCurrentInstance, h, onMounted, computed } from 'vue'
import { useLoadingStore } from '@stores/index'
import { useGetInsuredInfo } from '@/composables/useGetInsuredInfo'
import { useHealthStatement } from '@/composables/useHealthStatement'
import { usePostalCode } from '@/composables/usePostalCode'
import { useDownloadFile } from '@/composables/useDownloadFile'
import type { DescriptionsData } from '@shared/Descriptions.vue'
import type {
  CaseMainIdDto,
  EmpInfoTopicConfigDto,
  CaseMainIdAndApplyInfoDto,
  FilledInEmpInfoDto,
  ApplyIdDto,
  PaymentDetailModel,
  PaymentDetailDto,
  HealthDeclarationInfoDto,
  EEmpPaymentDetailDto,
} from '@fubonlife/gise-api-axios-sdk'
import customerserviceSVG from '@/assets/imgs/image_customerservice.svg?url'
import searchSVG from '@assets/imgs/button_search.svg?url'

export interface HealthStatementCard {
  hDId?: string
  status?: string
  type?: string
  title?: string
  insattr: string
  name: string
  policyplan: string
}

const {
  proxy: { $giseEnum, $selfPayEFormApi, $modal, $global, $dateTimeUtil, $user, $commonApi },
} = getCurrentInstance()

// global
const loadingStore = useLoadingStore()
const userMe = $user.getMe()

// session storage
const applyId = $global.handleApplyId('Get')

// composables
const { downloadFile } = useDownloadFile()
const { fetchPostalCode, getPostalAddress } = usePostalCode()

// page hooks
const { empInfoData, setEmpInfoData } = useEmpInfoData()
const { expandIcon, insuredGrid, beneficiaryColumns, legalRepresentativeColumns, insuredCards, setInsuredData } =
  useInsured()
const {
  healthStatementGrid,
  healthStatementCardColumn,
  healthStatementData,
  isOpenHealthDeclarationModal,
  infoData: healthDeclarationInfoData,
  setHealthStatementData,
  handleHealthStatmentPreview,
  handleClose,
} = useHealthStatementData()
const { paymentMethodData, setPaymentMethodData, paymentDetailBefore, paymentDetailAfter } = usePayMethod()

onMounted(async () => {
  loadingStore.setLoading(true)
  await fetchPostalCode()
  await setEmpInfoData()
  await Promise.all([setPaymentMethodData(), setHealthStatementData(), setInsuredData()])
    .catch(error => console.error(error))
    .finally(() => loadingStore.setLoading(false))
})

// 申請資料與員工資料
function useEmpInfoData() {
  const empInfoData = ref<DescriptionsData[]>([])

  // API: 查詢員工基本資料題目設定
  const getEmpInfoConfig = (caseMainId: CaseMainIdDto): Promise<EmpInfoTopicConfigDto> => {
    return $selfPayEFormApi.getEmpInfoTopicConfigUsingPOST(caseMainId).then(resp => {
      if (resp.data.status === 200) {
        return resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  // API: 查詢已填寫之員工基本資料
  const getFilledInEmpInfo = (caseMainIdAndApplyInfo: CaseMainIdAndApplyInfoDto): Promise<FilledInEmpInfoDto> => {
    return $selfPayEFormApi.getFilledInEmpInfoUsingPOST(caseMainIdAndApplyInfo).then(resp => {
      if (resp.data.status === 200) {
        return resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  // 撈取所有相關員工資料
  const getEmpInfoData = async (): Promise<[EmpInfoTopicConfigDto, FilledInEmpInfoDto]> => {
    let empInfoData: [EmpInfoTopicConfigDto, FilledInEmpInfoDto] = [null, null]
    // TEST: 測試資料
    const caseMainIdAndApplyInfo: CaseMainIdAndApplyInfoDto = {
      applyId,
      caseMainId: userMe.caseMainId,
      crtNo: userMe.crtNo.trim(),
      policyNo: userMe.policyNo,
      policySeq: userMe.policySeq,
      times: userMe.times,
    }
    loadingStore.setLoading(true)
    await Promise.all([getEmpInfoConfig({ caseMainId: userMe.caseMainId }), getFilledInEmpInfo(caseMainIdAndApplyInfo)])
      .then(promiseResp => {
        empInfoData = promiseResp
      })
      .catch(error => console.error(error))
      .finally(() => loadingStore.setLoading(false))
    return empInfoData
  }

  // 取得與整理前端要顯示的資料格式
  const setEmpInfoData = async () => {
    const [empInfoConfig, filledInEmpInfo] = await getEmpInfoData()

    empInfoData.value = [
      {
        type: 'PLAIN',
        label: '申請編號',
        value: filledInEmpInfo?.applyId || '-',
        underline: true,
      },
      {
        type: 'PLAIN',
        label: '員工姓名',
        value: filledInEmpInfo?.name || '-',
        isShow: empInfoConfig?.empNameIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '身分證字號/居留證號',
        value: filledInEmpInfo?.idNo || '-',
        isShow: empInfoConfig?.idNoIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '生日',
        value: filledInEmpInfo?.birthday ? $dateTimeUtil.dateStringAddSlash(filledInEmpInfo?.birthday) : '-',
        isShow: empInfoConfig?.birthDateIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '部門',
        value: filledInEmpInfo?.department || '-',
        isShow: empInfoConfig?.departmentIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '廠別',
        value: filledInEmpInfo?.factoryType || '-',
        isShow: empInfoConfig?.factoryTypeIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '電子信箱',
        value: filledInEmpInfo?.email || '-',
        isShow: empInfoConfig?.emailIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '行動電話',
        value: filledInEmpInfo?.mobileNo || '-',
        isShow: empInfoConfig?.mobileNoIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '通訊地址',
        value: filledInEmpInfo?.postalCode
          ? `${filledInEmpInfo?.postalCode} ${getPostalAddress(filledInEmpInfo?.postalCode)}${
              filledInEmpInfo?.contactAddress
            }`
          : '-',
        isShow: empInfoConfig?.contactAddressIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '家庭年收入',
        value: filledInEmpInfo?.familyAnnualIncome ? `${filledInEmpInfo.familyAnnualIncome}萬元` : '-',
        isShow: empInfoConfig?.familyAnnualIncomeIsShow === 'Y' ? true : false,
      },
    ]
  }

  return {
    empInfoData,
    setEmpInfoData,
  }
}

// 被保險人資料
function useInsured() {
  const {
    basicCardLabelsList,
    bnfTableColumns,
    rpsCardLabels,
    cardDataList,
    tableData,
    insuredTableColumns,
    beneficiaryNestedTableColumns,
    legalRepresentativeNestedTableColumns,
    getInsuredData,
  } = useGetInsuredInfo()

  // 前端不顯示 action 為 'E'
  const filterCardDataList = computed(() => {
    if (!cardDataList.value || cardDataList.value.length === 0) return []
    return cardDataList.value.filter(data => data.action !== 'E')
  })

  // 受益人卡片
  const insuredCards = ref({
    basicCardLabelsList,
    bnfTableColumns,
    rpsCardLabels,
    cardDataList: filterCardDataList,
    bnfCardGridData: {
      rowKey: 'txCode',
      data: [],
      pagination: false,
      columns: bnfTableColumns,
      scroll: { x: 1000 },
    },
  })

  // 巢狀表格：法定代理人表格
  const legalRepresentativeColumns = ref(legalRepresentativeNestedTableColumns)
  // 巢狀表格：受益人表格
  const beneficiaryColumns = ref(beneficiaryNestedTableColumns)

  // 表格顯示資料不需顯示 action = E
  const insuredGridData = computed(() => {
    if (!tableData.value || tableData.value.length === 0) return []
    return tableData.value.filter(data => data.action !== 'E')
  })
  // 被保險人表格
  const insuredGrid = ref({
    rowKey: 'id',
    data: insuredGridData,
    columns: insuredTableColumns,
  })

  const expandIcon = function (props) {
    const iconClass = props.expanded
      ? 'ant-table-row-expand-icon ant-table-row-expand-icon-expanded'
      : 'ant-table-row-expand-icon ant-table-row-expand-icon-collapsed'
    if (props.record.beneficiaryList.length !== 0 || props.record.legalRepresentative.length !== 0) {
      return h('button', {
        class: iconClass,
        onClick: e => {
          props.onExpand(props.record, e)
        },
        style: {
          fontSize: '22px',
          verticalAlign: 'middle',
          cursor: 'pointer',
        },
      })
    }
    return null
  }

  const setInsuredData = async () => {
    await getInsuredData({ applyId, caseMainId: userMe.caseMainId })
  }

  return {
    expandIcon,
    insuredGrid,
    legalRepresentativeColumns,
    beneficiaryColumns,
    insuredCards,
    setInsuredData,
  }
}

// 被保險人健康聲明書資料
function useHealthStatementData() {
  const { healthStatementTableColumn, healthStatementCardColumn, healthStatementData, fetchHealthStatmentData } =
    useHealthStatement(false)

  const healthStatementGrid = ref({
    rowKey: 'key',
    data: healthStatementData,
    columns: healthStatementTableColumn,
  })

  const setHealthStatementData = () => {
    fetchHealthStatmentData({
      applyId: applyId,
      caseMainId: userMe.caseMainId,
    })
  }

  // 預覽聲明書彈窗
  const isOpenHealthDeclarationModal = ref<boolean>(false)

  const infoData = ref<HealthDeclarationInfoDto>({})

  const handleHealthStatmentPreview = async (data: HealthDeclarationInfoDto) => {
    infoData.value = data
    isOpenHealthDeclarationModal.value = true
  }

  const handleClose = () => {
    isOpenHealthDeclarationModal.value = false
  }

  return {
    healthStatementGrid,
    healthStatementCardColumn,
    healthStatementData,
    isOpenHealthDeclarationModal,
    infoData,
    setHealthStatementData,
    handleHealthStatmentPreview,
    handleClose,
  }
}

// 繳費方式
function usePayMethod() {
  let paymentMethodData = ref<DescriptionsData[]>([])
  const paymentDetailBefore = ref<EEmpPaymentDetailDto>(null)
  const paymentDetailAfter = ref<EEmpPaymentDetailDto>(null)

  // 信用卡卡號 format
  const crdCardNoFormat = (crdCardNo: string): string => {
    if (!crdCardNo) return ''
    return `****-****-****-${crdCardNo.slice(-4)}`
  }

  // API: 查詢繳費填寫內容
  const getPaymentDetail = async () => {
    const paymentDetailModel: PaymentDetailModel = {
      applyId,
      idNo: userMe.idNo,
      crtNo: userMe.crtNo,
      policyNo: userMe.policyNo,
      policySeq: userMe.policySeq,
      times: userMe.times,
    }

    let data: PaymentDetailDto = null
    await $selfPayEFormApi.getPaymentDetailUsingPOST(paymentDetailModel).then(resp => {
      console.log('resp', resp)
      if (resp.data.status === 200) {
        data = resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp.data.apiError),
        })
      }
    })
    return data
  }

  // 查詢扣款銀行清單
  const getTraBankOption = async (): Promise<{ [key: string]: string }> => {
    let data: { [key: string]: string } = null
    await $selfPayEFormApi.getTraBankOptionUsingPOST(userMe.caseMainId).then(resp => {
      console.log('resp', resp)
      if (resp.data.status === 200) {
        data = resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp.data.apiError),
        })
      }
    })
    return data
  }

  // 查詢信用卡銀行清單
  const getCardBankOption = async (): Promise<{ [key: string]: string }> => {
    let data: { [key: string]: string } = null
    await $commonApi.getCardBankOptionUsingPOST().then(resp => {
      console.log('resp', resp)
      if (resp.data.status === 200) {
        data = resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp.data.apiError),
        })
      }
    })
    return data
  }

  const setPaymentMethodData = async () => {
    loadingStore.setLoading(true)
    let paymentDetail: PaymentDetailDto = null
    let traBankMap: { [key: string]: string } = null
    let cardBankMap: { [key: string]: string } = null
    await Promise.all([getPaymentDetail(), getTraBankOption(), getCardBankOption()])
      .then(resp => {
        paymentDetail = resp[0]
        traBankMap = resp[1]
        cardBankMap = resp[2]
      })
      .catch(error => console.error(error))

    paymentDetailBefore.value = paymentDetail.before
    paymentDetailAfter.value = paymentDetail.after
    paymentMethodData.value = [
      {
        type: 'PLAIN',
        label: '繳費方式',
        value: $giseEnum.getLabel('paymentMethod', paymentDetailAfter.value?.method),
      },
      {
        type: 'PLAIN',
        label: '授權人', // 員工姓名
        value: empInfoData?.value.find(empInfo => empInfo.label === '員工姓名').value,
        isShow: paymentDetailAfter.value?.method === 'T' || paymentDetailAfter.value?.method === 'C',
      },
      {
        type: 'PLAIN',
        label: '發卡銀行',
        value: cardBankMap?.[paymentDetailAfter.value?.crdBank] || '',
        isShow: paymentDetailAfter.value?.method === 'C',
      },
      {
        type: 'PLAIN',
        label: '卡號',
        // 卡號若沒有修改需要碼
        value:
          paymentDetailAfter.value?.crdCardNo === paymentDetail?.before?.crdCardNo
            ? crdCardNoFormat(paymentDetailAfter.value?.crdCardNo)
            : paymentDetailAfter.value?.crdCardNo,
        isShow: paymentDetailAfter.value?.method === 'C',
      },
      {
        type: 'PLAIN',
        label: '到期日(月/年)',
        value: `${paymentDetailAfter.value?.crdExpMon}/${paymentDetailAfter.value?.crdExpYear}`,
        isShow: paymentDetailAfter.value?.method === 'C',
      },
      {
        type: 'PLAIN',
        label: '扣款銀行',
        value: traBankMap?.[paymentDetailAfter.value?.traBank] || '',
        isShow: paymentDetailAfter.value?.method === 'T',
      },
      {
        type: 'PLAIN',
        label: '銀行帳號',
        value: paymentDetailAfter.value?.traAccountNo,
        isShow: paymentDetailAfter.value?.method === 'T',
      },
    ]
    loadingStore.setLoading(false)
  }
  return {
    paymentMethodData,
    setPaymentMethodData,
    paymentDetailBefore,
    paymentDetailAfter,
  }
}

const situation: 'applyArea' | 'searchArea' = $global.getQuery<any>()?.situation

// 頁面跳轉
function handleToPage(routerName: string): void {
  $global.changeRouterAndaddParam({
    toRouter: routerName,
    query: { situation },
  })
}

// 比對 string 物件 前後資料是否有修改
const compareStringObjectBeforeAndAfter = (
  before: { [key: string]: string },
  after: { [key: string]: string },
): boolean => {
  if (!before && !after) return false
  if ((!before && after) || (before && !after)) return true
  return Object.entries(before).some(([key, beforeValue]) => {
    return beforeValue !== after?.[key]
  })
}

// 是否可以按完成送出
const isShowConfirmBtn = computed(() => {
  // 被保險人沒有資料 && 繳費方式沒有被修改 = 沒有資料被修改 => 不能送出
  const isPaymentModified: boolean = compareStringObjectBeforeAndAfter(
    paymentDetailBefore.value,
    paymentDetailAfter.value,
  )
  if ((!insuredGrid.value.data || insuredGrid.value.data.length === 0) && !isPaymentModified) return false
  return true
})
// 送出前，確認彈窗
function handleConfirmModal() {
  $modal.confirm({
    title: '您確定要送出嗎？',
    content: '『完成送出』後即不能變更資料，如需變更請於自費表單文件修改，並於塗改處簽名或蓋章。',
    okText: '確定',
    onOk() {
      submitApplication({ applyId })
    },
  })
}

// API: 完成送出E填表
function submitApplication(applyId: ApplyIdDto) {
  loadingStore.setLoading(true)
  $selfPayEFormApi
    .submitApplicationUsingPOST(applyId)
    .then(resp => {
      if (resp.data.status === 200) {
        if (resp.data.data.success) {
          $global.changeRouterAndaddParam({
            toRouter: 'SubmitApplication',
          })
        } else {
          $modal.error({
            title: '送出失敗',
          })
        }
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
    .finally(() => loadingStore.setLoading(false))
}

function handleDownload(fileId: string) {
  loadingStore.setLoading(true)
  downloadFile({ fileId, source: 'emp' })
  loadingStore.setLoading(false)
}
</script>
<template>
  <div class="flex items-center pb-2 lg:pb-4">
    <img
      class="mr-2 h-[60px] w-[60px] rounded-full shadow-[0_0px_12px_rgba(0,0,0,0.08)]"
      :src="customerserviceSVG"
      alt="提醒訊息圖片"
    />
    <div class="flex-1 px-[14px] py-2 shadow-[0_0px_12px_rgba(0,0,0,0.08)] md:py-6 md:text-lg lg:py-5 lg:text-2xl">
      感謝您填寫團險自費E填表表單，請<span class="font-bold">再次確認填寫資料</span>
      是否正確無誤，謝謝。
    </div>
  </div>
  <CardShadowAngle class="lg:my-4" title="申請資料&員工資料" @edit="handleToPage('EmployeeData')">
    <Descriptions class="-mt-[8px] lg:mb-3" :column="2" :data="empInfoData" />
  </CardShadowAngle>
  <CardShadowAngle class="lg:my-4" title="被保險人申請資料" @edit="handleToPage('InsuredData')">
    <FblDataGrid
      class="hidden md:mt-2 md:block lg:mt-[14px]"
      :rowKey="insuredGrid.rowKey"
      :dataSource="insuredGrid.data"
      :columns="insuredGrid.columns"
      :pagination="false"
      :expandRowByClick="false"
      :expandIcon="expandIcon"
      :scroll="{ x: 'max-content' }"
      :isExpandedRowRender="true"
    >
      <template #action="{ scope: { record } }">
        <BadgeDot :type="record.color" :text="record.title"></BadgeDot>
      </template>

      <template #fileInfo="{ scope: { record } }">
        <div class="flex gap-2" v-if="record.fileInfo.length > 0">
          <div class="flex flex-1 items-center" v-for="atch in record.fileInfo" :key="atch.fileId.value">
            <paper-clip-outlined class="text-base text-[#595959] lg:text-lg" />
            <a href="#" class="ml-[5px] text-base text-[#1890FF]" @click.prevent="handleDownload(atch.fileId.value)">
              {{ atch.originalFileName.value }}
            </a>
          </div>
        </div>
      </template>

      <template #expandedRowRender="{ index }">
        <div class="pl-12">
          <FblDataGrid
            v-if="insuredGrid.data[index].beneficiaryList.length !== 0"
            class="gise-beneficiary-table"
            :columns="beneficiaryColumns"
            :data-source="insuredGrid.data[index].beneficiaryList"
            :pagination="false"
          />
          <FblDataGrid
            v-if="insuredGrid.data[index].legalRepresentative.length !== 0"
            class="gise-legal-representative-tabel"
            :columns="legalRepresentativeColumns"
            :data-source="insuredGrid.data[index].legalRepresentative"
            :pagination="false"
          />
        </div>
      </template>
    </FblDataGrid>
    <div class="mt-3 md:hidden">
      <div
        v-if="insuredCards.cardDataList.length > 0"
        class="grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
      >
        <CardInfo
          v-for="(insuredData, index) in insuredCards.cardDataList"
          :key="index"
          :title="insuredData.title"
          :type="insuredData.type"
          :columns="insuredCards.basicCardLabelsList[index]"
          :data="insuredData.insuredInfo"
          :class="insuredData.action === 'D' ? 'text-neutral-entry' : 'text-black'"
        >
          <template #customCell="{ data, column }">
            <span
              class="flex-1 text-right font-semibold"
              :class="insuredData.action === 'M' && data[column.key]?.isEdit && 'text-warning'"
            >
              {{ data[column.key]?.value }}
            </span>
          </template>
          <FblDataGrid
            v-if="insuredData.insuredInfo.benType.value == '指定受益人' && insuredData.beneficiaryList"
            class="mx-[-1rem] mb-2"
            :dataSource="insuredData.beneficiaryList"
            :columns="insuredCards.bnfCardGridData.columns"
            :scroll="insuredCards.bnfCardGridData.scroll"
            :pagination="insuredCards.bnfCardGridData.pagination"
            :size="'small'"
          >
            <template #proportion="{ scope: { text } }"> {{ text }} </template>
          </FblDataGrid>
          <div v-if="insuredData.action === 'M' && insuredData.fileInfo.length > 0" class="flex pb-2">
            <span class="flex-1">附件</span>
            <div>
              <div
                class="mb-2 flex flex-1 items-center justify-end text-right"
                v-for="atch in insuredData.fileInfo"
                :key="atch.fileId.value"
              >
                <paper-clip-outlined class="text-base text-[#595959] lg:text-lg" />
                <a
                  href="#"
                  class="ml-[5px] text-base text-[#1890FF]"
                  @click.prevent="handleDownload(atch.fileId.value)"
                >
                  {{ atch.originalFileName.value }}
                </a>
              </div>
            </div>
          </div>
          <div
            v-if="insuredData.legalRepresentative && Object.values(insuredData.legalRepresentative).some(el => el)"
            class="relative border-t border-dashed border-neutral-entry pt-2"
          >
            <span class="absolute right-[calc((100%-(5*12px))/2)] top-[-9px] bg-white px-1 text-sm text-neutral-entry">
              法定代理人
            </span>
            <div class="flex pb-2" v-for="(labelInfo, labelIdx) in insuredCards.rpsCardLabels" :key="labelIdx">
              <span class="flex-1">{{ labelInfo.label }}</span>
              <span class="flex-1 text-right font-semibold">
                {{
                  insuredData.legalRepresentative[labelInfo.key] && insuredData.legalRepresentative[labelInfo.key].value
                }}
              </span>
            </div>
          </div>
        </CardInfo>
      </div>
    </div>
  </CardShadowAngle>
  <CardShadowAngle class="sm:pb-3 lg:my-4" title="被保險人健康聲明書" @edit="handleToPage('HealthStatement')">
    <FblDataGrid
      class="mt-3 hidden md:block"
      :dataSource="healthStatementGrid.data"
      :columns="healthStatementGrid.columns"
      :pagination="false"
    >
      <template #status="{ scope: { value } }">
        <BadgeDot :type="value.color" :text="value.label"></BadgeDot>
      </template>

      <template #preview="{ scope: { record } }">
        <div>
          <ButtonIconic
            :hover-white="true"
            btnStyle="primary"
            tooltip="預覽"
            :disabled="record.status?.label === '不需填寫' || record.hdid === null"
            @click="handleHealthStatmentPreview(record)"
          >
            <img :src="searchSVG" alt="預覽圖片" />
          </ButtonIconic>
        </div>
      </template>
    </FblDataGrid>
    <div class="mt-3 md:hidden">
      <CardInfo
        v-for="(cardItem, index) in healthStatementData"
        class="mb-4"
        :key="index"
        :title="`健康聲明書 : ${cardItem?.status?.label}`"
        :type="cardItem?.status?.color"
        :columns="healthStatementCardColumn"
        :data="cardItem"
      >
        <template #headerControl>
          <ButtonRectangle
            :disabled="cardItem.status?.label === '不需填寫' || cardItem.hdid === null"
            btnStyle="secondary"
            @click="handleHealthStatmentPreview(cardItem)"
          >
            預覽
          </ButtonRectangle>
        </template>
      </CardInfo>
    </div>
  </CardShadowAngle>
  <CardShadowAngle class="lg:my-4" title="繳費方式" @edit="handleToPage('PaymentApproach')">
    <Descriptions class="md:mt-[-8px]" :column="2" :data="paymentMethodData" />
  </CardShadowAngle>

  <div class="mt-4 flex justify-center lg:mt-6">
    <ButtonRoundedSecondary @click="handleToPage('PaymentApproach')">上一步</ButtonRoundedSecondary>
    <ButtonRoundedPrimary
      class="ml-[15px] md:ml-[16px] lg:ml-[32px]"
      :disabled="!isShowConfirmBtn"
      @click="handleConfirmModal"
      >完成送出</ButtonRoundedPrimary
    >
  </div>

  <!-- 健康聲明書彈窗 -->
  <ModalMain
    v-model:visible="isOpenHealthDeclarationModal"
    title="被保險人健康聲明書"
    width="824px"
    :maskClosable="true"
  >
    <template #content>
      <HealthDeclarationForm
        v-model:isOpenModal="isOpenHealthDeclarationModal"
        :isEdit="false"
        :infoData="healthDeclarationInfoData"
        @close="handleClose"
      ></HealthDeclarationForm>
    </template>
    <template #footer>
      <div class="mb-4 flex justify-center md:mb-0">
        <ButtonRoundedPrimary @click="handleClose">關閉</ButtonRoundedPrimary>
      </div>
    </template>
  </ModalMain>
</template>

<style scoped></style>
