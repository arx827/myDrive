<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- 批次設定 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.BATCH_SETTING_TAB.val]"
        :key="$childrenTab.childrenTab.BATCH_SETTING_TAB.val"
        tab="批次設定"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.BATCH_SETTING_TAB.val">
          <BatchSettingInfo />
        </div>
      </a-tab-pane>
      <!-- 批次紀錄 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.BATCH_LOG_TAB.val]"
        :key="$childrenTab.childrenTab.BATCH_LOG_TAB.val"
        tab="批次紀錄"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.BATCH_LOG_TAB.val">
          <BatchLogInfo />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script src="./BatchSetting.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}

</style>
