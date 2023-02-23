<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- 資料明細 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.DATA_INFO_TAB.val]"
        :key="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
        tab="資料明細"
        :closable="false"
      >
        <div v-show="activeKey === $cfChildrenTab.childrenTab.DATA_INFO_TAB.val">
          <FubonSsiDataInfo
            @getPendingInfoCount="getPendingInfoCount"
          />
        </div>
      </a-tab-pane>
      <!-- 待放行清單 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val]"
        :key="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :closable="false"
      >
        <template #tab>
          <span>待放行清單</span>
          <a-badge
            class="ms-2 mb-2"
            style="margin-left: 5px"
            :count="pendingCount"
          />
        </template>
        <div v-show="activeKey === $cfChildrenTab.childrenTab.PENDING_INFO_TAB.val">
          <FubonSsiPendingInfo
            @getPendingInfoCount="getPendingInfoCount"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script src="./FubonSsi.ts" lang="ts"/>

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
