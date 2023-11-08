<template >
  <div tabindex="-1" @keyup.enter="onUserSkillSearch()">
    <HiddenFolde>
      <template v-slot:hiddenArea class="shift-work-table">
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          style="background-color: #eef6f8"
          :model="userSkillSearchForm"
          ref="userSkillsTaskSettingRules"
        >
          <a-row>
            <a-col :span="6">
              <!-- 部門 -->
              <a-form-model-item :label="$t('global_department')" style="margin-bottom: 0px">
                <a-select
                  mode="multiple"
                  v-model="userSkillSearchForm.departmentIdList"
                  style="width: 100%"
                  :options="selectDepOptions"
                  @change="onSelectDept"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="6" style="padding-left: 10px">
              <!-- 電訪員 -->
              <a-form-model-item
                :label="$t('global_telemarketer')"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="userSkillSearchForm.tmrIdList"
                  style="width: 100%"
                  refs="selectUser"
                  :allowClear="true"
                  :options="selectTmrOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="6" style="padding-left: 10px">
              <!-- 語言-->
              <a-form-model-item :label="$t('global_language')" style="margin-bottom: 0px">
                <a-select
                  mode="multiple"
                  v-model="userSkillSearchForm.selectedLanguages"
                  style="width: 100%"
                  :allowClear="true"
                  :options="userLanguageOptions"
                  :filter-option="filterOption"
                  @change="onUserLanguageChanges"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="6">
              <!-- 科別 -->
              <a-form-model-item
                :label="$t('global_division')"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="userSkillSearchForm.divisionIdList"
                  style="width: 100%"
                  :options="selectDiviOptions"
                  :allowClear="true"
                  @change="onSeletDivi"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="6" style="padding-left: 10px">
              <!-- 客戶標籤 -->
              <a-form-model-item :label="$t('custMark_tag')" style="margin-bottom: 0px">
                <a-select
                  mode="multiple"
                  v-model="userSkillSearchForm.selectedTags"
                  style="width: 100%"
                  :options="userTagsOptions"
                  :filter-option="filterOption"
                  @change="onUserTagsChanges"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <a-button type="primary" @click="onUserSkillSearch()">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 搜尋 -->
                <a-button type="default" @click="resetUserSkillSearch">
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 清除 -->
                <a-divider type="vertical"></a-divider>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportUserSkills">
                  {{ $t("global_export") }}
                </a-button>
                <!-- 整批上傳 -->
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
          style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
          @click="showUserSkillsAddModal()"
        >
          <a-icon type="plus" />{{ $t("global_add") }}
        </a-button>
      </a-col>
    </a-row>

    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <fbl-data-grid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          @actionClick="onUserSkillsTableActionClick($event)"
          @tableChange="onPageChange($event)"
          size="middle"
          style="padding-left: 24px; padding-right: 12px"
          ref="userDataGrid"
        >
        </fbl-data-grid>

        <a-modal
          v-model="userSkillFormVisible"
          :title="titleText"
          :cancelText="$t('global_cancel')"
          :okText="$t('global_ok')"
          :maskClosable="false"
          :destroyOnClose="true"
          @ok="userSkillSettingModalSubmit"
          @cancel="userSkillSettingModalCancel"
          style="word-break: break-all"
        >
        <PolicySkillForm
          :initialUserSkillsData="userSkillSettingData"
          :userLanguagesOptions="userLanguageOptions"
          :userTagsOptions="userTagsOptions"
          ref="policySkillFormForm"
          @reloadData="onTaskSettingSuccess($event)"
          :iniAllUserStaffList="iniAllUserStaffList"
        >
        </PolicySkillForm>
          <!-- 測試彈跳出來form -->
         <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="userSkillSettingModalCancel">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="userSkillSettingModalSubmit"
          >{{ $t("global_save") }}</a-button
        >
      </template>
      </a-modal>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./PolicyTagSetting.ts" lang="ts"></script>
<style>
</style>