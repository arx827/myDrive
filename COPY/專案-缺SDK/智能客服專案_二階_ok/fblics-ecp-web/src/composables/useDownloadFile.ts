import { getCurrentInstance } from 'vue'
// import type { FileIdAndSourceDto, WebRestResponse } from '@fubonlife/gise-api-axios-sdk'

/**
 * 檔案下載
 * @param {string} fileId 檔案 ID
 * @return {function(fileId: FileIdAndSourceDto): Promise<void>} downloadFile(fileId) 下載檔案函式，帶入 fileId，下載檔案
 **/

export function useDownloadFile() {
  const {
    proxy: { $commonApi, $blobUtils, $global, $modal },
  } = getCurrentInstance()

  const downloadFile = (fileIdAndSource: FileIdAndSourceDto): Promise<void> => {
    // return $commonApi.downloadEFileUsingPOST(fileIdAndSource, { responseType: 'blob' }).then(async resp => {
    //   // console.log('resp', resp)
    //   const disposition = resp.headers['content-disposition']
    //   if (disposition) {
    //     const filename = $blobUtils.getFileName(resp.headers)
    //     $blobUtils.download(resp.data as Blob, filename, resp.headers['content-type'])
    //   } else {
    //     const errorMsg: WebRestResponse = await $blobUtils.convertErrorBlobToString(resp.data)
    //     $modal.error({
    //       title: '錯誤',
    //       content: $global.getApiErrorMsg(errorMsg.apiError),
    //     })
    //   }
    // })
    // .catch(() =>
    //   $modal.error({
    //     title: '錯誤',
    //     content: '系統有誤，請洽系統管理者',
    //   }),
    // )
  }

  return { downloadFile }
}
