<script setup lang="ts">
interface IProps {
  gridData: {
    startTimeHour: string
    startTimeMinute: string
    endTimeHour: string
    endTimeMinute: string
  }
}

const $props = withDefaults(defineProps<IProps>(), {
  gridData: () => ({
    startTimeHour: '',
    startTimeMinute: '',
    endTimeHour: '',
    endTimeMinute: '',
  }),
})
</script>
<template>
  <FormTitle title="覆核 客服人員服務時段" />

  <div class="gap-[32px] md:grid md:grid-cols-3 lg:grid-cols-4">
    <div>
      <div class="text-[14px] font-[600]">文字客服-服務進線時間小時_起</div>
      <div class="mt-[10px] w-full border-b border-neutral-entry">{{ $props.gridData.startTimeHour }}</div>
    </div>
    <div>
      <div class="text-[14px] font-[600]">文字客服-服務進線時間分鐘_起</div>
      <div class="mt-[10px] w-full border-b border-neutral-entry">{{ $props.gridData.startTimeMinute }}</div>
    </div>
    <div>
      <div class="text-[14px] font-[600]">文字客服-服務進線時間小時_迄</div>
      <div class="mt-[10px] w-full border-b border-neutral-entry">{{ $props.gridData.endTimeHour }}</div>
    </div>
    <div>
      <div class="text-[14px] font-[600]">文字客服-服務進線時間分鐘_迄</div>
      <div class="mt-[10px] w-full border-b border-neutral-entry">{{ $props.gridData.endTimeMinute }}</div>
    </div>
  </div>
</template>

<style scoped></style>
