import { getCurrentInstance, ref, computed } from 'vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import type { Ref } from 'vue'
import UploadFile from '@/plugins/uploadFile'
import { Modal } from 'ant-design-vue'

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

const fileUploadConfig = ref<FileUploadConfig>({
  uploadDisabled: false,
  multiple: true,
  showDownload: true,
  acceptFileType: '.pdf,.tiff,.tif,.xls,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.ppt,.pptx',
  acceptType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
  acceptFileSize: 5, // 可上傳的檔案大小(MB)
  maxNumber: 1,
  showRemoveIcon: true,
})

export function useUpload() {
  // upload列表
  const uploadedFileList = ref<UploadProps['fileList']>([])

  const getUploadedFileList = computed(() => uploadedFileList.value)

  const setUploadedFileList = (id, file) => {
    uploadedFileList.value[id] = file
  }

  // 上傳檔案檢核
  const beforeUpload = (file, fileList): boolean => {
    resetFile()
    const vaildResult = UploadFile.beforeUpload(
      file,
      fileList,
      uploadedFileList.value,
      null, // 不檢核檔案類型
      fileUploadConfig.value.acceptFileSize,
      fileUploadConfig.value.maxNumber,
    )
    // 錯誤阻擋
    if (!vaildResult.vaild) {
      Modal.error({
        content: vaildResult.message,
      })
      return false
    }
    return vaildResult.vaild
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

  const resetFile = (): void => {
    uploadedFileList.value = []
  }

  // 移除檔案
  const deleteFile = (file): void => {
    // const index = uploadedFileList.value.findIndex(attachment => attachment.uid === file.uid)
    // uploadedFileList.value.splice(index, 1)
  }

  return {
    setUploadedFileList,
    uploadedFileList,
    beforeUpload,
    handleChange,
    // deleteFile,
  }
}
