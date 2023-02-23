import Vue from 'vue';
import InfoModal from '@/plugins/notification/infoModal';
import exportUtil from '@/plugins/util/exportUtil';
import store from '@/store/index';
import { FileDto } from '@fubonlife/ipk-api-axios-sdk';
import validateUtil from '@/plugins/util/validateUtil';

declare module 'vue/types/vue' {
  interface Vue {
      $generateFileCommon: GenerateFileService;
  }
}

export class GenerateFileService extends Vue {
	/**
	 * @summary 產檔列印前檢查
   * @param {Array} txCode: 交易編號
	*/
	public async validateBeforeGenerate(txCode: Array<string>, apiController = '$foreignBondStructureApi') {
    let data: any = {};
    store.dispatch('setLoading', true);
		await	Vue.prototype[apiController].checkBeforeGenerateUsingPOST(txCode)
		.then((res) => {
			data = res.data;
      store.dispatch('setLoading', false);
		})
		.catch((error) => {
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      store.dispatch('setLoading', false);
		});
		return data;
	}

  /**
	 * @summary 產檔列印
   * @param {Object} fileDto
	*/
  public async getGenerateFile(fileDto: FileDto, apiController = '$foreignBondStructureApi') {
    let data: any = {};
    store.dispatch('setLoading', true);
		await	Vue.prototype[apiController].generateFileUsingPOST(fileDto)
		.then((res) => {
			data = res.data;
      store.dispatch('setLoading', false);
		})
		.catch((error) => {
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      store.dispatch('setLoading', false);
		});
		return data;
	}

  /**
	 * @summary 下載
	 * @param {string} fileId: 流水號
	 * @param {string} fileName: 檔名
	 * @param {string} fileType: 檔案格式
	*/
	public async download(fileId: string, fileName: string, fileType: string) {
		// 解析檔案格式
		let type = '';
		if (!validateUtil.isEmpty(fileType)) {
				type = fileType.toLocaleUpperCase() === this.$cfEnum.fileExtensionEnum.EXCEL ? 'xlsx' : fileType;
		}
		// call API
		await this.$filedownload.downloadUsingGET(fileId, { responseType: 'blob' })
		.then((res) => {
			const content: any = res.data;

			// size = 0 代表尚未產檔完成
			if (content.size > 0) {
					exportUtil.dealDownloadData(content, fileName, type.trim());
			}
		})
		.catch((error) => {
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
	}

	public install(Vue) {
  	Vue.prototype.$generateFileCommon = this;
	}
}

export default new GenerateFileService();
