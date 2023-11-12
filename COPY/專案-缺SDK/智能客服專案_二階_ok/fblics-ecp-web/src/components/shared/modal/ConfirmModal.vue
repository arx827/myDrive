<script setup lang="ts">
import { withDefaults } from 'vue'

interface IProps {
  visible?: boolean
}

const $props = withDefaults(defineProps<IProps>(), {
  visible: false,
})
const $emit = defineEmits(['update:visible', 'confirmModal', 'closeModal'])

const closeModal = () => {
  $emit('update:visible', false)
}
</script>

<template>
  <a-modal
    :visible="$props.visible"
    :wrapClassName="'modal__primary'"
    :title="false"
    @cancel="closeModal"
    width="490px"
    :footer="false"
    :closable="false"
    :maskClosable="false"
  >
    <div class="mb-[26px]">
      <slot />
    </div>

    <slot name="footer" />
  </a-modal>
</template>

<style lang="scss" scoped></style>
