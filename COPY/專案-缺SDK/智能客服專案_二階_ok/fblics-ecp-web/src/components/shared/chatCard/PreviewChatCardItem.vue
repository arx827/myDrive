<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatMonitoringStores } from '@stores/useChatMonitoringStores'
import { useOnDutyStore } from '@stores/useOnDutyStore'
const { getMessage_previewClient, getChatMonitioringRoleId } = storeToRefs(useChatMonitoringStores())
const { getRoleId } = storeToRefs(useOnDutyStore())

interface PropData {
  dataType?: 'onDuty' | 'ChatMonitoring'
}
const $props = defineProps<PropData>()

const $data = computed(() => {
  return $props.dataType === 'onDuty' ? getRoleId.value : getChatMonitioringRoleId.value
})

// 顯示 客戶 或 客服 ID
const showMessageName = computed(() => {
  return $data.value.clientId
})
const getChatRoomName = computed(() => {
  return $data.value.chatroomName
})
</script>

<template>
  <div class="flex items-start" v-if="getMessage_previewClient[getChatRoomName]">
    <div class="inlisne-flex flex-col">
      <div class="text-[12px] text-neutral-light2">{{ showMessageName }}</div>
      <div class="flex items-end">
        <div
          class="relative mb-[5px] inline-flex max-w-[100%] flex-1 break-words rounded-[20px] bg-warning-light px-[15px] py-[10px] text-left shadow-sm"
        >
          <div>
            {{ getMessage_previewClient[getChatRoomName] }}
            <span>...</span><span class="cursorShine">|</span>
          </div>

          <div
            class="before:absolute before:left-[-11px] before:top-[3px] before:h-[12px] before:w-[18px] before:bg-messageWrittingLeft before:bg-no-repeat"
          ></div>
        </div>
        <div class="mx-[5px] break-keep text-[12px] text-warning">輸入中...</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
