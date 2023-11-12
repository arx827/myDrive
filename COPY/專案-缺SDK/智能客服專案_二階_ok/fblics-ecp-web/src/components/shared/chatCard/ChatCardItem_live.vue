<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUtils } from '@composables/useUtils'
import type { liveMessageType } from '@stores/use_model'
import { useChatMonitoringStores } from '@stores/useChatMonitoringStores'
import { storeToRefs } from 'pinia'

const { getChatMonitioringRoleId } = storeToRefs(useChatMonitoringStores())
const { getTime } = useUtils()
interface PropData {
  item: liveMessageType
  closeAttendantName?: boolean
}
const $props = defineProps<PropData>()

const $clientId = ref(getChatMonitioringRoleId.value.clientId)
const $attendantName = ref(getChatMonitioringRoleId.value.attendantName)

// 顯示 客戶 或 客服 ID
const showMessageName = computed(() => {
  return $props.item.messageType === 1 ? $clientId.value : $attendantName.value
})
</script>

<template>
  <div :class="$props.item.messageType === 1 ? '' : 'justify-end text-right'" class="flex items-start">
    <div class="inlisne-flex flex-col" :class="$props.item.messageType === 1 ? '' : ' ml-[15px]'">
      <div class="text-[12px] text-neutral-light2" v-show="$props.item.messageType === 1 || !closeAttendantName">
        {{ showMessageName }}
      </div>

      <div class="flex items-end">
        <div
          class="relative mb-[5px] inline-flex max-w-[100%] flex-1 break-words rounded-[20px] px-[15px] py-[10px] text-left shadow-sm"
          :class="$props.item.messageType === 1 ? 'bg-white text-black' : 'order-1 bg-primary text-white'"
        >
          <div class="min-h-[20px] whitespace-pre-line">{{ item.messageContent }}</div>

          <div
            class="before:absolute before:top-[3px] before:h-[12px] before:w-[18px] before:bg-no-repeat"
            :class="
              $props.item.messageType === 1
                ? 'before:left-[-11px] before:bg-messageLeft'
                : 'before:right-[-11px] before:bg-messageRight'
            "
          ></div>
        </div>
        <div class="mx-[5px] break-keep text-[12px] text-neutral-light2">{{ getTime(item.sendTime) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
