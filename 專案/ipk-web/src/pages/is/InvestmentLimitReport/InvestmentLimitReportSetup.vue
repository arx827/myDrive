<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualFormData="usualForm"
      :functionName="functionName"
      :formRules="formRules"
      :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
      @submitSaveUsual="submitSaveUsual"
      @querySetupData="querySetupData"
    >
      <template v-slot:collapse>
        <!-- 產檔按鈕 -->
        <IpkButton
          class="mx-0 mt-1 ms-2"
          buttonType="primary"
          buttonText="產檔"
          iconType="download"
          :childrenTab="$childrenTab.childrenTab.REPORT_SETUP_TAB.val"
          :buttonKey="$buttonKey.buttonKey.ADD.val"
          @handleBtnEmit="openCustomizationModal"
        />
      </template>
    </AdvancedSearch>
    <!-- 產檔彈窗 -->
    <CustomizationModal
      :modalCustomizationShow="modalCustomizationShow"
      :title="'是否確定產檔？'"
      :confirm="true"
      :iconClassName="'info'"
      @closeCustomizationModal="closeCustomizationModal($event)"
      @handleSubmit="handleReportSetup"
    >
      <template v-slot:modalContent>
        <div class="form__label">
          基準日：{{ reportSetupForm.baseDate }}
        </div>
        <div v-if="!isEmpty(reportSetupForm.symId)" class="form__label">
          商品代碼：{{ reportSetupForm.symId }}
        </div>
        <div
          v-if="!isEmpty(reportSetupForm.counterPartyName)"
          class="form__label"
        >
          歸戶名稱：{{ reportSetupForm.counterPartyName }}
        </div>
        <div
          v-if="!isEmpty(reportSetupForm.counterPartyId)"
          class="form__label"
        >
          機構編號：{{ reportSetupForm.counterPartyId }}
        </div>
      </template>
    </CustomizationModal>
  </div>
</template>

<script src="./InvestmentLimitReportSetup.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
.form__label {
  display: block;
  line-height: 28px;
  white-space: initial;
  text-align: left;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
