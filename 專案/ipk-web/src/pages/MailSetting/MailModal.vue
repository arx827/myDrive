<template>
  <a-modal
    ref="modal"
    v-model="showModal"
    :maskClosable="false"
    :keyboard="false"
    :width="'50%'"
    :after-close="modalClose"
    :body-style="{ maxHeight: '825px', overflow: 'hidden', overflowY: 'scroll'}"
    :destroyOnClose="true"
    centered
  >
    <div class="cardArea modal__body h-100">
      <a-card class="mailCard">
        <template #title>
          <a-row>
            <a-col class="mailCard__title">
              {{ detail.noticeSubject }}
            </a-col>
          </a-row>
        </template>
        <a-row>
          <a-col class="mailCard__content">
            <div v-html="detail.noticeContent" />
          </a-col>
        </a-row>
      </a-card>
    </div>
    <template slot="title">
      <span>信件</span>
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
    <MailModal
      v-if="showPreview"
      :modal-notice-show="showPreviewModal"
      :detail="detailPreview"
      @modalClose="closePreviewModal"
    />
  </a-modal>
</template>
<script src="./MailModal.ts"/>
<style lang="scss" scoped>
::v-deep {
  .ant-modal {
    padding-bottom: 0px;
  }

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

.mailCard {
  flex: 0 0 100%;
  height: 95%;
}

.mailCard__title {
  white-space: normal;
  word-break: break-word;
}

.mailCard__content {
  height: 684px;
  overflow-y: scroll;
}
</style>
