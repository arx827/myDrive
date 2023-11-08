<script setup lang="ts">
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
const $props = defineProps({
  title: {
    type: String,
    default: '確認刪除？',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  popupContainer: {
    type: String,
  },
})

const $emit = defineEmits(['confirm'])

const getPopupContainer = triggerNode => {
  if (triggerNode) {
    // 有自定義 popupContainer 時，以自定義為主
    if ($props.popupContainer) {
      return document.querySelector($props.popupContainer)
    } else {
      return triggerNode?.parentNode
    }
  } else {
    return document.body
  }
}

/**
 * Event
 */
const onHandleDelete = () => {
  $emit('confirm')
}
</script>

<template>
  <a-popconfirm
    placement="top"
    ok-text="確定"
    cancel-text="取消"
    icon=" "
    overlay-class-name="customPopConfirm"
    :disabled="$props.disabled"
    :getPopupContainer="getPopupContainer"
    @confirm="onHandleDelete"
  >
    <template #title>
      <div class="flex justify-center">
        <ExclamationCircleFilled class="text-base text-warning" />
        <span class="pl-[6px] text-left text-base" v-html="$props.title"></span>
      </div>
      <slot name="content" />
    </template>

    <!-- <template #cancelButton>
      <ButtonRectangle>取消</ButtonRectangle>
    </template>
    <template #okButton>
      <ButtonRectangle @click="onHandleDelete">確定</ButtonRectangle>
    </template> -->
    <slot />
  </a-popconfirm>
</template>

<style lang="postcss">
.customPopConfirm {
  /* max-width: 300px; */
  .ant-popover-inner-content {
    @apply px-[11px] pb-[4px] pt-[8px];
  }
  .ant-popover-message-title {
    @apply pl-0 text-center;
  }
  .ant-popover-buttons {
    @apply flex;
    .ant-btn {
      @apply ml-0 flex-1 px-[16px];
      &:not(:first-child) {
        @apply ml-[8px];
      }
      & span {
        @apply text-[13px];
      }
    }
    .ant-btn-primary {
      @apply bg-primary;
    }
  }
}
</style>
