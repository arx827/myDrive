<template >
  <div @keyup.enter="onSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="TeleResultConfigSearchForm"
          style="background-color: #eef6f8"
          :rules="teleResultConfigIdSearchRules"
        >
          <a-row>
            <a-col :span="6">
              <!-- 編號 -->
              <a-form-model-item
                :label="$t('global_serialNumber')"
                style="margin-bottom: 0px"
                prop="teleResultConfigId"
                :has-feedback="
                  callCommonUtilFeild(teleResultConfigIdFeildValidation)
                    .feedback
                "
                :validateStatus="
                  callCommonUtilFeild(teleResultConfigIdFeildValidation).state
                "
              >
                <validate-input
                  itemPlacement="top"
                  :validateForm="teleResultConfigIdFeildValidation"
                  :maxLength="20"
                  :value="TeleResultConfigSearchForm.teleResultConfigId"
                  @input="onChange($event)"
                ></validate-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6">
              <!-- 電訪項目 -->
              <a-form-model-item
                :label="$t('userTask')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.taskId"
                  :options="taskQueryOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 聯絡結果 -->
              <a-form-model-item
                :label="$t('pedding_contactResult')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.contactResultId"
                  :options="contactResultQueryOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 電訪結果 -->
              <a-form-model-item
                :label="$t('pedding_pendingResult')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.teleResultId"
                  :options="teleResultQueryOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 結案原因 -->
              <a-form-model-item
                :label="$t('pedding_caseCloseReason')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.caseClosedReasonId"
                  :options="caseClosedReasonQueryOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6">
              <!-- 是否照會 -->
              <a-form-model-item
                :label="$t('teleResultPage_isNoti')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.notification"
                  :options="selectEngOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 是否會辦 -->
              <a-form-model-item
                :label="$t('teleResultPage_isInf')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.inform"
                  :options="selectEngOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 是否郵寄權益信函 -->
              <a-form-model-item
                :label="$t('teleResultPage_isEmailAdjunct')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.sendInterestLetter"
                  :options="selectEngOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 是否列入有效保單 -->
              <a-form-model-item
                :label="$t('teleResultPage_isEffectivePolicy')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.validPolicy"
                  :options="selectEngOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6">
              <!-- 是否列入完成電訪 -->
              <a-form-model-item
                :label="$t('teleResultPage_isCompeletedUserTask')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.completeTele"
                  :options="completeTeleQueryOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 是否回寫AS400 -->
              <a-form-model-item
                :label="$t('teleResultPage_isWritenInAs400')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.returnAs400"
                  :options="selectChineseOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 回寫至主機的對應值 -->
              <a-form-model-item
                :label="$t('teleResultPage_isWritenInServer')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.hostCorrespond"
                  :options="hostCorrespondQueryOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 是否啟用 -->
              <a-form-model-item
                :label="$t('contactResult_status')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultConfigSearchForm.status"
                  :options="selectStatusOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="onSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button
                  type="default"
                  @click="resetTeleResultConfigSearchForm"
                >
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 匯出 -->
                <a-button type="primary" @click="handleExport">
                  {{ $t("global_export") }}
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
          @click="teleResultConfigAddModal"
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
    <!-- 維護 -->
    <a-modal
      v-model="formVisible"
      :title="formTitle"
      :maskClosable="false"
      width="1100px"
      :cancelText="$t('global_cancel')"
      :okText="formButtonText"
      @ok="onFormSubmit"
      @cancel="onFormCancel"
    >
      <TeleResultConfigEditForm
        :initData="editingData"
        :selectEngOptionsChild="selectEngOptionsChild"
        :selectChineseOptionsChild="selectChineseOptionsChild"
        :selectStatusOptionsChild="selectStatusOptionsChild"
        :taskOptions="taskOptions"
        :contactResultOptions="contactResultOptions"
        :teleResultOptions="teleResultOptions"
        :caseClosedReasonOptions="caseClosedReasonOptions"
        :hostCorrespondOptions="hostCorrespondOptions"
        :completeTeleOptions="completeTeleOptions"
        ref="teleResultConfigEditForm"
        @reloadData="reload"
      >
      </TeleResultConfigEditForm>
    </a-modal>
  </div>
</template>

<script src="./TeleResultConfig.ts" lang="ts"></script>