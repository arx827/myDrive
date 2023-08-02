<script setup lang="ts">
import { useAttrs, computed } from 'vue'
const widthEnum = {
  lg: '1200px',
  md: '600px',
  sm: '470px',
}
const $props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '提醒',
  },
  width: {
    type: String,
    default: null,
  },
  centered: {
    type: Boolean,
    default: false,
  },
  footer: Boolean,
})

const getWidth = computed(() => {
  return $props.width && widthEnum[$props.width.toLowerCase()]
})

const $attr = useAttrs()
const $emit = defineEmits(['update:visible', 'cancel', 'afterClose'])

/**
 * Event
 */
const $emit_cancel = () => {
  $emit('cancel')
}
const $emit_afterClose = () => {
  $emit('afterClose')
}
</script>
<template>
  <!-- 自定義彈窗 -->
  <a-modal
    :visible="$props.visible"
    :title="$props.title"
    :width="getWidth"
    :centered="$props.centered"
    :style="$attr.style"
    @afterClose="$emit_afterClose"
    @cancel="$emit_cancel"
  >
    <slot></slot>
    <template #footer v-if="!$props.footer">
      <slot name="footer" />
    </template>
  </a-modal>
</template>
