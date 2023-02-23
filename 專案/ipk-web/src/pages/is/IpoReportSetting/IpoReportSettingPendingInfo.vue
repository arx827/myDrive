<template>
  <div class="btnGroup">
    <!-- 多筆放行&拒絕按鈕 -->
    <div class="mx-0 mt-1 mb-2">
      <IpkButton
        buttonType="primary"
        buttonText="放行"
        iconType="check"
        :childrenTab="$childrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$buttonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleReviewList($actEnum.reviewStatus.APPROVAL.val)"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="拒絕"
        iconType="stop"
        :childrenTab="$childrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$buttonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleRejectList($actEnum.reviewStatus.REJECT.val)"
      />
    </div>
    <IpkVxeTable
      :ipkGrid="pendingDataGrid"
      @sortChange="onPendingSortChange($event)"
      @getPendingSelected="getPendingSelected($event)"
      @checkboxChange="onCheckboxChange($event)"
      @checkboxAll="onCheckboxChange($event)"
    />
    <CheckInfoModal
      :modal-check-info-show="modalCheckInfoShow"
      :form="checkInfoAddForm"
      :isPending="isPending"
      @closeCheckInfoModal="closeCheckInfoModal"
      @handleReject="handleReject($event)"
      @handleReview="handleReview($event)"
    />
    <CheckEditInfoModal
      :modal-check-edit-info-show="modalCheckEditInfoShow"
      :afterForm="checkInfoAfterForm"
      :beforeForm="checkInfoBeforeForm"
      @closeCheckEditInfoModal="closeCheckEditInfoModal"
      @handleReject="handleReject($event)"
      @handleReview="handleReview($event)"
    />
    <CustomizationModal
      :modalCustomizationShow="modalCustomizationShow"
      :title="'請輸入拒絕放行原因'"
      :content="'若確認拒絕放行，請輸入拒絕放行原因，謝謝。'"
      :confirm="true"
      @closeCustomizationModal="closeCustomizationModal($event)"
      @handleSubmit="submitReject"
    >
      <template v-slot:modalContent>
        <a-textarea
          v-model="rejectReason"
          :auto-size="{ minRows: 3, maxRows: 3 }"
          allow-clear
          style="width: 90%; margin-left: 27px"
          :maxLength="100"
          placeholder="請簡述拒絕放行原因。"
        />
      </template>
    </CustomizationModal>
  </div>
</template>

<script src="./IpoReportSettingPendingInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .vxe-table--render-default {
    $height: var(--tableHeight); // 取得computed變數tableHeight的值
    .vxe-table--fixed-left-wrapper {
      .vxe-table--body-wrapper {
        height: calc(#{$height}px - 17px);
      }
    }
    .vxe-table--fixed-right-wrapper {
      .vxe-table--body-wrapper {
        height: calc(#{$height}px - 17px);
      }
    }
  }
}
</style>
