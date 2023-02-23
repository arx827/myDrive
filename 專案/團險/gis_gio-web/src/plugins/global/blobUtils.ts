import Vue, { PluginFunction, PluginObject } from 'vue';
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
	// 3. Declare augmentation for Vue
	interface Vue {
		$blobUtils: BlobUtils;
	}
}
export interface ErrResModel {
	apiErrorCode: string;
  errors: Array<string>;
  message: string;
  status: string;
}

export interface FetchFileList {
	uid: string;
	url: string;
	name?: string;
}

export interface BlobUtilsOption {}

export class BlobUtils implements PluginObject<BlobUtilsOption> {
	public download(data: Blob, filename: string, mime?: string) {
		// It is necessary to create a new blob object with mime-type explicitly set
		// otherwise only Chrome works like it should
		const blob = new Blob([data], { type: mime || data.type || 'application/octet-stream' });
		if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
			// IE doesn't allow using a blob object directly as link href.
			// Workaround for "HTML7007: One or more blob URLs were
			// revoked by closing the blob for which they were created.
			// These URLs will no longer resolve as the data backing
			// the URL has been freed."
			(window.navigator as any).msSaveBlob(blob, filename);
			return;
		}
		// Other browsers
		// Create a link pointing to the ObjectURL containing the blob
		const blobURL = window.URL.createObjectURL(blob);
		const tempLink = document.createElement('a');
		tempLink.style.display = 'none';
		tempLink.href = blobURL;
		tempLink.setAttribute('download', filename);
		// Safari thinks _blank anchor are pop ups. We only want to set _blank
		// target if the browser does not support the HTML5 download attribute.
		// This allows you to download files in desktop safari if pop up blocking
		// is enabled.
		if (typeof tempLink.download === 'undefined') {
			tempLink.setAttribute('target', '_blank');
		}
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
		setTimeout(() => {
			// For Firefox it is necessary to delay revoking the ObjectURL
			window.URL.revokeObjectURL(blobURL);
		}, 100);
	}

	/**
  	* 更新上傳檔案列表(單筆/多筆上傳)
		* @param {File} file: 此次檔案
		* @param {string} filename 檔名
		* @param {Array<File>} fileList 上傳檔案列表
		* @param {Boolean} multiple 是否為多筆上傳
		* @returns {Array<File>} fileList
  */
	public updateFileList(file: File, filename: string, fileList: Array<File>, multiple: boolean, mime?: string) {
		if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
			(window.navigator as any).msSaveBlob(file as unknown as Blob, filename);
			return;
		}
		// Other browsers
		// Create a link pointing to the ObjectURL containing the blob
		const blobURL = window.URL.createObjectURL(file as unknown as Blob);

		if (multiple) {
			// 多筆上傳
			fileList.push(Object.assign(file, { url: blobURL }));
		} else {
			// 單筆上傳
			fileList.splice(0, 1, Object.assign(file, { url: blobURL }));
		}
		return fileList;
	}

	/**
  	* 取得後端回傳的檔案並塞進檔案上傳列表
		* @param {Blob} data API 取得之 Blob 文件
		* @param {string} filename 檔名
		* @param {Array<FetchFileList>} fileList 上傳檔案列表
		* @param {string} mime
		* @returns {Array}
  */
	public fetchFileList(data: Blob, filename: string, fileList: Array<FetchFileList>, mime?: string) {
		const blob = new Blob([data], { type: mime || data.type || 'application/octet-stream' });
		// 轉成 File 格式，可參照到實體檔案
		const file = new File([blob], filename);
		// Create a link pointing to the ObjectURL containing the blob
		const blobURL = window.URL.createObjectURL(blob);

		fileList.push(
			Object.assign(file, {
				uid: JSON.stringify(fileList.length + 1),
				url: blobURL,
			}),
		);
		return fileList;
	}

	// 獲取 fileName 並解碼
	public decodeFileName(data) {
		let filename = '';
		const disposition = data.headers['content-disposition'];
		if (disposition && disposition.indexOf('attachment') !== -1) {
			const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			const matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) {
				filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
			}
		}
		return filename;
	}

	public convertErrorBlobToString(error) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (res) => {
				const result: string = res.target.result as string; // 得到字串
				const data: ErrResModel = JSON.parse(result); // 解析成json物件
				resolve(data);
			};
			reader.onerror = (err) => {
				reject(err);
			};
			reader.readAsText(error);
		});
	}

	/**
  	* 釋放 blobURL 的記憶體
		* @param {string} blobURL
  */
	public revokeObjectURL(blobURL: string) {
		setTimeout(() => {
			// For Firefox it is necessary to delay revoking the ObjectURL
			window.URL.revokeObjectURL(blobURL);
		}, 100);
	}

	private vue: Vue;

	public install(Vue, options: BlobUtilsOption) {
		// console.log('download utils installed');
		Vue.prototype.$blobUtils = this;
	}
}
export default new BlobUtils();
