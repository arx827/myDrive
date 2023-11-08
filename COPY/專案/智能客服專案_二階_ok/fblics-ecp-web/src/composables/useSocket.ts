import { ref, getCurrentInstance, nextTick, watch } from 'vue'
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import Stomp from 'stompjs'
import { useUser } from '@stores/useUser'
import { storeToRefs } from 'pinia'
import { useOnDutyStore } from '@stores/useOnDutyStore'
import { useLoadingStore } from '@/stores'

import { useChatMonitoringStores } from '@stores/useChatMonitoringStores'
import dayjs from 'dayjs'

const {
  setMessage_previewClient,
  cleanMessage_previewClient,
  addChatMonitoringList,
  removeChatMonitoring,
  setNoResponseDuration,
  setChatMonitoringWsMessage,
  setRobotMessage,
} = useChatMonitoringStores()

const { getChatMonitoringChatRoomNameList } = storeToRefs(useChatMonitoringStores())

import { message } from 'ant-design-vue'

import { useRoute } from 'vue-router'

const { getServiceInfo } = storeToRefs(useUser())
const { setLoading } = useLoadingStore()

const {
  setHeaderData,
  addConversation,
  setOnDutyWsMessage,
  removeConversation,
  setRoleId,
  setOnDutyRoleIdProperty,
  clientLeaveRoom,
} = useOnDutyStore()
const { getRoleId, getActiveChatroomName, getConversationArr } = storeToRefs(useOnDutyStore())
// 參考 https://juejin.cn/post/7236325900718440507
// 參考 https://juejin.cn/post/7107266882415099934
let sock
let stomp: any
let errorNum: number = 0
export const useSocket = () => {
  // create socket 連線
  const openSocket = (type = null) => {
    sock = new SockJS(import.meta.env.VITE_WS_URL)
    stomp = Stomp.over(sock)
    return new Promise((resolve, reject) => {
      stomp.connect(
        {},
        () => {
          errorNum = 0 // 歸零
          resolve('連線')
        },
        () => {
          errorNum += 1
          if (errorNum < 30) {
            openSocket(type)
          } else {
            // 超過最大連線數，就不再重新連線
            console.error('超過socket錯誤連線次數，請重新操作流程')
          }
        },
      )
    })
  }

  // 取消整個 socket 連線
  const disconnect = () => {
    stomp.disconnect()
  }

  // 訂閱
  const subscribe = async (title: string, url: string, callback) => {
    // 排除已訂閱
    if (!Object.keys(stomp.subscriptions).includes(title)) {
      // TEST:
      console.log('訂閱 =>', title)
      await stomp.subscribe(url, callback, { id: title })
    }
  }

  // 發送
  const send = (url: string, body) => {
    if (typeof body === 'object') {
      body = JSON.stringify(body)
    }
    stomp.send(url, {}, body)
  }

  // 取消訂閱
  const unsubscribe = (title: string, type?: string) => {
    // 全部清除
    if (type === 'all') {
      Object.keys(stomp.subscriptions).map(i => {
        if (i.includes(title)) {
          stomp.unsubscribe(i)
          // TEST:
          console.log('取消全部=>', i)
        }
      })
    } else {
      if (Object.keys(stomp.subscriptions).includes(title)) {
        stomp.unsubscribe(title)
        // TEST:
        console.log('取消=>', title)
      }
    }
  }

  // 關閉 聊天房間 對話連線 (客戶離開，客服主動離開)
  const closeChatRoomLive = chatroomName => {
    // 取消 socket 目前即時聊天
    unsubscribe(`receiveMessage_${chatroomName}`)
    // 取消 socket 預覽客戶發送訊息
    unsubscribe(`previewClientMessage_${chatroomName}`)
    // 取消 socket 離開事件
    unsubscribe(`quitChatroomEvent_${chatroomName}`)

    // 清空 預覽客戶發送訊息
    cleanMessage_previewClient(chatroomName)
  }

  // socket 訂閱清單
  const socketUtil = {
    // --------------------------------------- 值機端 --------------------------------------- //
    // 6.2.14 平台即時服務狀態
    socket_clientMonitoringResult: () => {
      subscribe('clientMonitoringResult', '/topic/clientMonitoringResult', result => {
        const $result = JSON.parse(result.body)
        setHeaderData('clientOnChatCounts', $result.clientOnChatCounts)
        setHeaderData('clientOnWaitCounts', $result.clientOnWaitCounts)
        setHeaderData('chattingTimeDuration', $result.chattingTimeDuration)
        setHeaderData('waitingTimeDuration', $result.waitingTimeDuration)
        setHeaderData('clientOnQuitCounts', $result.clientOnQuitCounts)
        setHeaderData('clientOnQuitPercentage', $result.clientOnQuitPercentage)
        setHeaderData('activeCount', $result.activeCount)
        setHeaderData('standByCount', $result.standByCount)
        setHeaderData('busyCount', $result.busyCount)
      })
    },

    // 6.2.15 客戶即時服務頁籤 (on-Duty 即時派件機制)
    socket_dispatchAttendant: (attendantId: string, getMessageContent) => {
      // 只會有一筆訂閱，其他都刪掉
      Object.keys(stomp.subscriptions).map(i => {
        if (i.includes('dispatchAttendant') && i.split('_')[1] !== attendantId) {
          unsubscribe(i)
        }
      })
      subscribe(`dispatchAttendant_${attendantId}`, `/queue/dispatchAttendant/${attendantId}`, result => {
        const $result = JSON.parse(result.body)
        if (addConversation($result)) {
          // 訂閱 即時聊天室內容
          socketUtil.socket_receiveMessage_dispatchAttendant($result.chatroomName)
          // 訂閱 離開事件
          socketUtil.socket_quitChatroomEvent($result, getMessageContent)

          setOnDutyRoleIdProperty('chatroomId', $result.chatroomId)
          setOnDutyRoleIdProperty('attendantName', $result.attendantName)

          // 通知 CSWR 進線
          const icsChatroom = window.chrome.webview.hostObjects.sync.icsChatroom
          icsChatroom.StartChat($result.cswrRecordId, $result.clientId, $result.chatroomId, attendantId) //   (接收socket 即時派件機制 時呼叫)
        }
      })
    },

    // 即時聊天室內容 (訂閱) (on-duty)
    socket_receiveMessage_dispatchAttendant: (chatroomName: string) => {
      subscribe(`receiveMessage_${chatroomName}`, `/queue/receiveMessage/${chatroomName}`, result => {
        const $result = JSON.parse(result.body)
        setOnDutyRoleIdProperty('chatroomId', $result.chatroomId)
        setOnDutyRoleIdProperty('attendantName', $result.attendantName)
        setOnDutyWsMessage(chatroomName, $result)
      })
    },

    // 聊天內容發送 (發送)
    socketSend_sendMessage: obj => {
      send('/app/sendMessage', {
        instantMessageType: 1,
        message: JSON.stringify(obj),
      })
    },

    // 預覽客戶發送訊息 (訂閱)
    socket_previewClientMessage: (chatroomName: string) => {
      subscribe(`previewClientMessage_${chatroomName}`, `/queue/previewClientMessage/${chatroomName}`, result => {
        const $result = JSON.parse(result.body)
        setMessage_previewClient(chatroomName, $result.messageContent)
      })
    },

    // 離開事件 (on-Duty 訂閱)
    socket_quitChatroomEvent: (chatroom, getMessageContent) => {
      subscribe(
        `quitChatroomEvent_${chatroom.chatroomName}`,
        `/queue/quitChatroomEvent/${chatroom.chatroomName}`,
        result => {
          const $result = JSON.parse(result.body)

          // 查找 chatroomName 相對資料
          const $findInfo = getConversationArr.value.find(i => i.chatroomName === $result.chatroomName)

          // 使用 chatroomName 找到其他資料
          setOnDutyWsMessage($result.chatroomName, {
            messageId: null,
            messageContent: getMessageContent(),
            chatroomId: $findInfo.chatroomId,
            messageType: 1,
            messageSendClient: 1,
            attendantId: getServiceInfo.value.userId,
            attendantName: $findInfo.chatroomName,
            sendTime: dayjs(),
          })

          // client Leave room
          clientLeaveRoom($findInfo.chatroomName)

          // closeChatRoomLive 聊天室
          closeChatRoomLive($findInfo.chatroomName)

          // 通知 CSWR 結束進線
          const icsChatroom = window.chrome.webview.hostObjects.sync.icsChatroom
          icsChatroom.EndChat()
        },
      )
    },

    // 離開事件 (發送訊息)
    socketSend_quitChatroomEvent: (chatroomName: string) => {
      send('/app/quitChatroomEvent', {
        instantMessageType: 9,
        message: JSON.stringify({
          chatroomId: getRoleId.value.chatroomId,
          chatroomName: chatroomName,
          chatroomStatus: 7,
        }),
      })
      closeChatRoomLive(chatroomName)
      // 離開 並 主動關閉 聊天房
      removeConversation()
    },

    // 未回覆時長 (發送訊息)
    socketSend_noResponseDuration: (duration: string, chatroomName: string) => {
      send('/app/noResponseDuration', {
        instantMessageType: 7,
        message: JSON.stringify({
          chatroomName: chatroomName,
          duration: duration,
        }),
      })
    },

    // --------------------------------------- 即時交談監控 --------------------------------------- //
    // 目前正在交談中的線上客戶
    socket_onlineChattingClients: () => {
      subscribe('onlineChattingClients', '/topic/onlineChattingClients', result => {
        const $result = JSON.parse(result.body)
        const $resultChatroomNameArr = $result.map(i => i.chatroomName) // 此筆訂閱的 所有 chatroomName
        const $subscriptionsKeys = Object.keys(stomp.subscriptions) // 已訂閱socket 列表
        // 處理新增訂閱 ($result，不包含在 已訂閱的列表中)
        $result.map(i => {
          // 處理新增 上方列表
          if (addChatMonitoringList(i)) {
            // 訂閱 未回覆時長
            // 查找 stomp 已訂閱的列表中，是否已訂閱過
            const $subscribeArr_noResponseDuration = $subscriptionsKeys
              .filter(i => i.includes('noResponseDuration'))
              .map(i => i.split('_')[1])
            if (!$subscribeArr_noResponseDuration.includes(i)) {
              socketUtil.socket_noResponseDuration(i.chatroomName)
            }

            // 訂閱 即時聊天室內容
            const $subscribeArr_receiveMessage = $subscriptionsKeys
              .filter(i => i.includes('receiveMessage'))
              .map(i => i.split('_')[1])
            if (!$subscribeArr_receiveMessage.includes(i)) {
              socketUtil.socket_receiveMessage_onlineChatting(i.chatroomName)
            }
          }
        })

        // 處理刪除 上方列表
        getChatMonitoringChatRoomNameList.value.map(i => {
          if (!$resultChatroomNameArr.includes(i)) {
            removeChatMonitoring(i)
          }
        })

        // 處理取消訂閱 (已訂閱的列表，不包含在 $result 中)
        $subscriptionsKeys.map(i => {
          const $caatroomName = i.split('_')[1]
          if (!$resultChatroomNameArr.includes($caatroomName)) {
            if (i.includes('noResponseDuration')) {
              // 取消 未回覆時長
              unsubscribe(`noResponseDuration_${$caatroomName}`)
            }

            if (i.includes('receiveMessage')) {
              // 取消 即時聊天
              unsubscribe(`receiveMessage_${$caatroomName}`)
            }
          }
          if (i.includes('noResponseDuration') && !$resultChatroomNameArr.includes($caatroomName)) {
          }
          if (i.includes('receiveMessage') && !$resultChatroomNameArr.includes($caatroomName)) {
            // 取消 即時聊天
            unsubscribe(`receiveMessage_${$caatroomName}`)
          }
        })
      })
    },

    // 未回覆時長 (訂閱)
    socket_noResponseDuration: (chatroomName: string) => {
      subscribe(`noResponseDuration_${chatroomName}`, `/queue/noResponseDuration/${chatroomName}`, result => {
        const $result = JSON.parse(result.body)
        if ($result.duration.trim()) {
          setNoResponseDuration($result.chatroomName, $result.duration)
        }
      })
    },

    // 即時聊天室內容 (即時交談監控)
    socket_receiveMessage_onlineChatting: (chatroomName: string) => {
      subscribe(`receiveMessage_${chatroomName}`, `/queue/receiveMessage/${chatroomName}`, result => {
        const $result = JSON.parse(result.body)
        setChatMonitoringWsMessage(chatroomName, $result)
      })
    },
  }

  return {
    openSocket,
    disconnect,
    subscribe,
    unsubscribe,
    socketUtil,
  }
}
