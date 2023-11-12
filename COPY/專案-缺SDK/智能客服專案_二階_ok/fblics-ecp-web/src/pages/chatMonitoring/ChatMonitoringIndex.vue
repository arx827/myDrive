<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance, computed } from 'vue'
import { FblColumnType } from '@shared/dataGrid/models'
import { useRouter } from 'vue-router'
import IconHistoryPrimary from '@/assets/imgs/icon_history-primary.svg?url'
import { useSocket } from '@composables/useSocket'
const { openSocket, socketUtil, unsubscribe, disconnect } = useSocket()

import { storeToRefs } from 'pinia'
import { useChatMonitoringStores } from '@stores/useChatMonitoringStores'

import { useLoadingStore } from '@/stores'
const router = useRouter()
const { setLoading } = useLoadingStore()

const {
  setRobotMessage,
  setLiveMessage,
  getNoResponseDuration,
  initChatMonitioringRoleId,
  setChatMonitioringRoleId,
  // setChatMonitoringList,
} = useChatMonitoringStores()
const {
  getChatMonitoringList,
  getRobotMessage,
  getLiveMessage,
  getWsMessage,
  getChatMonitioringRoleId,
  getMessage_previewClientKeys,
} = storeToRefs(useChatMonitoringStores())
import { Modal } from 'ant-design-vue'

const {
  proxy: { $global, $robotApi, $chatroomClientApi },
} = getCurrentInstance()

const $dataGrid = ref({
  data: [],
  columns: [
    {
      type: FblColumnType.TEMPLATE,
      title: '客戶ID / 交談房號',
      dataIndex: 'clientId',
      bodyCellTemp: 'userIdTemp',
    },
    {
      type: FblColumnType.PLAIN,
      width: '100',
      title: '客服人員',
      dataIndex: 'attendantName',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '對話時長',
      dataIndex: 'chatTime',
      bodyCellTemp: 'chatTimeTemp',
    },
    {
      type: FblColumnType.PLAIN,
      title: '進線時間',
      dataIndex: 'loginTime',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '未回覆時長',
      dataIndex: 'unresponsiveTime',
      bodyCellTemp: 'unresponsiveTimeTemp',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '客戶歷史紀錄',
      width: 60,
      bodyCellTemp: 'historicalIcon',
    },
  ],
})

// 拖跩事件
const resize = ref(null)
const topDom = ref(null)
const downDom = ref(null)

const minSize = 200

// 滑鼠事件
const resize_mouseDown = ele => {
  ele.preventDefault()
  resize.value.classList.add('active')

  document.onmousemove = function (e) {
    const endY = e.clientY

    let topHeight = endY - 16
    if (topHeight < minSize) topHeight = minSize
    if (topHeight > document.body.clientHeight - minSize) topHeight = document.body.clientHeight - minSize
    topDom.value.style.height = `${topHeight}px`
    downDom.value.style.height = `${document.body.clientHeight - 32 - 3 - topHeight}px`
  }
  document.onmouseup = function () {
    document.onmousemove = null
    document.onmouseup = null
    resize.value.classList.remove('active')
  }
}

// 自動計算高度
const resizeEvent = () => {
  const $defaultHeight = `${(document.body.clientHeight - 32 - 3) / 2}px`
  topDom.value.style.height = $defaultHeight
  downDom.value.style.height = $defaultHeight
}

/**
 * API
 */
// API: 6.2.18 即時交談監控 畫面【預先載入該聊天室所有訊息】
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

// API: 6.2.18.2 真人客服聊天紀錄
const postAPI_getLiveChatLog = chatroomName => {
  setLoading(true)
  $chatroomClientApi
    .getChatRoomChatLogUsingPOST(chatroomName)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      setLiveMessage($getData)
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
// 點擊 客戶ID，底下顯示即時交談
const openLiveChat = record => {
  // 設定 作用中的監控 資訊
  initChatMonitioringRoleId()
  setChatMonitioringRoleId(record)

  // 載入 機器人 歷史對話
  postAPI_getRobotChatLog(record.mobvoiChatId)

  // 載入 真人客服 歷史對話
  postAPI_getLiveChatLog(record.chatroomName)

  // 訂閱 socket 預覽客戶發送訊息
  socketUtil.socket_previewClientMessage(getChatMonitioringRoleId.value.chatroomName)
}

// 開啟客戶歷史紀錄
const gotoDetail = ({ clientId }) => {
  router.push({ name: 'ChatMonitoringDetail', params: { clientId } })
}

/**
 * Hook
 */
onMounted(async () => {
  resizeEvent()
  window.addEventListener('resize', resizeEvent)
  await openSocket()
  // 取得 即時交談監控 列表
  socketUtil.socket_onlineChattingClients()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEvent)
  disconnect()
})
</script>
<template>
  <div
    ref="topDom"
    class="overflow-auto rounded-t-[4px] px-[32px] pb-[32px] pt-[10px] transition-all duration-0 ease-linear"
  >
    <FormTitle title="即時交談監控" />
    <div class="mb-2">客服正在服務的線上的客戶：</div>
    <FblDataGrid
      class="gise-beneficiary-table"
      :columns="$dataGrid.columns"
      :data-source="getChatMonitoringList"
      :pagination="false"
    >
      <template #userIdTemp="{ scope: { record } }">
        <span class="cursor-pointer text-primary" @click="openLiveChat(record)">{{
          record.clientId || record.chatroomName
        }}</span>
      </template>
      <!-- 對話時長 -->
      <template #chatTimeTemp="{ scope: { record } }">
        <ConversationDuration :data-time="record.loginTime" :solar="true" />
      </template>
      <!-- 未回覆時長 -->
      <template #unresponsiveTimeTemp="{ scope: { record } }">
        {{ getNoResponseDuration(record.chatroomName) }}
      </template>
      <template #historicalIcon="{ scope: { text } }">
        <!-- 歷史按鈕 -->
        <ButtonIconic type="card" btnStyle="white" @click="gotoDetail(text)" class="mx-auto">
          <img :src="IconHistoryPrimary" alt="" />
        </ButtonIconic>
      </template>
    </FblDataGrid>
  </div>
  <div ref="resize" class="resize" @mousedown="resize_mouseDown"></div>
  <div
    ref="downDom"
    class="overflow-auto rounded-b-[4px] bg-primary-light px-[30px] py-[32px] transition-all duration-0 ease-linear"
  >
    <!-- Robot -->
    <template v-for="(item, index) in getRobotMessage" :key="index">
      <ChatCardItem_robot :item="item" />
    </template>

    <!-- 真人訊息 分隔線  -->
    <div
      v-if="getWsMessage?.length > 0 || getLiveMessage?.length > 0"
      class="flex items-center justify-center text-center text-[12px] text-neutral-light2 before:mx-[10px] before:block before:h-[1px] before:w-[50px] before:bg-neutral-light2 after:mx-[10px] after:block after:h-[1px] after:w-[50px] after:bg-neutral-light2"
    >
      真人文字客服對話開始
    </div>

    <!-- 真人客服 -->
    <template v-for="(item, index) in getLiveMessage" :key="index">
      <ChatCardItem_live :item="item" :closeAttendantName="false" />
    </template>

    <!-- wedSocket -->
    <template v-for="(item, index) in getWsMessage" :key="index">
      <ChatCardItem_ws :item="item" />
    </template>

    <!-- 預覽客戶發送訊息 -->
    <PreviewChatCardItem v-if="getMessage_previewClientKeys.includes(getChatMonitioringRoleId.chatroomName)" />
  </div>
</template>

<style scoped lang="postcss">
.resize {
  @apply relative h-[3px] w-full cursor-row-resize bg-secondary;
  &.active,
  &:hover {
    @apply bg-primary;
  }
}
</style>
