<script setup lang="ts">
// import { getCurrentInstance } from 'vue'
import editSvg from '@/assets/imgs/icon_edit.svg?url'
import deleteSvg from '@/assets/imgs/icon_delete.svg?url'

import type { ItemListDto } from '@fubonlife/fblics-api-axios-sdk'

// import { useLoadingStore } from '@/stores'

interface IProps {
  cardTitle: string
  cardDescription?: string
  cardId?: number
  cardImage?: string
  itemList?: ItemListDto[]
  isApply?: boolean
  review?: boolean
  lockClick?: boolean
}
const $props = withDefaults(defineProps<IProps>(), {
  isApply: true,
  lockClick: false,
})
const $emits = defineEmits(['onEdit', 'onRemove'])

// const { setLoading } = useLoadingStore()

// const {
//   proxy: { $blobUtils, $fileManagementApi },
// } = getCurrentInstance()

/**
 * API
 */
// API: 下載檔案
// const postAPI_downloadFile = submitData => {
//   setLoading(true)

//   return $fileManagementApi
//     .downloadFileUsingPOST(submitData.fileCategory, submitData.fileId, submitData.fileStatus, { responseType: 'blob' })
//     .then(resp => {
//       return resp
//     })
//     .finally(() => {
//       setLoading(false)
//     })
// }

/**
 * Event
 */
const onEdit = () => {
  $emits('onEdit')
}
// 刪除
const onRemove = () => {
  $emits('onRemove')
}
// Click Link
const onClickLi = item => {
  // itemType
  // 1. 開啟檔案
  // 2. FAQ
  // 3. 超連結
  // console.log(item)
  switch (item.itemType) {
    case 1:
      // console.log('開啟檔案=> ', item)
      // downloadFile(item)
      break
    case 2:
      // console.log('FAQ')
      break
    case 3:
      // console.log('超連結')
      break
  }
  // console.log(item.itemType)
  // console.log(item)
  // console.log('onClickLi', item.type, item)
}

// const downloadFile = async item => {
//   if (item.itemFileInfo.fileId) {
//     const submitData = {
//       fileCategory: item.itemFileInfo.fileCategory,
//       fileId: item.itemFileInfo.fileId,
//       fileStatus: item.itemFileInfo.fileStatus,
//     }
//     const response = await postAPI_downloadFile(submitData)
//     // 下載檔案
//     // eslint-disable-next-line no-undef
//     const blob = new Blob([response.data] as BlobPart[])
//     const blobURL = window.URL.createObjectURL(blob)
//     const tempLink = document.createElement('a')
//     tempLink.style.display = 'none'
//     tempLink.href = blobURL
//     const fileName = $blobUtils.getFileName(response.headers)
//     tempLink.setAttribute('download', fileName)
//     tempLink.setAttribute('target', '_blank')
//     document.body.appendChild(tempLink)
//     tempLink.click()
//     document.body.removeChild(tempLink)
//     setTimeout(() => {
//       window.URL.revokeObjectURL(blobURL)
//     }, 100)
//   }
// }
</script>
<template>
  <div class="mx-auto min-h-[90px] w-[200px] rounded-[20px] bg-white text-center">
    <div class="relative" v-if="$props.cardImage">
      <img :src="$props.cardImage" alt="" />
      <!-- 編號 -->
      <div class="absolute top-0 m-2 rounded bg-black/50 p-1 text-base font-thin text-white" v-if="cardId">
        {{ cardId }}
      </div>
      <div class="absolute right-0 top-0 m-2 grid gap-2" v-if="!$props.review">
        <!-- 編輯按鈕 -->
        <ButtonIconic type="card" btnStyle="white" tooltip="編輯" @click="onEdit" :disabled="isApply">
          <img :src="editSvg" alt="" />
        </ButtonIconic>
        <!-- 刪除按鈕 -->
        <ButtonIconic type="card" btnStyle="white" tooltip="刪除" @click="onRemove" :disabled="isApply">
          <img :src="deleteSvg" alt="" />
        </ButtonIconic>
      </div>
    </div>
    <div class="p-[7px]" v-if="$props.cardTitle || $props.cardDescription">
      <h4 class="font-semibold" v-if="$props.cardTitle">{{ $props.cardTitle }}</h4>
      <div class="mt-[7px] text-neutral" v-if="$props.cardDescription">{{ $props.cardDescription }}</div>
    </div>
    <ul v-if="$props.itemList?.length > 0">
      <template v-for="(item, index) in $props.itemList" :key="index">
        <li
          v-if="item.itemTitle"
          class="border-t border-neutral-light p-[9px] text-primary"
          :class="{ 'cursor-pointer': !$props.lockClick }"
          @click="onClickLi(item)"
        >
          {{ item.itemTitle }}
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped></style>
