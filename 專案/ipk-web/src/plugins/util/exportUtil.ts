export default class ExportUtil {
  /**
   * 處理後端回傳的blob 匯出
   * @param resData
   * @param fileName
   * @param fileType
   */
  static dealDownloadData(resData: any, fileName: string, fileType: string) {
    try {
      let blob;
      if (resData instanceof Blob) {
        blob = resData;
      } else {
        blob = new Blob([resData], { type: resData.type });
      }
      // if (!!window.ActiveXObject || "ActiveXObject" in window) {  //IE瀏覽器
      //     navigator.msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕
      // } else {
      const linkElement = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      linkElement.setAttribute('href', url);
      linkElement.setAttribute('download', `${fileName}.${fileType}`);
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
      });
      linkElement.dispatchEvent(clickEvent);
      // }
    } catch (err) {
      console.error(err);
    }
  }
}
