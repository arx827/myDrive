<template>
  <div class="btnGroup tabline">
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :formRules="formRules"
      :usualModalShow="false"
      :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
      @resetDataInfo="resetDataInfo"
      @handleSearch="handleSearch($event)"
    />
    <div class="mb-2">
      <IpkButton
        buttonType="primary"
        buttonText="放行"
        iconType="check"
        :buttonDisabled="isEmpty(selectedRowList)"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleReviewList($cfEnum.txDoubleReviewStatus.APPROVAL.val)"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="退回"
        iconType="stop"
        :buttonDisabled="isEmpty(selectedRowList)"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleReturnList($cfEnum.txDoubleReviewStatus.RETURN.val)"
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
    <DomesticCheckInfoModal
      :modal-check-info-show="modalCheckInfoShow"
      :checkInfoFormTitle="multiCheckInfoFormTitle"
      :mainForm="main"
      :otherForm="other"
      :ssiForm="ssi"
      :attachmentInfo="attachment"
      :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
      @closeCheckInfoModal="closeCheckInfoModal"
      @handleReturn="handleReturn($event)"
      @handleReview="handleReview($event)"
    />
  </div>
</template>

<script src="./TxDoubleReviewDomesticBond.ts" lang="ts" />

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
