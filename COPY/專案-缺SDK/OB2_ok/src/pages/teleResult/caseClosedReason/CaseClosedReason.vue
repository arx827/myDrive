<template >
  <div @keyup.enter="caseClosedReasonSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="CaseClosedReasonSearchForm"
          style="background-color: #eef6f8"
          ref="contactResultRules"
          :rules="caseClosedReasonSearchRules"
        >
          <a-row>
            <a-col :span="6">
              <!-- 結案原因代碼 -->
              <a-form-model-item
                :label="$t('caseClosedReason_caseClosedReasonId')"
                prop="caseClosedReasonId"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(caseClosedReasonIdFeildValidation).feedback"
                :validateStatus="callCommonUtilFeild(caseClosedReasonIdFeildValidation).state"
              >
                <div style="margin:4">
                  <validate-input
                    itemPlacement="top"
                    :validateForm="caseClosedReasonIdFeildValidation"
                    :maxLength="20"
                    :value="CaseClosedReasonSearchForm.caseClosedReasonId"
                    @input="validateInput"
                  ></validate-input>
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 結案原因名稱 -->
              <a-form-model-item
                :label="$t('caseClosedReason_caseClosedReasonName')"
                prop="caseClosedReasonName"
                style="margin-bottom: 0px"
              >
                <a-input
                  type="text"
                  v-model="CaseClosedReasonSearchForm.caseClosedReasonName"
                  :max-length="50"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="4">
              <!-- 是否啟用 -->
              <a-form-model-item
                :label="$t('contactResult_status')"
                prop="status"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="CaseClosedReasonSearchForm.status"
                  :options="selectStatusOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="caseClosedReasonSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button
                  type="default"
                  @click="resetCaseClosedReasonSearchForm"
                >
                  {{ $t("global_clean") }}
                </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-row>
      <a-col>
        <a-button
          type="primary"
          @click="caseClosedReasonAddModal"
          style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
        >
          <a-icon type="plus" />{{ $t("global_add") }}
        </a-button>
      </a-col>
    </a-row>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <FblDataGrid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          size="middle"
          @actionClick="onTableActionClick($event)"
          @tableChange="onPageChange($event)"
          style="padding-left: 24px; padding-right: 12px"
        >
        </FblDataGrid>
      </a-col>
    </a-row>
    <!-- 結案原因設定 -->
    <a-modal
      v-model="formVisible"
      :title="$t('caseClosedReason_caseClosedReasonSetting')"
      :maskClosable="false"
      width="1100px"
      :cancelText="$t('global_cancel')"
      :okText="formButtonText"
      @ok="onFormSubmit"
      @cancel="onFormCalcel"
    >
      <CaseClosedReasonEditForm
        :initData="editingData"
        :selectStatusOptions="selectStatusOptions"
        ref="caseClosedReasonEditForm"
        @reloadData="reload"
      >
      </CaseClosedReasonEditForm>
    </a-modal>
  </div>
</template>

<script src="./CaseClosedReason.ts" lang="ts"></script>

