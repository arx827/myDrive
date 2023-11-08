<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { FblColumnType } from '@shared/dataGrid/models'
import reviewSvg from '@/assets/imgs/icon_check.svg?url'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores'
import { Modal } from 'ant-design-vue'
import type { BaseOptionType } from 'ant-design-vue/es/select'

import type { ReviewIndex } from '@pages/page_modal'

const $router = useRouter()
const loadingStore = useLoadingStore()

const {
  proxy: { $fblicsEnum, $global, $applyManagementApi },
} = getCurrentInstance()

const formData = ref<ReviewIndex.formDataType>({
  applyType: null,
})

const applyTypeOption = ref<BaseOptionType[]>([])

const $dataGrid = ref({
  data: [],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '覆核功能',
      dataIndex: 'applyType',
      formatter: ({ applyType }) => {
        return applyTypeOption.value.find(({ value }) => applyType === value)?.label
      },
    },
    {
      type: FblColumnType.PLAIN,
      width: '80',
      title: '類型',
      dataIndex: 'modifyType',
      formatter: ({ modifyType }) => {
        return $fblicsEnum.getLabel('actionStatus', modifyType)
      },
    },
    {
      type: FblColumnType.PLAIN,
      title: '送審人員',
      dataIndex: 'modifyUser',
    },
    {
      type: FblColumnType.PLAIN,
      title: '送審日期',
      dataIndex: 'modifyDate',
    },
    {
      type: FblColumnType.TEMPLATE,
      width: '70',
      bodyCellTemp: 'active',
      title: '覆核',
      align: 'center',
    },
  ],
})

/**
 * API
 */
// API: 取得覆核類型
const postAPI_getApplyType = () => {
  loadingStore.setLoading(true)
  $applyManagementApi
    .getApplyTypeUsingPOST()
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      applyTypeOption.value = $getData.map(i => ({
        label: i.typeName,
        value: i.type,
      }))
    })
    .catch(error => {
      Modal.error({
        content: `${error.response.data.message || error.response.data.error}，請重新操作`,
      })
    })
    .finally(() => {
      loadingStore.setLoading(false)
    })
}

// API: 查詢待覆核作業 列表
const postAPI_findPendingApplys = (applyType = undefined) => {
  loadingStore.setLoading(true)
  $applyManagementApi
    .findPendingApplysUsingPOST(applyType)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      $dataGrid.value.data = $getData
    })
    .catch(error => {
      Modal.error({
        content: `${error.response.data.message || error.response.data.error}，請重新操作`,
      })
    })
    .finally(() => {
      loadingStore.setLoading(false)
    })
}

/**
 * Event
 */
const onOpenReviewLog = () => {
  const newPage = $router.resolve({ name: 'ReviewChangeLog' })
  window.open(newPage.href, 'ReviewChangeLog', '_blank')
}

const onChangeApplyType = $event => {
  postAPI_findPendingApplys($event)
}

const reviewRowData = data => {
  $global.changeRouterAndaddParam({
    toRouter: 'ReviewConfirm',
    query: data,
  })
}

/**
 * Hook
 */
onMounted(() => {
  postAPI_getApplyType()
  postAPI_findPendingApplys()
})
</script>
<template>
  <FormTitle title="覆核功能">
    <div class="flex gap-2">
      <ButtonRectangle btn-style="outline" @click="onOpenReviewLog">覆核紀錄</ButtonRectangle>
    </div>
  </FormTitle>
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
      <a-form-item label="覆核功能">
        <a-select
          v-model:value="formData.applyType"
          placeholder="請選擇"
          allowClear
          :options="applyTypeOption"
          @change="onChangeApplyType"
        />
      </a-form-item>
    </div>
  </a-form>
  <FblDataGrid
    class="gise-beneficiary-table"
    :columns="$dataGrid.columns"
    :data-source="$dataGrid.data"
    :pagination="false"
  >
    <template #active="{ scope: { value } }">
      <div class="flex justify-center gap-2">
        <ButtonIconic tooltip="覆核" @click="reviewRowData(value)">
          <img :src="reviewSvg" alt="" />
        </ButtonIconic>
      </div>
    </template>
  </FblDataGrid>
</template>

<style scoped></style>
