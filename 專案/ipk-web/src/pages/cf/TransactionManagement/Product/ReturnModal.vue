<template>
  <CustomizationModal
    :modalCustomizationShow="modalReturnShow"
    :iconClassName="'info'"
    :title="'請選擇退回方式'"
  >
    <template v-slot:modalContent>
      <div class="modal_content_wrap">
        點選<span class="modal_content">退回解鎖</span>，此筆交易之交易狀態將變為<span class="modal_content">已放行</span>。
      </div>
      <div class="modal_content_wrap">
        點選<span class="modal_content">退回修改</span>，此筆交易之交易狀態將變為<span class="modal_content">已鎖定</span>。
      </div>
    </template>
    <template v-slot:footerBtn>
      <IpkButton
        buttonType="lightBlue"
        buttonText="取消"
        :isAuthorize="false"
        @handleBtnEmit="closeReturnModal"
      />
      <!-- TODO: 按鈕樣式待調整 -->
      <!-- TODO: 權限待調整 -->
      <a-button class="ant-btn-error" @click="handleReturnFront">
        退回修改
      </a-button>
      <a-button class="ant-btn-error" @click="handleReturnLock">
        退回解鎖
      </a-button>
    </template>
  </CustomizationModal>
</template>
<script src="./ReturnModal.ts" lang="ts" />

<style lang="scss" scoped>
</style>
