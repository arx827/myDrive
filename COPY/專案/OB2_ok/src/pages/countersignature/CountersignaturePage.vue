<template >
  <div tabindex="-1" @keyup.enter="infSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle"> 
        <a-form-model
          :label-col="{ xs: 7, md: 9, xxl: 7}"
          :wrapper-col="{ xs: 17, md: 15, xxl: 17}"
          ref="countersignatureSearch"
          :model="infSearchForm"
          :rules="infSearchRule"
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
                      :has-feedback="false"
                      validateStatus="success"
                      prop="policyNo01"
                    >
                      <a-popover
                        placement="top"
                        :content="infSearchValidateForm.policyNo01.msg"
                        :trigger="infSearchValidateForm.policyNo01.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="15"
                          v-model="infSearchForm.policyNo01"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      :has-feedback="infSearchValidateForm.policyNo02.feedback"
                      :validateStatus="infSearchValidateForm.policyNo02.state"
                      prop="policyNo02"
                    >
                      <a-popover
                        placement="top"
                        :content="infSearchValidateForm.policyNo02.msg"
                        :trigger="infSearchValidateForm.policyNo02.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="2"
                          v-model="infSearchForm.policyNo02"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="2" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      :has-feedback="infSearchValidateForm.policyNo03.feedback"
                      :validateStatus="infSearchValidateForm.policyNo03.state"
                      prop="policyNo03"
                    >
                      <a-popover
                        placement="top"
                        :content="infSearchValidateForm.policyNo03.msg"
                        :trigger="infSearchValidateForm.policyNo03.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="1"
                          v-model="infSearchForm.policyNo03"
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
                :has-feedback="infSearchValidateForm.custId.feedback"
                :validateStatus="infSearchValidateForm.custId.state"
                prop="custId"
               
              >
                <span slot="label"> {{$t('infPage_custId')}} </span>
                <a-popover
                  placement="top"
                  :content="infSearchValidateForm.custId.msg"
                  :trigger="infSearchValidateForm.custId.hover"
                >
                  <a-input
                    type="text"
                    v-model="infSearchForm.custId"
                    
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
                  v-model="infSearchForm.custName"
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
                :has-feedback="infSearchValidateForm.sendStart.feedback"
                :validateStatus="infSearchValidateForm.sendStart.state"
              >
                <a-popover
                  placement="top"
                  :content="infSearchValidateForm.sendStart.msg"
                  :trigger="infSearchValidateForm.sendStart.hover"
                  :visible="isSendStartVisible"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onSendStartChange"
                    v-model="infSearchForm.sendStartDate"
                    @clear="clearSendStartDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputSendStartDate"
                      :value="infSearchForm.sendStartString"
                      @mouseover="eventMouseOverSendStart"
                      @mouseleave="isSendStartVisible = false"
                    ></a-input>
                    <i
                      v-if="infSearchValidateForm.sendStart.feedback"
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
                :has-feedback="infSearchValidateForm.sendEnd.feedback"
                :validateStatus="infSearchValidateForm.sendEnd.state"
              >
                <a-popover
                  placement="top"
                  :content="infSearchValidateForm.sendEnd.msg"
                  :trigger="infSearchValidateForm.sendEnd.hover"
                  :visible="isSendEndVisible"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onSendEndChange"
                    v-model="infSearchForm.sendEndDate"
                    @clear="clearSendEndDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputSendEndDate"
                      :value="infSearchForm.sendEndString"
                      @mouseover="eventMouseOverSendEnd"
                      @mouseleave="isSendEndVisible = false"
                    ></a-input>
                    <i
                      v-if="infSearchValidateForm.sendEnd.feedback"
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
                  v-model="infSearchForm.departmentIdList"
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
                  v-model="infSearchForm.divisionIdList"
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
                  v-model="infSearchForm.tmrIdList"
                  :allowClear="true"
                  :options="selectTmrOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 會辦到期日期 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="4">
              <a-row>
                <a-form-model-item
                class="dateStart"
                :label="$t('infPage_expiryDate')"
                style="margin-bottom: 0px"
                :has-feedback="infSearchValidateForm.expiryStart.feedback"
                :validateStatus="infSearchValidateForm.expiryStart.state"
              >
                <a-popover
                  placement="top"
                  :content="infSearchValidateForm.expiryStart.msg"
                  :trigger="infSearchValidateForm.expiryStart.hover"
                  :visible="isExpiryStartVisible"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onExpiryStartChange"
                    v-model="infSearchForm.expiryStartDate"
                    @clear="clearExpiryStartDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputExpiryStartDate"
                      :value="infSearchForm.expiryStartString"
                      @mouseover="eventMouseOverExpiryStart"
                      @mouseleave="isExpiryStartVisible = false"
                    ></a-input>
                    <i
                      v-if="infSearchValidateForm.expiryStart.feedback"
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
                :has-feedback="infSearchValidateForm.expiryEnd.feedback"
                :validateStatus="infSearchValidateForm.expiryEnd.state"
              >
                <a-popover
                  placement="top"
                  :content="infSearchValidateForm.expiryEnd.msg"
                  :trigger="infSearchValidateForm.expiryEnd.hover"
                  :visible="isExpiryEndVisible"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onExpiryEndChange"
                    v-model="infSearchForm.expiryEndDate"
                    @clear="clearExpiryEndDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputExpiryEndDate"
                      :value="infSearchForm.expiryEndString"
                      @mouseover="eventMouseOverExpiryEnd"
                      @mouseleave="isExpiryEndVisible = false"
                    ></a-input>
                    <i
                      v-if="infSearchValidateForm.expiryEnd.feedback"
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
                  v-model="infSearchForm.handleStatus"
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
                  v-model="infSearchForm.infInfoId"
                  allow-clear
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <!-- 會辦部門 -->
              <a-form-model-item>
                <span slot="label"> {{$t('infPage_infDep')}} </span>
                <a-select
                  class="select"
                  mode="multiple"
                  v-model="infSearchForm.infDep"
                  :allowClear="true"
                  :options="infDepOption"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <a-row>
                <!-- 會辦類型 -->
                <a-form-model-item>
                <span slot="label"> {{$t('infPage_infType')}} </span>
                <a-select
                  disabled
                  class="select"
                  v-model="infSearchForm.infType"
                  :allowClear="true"
                  :options="infTypeOption"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
              </a-row>
            </a-col>
            <!-- 發送狀態 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <span slot="label"> {{$t('infPage_sendStatus')}} </span>
                <a-select
                  class="select"
                  mode="multiple"
                  v-model="infSearchForm.sendStatus"
                  :allowClear="true"
                  :options="sendStatusOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div>
            <a-row type="flex" justify="center" class="searchBar">
              <!-- 查詢 -->
              <a-button type="primary" @click="isIncludeAgent = false;infSearch();">{{ $t("global_search") }}</a-button>
              <!-- 清除 -->
              <a-button type="default" @click="infSearchReset">{{ $t("global_clean") }}</a-button>
              <!-- 匯出 -->
              <a-button type="primary" @click="exportSearchResult">{{$t("global_export")}}</a-button>
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
        <template v-slot:infInfoIdTemplate="slotProps">
          <div v-if="checkInfIdLinkShow(slotProps.data)">
            <a href="javascript:void(0)" @click="handleInspectClick(slotProps.data)">{{slotProps.data.infInfoId}}</a>
          </div>
          <div v-else>
            {{slotProps.data.infInfoId}}
          </div>
        </template>
      </FblDataGrid>
    </div>
    <a-modal
      v-model="isCountersignatureFormVisible"
      :title="'會辦'"
      width="70%"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      @cancel="reload()"
    >
      <CuntersignatureModal
        :step="cuntersignatureData.infStep"
        :propCaseNo="cuntersignatureData.caseNo"
        :propInfInfoId="cuntersignatureData.infInfoId"
        :propInfTypeId="cuntersignatureData.infTypeId"
        @onLeave="onCloseModal('isCountersignatureFormVisible');reload()"
      />
    </a-modal>
  </div>
</template>

<script src="./CountersignaturePage.ts" lang="ts"></script>
