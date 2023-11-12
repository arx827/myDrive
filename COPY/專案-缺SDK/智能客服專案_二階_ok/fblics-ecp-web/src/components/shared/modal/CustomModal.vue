<script setup lang="ts">
import { useAttrs, computed, withDefaults } from 'vue'
const widthEnum = {
  lg: '1200px',
  md: '600px',
  sm: '303px',
}

interface IProps {
  visible?: boolean
  title?: string
  width?: string
  centered?: boolean
  footer?: boolean
}

const $props = withDefaults(defineProps<IProps>(), {
  visible: false,
  title: '提醒',
  width: 'sm',
  centered: false,
  footer: false,
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
  $emit('update:visible', false)
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
