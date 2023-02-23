<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualFormData="usualForm"
      :functionName="functionName"
      :childrenTab="$childrenTab.childrenTab.BATCH_SETTING_TAB.val"
      @submitSaveUsual="submitSaveUsual"
      @querySetupData="querySetupData"
      @handleSearch="handleSearch($event)"
    />
    <EditBatchModal
      :modal-add-info-show="modalEditInfoShow"
      :batchEditInfo="batchEditInfo"
      @closeEditBatchModal="closeEditBatchModal"
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
    <!-- 歷程modal -->
    <a-modal
      v-model="histModalVisible"
      title="檢視歷程"
      :width="'70%'"
      :body-style="{ maxHeight: '450px', overflow: 'hidden', overflowY: 'scroll'}"
      :destroyOnClose="true"
    >
      <div class="modal__body">
        <IpkVxeTable
          :ipkGrid="histDataGrid"
          @sortChange="onHistSortChange($event)"
          @handlePageChange="handleHistPageChange($event)"
        />
      </div>
      <template slot="footer">
        <IpkButton
          buttonType="lightBlue"
          buttonText="關閉"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="histModalVisible=false"
        />
      </template>
    </a-modal>
  </div>
</template>

<script src="./BatchSettingInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
