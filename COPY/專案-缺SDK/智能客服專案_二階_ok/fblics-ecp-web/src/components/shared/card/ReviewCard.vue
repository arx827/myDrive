<script setup lang="ts">
interface IProps {
  title: string
}
const $props = defineProps<IProps>()
</script>
<template>
  <div class="overflow-hidden rounded-[4px] bg-primary-light">
    <div class="bg-primary p-[9px] text-center text-white">{{ $props.title }}</div>
    <div class="mx-auto max-w-[80%] py-[16px]">
      <slot name="content"></slot>
    </div>
    <div class="flex justify-center gap-4 pb-[16px]">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped></style>
