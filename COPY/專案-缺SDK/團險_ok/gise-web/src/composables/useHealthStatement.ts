import { getCurrentInstance, ref, watch } from 'vue'
import type { CardInfoColumn } from '@/components/shared/cards/CardInfo.vue'
import type { CaseMainIdAndApplyIdDto, HealthDeclarationInfoDto } from '@fubonlife/gise-api-axios-sdk'

interface HealthStatementTableColumn {
  type: 'TEMPLATE' | 'PLAIN'
  title: string
  dataIndex: string
  key: string
  fixed?: string
  bodyCellTemp?: string
  width?: string
  customCell?: any
}

interface CardStatusInfo {
  color: string
  label: string
}

export interface HealthStatementData extends HealthDeclarationInfoDto {
  status: CardStatusInfo
}

/**
 * @summary 取得健康聲明書 table、card 資料
 * @param {boolean} hasEditFeature 健康聲明書 table 欄位是否需要多一欄「修改」
 * @return {Ref<HealthStatementTableColumn[]>} healthStatementTableColumn 健康聲明書 table column
 * @return {Ref<CardInfoColumn[]>} healthStatementCardColumn 健康聲明書 card column
 * @return {Ref<any[HealthStatementData]>} healthStatementData 健康聲明書資料
 * @return {Function (caseMainIdAndApplyId:CaseMainIdAndApplyIdDto):void} fetchHealthStatmentData API:取得健康聲明書資料(非同步)
 **/

export function useHealthStatement(hasEditFeature: boolean) {
  const {
    proxy: { $giseEnum, $selfPayEFormApi, $modal, $global },
  } = getCurrentInstance()

  const rawHealthStatmentData = ref<HealthDeclarationInfoDto[]>([])

  const healthStatementTableColumn = ref<HealthStatementTableColumn[]>([
    {
      type: 'TEMPLATE',
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      bodyCellTemp: 'status',
    },
    {
      type: 'PLAIN',
      title: '與員工關係',
      dataIndex: 'insAttr',
      key: 'insAttr',
    },
    {
      type: 'PLAIN',
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      type: 'PLAIN',
      title: '保險計劃',
      dataIndex: 'policyPlan',
      key: 'policyPlan',
    },
    {
      type: 'TEMPLATE',
      title: '預覽',
      dataIndex: 'preview',
      key: 'preview',
      bodyCellTemp: 'preview',
      width: '64',
    },
  ])

  if (hasEditFeature) {
    healthStatementTableColumn.value.push({
      type: 'TEMPLATE',
      title: '修改',
      dataIndex: 'edit',
      key: 'edit',
      bodyCellTemp: 'edit',
      width: '32',
    })
  }

  const healthStatementCardColumn = ref<CardInfoColumn[]>([
    {
      key: 'insAttr',
      label: '與員工關係',
    },
    {
      key: 'name',
      label: '姓名',
    },
    {
      key: 'policyPlan',
      label: '保險計劃',
    },
  ])

  const healthStatementData = ref<HealthStatementData[]>([])

  // watch rawData
  watch(
    rawHealthStatmentData,
    value => {
      healthStatementData.value = convertListToHealthStatmentData(value)
    },
    { deep: true },
  )

  // 判斷健康聲明書狀態
  const getlthStatmentStatusStatusInfo = ({ fillInStatus, fillInType }: HealthDeclarationInfoDto): CardStatusInfo => {
    if (fillInType === '1' && fillInStatus === 'Y') return { color: 'secondary', label: '完成' }
    if (fillInType === '1' && fillInStatus === 'N') return { color: 'danger', label: '未完成' }
    if (fillInType === '2' && fillInStatus === 'Y')
      return { color: 'danger', label: '非必填 (若您為調高保額，請填寫健康聲明書)' }
    if (fillInType === '3' && fillInStatus === 'Y') return { color: 'neutral', label: '不需填寫' }
  }

  // API: 查詢健康聲明書填寫紀錄清單
  const fetchHealthStatmentData = (caseMainIdAndApplyId: CaseMainIdAndApplyIdDto): Promise<void> => {
    return $selfPayEFormApi.getHealthDeclarationInfoListUsingPOST(caseMainIdAndApplyId).then(resp => {
      if (resp.data.status === 200) {
        // console.log('getHealthStatmentData', resp)
        rawHealthStatmentData.value = resp?.data?.data
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

  // 將API資料轉換成前端使用的資料
  const convertListToHealthStatmentData = (rawData: HealthDeclarationInfoDto[]): HealthStatementData[] => {
    if (!rawData || rawData.length === 0) return []
    if (hasEditFeature) {
      return (
        rawData
          // 加上狀態對應文字與顏色、與員工關係文字轉換
          .map(filterData => {
            return {
              ...filterData,
              status: getlthStatmentStatusStatusInfo(filterData),
              insAttr: $giseEnum.getLabel('insAttr', filterData.insAttr),
            }
          })
      )
    }

    return (
      rawData
        // 前端資料只需要顯示 action=C,M,D
        .filter(data => data.action === 'C' || data.action === 'M' || data.action === 'D')
        // 加上狀態對應文字與顏色、與員工關係文字轉換
        .map(filterData => {
          return {
            ...filterData,
            status: getlthStatmentStatusStatusInfo(filterData),
            insAttr: $giseEnum.getLabel('insAttr', filterData.insAttr),
          }
        })
    )
  }

  return {
    healthStatementTableColumn,
    healthStatementCardColumn,
    healthStatementData,
    fetchHealthStatmentData,
  }
}
