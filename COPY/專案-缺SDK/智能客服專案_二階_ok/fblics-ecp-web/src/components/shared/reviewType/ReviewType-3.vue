<script setup lang="ts">
import { ref } from 'vue'
import { FblColumnType } from '@shared/dataGrid/models'
import dayjs from 'dayjs'
interface IProps {
  gridData: {
    type: string
    name: string
    date: string
  }[]
}

const $props = withDefaults(defineProps<IProps>(), {
  gridData: () => [],
})

const $gridData = ref({
  rowKey: 'key',
  data: [],
  scroll: { x: true },
  columns: [
    {
      type: FblColumnType.TEMPLATE,
      title: '類型',
      dataIndex: 'type',
      bodyCellTemp: 'status',
      width: 90,
    },
    {
      type: FblColumnType.PLAIN,
      title: '名稱',
      dataIndex: 'name',
    },
    {
      type: FblColumnType.PLAIN,
      title: '日期',
      dataIndex: 'date',
      width: 150,
      sorter: {
        compare: (a, b) => {
          return dayjs(a.date).format('x').localeCompare(dayjs(b.date).format('x'))
        },
      },
    },
    {
      type: FblColumnType.PLAIN,
      title: '備註',
      dataIndex: 'memo',
    },
  ],
})
</script>
<template>
  <FormTitle title="覆核 平日假日設定" />
  <FblDataGrid
    class="ant-table-striped popupContainerElement"
    :columns="$gridData.columns"
    :dataSource="$props.gridData"
    size="small"
  >
    <template #status="{ scope: { text } }">
      <Badge :status="text" />
    </template>
  </FblDataGrid>
</template>

<style scoped></style>
