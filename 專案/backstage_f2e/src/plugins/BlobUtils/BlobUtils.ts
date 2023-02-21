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

    private vue: Vue;

    public install(Vue, options: BlobUtilsOption) {
    	// TEST:
    	// console.log('download utils installed');
    	Vue.prototype.$blobUtils = this;
    }
}
export default new BlobUtils();
