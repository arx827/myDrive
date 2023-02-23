<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
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
      @handleBtnEmit="openAddModal"
    />
    <AddModal
      :modal-add-info-show="modalAddInfoShow"
      :addInfo="addInfo"
      @closeAddModal="closeAddModal"
      @handleSearch="handleSearch($event)"
    />
    <IpkVxeTable
      ref="ipkGrid"
      class="mt-2"
      :ipkGrid="ipkGrid"
      @sortChange="onSortChange($event)"
      @getActionType="getActionType($event)"
      @handlePageChange="handlePageChange($event)"
    />
    <CheckInfoModal
      :modal-check-info-show="modalCheckInfoShow"
      :form="checkInfoContentForm"
      @closeCheckInfoModal="closeCheckInfoModal"
    />
  </div>
</template>

<script src="./ContactDataInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
