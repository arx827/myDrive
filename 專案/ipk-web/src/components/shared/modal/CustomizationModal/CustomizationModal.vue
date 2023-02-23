<template>
  <a-modal
    v-model="modalVisible"
    :closable="false"
    :maskClosable="false"
    :keyboard="false"
    width="474px"
    :after-close="closeCustomizationModal"
    :destroyOnClose="true"
  >
    <div>
      <div>
        <div>
          <a-icon
            :type="iconType"
            class="modal__icon"
            :class="[iconClass]"
            theme="filled"
          />
          <span class="modal__title">
            {{ title }}
          </span>
        </div>
        <div class="modal__content">
          {{ content }}
        </div>
        <slot name="modalContent" />
      </div>
    </div>
    <template slot="footer" class="modal__footer">
      <slot :name="'footerBtn'">
        <IpkButton
          v-if="confirm"
          buttonType="lightBlue"
          :buttonText="cancelText"
          :isAuthorize="false"
          @handleBtnEmit="closeCustomizationModal"
        />
        <!-- TODO: 按鈕樣式待修改 -->
        <a-button class="ant-btn-error" @click="handleSubmit">
          {{ confirmText }}
        </a-button>
      </slot>
    </template>
  </a-modal>
</template>

<script src="./CustomizationModal.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-footer {
    border-top: 0;
    padding-bottom: 20px;
    padding-right: 32px;
  }
  .ant-modal-body {
    padding: 32px 32px 7px !important;
  }
}
.modal__title {
  font-weight: 600;
  color: #000;
  font-size: 16px;
  padding-bottom: 10px;
}
.modal__content {
  font-size: 14px;
  white-space: pre-line;
  padding: 5px;
  margin: 0 0 5px 27px;
}
</style>
