import { getCurrentInstance, ref } from 'vue'

export interface Option {
  label?: string
  value?: string
}

/**
 * @summary 共用 - 國籍下拉選單
 * @return {Ref<Option[]>} nationalityOpts 國籍下拉選單
 * @return {Function():Promise<void>} fetchNationalities 非同步取得國籍
 * @return {Function(string):string} getNationalitiesLabel 取得國籍對應中文名稱
 **/
export function useNationalities() {
  const {
    proxy: { $global, $modal, $commonApi },
  } = getCurrentInstance()

  // 國籍
  const nationalityOpts = ref<Option[]>([])

  //API: 1.2.31 共用-取得國籍API
  const fetchNationalities = (): Promise<void> => {
    return $commonApi.getNationalitiesUsingPOST().then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        // TEST:
        // console.log(respData.data)
        nationalityOpts.value = Object.entries(respData?.data)
          .sort()
          .map(([key, value]) => {
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

  // 取得國籍對應中文名稱
  const getNationalitiesLabel = (nationalityCode: string): string => {
    return nationalityOpts.value.find(nationalityOpt => nationalityCode === nationalityOpt.value)?.label
  }

  return {
    nationalityOpts,
    fetchNationalities,
    getNationalitiesLabel,
  }
}
