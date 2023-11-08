<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="notiEmailTemplateSettingForm"
    :rules="notiEmailTemplateSettingFormRules"
    ref="notiEmailTemplateSettingFormRules"
  >
    <!-- 類型 -->
    <a-form-model-item
      :label="$t('global_type')"
      prop="notiTypeId"
      style="margin-bottom: 0px"
    >
      <p>{{ initData.notiEmailTypeDes }}</p>
    </a-form-model-item>
    <!-- 主旨 -->
    <a-form-model-item
      :label="$t('mailRecord_subject')"
      prop="subject"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(notiEmailTemplateValidationForm.subject)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiEmailTemplateValidationForm.subject)
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(notiEmailTemplateValidationForm.subject)
        "
        :trigger="
          callCommonUtilFeildTrigger(notiEmailTemplateValidationForm.subject)
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            notiEmailTemplateValidationForm.subject
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiEmailTemplateValidationForm.subject
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="notiEmailTemplateSettingForm.subject"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="200"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 內文 -->
    <a-form-model-item
      :label="$t('email_content')"
      style="margin-bottom: 0px"
      prop="content"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(notiEmailTemplateValidationForm.content)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiEmailTemplateValidationForm.content)
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(notiEmailTemplateValidationForm.content)
        "
        :trigger="
          callCommonUtilFeildTrigger(notiEmailTemplateValidationForm.content)
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            notiEmailTemplateValidationForm.content
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiEmailTemplateValidationForm.content
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="notiEmailTemplateSettingForm.content"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="500"
        />
      </a-popover>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./NotiEmailTemplateUpdateForm.ts" lang="ts"></script>
