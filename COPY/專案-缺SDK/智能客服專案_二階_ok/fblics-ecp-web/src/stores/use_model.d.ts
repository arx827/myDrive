import type { DateTimeBaseProps } from '@fubonlife/vue-datepicker-next'

export interface rightTabsType {
  tabsArr: string[]
}

export interface headerDataType {
  clientOnChatCounts?: number
  clientOnWaitCounts?: number
  chattingTimeDuration?: string
  waitingTimeDuration?: string
  clientOnQuitCounts?: number
  clientOnQuitPercentage?: string
  activeCount?: number
  standByCount?: number
  busyCount?: number
}

export interface chatroomType {
  chatroomId: number
  chatroomName: string
  clientId: string
  clientIp: string
  cswrRecordId: string
  loginSystem: string
  loginTime: string
  mobvoiChatId: string
  name: string
  attendantName: string
  clientValidation: string
}

export interface activeChatroomType {
  attendantId?: string
  attendantName: string
  chatroomId?: string
  chatroomName?: string
  clientId?: string
  clientIp?: string
  cswrRecordId?: string
  loginSystem?: string
  clientValidation?: string
  loginTime?: string
  mobvoiChatId?: string
  name?: string
  // noResponseDuration?: string
  robotMessage?: robotMessageType[]
  wsMessage?: wsMessageType[]
}

export interface wsMessageType {
  messageId?: number
  chatroomName?: string
  chatroomId: string
  messageSendClient: number
  messageType: number
  messageContent: string
  attendantId: string
  attendantName: string
  sendTime: Date
}

export interface liveMessageType {
  messageType: number
  sendTime: string
  messageContent?: string
  attendantId?: string
  attendantName?: string
}

export interface robotMessageType {
  type: number
  chatTime: string
  chatContent?: string
  attendantId?: string
  attendantName?: string
}

export interface logMessageType {
  type: number
  chatTime: string
  chatContent: string
  attendantId: string
  attendantName: string
}

export interface conversationMessageType extends chatroomType {
  wait?: boolean
  messageNum?: number
  noResponseDuration?: string
  robotMessage?: robotMessageType[]
  wsMessage?: wsMessageType[]
  liveMessage?: liveMessageType[]
  clientLeaves?: boolean
}

// export interface messageType {
//   id: string
//   body: string
//   author: 'customer' | 'service'
//   time: string
//   loading: boolean
//   writting?: boolean
// }

// export interface messageControl extends message {
//   messageNum: number
//   wait: boolean
//   robotMessage: message[]
//   wsMessage: message[]
// }

// {
//   "chatroomId": 123,
//   "chatroomName": "8365595033176485887",
//   "messageSendClient": 1,
//   "messageType": 1,
//   "messageContent": "我是客戶想要詢問保單資訊",
//   "attendantId": "B1955",
//   "attendantName": "王Ｏ明",
//   "sendTime": 2023-08-25T09:41:35.016
// }

export interface roleIdType {
  customer: string
  service: string
}

export interface onDutystatusType {
  visible: boolean
  workingStatusName: string
  workingStatus: 'ACTIVE' | 'STANDBY'
}

// ----------------------- 即時監控 ----------------------- //
export interface chatMonitoringListType {
  chatroomName: string
  name: string
  clientId: string
  clientIp: string
  loginTime: string
  loginSystem: string
  mobvoiChatId: string
  cswrRecordId: string
  clientValidation: string
}
