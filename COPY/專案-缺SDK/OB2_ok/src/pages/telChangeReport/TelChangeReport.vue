<template >
  <div @keyup.enter="teleChangeSearch">
    <HiddenFolde> 
      <template v-slot:hiddenArea="hiddenFoldeStyle">
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="telChangeReportSearchForm"
          style="background-color: #eef6f8"
          ref=teleResultRules
          :rules="telChangeReportSearchRules"
          :style="hiddenFoldeStyle.color"
        >
          <a-row :gutter="24" style="margin-left: 30px">
            <a-col :span="4">
              <!-- 部門 -->
              <a-form-model-item
                :label="$t('global_department')"
                prop="departmentIdList"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(telChangeReportSearchValidationForm.departmentIdList).feedback"
                :validateStatus="callCommonUtilFeild(telChangeReportSearchValidationForm.departmentIdList).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(telChangeReportSearchValidationForm.departmentIdList).msg"
                  :trigger="callCommonUtilFeild(telChangeReportSearchValidationForm.departmentIdList).hover"
                  :visible="callCommonUtilFeild(telChangeReportSearchValidationForm.departmentIdList).hoverVisible"
                  :destroyTooltipOnHide="true"
                  @visibleChange="callCommonUtilFeildVisibleChange(telChangeReportSearchValidationForm.departmentIdList)"
                >
                <a-select
                  mode="multiple"
                  v-model="telChangeReportSearchForm.departmentIdList"
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
                  v-model="telChangeReportSearchForm.divisionIdList"
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
                  v-model="telChangeReportSearchForm.tmrIdList"
                  :filter-option="filterOption"
                  :options="selectTmrOptions"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <!-- 電話變更受理日期 -->
              <a-form-model-item
                :label="$t('telChangeReportPage_telChangeDate')"
                prop=""
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeStartDate).feedback"
                :validateStatus="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeStartDate).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeStartDate).msg"
                  :trigger="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeStartDate).hover"
                  :visible="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeStartDate).hoverVisible"
                  :destroyTooltipOnHide="true"
                  @visibleChange="callCommonUtilFeildVisibleChange(telChangeReportSearchValidationForm.telChangeStartDate)"
                >
                  <DatePicker
                    v-model="telChangeReportSearchForm.telChangePickerStartDate"
                    style="width: 100%"
                    :formatter="formatter"
                    :disabled-date="disabledDate"
                    @clear="clearDate('StartDate')"
                    @change="onTelChangeStartChange"
                  >
                    <!-- 請選擇日期(起) -->
                    <a-input
                      slot="input"
                      :value="telChangeReportSearchForm.telChangeStartString"
                      @pressEnter="checkManualInputTelChangeStartDate"
                    ></a-input>
                    <i
                      v-if="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeStartDate).feedback"
                      slot="icon-calendar"
                    ></i>
                    <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                    <i
                      v-if="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeStartDate).feedback"
                      slot="icon-clear"
                    >
                    <a-icon type="close-circle" theme="filled" style="color:white"/>
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
                :has-feedback="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeEndDate).feedback"
                :validateStatus="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeEndDate).state"
                
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeEndDate).msg"
                  :trigger="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeEndDate).hover"
                  :visible="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeEndDate).hoverVisible"
                  :destroyTooltipOnHide="true"
                  @visibleChange="callCommonUtilFeildVisibleChange(telChangeReportSearchValidationForm.telChangeEndDate)"
                >
                  <DatePicker
                    style="width: 100%"
                    v-model="telChangeReportSearchForm.telChangePickerEndDate"
                    :formatter="formatter"
                    :disabled-date="disabledDate"
                    @change="onTelChangeEndChange"
                    @clear="clearDate('EndDate')"
                  >
                    <!-- 請選擇日期(訖) -->
                    <a-input
                      slot="input"
                      :value="telChangeReportSearchForm.telChangeEndString"
                      @pressEnter="checkManualInputTelChangeEndDate"
                    ></a-input>
                    <i
                      v-if="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeEndDate).feedback"
                      slot="icon-calendar"
                    ></i>
                    <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                    <i
                      v-if="callCommonUtilFeild(telChangeReportSearchValidationForm.telChangeEndDate).feedback"
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
          <!-- 點擊電訪應訪件數 -->
          <template v-slot:dueContactCountTemplate="slotProps">
            <a v-if="slotProps.data.dueContactCount>=1" 
              @click="clickDueContactCount(slotProps.data)">
              {{slotProps.data.dueContactCount}}
            </a>
            <span v-if="slotProps.data.dueContactCount==0">
              {{slotProps.data.dueContactCount}}
            </span>
          </template>
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
      @ok="telChangeDetailVisible=false"
      @cancel="telChangeDetailVisible=false;"
    >
      <TelChangeDetail 
        :inputData="telChangeDetailInfo"
      />
    </DragModal>
  </div>
</template>

<script src="./TelChangeReport.ts" lang="ts"></script>

