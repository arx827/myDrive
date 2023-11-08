import { ref, getCurrentInstance } from 'vue'
import type { CardCollapsed } from '@components/shared/cards/CardCollapse.vue'
import type { ETermGroupDto } from '@fubonlife/gise-api-axios-sdk'

/**
 * 告知聲明與注意事項
 * @return {Ref<CardCollapsed[]>} collapseItems 告知聲明與注意事項(卡片收合元件的資料格式)
 * @return {Function(termGroup: ETermGroupDto):Promise<void>} fetchTermsAndNotice API:查詢告知聲明與注意事項
 **/
export function useTermsAndNotice() {
  const {
    proxy: { $global, $modal, $selfPayEFormApi },
  } = getCurrentInstance()

  const collapseItems = ref<CardCollapsed[]>([])

  // API: 1.2.18 查詢告知聲明與注意事項API
  const fetchTermsAndNotice = (termGroup: ETermGroupDto): Promise<void> => {
    return $selfPayEFormApi.getTermsAndNoticeUsingPOST(termGroup).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        collapseItems.value = respData.data.map((el, index) => {
          return {
            checking: false,
            title: el.title,
            isCollapseOpen: false,
            content: el.content,
            slotName: `description${index}`,
          }
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

  return {
    collapseItems,
    fetchTermsAndNotice,
  }
}
