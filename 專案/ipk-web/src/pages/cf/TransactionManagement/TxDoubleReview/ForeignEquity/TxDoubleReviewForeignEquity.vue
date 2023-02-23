<template>
  <div class="btnGroup tabline">
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualModalShow="false"
      :formRules="formRules"
      :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
      @resetDataInfo="resetDataInfo"
      @handleSearch="handleSearch($event)"
    />
    <div class="mb-2">
      <IpkButton
        buttonType="primary"
        buttonText="放行"
        iconType="check"
        :buttonDisabled="isEmpty(selectedRowList)"
        :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleReviewList($cfEnum.txDoubleReviewStatus.APPROVAL.val)"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="退回"
        iconType="stop"
        :buttonDisabled="isEmpty(selectedRowList)"
        :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleReturnList($cfEnum.txDoubleReviewStatus.RETURN.val)"
      />
      <IpkButton
        buttonType="lightBlue"
        buttonText="附件管理"
        iconType="paper-clip"
        :isAuthorize="false"
        @handleBtnEmit="handleManageFile"
      />
    </div>
    <IpkVxeTable
      ref="ipkGrid"
      :ipkGrid="ipkGrid"
      @sortChange="onSortChange($event)"
      @checkboxChange="onCheckboxChange($event)"
      @checkboxAll="onCheckboxChange($event)"
      @handlePageChange="handlePageChange($event)"
      @openCheckInfoModal="openCheckInfoModal($event)"
    />
    <!-- 檢視 -->
    <ForeignCheckInfoModal
      :modal-check-info-show="modalCheckInfoShow"
      :mainForm="main"
      :otherForm="other"
      :ssiForm="ssi"
      :attachmentInfo="attachmentInfo"
      :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
      @closeCheckInfoModal="closeCheckInfoModal"
      @searchTxDetail="searchTxDoubleReviewDetail"
      @handleSearch="handleSearch($event)"
      @handleReturn="handleReturn($event)"
      @handleReview="handleReview($event)"
    />
    <!-- 退回原因 -->
    <CustomizationModal
      :modalCustomizationShow="modalCustomizationShow"
      :title="$cfMessageEnum.rejectReasonModalSettings.title"
      :content="$cfMessageEnum.rejectReasonModalSettings.content"
      :confirm="true"
      @closeCustomizationModal="closeCustomizationModal($event)"
      @handleSubmit="submitReturn"
    >
      <template v-slot:modalContent>
        <a-textarea
          v-model="rejectReason"
          :auto-size="{ minRows: 3, maxRows: 3 }"
          allow-clear
          style="width: 90%; margin-left: 27px"
          :maxLength="30"
          :placeholder="$cfMessageEnum.rejectReasonModalSettings.placeholder"
        />
      </template>
    </CustomizationModal>

    <!-- 附件管理 -->
    <ManageFile
      :modal-manage-file-show="modalManageFileShow"
      @closeManageFileModal="closeManageFileModal"
    />
  </div>
</template>

<script src="./TxDoubleReviewForeignEquity.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 5px 15px 5px 15px;
  }
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
.modal_content  {
  font-weight: $TEXT-BOLD;
  color: $COLOR-BLACK;
}
.modal_content_wrap {
  margin-left: 32px;
}
</style>
