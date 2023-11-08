import { getCurrentInstance, ref } from 'vue'

export interface Option {
  label?: string
  value?: string
}

/**
 * @summary 共用 - 關係清單下拉選單
 * @return {Ref<Option[]>} relationOpts 關係清單下拉選單
 * @return {Function():Promise<void>} fetchRelation 非同步取得關係清單
 * @return {Function(string):string} getRelationLabel 取得關係人對應中文
 *
 **/
export function useRelation() {
  const {
    proxy: { $global, $modal, $commonApi },
  } = getCurrentInstance()

  // 關係清單
  const relationOpts = ref<Option[]>([])

  //API: 1.2.32 共用-取得關係清單API
  const fetchRelation = (): Promise<void> => {
    return $commonApi.getRelationUsingPOST().then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        // TEST:
        // console.log(respData.data)
        relationOpts.value = Object.entries(respData?.data).map(([key, value]) => {
          return {
            label: value,
            value: key,
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

  // 取得關係人對應中文
  const getRelationLabel = (relationCode: string): string => {
    if (!relationCode) return ''
    return relationOpts.value.find(instattr => instattr.value === relationCode)?.label
  }

  return {
    relationOpts,
    fetchRelation,
    getRelationLabel,
  }
}
