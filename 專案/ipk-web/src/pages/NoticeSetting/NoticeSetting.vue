<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- 資料明細 -->
      <a-tab-pane
        v-if="showDataInfoTab"
        :key="$childrenTab.childrenTab.DATA_INFO_TAB.val"
        :tab="$childrenTab.childrenTab.DATA_INFO_TAB.key"
        :closable="false"
      >
        <NoticeSettingDataInfo />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script src="./NoticeSetting.ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
