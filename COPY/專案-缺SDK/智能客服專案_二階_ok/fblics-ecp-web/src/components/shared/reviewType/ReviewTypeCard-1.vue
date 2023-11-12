<script setup lang="ts">
import { ref } from 'vue'
import { FblColumnType } from '@shared/dataGrid/models'
interface IProps {
  gridData: {
    cardCategoryId: number
    cardCategoryName: string
    modifyStatus: number
    applyStatus: number
    modifyName: string
    modifyDate: string
  }
  modifyType: number
}

const $props = defineProps<IProps>()
const $gridData = ref({
  rowKey: 'key',
  scroll: { x: true },
  columns: [
    {
      type: FblColumnType.TEMPLATE,
      title: '類型',
      dataIndex: 'modifyType',
      bodyCellTemp: 'status',
      width: 90,
    },
    {
      type: FblColumnType.PLAIN,
      title: '卡片類型名稱',
      dataIndex: 'cardCategoryName',
    },
  ],
})
</script>
<template>
  <FormTitle title="覆核 卡片類型管理" />
  <FblDataGrid
    class="ant-table-striped popupContainerElement"
    :columns="$gridData.columns"
    :dataSource="[$props.gridData]"
    size="small"
  >
    <template #status>
      <Badge :status="$props.modifyType" enumName="actionStatus" />
    </template>
  </FblDataGrid>
</template>

<style scoped></style>
