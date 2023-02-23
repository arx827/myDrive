<template>
  <a-modal
    v-model="modalVisible"
    title="上傳庫存報表"
    :maskClosable="false"
    :keyboard="false"
    :width="'50%'"
    :after-close="closeModal"
    :body-style="{ maxHeight: '700px', overflow: 'hidden', overflowY: 'scroll'}"
    :destroyOnClose="true"
  >
    <div class="modal__body">
      <div class="block__title">
        債券保管：BONY
      </div>
      <UploadDragger
        :fileUploadData="fileUploadData"
        :fileList="fileList.bony"
        @handleChange="handleChange($event,'bony')"
        @deleteFile="deleteUpload($event,'bony')"
      />
      <div class="block__title">
        債券保管：CITI
      </div>
      <UploadDragger
        :fileUploadData="fileUploadData"
        :fileList="fileList.citi"
        @handleChange="handleChange($event,'citi')"
        @deleteFile="deleteUpload($event,'citi')"
      />
      <div class="block__title">
        債券保管：JPM
      </div>
      <UploadDragger
        :fileUploadData="fileUploadData"
        :fileList="fileList.jpm"
        @handleChange="handleChange($event,'jpm')"
        @deleteFile="deleteUpload($event,'jpm')"
      />
    </div>
    <template slot="footer">
      <div class="btnGroup tabline">
        <IpkButton
          buttonType="lightBlue"
          buttonText="取消"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="closeModal"
        />
        <!-- TODO: 權限待修改 -->
        <IpkButton
          buttonType="primary"
          buttonText="送出"
          iconType="check"
          :buttonDisabled="submitDisabled"
          :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
          :buttonKey="$cfButtonKey.buttonKey.UPLOAD.val"
          @handleBtnEmit="submit"
        />
      </div>
    </template>
  </a-modal>
</template>
<script src="./UploadCompareReportModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
.block__title {
  font-size: 16px;
  padding: 10px 0;
  &:first-of-type {
    padding-top: 0;
  }
}
</style>
