<template>
    <div style="margin:10px;">
        
        <div class="textEmail__collapse">
            <div class="collapseBtn" @click="showSubmitBlock = !showSubmitBlock">
                <div class="collapseBtn-txt">{{$t('email_form_slide')}}</div> <!-- 發送簡訊展開/收合 -->
                <div
                    :class="['icon-arrow', showSubmitBlock ? 'icon-arrow__up' :'icon-arrow__down']"
                />
            </div>
        </div>

        <slide-up-down :active="showSubmitBlock">
            <a-form-model
                class="modal-formGroup"
                :model="emailForm"
                :rules="emailFormRules"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 15 }"
            >

                <!-- 客戶姓名 -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item :label="$t('email_custName')"> <!-- 客戶姓名 -->
                            <label>{{emailForm.custName}}</label>
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- 客戶ID -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item :label="$t('email_custId')"> <!-- 客戶ID -->
                            <label>{{emailForm.custId}}</label>
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- 收件人E-MAIL -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item :label="$t('email_receiver_address')" required> <!-- 收件人E-MAIL -->
                            <a-row type="flex" :gutter="[16,0]">
                                <a-col :span="8">
                                    <a-select
                                        v-model="selectedCustEmail"
                                        :options="custEmailOpts"
                                        :filter-option="filterOption"
                                        show-search
                                        @change="changeSelectedCustEmail($event)"
                                    />
                                </a-col>
                                <a-col :span="16">
                                    <a-form-model-item
                                        prop="receiverAddress"
                                        :has-feedback="callCommonUtilFeild(emailValidateForm.receiverAddress).feedback"
                                        :validateStatus="callCommonUtilFeild(emailValidateForm.receiverAddress).state"
                                        class="collapse-receiverAddressInput"
                                    >
                                        <a-popover
                                            placement="top"
                                            :content="callCommonUtilFeild(emailValidateForm.receiverAddress).msg"
                                            :trigger="callCommonUtilFeild(emailValidateForm.receiverAddress).hover"
                                            :visible="callCommonUtilFeild(emailValidateForm.receiverAddress).hoverVisible"
                                            @visibleChange="callCommonUtilFeildVisibleChange(emailValidateForm.receiverAddress)"
                                            :destroyTooltipOnHide="true"
                                        >
                                            <a-input type="text" @keydown="retypedCustEmail" v-model="emailForm.receiverAddress"/>
                                        </a-popover>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-form-model-item>
                        
                    </a-col>
                </a-row>

                <!-- E-Mail 主旨 -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item :label="$t('email_subject')" required> <!-- E-MAIL主旨 -->
                            <a-row type="flex" :gutter="[16,0]"></a-row>
                                <a-col :span="12">
                                    <a-form-model-item
                                        prop="emailSubject"
                                        :has-feedback="callCommonUtilFeild(emailValidateForm.emailSubject).feedback"
                                        :validateStatus="callCommonUtilFeild(emailValidateForm.emailSubject).state"
                                        class="collapse-receiverAddressInput"
                                    >
                                        <a-popover
                                            placement="top"
                                            :content="callCommonUtilFeild(emailValidateForm.emailSubject).msg"
                                            :trigger="callCommonUtilFeild(emailValidateForm.emailSubject).hover"
                                            :visible="callCommonUtilFeild(emailValidateForm.emailSubject).hoverVisible"
                                            @visibleChange="callCommonUtilFeildVisibleChange(emailValidateForm.emailSubject)"
                                            :destroyTooltipOnHide="true"
                                        >
                                            <a-input type="text" :max-length="30" @keydown="{}" v-model="emailForm.emailSubject"/>
                                        </a-popover>
                                    </a-form-model-item>
                                </a-col>
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- E-Mail 範本 -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item :label="$t('email_template')"> <!-- E-MAIL範本 -->
                            <a-row type="flex" :gutter="[16,0]">
                                <a-col :span="8">
                                    <a-select
                                        v-model="selectedEmailTemplate"
                                        :options="emailTemplateOpts"
                                        :filter-option="filterOption"
                                        show-search
                                        @change="changeEmailTemplate($event)"
                                    />
                                </a-col>
                            </a-row>
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- E-Mail 內文 -->
                <a-row>
                    <a-col>
                        <a-form-model-item :label="$t('email_content')" required
                            class="collapse-labelTop"
                        :has-feedback="callCommonUtilFeild(emailValidateForm.emailContent).feedback"
                        :validateStatus="callCommonUtilFeild(emailValidateForm.emailContent).state" 
                        prop="emailContent"
                        > <!-- 內文 -->
                            <a-popover
                                placement="top"
                                :content="callCommonUtilFeild(emailValidateForm.emailContent).msg"
                                :trigger="callCommonUtilFeild(emailValidateForm.emailContent).hover"
                                :visible="callCommonUtilFeild(emailValidateForm.emailContent).hoverVisible"
                                @visibleChange="callCommonUtilFeildVisibleChange(emailValidateForm.emailContent)"
                                :destroyTooltipOnHide="true"
                            >
                                <a-textarea
                                    v-model="emailForm.emailContent"
                                    type="text"
                                    :auto-size="{ minRows: 4, maxRows: 4 }"
                                    :maxLength="250"
                                />
                            </a-popover> 
                        </a-form-model-item>
                    </a-col>
                </a-row>

                <!-- 附檔 -->
                <a-row>
                    <a-col align="left">
                        <a-form-model-item :label="$t('email_attachment')" > <!-- 本機附檔 -->
                            <a-row type="flex" :gutter="[16,0]">
                                <a-col :span="8">
                                    <a-input type="text" v-model="emailUploadFileName" disabled/>
                                </a-col>
                                <a-col :span="4">
                                    <a-upload :show-upload-list="false" :before-upload="beforeUpload">
                                        <a-button><a-icon type="upload" /> {{$t('global_selectFile')}}</a-button>
                                    </a-upload>
                                </a-col>
                                <a-col :span="2" align="right">
                                    <label>{{$t('email_attachment_des')}}</label> <!-- 說明: -->
                                </a-col>
                                <a-col :span="8">
                                    <a-input type="text" v-model="emailUploadFileDes" :maxLength="50"/>
                                </a-col>
                                <a-col :span="1">
                                    <a-button type="primary" @click="addEmailAttach">{{$t('email_attachment_add')}}</a-button> <!-- 加入 -->
                                </a-col>
                            </a-row>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <!-- 附檔列表 -->
                <a-row>
                    <a-col>
                        <a-form-model-item :label="$t('email_attachment_list')"  class="collapse-labelTop">
                            <FblDataGrid
                                :row-key="fileGrid.rowKey"
                                :columns="fileGrid.columns"
                                :data="fileGrid.data"
                                :pagination="false"
                                :scroll="{y:100}"
                                @actionClick="fileGridActionClick($event)"
                            >
                            </FblDataGrid>
                        </a-form-model-item>
                    </a-col>
                </a-row>

            </a-form-model>

            <a-row style="margin:10px 0;">
                <a-col :span="24" align="center">
                    <a-button class="submitBlock-btn" type="primary" @click="doubleCheckToSendEmail">{{$t('email_send')}}</a-button> <!-- 發送 -->
                </a-col>    
            </a-row>
        
        </slide-up-down>

        <a-divider />

        <FblDataGrid
            :themeColor="'theme2'"
            :scroll="{ x: 600, y: 400 }"
            :row-key="sendEmailGrid.rowKey"
            :columns="sendEmailGrid.columns"
            :data="sendEmailGrid.data"
            :pagination="sendEmailGrid.pagination"
            @tableChange="onPageChange($event)"
            @actionClick="sendEmailGridActionClick($event)"
            @handleEllipsisClick="handleEllipsisClick"
            @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        >
        </FblDataGrid>


    </div>
</template>

<script src="./Email.ts" lang="ts"></script>

<style lang="less" scoped>
.ant-form-item{
    margin-bottom: 0px;
}
.collapse-receiverAddressInput {
    /deep/ .ant-col, .ant-form-item-control-wrapper {
        width: 100%;
    }
}
.collapse-labelTop {
    align-items: start !important;
    margin-top: 10px;
    /deep/ .ant-form-item-label {
        line-height: 1.3;
    }
}
.textEmail__collapse {
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