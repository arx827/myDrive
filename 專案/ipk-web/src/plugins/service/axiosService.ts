import Vue from 'vue';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import store from '@/store/index';
import axios from 'axios';

declare module 'vue/types/vue' {
  interface Vue {
      $axios: AxiosService;
  }
}

export class AxiosService extends Vue {
	/**
	 * @summary 原生axios  patch 多筆上傳 至後端方法
   * @param {string} url: 路徑
   * @param {string} dataKey: 欄位參數名稱
	 * @param {any} data: 欄位資訊
	 * @param {string} filesKey: 檔案參數名稱
	 * @param {any[]} files: 檔案
	 * @param {Function} successCallBack: 成功回調函數
	 * @param {Function} errorCallBack: 錯誤回調函數
	*/
	axiosPatch(url: string, dataKey: string, data: any, filesKey: string, files: any[], successCallBack?: Function, errorCallBack?: Function) {
    let forms = new FormData();
    if (!validateUtil.isEmpty(files)) {
      files.forEach((e) => {
				if (e && !validateUtil.isEmpty(e.originFileObj)) {
					forms.append(filesKey, e.originFileObj);
				} else {
					forms.append(filesKey, e);
				}
      });
    }
    forms.append(dataKey, new Blob([JSON.stringify(data)], { type: 'application/json' }));
    store.dispatch('setLoading', true);
    axios.patch(url, forms)
		.then((res) => {
			const isSuccess = res.data.success;
			const message = res.data.message;
			// 失敗訊息
			if (!isSuccess) {
				InfoModal.alertError({ confirm: false, content: message });
				if (errorCallBack) {
					errorCallBack();
				}
				return;
			}
			// 成功訊息
			this.$message.success(message, 10);
			if (successCallBack) {
				successCallBack();
			}
		})
		.catch((error) => {
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		}).finally(() => {
			store.dispatch('setLoading', false);
		});
  }

	/**
	 * @summary 原生axios put 單筆上傳 至後端方法
   * @param {string} url: 路徑
   * @param {string} dataKey: 欄位參數名稱
	 * @param {any} data: 欄位資訊
	 * @param {string} filesKey: 檔案參數名稱
	 * @param {any[]} files: 檔案
	 * @param {Function} successCallBack: 成功回調函數
	 * @param {Function} errorCallBack: 錯誤回調函數
	*/
	axiosPut(url: string, dataKey: string, data: any, filesKey: string, files: any[], successCallBack?: Function, errorCallBack?: Function) {
    let forms = new FormData();
    if (!validateUtil.isEmpty(files)) {
      files.forEach((e) => {
				if (!validateUtil.isEmpty(e.originFileObj)) {
					forms.append(filesKey, e.originFileObj);
				} else {
					forms.append(filesKey, e);
				}
      });
    }
    forms.append(dataKey, new Blob([JSON.stringify(data)], { type: 'application/json' }));
    store.dispatch('setLoading', true);
    axios.put(url, forms)
		.then((res) => {
			const isSuccess = res.data.success;
			const message = res.data.message;
			// 失敗訊息
			if (!isSuccess) {
				InfoModal.alertError({ confirm: false, content: message });
				if (errorCallBack) {
					errorCallBack();
				}
				return;
			}
			// 成功訊息
			this.$message.success(message, 10);
			if (successCallBack) {
				successCallBack();
			}
		})
		.catch((error) => {
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		}).finally(() => {
			store.dispatch('setLoading', false);
		});
  }

	// -----------------------------------------------------------------------------------------------------

	public install(Vue) {
  	Vue.prototype.$axios = this;
	}
}

export default new AxiosService();
