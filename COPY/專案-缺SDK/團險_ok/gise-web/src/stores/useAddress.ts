import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PostalCodeDto } from '@fubonlife/gise-api-axios-sdk'

interface District {
  districtCode?: string
  districtName?: string
}

export const usePostalCodeListStore = defineStore('postalCodeList', () => {
  const rawPostalCodeList = ref<PostalCodeDto[]>([])
  const taiwanPostalCodeMap = ref(new Map<string, District[]>())
  const getPostalCodeList = computed(() => rawPostalCodeList.value)
  const getTaiwanPostalCodeMap = computed(() => taiwanPostalCodeMap.value)
  function setPostalCodeList(payload) {
    rawPostalCodeList.value = payload
  }
  function setTaiwanPostalCodeMap(payload) {
    taiwanPostalCodeMap.value = payload
  }

  return {
    rawPostalCodeList,
    taiwanPostalCodeMap,
    getPostalCodeList,
    getTaiwanPostalCodeMap,
    setPostalCodeList,
    setTaiwanPostalCodeMap,
  }
})
