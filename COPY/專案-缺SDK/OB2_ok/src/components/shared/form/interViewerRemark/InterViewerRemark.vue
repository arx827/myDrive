<template>
  <a-form-model 
  :label-col="{ span: 2 }" 
  :wrapper-col="{ span: 16 }">
    <a-form-model-item
      class="singleCol"
      :label="$t('global_remark')"
      style="margin-bottom: 0px"
      :has-feedback="
        interViewerRemarkValidateForm.remark.feedback
      "
      :validateStatus="
        interViewerRemarkValidateForm.remark.state
      "
    >
      <a-popover
        placement="top"
        :trigger="interViewerRemarkValidateForm.remark.hover"
        :content="interViewerRemarkValidateForm.remark.content"
        :visible="isInterViewerRemarkVisible"
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="interViewerRemarkForm.remark"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="500"
          @change="onRemarkChange"
          @mouseenter="interViewerRemarkMouseOver"
          @mouseout="isInterViewerRemarkVisible = false"
        />
      </a-popover>
    </a-form-model-item>
  </a-form-model>
</template>


<script src="./InterViewerRemark.ts" lang="ts"></script>