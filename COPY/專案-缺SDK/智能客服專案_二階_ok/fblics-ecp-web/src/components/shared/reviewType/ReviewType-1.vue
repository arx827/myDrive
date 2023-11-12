<script setup lang="ts">
import { ref } from 'vue'
import { FblColumnType } from '@shared/dataGrid/models'

interface IProps {
  gridData: {
    id?: string
    actionStatus?: string
    workingStatusName?: string
    status?: string
  }[]
}

const $props = defineProps<IProps>()

const $dataGrid = ref({
  columns: [
    {
      type: FblColumnType.TEMPLATE,
      title: '類型',
      width: 80,
      bodyCellTemp: 'actionStatus',
      dataIndex: 'actionStatus',
    },
    {
      type: FblColumnType.PLAIN,
      title: '工作狀態名稱',
      width: 200,
      dataIndex: 'workingStatusName',
    },
    {
      type: FblColumnType.TEMPLATE,
      bodyCellTemp: 'status',
      title: '狀態分類',
    },
  ],
})
</script>
<template>
  <FormTitle title="覆核 工作狀態新增/修改" />

  <FblDataGrid
    class="gise-beneficiary-table"
    :columns="$dataGrid.columns"
    :data-source="$props.gridData"
    :pagination="false"
  >
    <template #actionStatus="{ scope: { record } }">
      <Badge :status="record.actionStatus" />
    </template>
    <template #status="{ scope: { record } }">
      <Badge :status="record.status" />
    </template>
  </FblDataGrid>
</template>

<style scoped></style>
