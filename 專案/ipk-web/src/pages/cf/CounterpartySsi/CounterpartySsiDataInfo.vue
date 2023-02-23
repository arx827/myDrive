<template>
  <div>
    <AdvancedSearch
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualModalShow="false"
      :childrenTab="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
      @handleSearch="handleSearch($event)"
    />
    <IpkButton
      buttonType="primary"
      buttonText="新增"
      iconType="plus"
      :childrenTab="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.ADD.val"
      @handleBtnEmit="openAddAndEditModal({actionType: $cfEnum.constant.ADD.val})"
    />
    <IpkVxeTable
      ref="ipkGrid"
      class="mt-2"
      :ipkGrid="ipkGrid"
      @handlePageChange="handlePageChange($event)"
      @sortChange="onSortChange($event)"
      @getActionType="getActionType($event)"
    />
    <!-- 新增/編輯彈窗 -->
    <SsiAddAndEditModal
      :modalAddInfoShow="modalAddInfoShow"
      :addAndEditInfo="addAndEditInfo"
      @closeAddAndEditModal="closeAddAndEditModal"
    />
    <!-- 新增檢視彈窗 -->
    <SsiCheckInfoModal
      :modalCheckInfoShow="modalCheckInfoShow"
      :checkInfo="checkInfoForm"
      @closeCheckInfoModal="closeCheckInfoModal"
    />
    <!-- 歷程彈窗 -->
    <SsiHistoryModal
      :historyShow="historyShow"
      :historyInfo="historyInfo"
      @closeHistoryModal="closeHistoryModal"
    />
  </div>
</template>

<script src="./CounterpartySsiDataInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
