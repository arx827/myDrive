<template >
  <div tabindex="-1" @keyup.enter="reviewCaseSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle"> 
        <a-form-model
          :label-col="{ xs: 7, md: 9, xxl: 7}"
          :wrapper-col="{ xs: 17, md: 15, xxl: 17}"
          ref="countersignatureSearch"
          :model="reviewCaseSearchForm"
          :rules="reviewCaseSearchRule"
          :style="hiddenFoldeStyle.color"
          class="countersignatureSearchPage"
        >
          <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]" style="margin-left:-10px">
            <!-- 電訪項目 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
                <a-row>
                    <a-form-model-item>
                        <span slot="label"> {{$t("userTask")}} </span>
                        <a-select
                        mode="multiple"
                        class="select"
                        v-model="reviewCaseSearchForm.taskIdList"
                        :allowClear="true"
                        :options="taskOptions"
                        :filter-option="filterOption"
                        :editable="isImpairmentDisable"
                        :disabled="!isImpairmentDisable"
                        >
                        </a-select>
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
                  v-model="reviewCaseSearchForm.departmentIdList"
                  :allowClear="true"
                  :options="selectDepOptions"
                  :filter-option="filterOption"
                  @change="onSelectDept"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <!-- 科別 -->
              <a-form-model-item>
                <span slot="label"> {{$t('global_division')}} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="reviewCaseSearchForm.divisionIdList"
                  :allowClear="true"
                  :options="selectDiviOptions"
                  :filter-option="filterOption"
                  @change="onSeletDivi"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <!-- 電訪員 -->
              <a-form-model-item>
                <span slot="label"> {{$t('global_telemarketer')}} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="reviewCaseSearchForm.tmrIdList"
                  :allowClear="true"
                  :options="selectTmrOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
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
                        :content="reviewSearchValidateForm.policyNo01.msg"
                        :trigger="reviewSearchValidateForm.policyNo01.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="15"
                          v-model="reviewCaseSearchForm.policyNo01"
                          :editable="isImpairmentDisable"
                          :disabled="!isImpairmentDisable"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      :has-feedback="reviewSearchValidateForm.policyNo02.feedback"
                      :validateStatus="reviewSearchValidateForm.policyNo02.state"
                      prop="policyNo02"
                    >
                      <a-popover
                        placement="top"
                        :content="reviewSearchValidateForm.policyNo02.msg"
                        :trigger="reviewSearchValidateForm.policyNo02.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="2"
                          v-model="reviewCaseSearchForm.policyNo02"
                          :editable="isImpairmentDisable"
                          :disabled="!isImpairmentDisable"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="2" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      :has-feedback="reviewSearchValidateForm.policyNo03.feedback"
                      :validateStatus="reviewSearchValidateForm.policyNo03.state"
                      prop="policyNo03"
                    >
                      <a-popover
                        placement="top"
                        :content="reviewSearchValidateForm.policyNo03.msg"
                        :trigger="reviewSearchValidateForm.policyNo03.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="1"
                          v-model="reviewCaseSearchForm.policyNo03"
                          :editable="isImpairmentDisable"
                          :disabled="!isImpairmentDisable"
                        ></a-input>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <!-- 案件階段 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
                <a-row>
                    <a-form-model-item>
                        <span slot="label"> {{$t("pedding_caseStage")}} </span>
                        <a-select
                        class="select"
                        v-model="reviewCaseSearchForm.caseStage"
                        :allowClear="true"
                        :options="caseStageOptions"
                        :filter-option="filterOption"
                        :editable="isImpairmentDisable"
                        :disabled="!isImpairmentDisable"
                        >
                        </a-select>
                    </a-form-model-item>
                </a-row>
            </a-col>
            <!-- 案件狀態 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
                <a-row>
                    <a-form-model-item>
                        <span slot="label"> {{$t("pedding_caseStatus")}} </span>
                        <a-select
                        class="select"
                        v-model="reviewCaseSearchForm.caseStatus"
                        :allowClear="true"
                        :options="caseStatusOptions"
                        :filter-option="filterOption"
                        :editable="isImpairmentDisable"
                        :disabled="!isImpairmentDisable"
                        >
                        </a-select>
                    </a-form-model-item>
                </a-row>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <!-- 覆核類型 -->
              <a-form-model-item>
                <span slot="label"> {{$t("reviewSP_reviewSettingType")}} </span>
                <a-select
                  :disabled="isReviewStatusDisable"
                  mode="multiple"
                  class="select"
                  v-model="reviewCaseSearchForm.reviewType"
                  :allowClear="true"
                  :options="reviewTypeOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <!-- 覆核狀態 -->
              <a-form-model-item>
                <span slot="label"> {{$t("infPage_reviewStatus")}} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="reviewCaseSearchForm.reviewStatusList"
                  :allowClear="true"
                  :options="reviewStatusOptions"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 送核日期 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="4">
              <a-row>
                <a-form-model-item
                class="dateStart"
                :label="$t('review_date')"
                style="margin-bottom: 0px"
                :has-feedback="reviewSearchValidateForm.reviewStart.feedback"
                :validateStatus="reviewSearchValidateForm.reviewStart.state"
              >
                <a-popover
                  placement="top"
                  :content="reviewSearchValidateForm.reviewStart.msg"
                  :trigger="reviewSearchValidateForm.reviewStart.hover"
                  :visible="isReviewStartVisible"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onReviewStartChange"
                    v-model="reviewCaseSearchForm.reviewStartDate"
                    @clear="clearReviewStartDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputReviewStartDate"
                      :value="reviewCaseSearchForm.reviewStartString"
                      @mouseover="eventMouseOverReviewStart"
                      @mouseleave="isReviewStartVisible = false"
                      readOnly
                    ></a-input>
                    <i
                      v-if="reviewSearchValidateForm.reviewStart.feedback"
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
                :has-feedback="reviewSearchValidateForm.reviewEnd.feedback"
                :validateStatus="reviewSearchValidateForm.reviewEnd.state"
              >
                <a-popover
                  placement="top"
                  :content="reviewSearchValidateForm.reviewEnd.msg"
                  :trigger="reviewSearchValidateForm.reviewEnd.hover"
                  :visible="isReviewEndVisible"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onReviewEndChange"
                    v-model="reviewCaseSearchForm.reviewEndDate"
                    @clear="clearReviewEndDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputReviewEndDate"
                      :value="reviewCaseSearchForm.reviewEndString"
                      @mouseover="eventMouseOverReivewEnd"
                      @mouseleave="isReviewEndVisible = false"
                      readOnly
                    ></a-input>
                    <i
                      v-if="reviewSearchValidateForm.reviewEnd.feedback"
                      slot="icon-calendar"
                    ></i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
              </a-row>
            </a-col>
          </a-row>
          <div>
            <a-row type="flex" justify="center" class="searchBar">
              <!-- 查詢 -->
              <a-button type="primary" @click="isIncludeAgent = false;reviewCaseSearch();">{{ $t("global_search") }}</a-button>
              <!-- 清除 -->
              <a-button type="default" @click="reviewCaseSearchReset">{{ $t("global_clean") }}</a-button>
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
        <template v-slot:ReviewNoTemplate="slotProps">  
          <div v-if="($route.name != 'REVIEW_MENU' && slotProps.data.canOpen == true) || ($route.name == 'REVIEW_MENU' && slotProps.data.reviewStatus == 'R')">
            <!-- 多加一個參數，給true才可以覆核通過與退回 -->
            <a href="javascript:void(0)" @click="handleInspectClick(slotProps.data, true)">{{slotProps.data.reviewNo}}</a>
          </div>
          <div v-else>
            {{slotProps.data.reviewNo}}
          </div>
        </template>
        <!-- 覆核狀態需要超連結 -->
        <template v-slot:ReviewStatusTemplate="slotProps">
          <div>
            <!-- 給false只給唯讀 -->
            <a href="javascript:void(0)" @click="handleInspectClick(slotProps.data, false)">{{slotProps.data.reviewStatusName}}</a>
          </div>
        </template>
      </FblDataGrid>
    </div>
    <!-- 會辦單覆核 -->
      <DragModal
      :visible="isReviewInfFormVisible"
      :title="$t('infReview')"
      width="70%"
      :visibleFooter="false"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      :okText="$t('onDutyPage_close')"
      @cancel="onCloseModal()"
    >
      <CuntersignatureModal
        :step="reviewData.infStep"
        :propCaseNo="reviewData.caseNo"
        :propInfInfoId="reviewData.infInfoId"
        :isShowReviewButton="reviewData.isReview"
        :propPackNo="reviewData.packNo"
        caseType="review"
        @onLeave="onCloseModal();reload()"
      />
    </DragModal>
    <!-- 電話變更覆核 -->
    <DragModal
    :visible="isPcFormVisible"
    :title="$t('recordPlayList_phoneChangeModal')"
    width="70%"
    :visibleFooter="false"
    :closable="true"
    :isMasked="false"
    :removeCancelButton="true"
    :okText="$t('onDutyPage_close')"
    @cancel="onCloseModal()"
    >
      <PhoneChangeModal
        :step="reviewData.infStep"
        :propCaseNo="reviewData.caseNo"
        :propInfInfoId="reviewData.infInfoId"
        :isShowReviewButton="reviewData.isReview"
        caseType="review"
        @onLeave="onCloseModal();reload()"
      />
  </DragModal>
    <!-- 憂質覆核 -->
    <DragModal
    :visible="isSusFormVisible"
    :title="$t('reviewCasePage_suspectiveReview')"
    width="70%"
    :visibleFooter="false"
    :closable="true"
    :isMasked="false"
    :removeCancelButton="true"
    :okText="$t('onDutyPage_close')"
    @cancel="onCloseModal()"
    >
      <SuspectiveModal
        :step="reviewData.infStep"
        :propCaseNo="reviewData.caseNo"
        :propInfInfoId="reviewData.infInfoId"
        :isShowReviewButton="reviewData.isReview"
        :propPackNo="reviewData.packNo"
        caseType="review"
        @onLeave="onCloseModal();reload()"
      />
  </DragModal>
    <!-- 照會覆核 -->
    <DragModal
    :visible="isNotiFormVisible"
    :title="$t('reviewCasePage_notiReview')"
    width="70%"
    :visibleFooter="false"
    :closable="true"
    :isMasked="false"
    :removeCancelButton="true"
    :okText="$t('onDutyPage_close')"
    @cancel="onCloseModal()"
    >
      <NotificationModal
        :step="reviewData.infStep"
        :propCaseNo="reviewData.caseNo"
        :propNotiInfoId="reviewData.infInfoId"
        :reOpen="true"
        :isShowReviewButton="reviewData.isReview"
        :propPackNo="reviewData.packNo"
        :caseLogId="reviewData.caseLogId"
        @onLeave="onCloseModal('isNotificationFormVisible');reload()"
    />
  </DragModal>
    <!-- 聽語障覆核 -->
    <DragModal
    :visible="isImpairFormVisible"
    :title="$t('reviewCasePage_impairmentReview')"
    width="70%"
    :visibleFooter="false"
    :closable="true"
    :isMasked="false"
    :removeCancelButton="true"
    :okText="$t('onDutyPage_close')"
    @cancel="onCloseModal()"
    >
      <ImpairmentModal
        :step="reviewData.infStep"
        :propCaseNo="reviewData.caseNo"
        :propInfInfoId="reviewData.infInfoId"
        :isShowReviewButton="reviewData.isReview"
        :propPackNo="reviewData.packNo"
        caseType="review"
        @onLeave="onCloseModal();reload()"
      />
    </DragModal>
  </div>
</template>

<script src="./ReviewCasePage.ts" lang="ts"></script>
