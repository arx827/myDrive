<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- 資料明細 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.DATA_INFO_TAB.val]"
        :key="$childrenTab.childrenTab.DATA_INFO_TAB.val"
        tab="資料明細"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.DATA_INFO_TAB.val">
          <AvailableFundsDataInfo />
        </div>
      </a-tab-pane>
      <!-- 待放行清單 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.PENDING_INFO_TAB.val]"
        :key="$childrenTab.childrenTab.PENDING_INFO_TAB.val"
        tab="待放行清單"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.PENDING_INFO_TAB.val">
          <AvailableFundsPendingInfo />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script src="./AvailableFunds.ts" lang="ts">
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
