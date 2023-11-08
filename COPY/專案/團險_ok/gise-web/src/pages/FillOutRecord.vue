<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, h, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@stores/index'
import { useGetInsuredInfo } from '@/composables/useGetInsuredInfo'
import { useDownloadFile } from '@/composables/useDownloadFile'
import { useHealthStatement } from '@/composables/useHealthStatement'
import { usePostalCode } from '@/composables/usePostalCode'
import type {
  StatusDto,
  ReviewDto,
  CaseMainIdDto,
  EmpInfoTopicConfigDto,
  CaseMainIdAndApplyInfoDto,
  FilledInEmpInfoDto,
  ApplyIdDto,
  FileIdDto,
  ApplyIdAndFileIdDto,
  PaymentDetailModel,
  PaymentDetailDto,
  HealthDeclarationInfoDto,
} from '@fubonlife/gise-api-axios-sdk'
import type { DescriptionsData } from '@shared/Descriptions.vue'
import downloadSVG from '@/assets/imgs/Icon_download.svg?url'
import sendSVG from '@/assets/imgs/Icon_send.svg?url'
import searchSVG from '@assets/imgs/button_search.svg?url'
import editSVG from '@assets/imgs/button_edit.svg?url'

export interface HealthStatementCard {
  hDId?: string
  status?: string
  type?: string
  title?: string
  insattr: string
  name: string
  policyplan: string
}

interface DataStatus {
  type: string
  label: string
}

interface ReviewCard {
  label: string
  value: string
}

interface ReviewGridData extends ReviewDto {
  dataStatus: DataStatus
  cardData: ReviewCard[]
}

interface AllReviewStatus {
  saveDate: string
  action: string
}

const {
  proxy: { $giseEnum, $selfPayEFormApi, $dateTimeUtil, $modal, $global, $user, $commonApi },
} = getCurrentInstance()

// global
const $router = useRouter()
const loadingStore = useLoadingStore()
const userMe = $user.getMe()
// composables
const { downloadFile } = useDownloadFile()
const { fetchPostalCode, getPostalAddress } = usePostalCode()

// page hooks
const { isModalMainVisible, openModalMain, closeModalMain } = useModalMain()
const { empInfoData, setEmpInfoData } = useModalEmpInfoData()
const { reviewGrid, handlePreview, handleEdit, isShowReviewTable } = useReview()
const {
  healthStatementGrid,
  healthStatementCardColumn,
  healthStatementData,
  isOpenHealthDeclarationModal,
  infoData: healthDeclarationInfoData,
  setHealthStatementData,
  handleHealthStatmentPreview,
  handleClose,
} = useModalHealthStatement()
const { expandIcon, insuredGrid, beneficiaryColumns, legalRepresentativeColumns, insuredCards, setInsuredData } =
  useModalInsured()
const { paymentMethodData, setPaymentMethodData } = useModalPayMethod()
const { handleDownloadSelfFile, handleSendEmail } = useModalDownloadSendFile()

// 當前彈窗操作的紀錄
let currentReview = ref<ReviewGridData>(null)

onMounted(() => {
  $global.clearParam()
  $global.handleApplyId('Delete')
})

// 查詢紀錄資料
function useReview() {
  const isShowReviewTable = ref<boolean>(false)
  let rawReviewList = ref<ReviewDto[]>([])

  // table 資料
  const reviewGrid = ref({
    rowKey: 'applyId',
    data: [],
    columns: [],
  })

  // table colunms
  const getReviewGridColumn = (reviewGridData: ReviewGridData[]) => {
    const allReviewStatus: AllReviewStatus = reviewGridData.find(raw => raw.caseStatus === '0')
      ? { saveDate: '儲存時間', action: '修改' }
      : { saveDate: '送出時間', action: '預覽' }
    return [
      {
        type: 'PLAIN',
        title: '申請編號',
        dataIndex: 'applyId',
        key: 'applyId',
      },
      {
        type: 'TEMPLATE',
        title: '資料狀態',
        dataIndex: 'caseStatus',
        key: 'caseStatus',
        bodyCellTemp: 'caseStatus',
      },
      {
        type: 'PLAIN',
        title: allReviewStatus.saveDate,
        dataIndex: 'saveDate',
        key: 'saveDate',
        formatter: data => {
          if (data.caseStatus === '0' || data.caseStatus === '1') return data.saveDate
          return null
        },
      },
      {
        type: 'PLAIN',
        title: '退件時間',
        dataIndex: 'returnDate',
        key: 'returnDate',
        formatter: data => {
          if (data.caseStatus === '2') return data.saveDate
          return null
        },
      },
      {
        type: 'PLAIN',
        title: '退件原因',
        dataIndex: 'rejectReason',
        key: 'rejectReason',
      },
      {
        type: 'TEMPLATE',
        title: allReviewStatus.action,
        dataIndex: 'action',
        fixed: 'right',
        bodyCellTemp: 'action',
      },
    ]
  }

  // 將案件狀態轉成顏色與中文狀態組合(table狀態顯示使用)
  const setDataStatus = (caseStatus: string): DataStatus => {
    const dataStatus = $giseEnum.getObject('dataStatus', caseStatus)
    return {
      type: dataStatus.color,
      label: dataStatus.label,
    }
  }

  // 整理卡片顯示所需資料
  const setCardData = (reviewData: ReviewDto): ReviewCard[] => {
    const saveDate: string = $dateTimeUtil.transformRocDate(reviewData.saveDate)
    // 未完成
    if (reviewData.caseStatus === '0')
      return [
        { label: '申請編號', value: reviewData.applyId },
        {
          label: '儲存時間',
          value: saveDate,
        },
      ]

    // 完成送出
    if (reviewData.caseStatus === '1')
      return [
        { label: '申請編號', value: reviewData.applyId },
        {
          label: '送出時間',
          value: saveDate,
        },
      ]

    // 退件
    if (reviewData.caseStatus === '2')
      return [
        { label: '申請編號', value: reviewData.applyId },
        {
          label: '退件時間',
          value: saveDate,
        },
        {
          label: '退件原因',
          value: reviewData.rejectReason,
        },
      ]
  }

  // API: 取得紀錄
  const getReview = async (): Promise<ReviewDto[]> => {
    const status: StatusDto = {
      caseMainId: userMe?.caseMainId,
      userId: userMe?.accountId,
    }
    let data: ReviewDto[] = null
    await $selfPayEFormApi.getReviewStatusUsingPOST(status).then(resp => {
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

  // 將API回傳資料整理成前端使用的資料
  const getGridData = (rawData: ReviewDto[]): ReviewGridData[] => {
    return rawData.map(raw => ({
      ...raw,
      saveDate: $dateTimeUtil.transformRocDate(raw.saveDate),
      dataStatus: setDataStatus(raw.caseStatus),
      cardData: setCardData(raw),
    }))
  }

  onMounted(async () => {
    loadingStore.setLoading(true)
    await fetchPostalCode()
    rawReviewList.value = await getReview()

    if (rawReviewList.value && rawReviewList.value.length > 0) {
      reviewGrid.value.data = getGridData(rawReviewList.value)
    }
    reviewGrid.value.columns = getReviewGridColumn(reviewGrid.value.data)
    isShowReviewTable.value = true
    loadingStore.setLoading(false)
  })

  // 預覽
  const handlePreview = (review: ReviewGridData) => {
    currentReview.value = review
    openModalMain()
  }

  // 修改
  const handleEdit = (review: ReviewGridData) => {
    if (!review.applyId) return
    $global.handleApplyId('Set', review.applyId)
    $selfPayEFormApi
      .getFilledInEmpInfoUsingPOST({ caseMainId: userMe.caseMainId, applyId: review.applyId })
      .then(resp => {
        const respData = resp?.data
        if (respData.status === 200) {
          $global.changeRouterAndaddParam({
            toRouter: 'EmployeeData',
            query: { situation: 'searchArea' },
          })
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(resp?.data?.apiError),
          })
        }
      })
      .finally(() => loadingStore.setLoading(false))
  }

  return {
    reviewGrid,
    handlePreview,
    handleEdit,
    isShowReviewTable,
  }
}

// 預覽彈窗:申請資料與員工資料
function useModalEmpInfoData() {
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

    const caseMainIdAndApplyInfo: CaseMainIdAndApplyInfoDto = {
      applyId: currentReview.value.applyId,
      caseMainId: userMe.caseMainId,
      crtNo: userMe.crtNo.trim(),
      policyNo: userMe.policyNo,
      policySeq: userMe.policySeq,
      times: userMe.times,
    }
    loadingStore.setLoading(true)
    await Promise.all([
      getEmpInfoConfig({ caseMainId: currentReview.value.caseMainId }),
      getFilledInEmpInfo(caseMainIdAndApplyInfo),
    ])
      .then(promiseResp => {
        empInfoData = promiseResp
      })
      .catch(error => console.error(error))
      .finally(() => loadingStore.setLoading(false))
    return empInfoData
  }

  // 取得與整理前端要顯示的資料格式
  const setEmpInfoData = async () => {
    loadingStore.setLoading(true)
    const [empInfoConfig, filledInEmpInfo] = await getEmpInfoData()
    empInfoData.value = [
      {
        type: 'PLAIN',
        label: '申請編號',
        value: filledInEmpInfo.applyId || '-',
      },
      {
        type: 'PLAIN',
        label: '申請日期',
        value: currentReview.value.saveDate || '-',
        underline: true,
      },
      {
        type: 'PLAIN',
        label: '員工姓名',
        value: filledInEmpInfo.name || '-',
        isShow: empInfoConfig?.empNameIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '身分證字號/居留證號',
        value: filledInEmpInfo.idNo || '-',
        isShow: empInfoConfig?.idNoIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '生日',
        value: filledInEmpInfo.birthday ? $dateTimeUtil.dateStringAddSlash(filledInEmpInfo.birthday) : '-',
        isShow: empInfoConfig?.birthDateIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '部門',
        value: filledInEmpInfo.department || '-',
        isShow: empInfoConfig?.departmentIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '廠別',
        value: filledInEmpInfo.factoryType || '-',
        isShow: empInfoConfig?.factoryTypeIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '電子信箱',
        value: filledInEmpInfo.email || '-',
        isShow: empInfoConfig?.emailIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '行動電話',
        value: filledInEmpInfo.mobileNo || '-',
        isShow: empInfoConfig?.mobileNoIsShow === 'Y' ? true : false,
      },
      {
        type: 'PLAIN',
        label: '通訊地址',
        value: filledInEmpInfo.postalCode
          ? `${filledInEmpInfo.postalCode} ${getPostalAddress(filledInEmpInfo.postalCode)}${
              filledInEmpInfo.contactAddress
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
    loadingStore.setLoading(false)
  }

  return {
    empInfoData,
    setEmpInfoData,
  }
}

// 預覽彈窗:被保險人資料
function useModalInsured() {
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
    loadingStore.setLoading(true)
    await getInsuredData({ applyId: currentReview.value.applyId, caseMainId: userMe.caseMainId })
    loadingStore.setLoading(false)
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

// 預覽彈窗:被保險人健康聲明書資料
function useModalHealthStatement() {
  const { healthStatementTableColumn, healthStatementCardColumn, healthStatementData, fetchHealthStatmentData } =
    useHealthStatement(false)

  const healthStatementGrid = ref({
    rowKey: 'key',
    data: healthStatementData,
    columns: healthStatementTableColumn,
  })

  const setHealthStatementData = async () => {
    loadingStore.setLoading(true)
    await fetchHealthStatmentData({
      applyId: currentReview.value.applyId,
      caseMainId: currentReview.value.caseMainId,
    })
    loadingStore.setLoading(false)
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

// 預覽彈窗:繳費方式
function useModalPayMethod() {
  let paymentMethodData = ref<DescriptionsData[]>([])

  // 信用卡卡號 format
  const crdCardNoFormat = (crdCardNo: string): string => {
    if (!crdCardNo) return ''
    return `****-****-****-${crdCardNo.slice(-4)}`
  }

  // API: 查詢繳費填寫內容
  const getPaymentDetail = async () => {
    // TEST: 測試資料
    const paymentDetailModel: PaymentDetailModel = {
      applyId: currentReview.value.applyId,
      idNo: userMe.idNo,
      crtNo: userMe.crtNo.trim(),
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

    const paymentDetailAfter = paymentDetail.after
    paymentMethodData.value = [
      {
        type: 'PLAIN',
        label: '繳費方式',
        value: $giseEnum.getLabel('paymentMethod', paymentDetailAfter?.method),
      },
      {
        type: 'PLAIN',
        label: '授權人', // 員工姓名
        value: empInfoData?.value.find(empInfo => empInfo.label === '員工姓名').value,
        isShow: paymentDetailAfter?.method === 'T' || paymentDetailAfter?.method === 'C',
      },
      {
        type: 'PLAIN',
        label: '發卡銀行',
        value: cardBankMap?.[paymentDetailAfter?.crdBank],
        isShow: paymentDetailAfter?.method === 'C',
      },
      {
        type: 'PLAIN',
        label: '卡號',
        // 卡號若沒有修改需要碼
        value:
          paymentDetailAfter?.crdCardNo === paymentDetail?.before?.crdCardNo
            ? crdCardNoFormat(paymentDetailAfter?.crdCardNo)
            : paymentDetailAfter?.crdCardNo,
        isShow: paymentDetailAfter?.method === 'C',
      },
      {
        type: 'PLAIN',
        label: '到期日(月/年)',
        value: `${paymentDetailAfter?.crdExpMon}/${paymentDetailAfter?.crdExpYear}`,
        isShow: paymentDetailAfter?.method === 'C',
      },
      {
        type: 'PLAIN',
        label: '扣款銀行',
        value: traBankMap?.[paymentDetailAfter.traBank] || '',
        isShow: paymentDetailAfter?.method === 'T',
      },
      {
        type: 'PLAIN',
        label: '銀行帳號',
        value: paymentDetailAfter?.traAccountNo,
        isShow: paymentDetailAfter?.method === 'T',
      },
    ]
    loadingStore.setLoading(false)
  }
  return {
    paymentMethodData,
    setPaymentMethodData,
  }
}

function useModalMain() {
  let isModalMainVisible = ref<boolean>(false)
  const openModalMain = async () => {
    isModalMainVisible.value = true
    await setEmpInfoData()
    setHealthStatementData()
    setPaymentMethodData()
    setInsuredData()
  }

  const closeModalMain = () => {
    isModalMainVisible.value = false
  }

  return {
    isModalMainVisible,
    openModalMain,
    closeModalMain,
  }
}

// 返回
function handleGoBack() {
  $router.push({ path: '/index' })
}

// 團險自費表單文件下載或寄送至電子信箱
function useModalDownloadSendFile() {
  // API: 查詢完成送出下載表單文件資訊
  const getCompleteRecordDownloadInfo = async (applyId: ApplyIdDto): Promise<FileIdDto> => {
    let fileId: FileIdDto = null
    await $selfPayEFormApi.getCompleteRecordDownloadInfoUsingPOST(applyId).then(resp => {
      if (resp.data.status === 200) {
        fileId = resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
    return fileId
  }

  // API: 寄送E填表
  const sendEmail = (applyIdAndFileId: ApplyIdAndFileIdDto): Promise<void> => {
    return $selfPayEFormApi.mailApplicationUsingPOST(applyIdAndFileId).then(resp => {
      if (resp.data.status === 200) {
        console.log('resp', resp)
        if (resp.data.data.success) {
          $modal.success({
            title: '寄送成功',
          })
        } else {
          $modal.error({
            title: '寄送失敗',
          })
        }
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  const handleDownloadSelfFile = async () => {
    loadingStore.setLoading(true)
    const fileId: FileIdDto = await getCompleteRecordDownloadInfo({
      applyId: currentReview.value.applyId,
    })
    if (fileId) await handleDownload(fileId.fileId)
    loadingStore.setLoading(false)
  }

  const handleSendEmail = async () => {
    loadingStore.setLoading(true)
    const fileId: FileIdDto = await getCompleteRecordDownloadInfo({
      applyId: currentReview.value.applyId,
    })
    if (fileId) {
      const applyIdAndFileId: ApplyIdAndFileIdDto = {
        applyId: currentReview.value.applyId,
        fileId: fileId.fileId,
      }
      await sendEmail(applyIdAndFileId)
    }
    loadingStore.setLoading(false)
  }

  return {
    handleDownloadSelfFile,
    handleSendEmail,
  }
}
async function handleDownload(fileId: string) {
  loadingStore.setLoading(true)
  await downloadFile({ fileId, source: 'emp' })
  loadingStore.setLoading(false)
}
</script>
<template>
  <div class="pt-4" v-if="isShowReviewTable">
    <FblDataGrid
      class="hidden md:block"
      :rowKey="reviewGrid.rowKey"
      :dataSource="reviewGrid.data"
      :columns="reviewGrid.columns"
      :pagination="false"
    >
      <template #caseStatus="{ scope: { record } }">
        <BadgeDot :type="record.dataStatus.type" :text="record.dataStatus.label"></BadgeDot>
      </template>

      <template #action="{ scope: { record } }">
        <div>
          <ButtonIconic
            v-if="record.caseStatus === '0'"
            :hover-white="true"
            btnStyle="primary"
            tooltip="修改"
            @click="handleEdit(record)"
          >
            <img :src="editSVG" alt="修改圖示" />
          </ButtonIconic>
          <ButtonIconic
            v-if="record.caseStatus === '1'"
            :hover-white="true"
            btnStyle="primary"
            tooltip="預覽"
            @click="handlePreview(record)"
          >
            <img :src="searchSVG" alt="預覽圖示" />
          </ButtonIconic>
        </div>
      </template>
    </FblDataGrid>
    <div class="md:hidden">
      <template v-for="review in reviewGrid.data" :key="review.applyId">
        <CardInfo class="mb-4" :type="review.dataStatus.type" :title="`資料狀態：${review.dataStatus.label}`">
          <template #headerControl>
            <ButtonRectangle v-if="review.caseStatus === '0'" btnStyle="secondary" @click="handleEdit(review)">
              修改
            </ButtonRectangle>
            <ButtonRectangle v-if="review.caseStatus === '1'" btnStyle="secondary" @click="handlePreview(review)">
              預覽
            </ButtonRectangle>
          </template>
          <div class="grid w-full grid-cols-4 gap-x-4 gap-y-2">
            <template v-for="(info, index) in review.cardData" :key="index">
              <div class="col-span-1">{{ info.label }}</div>
              <div class="col-span-3 text-right font-semibold">{{ info.value }}</div>
            </template>
          </div>
        </CardInfo>
      </template>
    </div>
  </div>
  <CardNotice class="md:mt-4">
    <template #description>
      <ul class="list-decimal pl-4">
        <li>資料狀態為未完成可點選『修改』進入畫面，繼續先前未完成之資料。</li>
        <li>
          資料已完成送出後，即無法進行修改變更，僅可點選『預覽』加保套印畫面，如欲修改變更，請以紙本填寫後重新送件給貴公司承辦人員。
        </li>
      </ul>
    </template>
  </CardNotice>
  <div class="mt-8 text-center">
    <ButtonRoundedPrimary @click="handleGoBack">返回</ButtonRoundedPrimary>
  </div>

  <!-- 預覽資料彈窗 -->
  <ModalMain
    v-if="currentReview"
    :title="`申請編號：${currentReview.applyId}`"
    :width="1120"
    v-model:visible="isModalMainVisible"
    :destroyOnClose="true"
  >
    <template #content>
      <FormTitle title="申請資料&員工資料" />
      <Descriptions class="-mt-[8px] lg:mb-3" :column="2" :data="empInfoData" />

      <FormTitle class="my-4" title="被保險人資料" />
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
              <span
                class="absolute right-[calc((100%-(5*12px))/2)] top-[-9px] bg-white px-1 text-sm text-neutral-entry"
              >
                法定代理人
              </span>
              <div class="flex pb-2" v-for="(labelInfo, labelIdx) in insuredCards.rpsCardLabels" :key="labelIdx">
                <span class="flex-1">{{ labelInfo.label }}</span>
                <span class="flex-1 text-right font-semibold">
                  {{
                    insuredData.legalRepresentative[labelInfo.key] &&
                    insuredData.legalRepresentative[labelInfo.key].value
                  }}
                </span>
              </div>
            </div>
          </CardInfo>
        </div>
      </div>

      <FormTitle class="my-4" title="被保險人健康聲明書" />
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

      <FormTitle class="my-4" title="繳費方式" />
      <Descriptions class="-mt-[8px] lg:mb-3" :column="2" :data="paymentMethodData" />

      <FormTitle class="my-4" title="團險自費表單文件下載或寄送至電子信箱" />
      <div class="mt-3 flex gap-4 lg:gap-5">
        <ButtonIconicLarge @click="handleDownloadSelfFile">
          <template #icon>
            <img :src="downloadSVG" alt="下載表單文件圖片" />
          </template>
          <template #text>
            <div class="text-lg lg:text-xl">下載表單文件</div>
          </template>
        </ButtonIconicLarge>
        <ButtonIconicLarge @click="handleSendEmail">
          <template #icon>
            <img :src="sendSVG" alt="寄送至Email圖片" />
          </template>
          <template #text>
            <div class="text-lg lg:text-xl">寄送至Email</div>
          </template>
        </ButtonIconicLarge>
      </div>
    </template>
    <template #footer>
      <div class="text-center">
        <ButtonRoundedPrimary class="mx-auto" @click="closeModalMain">關閉</ButtonRoundedPrimary>
      </div>
    </template>
  </ModalMain>

  <!-- 健康聲明書彈窗 -->
  <ModalMain
    v-model:visible="isOpenHealthDeclarationModal"
    title="被保險人健康聲明書"
    width="824px"
    :maskClosable="true"
    @close="handleClose"
  >
    <template #content>
      <HealthDeclarationForm
        v-model:isOpenModal="isOpenHealthDeclarationModal"
        :isEdit="false"
        :infoData="healthDeclarationInfoData"
      ></HealthDeclarationForm>
    </template>
    <template #footer>
      <div class="mb-4 flex justify-center md:mb-0">
        <ButtonRoundedSecondary @click="handleClose">關閉</ButtonRoundedSecondary>
      </div>
    </template>
  </ModalMain>
</template>
<style scoped></style>
