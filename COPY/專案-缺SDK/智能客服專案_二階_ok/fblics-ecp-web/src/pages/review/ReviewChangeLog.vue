<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { FblColumnType } from '@shared/dataGrid/models'
import { Form } from 'ant-design-vue'

import { useLoadingStore } from '@/stores'

import dayjs from 'dayjs'
import { Modal } from 'ant-design-vue/es'

import type { ReviewChangeLog } from '@pages/page_modal'

const dateFormat: string = 'YYYY/MM/DD'

const {
  proxy: { $global, $fblicsEnum, $applyManagementApi, $dateTimeUtil },
} = getCurrentInstance()

const { setLoading } = useLoadingStore()

const formData = ref<ReviewChangeLog.formDataType>({
  results: [],
  modifyUser: '',
  modifyDate: [null, null],
})

const { resetFields } = Form.useForm(formData.value)

// 審核結果 選項
const plainOptions = $fblicsEnum.reviewStatus

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
      title: '覆核功能',
      width: '200',
      dataIndex: 'applyType',
      formatter: data => $fblicsEnum.getLabel('reviewTypeStatus', data.applyType),
    },
    {
      type: FblColumnType.PLAIN,
      title: '類型',
      width: '80',
      dataIndex: 'modifyType',
      formatter: data => $fblicsEnum.getLabel('actionStatus', data.modifyType),
    },
    {
      type: FblColumnType.PLAIN,
      title: '送審人員',
      width: '100',
      dataIndex: 'modifyUser',
    },
    {
      type: FblColumnType.PLAIN,
      title: '送審日期',
      width: '150',
      dataIndex: 'modifyDate',
    },
    {
      type: FblColumnType.PLAIN,
      title: '審核結果',
      width: '100',
      dataIndex: 'applyStatus',
      formatter: data => $fblicsEnum.getLabel('reviewStatus', data.applyStatus),
    },
    {
      type: FblColumnType.PLAIN,
      title: '審核人員',
      width: '150',
      dataIndex: 'applyUser',
    },
    {
      type: FblColumnType.PLAIN,
      title: '審核日期',
      width: '150',
      dataIndex: 'applyDate',
    },
  ],
})

// 異動日期 預設值
const initDate = () => {
  // 預設 today - 30 到 today
  formData.value.modifyDate = [new Date(dayjs().subtract(30, 'day').toString()), new Date(dayjs().toString())]

  // 預設 審核結果 全選
  formData.value.results = [1, 2, 3]
}

/**
 * API
 */
// API: 查詢卡片類型異動紀錄
const postAPI_findApplys = async () => {
  setLoading(true)
  const $submit = {
    applyType: undefined,
    applyStatus: formData.value.results,
    modifyUser: formData.value.modifyUser,
    modifyDateStart: formData.value.modifyDate && $dateTimeUtil.dateToRocDateString(formData.value.modifyDate[0]),
    modifyDateEnd: formData.value.modifyDate && $dateTimeUtil.dateToRocDateString(formData.value.modifyDate[1]),
    page: $dataGrid.value.pagination.current - 1,
    size: $dataGrid.value.pagination.pageSize,
  }
  await $applyManagementApi
    .findApplysUsingPOST($submit)
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
  postAPI_findApplys()
}

/**
 * Hook
 */
onMounted(() => {
  initDate()
  postAPI_findApplys()
})
</script>
<template>
  <FormTitle title="覆核紀錄" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid md:grid-cols-4">
      <a-form-item label="審核結果">
        <a-checkbox-group v-model:value="formData.results" :options="plainOptions" />
      </a-form-item>
      <a-form-item label="送審人員">
        <a-input class="w-full" v-model:value="formData.modifyUser" placeholder="請輸入送審人員" allowClear />
      </a-form-item>
      <a-form-item label="送審日期">
        <date-picker
          range
          v-model:value="formData.modifyDate"
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
    :pagination="false"
  />
</template>

<style scoped></style>
