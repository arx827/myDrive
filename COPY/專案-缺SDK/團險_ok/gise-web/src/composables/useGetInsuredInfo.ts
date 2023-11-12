import { getCurrentInstance, ref, watch, onMounted } from 'vue'
import { useNationalities } from '@/composables/useNationalities'
import { usePostalCode } from '@/composables/usePostalCode'
import { useRelation } from '@/composables//useRelation'
import { useLoadingStore } from '@/stores'

import type {
  InsuredInfoDto,
  InsuredInfoModel,
  LegalRepresentativeModel,
  BeneficiaryModel,
  CaseInsureDto,
  FileInfoDto,
  CaseMainIdAndApplyIdDto,
} from '@fubonlife/gise-api-axios-sdk'
interface InsuredCardLabel {
  key: string
  label: string
}
interface CardButton {
  style: 'primary' | 'secondary' | 'danger'
  text: string
  type: string
  action: string
}

export interface InsuredInfo extends Omit<InsuredInfoModel, 'beneficiaryList' | 'legalRepresentative' | 'fileInfo'> {}

enum TableColumnType {
  TEMPLATE = 'TEMPLATE',
  PLAIN = 'PLAIN',
}

enum AnswerType {
  Y = '是',
  N = '否',
}

export interface TableColumn {
  type: TableColumnType
  title: string
  dataIndex: string
  key: string
  fixed?: string
  bodyCellTemp?: string
  width?: string
  customCell?: any
  formatter?: any
  hidden?: boolean
}

type EditValue<T> = {
  [k in keyof T]: {
    isEdit: boolean
    value: string
  }
}

export interface InsuredData {
  id: string
  action: string
  insuredInfo: EditValue<InsuredInfo>
  beneficiaryList: EditValue<BeneficiaryModel>[]
  fileInfo: EditValue<FileInfoDto>[]
  legalRepresentative: EditValue<LegalRepresentativeModel>
  hospitalOriginal: string
  medicalOriginal: string
  rawAfterData: InsuredInfoModel
  rawBeforeData: InsuredInfoModel
}

export interface InsuredCardData extends InsuredData {
  type: string
  title: string
  buttons: CardButton[]
}
export interface InsuredTableData extends Omit<InsuredData, 'legalRepresentative'> {
  title: string
  legalRepresentative: EditValue<LegalRepresentativeModel>[]
}

/**
 * @summary 被保險人表格、資料
 * @return {Ref<InsuredCardLabel[]>} basicCardLabelsList 被保險人卡片欄位
 * @return {Ref<InsuredCardLabel[]>} rpsCardLabels 法定代理人卡片欄位
 * @return {Ref<TableColumn[]>} bnfTableColumns 受益人表格欄位
 * @return {Ref<InsuredCardData[]>} cardDataList 前端用的卡片資料
 * @return {Ref<IInsuredCardData[]>} insuredTableColumns Table:被保險人表格欄位
 * @return {Ref<IInsuredCardData[]>} beneficiaryNestedTableColumns Table:受益人表格欄位
 * @return {Ref<IInsuredCardData[]>} legalRepresentativeNestedTableColumns Table:法定代理人表格欄位
 * @return {Ref<IInsuredCardData[]>} tableData Table:被保險人巢狀表格資料
 **/

export function useGetInsuredInfo() {
  // Global plugin
  const {
    proxy: { $giseEnum, $selfPayEFormApi, $modal, $global, $dateTimeUtil },
  } = getCurrentInstance()

  const loadingStore = useLoadingStore()

  // composables
  const { getNationalitiesLabel, fetchNationalities } = useNationalities()
  const { getPostalAddress, fetchPostalCode } = usePostalCode()
  const { getRelationLabel, fetchRelation } = useRelation()

  const rawInsuredData = ref<InsuredInfoDto[]>([])
  const insuredData = ref<InsuredData[]>([])

  const caseInsuredSettings = ref<CaseInsureDto>()

  // 卡片 props
  const getCardColor = (action: string): string => {
    const target = $giseEnum.caseStatus.find(i => i.value === action)
    return target ? target.color : null
  }
  const getCardbtns = (action: string): CardButton[] => {
    switch (action) {
      case 'E':
        return [
          { style: 'secondary', text: '修改', type: 'edit', action },
          { style: 'danger', text: '退保', type: 'delete', action },
        ]
      case 'D':
        return [{ style: 'danger', text: '取消', type: 'cancel', action }]
      default:
        return [
          { style: 'secondary', text: '修改', type: 'edit', action },
          { style: 'danger', text: '取消', type: 'cancel', action },
        ]
    }
  }
  const getCardTitle = (action: string): string => {
    switch (action) {
      case 'E':
        return '被保險人有效資料'
      case 'D':
        return '申請退保'
      case 'M':
        return '申請資料變更'
      default:
        return '申請加保'
    }
  }

  const getTableCaseStatus = (action: string): { color: string; title: string } => {
    const status = $giseEnum.getObject('caseStatus', action)
    return {
      color: status.color,
      title: status.label,
    }
  }
  // 卡片欄位
  const basicCardLabelsList: Array<InsuredCardLabel[]> = []
  const rpsCardLabels: InsuredCardLabel[] = [
    { key: 'name', label: '法定代理人姓名' },
    { key: 'idNo', label: '身分證字號/居留證號' },
    { key: 'birthDate', label: '生日' },
    { key: 'nationality', label: '國籍' },
    { key: 'relation', label: '與被保險人關係' },
  ]

  // 受益人 Table 是否顯示黃色字
  const bnfCustomCell = (record, rowIndex, column) => {
    if (record[column.key]?.isEdit) {
      return {
        class: 'text-warning',
      }
    }
  }

  // 巢狀 Table 被保人資料文字顏色判斷(退保:灰字, 變更:黃字)
  const insuredNestedTableCustomCell = (record, rowIndex, column) => {
    if (record.action === 'D') return { class: 'text-neutral-entry' }
    if (record.action === 'M' && record.insuredInfo[column.key]?.isEdit)
      return {
        class: 'text-warning',
      }
  }

  // 卡片受益人表格
  const bnfTableColumns: TableColumn[] = [
    {
      type: TableColumnType.PLAIN,
      title: '順位',
      dataIndex: 'bnfOrder',
      key: 'bnfOrder',
      formatter: data => data?.bnfOrder?.value,
      customCell: bnfCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '受益人姓名',
      dataIndex: 'name',
      key: 'name',
      formatter: data => data?.name?.value,
      customCell: bnfCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '身份證字號',
      dataIndex: 'idNo',
      key: 'idNo',
      formatter: data => data?.idNo?.value,
      customCell: bnfCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '生日',
      dataIndex: 'birthDate',
      key: 'birthDate',
      formatter: data => data?.birthDate?.value,
      customCell: bnfCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '國籍',
      dataIndex: 'nationality',
      key: 'nationality',
      formatter: data => data?.nationality?.value,
      customCell: bnfCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '與被保險人關係',
      dataIndex: 'relation',
      key: 'relation',
      formatter: data => data?.relation?.value,
      customCell: bnfCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '比例',
      dataIndex: 'proportionNum',
      key: 'proportionNum',
      formatter: data => `${data?.proportionNum?.value}/${data?.proportionDen?.value}`,
      customCell: bnfCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '連絡電話',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
      formatter: data => data?.mobileNo?.value,
      customCell: bnfCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '地址',
      dataIndex: 'contactAddress',
      key: 'contactAddress',
      formatter: data => data?.contactAddress?.value,
      customCell: bnfCustomCell,
    },
  ]

  // Table-受益人
  const beneficiaryNestedTableColumns = ref<TableColumn[]>([
    {
      type: TableColumnType.PLAIN,
      title: '順位',
      dataIndex: 'bnfOrder',
      key: 'bnfOrder',
      width: '80',
      formatter: data => data?.bnfOrder?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '受益人姓名',
      dataIndex: 'name',
      key: 'name',
      width: '120',
      formatter: data => data?.name?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '身分證字號',
      dataIndex: 'idNo',
      key: 'idNo',
      width: '100',
      formatter: data => data?.idNo?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '生日',
      dataIndex: 'birthDate',
      key: 'birthDate',
      width: '100',
      formatter: data => data?.birthDate?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '國籍',
      dataIndex: 'nationality',
      key: 'nationality',
      width: '150',
      formatter: data => data?.nationality?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '與被保險人關係',
      dataIndex: 'relation',
      key: 'relation',
      width: '150',
      formatter: data => data?.relation?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '比例',
      dataIndex: 'proportionNum',
      key: 'proportionNum',
      width: '80',
      formatter: data => `${data?.proportionNum?.value}/${data?.proportionDen?.value}`,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '連絡電話',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
      width: '120',
      formatter: data => data?.mobileNo?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '地址',
      dataIndex: 'contactAddress',
      key: 'address',
      width: 'auto',
      formatter: data => data?.contactAddress?.value,
      customCell: insuredNestedTableCustomCell,
    },
  ])

  // Table-法定代理人
  const legalRepresentativeNestedTableColumns = ref<TableColumn[]>([
    {
      type: TableColumnType.PLAIN,
      title: '法定代理人姓名',
      dataIndex: 'name',
      key: 'name',
      width: '150',
      formatter: data => data?.name?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '身分證字號',
      dataIndex: 'idNo',
      key: 'idNo',
      width: '100',
      formatter: data => data?.idNo?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '生日',
      dataIndex: 'birthDate',
      key: 'birthDate',
      width: '100',
      formatter: data => data?.birthDate?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '國籍',
      dataIndex: 'nationality',
      key: 'nationality',
      width: '150',
      formatter: data => data?.nationality?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '與被保險人關係',
      dataIndex: 'relation',
      key: 'relation',
      width: 'auto',
      formatter: data => data?.relation?.value,
      customCell: insuredNestedTableCustomCell,
    },
  ])

  // Table-被保險人
  const insuredTableColumns = ref<TableColumn[]>([])
  // Table
  const rawinsuredTableColumns = [
    {
      type: TableColumnType.TEMPLATE,
      title: '申請',
      dataIndex: 'action',
      key: 'action',
      bodyCellTemp: 'action',
    },
    {
      type: TableColumnType.PLAIN,
      title: '與員工關係',
      dataIndex: 'insAttr',
      key: 'insAttr',
      formatter: data => data?.insuredInfo?.insAttr.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      formatter: data => data?.insuredInfo?.name.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '英文姓名',
      dataIndex: 'engName',
      key: 'engName',
      formatter: data => (data?.insuredInfo?.engName ? data?.insuredInfo?.engName.value : '-'),
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '保險計劃',
      dataIndex: 'policyPlan',
      key: 'policyPlan',
      formatter: data => data?.insuredInfo?.policyPlan?.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '身分證字號/居留證號碼',
      dataIndex: 'idNo',
      key: 'idNo',
      formatter: data => data?.insuredInfo?.idNo.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '生日',
      dataIndex: 'birthDate',
      key: 'birthDate',
      formatter: data => data?.insuredInfo?.birthDate.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '性別',
      dataIndex: 'sex',
      key: 'sex',
      formatter: data => data?.insuredInfo?.sex.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '國籍',
      dataIndex: 'nationality',
      key: 'nationality',
      width: '150',
      formatter: data => data?.insuredInfo?.nationality.value,
      customCell: insuredNestedTableCustomCell,
    },
    {
      type: TableColumnType.PLAIN,
      title: '是否已投保其他商業實支實付型傷害醫療保險',
      dataIndex: 'accMedIns',
      key: 'accMedIns',
      formatter: data => (data?.medicalOriginal === 'Y' ? data?.insuredInfo?.accMedIns?.value : '-'),
      customCell: insuredNestedTableCustomCell,
      hidden: false,
    },
    {
      type: TableColumnType.PLAIN,
      title: '是否已投保其他商業實支實付型醫療保險',
      dataIndex: 'medIns',
      key: 'medIns',
      formatter: data => (data?.hospitalOriginal === 'Y' ? data?.insuredInfo?.medIns?.value : '-'),
      customCell: insuredNestedTableCustomCell,
      hidden: false,
    },
    {
      type: TableColumnType.PLAIN,
      title: '身故保險金受益人',
      dataIndex: 'benType',
      key: 'benType',
      formatter: data => data?.insuredInfo?.benType.value,
      customCell: insuredNestedTableCustomCell,
    },
  ]

  // table data
  const tableData = ref<InsuredTableData[]>(null)
  // Card DataList
  const cardDataList = ref<InsuredCardData[]>([])

  // 查是否要顯示實支實付欄位
  const getMedicalHopitalOriginal = (attr: string, policyPlan: string) => {
    console.log('attr', attr)
    console.log('policyPlan', policyPlan)
    console.log('insPlanList', caseInsuredSettings.value.insPlanList)
    const insPlan = caseInsuredSettings.value.insPlanList.find(
      insPlan => attr === insPlan.attr && policyPlan === insPlan.policyPlan,
    )
    return {
      hospitalOriginal: insPlan?.hospitalOriginal,
      medicalOriginal: insPlan?.medicalOriginal,
    }
  }

  // 比對前後資料是否有修改
  const compareObjectDataIsEdit = <T>(before: T, after: T): EditValue<T> => {
    if (!after) return null

    const comparedObj: EditValue<T> = {} as EditValue<T>
    for (const [key, value] of Object.entries(after)) {
      // console.log('key', key)
      // console.log('value', value)

      // 判斷 legalRepresentative 欄位是不是為 null 值，如果就給定 null ，不再給 { isEdit: false, value: value } 避免後面 formmat 格式出錯
      if (key === 'legalRepresentative' && value === null) {
        comparedObj[key] = null
        continue
      }
      // value 是字串
      if (typeof value === 'string' || value === null) {
        if (!before) {
          comparedObj[key] = { isEdit: false, value: value }
        } else {
          comparedObj[key] = { isEdit: before?.[key] !== value, value: value }
        }
        continue
      }

      // value 是陣列
      if (Array.isArray(value)) {
        comparedObj[key] = []
        if (value.length === 0) continue
        after[key].forEach((afterArrayItem, index) => {
          comparedObj[key].push(compareObjectDataIsEdit(before?.[key]?.[index], afterArrayItem))
        })
        continue
      }

      // value 是 object
      if (typeof value === 'object') {
        comparedObj[key] = compareObjectDataIsEdit(before?.[key], after[key])
      }
    }
    return comparedObj
  }

  // API: 查詢被保險人自費案設定
  const getCaseInsuredSettings = (caseMainId: string): Promise<void | CaseInsureDto> => {
    return $selfPayEFormApi.getCaseInsuredSettingsUsingPOST({ caseMainId }).then(resp => {
      if (resp.data.status === 200) {
        return resp?.data?.data
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

  // API: 查詢被保險人資料清單
  const getInsuredDataList = (applyId: string): Promise<void | InsuredInfoDto[]> => {
    return $selfPayEFormApi.getInsuredInfoListUsingPOST({ applyId }).then(resp => {
      if (resp.data.status === 200) {
        return resp.data.data.sort((a, b) => parseInt(a.data.after.insAttr) - parseInt(b.data.after.insAttr))
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

  // 查詢被保險人資料
  const getInsuredData = async ({ applyId, caseMainId }: CaseMainIdAndApplyIdDto) => {
    loadingStore.setLoading(true)
    await Promise.all([fetchPostalCode(), fetchRelation(), fetchNationalities()])
    await Promise.all([getCaseInsuredSettings(caseMainId), getInsuredDataList(applyId)]).then(promiseResp => {
      caseInsuredSettings.value = promiseResp[0] && promiseResp[0]
      rawInsuredData.value = promiseResp[1] && promiseResp[1]
    })
    loadingStore.setLoading(false)
  }

  // 將API資料轉換成前端使用的資料格式
  const convertListToInsuredData = (rawData: InsuredInfoDto[]): InsuredData[] => {
    if (!rawData || rawData.length === 0) return []
    const comparedRawInsureData = rawData.map(insuredData => ({
      action: insuredData.action,
      data: compareObjectDataIsEdit<InsuredInfoModel>(insuredData.data.before, insuredData.data.after),
      rawAfterData: insuredData.data.after,
      rawBeforeData: insuredData.data.before,
    }))

    return comparedRawInsureData.map(comparedRawInsure => {
      const medicalHopitalOriginal = getMedicalHopitalOriginal(
        comparedRawInsure.data.insAttr?.value,
        comparedRawInsure.data.policyPlan?.value,
      )
      const insuredData: InsuredData = {
        id: comparedRawInsure.data.insuredId.value,
        action: comparedRawInsure.action,
        insuredInfo: {},
        beneficiaryList: [],
        fileInfo: [],
        legalRepresentative: {},
        hospitalOriginal: medicalHopitalOriginal.hospitalOriginal,
        medicalOriginal: medicalHopitalOriginal.medicalOriginal,
        rawAfterData: comparedRawInsure.rawAfterData,
        rawBeforeData: comparedRawInsure.rawBeforeData,
      }
      for (const [key, value] of Object.entries(comparedRawInsure.data)) {
        if (rawinsuredTableColumns.find(column => column.key === key)) {
          insuredData.insuredInfo = { ...insuredData.insuredInfo, [key]: value }
        } else {
          insuredData[key] = value
        }
      }
      return insuredData
    })
  }

  const insuredDataFormatter = (insuredData: InsuredData[]): InsuredData[] => {
    insuredData.map(insured => {
      // 與員工關係
      insured.insuredInfo.insAttr.value = $giseEnum.getLabel('insAttr', insured.insuredInfo.insAttr.value)
      // 身故保險金受益人
      insured.insuredInfo.benType.value = $giseEnum.getLabel('beneficiaryType', insured.insuredInfo.benType.value)
      // 生日
      insured.insuredInfo.birthDate.value = $dateTimeUtil.dateStringAddSlash(insured.insuredInfo.birthDate.value)
      // 性別
      insured.insuredInfo.sex.value = $giseEnum.getLabel('sexEnum', insured.insuredInfo.sex.value)
      // 國籍
      insured.insuredInfo.nationality.value = getNationalitiesLabel(insured.insuredInfo.nationality.value)

      // 是否已投保其他商業實支實付型傷害醫療保險
      if (insured.insuredInfo.accMedIns)
        insured.insuredInfo.accMedIns.value = AnswerType[insured.insuredInfo.accMedIns.value]
      //是否已投保其他商業實支實付型醫療保險
      if (insured.insuredInfo.medIns) insured.insuredInfo.medIns.value = AnswerType[insured.insuredInfo.medIns.value]

      // 受益人
      if (insured.beneficiaryList && insured.beneficiaryList.length > 0) {
        insured.beneficiaryList
          .sort((a, b) => parseInt(a.bnfOrder.value) - parseInt(b.bnfOrder.value))
          .forEach(beneficiary => {
            // 生日
            beneficiary.birthDate.value = $dateTimeUtil.dateStringAddSlash(beneficiary.birthDate?.value)
            // 國籍
            beneficiary.nationality.value = getNationalitiesLabel(beneficiary.nationality?.value)
            // 與被保險人關係
            beneficiary.relation.value = getRelationLabel(beneficiary.relation?.value)
            // 地址
            beneficiary.contactAddress.value = `${beneficiary.postalCode?.value} ${getPostalAddress(
              beneficiary.postalCode?.value,
            )}${beneficiary.contactAddress.value ? beneficiary.contactAddress.value : ''}`
          })
      }

      console.log('法定 ==============', insured.legalRepresentative)
      // 法定代理人
      if (insured.legalRepresentative && Object.keys(insured.legalRepresentative).length > 0) {
        // 生日
        insured.legalRepresentative.birthDate.value = $dateTimeUtil.dateStringAddSlash(
          insured.legalRepresentative.birthDate.value,
        )
        // 國籍
        insured.legalRepresentative.nationality.value = getNationalitiesLabel(
          insured.legalRepresentative.nationality.value,
        )
        // 與被保險人關係
        insured.legalRepresentative.relation.value = getRelationLabel(insured.legalRepresentative.relation.value)
      }

      return insured
    })
    return insuredData
  }

  const getTableData = () => {
    tableData.value = insuredData.value.map(data => {
      // console.log('tableData', data)
      const { color, title } = getTableCaseStatus(data.action)
      if (data.legalRepresentative && Object.keys(data.legalRepresentative).length !== 0)
        return {
          ...data,
          color,
          title,
          legalRepresentative: [data.legalRepresentative],
        }
      return { ...data, color, title, legalRepresentative: [] }
    })

    console.log('run=====tableData', tableData.value)
  }

  const getCardData = () => {
    cardDataList.value = insuredData.value.map(el => {
      const type = getCardColor(el.action)
      const title = getCardTitle(el.action)
      const buttons = getCardbtns(el.action)
      return { ...el, type, title, buttons }
    })

    // console.log('run=====cardDataList', cardDataList.value)
  }

  const getinsuredTableColumns = () => {
    const isShowAccMedIns = insuredData.value.some(insured => insured.medicalOriginal === 'Y')
    const isShowMedIns = insuredData.value.some(insured => insured.hospitalOriginal === 'Y')
    rawinsuredTableColumns.find(column => column.key === 'accMedIns').hidden = !isShowAccMedIns
    rawinsuredTableColumns.find(column => column.key === 'medIns').hidden = !isShowMedIns

    insuredTableColumns.value = rawinsuredTableColumns.filter(column => column?.hidden !== true)
    if (tableData.value.find(data => data.action === 'M'))
      insuredTableColumns.value.push({
        type: TableColumnType.TEMPLATE,
        title: '附件',
        dataIndex: 'fileInfo',
        key: 'fileInfo',
        bodyCellTemp: 'fileInfo',
      })
  }

  const getCardbasicCardLabelsList = () => {
    insuredData.value.forEach(insured => {
      const basicCardLabels: InsuredCardLabel[] = [
        { key: 'insAttr', label: '與員工關係' },
        { key: 'name', label: '姓名' },
        { key: 'engName', label: '英文姓名' },
        { key: 'idNo', label: '身分證字號' },
        { key: 'birthDate', label: '生日' },
        { key: 'sex', label: '性別' },
        { key: 'nationality', label: '國籍' },
        { key: 'policyPlan', label: '保險計劃' },
      ]
      if (insured.medicalOriginal === 'Y')
        basicCardLabels.push({ key: 'accMedIns', label: '是否已投保其他商業實支實付型傷害醫療保險' })
      if (insured.hospitalOriginal === 'Y')
        basicCardLabels.push({ key: 'medIns', label: '是否已投保其他商業實支實付型醫療保險' })
      basicCardLabels.push({ key: 'benType', label: '身故保險金受益人' })
      basicCardLabelsList.push(basicCardLabels)
    })
  }

  watch(
    rawInsuredData,
    value => {
      console.log('rawInsuredData', value)
      insuredData.value = convertListToInsuredData(value)
      console.log('insuredData', insuredData)
      insuredData.value = insuredDataFormatter(insuredData.value)
      getTableData()
      getCardData()
      getinsuredTableColumns()
      getCardbasicCardLabelsList()
    },
    { deep: true },
  )

  return {
    basicCardLabelsList,
    bnfTableColumns,
    rpsCardLabels,
    insuredTableColumns,
    beneficiaryNestedTableColumns,
    legalRepresentativeNestedTableColumns,
    cardDataList,
    tableData,
    getInsuredData,
    caseInsuredSettings,
  }
}
