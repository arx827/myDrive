<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'

import { useOnDutyStore } from '@stores/useOnDutyStore'
import { useLoadingStore } from '@/stores'
import { Modal } from 'ant-design-vue'

import { useSocket } from '@composables/useSocket'
const { socketUtil } = useSocket()

const { getConversationArr, getActiveChatroomName, getRoleId } = storeToRefs(useOnDutyStore())
const { setRoomInfo, setRobotMessage } = useOnDutyStore()

const {
  proxy: { $global, $robotApi },
} = getCurrentInstance()

const { setLoading } = useLoadingStore()

/**
 * API
 */
// API: 6.2.18 值機訊息畫面【預先載入該聊天室所有訊息】
const postAPI_getRobotChatLog = mobvoiChatId => {
  setLoading(true)
  $robotApi
    .getRobotChatLogUsingPOST(mobvoiChatId)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      setRobotMessage($getData)
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

/**
 * Event
 */
const clickConversationBtn = item => {
  // 目前正在此對話視窗的話，不做任何動作
  if (getActiveChatroomName.value === item.chatroomName) return
  setRoomInfo(item)
  // 載入 機器人對話
  postAPI_getRobotChatLog(item.mobvoiChatId)

  // 訂閱 socket 預覽客戶發送訊息
  socketUtil.socket_previewClientMessage(getRoleId.value.chatroomName)
}
</script>

<template>
  <div
    class="h-[calc(100vh-64px)] w-[175px] overflow-y-auto border-r-[2px] border-solid border-neutral-entry bg-neutral-light px-[9px] py-[12px]"
  >
    <template v-for="(item, index) in getConversationArr" :key="index">
      <ItemConversation
        :propData="item"
        @click="clickConversationBtn(item)"
        :active="getActiveChatroomName === item.chatroomName"
      />
    </template>
  </div>
</template>

<style scoped lang="postcss"></style>
