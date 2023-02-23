<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card" @change="onTabChange">
      <!-- 國外股票 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val]"
        :key="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
        :closable="false"
      >
        <template #tab>
          <span>國外股票</span>
          <a-badge
            class="ms-2 mb-2"
            style="margin-left:5px"
            :count="foreignEquity"
          />
        </template>
        <div v-show="activeKey === $cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val">
          <TxReviewForeignEquity
            @getReviewInfoCount="getReviewInfoCount"
          />
        </div>
      </a-tab-pane>
      <!-- 國外債_非結構債 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val]"
        :key="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
        :closable="false"
      >
        <template #tab>
          <span>國外債_非結構債</span>
          <a-badge
            class="ms-2 mb-2"
            style="margin-left:5px"
            :count="nonstructured"
          />
        </template>
        <div v-show="activeKey === $cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val">
          <TxReviewForeignBondUnStructuredNotes
            @getReviewInfoCount="getReviewInfoCount"
          />
        </div>
      </a-tab-pane>
      <!-- 國外債_結構債 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.STRUCTURE_TAB.val]"
        :key="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
        :closable="false"
      >
        <template #tab>
          <span>國外債_結構債</span>
          <a-badge
            class="ms-2 mb-2"
            style="margin-left:5px"
            :count="structured"
          />
        </template>
        <div v-show="activeKey === $cfChildrenTab.childrenTab.STRUCTURE_TAB.val">
          <TxReviewForeignBondStructuredNotes
            @getReviewInfoCount="getReviewInfoCount"
          />
        </div>
      </a-tab-pane>
      <!-- 國外債_換券、Tender Offer -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val]"
        :key="$cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val"
        :closable="false"
      >
        <template #tab>
          <span>國外債_換券、Tender Offer</span>
          <a-badge
            class="ms-2 mb-2"
            style="margin-left:5px"
            :count="exchangeTenderOffer"
          />
        </template>
        <div v-show="activeKey === $cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val">
          <TxReviewForeignBondExchangeAndTender
            @getReviewInfoCount="getReviewInfoCount"
          />
        </div>
      </a-tab-pane>
      <!-- 國內債 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val]"
        :key="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
        :closable="false"
      >
        <template #tab>
          <span>國內債</span>
          <a-badge
            class="ms-2 mb-2"
            style="margin-left:5px"
            :count="domesticBond"
          />
        </template>
        <div v-if="activeKey === $cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val">
          <TxReviewDomesticBond
            @getReviewInfoCount="getReviewInfoCount"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script src="./TxReview.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}

</style>
