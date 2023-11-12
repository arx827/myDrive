<template>
<div>
  <a-row><p>{{$t('noticeManualLetterForm_receiver')}}{{$props.initData.receiver}}</p></a-row>
<a-row>
  <a-form-model 
   :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    ref="mailLetterCancelForm"
    :rules="mailLetterCancelFormRules"
    >
    
    <a-form-model-item
      :label="$t('mailNotice_grid_cancelLetterReason')"
      required
    :has-feedback="
            callCommonUtilFeildFeedback(mailLetterCancelValidationForm.cancelReason)
          "
          :validateStatus="
            callCommonUtilFeildStatus(mailLetterCancelValidationForm.cancelReason)
          "
        >
          <a-popover
            placement="top"
            :content="
              callCommonUtilFeildMsg(mailLetterCancelValidationForm.cancelReason)
            "
            :trigger="
              callCommonUtilFeildTrigger(mailLetterCancelValidationForm.cancelReason)
            "
            :visible="
              callCommonUtilFeildHoverVisible(
                mailLetterCancelValidationForm.cancelReason
              )
            "
            @visibleChange="
              callCommonUtilFeildVisibleChange(
                mailLetterCancelValidationForm.cancelReason
              )
            "
            :destroyTooltipOnHide="true"
          >
        <a-textarea
          type="text"
          v-model="mailLetterCancelForm.cancelReason"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="200"
          @change="onSelectCancelReason()"
        />
          </a-popover>
    </a-form-model-item>
    
  </a-form-model>

  </a-row>
  </div>
 
</template>


<script src="./MailLetterCancelForm.ts" lang="ts"></script>