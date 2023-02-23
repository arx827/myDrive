<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- 報表產檔 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.REPORT_SETUP_TAB.val]"
        :key="$childrenTab.childrenTab.REPORT_SETUP_TAB.val"
        tab="報表產檔"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.REPORT_SETUP_TAB.val">
          <InvestmentLimitReportSetup />
        </div>
      </a-tab-pane>
      <!-- 下載區 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.REPORT_DOWNLOAD_TAB.val]"
        :key="$childrenTab.childrenTab.REPORT_DOWNLOAD_TAB.val"
        tab="下載區"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.REPORT_DOWNLOAD_TAB.val">
          <InvestmentLimitReportDownload />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script src="./InvestmentLimitReport.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}

</style>
