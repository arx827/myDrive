<script setup lang="ts">
// import { FblColumn } from '@shared/data-grid/model'
import { defineProps, computed, watch, ref, nextTick, defineEmits } from 'vue'

const grid = defineProps(['dataSource', 'columns', 'pagination', 'bordered', 'size', 'isSelect', 'test', 'scroll'])
const $emit = defineEmits(['inspectClick', 'tableChange', 'onSelect', 'batch', 'update:test'])

const rowSelectoion = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    // console.log('onselect', record, selected, selectedRows)
    $emit('update:test', selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    // console.log('onSelectAll', selected, selectedRows, changeRows)
    $emit('update:test', selectedRows, changeRows)
  },
}

const renderColumns = computed(() => {
  return grid.columns.filter(c => !c.hidden)
})

const plainTextOf = ({ record, column }) => {
  if (column.formatter) {
    return column.formatter(record)
  }
  const props = column.dataIndex.toString().split('.')
  let retVal = record[props[0]]
  props.forEach((p, i) => {
    if (i > 0) {
      if (retVal !== undefined && retVal !== null) {
        retVal = retVal[props[i]]
      }
    }
  })
  return retVal
}

// const widthOf = column => {
//   return `${column.width}`
// }

/**
 * Event
 */
const handleInspectClick = record => {
  $emit('inspectClick', record)
}
const handleTableChange = record => {
  $emit('tableChange', record)
}
/**
 * Element
 */
const tableRef = ref(null)

/**
 * 監聽
 */
watch(
  () => grid.columns,
  () => {
    nextTick(() => {
      // console.log(tableRef.value)
      if (tableRef.value) {
        const nativeTable = tableRef.value.$el
        renderColumns.value.forEach((c, idx) => {
          const head: any = nativeTable.querySelector(`.ant-table-thead th[colstart="${idx}"]`)
          if (c.width) {
            head.style.minWidth = `${c.minWidth}`
          } else {
            head.style.minWidth = undefined
          }
        })
      }
    })
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <a-table
      ref="tableRef"
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :bordered="bordered"
      :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :size="size"
      :scroll="scroll"
      :row-selection="grid.isSelect ? rowSelectoion : null"
      @change="handleTableChange"
    >
      <template #headerCell="{ column: { headerTemp } }">
        <slot :name="headerTemp"></slot>
      </template>

      <template #bodyCell="scope">
        <template v-if="scope.column.type === 'TEMPLATE'">
          <slot :name="scope.column.bodyTemp" :scope="scope" />
        </template>
        <template v-else-if="scope.column.type === 'PLAIN'">
          <a class="link" v-if="scope.column.inspect" @click="handleInspectClick(scope)">{{ scope.text }}</a>
          <span v-else>
            {{ plainTextOf(scope) }}
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<style lang="scss"></style>
