<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="notiReplyContentSettingForm"
    :rules="notiReplyContentSettingFormRules"
    ref="notiReplyContentSettingForm"
  >
    <!-- 選單內容 -->
    <a-form-model-item
      :label="$t('infContent')"
      prop="content"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(notiReplyContentValidationForm.content)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiReplyContentValidationForm.content)
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(notiReplyContentValidationForm.content)
        "
        :trigger="
          callCommonUtilFeildTrigger(notiReplyContentValidationForm.content)
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            notiReplyContentValidationForm.content
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiReplyContentValidationForm.content
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="notiReplyContentSettingForm.content"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="50"
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
        callCommonUtilFeildFeedback(notiReplyContentValidationForm.sort)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiReplyContentValidationForm.sort)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(notiReplyContentValidationForm.sort)"
        :trigger="
          callCommonUtilFeildTrigger(notiReplyContentValidationForm.sort)
        "
        :visible="
          callCommonUtilFeildHoverVisible(notiReplyContentValidationForm.sort)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(notiReplyContentValidationForm.sort)
        "
        :destroyTooltipOnHide="true"
      >
        <a-input-number
          :min="1"
          :max="999999"
          v-model="notiReplyContentSettingForm.sort"
          @mouseenter="notiSortMouseOver"
          @mouseout="isNotiStatusVisible = false"
          @change="onNotiSortChange"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 狀態 -->
    <a-form-model-item
      :label="$t('global_status')"
      style="margin-bottom: 0px"
      prop="status"
      required
      v-if="isEditing"
    >
      <a-select
        v-model="notiReplyContentSettingForm.status"
        :options="selectStatusOptions"
        :placeholder="$t('roleSF_pleaseChoose')"
      >
        <!-- @change="onStatusChange" -->
      </a-select>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./NotiReplyContentUpdateForm.ts" lang="ts"></script>
