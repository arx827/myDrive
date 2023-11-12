<template>
  <div tabindex="-1" @keyup.enter="searchMailNotice">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle">
        <a-form-model
          :label-col="{ xs: 8, md: 10, xxl: 8}"
          :wrapper-col="{ xs: 16, md: 14, xxl: 16}"
          ref="mailNoicePage"
          :model="mailNoticeSearchForm"
          :rules="mailNoticeSearchRule"
          :style="hiddenFoldeStyle.color"
          class="mailNoticePage"
        >
          <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]">
            <!-- 電訪項目 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('mailNotice_search_taskItem')}}</span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="mailNoticeSearchForm.taskItemSelect"
                  :allowClser="true"
                  :options="taskOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>

            <!-- 受訪者ID -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item
                :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.custId).feedback"
                :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.custId).state"
                prop="custId"
              >
                <span slot="label">{{$t('mailNotice_search_custId')}}</span>
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(mailNoticeSearchValidateForm.custId).msg"
                  :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.custId).hover"
                  :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.custId).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.custId)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input type="text" :maxLength="10" v-model="mailNoticeSearchForm.custId"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-row>
                <a-form-model-item>
                  <span slot="label">{{$t('mailNotice_search_dueContDateChg')}}</span>
                  <a-row type="flex" class="datePicker__interval">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContStart).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContStart).state"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContStart).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContStart).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContStart).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.dueContStart)"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onDueContactStartDateChange"
                          v-model="mailNoticeSearchForm.dueContactStartDate"
                          @clear="clearDueContactStartDate"
                          :clearable="true"
                          style="width: 100%"
                        >
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputDueContactStartDate"
                            :value="mailNoticeSearchForm.dueContactStartString"
                            @mouseover="eventMousOverDueContactStartDate"
                            @mouseleave="isDueContactStartVisible = false"
                          ></a-input>
                          <i
                            v-if="mailNoticeSearchValidateForm.dueContStart.feedback"
                            slot="icon-calendar"
                          ></i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                    <span class="interval__symbol">~</span>

                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContEnd).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContEnd).state"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContEnd).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContEnd).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.dueContEnd).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.dueContEnd)"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onDueContactEndDateChange"
                          v-model="mailNoticeSearchForm.dueContactEndDate"
                          @clear="clearDueContactEndDate"
                          :clearable="true"
                          style="width: 100%"
                        >
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputDueContactEndDate"
                            :value="mailNoticeSearchForm.dueContactEndString"
                            @mouseover="eventMousOverDueContactEndDate"
                            @mouseleave="isDueContactEndVisible = false"
                          ></a-input>
                          <i
                            v-if="mailNoticeSearchValidateForm.dueContEnd.feedback"
                            slot="icon-calendar"
                          ></i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                  </a-row>
                </a-form-model-item>
              </a-row>
            </a-col>

            <!-- 保單號碼 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('mailNotice_search_casePolicy')}}</span>
                <a-row type="flex" :gutter="[5]">
                  <a-col :span="11" :gutter="15">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo01).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo01).state"
                      prop="policyNo01"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo01).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo01).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo01).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.policyNo01)"
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="10"
                          v-model="mailNoticeSearchForm.policyNo01"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo02).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo02).state"
                      prop="policyNo02"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo02).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo02).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo02).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.policyNo02)"
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="2"
                          v-model="mailNoticeSearchForm.policyNo02"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="2" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo03).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo03).state"
                      prop="policyNo03"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo03).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo03).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.policyNo03).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.policyNo03)"
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="1"
                          v-model="mailNoticeSearchForm.policyNo03"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>

            <!-- 受訪者姓名 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item
                :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.custName).feedback"
                :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.custName).state"
                prop="custName"
              >
                <span slot="label">{{$t('mailNotice_search_custName')}}</span>
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(mailNoticeSearchValidateForm.custName).msg"
                  :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.custName).hover"
                  :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.custName).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.custName)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input type="text" :maxLength="200" v-model="mailNoticeSearchForm.custName"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <!-- 產信日期 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-row>
                <a-form-model-item>
                  <span slot="label">{{$t('mailNotice_search_letterDate')}}</span>
                  <a-row type="flex" class="datePicker__interval">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.letterStart).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.letterStart).state"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.letterStart).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.letterStart).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.letterStart).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.letterStart)"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onLetterStartDateChange"
                          v-model="mailNoticeSearchForm.letterStartDate"
                          @clear="clearLetterStartDate"
                          :clearable="true"
                          style="width: 100%"
                        >
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputLetterStartDate"
                            :value="mailNoticeSearchForm.letterStartDateString"
                            @mouseover="eventMousOverLetterStartDate"
                            @mouseleave="isLetterStartVisible = false"
                          ></a-input>
                          <i
                            v-if="mailNoticeSearchValidateForm.letterStart.feedback"
                            slot="icon-calendar"
                          ></i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                    <span class="interval__symbol">~</span>
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.letterEnd).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.letterEnd).state"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.letterEnd).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.letterEnd).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.letterEnd).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.letterEnd)"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onLetterEndDateChange"
                          v-model="mailNoticeSearchForm.letterEndDate"
                          @clear="clearLetterEndDate"
                          :clearable="true"
                          style="width: 100%"
                        >
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputLetterEndDate"
                            :value="mailNoticeSearchForm.letterEndDateString"
                            @mouseover="eventMousOverLetterEndDate"
                            @mouseleave="isLetterEndVisible = false"
                          ></a-input>
                          <i
                            v-if="mailNoticeSearchValidateForm.letterEnd.feedback"
                            slot="icon-calendar"
                          ></i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                  </a-row>
                </a-form-model-item>
              </a-row>
            </a-col>

            <!-- 契約狀態 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('mailNotice_search_contractStatus')}}</span>
                <a-select
                  v-model="mailNoticeSearchForm.contractStatusSelected"
                  :filter-option="filterOption"
                  :options="contractStatusOptions"
                  :placeholder="$t('global_all')"
                  @chagne="()=>{}"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

             <!-- 投遞狀態 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('mailNotice_search_deliverStayus')}}</span>
                <a-select
                  v-model="mailNoticeSearchForm.deliverStatusSelected"
                  :filter-option="filterOption"
                  :options="deliverStatusOptions"
                  :placeholder="$t('global_all')"
                  @chagne="()=>{}"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <!-- 郵寄日期 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-row>
                <a-form-model-item>
                  <span slot="label">{{$t('mailNotice_search_mailByPostDate')}}</span>
                  <a-row type="flex" class="datePicker__interval">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostStart).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostStart).state"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostStart).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostStart).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostStart).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.mailByPostStart)"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onMailByPostStartDateChange"
                          v-model="mailNoticeSearchForm.mailByPostStartDate"
                          @clear="clearMailByPostStartDate"
                          :clearable="true"
                          style="width: 100%"
                        >
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputMailByPostStartDate"
                            :value="mailNoticeSearchForm.mailByPostStartDateString"
                            @mouseover="eventMousOverMailByPostStartDate"
                            @mouseleave="isMailByPostStartVisible = false"
                          ></a-input>
                          <i
                            v-if="mailNoticeSearchValidateForm.mailByPostStart.feedback"
                            slot="icon-calendar"
                          ></i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                    <span class="interval__symbol">~</span>
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostEnd).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostEnd).state"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostEnd).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostEnd).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostEnd).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.mailByPostEnd)"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onMailByPostEndDateChange"
                          v-model="mailNoticeSearchForm.mailByPostEndDate"
                          @clear="clearMailByPostEndDate"
                          :clearable="true"
                          style="width: 100%"
                        >
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputMailByPostEndDate"
                            :value="mailNoticeSearchForm.mailByPostEndDateString"
                            @mouseover="eventMousOverMailByPostEndDate"
                            @mouseleave="isMailByPostEndVisible = false"
                          ></a-input>
                          <i
                            v-if="mailNoticeSearchValidateForm.mailByPostEnd.feedback"
                            slot="icon-calendar"
                          ></i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                  </a-row>
                </a-form-model-item>
              </a-row>
            </a-col>

            <!-- 案件階段 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('mailNotice_search_caseStatus')}}</span>
                <a-select
                  v-model="mailNoticeSearchForm.caseStatusSelected"
                  :filter-option="filterOption"
                  :options="caseStatusOptions"
                  :placeholder="$t('global_all')"
                  @chagne="()=>{}"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

           <!-- 信函狀態 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('mailNotice_search_manualLetterStatus')}}</span>
                <a-select
                  v-model="mailNoticeSearchForm.manualLetterStatusSelected"
                  :filter-option="filterOption"
                  :options="manualLetterStatusOptions"
                  :placeholder="$t('global_all')"
                  @chagne="()=>{}"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <!-- 退回日期 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-row>
                <a-form-model-item>
                  <span slot="label">{{$t('mailNotice_search_returnDate')}}</span>
                  <a-row type="flex" class="datePicker__interval">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.returnStart).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.returnStart).state"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.returnStart).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.returnStart).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.returnStart).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.returnStart)"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onReturnStartDateChange"
                          v-model="mailNoticeSearchForm.returnStartDate"
                          @clear="clearReturnStartDate"
                          :clearable="true"
                          style="width: 100%"
                        >
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputReturnStartDate"
                            :value="mailNoticeSearchForm.returnStartDateString"
                            @mouseover="eventMousOverReturnStartDate"
                            @mouseleave="isReturnStartVisible = false"
                          ></a-input>
                          <i
                            v-if="mailNoticeSearchValidateForm.returnStart.feedback"
                            slot="icon-calendar"
                          ></i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                    <span class="interval__symbol">~</span>
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.returnEnd).feedback"
                      :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.returnEnd).state"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(mailNoticeSearchValidateForm.returnEnd).msg"
                        :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.returnEnd).hover"
                        :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.returnEnd).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.returnEnd)"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onReturnEndDateChange"
                          v-model="mailNoticeSearchForm.returnEndDate"
                          @clear="clearReturnEndDate"
                          :clearable="true"
                          style="width: 100%"
                        >
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputReturnEndDate"
                            :value="mailNoticeSearchForm.returnEndDateString"
                            @mouseover="eventMousOverReturnEndDate"
                            @mouseleave="isReturnEndVisible = false"
                          ></a-input>
                          <i
                            v-if="mailNoticeSearchValidateForm.returnEnd.feedback"
                            slot="icon-calendar"
                          ></i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                  </a-row>
                </a-form-model-item>
              </a-row>
            </a-col>

            <!-- 郵寄編號 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item
                :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostId).feedback"
                :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostId).state"
                prop="mailByPostId"
              >
                <span slot="label">{{$t('mailNotice_search_mailByPostId')}}</span>
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostId).msg"
                  :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostId).hover"
                  :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.mailByPostId).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.mailByPostId)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input type="text" :maxLength="20" v-model="mailNoticeSearchForm.mailByPostId"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <!-- 取消信函 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('mailNotice_search_cancelLetter')}}</span>
                <a-select
                  v-model="mailNoticeSearchForm.cancelLetterSelected"
                  :filter-option="filterOption"
                  :options="cancelLetterOptions"
                  :placeholder="$t('global_all')"
                  @chagne="()=>{}"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            

            <!-- 退回原因 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('mailNotice_search_returnReason')}}</span>
                <a-select
                  v-model="mailNoticeSearchForm.returnReasonSelected"
                  :filter-option="filterOption"
                  :options="returnReasonOptions"
                  :placeholder="$t('global_all')"
                  @chagne="()=>{}"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <!-- 掛號編號 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item
                :has-feedback="callCommonUtilFeild(mailNoticeSearchValidateForm.registerNo).feedback"
                :validateStatus="callCommonUtilFeild(mailNoticeSearchValidateForm.registerNo).state"
                prop="registerNo"
              >
                <span slot="label">{{$t('mailNotice_search_registerNo')}}</span>
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(mailNoticeSearchValidateForm.registerNo).msg"
                  :trigger="callCommonUtilFeild(mailNoticeSearchValidateForm.registerNo).hover"
                  :visible="callCommonUtilFeild(mailNoticeSearchValidateForm.registerNo).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(mailNoticeSearchValidateForm.registerNo)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input type="text" :maxLength="20" v-model="mailNoticeSearchForm.registerNo"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>
            
          </a-row>

          <div>
            <a-row type="flex" justify="center" class="searchBar">
              <!-- 查詢 -->
              <a-button type="primary" @click="searchMailNotice();">{{ $t("global_search") }}</a-button>
              <!-- 清除 -->
              <a-button type="default" @click="resetMailNoticeSearch()">{{ $t("global_clean") }}</a-button>
              <a-divider type="vertical"></a-divider>
              <!-- 匯出 -->
              <a-button type="primary" class="ml-auto"  @click="exportSearchResult()">{{ $t("global_export") }}</a-button>
              <!-- 郵掛清單 -->
              <a-button type="primary" class="ml-auto"  @click="exportMailLetterList()">{{ $t("mailNotice_export_letter_list") }}</a-button>
                
            </a-row>
          </div>
        </a-form-model>
      </template>
    </HiddenFolde>

    <!-- 文件上未寫到需要計算 2022/08/22 -->
    <!-- <a-row class="dataNumBar">
      <span>保單:x筆</span><br/>
      <span>名單:x筆</span><br/>
    </a-row> -->

    <div class="fbl-table">
      <FblDataGrid
        :rowKey="mailNoticeGrid.rowKey"
        :columns="mailNoticeGrid.columns"
        :data="mailNoticeGrid.data"
        :pagination="mailNoticeGrid.pagination"
        :scroll="mailNoticeGrid.scroll"
        size="middle"
        @tableChange="onPageChange($event)"
        @handleEllipsisClick="handleEllipsisClick"
        @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        ref="MailNoticeGrid"
      >
        <!-- 點擊郵寄編號 -->
        <template v-slot:alink_mailByPostId_Template="slotProps">
          <!-- 2022/09/16 確定不需要 判斷名單是否結案來決定顯不顯示 link-->
          <!-- <a v-if="slotProps.data.closePackStatus!='S'" @click="clickMailByPostId(slotProps.data)">{{slotProps.data.mailByPostId}}</a> -->
          <!-- <span v-if="slotProps.data.closePackStatus=='S'">{{slotProps.data.mailByPostId}}</span> -->
          <a @click="clickMailByPostId(slotProps.data)">{{slotProps.data.mailByPostId}}</a>
        </template>
      </FblDataGrid>
    </div>

    <a-modal
      v-model="mailNoticeSearchModal.isPostVisible"
      :title="'郵寄'"
      width="70%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <MailLetterForm
        :editWordAndCancelLetterButtonFlag="true"
        :caseNo="mailLetterFormParam.caseNo"  
      >
      </MailLetterForm>
    </a-modal>

  </div>
</template>


<script src="./MailNoticePage.ts" lang="ts"></script>


<style lang="less" scoped>
.mailNoticePage {
  padding: 5px 15px 20px;
  background: @COLOR-MAIN11;
  .ant-form-item {
    margin-bottom: 0;
  }
}

.datePicker__interval {
  .mx-datepicker {
    flex: 1;
  }
  .interval__symbol {
    margin: 0 5px;
  }
}

.searchBar {
    margin: 15px auto 0;
    .ant-btn {
      margin: 0 5px;
    }
  }

.fbl-table {
    padding-left: 24px;
    padding-right: 12px;
    margin: 10px 0;
  }
  .dataNumBar {
    margin: 0 30px;
  }
</style>