<script setup lang="ts">
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { defineProps } from 'vue'
defineProps({
  title: {
    type: String,
    default: '確認刪除？',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const $emit = defineEmits(['confirm'])

/**
 * Event
 */
const onHandleDelete = () => {
  console.log(1)
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
    :disabled="disabled"
    @confirm="onHandleDelete"
  >
    <template #title>
      <div class="d-inline-flex justify-content-start">
        <ExclamationCircleFilled />
        <span class="custom__popConfirm__title">{{ title }}</span>
      </div>
      <slot name="content" />
    </template>
    <slot />
  </a-popconfirm>
</template>

<style lang="scss">
.customPopConfirm {
  max-width: 300px;
  .ant-popover-inner-content {
    padding: 8px 11px 4px;
  }
  .ant-popover-message-title {
    padding-left: 0;
  }
  .ant-popover-message-title {
    // padding-left: 0;
    // display: inline-flex;
    // justify-content: center;
    text-align: center;
    .anticon {
      color: $COLOR-MAIN10;
      margin-top: 0.25rem;
      font-size: 14px;
    }
  }
  .custom__popConfirm__title {
    color: $COLOR-MAIN9;
    padding-left: 6px;
    font-size: 14px;
    text-align: left;
  }
  .ant-popover-buttons {
    display: flex;
    .ant-btn {
      flex: 1;
      margin-left: 0;
      padding: 0 16px;
      &:not(:first-child) {
        margin-left: 8px;
      }
      span {
        font-size: 13px;
      }
    }
    .ant-btn-primary {
      background-color: $COLOR-MAIN9;
      border-color: $COLOR-MAIN9;
    }
  }
}
</style>
