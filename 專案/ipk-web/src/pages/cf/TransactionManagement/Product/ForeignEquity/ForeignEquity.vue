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
      @handleSearch="handleSearch"
    />
    <div class="mb-2">
      <IpkButton
        buttonType="primary"
        buttonText="鎖定"
        iconType="lock"
        :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataLock"
      />
      <IpkButton
        buttonType="primary"
        buttonText="資料比對"
        iconImg="icon__comparison"
        :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataComparison"
      />
      <IpkButton
        buttonType="primary"
        buttonText="產檔"
        iconType="download"
        :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
        @handleBtnEmit="handleDataFile"
      />
      <IpkButton
        buttonType="primary"
        buttonText="列印"
        iconType="printer"
        :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
        @handleBtnEmit="handleDataPrint"
      />
      <IpkButton
        buttonType="primary"
        buttonText="交易確認"
        iconType="check"
        :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataConfirm"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="退回"
        iconType="stop"
        :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
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
    </div>
    <IpkVxeTable
      ref="ipkGrid"
      :ipkGrid="ipkGrid"
      @sortChange="onSortChange($event)"
      @checkboxChange="onCheckboxChange($event)"
      @checkboxAll="onCheckboxChange($event)"
      @openCheckInfoModal="openCheckInfoModal($event)"
    />
    <!-- 檢視 -->
    <FECheckInfoModal
      :modal-check-info-show="modalCheckInfoShow"
      :formData="formData"
      @closeCheckInfoModal="closeCheckInfoModal"
      @searchTxDetail="searchTxDetail"
      @handleSearch="handleSearch($event)"
    />
    <!-- 產檔 -->
    <FileModal
      :modal-file-show="modalFileShow"
      :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @submitFile="submitDataFile($event)"
      @closeFileModal="closeFileModal"
    />
    <!-- 列印 -->
    <PrintModal
      :modal-print-show="modalPrintShow"
      :fileCodeOption="fileCodeOption"
      :defaultVal="defaultVal"
      :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @submitPrint="submitDataPrint($event)"
      @closePrintModal="closePrintModal"
    />
    <!-- 退回 -->
    <ReturnModal
      :modalReturnShow="modalReturnShow"
      :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @handleReturnFront="handleReturnFront"
      @handleReturnLock="handleReturnLock"
      @closeReturnModal="closeReturnModal"
    />
    <!-- 附件管理 -->
    <ForeignEquityManageFileModal
      :modal-manage-file-show="modalManageFileShow"
      @closeManageFileModal="closeManageFileModal"
    />
  </div>
</template>

<script src="./ForeignEquity.ts" lang="ts" />

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
