<script setup lang="ts">
import svgEdit from '@imgs/button_edit.svg?component'
interface CardShadowAngleProp {
  title: string
}
const $props = defineProps<CardShadowAngleProp>()

const $emit = defineEmits(['edit'])
function onEdit() {
  $emit('edit')
}
</script>
<template>
  <div
    class="-mx-[15px] my-2 bg-white px-[15px] py-[13px] shadow-[0_0_12px_rgba(0,0,0,0.1)] md:mx-0 md:p-4 lg:px-8 lg:py-[18px]"
  >
    <div class="flex items-center justify-between">
      <h4 class="border-l-4 pl-2 text-lg font-bold leading-[22px] text-info lg:text-2xl">
        {{ $props.title }}
      </h4>
      <ButtonIconic tooltip="編輯" @click="onEdit" :hoverWhite="true">
        <svgEdit />
      </ButtonIconic>
    </div>
    <slot />
  </div>
</template>
<style scoped></style>
