<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="infReplyContentSettingForm"
    :rules="infReplyContentSettingFormRules"
  >
    <!-- 會辦類型 -->
    <a-form-model-item
      :label="$t('infCom_InfType')"
      prop="infType"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(infReplyContentValidationForm.infType)
      "
      :validateStatus="
        callCommonUtilFeildStatus(infReplyContentValidationForm.infType)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(infReplyContentValidationForm.infType)"
        :trigger="
          callCommonUtilFeildTrigger(infReplyContentValidationForm.infType)
        "
        :visible="
          callCommonUtilFeildHoverVisible(infReplyContentValidationForm.infType)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infReplyContentValidationForm.infType
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          class="select"
          v-model="infReplyContentSettingForm.infType"
          :options="infTypeOptions"
          style="width: 150px"
          :disabled="isEditing"
          @change="onInfTypeIdChange"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 選單內容 -->
    <a-form-model-item
      :label="$t('infContent')"
      prop="content"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(infReplyContentValidationForm.content)
      "
      :validateStatus="
        callCommonUtilFeildStatus(infReplyContentValidationForm.content)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(infReplyContentValidationForm.content)"
        :trigger="
          callCommonUtilFeildTrigger(infReplyContentValidationForm.content)
        "
        :visible="
          callCommonUtilFeildHoverVisible(infReplyContentValidationForm.content)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infReplyContentValidationForm.content
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="infReplyContentSettingForm.content"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="50"
          @mouseenter="infReplyContentMouseOver"
          @mouseout="isInfContentVisible = false"
          @change="onReplyContentChange"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 選單排序 -->
    <a-form-model-item
      :label="$t('infSort')"
      prop="sort"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(infReplyContentValidationForm.sort)
      "
      :validateStatus="
        callCommonUtilFeildStatus(infReplyContentValidationForm.sort)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(infReplyContentValidationForm.sort)"
        :trigger="
          callCommonUtilFeildTrigger(infReplyContentValidationForm.sort)
        "
        :visible="
          callCommonUtilFeildHoverVisible(infReplyContentValidationForm.sort)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(infReplyContentValidationForm.sort)
        "
        :destroyTooltipOnHide="true"
      >
        <a-input-number
          :min="1"
          :max="999999"
          v-model="infReplyContentSettingForm.sort"
          @mouseenter="infSortMouseOver"
          @mouseout="isInfSortVisible = false"
          @change="onInfSortChange"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 狀態 -->
    <a-form-model-item
      :label="$t('global_status')"
      style="margin-bottom: 0px"
      prop="status"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(infReplyContentValidationForm.status)
      "
      :validateStatus="
        callCommonUtilFeildStatus(infReplyContentValidationForm.status)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(infReplyContentValidationForm.status)"
        :trigger="callCommonUtilFeildTrigger(infReplyContentValidationForm.status)"
        :visible="
          callCommonUtilFeildHoverVisible(infReplyContentValidationForm.status)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(infReplyContentValidationForm.status)
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          v-model="infReplyContentSettingForm.status"
          :options="selectStatusOptions"
          :placeholder="$t('roleSF_pleaseChoose')"
          @change="onStatusChange"
        >
        </a-select>
        <div
          @mouseover="infStatusMouseOver"
          @blur="isInfStatusVisible = false"
        ></div>
      </a-popover>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./InfReplyContentUpdateForm.ts" lang="ts"></script>
