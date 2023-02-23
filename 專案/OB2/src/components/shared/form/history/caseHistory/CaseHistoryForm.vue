<template>
  <div tabindex="-1" @keyup.enter="searchCaseHistory">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ xs: 8, md: 10, xxl: 8}"
          :wrapper-col="{ xs: 16, md: 14, xxl: 16}"
          ref="caseHistory"
          :model="caseHistorySearchForm"
          :rules="caseHistorySearchRules"
          class="case-history"
        >
          <!-- 聯絡日期 -->
          <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]">
            <a-col :xs="24" :md="12" :xl="8" :xxl="21">
              <a-form-model-item :label-col="{span:3}">
                <span slot="label">{{$t('case_his_contactDate')}}</span>
                <a-row type="flex" class="datePicker__interval">
                  <a-col :span="5" :gutter="15">
                    <a-form-model-item
                      prop="contactStartDate"
                      :has-feedback="caseHistorySearchValidateForm.contactStartDate.feedback"
                      :validateStatus="caseHistorySearchValidateForm.contactStartDate.state"
                    >
                      <a-popover
                        placement="top"
                        :content="caseHistorySearchValidateForm.contactStartDate.msg"
                        :trigger="caseHistorySearchValidateForm.contactStartDate.hover"
                        :visible="isContactStartVisible"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onContactStartChange"
                          v-model="caseHistorySearchForm.datePickerContactStartDate"
                          @clear="clearContactStartDate"
                        >
                          <!-- 請選擇日期(起) -->
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputContactStartDate"
                            :value="caseHistorySearchForm.contactStartString"
                            @mouseover="eventMouseOverContactStart"
                            @mouseleave="isContactStartVisible = false"
                          />
                          <i
                            v-if="caseHistorySearchValidateForm.contactStartDate.feedback"
                            slot="icon-calendar"
                          ></i>
                           <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                           <i
                             v-if="caseHistorySearchValidateForm.contactStartDate.feedback"
                             slot="icon-clear"
                           >
                           <a-icon type="close-circle" theme="filled" style="color:white"/>
                           </i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <span class="interval__symbol">~</span>
                  </a-col>
                  <a-col :span="8" :gutter="15">
                    <a-form-model-item
                      prop="contactEndDate"
                      :has-feedback="caseHistorySearchValidateForm.contactEndDate.feedback"
                      :validateStatus="caseHistorySearchValidateForm.contactEndDate.state"
                    >
                      <a-popover
                        placement="top"
                        :content="caseHistorySearchValidateForm.contactEndDate.msg"
                        :trigger="caseHistorySearchValidateForm.contactEndDate.hover"
                        :visible="isContactEndVisible"
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onContactEndChange"
                          v-model="caseHistorySearchForm.datePickerContactEndDate"
                          @clear="clearContactEndDate"
                        >
                          <!-- 請選擇日期(迄) -->
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputContactEndDate"
                            :value="caseHistorySearchForm.contactEndString"
                            @mouseover="eventMouseOverContactEnd"
                            @mouseleave="isContactEndVisible = false"
                          />
                          <i
                            v-if="caseHistorySearchValidateForm.contactEndDate.feedback"
                            slot="icon-calendar"
                          ></i>
                          <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                          <i
                            v-if="caseHistorySearchValidateForm.contactEndDate.feedback"
                            slot="icon-clear"
                          >
                          <a-icon type="close-circle" theme="filled" style="color:white"/>
                          </i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]">
            <!-- 保單號碼 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{$t('case_his_casePolicy')}}</span>
                <a-row type="flex" :gutter="[5]">
                  <a-col :span="12" :gutter="15">
                    <a-form-model-item
                      prop="policyNo01"
                      :has-feedback="false"
                      validateStatus="success"
                    >
                      <a-popover
                        placement="top"
                        :content="caseHistorySearchValidateForm.policyNo01.msg"
                        :trigger="caseHistorySearchValidateForm.policyNo01.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="10"
                          v-model="caseHistorySearchForm.policyNo01"
                        />
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="6" :gutter="15">
                    <a-form-model-item
                      prop="policyNo02"
                      :has-feedback="caseHistorySearchValidateForm.policyNo02.feedback"
                      :validateStatus="caseHistorySearchValidateForm.policyNo02.state"
                    >
                      <a-popover
                        placement="top"
                        :content="caseHistorySearchValidateForm.policyNo02.msg"
                        :trigger="caseHistorySearchValidateForm.policyNo02.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="2"
                          v-model="caseHistorySearchForm.policyNo02"
                        />
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="4" :gutter="15">
                    <a-form-model-item
                      prop="policyNo03"
                      :has-feedback="caseHistorySearchValidateForm.policyNo03.feedback"
                      :validateStatus="caseHistorySearchValidateForm.policyNo03.state"
                    >
                      <a-popover
                        placement="top"
                        :content="caseHistorySearchValidateForm.policyNo03.msg"
                        :trigger="caseHistorySearchValidateForm.policyNo03.hover"
                      >
                        <a-input
                          type="text"
                          :maxLength="1"
                          v-model="caseHistorySearchForm.policyNo03"
                        />
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <!-- 受訪者ID -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item
                prop="custId"
                :has-feedback="caseHistorySearchValidateForm.custId.feedback"
                :validateStatus="caseHistorySearchValidateForm.custId.state"
              >
                <span slot="label">{{$t('case_his_custId')}}</span>
                <a-popover
                  placement="top"
                  :content="caseHistorySearchValidateForm.custId.msg"
                  :trigger="caseHistorySearchValidateForm.custId.hover"
                >
                  <a-input type="text" v-model="caseHistorySearchForm.custId" />
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>

          <div>
            <a-row type="flex" justify="center" align="middle" class="searchBar">
              <!-- 查詢 -->
              <a-button v-if="authComponent.CASESEARHIS_SEARCH.show" class="header-button" @click="searchCaseHistory">{{ $t("global_search") }}</a-button>
              <!-- 清除 -->
              <a-button v-if="authComponent.CASESEARHIS_SEARCH.show" type="default" @click="resetCaseHistorySearchForm">{{ $t("global_clean") }}</a-button>
              <a-divider v-if="authComponent.CASESEARHIS_EXPORT.show" type="vertical"></a-divider>
              <!-- 匯出 -->
              <a-button v-if="authComponent.CASESEARHIS_EXPORT.show" class="header-button" type="primary" @click="exportSearchResult">{{ $t("global_export") }}</a-button>
            </a-row>
          </div>
        </a-form-model>
      </template>
    </HiddenFolde>

    <div class="result__table">
      <FblDataGrid
        :themeColor="'theme2'"
        :rowKey="caseHistoryPageGrid.rowKey"
        :columns="caseHistoryPageGrid.columns"
        :data="caseHistoryPageGrid.data"
        :pagination="caseHistoryPageGrid.pagination"
        :scroll="caseHistoryPageGrid.scroll"
        size="middle"
        @tableChange="onPageChange($event)"
        @handleEllipsisClick="handleEllipsisClick"
        @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        ref="caseHistoryPageGrid"
      >
        <!-- 交辦部門註記-電訪 -->
        <template v-slot:alink_haveMarkOrMemoInfo_Template="slotProps">
          <a  v-if="slotProps.data.haveMarkOrMemoInfo=='Y'" @click="clickLinkHaveMarkOrMemoInfo(slotProps.data)">{{slotProps.data.haveMarkOrMemoInfo}}</a>
          <span v-if="slotProps.data.haveMarkOrMemoInfo=='N'">{{slotProps.data.haveMarkOrMemoInfo}}</span>
        </template>
        <!-- 點擊撥號歷程 -->
        <template v-slot:alink_haveCallUpHis_Template="slotProps">
          <a  v-if="slotProps.data.haveCallUpHis=='Y'" @click="clickLinkHaveCallUpHis(slotProps.data)">{{slotProps.data.haveCallUpHis}}</a>
          <span v-if="slotProps.data.haveCallUpHis=='N'">{{slotProps.data.haveCallUpHis}}</span>
        </template>
        <!-- 點擊通話內容 -->
        <template v-slot:alink_haveCustAns_Template="slotProps">
          <a  v-if="slotProps.data.haveCustAns=='Y'" @click="clickLinkHaveCustAns(slotProps.data)">{{slotProps.data.haveCustAns}}</a>
          <span v-if="slotProps.data.haveCustAns=='N'">{{slotProps.data.haveCustAns}}</span>
        </template>
        <!-- 點擊照會內容 -->
        <template v-slot:alink_haveNoti_Template="slotProps">
          <a  v-if="slotProps.data.haveNoti=='Y'" @click="clickLinkHaveNoti(slotProps.data)">{{slotProps.data.haveNoti}}</a>
          <span v-if="slotProps.data.haveNoti=='N'">{{slotProps.data.haveNoti}}</span>
        </template>
        <!-- 點擊會辦內容 -->
        <template v-slot:alink_haveInfInfo_Template="slotProps">
          <a  v-if="slotProps.data.haveInfInfo=='Y'" @click="clickLinkHaveInfInfo(slotProps.data)">{{slotProps.data.haveInfInfo}}</a>
          <span v-if="slotProps.data.haveInfInfo=='N'">{{slotProps.data.haveInfInfo}}</span>
        </template>
        <!-- 點擊郵寄內容 -->
        <template v-slot:alink_haveSendPack_Template="slotProps">
          <a  v-if="slotProps.data.haveSendPack=='Y'" @click="clickLinkHaveSendPack(slotProps.data)">{{slotProps.data.haveSendPack}}</a>
          <span v-if="slotProps.data.haveSendPack=='N'">{{slotProps.data.haveSendPack}}</span>
        </template>
        <!-- 點擊Email紀錄 -->
        <template v-slot:alink_haveSendEmail_Template="slotProps">
          <a  v-if="slotProps.data.haveSendEmail=='Y'" @click="clickLinkHaveSendEmail(slotProps.data)">{{slotProps.data.haveSendEmail}}</a>
          <span v-if="slotProps.data.haveSendEmail=='N'">{{slotProps.data.haveSendEmail}}</span>
        </template>
        <!-- 點擊M+/簡訊紀錄 -->
        <template v-slot:alink_haveSendMsg_Template="slotProps">
          <a  v-if="slotProps.data.haveSendMsg=='Y'" @click="clickLinkHaveSendMsg(slotProps.data)">{{slotProps.data.haveSendMsg}}</a>
          <span v-if="slotProps.data.haveSendMsg=='N'">{{slotProps.data.haveSendMsg}}</span>
        </template>

      </FblDataGrid>
    </div>

    <!----------------------------------- Modal ------------------------------------------>

    <!-- 交辦部門註記 (行政部門+電訪) Modal -->
    <DragModal
    class="c-section c-section--else pointer-events-none"
      :visible="caseHistoryPageGridModal.markOrMemoInfoVisible"
      :title="$t('case_his_modal_deptmark')"
      :closable="true"
      :visibleFooter="false"
      :destroyOnClose="true"
      :isMasked="false"
      @cancel="onCloseModal('markOrMemoInfoVisible')"
      width="80%"
    >
      <DeptMark
        :caseNoFromCaseHistory="markOrMemoParam.caseNo"
      />
    </DragModal>
    <!-- 會辦紀錄  -->
    <DragModal
    class="c-section c-section--else pointer-events-none"
      :visible="caseHistoryPageGridModal.infReocrdvisible"
      :title="$t('serveConHis_informExist')" 
      width="60%"
      :closable="true"
       :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="caseHistoryPageGridModal.infReocrdvisible=false;"
    >
      <HandleInfoForm 
        :data="handleInfoData"
        @getVisible="getInfReocrdvisible"
      ></HandleInfoForm>
        <!-- <InfRecord
        :caseLogId="questionAnswerParam.GUID"
        :caseNo="caseHistorySearchForm.caseNo"
        > </InfRecord> -->
    </DragModal>

  <!-- Email紀錄 -->
  <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseHistoryPageGridModal.onMailRecordVisible"
      :title="$t('email_records')"
      width="80%"
      :cancelText="$t('global_leave')"
      :okText="$t('global_save')"
      :footer="null"
     :isMasked="false"
      :visibleFooter="false"
      @cancel="caseHistoryPageGridModal.onMailRecordVisible=false;"
    >
        <MailRecord
        :caseNo="mailHistoryParam.CASE_NO"
        :caseLogId="mailHistoryParam.GUID"
        ></MailRecord>
    </DragModal>

      <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseHistoryPageGridModal.onMPlusAndSendMessageRecordVisible"
      :title="$t('MplusSendMessageRecords')"
      width="80%"
      :cancelText="$t('global_leave')"
      :okText="$t('global_save')"
      :footer="null"
      :isMasked="false"
      :visibleFooter="false"
      @cancel="caseHistoryPageGridModal.onMPlusAndSendMessageRecordVisible=false;"
    >
       <MPlusHistory
      :caseNo="mailHistoryParam.CASE_NO"
      :caseLogId="mailHistoryParam.GUID"
      > 
       </MPlusHistory>
    </DragModal>


    

    <!-- 通話內容 -->
  <DragModal
    class="c-section c-section--else pointer-events-none"
    :visible="caseHistoryPageGridModal.isQuestionAnswerVisible"
    :title="$t('case_search_grid_haveCustAns')"
    width="60%"
    :okText="$t('onDutyPage_close')"
    :closable="true"
    :isMasked="false"
    :removeCancelButton="true"
    @cancel="onCloseModal('isQuestionAnswerVisible')"
    :visibleFooter="false"
  >
    <QuestionAnswer
      :questionAnswerParam="questionAnswerParam"
    ></QuestionAnswer>
  </DragModal>

    <!-- 撥號歷程 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseHistoryPageGridModal.isCallUpHistoryVisible"
      :title="$t('case_search_grid_haveCallUpHis')"
      width="80%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @cancel="onCloseModal('isCallUpHistoryVisible')"
      :visibleFooter="false"
    >
      <CallupHistory
        :callUpHistoryParam="callUpHistoryParam"
      />
    </DragModal>
    <!-- 郵寄紀錄 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseHistoryPageGridModal.isPostRecordVisible"
      :title="$t('postRecords')"
      width="80%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @cancel="onCloseModal('isPostRecordVisible')"
      :visibleFooter="false"
    >
      <PostRecord
        :caseId="postRecordParam.caseNo"
        :caseLogId="postRecordParam.caseLogId"
      ></PostRecord>
    </DragModal>

    <!-- 照會紀錄 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseHistoryPageGridModal.notiReocrdvisible"
      :title="$t('handleInfoForm_notiRecord')"
      width="60%"
      :closable="true"
       :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="caseHistoryPageGridModal.notiReocrdvisible=false;"
    >
      <HandleInfoForm 
        :data="handleInfoData"
        @getVisible="getNotiReocrdvisible"
      ></HandleInfoForm>
    </DragModal>

  </div>
</template>

<script src="./CaseHistoryForm.ts" lang="ts"></script>

<style lang="less" scoped>
.case-history {
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

.header-button {
  margin-right: auto;
  padding: 6px 10px;
  background-color: @ICON-BUTTON-BG-BLUE;
  color: @COLOR-WHITE;
  border-radius: 4px;
  border: 0;
  min-width: 65px;
  min-height: 33px;
  text-align: center;
  cursor: pointer;
}
.result__table {
  margin-top: 0.5rem !important;
}
</style>