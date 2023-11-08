import { ref, getCurrentInstance } from 'vue'

interface LinkType {
  LINK_GROUP_PROMO?: string //團險好康
  LINK_PRODUCT_INTRO?: string //產品介紹
  LINK_IBGOV?: string // 主管機關相關連結
  LINK_EC_SELF_REGULATION?: string //法令公告
  LINK_FAIR_DEALING?: string // 公平待客原則
  LINK_PRIVACY?: string //隱私權聲明
}

/**
 * @summary 共用 - 查詢系統功能連結
 * @return {Ref<LinkType>} links 超連結
 * @return {Function(item: string): Promise<void>} fetchSystemLinks API:查詢系統功能連結API
 **/
export function useSystemLink() {
  const {
    proxy: { $global, $modal, $authApi },
  } = getCurrentInstance()

  const links = ref<LinkType>({
    LINK_GROUP_PROMO: null,
    LINK_PRODUCT_INTRO: null,
    LINK_IBGOV: null,
    LINK_EC_SELF_REGULATION: null,
    LINK_FAIR_DEALING: null,
    LINK_PRIVACY: null,
  })

  // 查詢系統功能連結API
  const fetchSystemLinks = (item: string): Promise<void> => {
    return $authApi.findUrlStringUsingPOST(item).then(resp => {
      if (resp.data.status === 200) {
        links.value[item] = resp.data.data
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  return {
    links,
    fetchSystemLinks,
  }
}
