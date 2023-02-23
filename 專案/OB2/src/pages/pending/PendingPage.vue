<template>
  <div tabindex="-1" @keyup.enter="peddingSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle">
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="peddingSearchForm"
          :rules="peddingSearchRules"
          :style="hiddenFoldeStyle.color"
          class="peddingPage"
        >
          <a-row :gutter="24" style="margin-left: 30px">
            <a-col :span="4">
              <!-- 保單號碼 -->
              <a-form-model-item
                :label="$t('pedding_policyNo')"
                prop="policyNo01"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.policyNo01).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.policyNo01).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.policyNo01).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.policyNo01).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.policyNo01).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.policyNo01)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="peddingSearchForm.policyNo01"
                    :maxLength="10"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 5px; padding-top: 10px"> - </a-col>

            <a-col :span="2">
              <!-- 保單號碼 -->
              <a-form-model-item
                :label="$t('pedding_policyNo')"
                class="policyNoLabel"
                prop="policyNo02"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.policyNo02).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.policyNo02).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.policyNo02).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.policyNo02).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.policyNo02).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.policyNo02)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="peddingSearchForm.policyNo02"
                    :maxLength="2"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 5px; padding-top: 10px"> - </a-col>
            <a-col :span="2">
              <!-- 保單號碼 -->
              <a-form-model-item
                :label="$t('pedding_policyNo')"
                class="policyNoLabel"
                prop="policyNo03"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.policyNo03).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.policyNo03).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.policyNo03).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.policyNo03).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.policyNo03).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.policyNo03)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="peddingSearchForm.policyNo03"
                    :maxLength="2"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <!-- 電訪項目 -->
              <a-form-model-item
                :label="$t('pedding_contactItem')"
                class="contactItem"
                style="margin-bottom: 0px"
                prop="contactItemIdList"
              >
                <!-- 全部 -->
                <a-select
                  mode="multiple"
                  v-model="peddingSearchForm.contactItemIdList"
                  :filter-option="filterOption"
                  :options="selectContactItemOptions"
                  :placeholder="$t('global_all')"
                  @change="selectChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="4">
              <!-- 匯入日期 -->
              <a-form-model-item
                class="dateStart"
                :label="$t('pedding_importDate')"
                prop="importStartDate"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.importStartDate).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.importStartDate).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.importStartDate).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.importStartDate).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.importStartDate).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.importStartDate)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onImportStartChange"
                    v-model="peddingSearchForm.importStartDate"
                    @clear="clearImportDate('StartDate')"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <!-- 請選擇日期(起) -->
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputImportStartDate"
                      :value="peddingSearchForm.importStartString"
                    ></a-input>
                    <i
                      v-if="callCommonUtilFeild(peddingSearchValidateForm.importStartDate).feedback"
                      slot="icon-calendar"
                    ></i>
                    <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                    <i
                      v-if="callCommonUtilFeild(peddingSearchValidateForm.importStartDate).feedback"
                      slot="icon-clear"
                    >
                    <a-icon type="close-circle" theme="filled" style="color:white"/>
                    </i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 10px; padding-top: 10px"> ~ </a-col>
            <a-col :span="3">
              <!-- 此處label不會顯示出來 -->
              <a-form-model-item
                class="dateEnd"
                label="~"
                prop="importEndDate"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.importEndDate).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.importEndDate).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.importEndDate).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.importEndDate).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.importEndDate).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.importEndDate)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onImportEndChange"
                    v-model="peddingSearchForm.importEndDate"
                    @clear="clearImportDate('EndDate')"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <!-- 請選擇日期(訖) -->
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputImportEndDate"
                      :value="peddingSearchForm.importEndString"
                    ></a-input>
                    <i
                      v-if="callCommonUtilFeild(peddingSearchValidateForm.importEndDate).feedback"
                      slot="icon-calendar"
                    ></i>
                    <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                    <i
                      v-if="callCommonUtilFeild(peddingSearchValidateForm.importEndDate).feedback"
                      slot="icon-clear"
                    >
                    <a-icon type="close-circle" theme="filled" style="color:white"/>
                    </i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24" style="margin-left: 30px">
            <a-col :span="4">
              <!-- 受訪者ID -->
              <a-form-model-item
                :label="$t('pedding_custId')"
                prop="respondentsId"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.respondentsId).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.respondentsId).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.respondentsId).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.respondentsId).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.respondentsId).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.respondentsId)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="peddingSearchForm.respondentsId"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 受理案號 -->
              <a-form-model-item
                :label="$t('pedding_changeNo')"
                class="changeNo"
                prop="changeNo"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.changeNo).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.changeNo).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.changeNo).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.changeNo).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.changeNo).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.changeNo)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input type="text" v-model="peddingSearchForm.changeNo" />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 類型 -->
              <a-form-model-item
                :label="$t('pedding_type')"
                class="type"
                style="margin-bottom: 0px"
                prop="typeIdList"
              >
                <!-- 全部 -->
                <a-select
                  mode="multiple"
                  v-model="peddingSearchForm.typeIdList"
                  :filter-option="filterOption"
                  :options="selectPolicyTypeOptions"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 50px; padding-top: 10px"> </a-col>
            <a-col :span="4">
              <!-- 應電訪日 -->
              <a-form-model-item
                class="dateStart"
                :label="$t('pedding_dueContactDate')"
                prop="dueContactStartDate"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.dueContactStartDate).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.dueContactStartDate).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.dueContactStartDate).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.dueContactStartDate).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.dueContactStartDate).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.dueContactStartDate)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onDueContractStartChange"
                    v-model="peddingSearchForm.datePickerDueContactStartDate"
                    @clear="clearDueContractDate('StartDate')"
                    style="width: 100%"
                  >
                    <!-- 請選擇日期(起) -->
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputDueContractStartDate"
                      :value="peddingSearchForm.dueContactStartString"
                    ></a-input>
                    <i
                      v-if="callCommonUtilFeild(peddingSearchValidateForm.dueContactStartDate).feedback"
                      slot="icon-calendar"
                    ></i>
                    <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                    <i
                      v-if="callCommonUtilFeild(peddingSearchValidateForm.dueContactStartDate).feedback"
                      slot="icon-clear"
                    >
                    <a-icon type="close-circle" theme="filled" style="color:white"/>
                    </i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 10px; padding-top: 10px"> ~ </a-col>
            <a-col :span="3">
              <!-- 此處label 不會顯示出來 -->
              <a-form-model-item
                class="dateEnd"
                label="~"
                prop="dueContactEndDate"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.dueContactEndDate).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.dueContactEndDate).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.dueContactEndDate).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.dueContactEndDate).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.dueContactEndDate).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.dueContactEndDate)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onDueContractEndChange"
                    v-model="peddingSearchForm.datePickerDueCountactEndDate"
                    @clear="clearDueContractDate('EndDate')"
                    style="width: 100%"
                  >
                    <!-- 請選擇日期(訖) -->
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputDueContractEndDate"
                      :value="peddingSearchForm.dueContactEndString"
                    ></a-input>
                    <i
                      v-if="callCommonUtilFeild(peddingSearchValidateForm.dueContactEndDate).feedback"
                      slot="icon-calendar"
                    ></i>
                    <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                    <i
                      v-if="callCommonUtilFeild(peddingSearchValidateForm.dueContactEndDate).feedback"
                      slot="icon-clear"
                    >
                    <a-icon type="close-circle" theme="filled" style="color:white"/>
                    </i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24" style="margin-left: 30px">
            <a-col :span="3">
              <!-- 案件階段 -->
              <a-form-model-item
                :label="$t('pedding_caseStage')"
                style="margin-bottom: 0px"
                prop="caseStageId"
                class="peddingCol3"
              >
                <!-- 全部 -->
                <a-select
                  v-model="peddingSearchForm.caseStageId"
                  :filter-option="filterOption"
                  :options="selectPolicyStageOptions"
                  :placeholder="$t('global_all')"
                  @change="selectStageChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="3">
              <!-- 案件狀態 -->
              <a-form-model-item
                :label="$t('pedding_caseStatus')"
                style="margin-bottom: 0px"
                prop="caseStatusId"
                class="peddingCol3"
              >
                <!-- 全部 -->
                <a-select
                  v-model="peddingSearchForm.caseStatusId"
                  :filter-option="filterOption"
                  :options="selectPolicyStatusOptions"
                  :placeholder="$t('global_all')"
                  @change="selectChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="3">
              <!-- 案件等級 -->
              <a-form-model-item
                :label="$t('pedding_caseLevel')"
                style="margin-bottom: 0px"
                prop="caseLevelId"
                class="peddingCol3"
              >
                <!-- 全部 -->
                <a-select
                  v-model="peddingSearchForm.caseLevelId"
                  :filter-option="filterOption"
                  :options="selectPolicyLevelOptions"
                  :placeholder="$t('global_all')"
                  @change="selectChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="3">
              <!-- 優先 -->
              <a-form-model-item
                :label="$t('pedding_priority')"
                style="margin-bottom: 0px"
                prop="priorityId"
                class="selectionCol3"
              >
                <!-- 全部 -->
                <a-select
                  v-model="peddingSearchForm.priorityId"
                  :filter-option="filterOption"
                  :options="selectPriorityOptions"
                  :placeholder="$t('global_all')"
                  @change="selectChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="3">
              <!-- 法代 -->
              <a-form-model-item
                :label="$t('pedding_Legal')"
                style="margin-bottom: 0px"
                prop="isLegal"
                class="selectionCol3"
              >
                <!-- 全部 -->
                <a-select
                  v-model="peddingSearchForm.isLegal"
                  :filter-option="filterOption"
                  :options="selectLegalOptions"
                  :placeholder="$t('global_all')"
                  @change="selectChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 50px; padding-top: 10px"></a-col>
            <a-col :span="4">
              <!-- 指定聯絡時段 -->
              <a-form-model-item
                :label="$t('pedding_specifyContactTime')"
                class="timeStart"
                style="margin-bottom: 0px"
                prop="specifyContactStartTime"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.specifyContactStartTime).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.specifyContactStartTime).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.specifyContactStartTime).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.specifyContactStartTime).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.specifyContactStartTime).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.specifyContactStartTime)"
                  :destroyTooltipOnHide="true"
                >
                  <!-- 請選擇時間(起) -->
                  <TimePicker
                    :open="isSpecifyContactStartOpen"
                    @openChange="clickSpecifyContactStartTimePicker"
                    placeholder=""
                    style="width: 100%"
                    v-model="peddingSearchForm.specifyContactStartTime"
                    @change="onSpecifyContactStartTimeChange"
                    :minute-step="5"
                    format="HH:mm"
                    :allowClear="!callCommonUtilFeild(peddingSearchValidateForm.specifyContactStartTime).feedback"
                  >
                    <!-- 確定 -->
                    <a-button
                      slot="addon"
                      size="small"
                      type="primary"
                      @click="closeSpecifyContactStartTimePicker"
                    >
                      {{ $t("global_ok") }}
                    </a-button>
                  </TimePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 10px; padding-top: 10px"> ~ </a-col>
            <a-col :span="3">
              <!-- 此處label不會顯示出來 -->
              <a-form-model-item
                :label="$t('pedding_specifyContactTime')"
                class="timeEnd"
                style="margin-bottom: 0px"
                prop="specifyContactEndTime"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.specifyContactEndTime).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.specifyContactEndTime).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.specifyContactEndTime).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.specifyContactEndTime).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.specifyContactEndTime).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.specifyContactEndTime)"
                  :destroyTooltipOnHide="true"
                >
                  <!-- 請選擇時間(訖) -->
                  <TimePicker
                    :open="isSpecifyContactEndOpen"
                    @openChange="clickSpecifyContactEndTimePicker"
                    placeholder=""
                    style="width: 100%"
                    v-model="peddingSearchForm.specifyContactEndTime"
                    @change="onSpecifyContactEndTimeChange"
                    :minute-step="5"
                    format="HH:mm"
                    :allowClear="!callCommonUtilFeild(peddingSearchValidateForm.specifyContactEndTime).feedback"
                  >
                    <!-- 確定 -->
                    <a-button
                      slot="addon"
                      size="small"
                      type="primary"
                      @click="closeSpecifyContactEndTimePicker"
                    >
                      {{ $t("global_ok") }}
                    </a-button>
                  </TimePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24" style="margin-left: 30px">
            <a-col :span="5">
              <!-- 部門別 -->
              <a-form-model-item
                :label="$t('pedding_department')"
                class="department"
                prop="departmentIdList"
                style="margin-bottom: 0px"
              >
                <!-- 全部 -->
                <a-select
                  mode="multiple"
                  v-model="peddingSearchForm.departmentIdList"
                  :options="selectDeptOptions"
                  @change="onSelectDept"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 科別 -->
              <a-form-model-item
                :label="$t('global_division')"
                class="division"
                prop="divisionIdList"
                style="margin-bottom: 0px"
              >
                <!-- 全部 -->
                <a-select
                  mode="multiple"
                  v-model="peddingSearchForm.divisionIdList"
                  :options="selectDiviOptions"
                  @change="onSeletDivi"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 電訪員 -->
              <a-form-model-item
                :label="$t('global_telemarketer')"
                class="tmrId"
                style="margin-bottom: 0px"
                prop="tmrIdList"
              >
                <!-- 全部 -->
                <a-select
                  mode="multiple"
                  v-model="peddingSearchForm.tmrIdList"
                  :filter-option="filterOption"
                  :options="selectTmrOptions"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="1" style="width: 50px; padding-top: 10px"></a-col>
            <a-col :span="7">
              <!-- 方便聯絡日期 -->
              <a-form-model-item
                class="contackDate"
                :label="$t('pedding_contactTime')"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.contactDates).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.contactDates).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.contactDates).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.contactDates).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.contactDates).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.contactDates)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatterDateTime"
                    @change="onContactDatesChange"
                    v-model="peddingSearchForm.contactDates"
                    :time-title-format="timeTitleFormat"
                    @clear="clearContactDates"
                    :open="isContactDatePickerOpen"
                    @open="openContactDatesPicker"
                    @close="closeContactDatesPicker"
                    :show-time-panel="showTimeRangePanel"
                    :minute-step="5"
                    :show-second="false"
                    :clearable="true"
                    range
                    type="datetime"
                    style="width: 100%"
                  >
                    <template v-slot:footer>
                      <a-space>
                        <a-button
                          type="primary"
                          size="small"
                          @click="toggleTimeRangePanel"
                        >
                          {{ showTimeRangePanel ? $t("global_select_date") : $t("global_select_time") }} 
                          <!-- 選擇日期  選擇時間 -->
                        </a-button>
                        <!-- 確定 -->
                        <a-button
                          size="small"
                          type="primary"
                          @click="handCloseContactDatesPicker"
                        >
                          {{ $t("global_ok") }}
                        </a-button>
                      </a-space>
                    </template>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24" style="margin-left: 30px">
            <a-col :span="5">
              <!-- 單位代號 -->
              <a-form-model-item
                :label="$t('pedding_agentUnitId')"
                class="agentUnitId"
                prop="agentUnitId"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.agentUnitId).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.agentUnitId).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.agentUnitId).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.agentUnitId).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.agentUnitId).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.agentUnitId)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="peddingSearchForm.agentUnitId"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 業務員ID -->
              <a-form-model-item
                :label="$t('pedding_agentId')"
                class="agentId"
                style="margin-bottom: 0px"
                prop="agentId"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.agentId).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.agentId).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.agentId).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.agentId).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.agentId).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.agentId)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input type="text" v-model="peddingSearchForm.agentId" />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 業務員姓名 -->
              <a-form-model-item
                :label="$t('pedding_agentName')"
                class="agentName"
                prop="agentName"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(peddingSearchValidateForm.agentName).feedback"
                :validateStatus="callCommonUtilFeild(peddingSearchValidateForm.agentName).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(peddingSearchValidateForm.agentName).msg"
                  :trigger="callCommonUtilFeild(peddingSearchValidateForm.agentName).hover"
                  :visible="callCommonUtilFeild(peddingSearchValidateForm.agentName).agentName"
                  @visibleChange="callCommonUtilFeildVisibleChange(peddingSearchValidateForm.agentName)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input type="text" v-model="peddingSearchForm.agentName" />
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div
              style="
                text-align: center;
                margin-bottom: 16px;
                margin-right: 20.5%;
              "
            >
              <a-space>
                <!-- 快速查詢條件 -->
                <b>{{ $t("pedding_quickSearchFilter") }}：</b>
                <!-- 個人再電訪 -->
                <label @click="pendingClick" class="autoFilterSearch">{{
                  $t("pedding_personRePedding")
                }}</label>
                <!-- 個人今日再電訪 -->
                <label @click="pendingTodayClick" class="autoFilterSearch">{{
                  $t("pedding_personRePeddingTD")
                }}</label>
                <a-divider type="vertical"></a-divider>
                <!-- 取件 OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面-->
                <a-button type="danger" @click="pendingPickUp" style="width: 200px" :disabled="!authComponent.PENDDING_GET_CASE.enable">{{
                  $t("pedding_getCase")
                }}</a-button>
                <a-divider type="vertical"></a-divider>
                <!-- 查詢 -->
                <a-button type="primary" @click="peddingSearch" v-if="authComponent.PENDDING_SEARCH.show" :disabled="!authComponent.PENDDING_SEARCH.enable">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetPeddingSearchForm" v-if="authComponent.PENDDING_SEARCH.show" :disabled="!authComponent.PENDDING_SEARCH.enable">
                  {{ $t("global_clean") }}
                </a-button>
                <a-divider type="vertical"></a-divider>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportSearchResult" v-if="authComponent.PENDDING_EXPORT.show" :disabled="!authComponent.PENDDING_EXPORT.enable">
                  {{ $t("global_export") }}
                </a-button>
                <!-- 案件註記 -->
                <a-button type="primary" @click="policyMarkClick" v-if="authComponent.PENDDING_CASE_REMARK.show" :disabled="!authComponent.PENDDING_CASE_REMARK.enable"> {{ $t("pedding_caseRemark") }} </a-button>
                <!-- 改應電訪日 -->
                <a-button type="primary" @click="onModifyCallDateClick()" v-if="authComponent.PENDDING_CHANGE_DUE_DATE.show" :disabled="!authComponent.PENDDING_CHANGE_DUE_DATE.enable">
                  {{ $t("pedding_changeDueDate") }}
                </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>
    <a-row style="margin-left: 30px">
      <!-- 電訪案件 X 筆 -->
      {{ $t("pedding_casePolicy") }}：{{ this.grid.pagination.total }}
      {{ $t("pedding_count") }} <br />
      <!-- 名單 X　筆 -->
      {{ $t("pedding_casePack") }}：{{ this.packCount }}
      {{ $t("pedding_count") }}
    </a-row>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <FblDataGrid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :scroll="grid.scroll"
          size="middle"
          @tableChange="onPageChange($event)"
          @checkedChange="onCheckedChange($event)"
          :checkSelected="checkSelected"
          @handleEllipsisClick="handleEllipsisClick"
          @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
          style="padding-left: 24px; padding-right: 12px"
          ref="peddingGrid"
        >
        </FblDataGrid>
      </a-col>
    </a-row>

    <!-- 彈跳視窗:電訪項目form -->
    <a-modal
      v-model="modifyCallingDateVisible"
      :title="$t('pending_callDate_modify')"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      :maskClosable="false"
      class="error-modal-util-class"
      :destroyOnClose="true"
      @ok="modifyCallDateModalSubmit"
      @cancel="modifyCallDateModalCancel"
    >
      <ModifyCallDateForm
        @reloadData="onCallDateModify"
        :caseNumbers="caseNumbersArray"
        ref="modifyCallTime"
      >
      </ModifyCallDateForm>
       <template #footer>
        <!-- 離開 -->
        <a-row type="flex" justify="center" style="margin-top: 16px">
        <a-button key="button" type="primary" @click="modifyCallDateModalSubmit">{{
           $t("global_save")
        }}</a-button>
        <!-- 儲存 -->
        <a-button key="submit"  @click="modifyCallDateModalCancel">{{
          $t("global_cancel")
        }}</a-button>
        </a-row>
      </template>
    </a-modal>
    <a-modal
      v-model="policyMaskVisible"
      :title="$t('pedding_caseRemark')"
      :cancelText="$t('global_clean')" 
      :okText="$t('global_save')"
      width="1000px"
      :maskClosable="false"
      @ok="policyMaskSubmit"
      @cancel="policyMaskCancel"
    >
      <PolicyMaskForm
        :isMarkReboot="isMarkReboot"
        :selectDeptOptionsProp="activedDeptOptions"
        :unitDepInfo="activedUnitDepInfo"
        :selectPolicyLevelOptions="selectPolicyLevelOptions"
        :policyList="pendingListForPolicyMark"
        :checkedCaseNoList="caseNumbersArray"
        ref="policyMarkTable"
        @reloadData="onPolicyMarkSubmit"
        :destroyOnClose="true"
      >
      </PolicyMaskForm>
    </a-modal> 
  </div>
</template>
<script src="./PendingPage.ts" lang="ts"></script>