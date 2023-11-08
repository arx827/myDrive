import { getCurrentInstance, ref } from 'vue'
import UploadFile from '@/plugins/uploadFile'
import type { Ref } from 'vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import type { FileInfoDto } from '@fubonlife/gise-api-axios-sdk'

export interface FileUploadConfig {
  uploadDisabled: boolean
  multiple: boolean
  showDownload: boolean
  acceptFileType: string
  acceptType: string[]
  acceptFileSize: number
  maxNumber: number
  showRemoveIcon: boolean
}

/**
 * @summary 共用-身份證明檔案上傳
 * @param {Ref<FileUploadConfig>} fileUploadData 檔案上傳設定
 * @param {Ref<uploadedFileList>} uploadedFileList 上傳的檔案資料
 * @return {Function():Promise<void>} uploadFlie 自定義上傳檔案
 * @return {Function(file, fileList): boolean} beforeUpload 上傳檔案檢核
 * @return {Function():Promise<void>} handleChange 檔案變更
 * @return {Function(file):Promise<void>} deleteFile 移除檔案
 **/
export function useUpload(fileUploadData: Ref<FileUploadConfig>, uploadedFileList: Ref<UploadProps['fileList']>) {
  const {
    proxy: { $global, $modal, $commonApi },
  } = getCurrentInstance()

  // upload列表
  // const uploadedFileList = ref<UploadProps['fileList']>([])

  const uploadCount = ref<number>(0)

  // 自定義上傳檔案
  const uploadFlie = async (options): Promise<void> => {
    // API: 1.2.34.	共用-身份證明檔案上傳API
    return $commonApi.uploadIdFileUsingPOST(options.file).then(resp => {
      const respData = resp?.data
      if (respData?.status === 200) {
        const index = uploadedFileList.value.findIndex(attachment => attachment.uid === options.file.uid)
        Object.assign(uploadedFileList.value[index], {
          uid: respData.data.fileId,
        })
      } else {
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(resp?.data?.apiError),
        })
        deleteFile(options.file)
      }
    })
  }

  // 上傳檔案檢核
  const beforeUpload = (file, fileList): boolean => {
    uploadCount.value++
    if (!fileUploadData.value.multiple) resetFile()
    const vaildResult = UploadFile.beforeUpload(
      file,
      fileList,
      uploadedFileList.value,
      fileUploadData.value.acceptFileType,
      fileUploadData.value.acceptFileSize,
      fileUploadData.value.maxNumber,
    )

    if (!vaildResult.vaild) {
      if (uploadCount.value === 1 && uploadedFileList.value.length + fileList.length > fileUploadData.value.maxNumber)
        $modal.error({
          title: '錯誤',
          content: vaildResult.message,
          onOk: () => {
            uploadCount.value = 0
            resetFile()
          },
        })

      return false
    }
    if (vaildResult.vaild) uploadCount.value = 0
    return vaildResult.vaild
  }

  const resetFile = (): void => {
    uploadedFileList.value = []
  }

  const handleChange = (info: UploadChangeParam): void => {
    uploadedFileList.value = uploadedFileList.value.filter(val => val.uid !== 'valid')
    if (info.file.status == 'uploading') {
      uploadedFileList.value = info.fileList
      uploadedFileList.value.map(val => {
        if (info.file.status == 'uploading') {
          val.status = 'done'
        }
        return val
      })
    }
    if (info.file.status == 'removed') {
      uploadedFileList.value = uploadedFileList.value.filter(val => val.uid !== info.file.uid)
    }
  }

  // 移除檔案
  const deleteFile = (file): void => {
    const index = uploadedFileList.value.findIndex(attachment => attachment.uid === file.uid)
    uploadedFileList.value.splice(index, 1)
  }

  return {
    uploadFlie,
    beforeUpload,
    handleChange,
    deleteFile,
  }
}
