<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDownloadFile } from '@/composables/useDownloadFile'
import { useLoadingStore } from '@stores/index'
import type { CaseMainIdDto, FileInfoDto } from '@fubonlife/gise-api-axios-sdk'

const {
  proxy: { $selfPayEFormApi, $modal, $global, $user },
} = getCurrentInstance()
const $router = useRouter()
const loadingStore = useLoadingStore()
const { downloadFile } = useDownloadFile()
const { pagination } = usePagination()
const { handleDownload, currentFileList } = useDownlaodList()

function usePagination() {
  const pagination = ref({
    current: 1,
    total: 0,
    pageSize: 20,
  })

  return {
    pagination,
  }
}

function useDownlaodList() {
  const caseMainId: CaseMainIdDto = {
    caseMainId: $user.getMe()?.caseMainId,
  }
  let fileList: FileInfoDto[] = []

  let currentFileList = ref<FileInfoDto[]>()

  // API: 查詢檔案清單
  const getFileList = () => {
    loadingStore.setLoading(true)
    $selfPayEFormApi
      .getDownloadFilesUsingPOST(caseMainId)
      .then(resp => {
        if (resp.data.status === 200) {
          fileList = resp.data.data
          pagination.value.total = resp.data.data.length
          getCurrentFilesList(pagination.value.current, pagination.value.pageSize)
        } else {
          $modal.error({
            title: '錯誤',
            content: $global.getApiErrorMsg(resp?.data?.apiError),
          })
        }
      })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  // 獲取畫面上要顯示的下載資料
  const getCurrentFilesList = (current: number, size: number) => {
    const startIndex: number = (current - 1) * size
    const endIndex: number = startIndex + size
    currentFileList.value = fileList.slice(startIndex, endIndex)
  }

  onMounted(() => {
    getFileList()
  })

  // API: 下載檔案
  const handleDownload = async (fileId: string): Promise<void> => {
    loadingStore.setLoading(true)
    await downloadFile({ fileId, source: 'marketing' })
    loadingStore.setLoading(false)
  }

  return {
    currentFileList,
    handleDownload,
  }
}

// 頁面跳轉
function handleToPage(path: string): void {
  $router.push(path)
}
</script>

<template>
  <ul class="mt-4 divide-y-[1px] border-y-[1px] border-[#00000017] bg-white">
    <li
      class="border-[#00000017] px-4 py-2 text-primary md:py-[10px]"
      v-for="file in currentFileList"
      :key="file.fileId"
    >
      <div class="cursor-pointer text-primary" @click="handleDownload(file.fileId)">{{ file.originalFileName }}</div>
    </li>
  </ul>
  <div class="text-center">
    <a-pagination
      v-if="pagination.total > 0"
      class="mx-auto mt-4"
      v-model:current="pagination.current"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      :showSizeChanger="false"
    />
    <ButtonRoundedPrimary class="mx-auto mt-4" @click="handleToPage('/index')">返回</ButtonRoundedPrimary>
  </div>
</template>

<style lang="scss" scoped></style>
