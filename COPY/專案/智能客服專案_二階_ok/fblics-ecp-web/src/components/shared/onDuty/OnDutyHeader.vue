<script setup lang="ts">
import { ref, getCurrentInstance, onBeforeMount } from 'vue'
import lemon from '@imgs/icon_lemon.svg?url'
import { storeToRefs } from 'pinia'

import { useOnDutyStore } from '@stores/useOnDutyStore'
import { useLoadingStore } from '@/stores'
import { useUser } from '@stores/useUser'
import { message, Modal } from 'ant-design-vue'

import { useSocket } from '@composables/useSocket'

const { getHeaderData, getOnDutystatus } = storeToRefs(useOnDutyStore())
const { setOnDutystatus, filterLeaveAndRemoveConversation } = useOnDutyStore()

const { setLoading } = useLoadingStore()
const { getServiceInfo } = storeToRefs(useUser())

const {
  proxy: { $fblicsEnum, $serviceSettingsApi, $serviceAttendantApi, $chatroomApi },
} = getCurrentInstance()

const { socketUtil, unsubscribe } = useSocket()

// 狀態 下拉選單
const selectOptions = ref([])

// 線上狀態 變更
const onChangeStatus = item => {
  postApi_UpdateWorkingStatus(item)
}

/**
 * API
 */
// API: 查詢工作狀態
const postAPI_getServiceWorkingStatus = (): void => {
  setLoading(true)
  $serviceSettingsApi
    .getServiceWorkingStatusUsingPOST()
    .then(res => {
      const $getData = res.data
      selectOptions.value = $getData.map(i => ({
        label: i.workingStatusName,
        value: i.workingStatusType,
        workingStatus: i.workingStatus,
      }))
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

// API: 工作狀態切換
const postApi_UpdateWorkingStatus = item => {
  if (getServiceInfo.value.userId) {
    setLoading(true)
    $serviceAttendantApi
      .updateWorkingStatusUsingPOST(getServiceInfo.value.userId, item.workingStatus)
      .then(() => {
        if (item.value === 1) {
          Modal.warning({
            title: '請確認電話狀態已休息',
            content: '',
            onOk: () => {
              // 訂閱側邊 聊天室 列表
              socketUtil.socket_dispatchAttendant(getServiceInfo.value.userId, chatroomStatus => {
                return $fblicsEnum.getLabel('chatroomStatus', chatroomStatus)
              })
            },
          })
        } else {
          unsubscribe(`dispatchAttendant_${getServiceInfo.value.userId}`) // 取消 即時派件機制
          // unsubscribe('receiveMessage', 'all') // 取消 目前即時聊天 (10/06 非工作狀態，不取消訊息接收)
          // unsubscribe('previewClientMessage') // 取消 預覽客戶發送訊息 (10/06 非工作狀態，不取消預覽)
        }
        setOnDutystatus(item)
      })
      .catch(error => {
        message.error(error.response.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  } else {
    message.error('未知使用者，無法切換狀態')
  }
}

/**
 * Hook
 */
onBeforeMount(() => {
  postAPI_getServiceWorkingStatus()

  //提供給 Webview Host 呼叫用 (CSWR是 host)
  //eslint-disable-next-line
  window.chatroomNext = async (chatroomId: number, userId: string) => {
    $chatroomApi
      .serviceEndUsingPOST(userId, chatroomId)
      .then(() => {
        // 清除所有已結束交談的 chatroom
        filterLeaveAndRemoveConversation()
      })
      .catch(error => {
        message.error(error.response.data.message)
      })
  }

  //提供給 Webview Host 呼叫用 (CSWR是 host)
  //eslint-disable-next-line
  window.chatroomClose = async (userId: string) => {
    $serviceAttendantApi.attendantUsingPOST(userId).catch(error => {
      message.error(error.response.data.message)
    })
  }
})
</script>
<template>
  <!-- header -->
  <div class="flex min-h-[64px] items-start bg-gradient text-white">
    <div
      class="grid flex-1 grid-cols-4 gap-y-[4px] self-center px-[14px] py-[4px] text-[12px] lg:gap-y-[8px] lg:text-[14px]"
    >
      <div>即時等候專人交談人數(Queue)：{{ getHeaderData.clientOnWaitCounts }}</div>
      <div>最長等候時間：{{ getHeaderData.waitingTimeDuration }}</div>
      <div>當日等候中放棄人數 (ABN)：{{ getHeaderData.clientOnQuitCounts }}</div>
      <div>當日等候中放棄比例 (ABN%)：{{ getHeaderData.clientOnQuitPercentage }}</div>
      <div>目前專人交談中客戶人數：{{ getHeaderData.clientOnChatCounts }}</div>
      <div>最長交談時間：{{ getHeaderData.chattingTimeDuration }}</div>
      <div>
        座席狀態(忙碌/可服務/未就緒)人數：{{ getHeaderData.busyCount }} / {{ getHeaderData.activeCount }} /
        {{ getHeaderData.standByCount }}
      </div>
    </div>
    <a-dropdown trigger="click" :visible="getOnDutystatus.visible">
      <div
        class="my-auto flex cursor-pointer items-center pl-0 pr-[24px]"
        @click.prevent="getOnDutystatus.visible = !getOnDutystatus.visible"
      >
        <div class="relative">
          <div class="absolute bottom-0 right-0 flex items-center">
            <div
              v-if="getOnDutystatus.workingStatus === 'ACTIVE'"
              class="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full border border-solid border-white bg-success text-[10px] text-white"
            >
              <CheckOutlined />
            </div>
            <div
              v-if="getOnDutystatus.workingStatus === 'STANDBY'"
              class="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full border border-solid border-white bg-danger text-[10px] text-white"
            >
              <CloseOutlined />
            </div>
          </div>
          <img :src="lemon" alt="" />
        </div>
        <div class="ant-dropdown-link ml-[16px] flex items-center">
          <span>{{ getOnDutystatus.workingStatusName }}</span>
          <DownOutlined class="ml-[8px] transition" :class="getOnDutystatus.visible ? 'rotate-180' : ''" />
        </div>
      </div>
      <template #overlay>
        <a-menu class="w-[144px] rounded-[10px] py-[12px]">
          <a-menu-item
            v-for="(item, index) in selectOptions"
            :key="index"
            class="flex cursor-pointer items-center gap-x-[8px] px-[16px]"
            @click="onChangeStatus(item)"
          >
            <div
              v-if="item.workingStatus === 'ACTIVE'"
              class="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full border border-solid border-white bg-success text-[10px] text-white"
            >
              <CheckOutlined />
            </div>
            <div
              v-if="item.workingStatus === 'STANDBY'"
              class="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full border border-solid border-white bg-danger text-[10px] text-white"
            >
              <CloseOutlined />
            </div>
            {{ item.label }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<style scoped></style>
