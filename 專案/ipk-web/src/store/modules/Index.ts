import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import { getField, updateField } from 'vuex-map-fields';
import global from '@/plugins/global/index';
import validateUtil from '@/plugins/util/validateUtil';

@Module({ namespaced: false })
class Index extends VuexModule {
  isLoading = false; // call API轉圈效果

  curAjaxProcessingCount = 0; // 目前在執行的ajax數量

  tabArray = []; // 存放已開啟的主頁籤

  activeTab = ''; // 選定的主頁籤

  activeSubTab = ''; // 選定的子頁籤

  loginInfo = {}; // 紀錄登入者資訊

  menuItem = {}; // 選單

  menuIdList = []; // 有權限的選單ID清單

  notice = { // 通知
    messageNoticeCount: 0,
    todoCount: 0,
    needUpdate: true,
  }

  keepAliveList = [];// 保存缓存的列表

  get getField() {
    return getField(this);
  }

  @Mutation
  updateField(options: {path: string; value: unknown}) {
    return updateField(this, options);
  }

  get getLoading() {
    return this.isLoading;
  }

  get getTabArray() {
    return this.tabArray;
  }

  get getActiveTab() {
    return this.activeTab;
  }

  get getActiveSubTab() {
    return this.activeSubTab;
  }

  get getLoginInfo() {
    return this.loginInfo;
  }

  get getMenuItem() {
    return this.menuItem;
  }

  get getMenuIdList() {
    return this.menuIdList;
  }

  get getNotice() {
    return this.notice;
  }

  get getKeepAliveList() {
    return this.keepAliveList;
  }

  /**
	 * @summary 判斷空值
	*/
	isEmpty(data) {
		return validateUtil.isEmpty(data);
	}

  @Mutation
  SET_LOADING(payload: boolean) {
    // 目前正在執行ajax的數量
    if (payload) {
      this.curAjaxProcessingCount++;
    } else {
      this.curAjaxProcessingCount--;
    }

    // 一個以上代表目前還有ajax在執行，不要關閉轉圈圈
    if (this.curAjaxProcessingCount > 0) {
      this.isLoading = true;
    } else {
      this.isLoading = false;
    }

    // this.isLoading = payload;
    const $bodyEle = document.getElementsByTagName('body')[0];
  	if (this.isLoading) {
  	  $bodyEle.classList.add('loading-open');
  	} else {
  		$bodyEle.classList.remove('loading-open');
  	}
  }

  @Mutation
  SET_TAB_ARRAY(payload) {
    if (!payload) {
      return;
    }
    // 點選單時會傳 object, 刪除頁籤時會傳 Array
    if (Array.isArray(payload)) {
      this.tabArray = payload;
    } else if (typeof payload === 'object') {
      const exist = this.tabArray.filter((tab) => tab.key == payload.key).length > 0;
      if (exist) {
        this.activeTab = payload.key;
      } else {
        this.tabArray.push(payload);
      }
    }
    // 將已開啟頁籤資訊存入sessionStorage，避免重新整理時vueX清空頁籤消失
    // global.setTabParam('tabArray', this.tabArray);
  }

  @Mutation
  SET_ACTIVE_TAB(payload) {
    this.activeTab = payload;
  }

  @Mutation
  SET_ACTIVE_SUB_TAB(payload) {
    this.activeSubTab = payload;
  }

  @Mutation
  SET_LOGIN__INFO(payload) {
    this.loginInfo = payload;
  }

  @Mutation
  SET_MENU__ITEM(payload) {
    this.menuItem = payload;
  }

  @Mutation
  SET_MENU_ID_LIST(payload) {
    this.menuIdList = payload;
  }

  @Mutation
  SET_NOTICE(payload) {
    this.notice = payload;
  }

  // 新增緩存列表
  @Mutation
  ADD_CACHED_VIEW(payload) {
    if (this.keepAliveList.includes(payload)) {
      return;
    }
    this.keepAliveList.push(payload);
  }

  // 刪除緩存列表
  @Mutation
  DEL_CACHED_VIEW(payload) {
    const index = this.keepAliveList.indexOf(payload);
    if (index > -1) {
      this.keepAliveList.splice(index, 1);
    }
  }

  @Action
  setAddCachedView(payload) {
    this.context.commit('ADD_CACHED_VIEW', payload);
  }

  @Action
  setDelCachedView(payload) {
    this.context.commit('DEL_CACHED_VIEW', payload);
  }

  @Action
  setLoading(payload) {
    this.context.commit('SET_LOADING', payload);
  }

  @Action
  setTabArray(payload) {
    this.context.commit('SET_TAB_ARRAY', payload);
  }

  @Action
  setActiveTab(payload) {
    this.context.commit('SET_ACTIVE_TAB', payload);
  }

  @Action
  setActiveSubTab(payload) {
    this.context.commit('SET_ACTIVE_SUB_TAB', payload);
  }

  @Action
  setLoginInfo(payload) {
    this.context.commit('SET_LOGIN__INFO', payload);
  }

  @Action
  setMenuItem(payload) {
    this.context.commit('SET_MENU__ITEM', payload);
  }

  @Action
  setMenuIdList(payload) {
    this.context.commit('SET_MENU_ID_LIST', payload);
  }

  @Action
  setNotice(payload) {
    this.context.commit('SET_NOTICE', payload);
  }
}
export default Index;
