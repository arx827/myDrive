<script setup lang="ts">
import { computed } from 'vue'
import { useUtils } from '@composables/useUtils'
import type { robotMessageType } from '@stores/use_model'
import { useChatMonitoringStores } from '@stores/useChatMonitoringStores'
import { useOnDutyStore } from '@stores/useOnDutyStore'
import { storeToRefs } from 'pinia'
const { getTime } = useUtils()

const { getChatMonitioringRoleId } = storeToRefs(useChatMonitoringStores())
const { getRoleId } = storeToRefs(useOnDutyStore())

interface PropData {
  item: robotMessageType
  dataType?: 'onDuty' | 'ChatMonitoring'
}
const $props = defineProps<PropData>()

const $data = computed(() => {
  return $props.dataType === 'onDuty' ? getRoleId.value : getChatMonitioringRoleId.value
})

// 顯示 客戶 或 客服 ID
const showMessageName = computed(() => {
  return $props.item.type === 1 ? $data.value.clientId : 'Robot'
})

// 移除 html tag 如：<p>移除標籤</p> => 移除標籤
const messageBlockHtmlTag = computed(() => {
  if (!$props.item.chatContent) return ''
  // 客戶訊息 不用處理 html tag
  if ($props.item.type == 1) return $props.item.chatContent

  // 只針對 客服人員處理
  const regex = RegExp(/<\/?.+?>/g)
  return $props.item.chatContent.replace(regex, '')
})
</script>

<template>
  <div :class="$props.item.type == 1 ? '' : 'justify-end text-right'" class="flex items-start">
    <div class="inlisne-flex flex-col" :class="$props.item.type === 1 ? '' : ' ml-[15px]'">
      <div class="text-[12px] text-neutral-light2">{{ showMessageName }}</div>

      <div class="flex items-end">
        <div
          class="relative mb-[5px] inline-flex max-w-[100%] flex-1 break-words rounded-[20px] px-[15px] py-[10px] text-left shadow-sm"
          :class="$props.item.type == 1 ? 'bg-white text-black' : 'order-1 bg-primary text-white'"
        >
          <div class="min-h-[20px] whitespace-pre-line">{{ messageBlockHtmlTag }}</div>

          <div
            class="before:absolute before:top-[3px] before:h-[12px] before:w-[18px] before:bg-no-repeat"
            :class="
              $props.item.type == 1
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
