/**
 * @summary 加解密
*/
import Vue, { PluginFunction, PluginObject } from 'vue';
import axios from 'axios';
import { PolicyModel } from '@fubonlife/co-giiss-api-axios-sdk';
import User from '../user';

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
		$encryptionDecryption: EncryptionDecryption;
  }
}

export interface EncryptionDecryption {
}

export class EncryptionDecryption implements PluginObject<EncryptionDecryption> {
	/**
	 * @summary 加密，返回加密後字串
	*/

	async encrypt(data: string) {
		let result = '';
		await	Vue.prototype.$utilityApi
			.encryptSthUsingPOST(data)
			.then((resp) => {
				if (resp.status === 200) {
					result = resp.data.data;
				}
			})
			.catch(console.error);
		return result;
	}

	/**
	 * @summary 解密, 返回解密後字串
	*/
	async decrypt(data: string) {
		let result = '';
		await Vue.prototype.$utilityApi
			.decryptSthUsingPOST(data)
			.then((resp) => {
				if (resp.status === 200) {
					result = resp.data.data;
				}
			})
			.catch(console.error);

		return result;
	}

	public install(Vue) {
  	Vue.prototype.$encryptionDecryption = this;
	}
}

export default new EncryptionDecryption();
