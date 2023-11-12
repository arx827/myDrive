<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useChatMonitoringStores } from '@stores/useChatMonitoringStores'

import type { ChatHistoryResultDto } from '@fubonlife/fblics-api-axios-sdk'

const chatArea = ref(null)
interface PropData {
  customerActiveInfo: ChatHistoryResultDto
  clientId: string
}
const $props = defineProps<PropData>()
const { getMessage_history } = storeToRefs(useChatMonitoringStores())
</script>

<template>
  <!-- 中間 對話區塊 -->
  <div class="relative flex min-h-full flex-1 flex-col bg-primary-light">
    <section ref="chatArea" class="relative flex flex-1 flex-col overflow-auto p-[15px]">
      <div class="flex-1">
        <!-- 歷史訊息 getMessage_history -->
        <template v-if="getMessage_history.length > 0">
          <template v-for="(item, index) in getMessage_history" :key="index">
            <ChatCardItem_log :item="item" :clientId="$props.clientId" :customerActiveInfo="customerActiveInfo" />
          </template>
        </template>
        <template v-else>
          <span
            class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[12px] text-neutral-entry"
            >當前沒有進行中的會話</span
          >
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss"></style>
