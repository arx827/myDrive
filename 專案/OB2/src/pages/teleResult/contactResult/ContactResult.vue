<template >
  <div @keyup.enter="contactResultSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="ContactResultSearchForm"
          style="background-color: #eef6f8"
          ref=contactResultRules
          :rules="contactResultSearchRules"
        >
          <a-row>
            <a-col :span="6">
              <!-- 聯絡結果代碼 -->
              <a-form-model-item
                :label="$t('contactResult_contactResultId')"
                prop="contactResultId"
                style="margin-bottom: 0px"
                :has-feedback="contactResultIdFeildValidation.feedback"
                :validateStatus="contactResultIdFeildValidation.state"
              >
                <a-popover
                  placement="top"
                  :content="contactResultIdFeildValidation.msg"
                  :trigger="contactResultIdFeildValidation.hover"
                >
                <a-input
                  type="text"
                  v-model="ContactResultSearchForm.contactResultId"
                  :max-length="20"
                />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 聯絡結果名稱 -->
              <a-form-model-item
                :label="$t('contactResult_contactResultName')"
                prop="contactResultName"
                style="margin-bottom: 0px"
              >
                <a-input
                  type="text"
                  v-model="ContactResultSearchForm.contactResultName"
                  :max-length="50"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="4">
              <!-- M+傳送 -->
              <a-form-model-item
                :label="$t('contactResult_sendMplus')"
                prop="sendMplus"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="ContactResultSearchForm.sendMplus"
                  :options="selectSendMplusOptions"
                ></a-select>
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
                  v-model="ContactResultSearchForm.status"
                  :options="selectStatusOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="contactResultSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetContactResultSearchForm">
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
          @click="showContactResultAddModal"
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
    <!-- 聯絡結果設定 -->
    <a-modal
      v-model="formVisible"
      :title="$t('contactResult_contactResultSetting')"
      :maskClosable="false"
      width="1100px"
      :cancelText="$t('global_cancel')"
      :okText="formButtonText"
      @ok="onFormSubmit"
      @cancel="onFormCalcel"
    >
      <ContactResultEditForm
        :initData="editingData"
        :selectSendMplusOptions="selectSendMplusOptions"
        :selectStatusOptions="selectStatusOptions"
        ref="contactResultEditForm"
        @reloadData="reload"
      >
      </ContactResultEditForm>
    </a-modal>
  </div>
</template>

<script src="./ContactResult.ts" lang="ts"></script>

