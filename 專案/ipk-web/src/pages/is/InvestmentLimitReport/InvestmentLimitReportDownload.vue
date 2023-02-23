<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualFormData="usualForm"
      :functionName="functionName"
      :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
      @submitSaveUsual="submitSaveUsual"
      @querySetupData="querySetupData"
      @handleSearch="handleSearch($event)"
    />
    <IpkVxeTable
      :ipkGrid="ipkGrid"
      @sortChange="onSortChange($event)"
      @getActionType="getActionType($event)"
      @handlePageChange="handlePageChange($event)"
    />
  </div>
</template>

<script src="./InvestmentLimitReportDownload.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
