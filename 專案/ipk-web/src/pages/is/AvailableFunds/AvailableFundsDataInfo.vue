<template>
  <div class="btnGroup">
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualFormData="usualForm"
      :functionName="functionName"
      :formRules="formRules"
      :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
      @submitSaveUsual="submitSaveUsual"
      @querySetupData="querySetupData"
      @handleSearch="handleSearch($event)"
      @resetDataInfo="resetDataInfo"
    />
    <!-- 新增&匯出按鈕 -->
    <div class="mb-2">
      <IpkButton
        buttonType="primary"
        buttonText="新增"
        iconType="plus"
        :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
        :buttonKey="$buttonKey.buttonKey.ADD.val"
        @handleBtnEmit="openAddAndEditModal({actionType:$actEnum.constant.ADD.val, editDto: {} })"
      />
    <!-- TODO: 匯出BUTTON-->
    <!-- <IpkButton
      buttonType="lightBlue"
      buttonText="匯出"
      iconType="export"
      :isAuthorize="false"
      @handleBtnEmit="closeCheckEditInfoModal"
    /> -->
    </div>
    <AddAndEditModal
      :modal-add-info-show="modalAddInfoShow"
      :addAndEditInfo="addAndEditInfo"
      @closeAddAndEditModal="closeAddAndEditModal"
      @handleSearch="handleSearch($event)"
    />
    <IpkVxeTable
      ref="ipkVxeTable"
      :ipkGrid="ipkGrid"
      @sortChange="onSortChange($event)"
      @openCheckInfoModal="openCheckInfoModal($event)"
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

<script src="./AvailableFundsDataInfo.ts" lang="ts">
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
