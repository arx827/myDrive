<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- ALM資訊主檔 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.DATA_INFO_TAB.val]"
        :key="$childrenTab.childrenTab.DATA_INFO_TAB.val"
        tab="ALM資訊主檔"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.DATA_INFO_TAB.val">
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
            @handlePageChange="handlePageChange($event)"
          />
          <CheckInfoModal
            :modal-check-info-show="modalCheckInfoShow"
            :form="checkInfoContentForm"
            @closeCheckInfoModal="closeCheckInfoModal"
          />
        </div>
      </a-tab-pane>
      <!-- 匯入ALM資訊 -->
      <a-tab-pane
        v-if="!isEmpty(authInfo) && authInfo[$childrenTab.childrenTab.IMPORT_TAB.val]"
        :key="$childrenTab.childrenTab.IMPORT_TAB.val"
        tab="匯入ALM資訊"
        :closable="false"
      >
        <div v-if="activeKey === $childrenTab.childrenTab.IMPORT_TAB.val">
          <div class="mx-0 mt-1 mb-2">
            <!-- 匯入檔案按鈕 -->
            <IpkButton
              class="mx-0 mt-1 mb-2"
              buttonType="primary"
              buttonText="匯入"
              iconType="export"
              :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
              :buttonKey="$buttonKey.buttonKey.UPLOAD.val"
              @handleBtnEmit="uploadFile"
            />
            <UploadDragger
              :fileUploadData="fileUploadData"
              :fileUploadStatus="fileUploadStatus"
              :fileList="fileList"
              @deleteFile="deleteFile"
              @handleChange="handleChange"
            />
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script src="./AlmGeneralLedger.ts" lang="ts">
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
