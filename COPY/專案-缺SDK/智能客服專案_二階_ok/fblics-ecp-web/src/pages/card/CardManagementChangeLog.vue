<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { FblColumnType } from '@shared/dataGrid/models'
import { Form, Modal } from 'ant-design-vue'

import { useLoadingStore } from '@/stores'

import dayjs from 'dayjs'

import type { CardManagementChangeLog } from '@pages/page_modal'

// const $router = useRouter()

const dateFormat: string = 'YYYY/MM/DD'

const {
  proxy: { $global, $fblicsEnum, $cardManagementApi, $dateTimeUtil },
} = getCurrentInstance()

const { setLoading } = useLoadingStore()

const formData = ref<CardManagementChangeLog.formDataType>({
  changePersonnel: '',
  changeDate: [null, null],
})

const { resetFields } = Form.useForm(formData.value)

const $dataGrid = ref({
  data: [],
  pagination: {
    size: 'small',
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ['10', '25', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
  },
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '類型',
      width: '70',
      align: 'center',
      formatter: data => $fblicsEnum.getLabel('actionStatus', data.modifyStatus),
    },
    {
      type: FblColumnType.PLAIN,
      title: '標題',
      dataIndex: 'cardName',
    },
    {
      type: FblColumnType.PLAIN,
      title: '說明',
      dataIndex: 'cardDescription',
    },
    {
      type: FblColumnType.PLAIN,
      title: '編號',
      width: '100',
      dataIndex: 'cardId',
    },
    {
      type: FblColumnType.PLAIN,
      title: '異動人員',
      width: '100',
      dataIndex: 'modifyName',
    },
    {
      type: FblColumnType.PLAIN,
      title: '異動日期',
      width: '150',
      dataIndex: 'modifyDate',
    },
  ],
})

// 異動日期 預設值
const initDate = () => {
  // 預設 today - 30 到 today
  formData.value.changeDate = [new Date(dayjs().subtract(30, 'day').toString()), new Date(dayjs().toString())]
}

/**
 * API
 */
// API: 查詢卡片異動紀錄
const postAPI_findCardLogs = () => {
  setLoading(true)
  const $submit = {
    modifyDateEnd: formData.value.changeDate && $dateTimeUtil.dateToRocDateString(formData.value.changeDate[1]),
    modifyDateStart: formData.value.changeDate && $dateTimeUtil.dateToRocDateString(formData.value.changeDate[0]),
    modifyUser: formData.value.changePersonnel,
    page: $dataGrid.value.pagination.current - 1,
    size: $dataGrid.value.pagination.pageSize,
  }
  $cardManagementApi
    .findCardLogsUsingPOST($submit)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      $dataGrid.value.data = $getData.content
      $dataGrid.value.pagination.total = $getData.totalElements
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
const onCancel = () => {
  resetFields()
}
const onSearch = () => {
  postAPI_findCardLogs()
}

const handleTableChange = record => {
  const { current, pageSize, total } = record
  $dataGrid.value.pagination.current = current
  $dataGrid.value.pagination.pageSize = pageSize
  $dataGrid.value.pagination.total = total
  postAPI_findCardLogs()
}

/**
 * Hook
 */
onMounted(() => {
  initDate()
  postAPI_findCardLogs()
})
</script>
<template>
  <FormTitle title="卡片管理-變更紀錄" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
      <a-form-item label="異動人員">
        <a-input
          class="w-full"
          v-model:value="formData.changePersonnel"
          placeholder="11個字以內佳，最多22個字"
          allowClear
        />
      </a-form-item>
      <a-form-item label="異動日期">
        <date-picker
          range
          v-model:value="formData.changeDate"
          class="w-full"
          :format="dateFormat"
          placeholder="yyy/mm/dd ~ yyy/mm/dd"
          allow-clear
        />
      </a-form-item>
    </div>
  </a-form>
  <div class="mb-[16px] flex justify-center gap-4">
    <ButtonRectangle btnStyle="outline" letter @click="onCancel">清除</ButtonRectangle>
    <ButtonRectangle letter @click="onSearch">查詢</ButtonRectangle>
  </div>
  <FblDataGrid
    class="gise-beneficiary-table"
    :columns="$dataGrid.columns"
    :scroll="{ x: 'max-content' }"
    :data-source="$dataGrid.data"
    :pagination="$dataGrid.pagination"
    @tableChange="handleTableChange"
  />
</template>

<style scoped></style>
