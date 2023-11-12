<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="infItemSettingEditForm"
    :rules="infItemSettingFormRules"
    ref="infSettingForm"
  >
    <!-- 第一層項目 -->
    <a-form-model-item
      :label="$t('visitPersonSetting_firstLevel')"
      prop="majorSubTypeId"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(infItemSettingValidationForm.majorSubTypeId)
      "
      :validateStatus="
        callCommonUtilFeildStatus(infItemSettingValidationForm.majorSubTypeId)
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(infItemSettingValidationForm.majorSubTypeId)
        "
        :trigger="
          callCommonUtilFeildTrigger(
            infItemSettingValidationForm.majorSubTypeId
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infItemSettingValidationForm.majorSubTypeId
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infItemSettingValidationForm.majorSubTypeId
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          v-model="infItemSettingEditForm.majorSubTypeId"
          style="width: 100%"
          :options="selectInfItemOptions"
          @change="onSelectInfItem()"
          :filter-option="filterOption"
          :disabled="isEditing"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 第二層項目 -->
    <a-form-model-item
      :label="$t('second_level_item')"
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
        :content="
          callCommonUtilFeildMsg(infItemSettingValidationForm.description)
        "
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
          :auto-size="{ minRows: 1, maxRows: 2 }"
          :maxLength="10"
          @mouseover="infSettingIdMouseOver"
          @mouseleave="isInfSettingIdVisible = false"
          @change="onInfSettingIdChange"
        />
      </a-popover>
      <!-- @change="onReplyContentChange" -->
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
          callCommonUtilFeildVisibleChange(infItemSettingValidationForm.content)
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="infItemSettingEditForm.content"
          :auto-size="{ minRows: 4, maxRows: 6 }"
          :maxLength="100"
          @mouseover="contentMouseOver"
          @mouseleave="isContentVisible = false"
          @change="onContentChange"
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
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./NotifyInfSettingEditForm.ts" lang="ts"></script>
