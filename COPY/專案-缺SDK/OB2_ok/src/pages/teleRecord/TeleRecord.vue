<template >
  <div @keyup.enter="onSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="teleRecordSearchForm"
          style="background-color: #eef6f8"
        >
        
          <a-row>
            <a-col :span="6">
              <!-- 電訪項目 -->
              <a-form-model-item
                :label="$t('userTask')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="teleRecordSearchForm.taskId"
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
                  v-model="teleRecordSearchForm.contactResultId"
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
                  v-model="teleRecordSearchForm.teleResultId"
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
                  v-model="teleRecordSearchForm.caseClosedReasonId"
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
                  v-model="teleRecordSearchForm.notification"
                  :options="selectEngOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <!-- 照會單是否結案 -->
              <a-form-model-item
                :label="$t('teleRecord_notificationClosedOrNot')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="teleRecordSearchForm.notiClosed"
                  :options="notiClosedFlagQueryOptions"
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
                  v-model="teleRecordSearchForm.sendInteresetLetter"
                  :options="selectEngOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>

             <a-col :span="6">
              <!-- 權益函退信原因≠招領逾期 -->
              <a-form-model-item
                :label="$t('teleRecord_mailLetterReturnReason')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="teleRecordSearchForm.recruitmentOverdue"
                  :options="mailLetterReturnFlagQueryOption"
                ></a-select>
              </a-form-model-item>
            </a-col>

             <a-col :span="6">
              <!-- 北富銀VS保經代網電訪結果 -->
              <a-form-model-item
                :label="$t('teleRecord_Taipei Fubon Bank VS Insurance teleResult')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="teleRecordSearchForm.campBankResult"
                  :options="campBankResultQueryOptions"
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
                  @click="resetTeleRecordSearchForm"
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
          @click="teleRecordAddModal"
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
      :destroyOnClose="true"
      width="1400px"
      :cancelText="$t('global_cancel')"
      :okText="formButtonText"
      @ok="onFormSubmit"
      @cancel="onFormCancel"
    >
    <TeleRecordEditForm
    :initData="editingData"
    :initEditFormOptionsDto="initEditFormOptionsDto"
    ref="teleRecordEditForm"
    @reloadData="reload()"
    >

    </TeleRecordEditForm>

 
    </a-modal>
   
  </div>
</template>

<script src="./TeleRecord.ts" lang="ts"></script>