<template>
  <div tabindex="-1" @keyup.enter="onUserTaskSearch()">
    <HiddenFolde>
      <template v-slot:hiddenArea class="shift-work-table">
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          style="background-color: #eef6f8"
          :model="userTaskSearchForm"
          ref="userSkillsTaskSearch"
        >
          <a-row>
            <a-col :span="6">
              <!-- 部門 -->
              <a-form-model-item :label="$t('global_department')" style="margin-bottom: 0px">
                <a-select
                  mode="multiple"
                  v-model="userTaskSearchForm.departmentIdList"
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
                  v-model="userTaskSearchForm.tmrIdList"
                  style="width: 100%"
                  ref="selectUser"
                  :allowClear="true"
                  :options="selectTmrOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" style="padding-left: 10px">
              <!-- 電訪案件 -->
              <a-form-model-item :label="$t('userTask')" style="margin-bottom: 0px">
                <a-select
                  mode="multiple"
                  v-model="userTaskSearchForm.taskIds"
                  style="width: 100%"
                  ref="selectTaskIds"
                  :allowClear="true"
                  :options="userTasksOptions"
                  :filter-option="filterOption"
                  @change="onUserTasksSelectChange"
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
                  v-model="userTaskSearchForm.divisionIdList"
                  style="width: 100%"
                  :options="selectDiviOptions"
                  @change="onSeletDivi()"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <a-button type="primary" @click="onUserTaskSearch()">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 搜尋 -->
                <a-button type="default" @click="resetUserTaskSearch">
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 清除 -->
                <a-divider type="vertical"></a-divider>
                <!-- 單筆匯入 -->
                <a-button type="primary" @click="uploadReload"> {{$t("global_import") }}</a-button>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportUserTasks">
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
          @click="showTaskAddModal()"
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
          @actionClick="onUserTaskTableActionClick($event)"
          @tableChange="onPageChange($event)"
          size="middle"
          style="padding-left: 24px; padding-right: 12px"
          ref="userDataGrid"
        >
        </fbl-data-grid>
        <!-- 彈跳視窗:電訪項目form -->
        <a-modal
          v-model="taskSettingFormVisible"
          :title="titleText"
          :cancelText="$t('global_cancel')"
          :okText="$t('global_ok')"
          :maskClosable="false"
          :destroyOnClose="true"
          @ok="taskSettingModalSubmit"
          @cancel="taskSettingModalCancel"
          
        >
          <UserTaskSettingForm
            :initData="taskSettingData"
            ref="taskSettingForm"
            @reloadData="onTaskSettingSuccess($event)"
            :iniAllUserStaffList="iniAllUserStaffList"
          >
          </UserTaskSettingForm>

         <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="taskSettingModalCancel">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="taskSettingModalSubmit"
          >{{ $t("global_save") }}</a-button
        >
      </template>

        </a-modal>

         <!-- 電訪項目匯入 -->
          <a-modal
            v-model="userTasksUploadFormVisible"
            :title="$t('userTask_import')"
            :footer="null"
            @cancel="onFormUploadReset()"
            width="800px"
          >
            <UploadAndLog
              @uploadReload="uploadReload"
              ref="uploadAndLog"
              @beforeUpload="beforeUpload"
              @handleUpload="handleUpload"
              @reloadLogProgress="reloadLogProgress"
              @uploadFormClose="onFormUploadClose"
            >
            </UploadAndLog>
          </a-modal>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./UserSkillTaskSetting.ts" lang="ts"></script>
<style>
</style>