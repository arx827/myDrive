<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import deleteSvg from '@/assets/imgs/icon_delete.svg?url'
import editSvg from '@/assets/imgs/icon_edit.svg?url'
import { FblColumnType } from '@shared/dataGrid/models'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores'
import type { BaseOptionType } from 'ant-design-vue/es/select'
import { message, Modal } from 'ant-design-vue'

const $router = useRouter()
const { setLoading } = useLoadingStore()

const {
  proxy: { $global, $cardCategoryManagementApi },
} = getCurrentInstance()

const $dataGrid = ref({
  data: [],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '卡片類型名稱',
      dataIndex: 'cardCategoryName',
    },
    {
      type: FblColumnType.TEMPLATE,
      width: 90,
      headerCellTemp: 'activeHeader',
      bodyCellTemp: 'active',
      title: '功能',
    },
  ],
})

const getDataGrid = async () => {
  $dataGrid.value.data = await postAPI_findCardCategory()
}

/**
 * API
 */
// API: 查詢卡片類型 (清單)
const postAPI_findCardCategory = (): Promise<BaseOptionType[]> => {
  setLoading(true)
  return $cardCategoryManagementApi
    .findCardCategoryUsingPOST()
    .then(res => {
      return $global.deepCopyData(res.data)
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

// API: 刪除卡片類型
const postAPI_deleteCardCategory = (cardCategoryId: number) => {
  setLoading(true)
  $cardCategoryManagementApi
    .deleteCardCategoryUsingPOST({ cardCategoryId })
    .then(() => {
      message.success('刪除成功')
      getDataGrid()
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
// const onOpenChangeLog = () => {
//   const newPage = $router.resolve({ name: 'CardTypeChangeLog' })
//   window.open(newPage.href, 'CardTypeChangeLog', '_blank')
// }
const onAddCardType = () => {
  $router.push({ name: 'CardTypeManagementAdd' })
}
const onEditCardType = data => {
  $global.changeRouterAndaddParam({
    toRouter: 'CardTypeManagementEdit',
    params: {
      cardCategoryId: data.cardCategoryId,
    },
  })
}
const removeRowData = data => {
  postAPI_deleteCardCategory(data.cardCategoryId)
}

/**
 * Hook
 */
onMounted(() => {
  getDataGrid()
})
</script>
<template>
  <FormTitle title="卡片類型管理">
    <div class="flex gap-2">
      <!-- <ButtonRectangle btn-style="outline" @click="onOpenChangeLog">變更紀錄</ButtonRectangle> -->
      <ButtonRectangle @click="onAddCardType">新增卡片類型</ButtonRectangle>
    </div>
  </FormTitle>
  <FblDataGrid
    class="gise-beneficiary-table"
    :columns="$dataGrid.columns"
    :data-source="$dataGrid.data"
    :pagination="false"
  >
    <template #activeHeader>
      <div class="flex gap-2">
        <div class="flex-auto text-center">修改</div>
        <div class="flex-auto text-center">刪除</div>
      </div>
    </template>
    <template #active="{ scope: { text } }">
      <div class="flex gap-2">
        <ButtonIconic tooltip="修改" @click="onEditCardType(text)" :disabled="text.apply">
          <img :src="editSvg" alt="" />
        </ButtonIconic>
        <FblPopConfirm @confirm="removeRowData(text)" title="確認刪除？<br>刪除後，將無法再透過此類型搜尋卡片。">
          <ButtonIconic tooltip="刪除" :disabled="text.apply">
            <img :src="deleteSvg" alt="" />
          </ButtonIconic>
        </FblPopConfirm>
      </div>
    </template>
  </FblDataGrid>
</template>

<style scoped></style>
