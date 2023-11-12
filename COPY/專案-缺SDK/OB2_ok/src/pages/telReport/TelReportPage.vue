<template >
  <div @keyup.enter="teleChangeSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle">
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="telReportPageSearchForm"
          style="background-color: #eef6f8"
          ref="teleResultRules"
          :rules="telReportPageSearchRules"
          :style="hiddenFoldeStyle.color"
        >
          <a-row :gutter="24" style="margin-left: 30px">
            <a-col :span="4">
              <!-- 部門 -->
              <a-form-model-item
                :label="$t('global_department')"
                prop="departmentIdList"
                style="margin-bottom: 0px"
                :has-feedback="
                  callCommonUtilFeild(
                    telReportPageSearchValidationForm.departmentIdList
                  ).feedback
                "
                :validateStatus="
                  callCommonUtilFeild(
                    telReportPageSearchValidationForm.departmentIdList
                  ).state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.departmentIdList
                    ).msg
                  "
                  :trigger="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.departmentIdList
                    ).hover
                  "
                  :visible="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.departmentIdList
                    ).hoverVisible
                  "
                  :destroyTooltipOnHide="true"
                  @visibleChange="
                    callCommonUtilFeildVisibleChange(
                      telReportPageSearchValidationForm.departmentIdList
                    )
                  "
                >
                  <a-select
                    mode="multiple"
                    v-model="telReportPageSearchForm.departmentIdList"
                    :options="selectDeptOptions"
                    :filter-option="filterOption"
                    @change="onSelectDept"
                  ></a-select>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="4">
              <!-- 科別 -->
              <a-form-model-item
                :label="$t('global_division')"
                prop="divisionIdList"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="telReportPageSearchForm.divisionIdList"
                  :options="selectDiviOptions"
                  :placeholder="$t('global_all')"
                  @change="onSeletDivi"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="4">
              <!-- 電訪員 -->
              <a-form-model-item
                :label="$t('global_telemarketer')"
                prop="userIdList"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="telReportPageSearchForm.userIdList"
                  :filter-option="filterOption"
                  :options="selectTmrOptions"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <!-- 資料日期 -->
              <a-form-model-item
                :label="$t('telReportPage_dataDate')"
                prop=""
                style="margin-bottom: 0px"
                :has-feedback="
                  callCommonUtilFeild(
                    telReportPageSearchValidationForm.startDate
                  ).feedback
                "
                :validateStatus="
                  callCommonUtilFeild(
                    telReportPageSearchValidationForm.startDate
                  ).state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.startDate
                    ).msg
                  "
                  :trigger="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.startDate
                    ).hover
                  "
                  :visible="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.startDate
                    ).hoverVisible
                  "
                  :destroyTooltipOnHide="true"
                  @visibleChange="
                    callCommonUtilFeildVisibleChange(
                      telReportPageSearchValidationForm.startDate
                    )
                  "
                >
                  <DatePicker
                    v-model="telReportPageSearchForm.telChangePickerStartDate"
                    style="width: 100%"
                    :formatter="formatter"
                    :disabled-date="disabledDate"
                    @clear="clearDate('StartDate')"
                    @change="onTelChangeStartChange"
                  >
                    <!-- 請選擇日期(起) -->
                    <a-input
                      slot="input"
                      :value="telReportPageSearchForm.telChangeStartString"
                      @pressEnter="checkManualInputStartDate"
                    ></a-input>
                    <i
                      v-if="
                        callCommonUtilFeild(
                          telReportPageSearchValidationForm.startDate
                        ).feedback
                      "
                      slot="icon-calendar"
                    ></i>
                    <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                    <i
                      v-if="
                        callCommonUtilFeild(
                          telReportPageSearchValidationForm.startDate
                        ).feedback
                      "
                      slot="icon-clear"
                    >
                      <a-icon
                        type="close-circle"
                        theme="filled"
                        style="color: white"
                      />
                    </i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 10px; padding-top: 10px"> ~ </a-col>
            <a-col :span="5">
              <!-- 此處label 不會顯示出來 -->
              <a-form-model-item
                class="dateEnd"
                label=""
                prop="dataEndDate"
                style="margin-bottom: 0px"
                :has-feedback="
                  callCommonUtilFeild(telReportPageSearchValidationForm.endDate)
                    .feedback
                "
                :validateStatus="
                  callCommonUtilFeild(telReportPageSearchValidationForm.endDate)
                    .state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.endDate
                    ).msg
                  "
                  :trigger="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.endDate
                    ).hover
                  "
                  :visible="
                    callCommonUtilFeild(
                      telReportPageSearchValidationForm.endDate
                    ).hoverVisible
                  "
                  :destroyTooltipOnHide="true"
                  @visibleChange="
                    callCommonUtilFeildVisibleChange(
                      telReportPageSearchValidationForm.endDate
                    )
                  "
                >
                  <DatePicker
                    style="width: 100%"
                    v-model="telReportPageSearchForm.telChangePickerEndDate"
                    :formatter="formatter"
                    :disabled-date="disabledDate"
                    @change="onTelChangeEndChange"
                    @clear="clearDate('EndDate')"
                  >
                    <!-- 請選擇日期(訖) -->
                    <a-input
                      slot="input"
                      :value="telReportPageSearchForm.telChangeEndString"
                      @pressEnter="checkManualInputEndDate"
                    ></a-input>
                    <i
                      v-if="
                        callCommonUtilFeild(
                          telReportPageSearchValidationForm.endDate
                        ).feedback
                      "
                      slot="icon-calendar"
                    ></i>
                    <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                    <i
                      v-if="
                        callCommonUtilFeild(
                          telReportPageSearchValidationForm.endDate
                        ).feedback
                      "
                      slot="icon-clear"
                    >
                      <a-icon
                        type="close-circle"
                        theme="filled"
                        style="color: white"
                      />
                    </i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="teleChangeSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetTeleChangeSearchForm">
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

    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <FblDataGrid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          size="middle"
          @tableChange="onPageChange($event)"
          style="padding-left: 24px; padding-right: 12px"
        >
        </FblDataGrid>
      </a-col>
    </a-row>

    <!-- 電話變更明細 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="telChangeDetailVisible"
      :title="$t('telChangeDetailForm_telChangeDetail')"
      width="80%"
      :okText="$t('global_leave')"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :destroyOnClose="true"
      :removeCancelButton="true"
      @ok="telChangeDetailVisible = false"
      @cancel="telChangeDetailVisible = false"
    >
      <TelChangeDetail :inputData="telChangeDetailInfo" />
    </DragModal>
  </div>
</template>

<script src="./TelReportPage.ts" lang="ts"></script>

