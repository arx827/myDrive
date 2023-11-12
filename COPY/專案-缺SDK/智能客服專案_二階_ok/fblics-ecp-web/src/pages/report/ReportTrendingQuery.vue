<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { Form } from 'ant-design-vue'

import { useLoadingStore } from '@/stores'

import dayjs from 'dayjs'

import type { ReportTrendingQuery } from '@pages/page_modal'

import { FblColumnType } from '@shared/dataGrid/models'

const dateFormat: string = 'YYYY/MM/DD'

const { setLoading } = useLoadingStore()

const formData = ref<ReportTrendingQuery.formDataType>({
  changePersonnel: '',
  changeDate: [null, null],
})

const { resetFields } = Form.useForm(formData.value)

//預覽表格
const $dataGrid = ref({
  data: [],
  columns: [
    {
      type: FblColumnType.TEMPLATE,
      title: '字卡類型名稱',
      dataIndex: 'categoryTitle',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '字卡名稱',
      dataIndex: 'cardTitle',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '點擊數',
      dataIndex: 'count',
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
  }

  await $reportApi
    .trendingQueryExportUsingPOST($submit, { responseType: 'blob' })
    .then(res => {
      $blobUtils.downloadFile(res, '熱門選單.xlsx')
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
  }
  await $reportApi
    .searchTrendingQueryUsingPOST($submit)
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
  <FormTitle title="熱門選單" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid lg:grid-cols-2">
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
