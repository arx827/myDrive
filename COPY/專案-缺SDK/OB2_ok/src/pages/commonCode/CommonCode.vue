<template >
  <div @keyup.enter="commonCodeSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="commonCodeSearchForm"
          style="background-color: #eef6f8"
        >
          <a-row>
            <a-col :span="5">
              <!-- 代碼類別 -->
              <a-form-model-item
                :label="$t('commonCode_typeId')"
                prop="typeId"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="commonCodeSearchForm.typeDesc"
                  :options="selectCommonCodeTypeOptions"
                  :filter-option="filterOption"
                  show-search
                  @change="onSelectionChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 代碼ID -->
              <a-form-model-item
                :label="$t('commonCode_code')"
                prop="code"
                style="margin-bottom: 0px"
              >
                <a-input
                  type="text"
                  v-model="commonCodeSearchForm.commonCodeId"
                  @change="onSelectionChange"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 代碼說明 -->
              <a-form-model-item
                :label="$t('commonCode_codeName')"
                prop="codeName"
                style="margin-bottom: 0px"
              >
                <a-input
                  type="text"
                  :max-length="200"
                  v-model="commonCodeSearchForm.commonCodeName"
                  @change="onSelectionChange"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 搜尋 -->
                <a-button type="primary" @click="commonCodeSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetCommonCodeSearchForm">
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportSearchResult">
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
          @click="showCommonCodeAddModal"
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
    <!-- 共用代碼維護 -->
    <a-modal
      v-model="formVisible"
      :title="$t('commonCode_Maintain')"
      :maskClosable="false"
    >
      <CommonCodeEditForm
        :initData="editingData"
        :selectCommonCodeTypeOptions="selectCommonCodeTypeOptions"
        ref="commonCodeEditForm"
        @reloadData="reload"
      >
      </CommonCodeEditForm>
      <template #footer>
        <!-- 儲存 -->
        <a-row type="flex" justify="end">
          <a-button key="button" type="primary" @click="onFormSubmit">{{
            $t("global_save")
          }}</a-button>
          <!-- 離開 -->
          <a-button key="submit" @click="onFormCalcel">{{
            $t("global_leave")
          }}</a-button>
        </a-row>
      </template>
    </a-modal>
  </div>
</template>

<script src="./CommonCode.ts" lang="ts"></script>

