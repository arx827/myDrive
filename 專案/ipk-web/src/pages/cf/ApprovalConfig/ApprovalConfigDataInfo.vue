<template>
  <div class="mt-2">
    <IpkVxeTable
      :ipkGrid="ipkGrid"
      @getActionType="getActionType($event)"
    />
    <AddAndEditModal
      :modal-add-info-show="modalAddInfoShow"
      :addAndEditInfo="addAndEditInfo"
      @closeAddAndEditModal="closeAddAndEditModal"
      @handleSearch="getApprovalConfig"
    />
    <HistoryModal
      :history-show="historyShow"
      :historyInfo="historyInfo"
      @closeHistoryModal="closeHistoryModal"
    />
  </div>
</template>

<script src="./ApprovalConfigDataInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
