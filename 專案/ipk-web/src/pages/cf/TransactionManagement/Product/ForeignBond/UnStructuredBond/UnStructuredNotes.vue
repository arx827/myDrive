<template>
  <div class="btnGroup tabline">
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :formRules="formRules"
      :usualModalShow="false"
      :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
      @resetDataInfo="resetDataInfo"
      @handleSearch="handleSearch($event)"
    />
    <div class="mb-2">
      <IpkButton
        buttonType="primary"
        buttonText="鎖定"
        iconType="lock"
        :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataLock"
      />
      <IpkButton
        buttonType="primary"
        buttonText="資料比對"
        iconImg="icon__comparison"
        :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataComparison"
      />
      <IpkButton
        buttonType="primary"
        buttonText="產檔"
        iconType="download"
        :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
        @handleBtnEmit="handleDataFile"
      />
      <IpkButton
        buttonType="primary"
        buttonText="列印"
        iconType="printer"
        :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
        @handleBtnEmit="handleDataPrint"
      />
      <IpkButton
        buttonType="primary"
        buttonText="交易確認"
        iconType="check"
        :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
        @handleBtnEmit="handleDataConfirm"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="退回"
        iconType="stop"
        :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
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
      <IpkButton
        buttonType="lightBlue"
        buttonText="上傳庫存報表"
        iconType="upload"
        :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.UPLOAD.val"
        @handleBtnEmit="handleUploadFile"
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
    <USNCheckInfoModal
      :modalCheckInfoShow="USNmodalCheckInfoShow"
      :form="checkInfoForm"
      @searchTxDetail="searchSingleDetail"
      @handleSearch="handleSearch"
      @closeCheckInfoModal="closeCheckInfoModal"
    />
    <!-- 產檔 -->
    <FileModal
      :modal-file-show="modalFileShow"
      :defaultCustodian="'CITI'"
      :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @submitFile="submitDataFile($event)"
      @closeFileModal="closeFileModal"
    />
    <!-- 列印 -->
    <PrintModal
      :modal-print-show="modalPrintShow"
      :fileCodeOption="fileCodeOption"
      :defaultVal="defaultVal"
      :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @submitPrint="submitDataPrint($event)"
      @closePrintModal="closePrintModal"
    />
    <!-- 退回 -->
    <ReturnModal
      :modalReturnShow="modalReturnShow"
      :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
      @handleReturnFront="handleReturnFront"
      @handleReturnLock="handleReturnLock"
      @closeReturnModal="closeReturnModal"
    />
    <!-- 附件管理彈窗 -->
    <ForeignBondManageFileModal
      :apiController="'foreignBondNonstructureApi'"
      :modal-manage-file-show="modalManageFileShow"
      :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
      @closeManageFileModal="closeManageFileModal"
    />
    <!-- 報表上傳比對彈窗 -->
    <UploadCompareReportModal
      :modalShow="modalUploadCompareReportShow"
      :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
      @closeModal="closeUploadCompareReportModal"
    />
  </div>
</template>

<script src="./UnStructuredNotes.ts" lang="ts" />

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
