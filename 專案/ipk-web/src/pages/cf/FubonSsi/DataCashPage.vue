<template>
  <div>
    <!-- TODO: 權限待修改 -->
    <IpkButton
      buttonType="primary"
      buttonText="新增款"
      iconType="plus"
      :isAuthorize="false"
      @handleBtnEmit="openAddAndEditModal"
    />
    <IpkVxeTable
      class="mt-2"
      :ipkGrid="ipkGrid"
      @handlePageChange="handlePageChange($event)"
      @sortChange="onSortChange($event)"
      @getActionType="getActionType($event)"
    />
    <DataCashAddModal
      :checkInfo="checkInfo"
      :cashModalAddInfoShow="cashModalAddInfoShow"
      @closeAddAndEditModal="closeAddAndEditModal"
      @getPendingInfoCount="getPendingInfoCount"
    />
    <DataCashHistoryModal
      :history-show="historyShow"
      :historyInfo="historyInfo"
      @closeHistoryModal="closeCashHistoryModal"
    />
    <DataCashEditModal
      :checkInfo="checkInfo"
      :cashEditInfo="cashEditInfo"
      :cashEditInfoShow="cashEditInfoShow"
      @closeCashEditModal="closeCashEditModal"
      @getPendingInfoCount="getPendingInfoCount"
    />
  </div>
</template>

<script src="./DataCashPage.ts" lang="ts" />

<style lang="scss" scoped>
</style>
