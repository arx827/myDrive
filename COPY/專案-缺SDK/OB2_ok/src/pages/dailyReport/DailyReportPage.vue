<template >
    <div @keyup.enter="dailyReportSearch">
      <HiddenFolde> 
        <template v-slot:hiddenArea="hiddenFoldeStyle">
          <a-form-model
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            :model="dailyReportSearchForm"
            style="background-color: #eef6f8"
            ref=dailyReportSearchRules
            :rules="dailyReportSearchRules"
            :style="hiddenFoldeStyle.color"
          >
            <a-row :gutter="24" style="margin-left: 30px">
              <a-col :span="5">
                <!-- 部門 -->
                <a-form-model-item
                  :label="$t('global_department')"
                  prop="departmentIdList"
                  style="margin-bottom: 0px"
                  :has-feedback="callCommonUtilFeild(dailyReportSearchValidationForm.departmentIdList).feedback"
                  :validateStatus="callCommonUtilFeild(dailyReportSearchValidationForm.departmentIdList).state"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(dailyReportSearchValidationForm.departmentIdList).msg"
                    :trigger="callCommonUtilFeild(dailyReportSearchValidationForm.departmentIdList).hover"
                    :visible="callCommonUtilFeild(dailyReportSearchValidationForm.departmentIdList).hoverVisible"
                    :destroyTooltipOnHide="true"
                    @visibleChange="callCommonUtilFeildVisibleChange(dailyReportSearchValidationForm.departmentIdList)"
                  >
                  <a-select
                    mode="multiple"
                    v-model="dailyReportSearchForm.departmentIdList"
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
                    v-model="dailyReportSearchForm.divisionIdList"
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
                  prop="tmrIdList"
                  style="margin-bottom: 0px"
                >
                  <a-select
                    mode="multiple"
                    v-model="dailyReportSearchForm.tmrIdList"
                    :filter-option="filterOption"
                    :options="selectTmrOptions"
                    :placeholder="$t('global_all')"
                    @change="onSelectionChange"
                  ></a-select>
                </a-form-model-item>
              </a-col>
  
              <a-col :span="4">
                <!-- 系統匯入日 -->
                <a-form-model-item
                  :label="$t('dailyReportPage_sysImportDate')"
                  prop=""
                  style="margin-bottom: 0px"
                  :has-feedback="callCommonUtilFeild(dailyReportSearchValidationForm.dataStartDate).feedback"
                  :validateStatus="callCommonUtilFeild(dailyReportSearchValidationForm.dataStartDate).state"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(dailyReportSearchValidationForm.dataStartDate).msg"
                    :trigger="callCommonUtilFeild(dailyReportSearchValidationForm.dataStartDate).hover"
                    :visible="callCommonUtilFeild(dailyReportSearchValidationForm.dataStartDate).hoverVisible"
                    :destroyTooltipOnHide="true"
                    @visibleChange="callCommonUtilFeildVisibleChange(dailyReportSearchValidationForm.dataStartDate)"
                  >
                    <DatePicker
                      v-model="dailyReportSearchForm.dataPickerStartDate"
                      style="width: 100%"
                      :formatter="formatter"
                      :disabled-date="disabledDate"
                      @clear="clearDataDate('StartDate')"
                      @change="onDueContractStartChange"
                    >
                      <!-- 請選擇日期(起) -->
                      <a-input
                        slot="input"
                        :value="dailyReportSearchForm.dataStartString"
                        @pressEnter="checkManualInputDataStartDate"
                      ></a-input>
                      <i
                        v-if="callCommonUtilFeild(dailyReportSearchValidationForm.dataStartDate).feedback"
                        slot="icon-calendar"
                      ></i>
                      <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                      <i
                        v-if="callCommonUtilFeild(dailyReportSearchValidationForm.dataStartDate).feedback"
                        slot="icon-clear"
                      >
                      <a-icon type="close-circle" theme="filled" style="color:white"/>
                      </i>
                    </DatePicker>
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <a-col :span="2" style="width: 10px; padding-top: 10px"> ~ </a-col>
              <a-col :span="4">
                <!-- 此處label 不會顯示出來 -->
                <a-form-model-item
                  class="dateEnd"
                  label=""
                  prop="dataEndDate"
                  style="margin-bottom: 0px"
                  :has-feedback="callCommonUtilFeild(dailyReportSearchValidationForm.dataEndDate).feedback"
                  :validateStatus="callCommonUtilFeild(dailyReportSearchValidationForm.dataEndDate).state"
                  
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(dailyReportSearchValidationForm.dataEndDate).msg"
                    :trigger="callCommonUtilFeild(dailyReportSearchValidationForm.dataEndDate).hover"
                    :visible="callCommonUtilFeild(dailyReportSearchValidationForm.dataEndDate).hoverVisible"
                    :destroyTooltipOnHide="true"
                    @visibleChange="callCommonUtilFeildVisibleChange(dailyReportSearchValidationForm.dataEndDate)"
                  >
                    <DatePicker
                      style="width: 100%"
                      v-model="dailyReportSearchForm.dataPickerEndDate"
                      :formatter="formatter"
                      :disabled-date="disabledDate"
                      @change="onDueContractEndChange"
                      @clear="clearDataDate('EndDate')"
                    >
                      <!-- 請選擇日期(訖) -->
                      <a-input
                        slot="input"
                        :value="dailyReportSearchForm.dataEndString"
                        @pressEnter="checkManualInputDataEndDate"
                      ></a-input>
                      <i
                        v-if="callCommonUtilFeild(dailyReportSearchValidationForm.dataEndDate).feedback"
                        slot="icon-calendar"
                      ></i>
                      <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                      <i
                        v-if="callCommonUtilFeild(dailyReportSearchValidationForm.dataEndDate).feedback"
                        slot="icon-clear"
                      >
                      <a-icon type="close-circle" theme="filled" style="color:white"/>
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
                  <a-button type="primary" @click="dailyReportSearch">
                    {{ $t("global_search") }}
                  </a-button>
                  <!-- 清除 -->
                  <a-button type="default" @click="resetDailyReportSearchForm">
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
    </div>
  </template>
  
  <script src="./DailyReportPage.ts" lang="ts"></script>
  
  