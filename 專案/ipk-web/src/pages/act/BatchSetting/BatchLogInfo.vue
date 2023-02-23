<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualFormData="usualForm"
      :functionName="functionName"
      :childrenTab="$childrenTab.childrenTab.BATCH_LOG_TAB.val"
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
    <!-- 批次明細modal -->
    <a-modal
      v-model="batchDetailModalVisible"
      title="檢視批次明細"
      :width="'70%'"
      :body-style="{ maxHeight: '450px', overflow: 'hidden', overflowY: 'scroll'}"
      :destroyOnClose="true"
    >
      <div class="modal__body">
        <IpkVxeTable
          :ipkGrid="batchDetailDataGrid"
        />
      </div>
      <template slot="footer">
        <IpkButton
          buttonType="lightBlue"
          buttonText="關閉"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="batchDetailModalVisible=false"
        />
      </template>
    </a-modal>
  </div>
</template>

<script src="./BatchLogInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
