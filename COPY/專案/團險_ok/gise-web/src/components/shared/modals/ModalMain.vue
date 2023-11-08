<script setup lang="ts">
import type { ModalProps } from 'ant-design-vue'
import closeImgSVG from '@/assets/imgs/button_close_2.svg?url'
import { defineProps, defineEmits, useAttrs, ref, watch } from 'vue'
interface MainModalProp extends ModalProps {
  visible: boolean
  title: string
  width?: number | string
  confirmBtnText?: string
  rejectBtnText?: string
}

const $props = withDefaults(defineProps<MainModalProp>(), {
  visible: false,
  width: 1040,
  title: '',
})

const $attr = useAttrs()

const $emit = defineEmits(['update:visible', 'cancel'])

const handleClose = () => {
  $emit('update:visible', false)
}

const contentRef = ref<HTMLElement | null>(null)
watch(
  () => $props.visible,
  value => {
    if (value === true) return
    if (contentRef.value?.scrollTop) contentRef.value.scrollTop = 0
  },
)
</script>
<template>
  <a-modal
    :visible="$props.visible"
    :title="null"
    :footer="null"
    :closable="false"
    :width="$props.width"
    wrap-class-name="gise-main-modal"
    v-bind="$attr"
    @cancel="handleClose"
  >
    <div
      class="fixed right-[26px] top-[16px] z-10 flex h-[34px] w-[34px] cursor-pointer justify-center rounded-full bg-black bg-opacity-60 align-middle shadow-md md:hidden"
      @click="handleClose"
    >
      <img class="h-[10px] w-[10px] self-center brightness-0 invert" :src="closeImgSVG" alt="" />
    </div>
    <div
      class="relative z-40 flex justify-between border-b-[1px] border-neutral-entry bg-white px-4 pb-3 pt-5 align-middle text-base font-semibold md:border-b-0 md:py-4 md:text-3xl lg:px-12"
    >
      {{ $props.title }}
      <div
        class="z-60 flex cursor-pointer justify-center align-middle md:absolute md:right-[-33px] md:top-[-33px] md:h-[34px] md:w-[34px] md:rounded-full md:bg-white md:shadow-md"
        @click="handleClose"
      >
        <img class="h-[10px] w-[10px] self-center" :src="closeImgSVG" alt="" />
      </div>
    </div>
    <div
      ref="contentRef"
      class="md:max-h-ful flex-1 rounded-b-md p-4 md:mx-4 md:overflow-y-auto md:bg-info-light md:p-8 lg:mx-12"
    >
      <slot name="content" />
    </div>
    <div class="p-4 md:pb-0">
      <slot name="footer" />
    </div>
  </a-modal>
</template>

<style lang="css" scoped></style>
