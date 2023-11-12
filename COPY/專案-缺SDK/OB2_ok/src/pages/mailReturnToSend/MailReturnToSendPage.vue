<template>
  <div tabindex="-1" @keyup.enter="()=>{}">
    <a-form-model
      :label-col="{ xs: 7, md: 9, xxl: 7}"
      :model="mailReturnToSendForm"
      :rules="mailNoticeSearchRule"
      ref="ruleForm"
      class="mailReturnToSendPageModel"
    >
      <!-- 退回日期 -->
      <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]" style="margin-left:-10px">
          <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <span slot="label"> {{$t('mailReturnToSendPage_label_returnDate')}} </span>
                <label>{{formatter.stringify(mailReturnToSendForm.retunrDate)}}</label>
              </a-form-model-item>
          </a-col>
      </a-row>

    <!-- 郵寄條碼 -->
    <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]" style="margin-left:-10px">
          <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <a-form-model-item>
                <span slot="label"> {{$t('mailReturnToSendPage_label_mailBarCodeList')}} </span>
              </a-form-model-item>
          </a-col>
          <a-col :xs="24" :md="12" :xl="8" :xxl="18" align="right" class="btnBar">
              <!-- 新增 -->
              <a-button type="primary" @click="addToReturn">{{ $t('global_add') }}</a-button>
              <!-- 清除 -->
              <a-button type="primary" @click="resetMailReturnToSendForm">{{ $t('global_clean') }}</a-button>
          </a-col>
      </a-row>
      
      <!-- 滾出 mailReturnToSendForm mailBarCodeList 需要數量的郵件條碼 -->
      <a-row type="flex" style="margin:0px 100px 0px">
          <a-col :xs="24" :md="24" :xl="24" :xxl="22" >
            <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]" >
                <a-col :xs="24" :md="24" :xl="24" :xxl="6" v-for="(value, key, index) in mailReturnToSendForm.mailBarCodeList" :key="index">
                    <a-form-model-item
                      :has-feedback="callCommonUtilFeild(mailReturnToSendValidForm[key]).feedback"
                      :validateStatus="callCommonUtilFeild(mailReturnToSendValidForm[key]).state"
                      :prop="key"
                    >
                    <a-popover
                      placement="top"
                      :content="callCommonUtilFeild(mailReturnToSendValidForm[key]).msg"
                      :trigger="callCommonUtilFeild(mailReturnToSendValidForm[key]).hover"
                      :visible="callCommonUtilFeild(mailReturnToSendValidForm[key]).hoverVisible"
                      @visibleChange="callCommonUtilFeildVisibleChange(mailReturnToSendValidForm[key])"
                      :destroyTooltipOnHide="true"
                    >
                        <a-input type="text" :maxLength="20" v-model="mailReturnToSendForm.mailBarCodeList[key]"/>
                    </a-popover>
                    </a-form-model-item>
                </a-col>
            </a-row>     
          </a-col>
      </a-row>

    </a-form-model>
  </div>
</template>

<script src="./MailReturnToSendPage.ts" lang="ts"></script>

<style lang="less" scoped>
.mailReturnToSendPageModel {

    padding: 5px 5px 5px;
    // background: @COLOR-MAIN11;
    .ant-form-item {
      margin-bottom: 0;
    }


}

.btnBar{
    margin-left: -100px;
    .ant-btn{
        margin: 0 5px;
    }
}
</style>
