import { ref, watch, watchEffect, getCurrentInstance } from 'vue'
import type { SelectProps } from 'ant-design-vue'
import { usePostalCodeListStore } from '@stores/useAddress'
import type { PostalCodeDto } from '@fubonlife/gise-api-axios-sdk'
interface District {
  districtCode?: string
  districtName?: string
}

/**
 * @summary 共用 - 縣市/鄉鎮市區 下拉選單、郵遞區號
 * @return {Ref<string>} town 縣市欄位值
 * @return {Ref<SelectProps['options']>} townOpts 縣市下拉選單
 * @return {Ref<string>} district 鄉鎮市區欄位值
 * @return {Ref<SelectProps['options']>} districtOpts 鄉鎮市區下拉選單
 * @return {Function():Promise<void>} fetchPostalCode 非同步取得郵遞區號
 * @return {Function(string):string} getPostalAddress 取得郵遞區號碼對應的中文地址
 * @return {Function():void} generateTown 生成縣市下拉選項
 **/
export function usePostalCode() {
  const {
    proxy: { $global, $modal, $commonApi },
  } = getCurrentInstance()

  const postalCodeListStore = usePostalCodeListStore()

  // API 原始郵遞區號資料
  let rawPostalCodeList: PostalCodeDto[] = []
  // 縣市欄位值
  const town = ref<string>(undefined)
  // 下拉 : 縣市
  const townOpts = ref<SelectProps['options']>([])
  // 鄉鎮市區欄位值
  const district = ref<string>(undefined)
  // 下拉 : 鄉鎮市區
  const districtOpts = ref<SelectProps['options']>([])

  // 台灣縣市/鄉鎮市區的 HashMap
  const taiwanPostalCodeMap = new Map<string, District[]>()

  //  API: 共用-郵遞區號
  const fetchPostalCode = (): Promise<void> => {
    return $commonApi.getPostalCodeUsingPOST().then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        rawPostalCodeList = resp.data.data
        postalCodeListStore.setPostalCodeList(rawPostalCodeList)
        // 轉成 Map
        postalCodeListStore.getPostalCodeList.forEach(el => {
          const { townName, townCode, ...rest } = el
          if (taiwanPostalCodeMap.has(townName)) {
            taiwanPostalCodeMap.get(townName).push(rest)
          } else {
            taiwanPostalCodeMap.set(townName, [rest])
          }
        })
        postalCodeListStore.setTaiwanPostalCodeMap(taiwanPostalCodeMap)
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
      }
    })
  }

  // 取得郵遞區號碼對應的中文地址
  const getPostalAddress = (postalCode: string): string => {
    if (!postalCode || postalCode.trim().length === 0) return ''
    const rawPostalCode = postalCodeListStore.getPostalCodeList.find(
      rawPostalCode => rawPostalCode.districtCode == postalCode,
    )
    return `${rawPostalCode?.townName}${rawPostalCode?.districtName}`
  }

  // 生成縣市下拉選項
  const generateTown = () => {
    for (const [key] of postalCodeListStore.getTaiwanPostalCodeMap) {
      townOpts.value.push({
        label: key,
        value: key,
      })
    }
  }

  watch(
    town,
    value => {
      // 生成鄉鎮市區下拉選項
      console.log(value)
      if (value) {
        districtOpts.value = postalCodeListStore.getTaiwanPostalCodeMap.get(value)?.map(i => ({
          label: i.districtName,
          value: i.districtCode,
        }))
      }

      if (districtOpts.value?.findIndex(el => el.value === district.value) < 0) {
        district.value = undefined
      }
    },
    { deep: true },
  )

  watch(
    district,
    code => {
      if (townOpts.value.length === 0) {
        // 生成縣市下拉選項
        for (const [key] of postalCodeListStore.getTaiwanPostalCodeMap) {
          townOpts.value.push({
            label: key,
            value: key,
          })
        }
      }
      for (const [key, value] of postalCodeListStore.getTaiwanPostalCodeMap) {
        value.find(el => {
          if (el.districtCode === code) {
            town.value = key
            return
          }
        })
      }
    },
    { deep: true },
  )

  return {
    town,
    townOpts,
    district,
    districtOpts,
    fetchPostalCode,
    getPostalAddress,
    generateTown,
  }
}
