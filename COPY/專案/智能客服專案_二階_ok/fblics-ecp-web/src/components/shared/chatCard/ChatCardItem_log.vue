<script setup lang="ts">
import { computed } from 'vue'
import { useUtils } from '@composables/useUtils'
import type { logMessageType } from '@stores/use_model'
import type { ChatHistoryResultDto } from '@fubonlife/fblics-api-axios-sdk'
const { getTime } = useUtils()

interface PropData {
  customerActiveInfo: ChatHistoryResultDto
  item: logMessageType
  clientId: string
}
const $props = defineProps<PropData>()

// 顯示 客戶 或 客服 ID
const showMessageName = computed(() => {
  return $props.item.type === 1
    ? $props.customerActiveInfo.clientName
    : $props.customerActiveInfo.attendantName || $props.item.attendantId
})
</script>

<template>
  <div :class="$props.item.type === 1 ? '' : 'justify-end text-right'" class="flex items-start">
    <div class="inlisne-flex flex-col" :class="$props.item.type === 1 ? '' : ' ml-[15px]'">
      <div class="text-[12px] text-neutral-light2">{{ showMessageName }}</div>

      <div class="flex items-end">
        <div
          class="relative mb-[5px] inline-flex max-w-[100%] flex-1 break-words rounded-[20px] px-[15px] py-[10px] text-left shadow-sm"
          :class="$props.item.type === 1 ? 'bg-white text-black' : 'order-1 bg-primary text-white'"
        >
          <div class="min-h-[20px] whitespace-pre-line">{{ item.chatContent }}</div>

          <div
            class="before:absolute before:top-[3px] before:h-[12px] before:w-[18px] before:bg-no-repeat"
            :class="
              $props.item.type === 1
                ? 'before:left-[-11px] before:bg-messageLeft'
                : 'before:right-[-11px] before:bg-messageRight'
            "
          ></div>
        </div>
        <div class="mx-[5px] break-keep text-[12px] text-neutral-light2">{{ getTime(item.chatTime) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
