<script setup lang="ts">
import { computed, watch, ref, nextTick, useAttrs, useSlots } from 'vue'
// import { uuid } from 'vue-uuid'

const grid = defineProps(['isSelect', 'selector'])
const $emit = defineEmits(['inspectClick', 'tableChange', 'onSelectChange', 'batch', 'update:selector'])

const $attrs = useAttrs()
const $slots = useSlots()

const rowSelectoion = {
  onChange: (selectedRowKeys, selectedRows) => {
    // 觸發父層 事件
    $emit('onSelectChange', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    // 更新父層 變數
    $emit('update:selector', selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    // 更新父層 變數
    $emit('update:selector', selectedRows, changeRows)
  },
}

const renderColumns = computed(() => {
  return ($attrs.columns as any).filter(c => !c.hidden)
})

function plainTextOf({ record, column }): string {
  if (column.formatter) {
    return column.formatter(record)
  }
  return (record as any)[column.dataIndex]
}

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
  () => $attrs.columns,
  () => {
    nextTick(() => {
      if (tableRef.value) {
        const nativeTable = tableRef.value.$el
        const allHeader = nativeTable.querySelectorAll(`.ant-table-thead th`)
        renderColumns.value.forEach((c, idx) => {
          if (grid.isSelect) {
            idx += 1
          }
          const head: any = allHeader[idx]
          if (c.width) {
            head.style.width = `${c.width}px`
            head.style.minWidth = `${c.width}px`
          } else {
            head.style.width = ''
          }

          if (c.ellipsis && c.width) {
            if (c.width) {
              head.style.maxWidth = `${c.width}px`
            } else {
              head.style.maxWidth = '100px'
            }
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
      :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :row-selection="grid.isSelect ? rowSelectoion : null"
      v-bind="$attrs"
      @change="handleTableChange"
    >
      <template #headerCell="scope">
        <template v-if="scope.column.headerCellTemp">
          <slot :name="scope.column.headerCellTemp" :scope="scope" />
        </template>
      </template>

      <template #bodyCell="scope">
        <template v-if="scope.column.type === 'TEMPLATE'">
          <slot :name="scope.column.bodyCellTemp" :scope="scope" />
        </template>
        <template v-else-if="scope.column.type === 'PLAIN'">
          <a class="link" v-if="scope.column.inspect" @click="handleInspectClick(scope)">{{ plainTextOf(scope) }}</a>
          <span v-else>
            {{ plainTextOf(scope) }}
          </span>
        </template>
      </template>

      <template #title v-if="Object.keys($slots).includes('title')">
        <slot name="title" />
      </template>

      <template #footer v-if="Object.keys($slots).includes('title')">
        <slot name="footer" />
      </template>
    </a-table>
  </div>
</template>
<style lang="scss"></style>
