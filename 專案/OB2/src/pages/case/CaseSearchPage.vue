<template >
  <div tabindex="-1" @keyup.enter="searchCasePage">
    <div v-if="checkIsHiddenFoldeShow()">
      <HiddenFolde>
        <template v-slot:hiddenArea>
          <a-form-model
            :label-col="{ xs: 8, md: 10, xxl: 8}"
            :wrapper-col="{ xs: 16, md: 14, xxl: 16}"
            ref="casePage"
            :model="casePageSearchForm"
            :rules="casePageSearchRules"
            class="casePage"
          >
            <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]">
              <!-- 電訪項目 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item>
                  <span slot="label">{{$t('case_search_taskItem')}}</span>
                  <a-select
                    class="select"
                    mode="multiple"
                    v-model="casePageSearchForm.taskItems"
                    :allowClear="true"
                    :filter-option="filterOption"
                    :options="selectTaskItemsOptions"
                    :placeholder="$t('global_all')"
                  >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- 要保人ID -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="pherId"
                  :has-feedback="casePageSearchValidateForm.pherId.feedback"
                  :validateStatus="casePageSearchValidateForm.pherId.state"
                >
                  <span slot="label">{{$t('case_search_pherId')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.pherId.msg"
                    :trigger="casePageSearchValidateForm.pherId.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.pherId"
                      :maxLength="10"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!-- 應電訪日 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-row>
                  <a-form-model-item>
                    <span slot="label">{{$t('case_search_dueContactDate')}}</span>
                    <a-row type="flex" class="datePicker__interval">
                      <a-form-model-item
                        prop="dueContactStartDate"
                        :has-feedback="casePageSearchValidateForm.dueContactStartDate.feedback"
                        :validateStatus="casePageSearchValidateForm.dueContactStartDate.state"
                      >
                        <a-popover
                          placement="top"
                          :content="casePageSearchValidateForm.dueContactStartDate.msg"
                          :trigger="casePageSearchValidateForm.dueContactStartDate.hover"
                          :visible="isDueContactStartVisible"
                          :destroyTooltipOnHide="true"
                        >
                          <DatePicker
                            :formatter="formatter"
                            @change="onDueContractStartChange"
                            v-model="casePageSearchForm.dueContactStartDate"
                            @clear="clearDueContractStartDate"
                          >
                            <!-- 請選擇日期(起) -->
                            <a-input
                              slot="input"
                              @pressEnter="checkManualInputDueContractStartDate"
                              :value="casePageSearchForm.dueContactStartString"
                              @mouseover="eventMouseOverDueContractStart"
                              @mouseleave="isDueContactStartVisible = false"
                            />
                          </DatePicker>
                        </a-popover>
                      </a-form-model-item>
                      <span class="interval__symbol">~</span>
                      <a-form-model-item
                        prop="dueContactEndDate"
                        :has-feedback="casePageSearchValidateForm.dueContactEndDate.feedback"
                        :validateStatus="casePageSearchValidateForm.dueContactEndDate.state"
                      >
                        <a-popover
                          placement="top"
                          :content="casePageSearchValidateForm.dueContactEndDate.msg"
                          :trigger="casePageSearchValidateForm.dueContactEndDate.hover"
                          :visible="isDueContactEndVisible"
                          :destroyTooltipOnHide="true"
                        >
                          <DatePicker
                            :formatter="formatter"
                            @change="onDueContractEndChange"
                            v-model="casePageSearchForm.dueContactEndDate"
                            @clear="clearDueContractEndDate"
                          >
                            <!-- 請選擇日期(迄) -->
                            <a-input
                              slot="input"
                              @pressEnter="checkManualInputDueContractEndDate"
                              :value="casePageSearchForm.dueContactEndString"
                              @mouseover="eventMouseOverDueContractEnd"
                              @mouseleave="isDueContactEndVisible = false"
                            />
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
                  <span slot="label">{{$t('case_search_casePolicy')}}</span>
                  <a-row type="flex" :gutter="[5]">
                    <a-col :span="12" :gutter="15">
                      <a-form-model-item prop="policyNo01"
                        :has-feedback="false"
                        validateStatus="success">
                        <a-popover
                          placement="top"
                          :content="casePageSearchValidateForm.policyNo01.msg"
                          :trigger="casePageSearchValidateForm.policyNo01.hover"
                        >
                          <a-input
                            type="text"
                            :maxLength="10"
                            v-model="casePageSearchForm.policyNo01"
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
                        :has-feedback="casePageSearchValidateForm.policyNo02.feedback"
                        :validateStatus="casePageSearchValidateForm.policyNo02.state"
                      >
                        <a-popover
                            placement="top"
                            :content="casePageSearchValidateForm.policyNo02.msg"
                            :trigger="casePageSearchValidateForm.policyNo02.hover"
                          >
                            <a-input
                              type="text"
                              :maxLength="2"
                              v-model="casePageSearchForm.policyNo02"
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
                        :has-feedback="casePageSearchValidateForm.policyNo03.feedback"
                        :validateStatus="casePageSearchValidateForm.policyNo03.state"
                      >
                        <a-popover
                          placement="top"
                          :content="casePageSearchValidateForm.policyNo03.msg"
                          :trigger="casePageSearchValidateForm.policyNo03.hover"
                        >
                          <a-input
                            type="text"
                            :maxLength="1"
                            v-model="casePageSearchForm.policyNo03"
                          />
                        </a-popover>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </a-col>
              <!-- 要保人姓名 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="pherName"
                  :has-feedback="casePageSearchValidateForm.pherName.feedback"
                  :validateStatus="casePageSearchValidateForm.pherName.state"
                >
                  <span slot="label">{{$t('case_search_pherName')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.pherName.msg"
                    :trigger="casePageSearchValidateForm.pherName.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.pherName"
                    ></a-input>
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!-- 匯入日期 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-row>
                  <a-form-model-item>
                    <span slot="label">{{$t('case_search_importDate')}}</span>
                    <a-row type="flex" class="datePicker__interval">
                      <a-form-model-item
                        prop="importStartDate"
                        :has-feedback="casePageSearchValidateForm.importStartDate.feedback"
                        :validateStatus="casePageSearchValidateForm.importStartDate.state"
                      >
                        <a-popover
                          placement="top"
                          :content="casePageSearchValidateForm.importStartDate.msg"
                          :trigger="casePageSearchValidateForm.importStartDate.hover"
                          :visible="isImportDateStartVisible"
                          :destroyTooltipOnHide="true"
                        >
                          <DatePicker
                            :formatter="formatter"
                            @change="onImportStartChange"
                            v-model="casePageSearchForm.importStartDate"
                            @clear="clearImportStartDate"
                            :clearable="true"
                          >
                            <!-- 請選擇日期(起) -->
                            <a-input
                              slot="input"
                              @pressEnter="checkManualInputImportStartDate"
                              :value="casePageSearchForm.importStartString"
                              @mouseover="eventMouseOverImportStart"
                              @mouseleave="isImportDateStartVisible = false"
                            />
                          </DatePicker>
                        </a-popover>
                      </a-form-model-item>
                      <span class="interval__symbol">~</span>
                      <a-form-model-item
                        prop="importEndDate"
                        :has-feedback="casePageSearchValidateForm.importEndDate.feedback"
                        :validateStatus="casePageSearchValidateForm.importEndDate.state"
                      >
                        <a-popover
                          placement="top"
                          :content="casePageSearchValidateForm.importEndDate.msg"
                          :trigger="casePageSearchValidateForm.importEndDate.hover"
                          :visible="isImportDateEndVisible"
                          :destroyTooltipOnHide="true"
                        >
                          <DatePicker
                            :formatter="formatter"
                            @change="onImportEndChange"
                            v-model="casePageSearchForm.importEndDate"
                            @clear="clearImportEndDate"
                            :clearable="true"
                          >
                            <!-- 請選擇日期(迄) -->
                            <a-input
                              slot="input"
                              @pressEnter="checkManualInputImportEndDate"
                              :value="casePageSearchForm.importEndString"
                              @mouseover="eventMouseOverImportEnd"
                              @mouseleave="isImportDateEndVisible = false"
                            />
                          </DatePicker>
                        </a-popover>
                      </a-form-model-item>
                    </a-row>
                  </a-form-model-item>
                </a-row>
              </a-col>
              <!-- 名單序號 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="packNo"
                  :has-feedback="casePageSearchValidateForm.packNo.feedback"
                  :validateStatus="casePageSearchValidateForm.packNo.state"
                >
                  <span slot="label">{{$t('case_search_packNo')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.packNo.msg"
                    :trigger="casePageSearchValidateForm.packNo.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.packNo"
                      :maxLength="20"
                    ></a-input>
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!-- 被保險人ID -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="insuredId"
                  :has-feedback="casePageSearchValidateForm.insuredId.feedback"
                  :validateStatus="casePageSearchValidateForm.insuredId.state"
                >
                  <span slot="label">{{$t('case_search_insuredId')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.insuredId.msg"
                    :trigger="casePageSearchValidateForm.insuredId.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.insuredId"
                      :maxLength="10"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!--部門別 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item>
                  <span slot="label">{{$t('case_search_dept')}}</span>
                  <a-select
                    class="select"
                    mode="multiple"
                    v-model="casePageSearchForm.departmentIdList"
                    :allowClear="true"
                    :options="selectDeptOptions"
                    @change="onSelectDept"
                    :placeholder="$t('global_all')"
                  >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- 受理案號 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="changeNo"
                  :has-feedback="casePageSearchValidateForm.changeNo.feedback"
                  :validateStatus="casePageSearchValidateForm.changeNo.state"
                >
                  <span slot="label">{{$t('case_search_changeNo')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.changeNo.msg"
                    :trigger="casePageSearchValidateForm.changeNo.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.changeNo"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!-- 被保險人姓名 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="insuredName"
                  :has-feedback="casePageSearchValidateForm.insuredName.feedback"
                  :validateStatus="casePageSearchValidateForm.insuredName.state"
                >
                  <span slot="label">{{$t('case_search_insuredName')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.insuredName.msg"
                    :trigger="casePageSearchValidateForm.insuredName.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.insuredName"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!-- 科別 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item>
                  <span slot="label">{{$t('case_search_division')}}</span>
                  <a-select
                    class="select"
                    mode="multiple"
                    v-model="casePageSearchForm.divisionIdList"
                    :allowClear="true"
                    :options="selectDiviOptions"
                    @change="onSeletDivi"
                    :placeholder="$t('global_all')"
                  >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- 受訪者ID -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="custId"
                  :has-feedback="casePageSearchValidateForm.custId.feedback"
                  :validateStatus="casePageSearchValidateForm.custId.state"
                >
                  <span slot="label">{{$t('case_search_custId')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.custId.msg"
                    :trigger="casePageSearchValidateForm.custId.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.custId"
                      :maxLength="10"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!-- 業務員ID -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="agentId"
                  :has-feedback="casePageSearchValidateForm.agentId.feedback"
                  :validateStatus="casePageSearchValidateForm.agentId.state"
                >
                  <span slot="label">{{$t('case_search_agentId')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.agentId.msg"
                    :trigger="casePageSearchValidateForm.agentId.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.agentId"
                      :maxLength="10"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!-- 電訪員 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item>
                  <span slot="label">{{$t('case_search_tmr')}}</span>
                  <a-select
                    class="select"
                    mode="multiple"
                    v-model="casePageSearchForm.tmrIdList"
                    :filter-option="filterOption"
                    :allowClear="true"
                    :options="selectTmrOptions"
                    :placeholder="$t('global_all')"
                  >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- 受訪者姓名 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="custName"
                  :has-feedback="casePageSearchValidateForm.custName.feedback"
                  :validateStatus="casePageSearchValidateForm.custName.state"
                >
                  <span slot="label">{{$t('case_search_custName')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.custName.msg"
                    :trigger="casePageSearchValidateForm.custName.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.custName"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <!-- 業務員姓名 -->
              <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                <a-form-model-item
                  prop="agentName"
                  :has-feedback="casePageSearchValidateForm.agentName.feedback"
                  :validateStatus="casePageSearchValidateForm.agentName.state"
                >
                  <span slot="label">{{$t('case_search_agentName')}}</span>
                  <a-popover
                    placement="top"
                    :content="casePageSearchValidateForm.agentName.msg"
                    :trigger="casePageSearchValidateForm.agentName.hover"
                  >
                    <a-input
                      type="text"
                      v-model="casePageSearchForm.agentName"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
            </a-row>
            <div>
              <a-row type="flex" justify="center" align="middle" class="searchBar">
                <!-- 查詢 -->
                <a-button v-if="authComponent.CASESEARCH_SEARCH.show" type="primary" @click="searchCasePage">{{ $t("global_search") }}</a-button>
                <!-- 清除 -->
                <a-button v-if="authComponent.CASESEARCH_SEARCH.show" type="default" @click="resetCasePageSearchForm">{{ $t("global_clean") }}</a-button>
                <a-divider v-if="authComponent.CASESEARCH_EXPORT.show" type="vertical"></a-divider>
                <!-- 匯出 -->
                <a-button v-if="authComponent.CASESEARCH_EXPORT.show" class="ml-auto" type="primary" @click="exportSearchResult">{{ $t("global_export") }}</a-button>
              </a-row>
            </div>
          </a-form-model>
        </template>
      </HiddenFolde>
    </div>
    
    <!-- 不需要 -->
    <!-- <a-row class="dataNumBar"> -->
      <!-- 電訪案件 X 筆 -->
      <!-- 保單：{{ 4 }} {{ '筆' }} <br /> -->
      <!-- 名單 X　筆 -->
      <!-- 名單：{{ 4 }} {{ '筆' }} -->
    <!-- </a-row> -->

    <div class="fbl-table">
      <FblDataGrid
        :rowKey="caseSearchPageGrid.rowKey"
        :columns="caseSearchPageGrid.columns"
        :data="caseSearchPageGrid.data"
        :pagination="caseSearchPageGrid.pagination"
        :scroll="caseSearchPageGrid.scroll"
        size="middle"
        @tableChange="onPageChange($event)"
        @handleEllipsisClick="handleEllipsisClick"
        @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        ref="CaseSearchGrid"
      >
        <!-- 點擊客戶id -->
        <template v-slot:alink_custId_Template="slotProps">
          <a @click="clickLinkCustId(slotProps.data)">{{slotProps.data.custId}}</a>
        </template>
        <!-- 點擊保單號碼 -->
        <template v-slot:alink_casePolicy_Template="slotProps">
          <a @click="clickLinkCasePolicy(slotProps.data)">{{slotProps.data.casePolicy}}</a>
        </template>
        <!-- 點擊撥號歷程 -->
        <template v-slot:alink_haveCallUpHis_Template="slotProps">
          <a  v-if="slotProps.data.haveCallUpHis=='Y'" @click="clickLinkHaveCallUpHis(slotProps.data)">{{slotProps.data.haveCallUpHis}}</a>
          <span v-if="slotProps.data.haveCallUpHis=='N'">{{slotProps.data.haveCallUpHis}}</span>
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
        <!-- 點擊檔案上傳 -->
        <template v-slot:alink_haveFileUp_Template="slotProps">
          <a  v-if="slotProps.data.haveFileUp=='Y'" @click="clickLinkFileUp(slotProps.data)">{{slotProps.data.haveFileUp}}</a>
          <span v-if="slotProps.data.haveFileUp=='N'">{{slotProps.data.haveFileUp}}</span>
        </template>
        <!-- 點擊通話內容 -->
        <template v-slot:alink_haveCustAns_Template="slotProps">
          <a  v-if="slotProps.data.haveCustAns=='Y'" @click="clickLinkHaveCustAns(slotProps.data)">{{slotProps.data.haveCustAns}}</a>
          <span v-if="slotProps.data.haveCustAns=='N'">{{slotProps.data.haveCustAns}}</span>
        </template>
      </FblDataGrid>
    </div>
    
    <!-- 案件歷程Modal -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseSearchPageGridModal.isShowCaseHistory"
      :title="$t('case_search_caseHistory')"
      :closable="true"
      :visibleFooter="false"
      :destroyOnClose="true"
      :isMasked="false"
      @cancel="onCloseModal('isShowCaseHistory')"
      width="2000px"
    >
      <CaseHistoryForm
        :caseHistoryParam="caseHistoryParam"
      ></CaseHistoryForm>
    </DragModal>
    <!-- 會辦紀錄  -->
     <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseSearchPageGridModal.infReocrdvisible"
      :title="$t('serveConHis_informExist')" 
      width="80%"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="caseSearchPageGridModal.infReocrdvisible=false;"
    >
      <HandleInfoForm 
        :data="handleInfoData" 
        @getVisible="getInfReocrdvisible"
      ></HandleInfoForm>
      <!-- <InfRecord
      :caseNo="caseHistoryParam.caseNo"
      > 
      </InfRecord> -->
    </DragModal>

    <!-- Email紀錄 -->
     <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseSearchPageGridModal.onMailRecordVisible"
      :title="$t('email_records')"
      width="80%"
      :cancelText="$t('global_leave')"
      :okText="$t('global_save')"
      :footer="null"
      :isMasked="false"
      :destroyOnClose="true"
      :v-once="false"
      :visibleFooter="false"
      @cancel="caseSearchPageGridModal.onMailRecordVisible = false"
      >
        <MailRecord
        :caseNo="mailHistoryParam.caseNo">
        </MailRecord>
  </DragModal>

      
       <DragModal
       class="c-section c-section--else pointer-events-none"
      :visible="caseSearchPageGridModal.infMplusSendMessageVisible"
      :title="$t('MplusSendMessageRecords')" 
      width="60%"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="caseSearchPageGridModal.infMplusSendMessageVisible=false;"
    >
  
      <MPlusHistory
      :caseNo="mailHistoryParam.caseNo"
      
      > 
      </MPlusHistory>
    </DragModal>

  <DragModal
    class="c-section c-section--else pointer-events-none"
    :visible="caseSearchPageGridModal.isQuestionAnswerVisible"
    :title="$t('case_search_grid_haveCustAns')"
    width="80%"
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

    <!-- 檔案上傳歷程 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="showUploadFileHistory"
      :title="$t('serveConHis_fileUploadHistory')"
      width="45%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      @cancel="showUploadFileHistory = false"
      :removeCancelButton="true"
      :isMasked="false"
    >
      <UploadFileHistroy
        ref="uploadFileHistroy"
        :caseNo="caseNo"
        :caseLogid="caseLogid"
      />
      <template slot="footer">
        <a-button
          type="primary"
          @click="showUploadFileHistory = !showUploadFileHistory"
        >
          {{ $t("onDutyPage_close") }}
        </a-button>
      </template>
    </DragModal>

    <!-- 撥號歷程 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseSearchPageGridModal.isCallUpHistoryVisible"
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
      :visible="caseSearchPageGridModal.isPostRecordVisible"
      :title="$t('postRecords')"
      width="80%"
      :cancelText="$t('global_leave')"
      :okText="$t('global_save')"
      :footer="null"
      :isMasked="false"
      :destroyOnClose="true"
      :v-once="false"
      :visibleFooter="false"
      @cancel="caseSearchPageGridModal.isPostRecordVisible = false"
      >
        <PostRecord
          :caseLogId="postRecordParam.caseLogId"
          :caseId="postRecordParam.caseNo">
        </PostRecord>
  </DragModal>

    <!-- 照會紀錄 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="caseSearchPageGridModal.notiReocrdvisible"
      :title="$t('handleInfoForm_notiRecord')"
      width="80%"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="caseSearchPageGridModal.notiReocrdvisible=false;"
    >
      <HandleInfoForm 
        :data="handleInfoData" 
        @getVisible="getNotuReocrdvisible"
      />
    </DragModal>
  </div>
</template>

<script src="./CaseSearchPage.ts" lang="ts"></script>

<style lang="less" scoped>
  .casePage {
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

  .dataNumBar {
    margin: 0 30px;
  }

  .fbl-table {
    padding-left: 24px;
    padding-right: 12px;
    margin: 10px 0;
  }
</style>
