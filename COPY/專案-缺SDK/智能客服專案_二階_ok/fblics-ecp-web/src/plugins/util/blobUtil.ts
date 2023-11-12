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
    console.log('BlobUtils download')
    const blob = new Blob([data], { type: mime || data.type || 'application/octet-stream' })
    if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
      ;(window.navigator as any).msSaveBlob(blob, filename)
      return
    }
    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    setTimeout(() => {
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

  public getFileName(headers): string {
    const contentDisposition = headers['content-disposition']
    if (contentDisposition) {
      const fileName = contentDisposition.substring(contentDisposition.indexOf('filename=') + 9).replaceAll('"', '')
      return decodeURI(fileName)
    }
    return null
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
