<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import type { CardManagementAddAndEdit } from '@pages/page_modal'
import { useLoadingStore } from '@/stores'
import { message } from 'ant-design-vue'

interface IProps {
  gridData: {
    cardId: number
    cardCategory: number
    cardImage: string
    cardTitle: string
    cardDescription: string
    itemList: CardManagementAddAndEdit.ItemListDtoAddFile[]
  }
  modifyType: number
}

const { setLoading } = useLoadingStore()

const {
  proxy: { $blobUtils, $fileManagementApi },
} = getCurrentInstance()

const $props = defineProps<IProps>()

/**
 * API
 */
// API: 取得 下載資料 (blob)
const postAPI_downloadFileBlob = fileDownload => {
  setLoading(true)
  return $fileManagementApi
    .downloadFileUsingPOST(fileDownload.fileCategory, fileDownload.fileId, fileDownload.fileStatus, {
      responseType: 'blob',
    })
    .then(resp => {
      $blobUtils.download(resp.data as Blob, fileDownload.fileName || '附件連結', resp.headers['content-type'])
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
const onDownloadFile = async fileDownload => {
  await postAPI_downloadFileBlob(fileDownload)
}
</script>
<template>
  <FormTitle title="覆核 卡片管理" />

  <div class="flex items-start gap-[32px]">
    <div class="mt-[5px] inline-flex justify-start bg-primary-light px-[30px] py-[16px]">
      <!-- <Card
        :review="true"
        :cardTitle="$props.gridData.cardTitle"
        :cardDescription="$props.gridData.cardDescription"
        :cardId="$props.gridData.cardId"
        :cardImage="$global.returnCardImgPath($props.gridData.cardImage)"
        :itemList="$props.gridData.itemList"
      /> -->
      <Card
        :review="true"
        :cardTitle="$props.gridData.cardTitle"
        :cardDescription="$props.gridData.cardDescription"
        :cardId="$props.gridData.cardId"
        :cardImage="$global.returnCardImgPath($props.gridData.cardImage)"
        :itemList="$props.gridData.itemList"
      />
    </div>
    <div class="grid flex-1 grid-cols-1 gap-y-[16px] lg:flex-[0_0_50%]">
      <div class="flex gap-x-[32px]">
        <div class="w-[calc((100%-32px)/2)]">
          <div class="text-[14px] font-[600]">類型</div>
          <div class="mt-[10px] w-full border-b border-neutral-entry pb-[10px]">
            <Badge :status="$props.modifyType" enumName="actionStatus" />
          </div>
        </div>
      </div>

      <template v-for="(item, index) in $props.gridData.itemList" :key="index">
        <div v-if="item.itemType == 3">
          <div class="text-[14px] font-[600]">{{ `URL ${index + 1}` }}</div>
          <div class="mt-[10px] w-full border-b border-neutral-entry pb-[10px]">
            <a class="inline-block text-primary underline" :href="item.itemUrl" target="_blank">
              {{ item.itemUrl }}
            </a>
          </div>
        </div>
        <!-- FAQ temp -->
        <div class="flex gap-x-[32px]" v-if="item.itemType === 2">
          <div class="w-[calc((100%-32px)/2)]">
            <div class="text-[14px] font-[600]">{{ `FAQ ${index + 1}` }}</div>
            <div class="mt-[10px] w-full border-b border-neutral-entry pb-[10px]">{{ item.itemFAQ }}</div>
          </div>
          <div class="w-[calc((100%-32px)/2)]">
            <div class="text-[14px] font-[600]">{{ `對話內容顯示 ${index + 1}` }}</div>
            <div class="mt-[10px] w-full border-b border-neutral-entry pb-[10px]">{{ item.itemShowTitle }}</div>
          </div>
        </div>
        <!-- 附件 temp -->
        <div class="flex gap-x-[32px]" v-if="item.itemType === 1">
          <div class="w-[calc((100%-32px)/2)]">
            <div class="text-[14px] font-[600]">{{ `附件 ${index + 1}` }}</div>
            <div class="mt-[10px] w-full border-b border-neutral-entry pb-[10px]">
              <ul>
                <li class="flex items-center">
                  <paper-clip-outlined />
                  <a class="ml-[5px] text-primary" @click="onDownloadFile(item.fileDownload)">{{
                    item.fileDownload.fileName || '附件連結'
                  }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
