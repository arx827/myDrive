<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import can from '@imgs/icon_can.svg?url'
import history from '@imgs/icon_history.svg?url'
import send from '@imgs/icon_send.svg?url'
import down from '@imgs/icon_down.svg?url'
import { Modal, message } from 'ant-design-vue'
import { useUser } from '@stores/useUser'
import { useLoadingStore } from '@/stores'
import dayjs from 'dayjs'

import { useOnDutyStore } from '@stores/useOnDutyStore'
import { storeToRefs } from 'pinia'

import { useSocket } from '@composables/useSocket'
const { closeWait } = useOnDutyStore()
const { socketUtil } = useSocket()

const {
  proxy: { $serviceAttendantApi },
} = getCurrentInstance()

const { getServiceInfo } = storeToRefs(useUser())

const chatArea = ref(null)

const { setLoading } = useLoadingStore()

const { getRoleId, chatInput, getActiveChatroomName, getRobotMessage, getWsMessage, getDisabledRoom } = storeToRefs(
  useOnDutyStore(),
)
const { removeConversation, isIncludesTabsArr, addTabs, setRightTabsActive } = useOnDutyStore()

/**
 * API
 */
// API: 取得人工核身驗證URL
const postAPI_getManualVerifyUrl = () => {
  setLoading(true)
  const $submit = {
    cswrRecordId: getRoleId.value.cswrRecordId,
    id: getRoleId.value.clientId,
    userId: getServiceInfo.value.userId,
  }
  $serviceAttendantApi
    .getManualVerifyUrlUsingPOST($submit)
    .then(res => {
      const $getData = res.data
      window.open($getData.url, 'manualVerify', '_blank')
    })
    .catch(error => {
      message.error(error.response.data.message)
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * Event
 */
// const onApprovedMid = () => {
//   console.log('核身 => MID')
// }
const onApprovedArtificial = () => {
  postAPI_getManualVerifyUrl()
}
const onInitiativeToEnd = () => {
  Modal.confirm({
    title: '注意：',
    content: '客戶還在線上，是否確認要結束交談？',
    class: 'modalConfirm',
    getContainer: () => document.querySelector('.setModalPlace'),
    onOk() {
      // 通知 CSWR 結束進線
      let icsChatroom = window.chrome.webview.hostObjects.sync.icsChatroom
      icsChatroom.EndChat()

      socketUtil.socketSend_quitChatroomEvent(getActiveChatroomName.value)
    },
  })
}

const onRightTag = (targetKey: string) => {
  if (!isIncludesTabsArr(targetKey)) {
    addTabs(targetKey)
  }
  setRightTabsActive(targetKey)
}

const onSubmit = () => {
  // send socket
  socketUtil.socketSend_sendMessage({
    chatroomId: getRoleId.value.chatroomId,
    chatroomName: getActiveChatroomName.value,
    messageSendClient: 2,
    messageType: 2,
    messageContent: chatInput.value,
    attendantId: getServiceInfo.value.userId,
    attendantName: getRoleId.value.attendantName,
    sendTime: dayjs(),
  })
  chatInput.value = ''

  closeWait(getActiveChatroomName.value)
}

const scrollChatAreaToBottom = () => {
  chatArea.value.scrollTop = chatArea.value.scrollHeight
}
</script>

<template>
  <div class="setModalPlace relative flex h-[calc(100vh-64px)] flex-1 flex-col overflow-y-auto bg-primary-light">
    <template v-if="getActiveChatroomName">
      <div class="z-10 flex items-center gap-[10px] bg-white py-[8px] pl-[16px] pr-[10px] text-[14px] shadow-md">
        <div class="font-[600]">核身</div>
        <!-- <ButtonRectangle size="small" @click="onApprovedMid">MID</ButtonRectangle> -->
        <ButtonRectangle size="small" @click="onApprovedArtificial" :disabled="getDisabledRoom">人工</ButtonRectangle>

        <div class="ml-auto flex gap-4">
          <ButtonRectangle btnStyle="danger" size="small" @click="removeConversation" v-if="getDisabledRoom"
            >關閉已結束的對話</ButtonRectangle
          >
          <ButtonRectangle btnStyle="danger" size="small" @click="onInitiativeToEnd" :disabled="getDisabledRoom"
            >主動結束服務</ButtonRectangle
          >
        </div>
      </div>
      <section ref="chatArea" class="relative flex flex-1 flex-col overflow-auto p-[15px]">
        <div class="flex-1">
          <!-- Robot -->
          <template v-for="(item, index) in getRobotMessage" :key="index">
            <ChatCardItem_robot :item="item" dataType="onDuty" />
          </template>
          <div
            v-if="getWsMessage?.length > 0"
            class="flex items-center justify-center text-center text-[12px] text-neutral-light2 before:mx-[10px] before:block before:h-[1px] before:w-[50px] before:bg-neutral-light2 after:mx-[10px] after:block after:h-[1px] after:w-[50px] after:bg-neutral-light2"
          >
            真人文字客服對話開始
          </div>
          <!-- webSocket -->
          <template v-for="(item, index) in getWsMessage" :key="index">
            <ChatCardItem_ws :item="item" dataType="onDuty" />
          </template>
          <!-- 預覽客戶發送訊息 -->
          <PreviewChatCardItem dataType="onDuty" v-if="getRoleId.chatroomName" />
        </div>

        <!-- 至底按鈕 -->
        <div class="sticky bottom-0 flex justify-end">
          <ButtonIconic class="h-[40px] w-auto bg-transparent" tooltip="至底" @click.prevent="scrollChatAreaToBottom">
            <img :src="down" alt="" />
          </ButtonIconic>
        </div>
      </section>
      <!-- 輸入欄位 -->
      <div class="border-t-[2px] border-solid border-neutral-entry p-[10px]">
        <div>
          <a-textarea
            v-model:value="chatInput"
            class="overflow-y-auto rounded-[20px] border-neutral-entry px-[16px] py-[10px]"
            :rows="3"
            placeholder="請輸入訊息 (enter：直接發送；shift+enter：換行)"
            allowClear
            :disabled="getDisabledRoom"
            @pressEnter.exact.prevent="onSubmit"
          ></a-textarea>
        </div>
        <div class="mt-[10px] flex w-full">
          <ButtonIconic
            class="h-[40px] w-auto border border-neutral-entry px-[10px]"
            type="roundFull"
            btnStyle="white"
            tooltip="罐頭訊息"
            @click="onRightTag('can')"
            :disabled="getDisabledRoom"
          >
            <img :src="can" alt="" />
          </ButtonIconic>
          <ButtonIconic
            class="ml-[10px] h-[40px] w-auto border border-neutral-entry px-[10px]"
            type="roundFull"
            btnStyle="white"
            tooltip="歷史對話紀錄"
            @click="onRightTag('history')"
            v-if="getRoleId.clientId"
            :disabled="getDisabledRoom"
          >
            <img :src="history" alt="" />
          </ButtonIconic>
          <ButtonIconic
            class="ml-auto h-[40px] w-auto px-[18px]"
            btnStyle="gradient"
            type="roundFull"
            tooltip="送出"
            @click="onSubmit"
            :disabled="chatInput.length <= 0 || getDisabledRoom"
          >
            <img :src="send" alt="" />
          </ButtonIconic>
        </div>
      </div>
    </template>
    <template v-else>
      <span class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[12px] text-neutral-entry"
        >當前沒有進行中的會話</span
      >
    </template>
  </div>
</template>

<style scoped lang="postcss">
:deep(.modalConfirm) {
  .anticon-exclamation-circle {
    color: #f00;
  }
}
</style>
