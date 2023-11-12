<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoadingStore } from '@/stores'

import { useSocket } from '@composables/useSocket'

import { useChatMonitoringStores } from '@stores/useChatMonitoringStores'
import { message, Modal } from 'ant-design-vue'

import type { ChatHistoryResultDto } from '@fubonlife/fblics-api-axios-sdk'

const { setMessage_history } = useChatMonitoringStores()

const { openSocket, disconnect } = useSocket()

const route = useRoute()
const router = useRouter()

const { setLoading } = useLoadingStore()

const {
  proxy: { $global, $chatroomClientApi },
} = getCurrentInstance()

// 左側 list
const conversationHistory = ref<ChatHistoryResultDto[]>([])

// 作用中的 左側 list 資料
const customerActiveInfo = ref<ChatHistoryResultDto>({})

// 客戶 Id
const $clientId = ref('')

/**
 * API
 */
// API: 6.2.21.1 客戶歷史列表清單
const postAPI_getChatHistoryList = clientId => {
  setLoading(true)
  $chatroomClientApi
    .getChatHistoryListUsingPOST(clientId)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      conversationHistory.value = $getData
    })
    .catch(error => {
      Modal.error({
        content: `${error.response.data.message || error.response.data.error}，請重新操作`,
      })
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: 6.2.21.2 客戶歷史聊天內容
const postAPI_getChatRoomChatLog = chatroomName => {
  setLoading(true)
  $chatroomClientApi
    .getChatRoomChatLogUsingPOST(chatroomName)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      setMessage_history($getData)
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * Event
 */
// 切換 左側 list
const clickCustomerListItem = item => {
  customerActiveInfo.value = item
  postAPI_getChatRoomChatLog(item.chatroomName)
}

// 返回
const goBack = () => {
  router.replace({ name: 'ChatMonitoringIndex' })
}

/**
 * Hook
 */
onMounted(async () => {
  await openSocket()
  $clientId.value = route.params.clientId as string
  // 取得 客戶歷史列表清單
  postAPI_getChatHistoryList($clientId.value)
})
onUnmounted(() => {
  disconnect()
})
</script>
<template>
  <div class="px-[32px] py-[10px]">
    <FormTitle title="特定客戶交談歷史紀錄" />
    <div class="mb-2">
      <span class="font-bold">客戶ID：{{ $clientId }}</span>
      過去7日內的進線歷程(查詢七日以前紀錄，請改用來電紀錄查詢功能)：
    </div>
    <div class="flex min-h-[200px] w-full overflow-hidden rounded-[10px] shadow-[0_3px_6px_#00000029]">
      <!-- 左側 歷史紀錄 選單 -->
      <div
        class="max-h-[501px] w-[180px] overflow-y-auto bg-neutral-light px-[8px]"
        v-if="conversationHistory.length > 0"
      >
        <template v-for="(item, index) in conversationHistory" :key="index">
          <CustomerList
            :propData="item"
            :activeId="customerActiveInfo.mobvoiChatId"
            :clientId="$clientId"
            @click="clickCustomerListItem(item)"
          />
        </template>
      </div>
      <!-- 右側 聊天記錄 -->
      <div class="max-h-[501px] flex-1 overflow-y-auto shadow-[0_3px_6px_#00000029]">
        <ChatAreaMonitoring class="min-h-full" :customerActiveInfo="customerActiveInfo" :clientId="$clientId" />
      </div>
    </div>

    <div class="my-[16px] flex justify-center">
      <ButtonRectangle btn-style="outline" letter @click="goBack">返回</ButtonRectangle>
    </div>
  </div>
</template>

<style scoped></style>
