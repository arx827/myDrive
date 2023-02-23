<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- 非結構債 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val]"
        :key="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
        tab="非結構債"
        :closable="false"
      >
        <div v-show="activeKey === $cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val">
          <UnStructuredNotes />
        </div>
      </a-tab-pane>
      <!-- 結構債 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.STRUCTURE_TAB.val]"
        :key="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
        tab="結構債"
        :closable="false"
      >
        <div v-show="activeKey === $cfChildrenTab.childrenTab.STRUCTURE_TAB.val">
          <StructuredNotes />
        </div>
      </a-tab-pane>
      <!-- 換券、Tender Offer -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val]"
        :key="$cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val"
        tab="換券、Tender Offer"
        :closable="false"
      >
        <div v-show="activeKey === $cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val">
          <ExchangeAndTender />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script src="./ForeignBond.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
