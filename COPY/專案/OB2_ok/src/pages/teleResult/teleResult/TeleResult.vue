<template >
  <div @keyup.enter="teleResultSearch">
    <HiddenFolde> 
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="TeleResultSearchForm"
          style="background-color: #eef6f8"
          ref=teleResultRules
          :rules="teleResultSearchRules"
        >
          <a-row>
            <a-col :span="6">
              <!-- 電訪結果代碼 -->
              <a-form-model-item
                :label="$t('teleResult_teleResultId')"
                prop="teleResultId"
                style="margin-bottom: 0px"
                :has-feedback="teleResultIdFeildValidation.feedback"
                :validateStatus="teleResultIdFeildValidation.state"
              >
                <a-popover
                  placement="top"
                  :content="teleResultIdFeildValidation.msg"
                  :trigger="teleResultIdFeildValidation.hover"
                >
                <a-input
                  type="text"
                  v-model="TeleResultSearchForm.teleResultId"
                  :max-length="20"
                />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 電訪結果名稱 -->
              <a-form-model-item
                :label="$t('teleResult_teleResultName')"
                prop="teleResultName"
                style="margin-bottom: 0px"
              >
                <a-input
                  type="text"
                  v-model="TeleResultSearchForm.teleResultName"
                  :max-length="50"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <!-- 是否列入良質指標 -->
              <a-form-model-item
                :label="$t('teleResult_notSuspective')"
                prop="notSuspective"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="TeleResultSearchForm.notSuspective"
                  :options="selectNotSuspectiveOptions"
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
                  v-model="TeleResultSearchForm.status"
                  :options="selectStatusOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="teleResultSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetTeleResultSearchForm">
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
          @click="showTeleResultAddModal"
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
    <!-- 電訪結果設定 -->
    <a-modal
      v-model="formVisible"
      :title="$t('teleResult_teleResultSetting')"
      :maskClosable="false"
      width="1100px"
      :cancelText="$t('global_cancel')"
      :okText="formButtonText"
      @ok="onFormSubmit"
      @cancel="onFormCalcel"
    >
      <TeleResultEditForm
        :initData="editingData"
        :selectNotSuspectiveOptions="selectNotSuspectiveOptions"
        :selectStatusOptions="selectStatusOptions"
        ref="teleResultEditForm"
        @reloadData="reload"
      >
      </TeleResultEditForm>
    </a-modal>
  </div>
</template>

<script src="./TeleResult.ts" lang="ts"></script>

