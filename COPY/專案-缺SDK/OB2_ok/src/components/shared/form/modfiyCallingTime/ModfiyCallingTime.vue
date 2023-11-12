<template>
  <a-form-model :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
    <a-form-model-item
      :label="$t('pending_date_modified')"
      style="margin-bottom: 0px"
      required
      :has-feedback="modifyCallDateFormValidateForm.dueContDateChg.feedback"
      :validateStatus="modifyCallDateFormValidateForm.dueContDateChg.state"
    >
      <a-popover
        placement="top"
        :content="modifyCallDateFormValidateForm.dueContDateChg.content"
        :trigger="modifyCallDateFormValidateForm.dueContDateChg.trigger"
        :visible="isDueContDateChgVisible"
        :destroyTooltipOnHide="true"
      >
        <DatePicker
          :formatter="formatter"
          :range="false"
          style="width: 100%"
          :clearable="true"
          @clear="cleardueContDateChg"
          v-model="modifyCallDateForm.dueContDateChg"
          @change="onModifyDateChange"
        >
          <a-input
            slot="input"
            :value="modifyCallDateForm.dueContDateChgString"
            @mouseover="dueContDateChgMouseOver"
            @mouseleave="isDueContDateChgVisible = false"
          ></a-input>
          <i
            v-if="modifyCallDateFormValidateForm.dueContDateChg.feedback"
            slot="icon-calendar"
          ></i>
        </DatePicker>
      </a-popover>
    </a-form-model-item>

    <a-form-model-item
      class="singleCol"
      :label="$t('pending_callDate_reason')"
      style="margin-bottom: 0px"
      :has-feedback="
        modifyCallDateFormValidateForm.dueContDateChgReason.feedback
      "
      :validateStatus="
        modifyCallDateFormValidateForm.dueContDateChgReason.state
      "
      required
    >
      <a-popover
        placement="top"
        :content="modifyCallDateFormValidateForm.dueContDateChgReason.content"
        :trigger="modifyCallDateFormValidateForm.dueContDateChgReason.hover"
        :visible="isDueContDateChgReasonVisible"
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="modifyCallDateForm.dueContDateChgReason"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="50"
          @change="onReasonChange"
          ref="modifyCallTime"
          :placeholder="$t('pending_input_50words_allow')"
          @mouseenter="dueContDateChgReasonMouseOver"
          @mouseout="isDueContDateChgReasonVisible = false"
        />
      </a-popover>
    </a-form-model-item>
  </a-form-model>
</template>
<script src="./ModfiyCallingTime.ts" lang="ts"></script>
