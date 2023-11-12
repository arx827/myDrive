import Axios from 'axios'

export default class AjaxService {
	/**
   * @description ajax 上傳檔案
   * @param url Api url
   * @param formData 上傳的檔案
   */
	static postUploadFile(url: string, formData: FormData): Promise<any> {
    return new Promise((resolve, reject) => {
      Axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_BASE_URL}${url}`,
        data: formData,
      })
      .then(resolve)
      .catch(reject)
    })
  }

	/**
   * @description 檔案匯出+下載
   * @param url Api url
   * @param datas request物件
   */
	static postExportFile(url: string, datas: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_BASE_URL}${url}`,
        data: datas,
				responseType: 'blob',
      })
      .then((response) => {
				// 認 Header 的 content-type，判斷要跳訊息還是要下載檔案
				const contentType = response.headers['content-type'];
				// 回傳這個表示有錯誤訊息
				if (contentType.indexOf('json') !== -1) {
					let resultData = null;
					const fileReader = new FileReader();
					fileReader.readAsText(response.data, 'utf-8');
					fileReader.onload = () => {
						resultData = JSON.parse(fileReader.result as string);
						response.data = resultData;
						resolve(response);
					}
				} else {
					// 執行下載
					this.doDownload(response, null);
					response.data = {
						apiStatus: true,
					}
					resolve(response);
				}
			})
      .catch((e) => {
				console.error(e);
				reject(e);
			})
    })
  }

	/**
	 * @description 下載檔案
 	 * @param response 後端API回傳response
	 * @param fileName 檔名(不傳則取後端回傳檔名)
 	 */
	static doDownload(response, fileName) {
		if (fileName == null) {
			// 取後端傳回的檔案名稱
			const contentDisposition = response.headers['content-disposition'];
			if (contentDisposition) {
				if (contentDisposition.indexOf('filename=') !== -1) {
					const filenameStr = contentDisposition.substring(contentDisposition.indexOf('filename='));
					const filenameArr = filenameStr.split('=');
					fileName = decodeURI(filenameArr[1]);
				}
			}
		}

		// 下載檔案
		const blob = new Blob([response.data] as BlobPart[])
		const blobURL = window.URL.createObjectURL(blob);
		const tempLink = document.createElement('a');
		tempLink.style.display = 'none';
		tempLink.href = blobURL;
		tempLink.setAttribute('download', fileName);
		tempLink.setAttribute('target', '_blank');
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
		setTimeout(() => {
			window.URL.revokeObjectURL(blobURL)
		}, 100)
	}
}
