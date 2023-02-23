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
        buttonText="鎖定"
        iconType="lock"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataLock"
      />
      <IpkButton
        buttonType="primary"
        buttonText="資料比對"
        iconImg="icon__comparison"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataComparison"
      />
      <IpkButton
        v-if="!isClickEditBtn"
        buttonType="primary"
        buttonText="編輯"
        iconType="edit"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleEdit"
      />
      <IpkButton
        v-if="isClickEditBtn"
        buttonType="primary"
        buttonText="儲存"
        iconType="edit"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.SAVE.val"
        @handleBtnEmit="handleEditSave"
      />
      <IpkButton
        v-if="isClickEditBtn"
        buttonType="lightBlue"
        buttonText="取消"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="handleCancelEdit"
      />
      <IpkButton
        buttonType="primary"
        buttonText="列印"
        iconType="printer"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
        @handleBtnEmit="handleDataPrint"
      />
      <IpkButton
        buttonType="primary"
        buttonText="交易確認"
        iconType="check"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataConfirm"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="退回"
        iconType="stop"
        :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataReturn"
      />
      <IpkButton
        buttonType="lightBlue"
        buttonText="附件管理"
        iconType="paper-clip"
        :isAuthorize="false"
        @handleBtnEmit="handleManageFile"
      />
      <!-- <IpkButton
        buttonType="lightBlue"
        buttonText="資金調撥"
        iconType="dollar"
        @handleBtnEmit="handleUploadFile"
      /> -->
    </div>
    <IpkVxeTable
      ref="ipkGrid"
      :ipkGrid="ipkGrid"
      :showEditFlag="isClickEditBtn"
      @sortChange="onSortChange($event)"
      @checkboxChange="onCheckboxChange($event)"
      @checkboxAll="onCheckboxChange($event)"
      @openCheckInfoModal="openCheckInfoModal($event)"
      @handleEditChange="handleEditChange($event)"
    />
    <!-- 檢視 -->
    <DBCheckInfoModal
      :modalCheckInfoShow="USNmodalCheckInfoShow"
      :formData="checkInfoForm"
      @searchTxDetail="searchSingleDetail"
      @handleSearch="handleSearch($event)"
      @closeCheckInfoModal="closeCheckInfoModal"
    />
    <!-- 列印 -->
    <PrintModal
      :modal-print-show="modalPrintShow"
      :fileCodeOption="fileCodeOption"
      :defaultVal="defaultVal"
      :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @submitPrint="submitDataPrint($event)"
      @closePrintModal="closePrintModal"
    />
    <!-- 退回 -->
    <ReturnModal
      :modalReturnShow="modalReturnShow"
      :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @handleReturnFront="handleReturnFront"
      @handleReturnLock="handleReturnLock"
      @closeReturnModal="closeReturnModal"
    />
    <!-- 附件管理彈窗 -->
    <DBManageFileModal
      :apiController="'domesticBondApi'"
      :modal-manage-file-show="modalManageFileShow"
      @closeManageFileModal="closeManageFileModal"
    />
  </div>
</template>

<script src="./DomesticBond.ts" lang="ts" />

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
