<template>
  <div>
    <a-modal
      ref="modal"
      v-model="modalVisible"
      title="歷程"
      :maskClosable="false"
      :keyboard="false"
      :width="'70%'"
      :destroyOnClose="true"
      @cancel="closeHistoryModal"
    >
      <div>
        <IpkVxeTable
          :ipkGrid="ipkGrid"
          @handlePageChange="handlePageChange($event)"
          @getPendingSelected="getPendingSelected($event)"
        />
      </div>
      <template slot="footer">
        <IpkButton
          buttonType="lightBlue"
          buttonText="關閉"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="closeHistoryModal"
        />
      </template>
    </a-modal>
    <SsiCheckInfoModal
      :modalCheckInfoShow="modalCheckInfoShow"
      :checkInfo="checkInfoForm"
      @closeCheckInfoModal="closeCheckInfoModal"
    />
  </div>
</template>
<script src="./SsiHistoryModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 15px;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
}
</style>
