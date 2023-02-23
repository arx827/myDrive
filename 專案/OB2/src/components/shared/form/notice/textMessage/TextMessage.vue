<template>
    <div style="margin:10px;">
        <div class="textMsg__collapse">
            <div class="collapseBtn" @click="showSubmitBlock = !showSubmitBlock">
                <div class="collapseBtn-txt">發送簡訊展開/收合</div>
                <div
                    :class="['icon-arrow', showSubmitBlock ? 'icon-arrow__up' :'icon-arrow__down']"
                />
            </div>
        </div>
        
        <slide-up-down :active="showSubmitBlock">
            <a-form-model
                class="modal-formGroup"
                :model="textMessageForm"
                :rules="textMessageFormRules"
                :label-col="{ span: 2 }"
                :wrapper-col="{ span: 11 }"
            >

                <!-- 客戶姓名 -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item :label="$t('textMessage_custName')">
                            <label>{{textMessageForm.custName}}</label>
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- 客戶ID -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item :label="$t('textMessage_custId')">
                            <label>{{textMessageForm.custId}}</label>
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- 手機號碼 -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item
                            :label="$t('textMessage_phoneNum')"
                            required
                        >
                            <a-row type="flex" :gutter="[16,0]">
                                <a-col :span="8">
                                    <a-select
                                        v-model="selectedPhoneNum"
                                        :options="custPhoneNumOpts"
                                        :filter-option="filterOption"
                                        show-search
                                        @change="changeSelectedPhoneNum($event)"
                                    />
                                </a-col>
                                <a-col :span="16">
                                    <a-form-model-item
                                        prop="phoneNum"
                                        :has-feedback="callCommonUtilFeild(textMessageValidateForm.phoneNum).feedback"
                                        :validateStatus="callCommonUtilFeild(textMessageValidateForm.phoneNum).state"
                                        class="collapse-phoneNumInput"
                                    >
                                        <a-popover
                                            placement="top"
                                            :content="callCommonUtilFeild(textMessageValidateForm.phoneNum).msg"
                                            :trigger="callCommonUtilFeild(textMessageValidateForm.phoneNum).hover"
                                            :visible="callCommonUtilFeild(textMessageValidateForm.phoneNum).hoverVisible"
                                            @visibleChange="callCommonUtilFeildVisibleChange(textMessageValidateForm.phoneNum)"
                                            :destroyTooltipOnHide="true"
                                        >
                                            <a-input type="text"  :max-length="20" @keydown="retypedPhoneNum" v-model="textMessageForm.phoneNum"/>
                                        </a-popover>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- 簡訊範本 -->
                <a-row>
                    <a-col>
                        <a-form-model-item :label="$t('textMessage_msg_template')">
                            <a-select
                                v-model="selectedMsgTemplate"
                                :options="messageTemplateOpts"
                                :filter-option="filterOption"
                                show-search
                                @change="changeMsgTemplate($event)"
                            >
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- 簡訊內容 -->
                <a-row>
                    <a-col>
                        <a-form-model-item
                            class="collapse-txtMsg"
                            :label="$t('textMessage_msg_content')"
                            :has-feedback="callCommonUtilFeild(textMessageValidateForm.msgContent).feedback"
                            :validateStatus="callCommonUtilFeild(textMessageValidateForm.msgContent).state"
                            prop="msgContent"
                            required
                        >
                            <a-popover
                                placement="top"
                                :content="callCommonUtilFeild(textMessageValidateForm.msgContent).msg"
                                :trigger="callCommonUtilFeild(textMessageValidateForm.msgContent).hover"
                                :visible="callCommonUtilFeild(textMessageValidateForm.msgContent).hoverVisible"
                                @visibleChange="callCommonUtilFeildVisibleChange(textMessageValidateForm.msgContent)"
                                :destroyTooltipOnHide="true"
                            >   
                                <a-textarea
                                    v-model="textMessageForm.msgContent"
                                    type="text"
                                    :auto-size="{ minRows: 4, maxRows: 4 }"
                                    :maxLength="250"
                                />
                            </a-popover> 
                            <div class="collapse-txtMsg-warning text-color-red">{{$t('textMessage_msg_content_canot_symbol')}}{{$t('global_chinese_comma')}}{{$t('textMessage_msg_content_max_content')}}{{maxMsgContent}}{{$t('global_chinese_comma')}}{{$t('textMessage_msg_content_last_content')}}{{currentLastMsgContent}}</div>
                            <!-- 簡訊內容不能包含下列符號 ‘ [ ] | \ ( ) + & %，最大字數:250，剩餘字數:250 -->
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>

            <a-row style="margin:10px 0;">
                <a-col :span="24" align="center">
                    <a-button class="submitBlock-btn" type="primary" @click="doubleCheckToSendMsg">{{$t('textMessage_send')}}</a-button>
                </a-col>    
            </a-row>
        </slide-up-down>

        <a-divider />

        <FblDataGrid
            :themeColor="'theme2'"
            :scroll="{ x: 600, y: 400 }"
            :row-key="sendMsgGrid.rowKey"
            :columns="sendMsgGrid.columns"
            :data="sendMsgGrid.data"
            :pagination="sendMsgGrid.pagination"
            :empty-data="sendMsgGrid.data.length <= 0"
            @tableChange="onPageChange($event)"
            @handleEllipsisClick="handleEllipsisClick"
            @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        >
        </FblDataGrid>

    </div>
</template>


<script src="./TextMessage.ts" lang="ts"></script>

<style lang="less" scoped>
.ant-form-item{
    margin-bottom: 0px;
}
.collapse-phoneNumInput {
    /deep/ .ant-col, .ant-form-item-control-wrapper {
        width: 100%;
    }
}
.collapse-txtMsg {
    align-items: start !important;
    margin-top: 10px;
    /deep/ .ant-form-item-label {
        line-height: 1.3;
    }
    .collapse-txtMsg-warning {
        line-height: 1.5;
    }
}
.textMsg__collapse {
    display: flex;
    margin: 24px 0 10px 0;
    .collapseBtn {
        margin-left: auto;
        display: flex;
        align-items: center;
        .collapseBtn-txt {
            margin-right: 10px;
            line-height: 20px;
            color: @MODAL-TAB-COLOR-BLUE;
            cursor: pointer;
        }
        .icon-arrow {
            width: 12px;
            height: 12px;
        }
    }
}

.modal-formGroup {
  /deep/ .ant-form-item{
    display: flex;
    align-items: center;
    .ant-form-item-label {
        padding-bottom: 5px;
        padding-top: 5px;
    }
  }
}

.submitBlock-btn {
    background-color: @MODAL-BUTTON-BG-BLUE;
    border-color: @MODAL-BUTTON-BG-BLUE;
}
</style>