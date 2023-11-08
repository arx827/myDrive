<template>
    <div class="teleResult">
        <!-- 電訪結果 -->
        <BlockHeader :blockTitle="$t('teleResultArea_title')" :themeColor="'theme3'" />
        <div class="block-content">
            <a-row type="flex">
                <a-col span="2" class="ant-form-item-label">
                    <!-- 方便聯絡時段 -->
                    <label>{{$t('teleResultArea_title_visit_time')}}</label>
                </a-col>
                <a-col span="20">
                    <a-row type="flex" :gutter="[10, 0]">
                    <a-col>
                        <a-form-model-item
                            label=""
                            prop="contactDate"
                            class="contactDate"
                            style="margin-bottom: 0px"
                            :has-feedback="callCommonUtilFeildFeedback(teleResultAreaValidateForm.contactDate)"
                            :validateStatus="callCommonUtilFeildStatus(teleResultAreaValidateForm.contactDate)"
                        >
                        <a-popover
                            placement="top"
                            :content="callCommonUtilFeildMsg(teleResultAreaValidateForm.contactDate)"
                            :trigger="callCommonUtilFeildTrigger(teleResultAreaValidateForm.contactDate)"
                            :visible="callCommonUtilFeildHoverVisible(teleResultAreaValidateForm.contactDate)"
                            @visibleChange="callCommonUtilFeildVisibleChange(teleResultAreaValidateForm.contactDate)"
                            :destroyTooltipOnHide="true"
                        >
                            <DatePicker
                                :formatter="formatter"
                                @change="onContactDateChange"
                                v-model="teleResultAreaForm.contactDate"
                                :disabled-date="disabledDate"
                                @clear="clearContactDate"
                                :clearable="true"
                                style="width: 100%"
                                :editable="caseClosedReason"
                                :disabled="!caseClosedReason"
                            >
                            <a-input
                                slot="input"
                                @pressEnter="checkManualInputContactDate"
                                :value="teleResultAreaForm.contactString"
                                @mouseover="eventMouseOverContactDate"
                                @mouseleave="isContactDateVisible = false"
                                :editable="caseClosedReason"
                                :disabled="!caseClosedReason"
                            ></a-input>
                            <i
                                v-if="teleResultAreaValidateForm.contactDate.feedback"
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
                            :has-feedback="
                                callCommonUtilFeildFeedback(teleResultAreaValidateForm.convenientContactStartTime)
                            "
                            :validateStatus="
                                callCommonUtilFeildStatus(teleResultAreaValidateForm.convenientContactStartTime)
                            "
                            v-if="isTimePickerShow"
                        >
                        <a-popover
                            placement="top"
                            :content="callCommonUtilFeildMsg(teleResultAreaValidateForm.convenientContactStartTime)"
                            :trigger="callCommonUtilFeildTrigger(teleResultAreaValidateForm.convenientContactStartTime)"
                            :visible="callCommonUtilFeildHoverVisible(teleResultAreaValidateForm.convenientContactStartTime)"
                            @visibleChange="callCommonUtilFeildVisibleChange(teleResultAreaValidateForm.convenientContactStartTime)"
                            :destroyTooltipOnHide="true"
                        >
                            <TimePicker
                                :open="isConvenientContactStartOpen"
                                @openChange="clickConvenientContactStartTimePicker"
                                style="width: 100%"
                                v-model="teleResultAreaForm.convenientContactStartTime"
                                placeholder=""
                                @change="onConvenientContactStartTimeChange"
                                :minute-step="5"
                                format="HH:mm"
                                :allowClear="false"
                                :disabled="!caseClosedReason"
                                return-closeDialer-contactDate="retureclosecontactDate"
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
                            :has-feedback="
                                callCommonUtilFeildFeedback(teleResultAreaValidateForm.convenientContactEndTime)
                            "
                            :validateStatus="
                                callCommonUtilFeildStatus(teleResultAreaValidateForm.convenientContactEndTime)
                            "
                            v-if="isTimePickerShow"
                            
                        >
                        <a-popover
                            placement="top"
                            :content="callCommonUtilFeildMsg(teleResultAreaValidateForm.convenientContactEndTime)"
                            :trigger="callCommonUtilFeildTrigger(teleResultAreaValidateForm.convenientContactEndTime)"
                            :visible="callCommonUtilFeildHoverVisible(teleResultAreaValidateForm.convenientContactEndTime)"
                            @visibleChange="callCommonUtilFeildVisibleChange(teleResultAreaValidateForm.convenientContactEndTime)"
                            :destroyTooltipOnHide="true"
                        >
                            <TimePicker
                                :open="isConvenientContactEndOpen"
                                @openChange="clickConvenientContactEndTimePicker"
                                style="width: 100%"
                                v-model="teleResultAreaForm.convenientContactEndTime"
                                placeholder=""
                                @change="onConvenientContactEndTimeChange"
                                :minute-step="5"
                                format="HH:mm"
                                :allowClear="false"
                                :disabled="!caseClosedReason"
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
            <a-spin :spinning="isLoading">
            <div class="result__table">
                <a-table 
                    :class="'theme3'"
                    :scroll="{ x: 1300, y: 300 }"
                    :row-key="(record, index)=>{return record.rowKey+'_'+record.caseNo}"
                    :columns="grid.columns" 
                    :data-source="grid.data"
                    :pagination="false"
                    size="middle"
                    :rowClassName="rowClassName"
                    :empty-data="grid.data.length <= 0"
                >
                    <template slot="callFreqTemp" slot-scope="slotProps, rowData">
                        <span v-html="rowData.callFreq"></span>
                    </template>

                    <!-- 聯絡結果 -->
                    <div slot="contactResultCustomerTitle">
                        <a-row type="flex" justify="space-between">
                            {{$t('teleResultArea_grid_contact_result')}} 
                            <!-- 一併更新 -->
                            <a-row>
                                <a-checkbox :checked="syncUpdateContResult" @change="handleUpdateContact"/> {{$t('teleResultArea_grid_sync_update_contRes')}}
                            </a-row>
                        </a-row>
                    </div>

                    <template slot="contResultTemp" slot-scope="slotProps, rowData">
                        <a-select
                            v-if="slotProps != null && rowData != null"
                            :value="rowData.selectedContRes"
                            :disabled="!validIsEmpty(rowData.caseCloseReasonCode)"
                            @change="changeContResult('customer_change', $event, rowData);hasTeleResultAreaSave = false"
                        >  
                            <a-select-option
                                v-for="item in slotProps" :key="item.label"
                            >
                                {{ item.value }}
                            </a-select-option>
                        </a-select>
                    </template>
                    

                     <!-- 電訪結果 -->
                    <template slot="teleResultTemp" slot-scope="slotProps, rowData">
                        <a-select
                            v-if="slotProps != null && rowData != null"
                            :value="rowData.selectedTeleRes"
                            :disabled="!validIsEmpty(rowData.caseCloseReasonCode)"
                            @change="changeTeleResult('customer_change', $event, rowData);hasTeleResultAreaSave = false"
                        >
                            <a-select-option
                                v-for="item in slotProps" :key="item.label"
                            >
                                {{ item.value }}
                            </a-select-option>
                        </a-select>
                    </template>

                     <!-- 結案原因 -->
                    <template slot="caseClosedReasonTemp" slot-scope="slotProps, rowData">
                        <!-- 原本 結案原因下拉顯示，OBD2UAT-78 修改為不需要下拉顯示 -->
                        <!-- <a-select
                            v-if="slotProps != null && rowData != null"
                            :value="rowData.selectedCaseClosedReason"
                            :disabled="!validIsEmpty(rowData.caseCloseReasonCode)"
                            @change="changeCaseClosedReason($event, rowData);hasTeleResultAreaSave = false"
                        >
                            <a-select-option
                                v-for="item in slotProps" :key="item.label"
                            >
                                {{ item.value }}
                            </a-select-option>
                        </a-select> -->
                        
                        <!-- OBD2UAT-78 修改為不需要下拉顯示 : 已結案直接顯示結案原因-->
                        <span v-if="slotProps != null && rowData != null && !validIsEmpty(rowData.caseCloseReasonCode)">{{rowData.selectedCaseClosedReason}}</span> 
                        <!-- OBD2UAT-78 修改為不需要下拉顯示 : 手動選擇 聯絡結果 + 電訪結果 判斷顯示之結案原因-->
                        <span v-if="slotProps != null && rowData != null && validIsEmpty(rowData.caseCloseReasonCode)">{{ showSelectCaseClosedReason(slotProps, rowData.selectedCaseClosedReason)}}</span>
                            
                    </template>

                     <!-- 話後 -->
                    <template slot="afterTelTemp" slot-scope="slotProps, rowData">
                        <!-- 照會 -->
                        <a-button v-if="slotProps.hasNoti" 
                            :disabled="!validIsEmpty(rowData.caseCloseReasonCode)" 
                            :class="[!validIsEmpty(rowData.caseCloseReasonCode) ? 'table-btn--tele table-btn--tele--disabled' : 'table-btn--tele table-btn--tele--work']" 
                            @click="clickHasNoti(rowData)"> {{$t('teleResultArea_afterTel_noti_btn')}}
                        </a-button>
                        <!-- 會辦 -->
                        <a-button v-if="slotProps.hasInf" 
                            :disabled="!validIsEmpty(rowData.caseCloseReasonCode)"
                            :class="[!validIsEmpty(rowData.caseCloseReasonCode) ? 'table-btn--tele table-btn--tele--disabled' : 'table-btn--tele table-btn--tele--work']" 
                            @click="clickHasInf(rowData)"> {{$t('teleResultArea_afterTel_inf_btn')}}
                        </a-button>
                        <!-- 郵寄 -->
                        <a-button v-if="slotProps.hasSendIntLet" 
                            :disabled="!validIsEmpty(rowData.caseCloseReasonCode)"
                            :class="[!validIsEmpty(rowData.caseCloseReasonCode) ? 'table-btn--tele table-btn--tele--disabled' : 'table-btn--tele table-btn--tele--work']" 
                            @click="clickHasSendIntLet(rowData)"> {{$t('teleResultArea_afterTel_send_btn')}}
                        </a-button>
                    </template>

                    <!-- M+選取框 -->
                    <template slot="mplusCheckBoxTemp" slot-scope="slotProps, rowData">
                        <a-checkbox v-if="slotProps != null && slotProps.show" 
                            :checked="slotProps.checked" @change="changeMplusCheckBox($event, rowData)" />
                    </template>

                    <!-- M+訊息內容 -->
                    <template slot="mplusMsgTemp" slot-scope="slotProps, rowData">
                        <a-textarea class="teleResult_textarea" v-if="rowData.mplusCheckBox.checked && rowData.mplusCheckBox.show" v-model="rowData.mplusMsg"
                            :maxLength="500" :autoSize="{ minRows: 2, maxRows: 2 }"></a-textarea>
                    </template>

                </a-table>
            </div>
            </a-spin>

            <a-row type="flex" align="middle" justify="center" class="block-footer">
                <!-- 離開 -->
                <a-col :flex="3">
                    <a-button class="block-btn block-btn--next" @click="onLeave"> {{$t('global_leave')}} </a-button>
                </a-col>
                
                <a-col :flex="2">
                    <!-- 儲存 -->
                    <a-button class="block-btn block-btn--save" @click="readyTeleResultSave"> {{$t('global_save')}} </a-button>
                    <!-- 取下一筆 -->
                    <a-button class="block-btn block-btn--next" @click="pickUpNext"> {{$t('teleResultArea_pickUpNext')}} </a-button>
                </a-col>
                <a-col  :flex="1">
                    <a-form-model
                        class="footer-select"
                        :label-col="{ span: 4 }"
                        :wrapper-col="{ span: 20 }"
                    >
                        <!-- 續訪 -->
                        <a-form-model-item
                            :label="$t('teleResultArea_title_continue')"
                            class="mb-0"
                        >
                            <a-select 
                                class="select"
                                v-model="continuePackNo"
                                :options="continueOpts"
                                @change="onContinueChange"
                            >
                                
                            </a-select>
                        </a-form-model-item>
                    </a-form-model>
                </a-col>
            </a-row>
        </div>

        <!-- 會辦 Modal -->
        <a-modal
            v-model="isCountersignatureFormVisible"
            :title="'會辦'"
            width="70%"
            :closable="true"
            :maskClosable="false"
            :keyboard="false"
            :footer="null"
            :destroyOnClose="true"
        >
            <CuntersignatureModal
                :step="cuntersignatureData.infStep"
                :propCaseNo="cuntersignatureData.caseNo"
                :propPackNo="cuntersignatureData.packNo"
                @onLeave="onCloseModal('isCountersignatureFormVisible')"
            />
        </a-modal>

        <!-- 照會 Modal -->
        <a-modal
            v-model="isNotificationFormVisible"
            :title="'照會'"
            width="70%"
            :closable="true"
            :maskClosable="false"
            :keyboard="false"
            :footer="null"
            :destroyOnClose="true"
        >
            <NotificationModal
                :step="notificationData.notiStep"
                :propCaseNo="notificationData.caseNo"
                @onLeave="onCloseModal('isNotificationFormVisible')"
            />
        </a-modal>

        <!-- 郵寄 -->
        <a-modal
            v-model="isMailLetterFormVisible"
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

<script src="./TeleResult.ts" lang="ts"></script>

<style lang="less" scoped>
.teleResult {
    /deep/ .ant-form-item {
        margin-bottom: 10px;
        .ant-form-item-label {
            text-align: left;
            label {
                color: @MODAL-TAB-COLOR-BLUE;
            }
        }
    }
    .mx-datepicker-range {
        width: 100%;
    }
    .block-footer {
        margin: 25px 0 10px 0;
        position: relative;
        .footer-select {
            min-width: 30%;
            // position: absolute;
            right: 0;
            top: 0;
            margin-top: 10px;
            width: 360px;
        }
    }
    .block-btn {
        min-width: 130px;
        min-height: 37px;
        border-radius: 20px;
        &--save {
            background-color: @BUTTON-BG-GREEN;
            .text-white-format()
        }
        &--next {
            background-color: @BUTTON-BG-LIGHT-GRAY;
            margin-left: 15px;
        }
    }
    .result__table {
        .table-btn--tele {
            margin: 2px 2px;
            padding: 6px 10px;
            border-radius: 4px;
            border: 0;
            min-width: 33px;
            min-height: 33px;
            text-align: center;
            cursor: pointer;
            // work 籃底白字
            &--work{
                 background-color: @ICON-BUTTON-BG-BLUE;
                 .text-white-format()
            }
            // disabled 灰底預設字
            &--disabled{
                 background-color: @BUTTON-BG-LIGHT-GRAY;
            }
            
        }
        /deep/ .ant-select {
            width: 100%;
        }
        /deep/ .ant-table-header-column {
            width: 100%;
        }
        /deep/ .ant-table-tbody{
                .rowColorRed{
                    color: @FONT-COLOR-RED;
                }
                .rowColorBlack{ // 目前不使用 用預設顏色
                    color: @FONT-COLOR-BLACK;
                }
        }

    }

    .teleResult_textarea{
        resize: none;
    }

    
}
</style>