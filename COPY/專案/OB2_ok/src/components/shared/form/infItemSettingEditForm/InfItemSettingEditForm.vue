<template>

  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="infItemSettingEditForm"
    :rules="infItemSettingFormRules"
  >

    <!-- 第一層項目 -->
    <a-form-model-item
      :label="$t('visitPersonSetting_firstLevel')"
      prop="description"
      style="margin-bottom: 0px"
      required
       :has-feedback="
        callCommonUtilFeildFeedback(infItemSettingValidationForm.description)
      "
      :validateStatus="
        callCommonUtilFeildStatus(infItemSettingValidationForm.description)
      "
    >
          <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(infItemSettingValidationForm.description)"
        :trigger="
          callCommonUtilFeildTrigger(infItemSettingValidationForm.description)
        "
        :visible="
          callCommonUtilFeildHoverVisible(infItemSettingValidationForm.description)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infItemSettingValidationForm.description
          )
        "
        :destroyTooltipOnHide="true"
      >
       <a-textarea
          type="text"
          v-model="infItemSettingEditForm.description"
          :auto-size="{ minRows: 1, maxRows: 1 }"
          :maxLength="10"
          @mouseenter="infItemDescriptionMouseOver"
          @mouseout="isinfItemDescriptionVisible = false"
          @change="infItemDescriptionChange"
        />
     </a-popover>
    </a-form-model-item>
    <!-- 罐頭語 -->
    <a-form-model-item
      :label="$t('visitPersonSetting_canContent')"
      prop="content"
      style="margin-bottom: 0px"
      required
     :has-feedback="
        callCommonUtilFeildFeedback(infItemSettingValidationForm.content)
      "
      :validateStatus="
        callCommonUtilFeildStatus(infItemSettingValidationForm.content)
      "
    >
          <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(infItemSettingValidationForm.content)"
        :trigger="
          callCommonUtilFeildTrigger(infItemSettingValidationForm.content)
        "
        :visible="
          callCommonUtilFeildHoverVisible(infItemSettingValidationForm.content)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infItemSettingValidationForm.content
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="infItemSettingEditForm.content"
          :auto-size="{ minRows: 4, maxRows: 6 }"
          :maxLength="100"
          @mouseenter="infItemContentMouseOver"
          @mouseout="isinfItemContentVisible = false"
          @change="infItemContentChange"
        />
        </a-popover>
       
    </a-form-model-item>
    <!-- 狀態 -->
    <a-form-model-item
      :label="$t('global_status')"
      style="margin-bottom: 0px"
      prop="status"
      v-if="isEditing"
      required
    >
        <a-select
          v-model="infItemSettingEditForm.status"
          :options="selectStatusOptions"
          :placeholder="$t('roleSF_pleaseChoose')"
         
        >
        </a-select>
         <!-- @change="onStatusChange" -->
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./InfItemSettingEditForm.ts" lang="ts"></script>
