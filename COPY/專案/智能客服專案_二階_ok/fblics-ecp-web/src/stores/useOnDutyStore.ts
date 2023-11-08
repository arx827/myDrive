import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch, getCurrentInstance } from 'vue'
import type { headerDataType, conversationMessageType, rightTabsType, onDutystatusType, roleIdType } from './use_model'
import { useLoadingStore } from '@/stores'
import { message } from 'ant-design-vue'
import { useUtils } from '@composables/useUtils'

const { setLoading } = useLoadingStore()
const { playAudio } = useUtils()

// const {
//   proxy: { $fblicsEnum },
// } = getCurrentInstance()

const headerData = ref<headerDataType>({
  clientOnChatCounts: null, // 專人交談中客戶人數
  clientOnWaitCounts: null, // 等候專人交談的客戶人數
  chattingTimeDuration: null, // 最長交談時間
  waitingTimeDuration: null, // 最長等候時間
  clientOnQuitCounts: null, // 等候中放棄人數 (ABN)
  clientOnQuitPercentage: null, // 等候中放棄人數比例 (ABN%)
  activeCount: null, // 座席可服務狀態人數
  standByCount: null, // 座席未就緒狀態人數
  busyCount: null, // 座席忙碌狀態人數
})

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

// 目前操作者 狀態
export const onDutystatus = ref<onDutystatusType>({
  visible: false,
  workingStatusName: '休息',
  workingStatus: 'STANDBY',
})

const activeChatroomName = ref<string>('')

// ----------- 訊息資訊 ----------- //
const messageGroup = ref<conversationMessageType[]>([])

const getOnDutystatus = computed(() => onDutystatus.value)
const setOnDutystatus = payload => {
  onDutystatus.value.workingStatusName = payload.label
  onDutystatus.value.workingStatus = payload.workingStatus
  onDutystatus.value.visible = false
}

// -------------------------------------------------------------------------------------------------- \\
/**
 * 右側 Tabs
 */
// -------------------------------------------------------------------------------------------------- \\

// ----------- 右側 歷史對話紀錄、罐頭訊息 資訊 ----------- //
const rightTabs = ref<rightTabsType>({
  tabsArr: [],
})
const rightTabsActive = ref<string>('history')
// 右側罐頭語 指定展開節點
const expandedKeys = ref<string[] | number[]>(['CategoryId_1'])

// -------------------------------------------------------------------------------------------------- \\
/**
 * 中間 主訊息區
 */
// -------------------------------------------------------------------------------------------------- \\
// 輸入欄位
const chatInput = ref('')

export const useOnDutyStore = defineStore('onDutyStore', () => {
  // -------------------------------------------------------------------------------------------------- \\
  /**
   * header 平台即時服務狀態
   */
  // -------------------------------------------------------------------------------------------------- \\
  const getHeaderData = computed(() => headerData.value)
  const setHeaderData = (key, payload) => {
    headerData.value[key] = payload
  }

  const initRoleId = () => {
    Object.assign(roleId.value, {
      chatroomName: '',
      clientId: '',
      clientIp: '',
      cswrRecordId: '',
      loginSystem: '',
      loginTime: '',
      mobvoiChatId: '',
      name: '',
      clientValidation: '',
    })
    setActiveChatroomName(null)
  }
  const setRoleId = payload => {
    roleId.value.chatroomName = payload.chatroomName
    roleId.value.clientId = payload.clientId
    roleId.value.clientIp = payload.clientIp
    roleId.value.cswrRecordId = payload.cswrRecordId
    roleId.value.loginSystem = payload.loginSystem
    roleId.value.loginTime = payload.loginTime
    roleId.value.mobvoiChatId = payload.mobvoiChatId
    roleId.value.name = payload.name
    roleId.value.clientValidation = payload.clientValidation
  }
  const getRoleId = computed(() => roleId.value)

  const setOnDutyRoleIdProperty = (key: string, payload: number) => {
    roleId.value[key] = payload
  }
  const getActiveChatroomName = computed(() => activeChatroomName.value)
  const setActiveChatroomName = payload => {
    activeChatroomName.value = payload
  }

  // -------------------------------------------------------------------------------------------------- \\
  /**
   * 右側 Tabs
   */
  // -------------------------------------------------------------------------------------------------- \\
  // 初始
  const initRightTabs = () => {
    rightTabs.value.tabsArr = []
  }
  // 判斷
  const isIncludesTabsArr = key => rightTabs.value.tabsArr.includes(key)

  // 取得
  const getRightTabsArr = computed(() => rightTabs.value.tabsArr)
  // 設定 作用中的項目
  const setRightTabsActive = key => (rightTabsActive.value = key)

  // 設定 [罐頭語] 展開
  const setExpandedKeys = payload => {
    expandedKeys.value = payload
  }
  // 取得 [罐頭語] 展開
  const getExpandedKeys = computed(() => expandedKeys.value)
  // Event 新增
  const addTabs = key => rightTabs.value.tabsArr.push(key)
  // Event 移除
  const onRemoveRightTab = value => {
    rightTabs.value.tabsArr.splice(rightTabs.value.tabsArr.indexOf(value), 1)
    // 要移除的tab 目前作用中的話，要自動補上 active，避免斷層
    if (rightTabs.value.tabsArr.length > 0 && value === rightTabsActive.value) {
      rightTabsActive.value = rightTabs.value.tabsArr[0]
    }
  }
  // 罐頭語 複製 到 輸入框
  const setChatInput = payload => {
    chatInput.value = payload
  }
  const getChatInput = computed(() => chatInput.value)

  // -------------------------------------------------------------------------------------------------- \\
  /**
   * 左側 進線 資訊
   */
  // -------------------------------------------------------------------------------------------------- \\
  const getConversationArr = computed(() => messageGroup.value)
  // 左側列表 - 新增聊天列表
  const addConversation = payload => {
    const chatroomNameList = messageGroup.value.map(i => i.chatroomName)
    const $index = chatroomNameList.indexOf(payload.chatroomName)
    // 判斷房間名是否已在左側列表中，不存在才執行新增
    if ($index < 0) {
      // push
      messageGroup.value.push({
        ...payload,
        messageNum: 0,
        wait: false,
        robotMessage: [],
        wsMessage: [],
        clientLeaves: false,
      })
      playAudio()
    }
    return $index < 0 ? true : false
  }

  const setRoomInfo = item => {
    setRoleId(item)
    setActiveChatroomName(item.chatroomName)
  }

  // 切換等待狀態
  // 閃紅 + 響鈴
  // const setWait = chatroomName => {
  //   const $findConversation = messageGroup.value.find(i => i.chatroomName === chatroomName)
  //   $findConversation.wait = true
  // }

  const closeWait = chatroomName => {
    // console.log(chatroomName)
    const $findConversation = messageGroup.value.find(i => i.chatroomName === chatroomName)
    $findConversation.wait = false
    $findConversation.messageNum = 0
  }

  // 客戶未被回覆的 發話之開始時間 (客服人員發話index +1)
  const lastClientMessage = chatroomName => {
    const $findChatRoomName = messageGroup.value.find(i => i.chatroomName === chatroomName)
    const $lastServiceWsMessage =
      $findChatRoomName.wsMessage && $findChatRoomName.wsMessage.filter(i => i.messageType === 2).at(-1)
    const $lastServiceIndex = $findChatRoomName.wsMessage.indexOf($lastServiceWsMessage)

    // 客服人員回應的下一筆客戶發話
    const $lastClientWsMessage = $findChatRoomName.wsMessage[$lastServiceIndex + 1]
    return $lastClientWsMessage ? $lastClientWsMessage.sendTime.toString() : ''
  }

  // -------------------------------------------------------------------------------------------------- \\
  /**
   * 中間 主訊息區
   */
  // -------------------------------------------------------------------------------------------------- \\
  // 機器人 歷史訊息
  const setRobotMessage = payload => {
    const $findRoom = messageGroup.value.find(i => i.chatroomName === roleId.value.chatroomName)
    $findRoom.robotMessage = payload
  }
  const getRobotMessage = computed(() => {
    const $findRoom = messageGroup.value.find(i => i.chatroomName === roleId.value.chatroomName)

    return $findRoom?.robotMessage
  })

  const setOnDutyWsMessage = (chatroomName, payload) => {
    const $findRoom = messageGroup.value.find(i => i.chatroomName === chatroomName)
    $findRoom.wsMessage.push(payload)

    // 2023/10/19 已作用中的聊天室，也要可以顯示 未回覆數
    // if (activeChatroomName.value !== $findRoom.chatroomName) {

    // 針對 messageType == 1 (客戶wsMessage) 才需要顯示 未讀訊息
    if (payload.messageType == 1) {
      $findRoom.messageNum++
      if (onDutystatus.value.workingStatus === 'ACTIVE') {
        $findRoom.wait = true
      }
    }
    // }
  }
  const getWsMessage = computed(() => {
    const $findRoom = messageGroup.value.find(i => i.chatroomName === roleId.value.chatroomName)
    return $findRoom?.wsMessage
  })

  // 離開事件
  // disabled 聊天室
  const clientLeaveRoom = chatroomName => {
    const $findRoom = messageGroup.value.find(i => i.chatroomName === chatroomName)
    $findRoom.clientLeaves = true
  }

  const getDisabledRoom = computed(() => {
    const $findRoom = messageGroup.value.find(i => i.chatroomName === roleId.value.chatroomName)
    return $findRoom?.clientLeaves
  })

  const isDisabledRoom = chatroomName => {
    const $findRoom = messageGroup.value.find(i => i.chatroomName === chatroomName)
    return $findRoom.clientLeaves
  }

  // 清除所有結束交談 的 對話
  const filterLeaveAndRemoveConversation = () => {
    const $filterLeaveList = messageGroup.value.filter(i => i.clientLeaves)
    // const $chatroomNameList = messageGroup.value.map(i => i.chatroomName)
    $filterLeaveList.map(i => {
      const $index = messageGroup.value.indexOf(i)
      messageGroup.value.splice($index, 1)
    })
    initRoleId()
    initRightTabs()
  }

  // 左側列表 - 移除、聊天列表
  const removeConversation = () => {
    // 刪除側邊列表
    const $findConversation = messageGroup.value.find(i => i.chatroomName === roleId.value.chatroomName)
    const $index = messageGroup.value.indexOf($findConversation)
    messageGroup.value.splice($index, 1)
    initRoleId()
    initRightTabs()
  }

  return {
    getHeaderData,
    setHeaderData,

    initRoleId,
    setRoleId,
    getRoleId,
    setOnDutyRoleIdProperty,
    getActiveChatroomName,
    setActiveChatroomName,

    addTabs,
    isIncludesTabsArr,
    onRemoveRightTab,
    getRightTabsArr,
    setRightTabsActive,
    rightTabsActive,
    expandedKeys,
    setExpandedKeys,
    getExpandedKeys,

    chatInput,
    setChatInput,
    getChatInput,

    getConversationArr,
    addConversation,
    removeConversation,
    filterLeaveAndRemoveConversation,
    setRoomInfo,

    // setWait,
    closeWait,

    setRobotMessage,
    getRobotMessage,
    setOnDutyWsMessage,
    getWsMessage,

    // initWsMessage,

    messageGroup,
    lastClientMessage,

    clientLeaveRoom,
    getDisabledRoom,
    isDisabledRoom,

    setOnDutystatus,
    getOnDutystatus,
  }
})
