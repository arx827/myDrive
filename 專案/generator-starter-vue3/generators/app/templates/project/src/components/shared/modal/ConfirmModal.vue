<script setup lang="ts">
import { onMounted } from 'vue'
const $props = defineProps({
  title: {
    type: String,
    default: '',
  },
  visible: {
    type: Boolean,
    default: false,
  },
})
const $emit = defineEmits(['update:visible', 'confirmModal', 'closeModal'])

const closeModal = () => {
  $emit('update:visible', false)
}

/**
 * Event
 */
const handleConfirm = () => {
  $emit('confirmModal')
}

const handleCancel = () => {
  $emit('closeModal')
}

/**
 * Hooks
 */
onMounted(() => {
  // console.log(grid.columns)
  // console.log(renderArr)
})
</script>

<template>
  <a-modal
    :visible="$props.visible"
    :wrapClassName="'modal__primary'"
    :title="$props.title"
    :footer="$attrs.footer"
    @cancel="closeModal"
  >
    <div class="modal__content">
      <slot name="content" />
    </div>

    <!-- 沒prop近來的預設 -->
    <template #footer v-if="$attrs.footer !== null">
      <slot name="footer">
        <div class="modal-btn__wrap d-flex justify-content-center gap-3">
          <button class="modal-btn modal-btn__secondary" @click="handleCancel">取消</button>
          <button class="modal-btn modal-btn__primary" @click="handleConfirm">確認</button>
        </div>
      </slot>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped></style>
