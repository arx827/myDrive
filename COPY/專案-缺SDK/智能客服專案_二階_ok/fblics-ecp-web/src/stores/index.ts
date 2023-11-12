import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
export const useLoadingStore = defineStore('loading', () => {
  const isLoadingArr = ref([])

  const getLoading = computed(() => isLoadingArr.value.length > 0)

  const setLoading = (payload: boolean) => {
    const $bodyEle = document.getElementsByTagName('body')[0]
    if (payload) {
      isLoadingArr.value.push(payload)
      $bodyEle.classList.add('loading-open')
    } else {
      isLoadingArr.value.shift()
      $bodyEle.classList.remove('loading-open')
    }
  }

  return {
    isLoadingArr,
    getLoading,
    setLoading,
  }
})
