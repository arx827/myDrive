<template>

<!-- <a-spin :spinning="isLoading"> -->
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="sendTemplateSettingUpdateForm"
    :rules="sendTemplateSettingUpdateFormRules"
    ref="sendTemplateSettingUpdateForm"
  >

  <!-- 範本ID -->
    <a-form-model-item
      :label="$t('sendSMSTemplateSettingPage_templateId')"
      prop="templateId"
      style="margin-bottom: 0px"
    >
    <p>{{sendTemplateSettingUpdateForm.templateId}}</p>
    </a-form-model-item>

  <!-- 發送對象 -->
    <a-form-model-item
      :label="$t('sendSMSTemplateSettingPage_sendTarget')"
      prop="sendTarget"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          sendTemplateSettingUpdateFormValidateForm.sendTarget
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          sendTemplateSettingUpdateFormValidateForm.sendTarget
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            sendTemplateSettingUpdateFormValidateForm.sendTarget
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            sendTemplateSettingUpdateFormValidateForm.sendTarget
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            sendTemplateSettingUpdateFormValidateForm.sendTarget
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            sendTemplateSettingUpdateFormValidateForm.sendTarget
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          class="select"
          v-model="sendTemplateSettingUpdateForm.sendTarget"
          :options="sendTargetOptions"
          style="width: 150px"
          :disabled="false"
          @change="onSendTargetChange"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <!-- 主旨 -->
    <a-form-model-item
      :label="$t('sendSMSTemplateSettingPage_subject')"
      prop="subject"
      style="margin-bottom: 0px"
      v-if="sendMode.includes('E')"
      required
    >
    <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            sendTemplateSettingUpdateFormValidateForm.subject
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            sendTemplateSettingUpdateFormValidateForm.subject
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            sendTemplateSettingUpdateFormValidateForm.subject
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            sendTemplateSettingUpdateFormValidateForm.subject
          )
        "
        :destroyTooltipOnHide="true"
      >
     <a-textarea
          type="text"
          v-model="sendTemplateSettingUpdateForm.subject" 
          :auto-size="{ minRows: 1, maxRows: 1 }"
          :maxLength="100"
          @change="onsubjectChange()" 
     />
     </a-popover>
    </a-form-model-item>

     <!-- 範本名稱 -->
    <a-form-model-item
      :label="$t('sendTemplateSettingPage_codeName')"
      prop="codeName"
      style="margin-bottom: 0px"
      required
    >
    <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            sendTemplateSettingUpdateFormValidateForm.codeName
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            sendTemplateSettingUpdateFormValidateForm.codeName
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            sendTemplateSettingUpdateFormValidateForm.codeName
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            sendTemplateSettingUpdateFormValidateForm.codeName
          )
        "
        :destroyTooltipOnHide="true"
      >

     <a-textarea
          type="text"
          v-model="sendTemplateSettingUpdateForm.codeName" 
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="200"
          @change="oncodeNameChange()" 
     />
     </a-popover>
    </a-form-model-item>

    <!-- 範本內文 -->
    <a-form-model-item
      :label="$t('sendSMSTemplateSettingPage_content')"
      prop="content"
      style="margin-bottom: 0px"
      required
    >
    <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            sendTemplateSettingUpdateFormValidateForm.content
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            sendTemplateSettingUpdateFormValidateForm.content
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            sendTemplateSettingUpdateFormValidateForm.content
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            sendTemplateSettingUpdateFormValidateForm.content
          )
        "
        :destroyTooltipOnHide="true"
      >
     <a-textarea
          type="text"
          v-model="sendTemplateSettingUpdateForm.content" 
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="500"
          @change="onContentChange()" 
     />
     </a-popover>
    </a-form-model-item>

    <!-- 限制條件 -->
    <!-- <a-form-model-item
      :label="$t('sendTemplateSettingPage_crud')"
      prop="content"
      style="margin-bottom: 0px"
      required
    >
    <a-checkbox-group name="checkboxgroup" :options="options" v-model="sendTemplateSettingUpdateForm.crudList" required>
    </a-checkbox-group>
    </a-form-model-item> -->
    
    
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./sendTemplateSettingUpdateForm.ts" lang="ts"></script>
