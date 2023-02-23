<template>
  <a-modal
    ref="modal"
    v-model="showModal"
    :maskClosable="false"
    :keyboard="false"
    :width="'50%'"
    :after-close="modalClose"
    :destroyOnClose="true"
    centered
  >
    <div class="cardArea modal__body h-100">
      <NoticeCard :noticeData="detail" />
    </div>
    <template slot="title">
      <span>通知</span>
    </template>
    <template slot="footer">
      <IpkButton
        v-if="showPreview"
        buttonType="primary"
        buttonText="預覽"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="openPreviewModal"
      />
      <IpkButton
        buttonType="lightBlue"
        buttonText="關閉"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="modalClose"
      />
    </template>
    <NoticeModal
      v-if="showPreview"
      :modal-notice-show="showPreviewModal"
      :detail="detailPreview"
      @modalClose="closePreviewModal"
    />
  </a-modal>
</template>
<script src="./NoticeModal.ts"/>
<style lang="scss" scoped>
::v-deep {
  .ant-modal .ant-modal-header {
    padding: 13px 12px 8px 12px;
  }
  .ant-modal .ant-modal-close-x {
    line-height: 50px;
  }
  .ant-modal-title {
    font-size: 18px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 0 !important;
  }
}

.cardArea {
  width: 85%;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}
</style>
