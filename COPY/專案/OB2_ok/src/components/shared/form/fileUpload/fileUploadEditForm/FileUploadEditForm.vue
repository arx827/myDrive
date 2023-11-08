<template>
  <div>
    <a-form-model
      class="modal-formGroup"
      :model="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      :rules="fileUploadEditFormRules"
    >
      <!-- 保單號碼 -->
      <div class="result__table">
        <FblDataGrid
          :themeColor="'theme2'"
          :scroll="{ x: 600, y: 400 }"
          :row-key="gridCaseNoData.rowKey"
          :columns="gridCaseNoData.columns"
          :data="gridCaseNoData.data"
          :pagination="gridCaseNoData.pagination"
          :empty-data="gridCaseNoData.data.length <= 0"
        >
          <template v-slot:caseNoTemp="slotProps" v-if="isCaseNoChecked">
            <a-form-model-item prop="caseNo">
              <a-checkbox
                :checked="isCaseNoChecked[slotProps.data.caseNo]"
                @change="handlePolicyNoChange(slotProps.data)"
                :disabled="
                  editData != null ||
                  !casePolicyLogListCaseNos.includes(slotProps.data.caseNo)
                "
              />
            </a-form-model-item>
          </template>
        </FblDataGrid>
      </div>

      <!-- 文件類別 -->
      <a-row>
        <a-col align="left">
          <a-form-model-item :label="$t('fileUpload_fileTypeName')" required>
            <a-select
              v-model="form.fileTypeId"
              allow-clear
              @change="handleFileStatementCodeChange"
              :options="fileTypeOptions"
            >
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>

      <!-- 文件說明 -->
      <a-row>
        <a-col align="left">
          <a-form-model-item
            :label="$t('fileUpload_fileStatementName')"
            :required="isFileStatementCodeRequired"
          >
            <a-select
              v-model="form.fileStatementCode"
              allow-clear
              :options="fileStatementOptions"
              @change="checkOtherStatementRequired"
              :disabled="!isFileStatementCodeRequired"
            >
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>

      <!-- 其他說明 -->
      <a-row>
        <a-col>
          <a-form-model-item
            :label="$t('fileUpload_remark')"
            prop="remark"
            :required="isOtherStatementRequired"
            :has-feedback="otherStatementFeedback"
            :validateStatus="otherStatementState"
          >
            <a-popover
              placement="top"
              :content="otherStatementContent"
              :trigger="otherStatementHover"
            >
              <a-textarea
                class="upload-textarea"
                v-model="form.remark"
                type="text"
                :auto-size="{ maxRows: 4, minRows: 3 }"
                :maxLength="50"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>

      <!-- 上傳檔案 -->
      <a-form-model-item
        :label="$t('fileUpload_uploadFile')"
        style="margin-bottom: 0px"
        required
      >
        <!-- 選擇檔案 -->
        <a-row :gutter="8">
          <a-col span="16">
            <a-input v-model="selectedFileName" />
          </a-col>
          <!-- 瀏覽 -->
          <a-col span="4">
            <a-upload
              class="FileListUpload"
              :multiple="false"
              :before-upload="beforeUpload"
              :showUploadList="false"
            >
              <a-button :disabled="editData != null">
                <a-icon type="folder-open" />
                {{ $t("uploadFileForm_selectFile") }}
              </a-button>
            </a-upload>
          </a-col>
          <!-- 上傳 -->
          <a-col span="4">
            <a-button
              :disabled="uploadingFile == null"
              :loading="isUploading"
              @click="handleUpload"
            >
              <a-icon type="upload" />{{
                isUploading
                  ? $t("fileUpload_uploading")
                  : $t("fileUpload_upload")
              }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <!-- 上傳檔案 列表(table) -->
      <div class="result__table" v-if="gridFileData.data.length > 0">
        <FblDataGrid
          :themeColor="'theme2'"
          :scroll="{ x: 600, y: 400 }"
          :row-key="gridFileData.rowKey"
          :columns="gridFileData.columns"
          :data="gridFileData.data"
          :pagination="gridFileData.pagination"
          :empty-data="gridFileData.data.length <= 0"
        >
          <template v-slot:handleTemp="slotProps">
            <div class="d-flex">
              <button
                class="icon-button icon__delete"
                @click="handleRemove(slotProps.data)"
                v-if="editData == null"
              >
                <!-- 刪除 -->
                <img
                  class="icon-button__img"
                  src="~@/assets/imgs/button_delete.svg"
                  :alt="$t('fileUpload_delete')"
                  :title="$t('fileUpload_delete')"
                />
              </button>
              <button
                class="icon-button"
                @click="handleDownload(slotProps.data)"
              >
                <!-- 下載 -->
                <img
                  class="icon-button__img"
                  src="~@/assets/imgs/button_download.svg"
                  :alt="$t('fileUpload_download')"
                  :title="$t('fileUpload_download')"
                />
              </button>
            </div>
          </template>
        </FblDataGrid>
      </div>
    </a-form-model>
  </div>
</template>


<script src="./FileUploadEditForm.ts" lang="ts"></script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 15px;
  .ant-select {
    width: 50%;
  }
}

.upload-textarea {
  width: 70%;
}

.result__table {
  /deep/ .ant-table-tbody {
    background: @COLOR-WHITE;
    > tr {
      > td {
        padding: 0 15px !important;
        height: 45px;
      }
    }
  }

  margin-bottom: 15px;
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}
</style>