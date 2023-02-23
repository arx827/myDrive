<template>
  <div class="btnGroup">
    <!-- 介接總帳紀錄檔 -->
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
      @openCheckInfoModal="openCheckInfoModal($event)"
      @getActionType="getActionType($event)"
    />
    <CheckInfoModal
      :modal-check-info-show="modalCheckInfoShow"
      :form="checkInfoContentForm"
      @closeCheckInfoModal="closeCheckInfoModal"
    />
  </div>
</template>

<script src="./GeneralLedgerDataInfo.ts" lang="ts">
</script>

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
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
