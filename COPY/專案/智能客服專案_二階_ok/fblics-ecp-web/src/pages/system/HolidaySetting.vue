<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import { Modal } from 'ant-design-vue'
import { FblColumnType } from '@shared/dataGrid/models'
import { useLoadingStore } from '@/stores'
import dayjs from 'dayjs'

const {
  proxy: { $serviceSettingsApi },
} = getCurrentInstance()

const { setLoading } = useLoadingStore()

const yearData = ref<dayjs.Dayjs>(dayjs()) // 年份 預設為今年

const $dataGrid = ref({
  rowKey: 'key',
  data: [],
  scroll: { x: true },
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '日期',
      dataIndex: 'date',
      width: 200,
      sorter: {
        compare: (a, b) => {
          return dayjs(a.date).format('x').localeCompare(dayjs(b.date).format('x'))
        },
      },
    },
    {
      type: FblColumnType.PLAIN,
      title: '備註',
      dataIndex: 'description',
    },
  ],
})

/**
 * API
 */
// API: 查詢假日設定
const getAPI_getServiceHolidays = (): void => {
  const $submitData = yearData.value?.year()
  if ($submitData) {
    setLoading(true)
    $serviceSettingsApi
      .getServiceHolidaysUsingPOST($submitData)
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
  } else {
    $dataGrid.value.data = []
  }
}

/**
 * Hook
 */
onMounted(() => {
  getAPI_getServiceHolidays()
})
</script>
<template>
  <FormTitle title="假日查詢"> </FormTitle>
  <a-form layout="vertical">
    <a-form-item label="年份" class="w-[250px]">
      <a-date-picker
        v-model:value="yearData"
        picker="year"
        placeholder="請選擇"
        allowClear
        @change="getAPI_getServiceHolidays"
        class="w-full"
      />
    </a-form-item>
  </a-form>
  <FblDataGrid
    class="ant-table-striped popupContainerElement"
    bordered
    :dataSource="$dataGrid.data"
    :columns="$dataGrid.columns"
    :isSelect="false"
    :scroll="$dataGrid.scroll"
  />
</template>

<style scoped></style>
