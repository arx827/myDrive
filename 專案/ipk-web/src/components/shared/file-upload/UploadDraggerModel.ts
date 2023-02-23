export interface UploadModel {
	multiple?: boolean; // 是否可上傳多筆檔案
	fileUploadURL?: string; // 檔案上傳路徑
	acceptFileType?: string; // 可上傳的檔案類型
	acceptType?: string[]; // 可上傳的檔案類型
	acceptFileSize?: number; // 可上傳的檔案大小(MB)
	uploadDisabled?: boolean; // 是否要禁用上傳元件
	showRemoveIcon?: boolean; // 是否顯示移除icon
	showDownload?: boolean; // 是否顯示下載區塊
}

export interface uploadList {
	uid: string; // 文件唯一標識，建議設置為負數，防止和內部產生的 id 衝突
	name: string; // 文件名
	status: 'uploading' | 'done' | 'error' | 'removed'; // 檔案狀態
}
