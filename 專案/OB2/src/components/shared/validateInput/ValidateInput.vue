<template>
  <div>
    <a-popover
      :placement="itemPlacement"
      :content="callCommonUtilFeild(validateForm).msg"
      :trigger="callCommonUtilFeild(validateForm).hover"
      :visible="callCommonUtilFeild(validateForm).hoverVisible"
      @visibleChange="
        callCommonUtilFeildVisibleChange(validateForm)
      "
      :destroyTooltipOnHide="true"
    >
      <a-input
        type="text"
        :value="value"
        :max-length="maxLength"
        @input="$emit('input', $event.target.value)"
        :style="mergeBodyStyle"
      />
    </a-popover>
  </div>
</template>
<script src="./ValidateInput.ts" lang="ts"></script>
