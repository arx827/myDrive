<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="notiDaySettingForm"
    :rules="notiDaySettingFormRules"
    ref="notiDaySettingForm"
  >
    <!-- 類型 -->
    <a-form-model-item
      :label="$t('global_type')"
      prop="type"
      style="margin-bottom: 0px"
    >
      <p>{{ typeDescription }}</p>
    </a-form-model-item>
    <!-- 設定工作天數 -->
    <a-form-model-item
      :label="$t('notification_workingDay_setting')"
      prop="workingDay"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(notiDayValidationForm.workingDay)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiDayValidationForm.workingDay)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(notiDayValidationForm.workingDay)"
        :trigger="callCommonUtilFeildTrigger(notiDayValidationForm.workingDay)"
        :visible="
          callCommonUtilFeildHoverVisible(notiDayValidationForm.workingDay)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(notiDayValidationForm.workingDay)
        "
        :destroyTooltipOnHide="true"
      >
        <a-input-number
          :min="1"
          :max="20"
          v-model="notiDaySettingForm.workingDay"
          @mouseenter="notiWorkingDayMouseOver"
          @mouseout="isNotiWorkingDayVisible = false"
          @change="onNotiWorkingDayChange()"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 備註說明 -->
    <a-form-model-item
      :label="$t('notification_remark')"
      style="margin-bottom: 0px"
      prop="remark"
      required
      :has-feedback="callCommonUtilFeildFeedback(notiDayValidationForm.remark)"
      :validateStatus="callCommonUtilFeildStatus(notiDayValidationForm.remark)"
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(notiDayValidationForm.remark)"
        :trigger="callCommonUtilFeildTrigger(notiDayValidationForm.remark)"
        :visible="callCommonUtilFeildHoverVisible(notiDayValidationForm.remark)"
        @visibleChange="
          callCommonUtilFeildVisibleChange(notiDayValidationForm.remark)
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="notiDaySettingForm.remark"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="100"
        />
      </a-popover>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./NotiDayUpdateForm.ts" lang="ts"></script>
<style scoped>
::v-deep .ant-form-explain {
  display: none;
}
</style>