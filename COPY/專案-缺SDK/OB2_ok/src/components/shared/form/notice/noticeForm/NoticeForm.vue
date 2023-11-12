<template>
    <div>
        
        <a-row>
            <a-tabs type="card" v-model="tabActiveKey" style="color:black;">
                <!-- 簡訊 -->
                <a-tab-pane key="1" :tab="$t('noticeForm_textMessage')">
                    <TextMessage v-if="tabActiveKey=='1'"></TextMessage>
                </a-tab-pane>
                
                <!-- E-MAIL -->
                <a-tab-pane key="2" :tab="$t('noticeForm_email')">
                    <Email v-if="tabActiveKey=='2'"></Email>
                </a-tab-pane>

                <!-- 郵寄 -->
                <a-tab-pane v-if="authComponent.NOTICE_SEND_POST.show" key="3" :tab="$t('noticeForm_sendPost')">
                   
                   <MailLetterForm v-if="tabActiveKey=='3'" :editWordAndCancelLetterButtonFlag="false"></MailLetterForm>
                </a-tab-pane>

            </a-tabs>
        </a-row>
    </div>
</template>


<script src="./NoticeForm.ts" lang="ts"></script>

<style lang="less" scoped>
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar {

    .ant-tabs-tab-active{
        color: @MODAL-TAB-COLOR-BLUE;
    }
    
    .ant-tabs-tab {
        padding: 0 30px;
        &:hover {
            color: @MODAL-TAB-COLOR-BLUE;
        }
    }
}
</style>