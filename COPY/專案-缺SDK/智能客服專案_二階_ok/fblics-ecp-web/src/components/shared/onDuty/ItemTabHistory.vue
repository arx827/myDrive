<script setup lang="ts">
import { ref, watch, computed, getCurrentInstance } from 'vue'
import { FblColumnType } from '@shared/dataGrid/models'

import { useLoadingStore } from '@/stores'
import { useUtils } from '@composables/useUtils'
import { useOnDutyStore } from '@stores/useOnDutyStore'
import { storeToRefs } from 'pinia'
import { message, Modal } from 'ant-design-vue'

import type { ChatHistoryResultDto } from '@fubonlife/fblics-api-axios-sdk'

const { setLoading } = useLoadingStore()
const { getTime } = useUtils()

const { getRoleId } = storeToRefs(useOnDutyStore())

const {
  proxy: { $global, $chatroomClientApi },
} = getCurrentInstance()

const $clientId = computed(() => {
  return getRoleId.value.clientId
})

const $dataGrid = ref({
  data: [
    // {
    //   id: '0011',
    //   col1: '113/05/17 12:33:21',
    //   col2: '王Ｏ明',
    //   col3: '00:03:33',
    // },
    // {
    //   id: '0012',
    //   col1: '112/12/30 09:20:59',
    //   col2: '王Ｏ明',
    //   col3: '00:02:20',
    // },
    // {
    //   id: '0011',
    //   col1: '113/05/17 12:33:21',
    //   col2: '王Ｏ明',
    //   col3: '00:03:33',
    // },
    // {
    //   id: '0012',
    //   col1: '112/12/30 09:20:59',
    //   col2: '王Ｏ明',
    //   col3: '00:02:20',
    // },
    // {
    //   id: '0011',
    //   col1: '113/05/17 12:33:21',
    //   col2: '王Ｏ明',
    //   col3: '00:03:33',
    // },
    // {
    //   id: '0012',
    //   col1: '112/12/30 09:20:59',
    //   col2: '王Ｏ明',
    //   col3: '00:02:20',
    // },
  ],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '進線時間',
      dataIndex: 'createTime',
    },
    {
      type: FblColumnType.PLAIN,
      title: '客服人員',
      width: 100,
      dataIndex: 'attendantName',
    },
    {
      type: FblColumnType.PLAIN,
      title: '對話時長',
      width: 100,
      dataIndex: 'chatTime',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '預覽',
      width: 60,
      align: 'center',
      bodyCellTemp: 'preview',
    },
  ],
})

const historyMessage = ref([])

const activeInfo = ref<ChatHistoryResultDto>({})

// 顯示 客戶 或 客服 ID
const showMessageName = type => {
  return type === 1 ? activeInfo.value.clientName : activeInfo.value.attendantName
}

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
      $dataGrid.value.data = $getData
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
      historyMessage.value = $getData
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * EVent
 */
const onPreview = text => {
  activeInfo.value = text
  postAPI_getChatRoomChatLog(text.chatroomName)
}

/**
 * 監聽
 */
watch(
  () => $clientId,
  newVal => {
    postAPI_getChatHistoryList(newVal.value)
  },
  { immediate: true },
)
const createRowKey = record => {
  if (record.chatroomName == activeInfo.value.chatroomName) {
    return `${record.chatroomName}_rowActive`
  }
  return record.chatroomName
}
</script>

<template>
  <div class="border-b-[2px] border-neutral-entry px-[16px] pb-[12px]">
    <div class="text-[14px] font-[600] text-black">{{ $clientId }} 歷史對話紀錄</div>
    <FblDataGrid
      class="gise-beneficiary-table chatHistory_dataGrid mt-[4px]"
      :scroll="{ y: '200px' }"
      :rowKey="createRowKey"
      :bordered="false"
      :columns="$dataGrid.columns"
      :data-source="$dataGrid.data"
      :pagination="false"
    >
      <template #preview="{ scope: { text } }">
        <ButtonIconic type="card" @click="onPreview(text)" class="mx-auto bg-white">
          <search-outlined />
        </ButtonIconic>
      </template>
    </FblDataGrid>
  </div>

  <div class="flex-1 px-[16px] pt-[12px]">
    <div class="text-[14px] font-[600] text-black">{{ $clientId }} 歷史對話內容</div>

    <section
      class="mt-[5px] h-[calc(100%-64px-51px-279px-22px-17px-10px)] overflow-auto overflow-y-auto bg-neutral-light3 p-[15px]"
      v-if="historyMessage.length > 0"
    >
      <div class="flex-1">
        <template v-for="(item, index) in historyMessage" :key="index">
          <div :class="item.type === 1 ? '' : 'justify-end text-right'" class="flex items-start">
            <div class="inline-flex flex-col" :class="item.type === 1 ? '' : ' ml-[15px]'">
              <div class="text-[12px] text-neutral-light2">{{ showMessageName(item.type) }}</div>

              <div class="flex items-end">
                <div
                  class="relative mb-[5px] inline-flex max-w-[100%] flex-1 break-words rounded-[20px] px-[15px] py-[10px] text-left shadow-sm"
                  :class="item.type === 1 ? 'bg-white text-black' : 'order-1 bg-primary text-white'"
                >
                  <!-- 文字 -->
                  <div class="min-h-[20px] whitespace-pre-line">{{ item.chatContent }}</div>

                  <div
                    class="before:absolute before:top-[3px] before:h-[12px] before:w-[18px] before:bg-no-repeat"
                    :class="
                      item.type === 1
                        ? 'before:left-[-11px] before:bg-messageLeft'
                        : 'before:right-[-11px] before:bg-messageRight'
                    "
                  ></div>
                </div>

                <div class="mx-[5px] break-keep text-[12px] text-neutral-light2">{{ getTime(item.chatTime) }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.chatHistory_dataGrid {
  :deep([data-row-key$='rowActive']) {
    @apply bg-secondary;
    &:hover {
      @apply !bg-secondary;
      & .ant-table-cell,
      & .ant-table-cell-row-hover {
        @apply !bg-secondary;
      }
    }
  }
}
</style>
