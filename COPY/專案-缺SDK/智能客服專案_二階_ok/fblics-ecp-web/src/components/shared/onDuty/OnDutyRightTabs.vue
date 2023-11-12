<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOnDutyStore } from '@stores/useOnDutyStore'
const { onRemoveRightTab } = useOnDutyStore()
const { getRightTabsArr, rightTabsActive, getRoleId } = storeToRefs(useOnDutyStore())

interface IProps {
  resizeW: number
}

const $props = defineProps<IProps>()
</script>

<template>
  <div
    class="h-[calc(100vh-64px)] bg-white transition-all duration-0 ease-linear"
    v-if="getRightTabsArr.length > 0"
    :style="{ width: `${$props.resizeW}px` }"
  >
    <a-tabs class="h-full" type="editable-card" hide-add @edit="onRemoveRightTab" v-model:activeKey="rightTabsActive">
      <a-tab-pane key="history" tab="歷史對話紀錄" v-if="getRightTabsArr.includes('history') && getRoleId.clientId">
        <ItemTabHistory />
      </a-tab-pane>
      <a-tab-pane key="can" tab="罐頭訊息" v-if="getRightTabsArr.includes('can')">
        <ItemTabCan />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped>
:deep(.ant-tabs-content-holder) {
  flex: 1;
  overflow: auto;
}
</style>
