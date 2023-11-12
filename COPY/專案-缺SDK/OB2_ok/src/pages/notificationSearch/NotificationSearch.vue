<template >
  <div tabindex="-1" @keyup.enter="notiSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle"> 
        <a-form-model
          :label-col="{ xs: 7, md: 9, xxl: 7}"
          :wrapper-col="{ xs: 17, md: 15, xxl: 17}"
          ref="notificationSearch"
          :model="notiSearchForm"
          :rules="notiSearchRule"
          :style="hiddenFoldeStyle.color"
          class="countersignatureSearchPage"
        >
          <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]" style="margin-left:-10px">
            <!-- 保單號碼 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <span slot="label"> {{$t('infPage_policyNo')}} </span>
                <a-row type="flex" :gutter="[5]">
                  <a-col :span="11" :gutter="15">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(notiSearchValidateForm.policyNo01).feedback"
                      :validateStatus="callCommonUtilFeild(notiSearchValidateForm.policyNo01).state"
                      prop="policyNo01"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(notiSearchValidateForm.policyNo01).msg"
                        :trigger="callCommonUtilFeild(notiSearchValidateForm.policyNo01).hover"
                        :visible="callCommonUtilFeild(notiSearchValidateForm.policyNo01).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.policyNo01)"
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="15"
                          v-model="notiSearchForm.policyNo01"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(notiSearchValidateForm.policyNo02).feedback"
                      :validateStatus="callCommonUtilFeild(notiSearchValidateForm.policyNo02).state"
                      prop="policyNo02"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(notiSearchValidateForm.policyNo02).msg"
                        :trigger="callCommonUtilFeild(notiSearchValidateForm.policyNo02).hover"
                        :visible="callCommonUtilFeild(notiSearchValidateForm.policyNo02).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.policyNo02)"
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="2"
                          v-model="notiSearchForm.policyNo02"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="2" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(notiSearchValidateForm.policyNo03).feedback"
                      :validateStatus="callCommonUtilFeild(notiSearchValidateForm.policyNo03).state"
                      prop="policyNo03"
                    >
                      <a-popover
                        placement="top"
                        :content="callCommonUtilFeild(notiSearchValidateForm.policyNo03).msg"
                        :trigger="callCommonUtilFeild(notiSearchValidateForm.policyNo03).hover"
                        :visible="callCommonUtilFeild(notiSearchValidateForm.policyNo03).hoverVisible"
                        @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.policyNo03)"
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="1"
                          v-model="notiSearchForm.policyNo03"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <!-- 受訪者ID -->
              <a-form-model-item
                :has-feedback="callCommonUtilFeild(notiSearchValidateForm.custId).feedback"
                :validateStatus="callCommonUtilFeild(notiSearchValidateForm.custId).state"
                prop="custId"
               
              >
                <span slot="label"> {{$t('infPage_custId')}} </span>
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(notiSearchValidateForm.custId).msg"
                  :trigger="callCommonUtilFeild(notiSearchValidateForm.custId).hover"
                  :visible="callCommonUtilFeild(notiSearchValidateForm.custId).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.custId)"
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="notiSearchForm.custId"
                    
                  ></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <!-- 受訪者姓名 -->
              <a-form-model-item>
                <span slot="label"> {{$t('infPage_custName')}} </span>
                <a-input
                  type="text"
                  v-model="notiSearchForm.custName"
                  allow-clear
                ></a-input>
              </a-form-model-item>
            </a-col>
            <!-- 發送日期 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="4">
              <a-row>
                <a-form-model-item
                class="dateStart"
                :label="$t('infPage_sendDate')"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(notiSearchValidateForm.sendStart).feedback"
                :validateStatus="callCommonUtilFeild(notiSearchValidateForm.sendStart).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(notiSearchValidateForm.sendStart).msg"
                  :trigger="callCommonUtilFeild(notiSearchValidateForm.sendStart).hover"
                  :visible="callCommonUtilFeild(notiSearchValidateForm.sendStart).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.sendStart)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onSendStartChange"
                    v-model="notiSearchForm.sendStartDate"
                    @clear="clearSendStartDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputSendStartDate"
                      :value="notiSearchForm.sendStartString"
                      @mouseover="eventMouseOverSendStart"
                      @mouseleave="isSendStartVisible = false"
                    ></a-input>
                    <i
                      v-if="notiSearchValidateForm.sendStart.feedback"
                      slot="icon-calendar"
                    ></i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
              </a-row>
              </a-col>
             <a-col :xs="24" :md="12" :xl="8" :xxl="1" style="width:20px; padding-top: 10px"> ~ </a-col>
              <a-col :xs="24" :md="12" :xl="8" :xxl="3">
                <a-row>
              <a-form-model-item
                class="dateEnd"
                label=""
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(notiSearchValidateForm.sendEnd).feedback"
                :validateStatus="callCommonUtilFeild(notiSearchValidateForm.sendEnd).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(notiSearchValidateForm.sendEnd).msg"
                  :trigger="callCommonUtilFeild(notiSearchValidateForm.sendEnd).hover"
                  :visible="callCommonUtilFeild(notiSearchValidateForm.sendEnd).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.sendEnd)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onSendEndChange"
                    v-model="notiSearchForm.sendEndDate"
                    @clear="clearSendEndDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputSendEndDate"
                      :value="notiSearchForm.sendEndString"
                      @mouseover="eventMouseOverSendEnd"
                      @mouseleave="isSendEndVisible = false"
                    ></a-input>
                    <i
                      v-if="notiSearchValidateForm.sendEnd.feedback"
                      slot="icon-calendar"
                    ></i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
              </a-row>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <!-- 部門 -->
              <a-form-model-item>
                <span slot="label"> {{$t('global_department')}} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="notiSearchForm.departmentIdList"
                  :allowClear="true"
                  :options="selectDepOptions"
                  :filter-option="filterOption"
                  @change="onSelectDept"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <!-- 科別 -->
              <a-form-model-item>
                <span slot="label"> {{$t('global_division')}} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="notiSearchForm.divisionIdList"
                  :allowClear="true"
                  :options="selectDiviOptions"
                  :filter-option="filterOption"
                  @change="onSeletDivi"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <!-- 電訪員 -->
              <a-form-model-item>
                <span slot="label"> {{$t('global_telemarketer')}} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="notiSearchForm.tmrIdList"
                  :allowClear="true"
                  :options="selectTmrOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 照會到期日期 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="4">
              <a-row>
                <a-form-model-item
                class="dateStart"
                :label="$t('notification_expireDate')"
                style="margin-bottom: 0px"
                :has-feedback="callCommonUtilFeild(notiSearchValidateForm.expiryStart).feedback"
                :validateStatus="callCommonUtilFeild(notiSearchValidateForm.expiryStart).state"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(notiSearchValidateForm.expiryStart).msg"
                    :trigger="callCommonUtilFeild(notiSearchValidateForm.expiryStart).hover"
                    :visible="callCommonUtilFeild(notiSearchValidateForm.expiryStart).hoverVisible"
                    @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.expiryStart)"
                    :destroyTooltipOnHide="true"
                  >
                    <DatePicker
                      :formatter="formatter"
                      @change="onExpiryStartChange"
                      v-model="notiSearchForm.expiryStartDate"
                      @clear="clearExpiryStartDate"
                      :clearable="true"
                      style="width: 100%"
                    >
                      <a-input
                        slot="input"
                        @pressEnter="checkManualInputExpiryStartDate"
                        :value="notiSearchForm.expiryStartString"
                        @mouseover="eventMouseOverExpiryStart"
                        @mouseleave="isExpiryStartVisible = false"
                      ></a-input>
                      <i
                        v-if="notiSearchValidateForm.expiryStart.feedback"
                        slot="icon-calendar"
                      ></i>
                    </DatePicker>
                  </a-popover>
                </a-form-model-item>
              </a-row>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="1" style="width:20px; padding-top: 10px"> ~ </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="3">
              <a-row>
                <a-form-model-item
                  class="dateEnd"
                  label=""
                  style="margin-bottom: 0px"
                  :has-feedback="callCommonUtilFeild(notiSearchValidateForm.expiryEnd).feedback"
                  :validateStatus="callCommonUtilFeild(notiSearchValidateForm.expiryEnd).state"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(notiSearchValidateForm.expiryEnd).msg"
                    :trigger="callCommonUtilFeild(notiSearchValidateForm.expiryEnd).hover"
                    :visible="callCommonUtilFeild(notiSearchValidateForm.expiryEnd).hoverVisible"
                    @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.expiryEnd)"
                    :destroyTooltipOnHide="true"
                  >
                    <DatePicker
                      :formatter="formatter"
                      @change="onExpiryEndChange"
                      v-model="notiSearchForm.expiryEndDate"
                      @clear="clearExpiryEndDate"
                      :clearable="true"
                      style="width: 100%"
                    >
                      <a-input
                        slot="input"
                        @pressEnter="checkManualInputExpiryEndDate"
                        :value="notiSearchForm.expiryEndString"
                        @mouseover="eventMouseOverExpiryEnd"
                        @mouseleave="isExpiryEndVisible = false"
                      ></a-input>
                      <i
                        v-if="notiSearchValidateForm.expiryEnd.feedback"
                        slot="icon-calendar"
                      ></i>
                    </DatePicker>
                  </a-popover>
                </a-form-model-item>
              </a-row>
            </a-col>
            <!-- 處理狀態 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <span slot="label"> {{$t('infPage_handleStatus')}} </span>
                <a-select
                  class="select"
                  mode="multiple"
                  v-model="notiSearchForm.handleStatus"
                  :allowClear="true"
                  :options="handleStatusOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <!-- 作業單號 -->
              <a-form-model-item>
                <span slot="label"> {{$t('infPage_infInfoId')}} </span>
                <a-input
                  type="text"
                  v-model="notiSearchForm.notiInfoId"
                  allow-clear
                ></a-input>
              </a-form-model-item>
            </a-col>
            <!-- 發送狀態 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <a-form-model-item>
                <span slot="label"> {{$t('infPage_sendStatus')}} </span>
                <a-select
                  class="select"
                  mode="multiple"
                  v-model="notiSearchForm.sendStatus"
                  :allowClear="true"
                  :options="sendStatusOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 照會回覆日期 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="4" v-if="entryPoint == notiProcess.notiReply">
              <a-row>
                <a-form-model-item
                  class="dateStart"
                  :label="$t('notificationPage_replyDate')"
                  style="margin-bottom: 0px"
                  :has-feedback="callCommonUtilFeild(notiSearchValidateForm.replyDateStart).feedback"
                  :validateStatus="callCommonUtilFeild(notiSearchValidateForm.replyDateStart).state"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(notiSearchValidateForm.replyDateStart).msg"
                    :trigger="callCommonUtilFeild(notiSearchValidateForm.replyDateStart).hover"
                    :visible="callCommonUtilFeild(notiSearchValidateForm.replyDateStart).hoverVisible"
                    @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.replyDateStart)"
                    :destroyTooltipOnHide="true"
                  >
                    <DatePicker
                      :formatter="formatter"
                      @change="onReplyStartChange"
                      v-model="notiSearchForm.replyStartDate"
                      @clear="clearReplyStartDate"
                      :clearable="true"
                      style="width: 100%"
                    >
                      <a-input
                        slot="input"
                        @pressEnter="checkManualInputReplyStartDate"
                        :value="notiSearchForm.replyStartDateString"
                      ></a-input>
                      <i
                        v-if="notiSearchValidateForm.replyDateStart.feedback"
                        slot="icon-calendar"
                      ></i>
                    </DatePicker>
                  </a-popover>
                </a-form-model-item>
              </a-row>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="1" style="width:20px; padding-top: 10px" v-if="entryPoint == notiProcess.notiReply"> ~ </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="3" v-if="entryPoint == notiProcess.notiReply">
              <a-row>
                <a-form-model-item
                  class="dateEnd"
                  label=""
                  style="margin-bottom: 0px"
                  :has-feedback="callCommonUtilFeild(notiSearchValidateForm.replyDateEnd).feedback"
                  :validateStatus="callCommonUtilFeild(notiSearchValidateForm.replyDateEnd).state"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(notiSearchValidateForm.replyDateEnd).msg"
                    :trigger="callCommonUtilFeild(notiSearchValidateForm.replyDateEnd).hover"
                    :visible="callCommonUtilFeild(notiSearchValidateForm.replyDateEnd).hoverVisible"
                    @visibleChange="callCommonUtilFeildVisibleChange(notiSearchValidateForm.replyDateEnd)"
                    :destroyTooltipOnHide="true"
                  >
                    <DatePicker
                      :formatter="formatter"
                      @change="onReplyEndChange"
                      v-model="notiSearchForm.replyEndDate"
                      @clear="clearReplyEndDate"
                      :clearable="true"
                      style="width: 100%"
                    >
                      <a-input
                        slot="input"
                        @pressEnter="checkManualInputReplyEndDate"
                        :value="notiSearchForm.replyEndDateString"
                      ></a-input>
                      <i
                        v-if="notiSearchValidateForm.replyDateEnd.feedback"
                        slot="icon-calendar"
                      ></i>
                    </DatePicker>
                  </a-popover>
                </a-form-model-item>
              </a-row>
            </a-col>
            <!-- 結案狀態 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="6" v-if="entryPoint == notiProcess.notiReply">
              <a-form-model-item>
                <span slot="label"> {{$t('infPage_caseCloseStatus')}} </span>
                  <a-select
                    class="select"
                    mode="multiple"
                    v-model="notiSearchForm.caseClosedStatus"
                    :allowClear="true"
                    :options="caseClosedStatusOptions"
                    :filter-option="filterOption"
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div>
            <a-row type="flex" justify="center" class="searchBar">
              <!-- 查詢 -->
              <a-button type="primary" @click="isIncludeAgent = false;notiSearch();">{{ $t("global_search") }}</a-button>
              <!-- 清除 -->
              <a-button type="default" @click="notiSearchReset">{{ $t("global_clean") }}</a-button>
            </a-row>
          </div>
        </a-form-model>
      </template>
    </HiddenFolde>
    <a-row class="dataNumBar">
      <!-- 作業單 X 筆 -->
      {{ $t("infPage_infInfoCount") }}：{{ this.grid.pagination.total }} {{ $t("pedding_count") }} <br />
    </a-row>
    <div class="fbl-table">
      <FblDataGrid
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :scroll="grid.scroll"
        size="middle"
        @tableChange="onPageChange($event)"
        @handleEllipsisClick="handleEllipsisClick"
        @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        ref="countersignatureGrid"
      >
        <template v-slot:notiInfoIdTemplate="slotProps">
          <div v-if="checkInfIdLinkShow(slotProps.data)">
            <a href="javascript:void(0)" @click="handleInspectClick(slotProps.data)">{{slotProps.data.notiInfoId}}</a>
          </div>
          <div v-else>
            {{slotProps.data.notiInfoId}}
          </div>
        </template>
      </FblDataGrid>
    </div>
    
    <a-modal
      v-model="isNotificationFormVisible"
      :title="notiOpenData.title"
      width="70%"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <NotificationModal 
        :step="notiOpenData.notiStep"
        :propCaseNo="notiOpenData.caseNo"
        :propNotiInfoId="notiOpenData.notiInfoId"
        :caseLogId="notiOpenData.caseLogId"
        :packLogId="notiOpenData.packLogId"
        :propPackNo="notiOpenData.packNo"
        :reOpen="notiOpenData.reOpen"
        @onLeave="notiReSearch()"
        @onReplySubmitLeave="onNotiOpen()"
      />
    </a-modal>
  </div>
</template>

<script src="./NotificationSearch.ts" lang="ts"></script>
