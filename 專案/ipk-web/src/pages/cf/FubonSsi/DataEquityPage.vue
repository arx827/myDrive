<template>
  <div>
    <!-- TODO: 權限待修改 -->
    <IpkButton
      buttonType="primary"
      buttonText="新增券"
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
    <DataEquityAddModal
      :equityModalAddInfoShow="equityModalAddInfoShow"
      :checkInfo="checkInfo"
      @closeAddAndEditModal="closeAddAndEditModal"
      @getPendingInfoCount="getPendingInfoCount"
    />
    <DataEquityHistoryModal
      :history-show="historyShow"
      :historyInfo="historyInfo"
      @closeHistoryModal="closeEquityHistoryModal"
    />
    <DataEquityEditModal
      :checkInfo="checkInfo"
      :equityEditInfo="equityEditInfo"
      :equityEditInfoShow="equityEditInfoShow"
      @closeEquityEditModal="closeEquityEditModal"
      @getPendingInfoCount="getPendingInfoCount"
    />
  </div>
</template>

<script src="./DataEquityPage.ts" lang="ts" />

<style lang="scss" scoped>
</style>
