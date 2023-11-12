<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="infEmailTemplateSettingForm"
  >
    <!-- 類型 -->
    <a-form-model-item
      :label="$t('global_type')"
      prop="infTypeId"
      style="margin-bottom: 0px"
      required
      :has-feedback="infEmailTemplateValidationForm.infTypeId.feedback"
      :validateStatus="infEmailTemplateValidationForm.infTypeId.state"
    >
    <a-popover
        placement="top"
        :trigger="infEmailTemplateValidationForm.infTypeId.hover"
        :content="infEmailTemplateValidationForm.infTypeId.content"
        :destroyTooltipOnHide="true"
      >
      <a-select
        v-model="infEmailTemplateSettingForm.infTypeId"
        style="width: 100%"
        :options="majorTypeOptions"
        :filter-option="filterOption"
        :disabled="isEditing"
        @change="onTypeIdChange" 
        @blur="onTypeIdChange" 
      >
      </a-select>
    </a-popover>
      <!-- @change="onSelectedEmailTemplateChange" -->
    </a-form-model-item>
    <!-- 主旨 -->
    <a-form-model-item
      :label="$t('mailRecord_subject')"
      prop="subject"
      style="margin-bottom: 0px"
      :has-feedback="infEmailTemplateValidationForm.subject.feedback"
      :validateStatus="infEmailTemplateValidationForm.subject.state"
      required
    >
      <a-popover
        placement="top"
        :trigger="infEmailTemplateValidationForm.subject.hover"
        :content="infEmailTemplateValidationForm.subject.content"
        :visible="isEmailSubjectVisible"
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="infEmailTemplateSettingForm.subject"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="200"
          @mouseenter="infEmailSubjectMouseOver"
          @mouseout="isEmailSubjectVisible = false"
          @change="onSubjectChange"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 內文 -->
    <a-form-model-item
      :label="$t('email_content')"
      style="margin-bottom: 0px"
      prop="remark"
      :has-feedback="infEmailTemplateValidationForm.content.feedback"
      :validateStatus="infEmailTemplateValidationForm.content.state"
      required
    >
      <a-popover
        placement="top"
        :trigger="infEmailTemplateValidationForm.content.hover"
        :content="infEmailTemplateValidationForm.content.content"
        :visible="isEmailContentVisible"
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="infEmailTemplateSettingForm.content"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="500"
          @change="onContentChange"
          @mouseenter="infEmailContentMouseOver"
          @mouseout="isEmailContentVisible = false"
        />
      </a-popover>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./InfEmailTemplateUpdateForm.ts" lang="ts"></script>
