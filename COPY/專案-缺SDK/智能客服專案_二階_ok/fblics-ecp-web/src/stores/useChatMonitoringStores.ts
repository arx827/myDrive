import { defineStore } from 'pinia'
import { ref, computed, onMounted, nextTick } from 'vue'
import type {
  logMessageType,
  chatMonitoringListType,
  conversationMessageType,
  robotMessageType,
  activeChatroomType,
} from './use_model'

// roleId 資訊
const roleId = ref<conversationMessageType>({
  chatroomId: null,
  chatroomName: '',
  clientId: '',
  clientIp: '',
  cswrRecordId: '',
  loginSystem: '',
  loginTime: '',
  mobvoiChatId: '',
  name: '',
  attendantName: '',
  clientValidation: '',
})

// 正在服務的線上列表 須記錄 即時交談
const chatMonitoringGroup = ref<conversationMessageType[]>([])

// 歷史紀錄
const message_history = ref<logMessageType[]>([])
// ----------- 預覽客戶發送訊息 ----------- //
const message_previewClient = ref({})
export const useChatMonitoringStores = defineStore('chatMonitoring', () => {
  // 正在服務的線上列表
  const addChatMonitoringList = payload => {
    const $index = getChatMonitoringChatRoomNameList.value.indexOf(payload.chatroomName)
    // 判斷是否已在上方列表中，不存在才執行新增
    if ($index < 0) {
      // push
      chatMonitoringGroup.value.push({
        ...payload,
        noResponseDuration: '',
        robotMessage: [],
        liveMessage: [],
        wsMessage: [],
      })
      // 是否訂閱 未回覆時長
      return true
    } else {
      // 是否訂閱 未回覆時長
      return false
    }
  }
  const removeChatMonitoring = chatroomName => {
    const $index = getChatMonitoringChatRoomNameList.value.indexOf(chatroomName)
    if ($index > -1) {
      chatMonitoringGroup.value.splice($index, 1)
    }
  }
  // const setChatMonitoringList = payload => {
  //   chatMonitoringGroup.value = payload
  // }
  // const resetChatMonitoringList = () => {
  //   chatMonitoringGroup.value = []
  // }
  const getChatMonitoringList = computed(() => chatMonitoringGroup.value)
  const getChatMonitoringChatRoomNameList = computed(() => chatMonitoringGroup.value.map(i => i.chatroomName))

  const initChatMonitioringRoleId = () => {
    Object.assign(roleId.value, {
      chatroomId: null,
      chatroomName: '',
      clientId: '',
      clientIp: '',
      cswrRecordId: '',
      loginSystem: '',
      loginTime: '',
      mobvoiChatId: '',
      name: '',
      attendantName: '',
      clientValidation: '',
    })
  }
  const setChatMonitioringRoleId = payload => {
    roleId.value.chatroomName = payload.chatroomName
    roleId.value.clientId = payload.clientId
    roleId.value.clientIp = payload.clientIp
    roleId.value.cswrRecordId = payload.cswrRecordId
    roleId.value.loginSystem = payload.loginSystem
    roleId.value.loginTime = payload.loginTime
    roleId.value.mobvoiChatId = payload.mobvoiChatId
    roleId.value.name = payload.name
    roleId.value.attendantName = payload.attendantName
    roleId.value.clientValidation = payload.clientValidation
  }
  const getChatMonitioringRoleId = computed(() => roleId.value)
  const setChatMonitioringRoleIdProperty = (key: string, payload: number) => {
    roleId.value[key] = payload
  }

  const getNoResponseDuration = chatroomName =>
    chatMonitoringGroup.value.find(i => i.chatroomName == chatroomName).noResponseDuration
  const setNoResponseDuration = (chatroomName, duration) => {
    chatMonitoringGroup.value.find(i => i.chatroomName == chatroomName).noResponseDuration = duration
  }

  // 歷史紀錄
  const getMessage_history = computed(() => message_history.value)
  const setMessage_history = payload => {
    message_history.value = payload
  }

  // 預覽客戶發送的訊息
  const getMessage_previewClient = computed(() => message_previewClient.value)
  const getMessage_previewClientKeys = computed(() => Object.keys(message_previewClient.value))
  const setMessage_previewClient = (chatroomName, messageContent) => {
    message_previewClient.value[chatroomName] = messageContent
  }
  const cleanMessage_previewClient = chatroomName => {
    message_previewClient.value[chatroomName] = ''
  }

  // 機器人 歷史訊息
  const setRobotMessage = payload => {
    const $findRoom = chatMonitoringGroup.value.find(
      i => i.chatroomName === getChatMonitioringRoleId.value.chatroomName,
    )
    $findRoom.robotMessage = payload
  }
  const getRobotMessage = computed(() => {
    const $findRoom = chatMonitoringGroup.value.find(
      i => i.chatroomName === getChatMonitioringRoleId.value.chatroomName,
    )
    return $findRoom?.robotMessage
  })

  // 真人服務 歷史訊息
  const setLiveMessage = payload => {
    const $findRoom = chatMonitoringGroup.value.find(
      i => i.chatroomName === getChatMonitioringRoleId.value.chatroomName,
    )
    $findRoom.liveMessage = payload
  }
  const getLiveMessage = computed(() => {
    const $findRoom = chatMonitoringGroup.value.find(
      i => i.chatroomName === getChatMonitioringRoleId.value.chatroomName,
    )
    return $findRoom?.liveMessage
  })

  // WebSocket 即時訊息
  const setChatMonitoringWsMessage = (chatroomName, payload) => {
    const $findRoom = chatMonitoringGroup.value.find(i => i.chatroomName === chatroomName)
    $findRoom.wsMessage.push(payload)
  }
  const getWsMessage = computed(() => {
    const $findRoom = chatMonitoringGroup.value.find(
      i => i.chatroomName === getChatMonitioringRoleId.value.chatroomName,
    )
    return $findRoom?.wsMessage
  })

  return {
    // setChatMonitoringList,
    // resetChatMonitoringList,
    getChatMonitoringList,
    getChatMonitoringChatRoomNameList,
    addChatMonitoringList,
    removeChatMonitoring,

    initChatMonitioringRoleId,
    setChatMonitioringRoleId,
    getChatMonitioringRoleId,
    setChatMonitioringRoleIdProperty,

    getNoResponseDuration,
    setNoResponseDuration,

    getMessage_history,
    setMessage_history,

    getMessage_previewClient,
    getMessage_previewClientKeys,
    setMessage_previewClient,
    cleanMessage_previewClient,

    setRobotMessage,
    getRobotMessage,

    setLiveMessage,
    getLiveMessage,

    setChatMonitoringWsMessage,
    getWsMessage,
  }
})
