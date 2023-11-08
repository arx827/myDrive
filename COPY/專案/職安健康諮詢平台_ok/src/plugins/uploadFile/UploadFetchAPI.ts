/**
 * @summary 自定義打上傳API
*/
import Vue, { PluginFunction, PluginObject } from 'vue';
import notification from '@/plugins/notification/infoNotification';
import axios from 'axios';

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
		$customUpload: CustomUpload;
  }
}

export enum UploadAPIUrl {
  MOTHEREVENT = '/api/mon-plan/rpn/event-content-maintain/event-content/update', // 母性:儲存活動內容
  HEALTHPUSHSAVE = '/api/health/health-act/rpn/event-session-maintain/activity/save', // 健康促進:儲存健康促進活動
  HEALTHTPUSHTEMPSAVE = '/api/health/health-act/rpn/event-session-maintain/activity/provisional', // 健康促進:暫存健康促進活動
  HEALTHTPUSHQUESTSAVE = '/api/health/health-act/rpn/satisfy-quest/satisfy-quest-save', // 健康促進:滿意度問卷維護-儲存
  HEALTHTPUSHQUESTTEMPSAVE = '/api/health/health-act/rpn/satisfy-quest/satisfy-quest-provisional', // 健康促進:滿意度問卷維護-暫存
	DOCTOREVENT = '/api/health/physician-consult/rpn/portal/create', // 編輯醫師諮詢入口設定
	ERGONOMICUPLOADDOC = '/api/health/humanity/rpn/phy-consult_file-update', // 上傳醫師諮詢附件-人因性問卷答案填寫記錄檔
	ERGONOMICSIMPLEFORMSAVE = '/api/health/humanity/rpn/human-factor-edit-checkTable', // 儲存簡易人因工程檢核表
	ERGONOMICFORMSAVE = '/api/health/humanity/rpn/human-factort-update', // 儲存人因性問卷入口設定
	STRANGEEVENTSAVE = '/api/health/caseinquiry/rpn/update-over-load-config', // 異常活動儲存
}

export interface CustomUpload {
}

export class CustomUpload implements PluginObject<CustomUpload> {
	/**
	 * @summary 將file格式轉成base64
	*/
	async FiletoDataURL(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	/**
	 * @summary 將base64轉成file格式
	*/
	dataURLtoFile(dataurl, filename) {
  	const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1];
  	const bstr = atob(arr[1]); let n = bstr.length; const
  		u8arr = new Uint8Array(n);
  	while (n--) {
  		u8arr[n] = bstr.charCodeAt(n);
  	}
  	return new File([u8arr], filename, { type: mime });
	}

	/**
	 * @summary 呼叫API
	*/
	async fetchAPI(url: UploadAPIUrl, dataKey: string, data: any, filesKey: string, files: any, onSuccess?: Function, onError?: Function, cb?: Function, filesKey2?: string, files2?: any) {
		const forms = new FormData();
		// if (files)
		files.forEach((e) => {
			forms.append(filesKey, e);
		});
		if (files2) {
			files2.forEach((e) => {
				forms.append(filesKey2, e);
			});
		}
		forms.append(dataKey, new Blob([JSON.stringify(data)], { type: 'application/json' }));
		console.log(JSON.stringify(data));
		await	axios.post(process.env.VUE_APP_API_BASE_URL + url, forms)
			.then((resp) => {
				if (resp.data.status === 200) {
					onSuccess(resp);
				} else {
					onError(resp.data.apiError);
				}
			})
			.catch((error) => {
				// API失敗
				notification.error({ content: '系統忙碌中, 請稍後再試' });
				// console.log('系統忙碌中, 請稍後再試');
			}).finally(() => {
				cb();
			});
	}

	public install(Vue) {
		Vue.prototype.$customUpload = this;
	}
}

export default new CustomUpload();
