import Vue from "vue";
import Vuex from "vuex";
import FinanceJobInfo from './modules/FinanceJobInfo';
import SuspectLaundering from './modules/SuspectLaundering';
import CustomerData from './modules/CustomerData';
import DeptConfig from '@/dept-config/deptConfig'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alreadyOpenDetail: false, // 審查列表左側選單遮罩控制
    enterPathName: '',
    isLoading: false,
    // 審覆核區塊 (審查意見/覆核意見)
    memoDesc: '',
    reflash: {
      ReviewEvidenceData: false,
    },
    deptSectionConfig: {
      customerDataPage: {},
      transactionRecordPage: {},
      financialAndJobInfoPage: {},
      suspectLaunderingPage: {},
      evidenceDataPage: {},
      reviewHistoryPage: {},
      dataSourcePage: {},
      ReviewBottom: {}
    },
  },
  mutations: {
    Handle_Already_Open_Detail: (state, payload) => {
      state.alreadyOpenDetail = payload;
    },
    Change_Enter_Path_Name: (state, payload) => {
      state.enterPathName = payload;
    },
    setInputVal (state, payload) {
      // 表單值處理
      // payload.module=對應的module名稱
      // payload.key=對應的module state
      // payload.value=輸入的值
      state[payload.module][payload.key] =  payload.value;            
      console.log(state[payload.module][payload.key])
    },
    SET_LOADING (state, payload: boolean) {
      state.isLoading = payload;
    },
    SET_MEMODESC (state, payload) {
      state.memoDesc = payload;
    },
    REFLASH_PAGE (state, payload) {
      state.reflash[payload.page] = payload.val;
    },
    SET_DEPT_SECTION_CONFIG (state, payload) {
      state.deptSectionConfig = DeptConfig.deptSectionData[payload] ;
    },
  },
  actions: {
    HandleAlreadyOpenDetail: ({ commit }, payload) => {
      commit('Handle_Already_Open_Detail', payload);
    },
    ChangeEnterPathName: ({ commit }, payload) => {
      commit('Change_Enter_Path_Name', payload);
    },
    onChangeVal({ commit, getters }, payload) {
      if (!getters.isConfirm) {
        commit('setInputVal', payload);
      }
    },
    setLoading({ commit }, payload) {
      commit('SET_LOADING', payload);
    },
    setMemoDesc({ commit }, payload) {
      commit('SET_MEMODESC', payload);
    },
    // 重刷頁面
    reflashPage({ commit}, payload) {
      commit('REFLASH_PAGE', payload);
    },
    setDeptSectionConfig({ commit}, payload) {
      commit('SET_DEPT_SECTION_CONFIG', payload);
    },
  },
  getters: {
    // readOnlyMode: state => {
    //   // 判斷若進入"待覆核頁"，須將相對應元件表單改為readonly
    //   return state.enterPathName === 'confirm';
    // },
    isConfirm: state => {
      // 判斷若進入"待覆核頁"，須將相對應元件表單改為readonly
      return state.enterPathName === 'confirm';
    },
    getLoading: state => {
      return state.isLoading;
    },
    getMemoDesc: state => {
      return state.memoDesc;
    },
    getReflash: state => {
      return state.reflash;
    },
    getDeptSectionConfig: state => {
      return state.deptSectionConfig;
    }
  },
  modules: {
    FinanceJobInfo,
    SuspectLaundering,
    CustomerData,
  }
})
