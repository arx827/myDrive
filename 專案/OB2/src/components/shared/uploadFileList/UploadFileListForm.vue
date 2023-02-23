<template>
  <div tabindex="-1">
    <a-row>
      <a-col>
        <a-button
          type="primary"
          @click="showFileAdd"
          style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
        >
          <a-icon type="plus" />{{ $t("global_add") }}
        </a-button>
      </a-col>
    </a-row>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <FblDataGrid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          size="middle"
          :width="800"
          @actionClick="onTableActionClick($event)"
          style="padding-left: 24px; padding-right: 12px"
          ref="fileListGrid"
        >
        </FblDataGrid>
      </a-col>
    </a-row>
    <!-- 上傳附件 -->
    <a-modal
      v-model="formVisible"
      :title="$t('uploadFileForm_uploadFile')"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_save')"
      :maskClosable="false"
      @ok="singleFileSubmit"
      @cancel="singleFileCancel"
    >
      <SingleFileUploadForm
        :fileProp="singleFile"
        ref="singleFileUploadForm"
        @reloadData="reload"
        @beforeUpload="beforeSingleUpload"
        @uploadFormClose="singleFileCancel"
        @handleUpload="handleSingleUpload"
      >
      </SingleFileUploadForm>
    </a-modal>
    
  </div>
</template>
<script src="./UploadFileListForm.ts" lang="ts"></script>