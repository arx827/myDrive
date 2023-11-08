<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
// import deleteSvg from '@/assets/imgs/icon_delete.svg?url'
// import editSvg from '@/assets/imgs/icon_edit.svg?url'
import { FblColumnType } from '@shared/dataGrid/models'
// import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores'
import { Modal } from 'ant-design-vue'

// import type { WorkingStatusResponseDataDto } from '@fubonlife/fblics-api-axios-sdk'

// const $router = useRouter()
const { setLoading } = useLoadingStore()

const {
  proxy: { $serviceSettingsApi },
} = getCurrentInstance()

const $dataGrid = ref({
  data: [],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '工作狀態名稱',
      dataIndex: 'workingStatusName',
    },
    {
      type: FblColumnType.TEMPLATE,
      bodyCellTemp: 'workingStatusType',
      title: '狀態分類',
      dataIndex: 'workingStatusType',
    },
    // {
    //   type: FblColumnType.TEMPLATE,
    //   width: 90,
    //   bodyCellTemp: 'active',
    //   title: '功能',
    // },
  ],
})

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

/**
 * Event
 */
// // TODO:
// const addWorkingStatus = (): void => {
//   $router.push({
//     name: 'WorkingStatusAddAndEdit',
//     params: { type: 'add' },
//   })
// }
// // TODO:
// const editRowData = (data: WorkingStatusResponseDataDto): void => {
//   $global.changeRouterAndaddParam({
//     toRouter: 'WorkingStatusAddAndEdit',
//     params: {
//       type: 'edit',
//     },
//     query: data,
//   })
// }
// // TODO:
// const removeRowData = (data: WorkingStatusResponseDataDto): void => {
//   console.log('remove =>', data)
// }

/**
 * Hook
 */
onMounted(() => {
  postAPI_getServiceWorkingStatus()
})
</script>
<template>
  <FormTitle title="工作狀態新增/修改">
    <!-- <ButtonRectangle @click="addWorkingStatus" hidden>新增工作狀態</ButtonRectangle> -->
  </FormTitle>

  <FblDataGrid
    class="gise-beneficiary-table"
    :columns="$dataGrid.columns"
    :data-source="$dataGrid.data"
    :pagination="false"
  >
    <template #workingStatusType="{ scope: { value } }">
      <Badge :status="value" emunName="workingStatus" />
    </template>
    <!-- <template #active="{ scope: { value } }">
      <div class="flex gap-2">
        <ButtonIconic tooltip="編輯" @click="editRowData(value)">
          <img :src="editSvg" alt="" />
        </ButtonIconic>
        <FblPopConfirm @confirm="removeRowData(value)">
          <ButtonIconic tooltip="刪除">
            <img :src="deleteSvg" alt="" />
          </ButtonIconic>
        </FblPopConfirm>
      </div>
    </template> -->
  </FblDataGrid>
</template>

<style scoped></style>
