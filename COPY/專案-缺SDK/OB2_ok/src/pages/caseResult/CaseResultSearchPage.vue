<template>
    <div tabindex="-1" @keyup.enter="searchCaseResultPage">
        <div v-if="checkIsHiddenFoldeShow()">
            <HiddenFolde>
                <template v-slot:hiddenArea>
                    <a-form-model
                        :label-col="{ xs: 8, md: 10, xxl: 8}"
                        :wrapper-col="{ xs: 16, md: 14, xxl: 16}"
                        ref="casePage"
                        :model="caseResultPageSearchForm"
                        :rules="caseResultPageSearchRules"
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
                                        v-model="caseResultPageSearchForm.taskIds"
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
                                :has-feedback="caseResultPageSearchValidateForm.pherId.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.pherId.state"
                                >
                                <span slot="label">{{$t('case_search_pherId')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.pherId.msg"
                                    :trigger="caseResultPageSearchValidateForm.pherId.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.pherId"
                                    :maxLength="10"
                                    />
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
                                        :has-feedback="caseResultPageSearchValidateForm.importStartDate.feedback"
                                        :validateStatus="caseResultPageSearchValidateForm.importStartDate.state"
                                    >
                                        <a-popover
                                        placement="top"
                                        :content="caseResultPageSearchValidateForm.importStartDate.msg"
                                        :trigger="caseResultPageSearchValidateForm.importStartDate.hover"
                                        :visible="isImportDateStartVisible"
                                        :destroyTooltipOnHide="true"
                                        >
                                        <DatePicker
                                            :formatter="formatter"
                                            @change="onImportStartChange"
                                            v-model="caseResultPageSearchForm.importStartDate" 
                                            @clear="clearImportStartDate"
                                            :clearable="true"
                                        >
                                            <!-- 請選擇日期(起) -->
                                            <a-input
                                            slot="input"
                                            @pressEnter="checkManualInputImportStartDate"
                                            :value="caseResultPageSearchForm.importStartString"
                                            @mouseover="eventMouseOverImportStart"
                                            @mouseleave="isImportDateStartVisible = false"
                                            />
                                        </DatePicker>
                                        </a-popover>
                                    </a-form-model-item>
                                    <span class="interval__symbol">~</span>
                                    <a-form-model-item
                                        prop="importEndDate"
                                        :has-feedback="caseResultPageSearchValidateForm.importEndDate.feedback"
                                        :validateStatus="caseResultPageSearchValidateForm.importEndDate.state"
                                    >
                                        <a-popover
                                        placement="top"
                                        :content="caseResultPageSearchValidateForm.importEndDate.msg"
                                        :trigger="caseResultPageSearchValidateForm.importEndDate.hover"
                                        :visible="isImportDateEndVisible"
                                        :destroyTooltipOnHide="true"
                                        >
                                        <DatePicker
                                            :formatter="formatter"
                                            @change="onImportEndChange"
                                            v-model="caseResultPageSearchForm.importEndDate"
                                            @clear="clearImportEndDate"
                                            :clearable="true"
                                        >
                                            <!-- 請選擇日期(迄) -->
                                            <a-input
                                            slot="input"
                                            @pressEnter="checkManualInputImportEndDate"
                                            :value="caseResultPageSearchForm.importEndString"
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
                                            :content="caseResultPageSearchValidateForm.policyNo01.msg"
                                            :trigger="caseResultPageSearchValidateForm.policyNo01.hover"
                                            >
                                            <a-input
                                                type="text"
                                                :maxLength="10"
                                                v-model="caseResultPageSearchForm.policyNo01"
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
                                            :has-feedback="caseResultPageSearchValidateForm.policyNo02.feedback"
                                            :validateStatus="caseResultPageSearchValidateForm.policyNo02.state"
                                        >
                                            <a-popover
                                                placement="top"
                                                :content="caseResultPageSearchValidateForm.policyNo02.msg"
                                                :trigger="caseResultPageSearchValidateForm.policyNo02.hover"
                                            >
                                                <a-input
                                                type="text"
                                                :maxLength="2"
                                                v-model="caseResultPageSearchForm.policyNo02"
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
                                        :has-feedback="caseResultPageSearchValidateForm.policyNo03.feedback"
                                        :validateStatus="caseResultPageSearchValidateForm.policyNo03.state"
                                    >
                                        <a-popover
                                        placement="top"
                                        :content="caseResultPageSearchValidateForm.policyNo03.msg"
                                        :trigger="caseResultPageSearchValidateForm.policyNo03.hover"
                                        >
                                        <a-input
                                            type="text"
                                            :maxLength="1"
                                            v-model="caseResultPageSearchForm.policyNo03"
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
                                :has-feedback="caseResultPageSearchValidateForm.pherName.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.pherName.state"
                                >
                                <span slot="label">{{$t('case_search_pherName')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.pherName.msg"
                                    :trigger="caseResultPageSearchValidateForm.pherName.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.pherName"
                                    ></a-input>
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
                                        :has-feedback="caseResultPageSearchValidateForm.dueContactStartDate.feedback"
                                        :validateStatus="caseResultPageSearchValidateForm.dueContactStartDate.state"
                                    >
                                        <a-popover
                                        placement="top"
                                        :content="caseResultPageSearchValidateForm.dueContactStartDate.msg"
                                        :trigger="caseResultPageSearchValidateForm.dueContactStartDate.hover"
                                        :visible="isDueContactStartVisible"
                                        :destroyTooltipOnHide="true"
                                        >
                                        <DatePicker
                                            :formatter="formatter"
                                            @change="onDueContractStartChange"
                                            v-model="caseResultPageSearchForm.dueContactStartDate"
                                            @clear="clearDueContractStartDate"
                                        >
                                            <!-- 請選擇日期(起) -->
                                            <a-input
                                            slot="input"
                                            @pressEnter="checkManualInputDueContractStartDate"
                                            :value="caseResultPageSearchForm.dueContactStartString"
                                            @mouseover="eventMouseOverDueContractStart"
                                            @mouseleave="isDueContactStartVisible = false"
                                            />
                                        </DatePicker>
                                        </a-popover>
                                    </a-form-model-item>
                                    <span class="interval__symbol">~</span>
                                    <a-form-model-item
                                        prop="dueContactEndDate"
                                        :has-feedback="caseResultPageSearchValidateForm.dueContactEndDate.feedback"
                                        :validateStatus="caseResultPageSearchValidateForm.dueContactEndDate.state"
                                    >
                                        <a-popover
                                        placement="top"
                                        :content="caseResultPageSearchValidateForm.dueContactEndDate.msg"
                                        :trigger="caseResultPageSearchValidateForm.dueContactEndDate.hover"
                                        :visible="isDueContactEndVisible"
                                        :destroyTooltipOnHide="true"
                                        >
                                        <DatePicker
                                            :formatter="formatter"
                                            @change="onDueContractEndChange"
                                            v-model="caseResultPageSearchForm.dueContactEndDate"
                                            @clear="clearDueContractEndDate"
                                        >
                                            <!-- 請選擇日期(迄) -->
                                            <a-input
                                            slot="input"
                                            @pressEnter="checkManualInputDueContractEndDate"
                                            :value="caseResultPageSearchForm.dueContactEndString"
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
                            <!-- 名單序號 -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="packNo"
                                :has-feedback="caseResultPageSearchValidateForm.packNo.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.packNo.state"
                                >
                                <span slot="label">{{$t('case_search_packNo')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.packNo.msg"
                                    :trigger="caseResultPageSearchValidateForm.packNo.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.packNo"
                                    :maxLength="20"
                                    ></a-input>
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 被保險人ID -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="insuredId"
                                :has-feedback="caseResultPageSearchValidateForm.insuredId.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.insuredId.state"
                                >
                                <span slot="label">{{$t('case_search_insuredId')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.insuredId.msg"
                                    :trigger="caseResultPageSearchValidateForm.insuredId.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.insuredId"
                                    :maxLength="10"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 結案日期 -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-row>
                                <a-form-model-item>
                                    <span slot="label">{{$t('case_search_closeDate')}}</span>
                                    <a-row type="flex" class="datePicker__interval">
                                    <a-form-model-item
                                        prop="closeStartDate"
                                        :has-feedback="caseResultPageSearchValidateForm.closeStartDate.feedback"
                                        :validateStatus="caseResultPageSearchValidateForm.closeStartDate.state"
                                    >
                                        <a-popover
                                        placement="top"
                                        :content="caseResultPageSearchValidateForm.closeStartDate.msg"
                                        :trigger="caseResultPageSearchValidateForm.closeStartDate.hover"
                                        :visible="isCloseDateStartVisible"
                                        :destroyTooltipOnHide="true"
                                        >
                                        <DatePicker
                                            :formatter="formatter"
                                            @change="onCloseStartChange"
                                            v-model="caseResultPageSearchForm.closeStartDate"
                                            @clear="clearCloseStartDate"
                                            :clearable="true"
                                        >
                                            <!-- 請選擇日期(起) -->
                                            <a-input
                                            slot="input"
                                            @pressEnter="checkManualInputCloseStartDate"
                                            :value="caseResultPageSearchForm.closeStartString"
                                            @mouseover="eventMouseOverCloseStart"
                                            @mouseleave="isCloseDateStartVisible = false"
                                            />
                                        </DatePicker>
                                        </a-popover>
                                    </a-form-model-item>
                                    <span class="interval__symbol">~</span>
                                    <a-form-model-item
                                        prop="closeEndDate"
                                        :has-feedback="caseResultPageSearchValidateForm.closeEndDate.feedback"
                                        :validateStatus="caseResultPageSearchValidateForm.closeEndDate.state"
                                    >
                                        <a-popover
                                        placement="top"
                                        :content="caseResultPageSearchValidateForm.closeEndDate.msg"
                                        :trigger="caseResultPageSearchValidateForm.closeEndDate.hover"
                                        :visible="isCloseDateEndVisible"
                                        :destroyTooltipOnHide="true"
                                        >
                                        <DatePicker
                                            :formatter="formatter"
                                            @change="onCloseEndChange"
                                            v-model="caseResultPageSearchForm.closeEndDate"
                                            @clear="clearCloseEndDate"
                                            :clearable="true"
                                        >
                                            <!-- 請選擇日期(迄) -->
                                            <a-input
                                            slot="input"
                                            @pressEnter="checkManualInputCloseEndDate"
                                            :value="caseResultPageSearchForm.closeEndString"
                                            @mouseover="eventMouseOverCloseEnd"
                                            @mouseleave="isCloseDateEndVisible = false"
                                            />
                                        </DatePicker>
                                        </a-popover>
                                    </a-form-model-item>
                                    </a-row>
                                </a-form-model-item>
                                </a-row>
                            </a-col>
                            <!-- 受理案號 -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="changeNo"
                                :has-feedback="caseResultPageSearchValidateForm.changeNo.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.changeNo.state"
                                >
                                <span slot="label">{{$t('case_search_changeNo')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.changeNo.msg"
                                    :trigger="caseResultPageSearchValidateForm.changeNo.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.changeNo"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 被保險人姓名 -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="insuredName"
                                :has-feedback="caseResultPageSearchValidateForm.insuredName.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.insuredName.state"
                                >
                                <span slot="label">{{$t('case_search_insuredName')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.insuredName.msg"
                                    :trigger="caseResultPageSearchValidateForm.insuredName.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.insuName"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!--承辦人員單位代碼 --><!--借用riskControl_policyProcessUnitNo-------------------------->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item>
                                <span slot="label">{{$t('riskControl_policyProcessUnitNo')}}</span> 
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.processUnit.msg" 
                                    :trigger="caseResultPageSearchValidateForm.processUnit.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.processUnit"
                                    :maxLength="10"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 受訪者ID -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="custId"
                                :has-feedback="caseResultPageSearchValidateForm.custId.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.custId.state"
                                >
                                <span slot="label">{{$t('case_search_custId')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.custId.msg"
                                    :trigger="caseResultPageSearchValidateForm.custId.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.custId"
                                    :maxLength="10"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 業務員ID -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="agentId"
                                :has-feedback="caseResultPageSearchValidateForm.agentId.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.agentId.state"
                                >
                                <span slot="label">{{$t('case_search_agentId')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.agentId.msg"
                                    :trigger="caseResultPageSearchValidateForm.agentId.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.agentId"
                                    :maxLength="10"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 承辦人員ID --><!--待新增--------------------------------------->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="agentId"
                                :has-feedback="caseResultPageSearchValidateForm.processId.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.processId.state"
                                >
                                <span slot="label">{{$t('case_result_grid_process_id')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.processId.msg" 
                                    :trigger="caseResultPageSearchValidateForm.processId.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.processId"
                                    :maxLength="10"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 受訪者姓名 -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="custName"
                                :has-feedback="caseResultPageSearchValidateForm.custName.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.custName.state"
                                >
                                <span slot="label">{{$t('case_search_custName')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.custName.msg"
                                    :trigger="caseResultPageSearchValidateForm.custName.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.custName"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 業務員姓名 -->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item
                                prop="agentName"
                                :has-feedback="caseResultPageSearchValidateForm.agentName.feedback"
                                :validateStatus="caseResultPageSearchValidateForm.agentName.state"
                                >
                                <span slot="label">{{$t('case_search_agentName')}}</span>
                                <a-popover
                                    placement="top"
                                    :content="caseResultPageSearchValidateForm.agentName.msg"
                                    :trigger="caseResultPageSearchValidateForm.agentName.hover"
                                >
                                    <a-input
                                    type="text"
                                    v-model="caseResultPageSearchForm.agentName"
                                    />
                                </a-popover>
                                </a-form-model-item>
                            </a-col>
                            <!-- 業務員單位代碼 --><!--待新增--------------------------------------->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item>
                                <span slot="label">{{$t('case_result_grid_agentUnit_No')}}</span>
                                <a-input
                                    v-model="caseResultPageSearchForm.agentUnitNo"
                                ><!--:options="selectTmrOptions"-->
                                </a-input>
                                </a-form-model-item>
                            </a-col>
                            <!-- 結案狀態 --><!--待新增--------------------------------------->
                            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                                <a-form-model-item>
                                <span slot="label">{{$t('handleInfoForm_flagClsDes')}}</span>
                                <a-select
                                    
                                    class="select"
                                    mode="single"
                                    v-model="caseResultPageSearchForm.caseCloseReasonCode"
                                    :filter-option="filterOption"
                                    :allowClear="true"
                                    :options="selectCRCOptions"
                                    :placeholder="$t('global_all')"
                                >
                                </a-select>
                                </a-form-model-item>
                            </a-col>

                        </a-row>
                        <div>
                            <a-row type="flex" justify="center" align="middle" class="searchBar">
                                <!-- 查詢 v-if="authComponent.CASESEARCH_SEARCH.show"-->
                                <a-button  type="primary" @click="searchCasePage">{{ $t("global_search") }}</a-button>
                                <!-- 清除 v-if="authComponent.CASESEARCH_SEARCH.show"-->
                                <a-button  type="default" @click="resetCasePageSearchForm">{{ $t("global_clean") }}</a-button>
                                <a-divider v-if="authComponent.CASESEARCH_EXPORT.show" type="vertical"></a-divider>
                                
                            </a-row>
                        </div>
                    </a-form-model>
                </template>
            </HiddenFolde>
        </div>

        <div class="fbl-table">
            <FblDataGrid
                :rowKey="caseResultSearchPageGrid.rowKey"
                :columns="caseResultSearchPageGrid.columns"
                :data="caseResultSearchPageGrid.data"
                :pagination="caseResultSearchPageGrid.pagination"
                :scroll="caseResultSearchPageGrid.scroll"
                size="middle"
                @tableChange="onPageChange($event)"
                @handleEllipsisClick="handleEllipsisClick"
                @handleEllipsisMouseLeave="handleEllipsisMouseLeave"              
                ref="CaseResultSearchGrid"
            ><!--富邦包裹的套件可以直接使用，要在script區塊套用設定FblPDataGridHolder-->
            
            <!--客製化欄位(ts頁面中columns集合中所綁定的模板放這-->
            <template v-slot:exportPDF="slotProps">
                <a-button @click="exportPDF(slotProps.data.caseNo)">
                    列印
                </a-button>
            </template>

            </FblDataGrid>
        </div>
        <a-modal id="">

        </a-modal>
        
    
    </div>
    
    
</template>

<script src="./CaseResultSearchPage.ts" lang="ts"></script>

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