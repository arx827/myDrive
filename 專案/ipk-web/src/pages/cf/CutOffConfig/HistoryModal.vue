<template>
  <div>
    <!-- 歷程 -->
    <a-modal
      ref="modal"
      v-model="modalVisible"
      :title="'歷程'"
      :maskClosable="false"
      :keyboard="false"
      :width="'70%'"
      :footer="null"
      :destroyOnClose="true"
      @cancel="closeHistoryModal"
    >
      <div>
        <IpkVxeTable
          :ipkGrid="ipkHistoryGrid"
          @handlePageChange="handleHistPageChange($event)"
          @getPendingSelected="getHisSelected($event)"
        />
      </div>
    </a-modal>
    <CheckInfoModal
      :modal-check-info-show="modalCheckInfoShow"
      :form="checkInfoContentForm"
      @closeCheckInfoModal="closeCheckInfoModal"
    />
  </div>
</template>
<script src="./HistoryModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
