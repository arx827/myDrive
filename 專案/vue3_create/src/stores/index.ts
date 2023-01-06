import { defineStore } from 'pinia'
export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoadingArr: [],
  }),
  getters: {
    getLoading: state => state.isLoadingArr.length > 0,
  },
  actions: {
    SET_LOADING(payload: boolean) {
      const $bodyEle = document.getElementsByTagName('body')[0]
      if (payload) {
        this.isLoadingArr.push(payload)
        $bodyEle.classList.add('loading-open')
      } else {
        this.isLoadingArr.shift()
        $bodyEle.classList.remove('loading-open')
      }
    },
  },
})
