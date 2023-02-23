<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- 介接總帳紀錄檔 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.DATA_INFO_TAB.val]"
        :key="$childrenTab.childrenTab.DATA_INFO_TAB.val"
        tab="介接總帳紀錄檔"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.DATA_INFO_TAB.val">
          <GeneralLedgerDataInfo />
        </div>
      </a-tab-pane>
      <!-- 匯入傳票明細檔 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.IMPORT_TAB.val]"
        :key="$childrenTab.childrenTab.IMPORT_TAB.val"
        tab="匯入傳票明細檔"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.IMPORT_TAB.val">
          <GeneralLedgerImportInfo />
        </div>
      </a-tab-pane>
      <!-- 匯出傳票明細檔 -->
      <!-- <a-tab-pane
        :key="'EXPORT_TAB'"
        tab="匯出傳票明細檔"
        :closable="false"
      >
        <div v-if="activeKey === 'EXPORT_TAB'">
          <ActJournalExportInfo />
        </div>
      </a-tab-pane> -->
      <!-- 匯入傳票號碼 -->
      <!-- <a-tab-pane
        :key="'REPORT_UPLOAD_JOURNAL_TAB'"
        tab="匯入傳票號碼"
        :closable="false"
      >
        <div v-if="activeKey === 'REPORT_UPLOAD_JOURNAL_TAB'">
          <ActJournalImportInfo />
        </div>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script src="./InvestAccount.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
