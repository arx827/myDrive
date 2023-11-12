<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { Form } from 'ant-design-vue'

import { useLoadingStore } from '@/stores'

import dayjs from 'dayjs'

import type { ReportAttendantChattingOverview } from '@pages/page_modal'

import { FblColumnType } from '@shared/dataGrid/models'

const dateFormat: string = 'YYYY/MM/DD'

const { setLoading } = useLoadingStore()

const formData = ref<ReportAttendantChattingOverview.formDataType>({
  attendantId: '',
  changeDate: [null, null],
})

const { resetFields } = Form.useForm(formData.value)

//預覽表格
const $dataGrid = ref({
  data: [],
  columns: [
    {
      type: FblColumnType.TEMPLATE,
      title: '值機人員ID',
      dataIndex: 'attendantId',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '值機人員姓名',
      dataIndex: 'attendantName',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '聊天次數',
      dataIndex: 'chatCount',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '聊天室代碼',
      dataIndex: 'chatroomId',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '聊天室總時長',
      dataIndex: 'chatroomTotalTime',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '聊天室平均時長',
      dataIndex: 'chatroomAverageTime',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '交談總時長',
      dataIndex: 'chattingTotalTime',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '交談平均時長',
      dataIndex: 'chattingAverageTime',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '作業總時長',
      dataIndex: 'operationTotalTime',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '作業平均時長',
      dataIndex: 'operationAverageTime',
    },
  ],
})

// 異動日期 預設值
const initDate = () => {
  // 預設 today - 30 到 today
  formData.value.changeDate = [new Date(dayjs().subtract(30, 'day').toString()), new Date(dayjs().toString())]
}

const {
  proxy: { $reportApi, $dateTimeUtil, $blobUtils },
} = getCurrentInstance()

/**
 * Event
 */
const onCancel = () => {
  resetFields()
}
const onDownload = async () => {
  setLoading(true)
  const $submit = {
    dateEnd: formData.value.changeDate && $dateTimeUtil.dateToRocDateString(formData.value.changeDate[1]),
    dateStart: formData.value.changeDate && $dateTimeUtil.dateToRocDateString(formData.value.changeDate[0]),
    attendantId: formData.value.attendantId,
  }
  await $reportApi
    .attendantChattingOverviewExportUsingPOST($submit, { responseType: 'blob' })
    .then(res => {
      $blobUtils.downloadFile(res, '值機統計報表.xlsx')
    })
    .finally(() => {
      setLoading(false)
    })
}

const onSearch = async () => {
  setLoading(true)
  const $submit = {
    dateEnd: formData.value.changeDate && $dateTimeUtil.dateToRocDateString(formData.value.changeDate[1]),
    dateStart: formData.value.changeDate && $dateTimeUtil.dateToRocDateString(formData.value.changeDate[0]),
    attendantId: formData.value.attendantId,
  }

  await $reportApi
    .searchAttendantChattingOverviewUsingPOST($submit)
    .then(res => {
      $dataGrid.value.data = res.data
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * Hook
 */
onMounted(() => {
  initDate()
})
</script>

<template>
  <FormTitle title="值機統計報表" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid lg:grid-cols-2">
      <a-form-item label="值機人員">
        <a-input
          class="w-full"
          v-model:value="formData.attendantId"
          placeholder="11個字以內佳，最多22個字"
          allowClear
        />
      </a-form-item>
      <a-form-item label="查詢日期區間">
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
    <ButtonRectangle letter @click="onSearch">查詢報表</ButtonRectangle>
    <ButtonRectangle letter @click="onDownload">下載報表</ButtonRectangle>
  </div>
  <div>
    <FblDataGrid
      class="gise-beneficiary-table"
      :columns="$dataGrid.columns"
      :data-source="$dataGrid.data"
      :pagination="false"
    >
    </FblDataGrid>
  </div>
</template>

<style scoped lang="postcss"></style>
