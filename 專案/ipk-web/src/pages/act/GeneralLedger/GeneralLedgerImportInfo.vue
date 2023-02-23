<template>
  <div class="btnGroup">
    <!-- 匯入傳票 -->
    <div class="mx-0 mt-1 mb-2">
      <!-- 匯入檔案按鈕 -->
      <IpkButton
        class="mx-0 mt-1 mb-2"
        buttonType="primary"
        buttonText="匯入"
        iconType="export"
        :childrenTab="$childrenTab.childrenTab.IMPORT_TAB.val"
        :buttonKey="$buttonKey.buttonKey.UPLOAD.val"
        @handleBtnEmit="uploadFile"
      />
      <UploadDragger
        :fileUploadData="fileUploadData"
        :fileUploadStatus="fileUploadStatus"
        :fileList="fileList"
        @deleteFile="deleteFile"
        @handleChange="handleChange"
      />
      <!-- 客製化訊息彈窗 -->
      <CustomizationModal
        :modalCustomizationShow="modalCustomizationShow"
        :title="'新增失敗'"
        :content="errorContent"
        :confirm="true"
        :iconClassName="'error'"
      >
        <template v-slot:footerBtn>
          <IpkButton
            buttonType="lightBlue"
            buttonText="下載"
            iconType="download"
            :isAuthorize="false"
            @handleBtnEmit="downloadFile"
          />
          <IpkButton
            buttonType="primary"
            buttonText="確定"
            iconType="download"
            :isAuthorize="false"
            @handleBtnEmit="modalCustomizationShow=false"
          />
        </template>
      </CustomizationModal>
      <!-- 匯入檔案按鈕 -->
      <div style="text-align:right">
        <IpkButton
          class="mx-0 mt-1 mb-2"
          buttonType="primary"
          buttonText="匯入"
          iconType="export"
          :childrenTab="$childrenTab.childrenTab.IMPORT_TAB.val"
          :buttonKey="$buttonKey.buttonKey.UPLOAD.val"
          @handleBtnEmit="uploadFile"
        />
      </div>
    </div>
  </div>
</template>

<script src="./GeneralLedgerImportInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
