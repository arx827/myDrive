<template @keyup.enter="onShiftWorkSearch">
  <div>
    <HiddenFolde>
      <template v-slot:hiddenArea class="shift-work-table">
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          ref="shiftsRules"
          :model="ShiftsworkSearchForm"
          style="background-color: #eef6f8"
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
                  v-model="ShiftsworkSearchForm.departmentIdList"
                  :options="selectDepOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                  @change="onSelectDept"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 科別 -->
              <a-form-model-item
                :label="$t('global_division')"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="ShiftsworkSearchForm.divisionIdList"
                  style="width: 100%"
                  :options="selectDiviOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                  @change="onSeletDivi"
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
                  v-model="ShiftsworkSearchForm.tmrIdList"
                  style="width: 100%"
                  refs="selectUser"
                  :allowClear="true"
                  :options="selectTmrOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                  @change="onSelectTmr"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="12" :pull="2" style="padding-left: 40px">
              <!-- 日期(起) -->
              <a-form-model-item
                :label="
                  $t('global_timeStart')"
                style="margin-bottom: 0px"
                prop="startDate"
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
                  <date-picker
                    :formatter="formatter"
                    @change="onStartChange"
                    v-model="ShiftsworkSearchForm.startDate"
                    :disabled-date="disabledDate"
                    style="width: 45%"
                    :clearable="false"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputStartDate"
                      :value="ShiftsworkSearchForm.startString"
                      @mouseover="eventMouseOverStart"
                      @mouseleave="isDateStartVisible = false"
                    ></a-input>
                    <!-- <i v-if="startFeedback" slot="icon-calendar"></i> -->
                  </date-picker>
                </a-popover>
                ~
                <a-popover
                  placement="top"
                  :content="endErrorMsg"
                  :trigger="endHover"
                  :visible="isDateEndVisible"
                  :destroyTooltipOnHide="true"
                >
                  <date-picker
                    :formatter="formatter"
                    v-model="ShiftsworkSearchForm.endDate"
                    @change="onEndChange"
                    :disabled-date="disabledDate"
                    style="width: 45%"
                    :clearable="false"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputEndDate"
                      :value="ShiftsworkSearchForm.endString"
                      @mouseover="eventMouseOverEnd"
                      @mouseleave="isDateEndVisible = false"
                    ></a-input>
                    <i v-if="endFeedback" slot="icon-calendar"></i>
                  </date-picker>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="6" style="padding-left: 25px">
              <!-- 班別 -->
              <a-form-model-item
                :label="$t('global_shiftWork')"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="ShiftsworkSearchForm.shiftWorkCodes"
                  refs="selectShiftWork"
                  :filter-option="filterOption"
                  :options="shiftWorkCodeOptions"
                  :placeholder="$t('global_all')"
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
                  @click="onShiftWorkSearch()"
                  v-if="authComponent.SHIFT_SEARCH_CLEAR.show"
                  :disabled="!authComponent.SHIFT_SEARCH_CLEAR.enable"
                >
                  {{ $t("global_search") }}
                </a-button>
                <!-- 搜尋 -->
                <a-button
                  type="default"
                  @click="resetShiftsWorkSearchForm"
                  v-if="authComponent.SHIFT_SEARCH_CLEAR.show"
                  :disabled="!authComponent.SHIFT_SEARCH_CLEAR.enable"
                >
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 清除 -->
                <a-divider
                  type="vertical"
                  v-if="
                    authComponent.SHIFT_IMPORT.show ||
                    authComponent.SHIFT_EXPORT.show
                  "
                ></a-divider>
                <!-- 單筆匯入 -->
                <a-button
                  type="primary"
                  @click="addSingleUserShiftWork"
                  v-if="authComponent.SHIFT_IMPORT.show"
                  :disabled="!authComponent.SHIFT_IMPORT.enable"
                >
                  {{ $t("shiftS_importSingleRow") }}
                </a-button>
                <!-- 匯出 -->
                <a-button
                  type="primary"
                  @click="exportUserShiftWorks()"
                  v-if="authComponent.SHIFT_EXPORT.show"
                  :disabled="!authComponent.SHIFT_EXPORT.enable"
                >
                  {{ $t("global_export") }}
                </a-button>
                <!-- 整批上傳 -->
                <a-button type="primary" @click="shiftWorkUpload" v-if="authComponent.SHIFT_IMPORT.show" :disabled="!authComponent.SHIFT_IMPORT.enable">
                  {{ $t("eventS_batchUpload") }}
                </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>
    <!-- 標頭 -->
    <a-row>
      <a-col>
        <!-- 班別資訊顯示 -->
        <h1 style="padding: 10px">
          {{ $t("shiftS_showShiftWorkInfo") }}:
          <div
            v-for="(option, index) in shiftWorkCodeOptions"
            :key="option.label"
            style="display: inline-block"
          >
            {{ option.label
            }}<span v-if="index < shiftWorkCodeOptions.length - 1">、</span>
          </div>
        </h1>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
    
      </a-col>
    </a-row>
    <!-- 標頭 -->
    <!-- table -->
    <div style="padding: 10px">
      <a-table
        :data-source="userData"
        :scroll="{ x: 1500, scrollToFirstRowOnChange: true, y: 400 }"
        @change="onPageChange"
        class="shift-work-talbe"
        :pagination="false"
      >
        <!-- 設定部門與人員的col header與資料(固定資料) -->
        <!-- 科別 -->
        <a-table-column
          key="depId"
          :title="$t('global_division')"
          data-index="depId"
          :width="100"
          fixed="left"
        />
        <!-- 人員 -->
        <a-table-column
          key="userId"
          :title="$t('global_telemarketer')"
          data-index="userName"
          :width="100"
          fixed="left"
        />
        <!-- 雙層資料(資料自動生成) -->
        <a-table-column-group
          v-for="col in columns"
          :key="col.index"
          :sorter="true"
        >
          <!-- 如果是假日需變更title顏色 -->
          <span slot="title" :style="[col.isHoliday ? { color: 'red' } : {}]">{{
            col.title
          }}</span>
          <a-table-column
            :width="col.width"
            :data-index="col.key"
            :sorter="true"
          >
            <!-- 如果是假日需變更title顏色 -->
            <span
              slot="title"
              :style="[col.isHoliday ? { color: 'red' } : {}]"
              >{{ col.subTitle }}</span
            >
            <!-- 開始呈現資料庫資料的部份 -->
            <template slot-scope="text, record, index, event">
              <!-- 如果有資料的情況下的判斷 -->
              <template v-if="text && !col.isHoliday">
                <div>
                  <!-- 需判斷是否已經過時,已過時時class顯示為無代表沒有顏色-->
                  <a-button
                    class="shift-work-btn"
                    :class="
                      col.yesterDayDate > new Date(col.key).getTime()
                        ? ''
                        : text
                    "
                    @click="editUserShiftWork(record, index, event, text, col)"
                    >{{ text }}</a-button
                  >
                </div>
              </template>

              <template v-if="col.isHoliday">
                <div>
                  <a-icon
                    :class="''"
                    type="plus"
                    @click="editUserShiftWork(record, index, event, text, col)"
                  />
                </div>
              </template>
              <!-- 當過期且為無資料時 或者 該權限無法異動事件 設定為禁止彈跳視窗 -->
              <a
                :disabled="
                  col.yesterDayDate > new Date(col.key).getTime() ||
                  col.isHoliday || !authComponent.EVENT_CREATE.show
                "
              >
                <!-- 如果沒資料補個ICON -->
                <template v-if="text == null && !col.isHoliday">
                  <div>
                    <a-icon
                      type="plus"
                      @click="
                        editUserShiftWork(record, index, event, text, col)
                      "
                    />
                  </div>
                </template>
              </a>
            </template>
          </a-table-column>
        </a-table-column-group>
      </a-table>
    </div>
    <!-- table -->
    <!-- modal  班別維護設定包含事件更新-->
    <a-modal
      v-model="shiftsUpDateVisible"
      :title="titleText"
      :closable="false"
      :maskClosable="false"
      :destroyOnClose="true"
      width="700px"
    >
      <ShiftsWorkUpdateForm
        ref="shiftUpdateForm"
        :initData="shiftsDataForm"
        :overDate="overDate"
        @reloadData="reload"
        @changeEditState="changeEditState"
        @cancelConfirm="cancelConfirm"
        @closeCheckModalDeletedShiftAndEvents="
          closeCheckModalDeletedShiftAndEvents
        "
      >
      </ShiftsWorkUpdateForm>
      <template #footer>
        <!-- 取消 -->
        <a-button key="button" @click="onFormUpdateCalcel">{{
          buttonText
        }}</a-button>
        <!-- 確認 -->
        <a-button
          v-if="!overDate"
          key="submit"
          type="primary"
          @click="onFormUpdateSubmit($event)"
          >{{ $t("global_ok") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="shiftWorkUploadFormVisible"
      :title="titleText"
      :footer="null"
      @cancel="onFormUploadClose()"
      width="800px"
      :destroyOnClose="true"
    >
      <ShiftWorkUploadForm
        ref="shiftWorkUploadForm"
        :isSingleUpload="isSingleUpload"
        :allowMonth="allowMonth"
        :secondText="secondText"
        @uploadFormClose="onFormUploadClose()"
        @reloadData="reload"
      >
      </ShiftWorkUploadForm>
    </a-modal>
  </div>
</template>



<script src="./ShiftsWorkPage.ts" lang="ts"></script>
<style scoped lang="less">
/* 各班別顏色設定 */
.D {
  background-color: #98cf60;
  .text-white-format()
}
.E {
  background-color: #63cab6;
  .text-white-format()
}
.F {
  background-color: #fc4f65;
  .text-white-format()
}
.I {
  background-color: #fd8300;
  .text-white-format()
}
.K {
  background-color: #6352ff;
  .text-white-format()
}
.L {
  background-color: #8289c9;
  .text-white-format()
}
/* 調整這頁button樣式 */
.shift-work-btn {
  width: 60px;
  height: 25px;
}

/* 調整Shift-work-table底下的ant-talbe(僅排班主頁)間距與文字置中 */
/* 避免影響其他不需調整的table，上層指定shift-work-table的Class Name */
::v-deep
  .shift-work-talbe
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-content
  > .ant-table-fixed-left
  > .ant-table-header
  > .ant-table-fixed
  > .ant-table-thead
  > tr
  > th,
::v-deep
  .shift-work-talbe
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-content
  > .ant-table-scroll
  > .ant-table-header
  > .ant-table-fixed
  > .ant-table-thead
  > tr
  > th,
::v-deep
  .shift-work-talbe
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-content
  > .ant-table-fixed-left
  > .ant-table-body-outer
  > .ant-table-body-inner
  > .ant-table-fixed
  > .ant-table-tbody
  > tr
  > td,
::v-deep
  .shift-work-talbe
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-content
  > .ant-table-scroll
  > .ant-table-body
  > .ant-table-fixed
  > .ant-table-tbody
  > tr
  > td {
  padding: 10px !important;
  text-align: center;
}
</style>