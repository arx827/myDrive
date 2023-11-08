<template>
    <div>
        <div class="section-card section__basic">
            <div class="card__title-position">
                <!-- 照會單資訊 -->
                <span class="card__title">{{$t('notificationReply_notiInfo')}}</span>
            </div>
            <div class="card__infomation">
                <a-row type="flex" justify="end">
                    <a-col :xs="24" :md="12" :xl="6" :xxl="3">
                        <!-- 照會單下載 -->
                        <a-button type="primary" @click="handleDownload(notiOpenFile)">{{$t('notificationReply_notiFileDownload')}}</a-button>
                    </a-col>
                </a-row>
                <a-row type="flex" justify="end">
                    <a-col :xs="24" :md="12" :xl="6" :xxl="3">
                        <!-- 照會日期 -->
                        <span>{{$t('case_search_grid_notiDate')}} : {{ notiPdfInfo.notificationDateString }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex" justify="end">
                    <a-col :xs="24" :md="12" :xl="6" :xxl="3">
                        <!-- 照會單號 -->
                        <span>{{$t('notificationBasic_notiInfoId')}} : {{ notiPdfInfo.notiInfoId }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex" justify="end">
                    <a-col :xs="24" :md="12" :xl="6" :xxl="3">
                        <!-- 照會次數 -->
                        <span>{{$t('notificationBasic_notiCount')}} : {{ notiPdfInfo.notiCount }} 
                            <span style="color:red;">{{ notiPdfInfo.isContText }}</span>
                            <span v-if="notiReplyForm.reminder" style="color:red;margin-left:20px;">{{ '(' + notiPdfInfo.reminderText + ')' }}</span>
                        </span>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 招攬單位 -->
                        <span>{{$t('notificationBasic_agentUnitName')}} : {{ notiPdfInfo.agentUnitInfo }}</span>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 保單號碼 -->
                        <span>{{$t('notificationReply_policyNo')}} : {{ notiPdfInfo.policyNo }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 業務員 -->
                        <span>{{$t('notificationBasic_agentName')}} : {{ notiPdfInfo.agentName }}</span>
                        <a-button 
                            class="callUpForm-callBtn ant-btn ant-btn-primary"
                            style="margin-left: 10px;"
                            :disabled="!notiPdfInfo.editCallUp"
                            @click="onDialClick">
                            <a-icon type="phone" theme="filled" />
                        </a-button>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 被保險人 -->
                        <span>{{$t('notificationBasic_insuName')}} : {{ notiPdfInfo.insuName }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12" v-if="notiPdfInfo.isBS == 'Y'">
                        <!-- 受理編號 -->
                        <span>{{$t('notificationReply_applyFormCaseNo')}} : {{ notiPdfInfo.applyFormCaseNo }}</span>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 要保人 -->
                        <span>{{$t('notificationBasic_pherName')}} : {{ notiPdfInfo.pherName }}</span>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12" v-if="notiPdfInfo.showCCAddress">
                        <!-- 照會副本 -->
                        <span>{{$t('notificationBasic_ccAddress')}} : {{ notiPdfInfo.ccAddress }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12" v-if="notiPdfInfo.isBS == 'Y'">
                        <!-- 代收區號 -->
                        <span>{{$t('notificationReply_areaNumber')}} : {{ notiPdfInfo.areaNumber }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex" style="margin-top:20px;">
                    <a-col>
                        <!-- 電訪照會事項如下，請 台端於 <#照會到期日期> 前處理，並連同照會單回覆所屬窗口處理結果，謝謝您的合作！ -->
                        <span>{{$t('notificationReply_notiInformWording', [notiPdfInfo.notiExpireDateString ])}}</span>
                    </a-col>
                </a-row>
                
                <a-divider class="dividerStyle" dashed />

                <a-row type="flex">
                    <a-col>
                        <!-- 主約險種/年期/保額 -->
                        <span>{{$t('notificationReply_insuranceCodeYearTypeAmt')}} : {{ notiPdfInfo.insuranceCode + ' / ' + notiPdfInfo.policyYear + ' / ' + notiPdfInfo.currencyTypeName +  notiPdfInfo.policyAmt }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 電訪項目 -->
                        <span>{{$t('notificationBasic_taskId')}} : {{ notiPdfInfo.taskName }}</span>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 首次電訪時間 -->
                        <span>{{$t('notificationReply_firstCallUpTime')}} : {{ notiPdfInfo.firstCallUpTimeString }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 電訪對象 -->
                        <span>{{$t('notificationReply_CallUpPerson')}} : {{ notiPdfInfo.custName }}</span>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="12" :xxl="12">
                        <!-- 電訪對象身份 -->
                        <span>{{$t('notificationReply_CallUpPersonType')}} : {{ notiPdfInfo.custType }}</span>
                    </a-col>
                </a-row>
                <a-row type="flex">
                    <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                        <!-- 聯絡電話1 -->
                        <span>{{$t('notificationReply_PhoneNumber', [1])}} : {{ notiPdfInfo.pherContTel }}</span>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                        <!-- 聯絡電話2 -->
                        <span>{{$t('notificationReply_PhoneNumber', [2])}} : {{ notiPdfInfo.pherContTel2 }}</span>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="8" :xxl="8">
                        <!-- 電話 -->
                        <span>{{$t('notificationCallUpAgentContactPerson_mob')}} : {{ notiPdfInfo.pherMob }}</span>
                    </a-col>
                </a-row>

                <a-divider class="dividerStyle" dashed />
                <div class="infomation__row row__third">
                    <!-- 《電訪照會事項》 -->
                    <div class="title">{{$t('notificationReply_NotiCallUpMatter')}}</div>
                    <div class="infoGroup">
                        <!-- 一、照會內容 -->
                        <p class="infoTitle">{{$t('notificationReply_NotiContent')}}</p>
                        <template v-for="notiContent in notiPdfInfo.notiContentInfoList">
                            <p :key="notiContent.index">{{ notiContent.index + '.' + notiContent.content }}</p>
                        </template>
                        <!-- 二、電訪內容  以下僅呈現保戶有疑義之題號及保戶回答-->
                        <p class="infoTitle">{{$t('notificationReply_NotiQuestAnswer')}}: ({{$t('notificationReply_onlyPresentDoubtfulQA')}})</p>

                        <FblDataGrid
                            :scroll="{ x: true }"
                            :row-key="gridData.rowKey"
                            :columns="gridData.columns"
                            :data="gridData.data"
                            :empty-data="gridData.data.length <= 0"
                            style="margin-top: 5px;"
                        ></FblDataGrid>

                    </div>
                </div>

                <a-row type="flex" style="margin-top:30px;">
                    <a-col :xs="24" :md="24" :xl="24" :xxl="24">
                        <!-- 照會單位 -->
                        <span >{{$t('notificationReply_notiUnit')}} : {{ notiPdfInfo.notiUnitInfo }}</span>
                    </a-col>
                </a-row>

            </div>
        </div>

        <div class="section-card section__reply">
            <div class="card__title-position">
                <!-- 照會回覆 -->
                <span class="card__title">{{$t('notificationReply_notiReply')}}</span>
            </div>
            <div class="card__infomation">
                <a-form-model
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                    :gutter="[{ xs: 10, xxl: 10 }, 0]"
                    :rules="notiReplyFormRules"
                    :model="notiReplyForm"
                    class="countersignatureModalFormPage"
                    labelAlign="right"
                >
                    <!-- 照會到期日 -->
                    <a-row type="flex" v-if="$props.isEdit">
                        <a-col span="4" class="ant-form-item-label" >
                            <label> {{$t('notificationReply_expireDate')}}</label>
                        </a-col>
                        <a-col span="20">
                            <a-row type="flex" :gutter="[10, 0]">
                                <a-col>
                                    <a-form-model-item
                                        label=""
                                        prop="notiExpireDate"
                                        class="contactDate"
                                        style="margin-bottom: 0px"
                                        :has-feedback="callCommonUtilFeild(notiReplyValidateForm.notiExpireDate).feedback"
                                        :validateStatus="callCommonUtilFeild(notiReplyValidateForm.notiExpireDate).state"
                                    >
                                        <a-popover
                                            placement="top"
                                            :content="callCommonUtilFeild(notiReplyValidateForm.notiExpireDate).msg"
                                            :trigger="callCommonUtilFeild(notiReplyValidateForm.notiExpireDate).hover"
                                            :visible="callCommonUtilFeild(notiReplyValidateForm.notiExpireDate).hoverVisible"
                                            @visibleChange="callCommonUtilFeildVisibleChange(notiReplyValidateForm.notiExpireDate)"
                                            :destroyTooltipOnHide="true"
                                        >
                                            <DatePicker
                                            :formatter="formatter"
                                            @change="onNotiExpireDateChange"
                                            v-model="notiReplyForm.expireDatePicker"
                                            :disabled-date="disabledDate"
                                            :clearable="false"
                                            style="width: 100%"
                                            >
                                                <a-input
                                                    slot="input"
                                                    @pressEnter="checkManualInputExpireDate"
                                                    :value="notiReplyForm.expireDateString"
                                                ></a-input>
                                                <i
                                                    v-if="notiReplyValidateForm.notiExpireDate.feedback"
                                                    slot="icon-calendar"
                                                ></i>
                                            </DatePicker>
                                        </a-popover>
                                    </a-form-model-item>
                                </a-col>
                                <a-col>
                                    <a-form-model-item>
                                        <!-- 修改照會到期日 -->
                                        <a-button type="primary" @click="saveExpireDate">{{$t('notificationReply_expireDateModify')}}</a-button>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 處理狀態 -->
                    <a-row type="flex">
                        <a-col flex="1">
                            <a-form-model-item 
                                :label="$t('infReplyForm_handleStatus')"
                                v-if="$props.isEdit"
                                required
                                :has-feedback="callCommonUtilFeild(notiReplyValidateForm.handleStatus).feedback"
                                :validateStatus="callCommonUtilFeild(notiReplyValidateForm.handleStatus).state"
                            >
                                <a-popover
                                    placement="top"
                                    :content="callCommonUtilFeild(notiReplyValidateForm.handleStatus).msg"
                                    :trigger="callCommonUtilFeild(notiReplyValidateForm.handleStatus).hover"
                                    :visible="callCommonUtilFeild(notiReplyValidateForm.handleStatus).hoverVisible"
                                    @visibleChange="callCommonUtilFeildVisibleChange(notiReplyValidateForm.handleStatus)"
                                    :destroyTooltipOnHide="true"
                                >
                                    <a-select
                                        class="select"
                                        style="width:40%"
                                        v-model="notiReplyForm.handleStatus"
                                        :options="handleStatusOptions"
                                        @change="onHandleStatusChange"
                                    />
                                </a-popover>
                                
                            </a-form-model-item>

                            <!-- 處理狀態 唯讀顯示 -->
                            <a-form-model-item v-else :label="$t('infReplyForm_handleStatus')">
                                <p>{{ notiReplyReadOnly.handleStatusDes }}</p>
                            </a-form-model-item>
                        </a-col>
                    </a-row>

                    <!-- 回覆內容 -->
                    <a-row type="flex">
                        <a-col flex="1" v-if="$props.isEdit">
                            <a-form-model-item :label="$t('infReplyForm_content')"
                            :required="notiReplyForm.handleStatus != handleStatusEnum.PROCESSING"
                            >
                                <a-select
                                    class="select"
                                    v-model="notiReplyForm.contentId"
                                    :options="replyContentOption"
                                    @change="onContentIdChange"
                                    style="width:40%"
                                />
                            </a-form-model-item>
                            <a-form-model-item
                                class="replyContent"
                                :has-feedback="callCommonUtilFeild(notiReplyValidateForm.content).feedback"
                                :validateStatus="callCommonUtilFeild(notiReplyValidateForm.content).state"
                                prop="content"
                            >
                                <a-popover
                                    placement="top"
                                    :content="callCommonUtilFeild(notiReplyValidateForm.content).msg"
                                    :trigger="callCommonUtilFeild(notiReplyValidateForm.content).hover"
                                    :visible="callCommonUtilFeild(notiReplyValidateForm.content).hoverVisible"
                                    @visibleChange="callCommonUtilFeildVisibleChange(notiReplyValidateForm.content)"
                                    :destroyTooltipOnHide="true"
                                >
                                    <a-textarea
                                    v-model="notiReplyForm.content"
                                    :maxLength="200"
                                    :autoSize="{ minRows: 3, maxRows: 3 }"
                                    ></a-textarea>
                                </a-popover>
                            </a-form-model-item>
                        </a-col>
                        <!-- 回覆內容 唯讀顯示 -->
                        <a-col flex="1" v-else>
                            <a-form-model-item :label="$t('infReplyForm_content')">
                                <p>{{ notiReplyForm.content }}</p>
                            </a-form-model-item>
                        </a-col>
                    </a-row>

                    <!-- 附加檔案-上傳元件 [編輯] 才出現 -->
                    <a-row type="flex" v-if="$props.isEdit">
                        <a-col flex="1">
                            <a-form-model-item :label="$t('infCom_file')" style="margin-bottom: 0px">
                                <!-- 選擇檔案 -->
                                <a-row :gutter="8">
                                    <a-col span="16">
                                        <a-input v-model="selectedFileName" />
                                    </a-col>
                                    <!-- 瀏覽 -->
                                    <a-col span="4">
                                        <a-upload
                                            class="FileListUpload"
                                            :multiple="false"
                                            :before-upload="beforeUpload"
                                            :showUploadList="false"
                                        >
                                            <a-button>
                                                <a-icon type="folder-open" />
                                                {{ $t("uploadFileForm_selectFile") }}
                                            </a-button>
                                        </a-upload>
                                    </a-col>
                                    <!-- 上傳 -->
                                    <a-col span="4">
                                        <a-button
                                            :disabled="uploadingFile == null"
                                            :loading="isUploading"
                                            @click="handleUpload"
                                        >
                                            <!-- 上傳中...   上傳 -->
                                            <a-icon type="upload" />{{ isUploading ? $t('global_uploading') : $t('global_upload') }}
                                        </a-button>
                                    </a-col>
                                </a-row>
                            </a-form-model-item>
                        </a-col>
                    </a-row>

                    <!-- 附加檔案 -->
                    <a-row type="flex">
                        <a-col flex="1">
                            <!-- 上傳檔案清單  其他附檔清單-->
                            <a-form-model-item :label="($props.isEdit) ? $t('infCom_fileList') : $t('infCom_fileListOther')"/>
                            <!-- 下載列表 -->
                            <a-row type="flex" justify="end" v-if="gridFileData.data.length > 0">
                                <a-col span="20">
                                    <FblDataGrid
                                    :themeColor="'theme2'"
                                    :scroll="{ x: true }"
                                    :row-key="gridFileData.rowKey"
                                    :columns="gridFileData.columns"
                                    :data="gridFileData.data"
                                    :pagination="gridFileData.pagination"
                                    :empty-data="gridFileData.data.length <= 0"
                                    >
                                        <template v-slot:handleTemp="slotProps">
                                            <div class="d-flex">
                                            <button
                                                v-if="$props.isEdit"
                                                class="icon-button icon__delete"
                                                @click="handleRemove(slotProps.data)"
                                            >
                                            <!-- 刪除 -->
                                                <img
                                                class="icon-button__img"
                                                src="~@/assets/imgs/button_delete.svg"
                                                :alt="$t('global_delete')"
                                                :title="$t('global_delete')"
                                                >
                                            </button>
                                            <button
                                                class="icon-button"
                                                @click="handleDownload(slotProps.data)"
                                            >
                                            <!-- 下載 -->
                                                <img
                                                    class="icon-button__img"
                                                    src="~@/assets/imgs/button_download.svg"
                                                    :alt="$t('global_download')"
                                                    :title="$t('global_download')"
                                                >
                                            </button>
                                            </div>
                                        </template>
                                    </FblDataGrid>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 方便聯絡時間 [編輯] 才出現 -->
                    <a-row type="flex" v-if="$props.isEdit">
                        <a-col span="4" class="ant-form-item-label" >
                            <label> {{$t('infReplyForm_visitTime')}}</label>
                        </a-col>
                        <a-col span="20">
                            <a-row type="flex" :gutter="[10, 0]">
                                <a-col>
                                    <a-form-model-item
                                    label=""
                                    prop="contactDate"
                                    class="contactDate"
                                    style="margin-bottom: 0px"
                                    :has-feedback="callCommonUtilFeild(notiReplyValidateForm.contactDate).feedback"
                                    :validateStatus="callCommonUtilFeild(notiReplyValidateForm.contactDate).state"
                                    >
                                    <a-popover
                                        placement="top"
                                        :content="callCommonUtilFeild(notiReplyValidateForm.contactDate).msg"
                                        :trigger="callCommonUtilFeild(notiReplyValidateForm.contactDate).hover"
                                        :visible="callCommonUtilFeild(notiReplyValidateForm.contactDate).hoverVisible"
                                        @visibleChange="callCommonUtilFeildVisibleChange(notiReplyValidateForm.contactDate)"
                                        :destroyTooltipOnHide="true"
                                    >
                                        <DatePicker
                                        :formatter="formatter"
                                        @change="onContactDateChange"
                                        v-model="notiReplyForm.datePickerContactDate"
                                        :disabled-date="disabledDate"
                                        @clear="clearContactDate"
                                        :clearable="true"
                                        style="width: 100%"
                                        >
                                            <a-input
                                                slot="input"
                                                @pressEnter="checkManualInputContactDate"
                                                :value="notiReplyForm.contactString"
                                            ></a-input>
                                            <i
                                                v-if="notiReplyValidateForm.contactDate.feedback"
                                                slot="icon-calendar"
                                            ></i>
                                        </DatePicker>
                                    </a-popover>
                                    </a-form-model-item>
                                </a-col>
                                <a-col>
                                    <a-form-model-item
                                    label=""
                                    class="infReplyTime"
                                    style="margin-bottom: 0px"
                                    prop="convenientContactStartTime"
                                    :has-feedback="callCommonUtilFeild(notiReplyValidateForm.convenientContactStartTime).feedback"
                                    :validateStatus="callCommonUtilFeild(notiReplyValidateForm.convenientContactStartTime).state"
                                    v-if="isTimePickerShow"
                                    >
                                    <a-popover
                                        placement="top"
                                        :content="callCommonUtilFeild(notiReplyValidateForm.convenientContactStartTime).msg"
                                        :trigger="callCommonUtilFeild(notiReplyValidateForm.convenientContactStartTime).hover"
                                        :visible="callCommonUtilFeild(notiReplyValidateForm.convenientContactStartTime).hoverVisible"
                                        @visibleChange="callCommonUtilFeildVisibleChange(notiReplyValidateForm.convenientContactStartTime)"
                                        :destroyTooltipOnHide="true"
                                    >
                                        <TimePicker
                                        :open="isConvenientContactStartOpen"
                                        @openChange="clickConvenientContactStartTimePicker"
                                        style="width: 100%"
                                        v-model="notiReplyForm.convenientContactStartTime"
                                        placeholder=""
                                        @change="onConvenientContactStartTimeChange"
                                        :minute-step="5"
                                        format="HH:mm"
                                        :allowClear="false"
                                        >
                                        <!-- 確定 -->
                                        <a-button
                                            slot="addon"
                                            size="small"
                                            type="primary"
                                            @click="closeConvenientContactStartTimePicker"
                                        >
                                            {{ $t("global_ok") }}
                                        </a-button>
                                        </TimePicker>
                                    </a-popover>
                                    </a-form-model-item>
                                </a-col>
                                <a-col v-if="isTimePickerShow" style="width: 15px; padding-top: 10px;text-align:center"> ~ </a-col>
                                <a-col>
                                    <a-form-model-item
                                        label=""
                                        class="infReplyTime"
                                        style="margin-bottom: 0px"
                                        prop="convenientContactEndTime"
                                        :has-feedback="callCommonUtilFeild(notiReplyValidateForm.convenientContactEndTime).feedback"
                                        :validateStatus="callCommonUtilFeild(notiReplyValidateForm.convenientContactEndTime).state"
                                        v-if="isTimePickerShow"
                                    >
                                        <a-popover
                                            placement="top"
                                            :content="callCommonUtilFeild(notiReplyValidateForm.convenientContactEndTime).msg"
                                            :trigger="callCommonUtilFeild(notiReplyValidateForm.convenientContactEndTime).hover"
                                            :visible="callCommonUtilFeild(notiReplyValidateForm.convenientContactEndTime).hoverVisible"
                                            @visibleChange="callCommonUtilFeildVisibleChange(notiReplyValidateForm.convenientContactEndTime)"
                                            :destroyTooltipOnHide="true"
                                        >
                                            <TimePicker
                                            :open="isConvenientContactEndOpen"
                                            @openChange="clickConvenientContactEndTimePicker"
                                            style="width: 100%"
                                            v-model="notiReplyForm.convenientContactEndTime"
                                            placeholder=""
                                            @change="onConvenientContactEndTimeChange"
                                            :minute-step="5"
                                            format="HH:mm"
                                            :allowClear="false"
                                            >
                                            <!-- 確定 -->
                                            <a-button
                                                slot="addon"
                                                size="small"
                                                type="primary"
                                                @click="closeConvenientContactEndTimePicker"
                                            >
                                                {{ $t("global_ok") }}
                                            </a-button>
                                            </TimePicker>
                                        </a-popover>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <!-- 方便聯絡時間 [唯讀] 才出現 -->
                    <a-row type="flex" v-else>
                        <a-col flex="1">
                            <!-- 方便聯絡時間 -->
                            <a-form-model-item :label="$t('infReplyForm_visitTime')">
                                <p>{{ notiReplyReadOnly.visitDate }}</p>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <!-- 回覆人員 [唯讀] 才出現 -->
                    <a-row type="flex" v-if="!$props.isEdit">
                        <a-col flex="1">
                            <a-form-model-item :label="$t('infReplyForm_replyId')">
                                <p>{{ notiReplyReadOnly.replyName }}</p>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <!-- 回覆時間 [唯讀] 才出現 -->
                    <a-row type="flex" v-if="!$props.isEdit">
                        <a-col flex="1">
                            <a-form-model-item :label="$t('infReplyForm_replyTime')">
                                <p>{{ notiReplyReadOnly.replyDate }}</p>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </a-form-model>
            </div>
        </div>

        <!-- 聯絡業務員 -->
        <Modal
            class="c-section c-section--else pointer-events-none card__infomation"
            :visible="contactAgentShow"
            :title="$t('notificationBasic_contactAgent')"
            width="65%"
            :okText="$t('global_close')"
            :closable="false"
            :isMasked="false"
            :removeCancelButton="true"
            :destroyOnClose="true"
            @ok="contactAgentShow = false"
            @cancel="onLeave()"
        >
            <NotificationCallUpAgentModal 
                :caseNo="agentForm.caseNo"
                :notiInfoId="agentForm.notiInfoId"
                :propCaseLogId="agentForm.caseLogId"
                ref="notificationCallUpAgentModal"
                @closeForm="onFormCalcel"
            />
                <template #footer>
                    <!-- 儲存(關閉中) -->
                    <a-row type="flex" justify="end">
                        <!-- <a-button key="button" type="primary" @click="onFormSubmit" v-if="false">{{ 
                            $t("global_save")
                        }}</a-button> -->
                        <!-- 離開 -->
                        <a-button key="submit" @click="onLeave()">{{
                            $t("global_leave")
                        }}</a-button>
                    </a-row>
                </template>
        </Modal>

        <!-- 照會回覆結案 Confirm -->
        <Modal
            class="notiClosed_Confirm"
            :visible="notiClosedConfirmShow"
            :closable="false"
            :isMasked="false"
            :removeCancelButton="true"
            :destroyOnClose="true"
            width="17%"
        >
            <div>
                <a-icon type="info-circle" class="custModalConfirm_Icon"/>
                <!-- 是否確認結案再開單? -->
                <span>{{ $t('notificationModal_notiClosedOpen') }}</span>
            </div>
            <template #footer>
                <a-row type="flex" justify="end">
                    <!-- 否 -->
                    <a-button key="button" @click="notiReplyClosedNot()">{{ $t('global_no') }}</a-button>
                    <!-- 是 -->
                    <a-button key="submit" type="primary" @click="notiReplyClosedYes()">{{ $t('global_yes') }}</a-button>
                    <!-- 取消 -->
                    <a-button key="cancel" @click="notiClosedConfirmShow = false">{{ $t('global_cancel') }}</a-button>
                </a-row>
            </template>
        </Modal>
        
    </div>
</template>

<script src="./NotificationReplyInfo.ts" lang="ts"></script>

<style lang="less">

  .row__third {
    .infoTitle {
      margin-top: 10px;
    }
  }

  .dividerStyle {
    border-width: 2px 0 0;
    margin: 15px 0;
  }

  .section__reply {
        /* 回覆內容 */
        .replyContent{
            margin-left: 16.6%;
            .ant-form-item-control-wrapper {
                width: 100%;
            }
        }
        /* 方便聯絡日期 */
        .contactDate {
            .ant-form-item-label {
            width: 0%;
            }
            .ant-form-item-control-wrapper {
            width: 100%;
            }
        }

        /* 時間 */
        .infReplyTime{
            .ant-form-item-label {
            width: 0%;
            }
            .ant-form-item-control-wrapper {
            width: 100%;
            }
        }
    }

    .notiClosed_Confirm {
        .ant-modal-footer {
            border-top: none;
            padding: 10px 32px 20px;
        }
        .ant-modal-body {
            padding: 32px 32px 24px;
        }
        .custModalConfirm_Icon {
            font-size: 22px;
            color: #faad14;
            margin-right: 16px;
        }
    }
</style>