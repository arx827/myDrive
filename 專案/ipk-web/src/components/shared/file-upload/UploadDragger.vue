<template>
  <div class="mb-3">
    <a-upload-dragger
      name="file"
      :disabled="fileUploadData.uploadDisabled ? fileUploadData.uploadDisabled : false"
      :multiple="fileUploadData.multiple"
      :action="fileUploadData.fileUploadURL"
      :accept="fileUploadData.acceptFileType"
      :beforeUpload="beforeUpload"
      :showUploadList="false"
      @reject="rejectInvalidTypeFile"
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <img src="~@images/uploadFile.png">
      </p>
      <p class="ant-upload-text">
        點擊或將文件拖曳到這裡上傳
      </p>
      <p class="ant-upload-hint">
        檔案格式：{{ fileUploadData.acceptFileType ? fileUploadData.acceptFileType.replaceAll('.','') : '無限制' }}
      </p>
    </a-upload-dragger>
    <!-- 上傳列表 -->
    <div v-if="fileUploadList">
      <div v-for="item in fileUploadList" :key="item.uid">
        <div class="listStyle">
          <!-- 迴紋針icon -->
          <a-icon class="clipIcon" type="paper-clip" />
          <!-- 檔名區塊 不需下載 -->
          <span v-if="!fileUploadData.showDownload" :class="item.status && (item.status === 'error'|| item.status === 'download')? 'errorStatus': 'doneStatus'">
            {{ item.name }}
          </span>
          <!-- 檔名區塊 需下載 -->
          <span v-else class="doneStatus" :class="{'download': item.isDownload}" @click="handleDownload(item)">
            {{ item.name }}
          </span>
          <!-- 垃圾桶icon -->
          <span v-if="fileUploadData.showRemoveIcon ? fileUploadData.showRemoveIcon : true">
            <a-icon v-if="!item.isRemoved" class="deleteIcon" type="delete" @click="deleteFile(item)" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./UploadDragger.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  // 客製化上傳列表樣式調整
  .listStyle {
    margin: 10px 0 0 0;
    .doneStatus {
      margin-left: 14px;
      color: $COLOR-MAIN14;
      .ant-upload-list-item-info {
        color: $COLOR-MAIN14 !important;
        padding: 0 12px 0 0px;
      }
    }
    .errorStatus {
      margin-left: 14px;
      color: $COLOR-MAIN8;
      .ant-upload-list-item-info {
        color: $COLOR-MAIN8 !important;
        padding: 0 12px 0 0px;
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
    color:rgba(0,0,0,.45);
  }
  .deleteIcon {
    color:rgba(0,0,0,.45);
    display: none;
    float: right;
    padding: 3px 3px 0 0;
  }
  .listStyle:hover {
    background-color: aliceblue;
    .deleteIcon {
      display: block;
    }
  }
}
</style>
