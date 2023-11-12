<template>
  <div class="section-card section__interview">
    <div class="card__title-position">
      <!-- 聯絡結果 -->
      <span class="card__title">{{$t('pedding_contactResult')}}</span>
    </div>
    <div class="card__infomation">
    <a-form-model
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }" 
      :model="notiContactResultForm"
      :rules="notiCallUpAgentContactResultFormRules"
    > 
      <a-row :gutter="24">
        <a-col :span="12">
          <!-- 聯絡結果 -->
          <a-form-model-item
            :label="$t('pedding_contactResult')"
            class=""
            prop="contactResultType"
            style="margin-bottom: 0px"
            :has-feedback="callCommonUtilFeildFeedback(notiCallUpAgentContactResultValidateForm.contactResultType)"
            :validateStatus="callCommonUtilFeildStatus(notiCallUpAgentContactResultValidateForm.contactResultType)"
          >
            <a-popover placement="top"
              :destroyTooltipOnHide="true"
              :content="callCommonUtilFeildMsg(notiCallUpAgentContactResultValidateForm.contactResultType)"
              :trigger="callCommonUtilFeildTrigger(notiCallUpAgentContactResultValidateForm.contactResultType)"
              :visible="callCommonUtilFeildHoverVisible(notiCallUpAgentContactResultValidateForm.contactResultType)"
              @visibleChange="callCommonUtilFeildVisibleChange(notiCallUpAgentContactResultValidateForm.contactResultType)"
            >
              <a-select
                v-model="notiContactResultForm.contactResultType"
                :options="selectContactResultTypeOptions"
              >
              </a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <!-- 聯絡細項 -->
          <a-form-model-item
            :label="$t('onDutyPage_contDetails')"
            class=""
            prop="contactResultDetail"
            style="margin-bottom: 0px"
            :has-feedback="callCommonUtilFeildFeedback(notiCallUpAgentContactResultValidateForm.contactResultDetail)"
            :validateStatus="callCommonUtilFeildStatus(notiCallUpAgentContactResultValidateForm.contactResultDetail)"
          >
            <a-popover placement="top"
              :destroyTooltipOnHide="true"
              :content="callCommonUtilFeildMsg(notiCallUpAgentContactResultValidateForm.contactResultDetail)"
              :trigger="callCommonUtilFeildTrigger(notiCallUpAgentContactResultValidateForm.contactResultDetail)"
              :visible="callCommonUtilFeildHoverVisible(notiCallUpAgentContactResultValidateForm.contactResultDetail)"
              @visibleChange="callCommonUtilFeildVisibleChange(notiCallUpAgentContactResultValidateForm.contactResultDetail)"
            >
              <a-select
                v-model="notiContactResultForm.contactResultDetail"
                :options="selectContactResultDetailOptions"
              >
              </a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <!-- 通話內容 -->
          <a-form-model-item
            :label="$t('callUpF_callUpRemark')"
            class=""
            prop="contactContent"
            style="margin-bottom: 0px"
          >
              <a-textarea
                type="text"
                v-model="notiContactResultForm.contactContent"
                :auto-size="{ minRows: 2, maxRows: 10 }"
                :maxLength="500"
          />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    </div>
  </div>
</template>
<script src="./NotificationCallUpAgentContactResult.ts" lang="ts"></script>
 
<style lang="less" scoped>

</style>