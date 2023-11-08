<template>
  <div>
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          style="background-color: #eef6f8"
          :model="eventForm"
          ref="eventSettingRules"
        >
          <a-row>
            

            <a-col :span="6">
              <!-- 部門 -->
              <a-form-model-item
                :label="$t('global_department')"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  style="width: 100%"
                  v-model="eventForm.departmentIdList"
                  :options="selectDepOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                  @change="onSelectDept"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 科別 -->
              <a-form-model-item
                :label="$t('global_division')"
                style="margin-bottom: 0px"
                prop="unitId"
              >
                <a-select
                  mode="multiple"
                  v-model="eventForm.divisionIdList"
                  

                  :options="selectDiviOptions"
                  :filter-option="filterOption"
                  @change="onSeletDivi"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 電訪員 -->
              <a-form-model-item
                :label="$t('global_telemarketer')"
                style="margin-bottom: 0px"
                prop="userName"
              >
                <a-select
                 mode="multiple"
                  v-model="eventForm.tmrIdList"
                  style="width: 100%"
                  refs="selectUser"
                  :allowClear="true"
                  :options="selectTmrOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                  @change="onSelectTmr"
                ></a-select>
              </a-form-model-item>
            </a-col>
            
          </a-row>

          <a-row>
            <a-col :span="8" :pull="1" style="padding-left:68px">
              <!-- 事件日期 -->
              <a-form-model-item
                :label="$t('eventS_date')"
                style="margin-bottom: 0px"
                :has-feedback="startFeedback || endFeedback"
                :validateStatus="stateStart || stateEnd"
              >
                <a-popover
                  placement="top"
                  :content="startErrorMsg"
                  :trigger="startHover"
                  :visible="isDateStartVisible"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :placeholder="eventForm.startString"
                    :formatter="formatter"
                    @change="onStartChange"
                    v-model="eventForm.startDate"
                    :disabled-date="disabledDate"
                    @clear="clearStartDate"
                    :clearable="false"
                    style="width: 45%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputStartDate"
                      :value="eventForm.startString"
                      @mouseover="eventMouseOverStart"
                      @mouseleave="isDateStartVisible = false"
                    ></a-input>
                    <i v-if="startFeedback" slot="icon-calendar"></i>
                  </DatePicker>
                </a-popover>
                ~
                <a-popover
                  placement="top"
                  :content="endErrorMsg"
                  :trigger="endHover"
                  :visible="isDateEndVisible"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :placeholder="eventForm.endString"
                    :formatter="formatter"
                    @change="onEndChange"
                    v-model="eventForm.endDate"
                    :disabled-date="disabledDate"
                    @clear="clearEndDate"
                    :clearable="false"
                    style="width: 45%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputEndDate"
                      :value="eventForm.endString"
                      @mouseover="eventMouseOverEnd"
                      @mouseleave="isDateEndVisible = false"
                    ></a-input>
                    <i v-if="endFeedback" slot="icon-calendar"></i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="5">
              <!-- 事件類別 -->
              <a-form-model-item
                :label="$t('eventS_eventType')"
                prop="eventCode"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  :options="selectEventCodeOptions"
                  v-model="eventCodeSelections"
                  :placeholder="$t('global_all')"
                  @change="onEventTypeChange"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <a-button
                  type="primary"
                  @click="eventSearch"
                  v-if="authComponent.EVENT_SEARCH_CLEAR.show"
                  :disabled="!authComponent.EVENT_SEARCH_CLEAR.enable"
                >
                  {{ $t("global_search") }}
                </a-button>
                <!-- 搜尋 -->
                <a-button
                  type="default"
                  @click="resetFrom"
                  v-if="authComponent.EVENT_SEARCH_CLEAR.show"
                  :disabled="!authComponent.EVENT_SEARCH_CLEAR.enable"
                >
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 清除 -->
                <a-divider
                  type="vertical"
                  v-if="
                    authComponent.EVENT_IMPORT.show ||
                    authComponent.EVENT_EXPORT.show
                  "
                ></a-divider>
                <!-- 單筆新增 -->
                <a-button
                  type="primary"
                  @click="addEvent"
                  v-if="authComponent.EVENT_IMPORT.show"
                  :disabled="!authComponent.EVENT_IMPORT.enable"
                >
                  {{ $t("eventS_singleAdd") }}
                </a-button>
                <!-- 匯出 -->
                <a-button
                  type="primary"
                  @click="exportEvents"
                  v-if="authComponent.EVENT_EXPORT.show"
                  :disabled="!authComponent.EVENT_EXPORT.enable"
                >
                  {{ $t("global_export") }}
                </a-button>
                <!-- 整批上傳 -->
                <a-button
                  type="primary"
                  @click="uploadReload"
                  v-if="authComponent.EVENT_IMPORT.show"
                  :disabled="!authComponent.EVENT_IMPORT.enable"
                >
                  {{ $t("eventS_batchUpload") }}
                </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>
    <!-- 圖例 -->
    <div style="white-space: pre-line; text-align: right; padding-right: 10px">
      <a-space>
        <a-space v-for="(item, index) in eventClassList" :key="index">
          <label :style="item.value">....</label>
          <label v-for="(e, ei) in item.label" :key="ei">{{ e }}</label>
        </a-space>
      </a-space>
    </div>
    <GanttElastic
      :options="options"
      :tasks="tasks"
      @chart-task-mouseover="onTaskMouseover"
      @chart-task-mouseout="onTaskMouseout"
      @taskList-group-click="onTaskClick"
    >
    </GanttElastic>
    <!-- 離開/儲存 -->
    <a-modal
      v-model="eventInsertFormVisible"
      :title="titleText"
      :cancelText="$t('global_leave')"
      :okText="$t('global_save')"
      @ok="onFormSubmit($event)"
      @cancel="onFormCalcel()"
    >
      <EventInsertForm
        ref="eventInsertForm"
        :initData="eventInsertForm"
        :originalSelectDiviOptions="allDivList"
        :originalSelectTmrOptions="selectTmrOptions"
        :originalUnitUserInfo="unitUserInfo"
        @reloadData="reload"
      >
      </EventInsertForm>
    </a-modal>
    <!-- 事件異動-->
    <a-modal
      v-model="eventUpdateFormVisible"
      :title="$t('eventS_eventChange')"
      :closable="false"
      :maskClosable="false"
      width="700px"
    >
      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="onFormUpdateCalcel">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          v-if="authComponent.EVENT_CREATE.show"
          key="submit"
          type="primary"
          @click="onFormUpdateSubmit($event)"
          >{{ $t("global_save") }}</a-button
        >
      </template>
      <EventUpdateForm
        ref="eventUpdateForm"
        :initData="eventUpdateForm"
        @reloadData="reload"
        @changeEditState="changeEditState"
        @calcelConfirm="calcelConfirm"
        :editAuth="editAuth"
      >
      </EventUpdateForm>
    </a-modal>
    <!-- 事件匯入 -->
    <a-modal
      v-model="eventUploadFormVisible"
      :title="$t('eventS_eventImport')"
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
  </div>
</template>

<script src="./EventSetting.ts" lang="ts"></script>
<style>
/* 欲覆蓋的樣式 */

/* 讓表格欄位時段字樣跨欄顯示 */
.gantt-elastic__task-list-item-value-wrapper {
  overflow: visible !important;
}
.gantt-elastic__task-list-item-value-wrapper
  > .gantt-elastic__task-list-item-value-container {
  position: relative;
  overflow: visible !important;
}

/* 更改套件label預設background與padding */
.gantt-elastic__chart-row-text {
  background: none !important;
}
.gantt-elastic__chart-row-text-content {
  padding: 0px 2px !important;
}

/* 更改套件此刻時間線顏色與寬度 */
.gantt-elastic__grid-line-time {
  stroke: #ff0000 !important;
  stroke-width: 2 !important;
}
</style>
