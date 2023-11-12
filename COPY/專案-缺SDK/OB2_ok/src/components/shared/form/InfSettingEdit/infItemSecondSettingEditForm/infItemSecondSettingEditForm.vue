<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="infItemSettingEditForm"
    :rules="infItemSettingFormRules"
  >
    <!-- 第一層項目 -->
    <a-form-model-item
      :label="$t('communicatSetting_firstInfItem')"
      style="margin-bottom: 0px"
      prop="itemFirst"
      required
      :has-feedback="infItemSettingValidationForm.itemFirst.feedback"
      :validateStatus="infItemSettingValidationForm.itemFirst.state"
    >
      <a-popover
        placement="top"
        :content="infItemSettingValidationForm.itemFirst.msg"
        :trigger="
          callCommonUtilFeildTrigger(infItemSettingValidationForm.itemFirst)
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infItemSettingValidationForm.itemFirst
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infItemSettingValidationForm.itemFirst
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          v-model="infItemSettingEditForm.itemFirst"
          :options="selectFirstItemOptions"
          :disabled="isEditing"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <!-- 第二層項目 -->
    <a-form-model-item
      :label="$t('communicatSetting_secondInfItem')"
      style="margin-bottom: 0px"
      prop="description"
      required
      :has-feedback="infItemSettingValidationForm.description.feedback"
      :validateStatus="infItemSettingValidationForm.description.state"
    >
      <a-popover
        placement="top"
        :content="infItemSettingValidationForm.description.msg"
        :trigger="
          callCommonUtilFeildTrigger(infItemSettingValidationForm.description)
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infItemSettingValidationForm.description
          )
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
          :maxLength="10"
          @mouseenter="infItemDescriptionMouseOver"
          @mouseout="isinfItemDescriptionVisible = false"
        />
      </a-popover>
    </a-form-model-item>

    <!-- 罐頭語 -->
    <a-form-model-item
      :label="$t('communicatSetting_content')"
      style="margin-bottom: 0px"
      prop="content"
      required
      :has-feedback="infItemSettingValidationForm.content.feedback"
      :validateStatus="infItemSettingValidationForm.content.state"
    >
      <a-popover
        placement="top"
        :content="infItemSettingValidationForm.content.msg"
        :trigger="
          callCommonUtilFeildTrigger(infItemSettingValidationForm.content)
        "
        :visible="
          callCommonUtilFeildHoverVisible(infItemSettingValidationForm.content)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(infItemSettingValidationForm.content)
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="infItemSettingEditForm.content"
          :maxLength="100"
          :auto-size="{ minRows: 3, maxRows: 10 }"
          @mouseenter="infItemContentMouseOver"
          @mouseout="isinfItemContentVisible = false"
        />
      </a-popover>
    </a-form-model-item>

    <!-- 狀態 -->
    <a-form-model-item
      :label="$t('global_status')"
      style="margin-bottom: 0px"
      v-if="isEditing"
      required
    >
      <a-select
        v-model="infItemSettingEditForm.status"
        :options="selectStatusOptions"
        :placeholder="$t('roleSF_pleaseChoose')"
      >
      </a-select>
    </a-form-model-item>
  </a-form-model>
</template>
<script src="./infItemSecondSettingEditForm.ts" lang="ts"></script>
