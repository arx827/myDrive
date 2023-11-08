export interface UploadModel {
  multiple?: boolean // 是否可上傳多筆檔案
  fileUploadURL?: string // 檔案上傳路徑
  acceptFileType?: string // 可上傳的檔案類型
  acceptType?: string[] // 可上傳的檔案類型
  acceptFileSize?: number // 可上傳的檔案大小(MB)
  uploadDisabled?: boolean // 是否要禁用上傳元件
  showRemoveIcon?: boolean // 是否顯示移除icon
  showDownload?: boolean // 是否顯示下載區塊
}
