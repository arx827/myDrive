<script setup lang="ts">
interface IProps {
  gridData: string
}

const $props = withDefaults(defineProps<IProps>(), {
  gridData: () => '',
})
</script>
<template>
  <FormTitle title="覆核 非服務時段宣告文字訊息" />

  <div>
    <div>
      <div class="text-[14px] font-[600]">非服務時段宣告文字訊息(支援HTML)</div>
      <div class="mt-[10px] w-full border-b border-neutral-entry pb-[10px]">{{ $props.gridData }}</div>
    </div>

    <div class="mt-[20px]">
      <div class="text-[14px] font-[600]">預覽</div>
      <div class="previewBox mt-[10px] w-full border-b border-neutral-entry pb-[10px]" v-html="$props.gridData"></div>
    </div>
  </div>
</template>

<style scoped></style>
