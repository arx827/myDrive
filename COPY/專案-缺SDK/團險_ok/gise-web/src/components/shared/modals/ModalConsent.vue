<script setup lang="ts">
import { defineProps, defineEmits, ref, watchEffect } from 'vue'
interface ModalConsentProp {
  visible: boolean
  width?: number | string
  confirmBtnText?: string
  rejectBtnText?: string
}

const $props = withDefaults(defineProps<ModalConsentProp>(), {
  visible: false,
  width: 500,
  confirmBtnText: '同意',
  rejectBtnText: '不同意',
})

const $emit = defineEmits(['update:visible', 'confirm', 'reject'])
const { handleScroll, isClickable } = useClickable()
const contentRef = ref(null)

watchEffect(() => {
  if (!$props.visible) return
  if (!contentRef.value) return
  checkIsShowConfirmBtn(contentRef.value)
})

function useClickable() {
  const isClickable = ref<boolean>(false)

  // 判斷是否閱讀完內容，才可以點擊按鈕
  const handleScroll = (e: UIEvent) => {
    const target = e.target as Element
    checkIsShowConfirmBtn(target)
  }
  return {
    handleScroll,
    isClickable,
  }
}

const checkIsShowConfirmBtn = (contentElement: Element) => {
  if (contentElement.scrollTop + contentElement.clientHeight >= contentElement.scrollHeight - 2) {
    isClickable.value = true
  }
}

const handleConfirm = () => {
  $emit('confirm')
}

const handleReject = () => {
  $emit('reject')
}
</script>

<template>
  <a-modal
    :width="$props.width"
    :visible="$props.visible"
    :title="null"
    :footer="null"
    :maskClosable="false"
    :closable="false"
    wrap-class-name="gise-consent-modal"
  >
    <div class="flex-1 overflow-y-auto bg-neutral-light p-4" ref="contentRef" @scroll="handleScroll">
      <slot name="content" />
    </div>

    <div class="flex justify-center gap-4 pt-8">
      <ButtonRoundedSecondary @click="handleReject">{{ $props.rejectBtnText }}</ButtonRoundedSecondary>
      <ButtonRoundedPrimary @click="handleConfirm" :disabled="!isClickable">{{
        $props.confirmBtnText
      }}</ButtonRoundedPrimary>
    </div>
  </a-modal>
</template>

<style lang="css" scoped></style>
