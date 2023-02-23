<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualModalShow="false"
      :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
      @handleSearch="handleSearch($event)"
    />
    <div class="mx-0 mt-1 mb-2">
      <IpkButton
        buttonType="primary"
        buttonText="放行"
        iconType="check"
        :buttonDisabled="isEmpty(selectedRowList)"
        :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleReviewList($cfEnum.reviewStatus.APPROVAL.val)"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="拒絕"
        iconType="stop"
        :buttonDisabled="isEmpty(selectedRowList)"
        :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleRejectList($cfEnum.reviewStatus.REJECT.val)"
      />
    </div>
    <IpkVxeTable
      :ipkGrid="ipkGrid"
      @getPendingSelected="getPendingSelected($event)"
      @checkboxChange="onCheckboxChange($event)"
      @checkboxAll="onCheckboxChange($event)"
      @handlePageChange="handlePageChange($event)"
    />
    <CheckEditInfoModal
      :modal-check-edit-info-show="modalCheckEditInfoShow"
      :afterForm="checkInfoAfterForm"
      :beforeForm="checkInfoBeforeForm"
      :isDisabled="isDisabled"
      @closeCheckEditInfoModal="closeCheckEditInfoModal"
      @handleReject="handleReject($event)"
      @handleReview="handleReview($event)"
    />
  </div>
</template>

<script src="./ApprovalConfigPendingInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
