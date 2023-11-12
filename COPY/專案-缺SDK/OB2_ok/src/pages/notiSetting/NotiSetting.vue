<template >
  <div tabindex="-1" @keyup.enter="userUnlockSearch()">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle">
        <a-form-model
          :label-col="{ xs: 7, md: 9, xxl: 7 }"
          :wrapper-col="{ xs: 17, md: 15, xxl: 17 }"
          :model="notiSettingSearchForm"
          :style="hiddenFoldeStyle.color"
        >
          <a-row
            type="flex"
            :gutter="[{ xs: 10, xxl: 10 }, 0]"
            style="margin-left: -10px"
          >
            <a-col :span="5">
              <!-- 照會主類別 -->
              <a-form-model-item>
                <span slot="label"> {{ $t("notiSettingPage_notiMajorType")}} </span>
                <a-select
                  class="select"
                  v-model="notiSettingSearchForm.notiMajorTypeId"
                  :allowClear="true"
                  :options="notiMajorTypeOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 照會次類別 -->
              <a-form-model-item>
                <span slot="label"> {{ $t("notiSettingPage_notiMajorSubType") }} </span>
                <a-select
                  class="select"
                  v-model="notiSettingSearchForm.notiMajorSubTypeId"
                  :allowClear="true"
                  :options="notiMajotSubTypeOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 電訪照會碼 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('notiSettingPage_notiSetting')"
                prop="notiSettingId"
                style="margin-bottom: 0px"
              >
                <a-input
                  type="text"
                  v-model="notiSettingSearchForm.notiSettingId"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 銀保照會碼 -->
              <a-form-model-item>
                <span slot="label"> {{ $t('notiSettingPage_notiBancassuranceCode') }} </span>
                <a-select
                  class="select"
                  v-model="notiSettingSearchForm.notiBancassurance"
                  :options="notiBancassuranceOptions"
                  :filter-option="filterOption"
                  :allowClear="true"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4">
              <!-- 狀態 -->
              <a-form-model-item>
                <span slot="label"> {{ $t("global_status") }} </span>
                <a-select
                  class="select"
                  v-model="notiSettingSearchForm.status"
                  :allowClear="true"
                  :options="notiSettingStatusOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <div>
            <a-row type="flex" justify="center" class="searchBar">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="notiSettingSearch()">{{
                  $t("global_search")
                }}</a-button>
                <!-- 清除 -->
                <a-button type="default" @click="notiSettingSearchReset()">{{
                  $t("global_clean")
                }}</a-button>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportNotiSetting">
                  {{ $t("global_export") }}
                </a-button>
              </a-space>
            </a-row>
          </div>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-row>
      <a-col>
        <a-button
          type="primary"
          style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
          @click="showNotiSettingAddModal()"
        >
          <a-icon type="plus" />{{ $t("global_add") }}
        </a-button>
      </a-col>
    </a-row>

    <div class="fbl-table">
      <FblDataGrid
      :themeColor="'theme2'"
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :scroll="grid.scroll"
        size="middle"
        @actionClick="onTableActionClick($event)"
        @tableChange="onPageChange($event)"
      >
      </FblDataGrid>
    </div>

    <a-modal
      v-model="isNotiSettingVisible"
      :title="notiSettingTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="notiSettingUpdateFormSubmit()"
    >

      <NotiSettingUpdateForm
      ref="notiSettingUpdateForm"
      :initData="updateNotiSetting"
      :originalNotiMajorTypeOptions=" notiMajorTypeOptions"
      :originalNotiMajorTypeEffectiveOptions="notiMajorTypeEffectiveOptions"
      :originalNotiMajotSubTypeOptions="notiMajotSubTypeOptions"
      :originalNotiMajotSubTypeEffectiveOptions="notiMajotSubTypeEffectiveOptions"
      :originalNotiBancassuranceEffectiveOptions="notiBancassuranceEffectiveOptions"
      :originalNotiSettingStatusOptions="notiSettingStatusOptions"
      @reloadNotiSetting="isNotiSettingVisible = false;notiSettingSearch();
      "
      
      ></NotiSettingUpdateForm>
      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isNotiSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="notiSettingUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script src="./NotiSetting.ts" lang="ts"></script>
