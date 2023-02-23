/**
 * @summary 取得承辦人常用資料
*/
import Vue, { PluginFunction, PluginObject } from 'vue';
import axios from 'axios';
import { PolicyModel } from '@fubonlife/co-giiss-api-axios-sdk';
import User from '../user';

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
      $userInfo: UserInfoService;
  }
}

export interface UserInfoSerivceOption {
}

export class UserInfoService implements PluginObject<UserInfoSerivceOption> {
	public getPolicyModel(option?: PolicyModel): PolicyModel {
		// 取得保單資訊
  	const loginInfo = User.getMe();
  	const policyDetail = User.getPolicyDetail();
		const policyModel: PolicyModel = {
			policyNo: option === undefined ? loginInfo.policyNo : option.policyNo,
			policySeq: option === undefined ? loginInfo.policySeq : option.policySeq,
			times: option === undefined ? policyDetail.times : option.times,
		};
		return policyModel;
	}

	public getProject() {
		// 取得險種計畫 (1：RC, 8：CB) 抓保單號碼第一碼
	  let project;
		switch (User.getMe().policyNo.charAt(0)) {
		case '1':
			project = 'RC';
			break;
		case '8':
			project = 'CB';
			break;
		}
		return project;
	}

	public getAuthId() {
		return new Promise((resolve, reject) => {
			// Vue.prototype.$authApi.
			Vue.prototype.$globalAuthApi.getAuthIdByRoleUsingPOST('CASE_OFFICER')
				.then((resp) => {
					if (resp.data.status === 200) {
					// this.grid.data = resp.data.data;
						resolve(resp.data.data);
					} else {
						resolve(null);
					}
				})
				.catch((error) => {
					reject();
					console.log('error status = ', error);
				})
				.finally(() => {
				// this.isDownloading = false;
				});
		});
	}

	public install(Vue) {
  	Vue.prototype.$userInfo = this;
	}
}

export default new UserInfoService();
