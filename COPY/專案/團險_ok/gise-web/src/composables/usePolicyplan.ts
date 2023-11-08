import { getCurrentInstance, ref } from 'vue'
import type { CaseMainIdAndInsAttrDto } from '@fubonlife/gise-api-axios-sdk'

export interface Option {
  label?: string
  value?: string
}

/**
 * @summary 保險計劃下拉選單
 * @return {Ref<Option[]>} policyplanOpts 保險計劃下拉選單
 * @return {Function():Promise<void>} fetchPolicyplan 非同步取得保險計劃
 **/
export function usePolicyplan() {
  const {
    proxy: { $global, $user, $modal, $selfPayEFormApi },
  } = getCurrentInstance()

  // 保險計劃
  const policyplanOpts = ref<Option[]>([])

  // API: 1.2.37 取得保險計劃下拉選單
  const fetchPolicyplan = (insAttr: string): Promise<void> => {
    const $input: CaseMainIdAndInsAttrDto = {
      applyId: $global.handleApplyId('Get'),
      caseMainId: $user.getMe()?.caseMainId,
      insAttr,
    }
    return $selfPayEFormApi.getPlanOptionUsingPOST($input).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        console.log(respData.data)
        policyplanOpts.value = Object.entries(respData.data).map(([key, value]) => {
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

  return {
    policyplanOpts,
    fetchPolicyplan,
  }
}
