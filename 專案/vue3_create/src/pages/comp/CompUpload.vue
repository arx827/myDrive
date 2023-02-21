<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'

import UploadFile from '@/plugins/uploadFile'

const {
  proxy: { $notification },
} = getCurrentInstance()

// import InfoModal from '@/plugins/notification/infoModal'
// import { Modal } from 'ant-design-vue'

const fileUploadData = ref({
  //   uploadDisabled: false,
  multiple: true,
  showDownload: true,
  acceptFileType: 'image/jpeg, image/png, image/gif',
  acceptType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
  acceptFileSize: 5, // 可上傳的檔案大小(MB)
  maxNumber: 5,
  showRemoveIcon: true,
})

const uploadedFileList = ref([]) // upload列表

const uploadFlie = options => {
  console.log('uploadFlie =>', options)
  if (beforeUpload) {
    // 檢核成功
    console.log('檢核成功')
    // this.uploadApi(options.file)
  }
}

// 上傳檔案檢核
const beforeUpload = (file, fileList) => {
  console.log(file, fileList)
  resetFile()
  console.log(uploadedFileList)
  const vaildResult = UploadFile.beforeUpload(
    file,
    fileList,
    uploadedFileList.value,
    fileUploadData.value.acceptFileType,
    fileUploadData.value.acceptFileSize,
    fileUploadData.value.maxNumber,
  )
  if (vaildResult.vaild == false) {
    $notification.error({ message: vaildResult.message })
    return false
  }
  return vaildResult.vaild
}

const resetFile = () => {
  uploadedFileList.value = []
}

const handleChange = e => {
  uploadedFileList.value = uploadedFileList.value.filter(val => val.uid !== 'valid')
  if (e.file.status == 'uploading') {
    uploadedFileList.value = e.fileList
    uploadedFileList.value.map(val => {
      if (e.file.status == 'uploading') {
        val.status = 'done'
      }
      return val
    })
  }
  if (e.file.status == 'removed') {
    uploadedFileList.value = uploadedFileList.value.filter(val => val.uid !== e.file.uid)
  }
}

const fileListClass = item => {
  if (fileUploadData.value.showDownload) {
    return ['doneStatus', 'download']
  } else {
    return item.status && (item.status === 'error' || item.status === 'download') ? 'errorStatus' : 'doneStatus'
  }
}

// 下載檔案
const handleDownload = file => {
  console.log('下載檔案', file)
  // proxy.$blobUtils.download(data, '檔名')
}
// 移除檔案
const deleteFile = file => {
  const index = uploadedFileList.value.findIndex(attachment => attachment.uid === file.uid)
  uploadedFileList.value.splice(index, 1)
}

/**
 * 監聽
 */
</script>

<template>
  <div class="page__container flex-fill">
    <div class="container__wrap" ref="formEl">
      <a-upload-dragger
        name="file"
        :accept="fileUploadData.acceptFileType"
        :multiple="fileUploadData.multiple"
        :showUploadList="false"
        :custom-request="uploadFlie"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <p class="ant-upload-drag-icon">
          <img src="~@img/uploadFile.png" />
        </p>
        <p class="ant-upload-text">點擊或將文件拖曳到這裡上傳</p>
        <p class="ant-upload-hint text-left d-inline-block">
          支持上傳格式：

          <br />（1）檔案格式：{{
            fileUploadData.acceptFileType ? fileUploadData.acceptFileType.replace('.', '') : '無限制'
          }}
          <br />（2）檔案大小限制 {{ fileUploadData.acceptFileSize }} MB <br />（3）檔案上傳數最多
          {{ fileUploadData.maxNumber }} 項
        </p>
      </a-upload-dragger>
      <!-- 上傳列表 -->
      <ul class="fileList__ul" v-if="uploadedFileList.length > 0">
        <li class="fileList__li" v-for="item in uploadedFileList" :key="item.uid">
          <!-- 迴紋針icon -->
          <paper-clip-outlined class="clipIcon" />
          <span class="col" :class="fileListClass(item)" @click="handleDownload(item)">
            {{ item.name }}
          </span>
          <!-- 垃圾桶icon -->
          <span v-if="fileUploadData.showRemoveIcon">
            <delete-outlined v-if="!item.isRemoved" class="deleteIcon" @click="deleteFile(item)" />
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
::v-deep {
  // 客製化上傳列表樣式調整
  .fileList__ul {
    padding-left: 0;
    margin-top: 15px;
    margin-bottom: 0;
  }
  .fileList__li {
    font-size: 14px;
    display: flex;
    align-items: center;
    & + .fileList__li {
      margin-top: 5px;
    }
    .doneStatus {
      margin-left: 8px;
      color: $COLOR-MAIN11;
      .ant-upload-list-item-info {
        color: $COLOR-MAIN11 !important;
        padding-right: 12px;
      }
    }
    .errorStatus {
      margin-left: 8px;
      color: $COLOR-MAIN8;
      .ant-upload-list-item-info {
        color: $COLOR-MAIN8 !important;
        padding-right: 12px;
      }
    }
    .anticon-paper-clip {
      margin-left: 3px;
    }
  }
  .download {
    cursor: pointer;
  }
  .clipIcon {
    color: rgba(0, 0, 0, 0.45);
  }
  .deleteIcon {
    color: rgba(0, 0, 0, 0.45);
    display: block;
    font-size: 16px;
  }
  .fileList__li:hover {
    background-color: aliceblue;
    .deleteIcon {
      display: block;
    }
  }
}
</style>
