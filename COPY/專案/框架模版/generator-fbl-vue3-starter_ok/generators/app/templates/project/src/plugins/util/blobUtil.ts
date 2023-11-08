import type { App } from 'vue'
// import Vue, { PluginFunction, PluginObject } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $blobUtils: BlobUtils
  }
}

export interface ErrResModel {
  apiErrorCode: string
  errors: Array<string>
  message: string
  status: string
}

export interface BlobUtilsOption {}

export class BlobUtils {
  public download(data: Blob, filename: string, mime?: string) {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const blob = new Blob([data], { type: mime || data.type || 'application/octet-stream' })
    if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
      // IE doesn't allow using a blob object directly as link href.
      // Workaround for "HTML7007: One or more blob URLs were
      // revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing
      // the URL has been freed."
      ;(window.navigator as any).msSaveBlob(blob, filename)
      return
    }
    // Other browsers
    // Create a link pointing to the ObjectURL containing the blob
    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(blobURL)
    }, 100)
  }

  public downloadFile(response, fileName?: string) {
    const blob = response.data as Blob
    const blobUrl = URL.createObjectURL(blob)
    const downloadlink: HTMLAnchorElement = document.createElement('a')
    const downloadName = fileName || this.getContentDisposition(response.headers) || '未知檔名'
    downloadlink.setAttribute('href', blobUrl)
    downloadlink.setAttribute('download', `${downloadName}`)
    downloadlink.click()
    downloadlink.remove()
  }

  public getContentDisposition(headers) {
    const contentDisposition = headers['content-disposition']
    if (contentDisposition) {
      const fileName = contentDisposition.substring(contentDisposition.indexOf('filename=') + 9).replaceAll('"', '')
      return decodeURI(fileName)
    }
    return null
  }

  public convertErrorBlobToString(error) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = res => {
        const result: string = res.target.result as string // 得到字串
        const data: ErrResModel = JSON.parse(result) // 解析成json物件
        resolve(data)
      }
      reader.onerror = err => {
        reject(err)
      }
      reader.readAsText(error)
    })
  }

  public install(app: App, options?: BlobUtilsOption) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$blobUtils = this
  }
}
export default new BlobUtils()
