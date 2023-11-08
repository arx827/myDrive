<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import type { TreeProps } from 'ant-design-vue'

import { useLoadingStore } from '@/stores'

import { useOnDutyStore } from '@stores/useOnDutyStore'
import { storeToRefs } from 'pinia'

import { Modal } from 'ant-design-vue'

const { setExpandedKeys, setChatInput } = useOnDutyStore()
const { getExpandedKeys } = storeToRefs(useOnDutyStore())

const { setLoading } = useLoadingStore()

const {
  proxy: { $global, $textTemplateManagementApi },
} = getCurrentInstance()

const canData = ref<TreeProps['treeData']>([])

/**
 * API
 */
// API: 查詢罐頭語清單
const postAPI_findTextTemplate = () => {
  setLoading(true)
  $textTemplateManagementApi
    .findTextTemplateUsingPOST()
    .then(res => {
      const $getData = $global.deepCopyData(res.data)

      canData.value = $getData.map(i => ({
        title: i.textTemplateCategoryName,
        key: `CategoryId_${i.textTemplateCategoryId}`,
        children: i.textTemplateList.map(j => ({
          title: j.textTemplateName,
          icon: true,
          tooltip: j.textTemplateDescription,
          key: j.textTemplateId,
        })),
      }))
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
const copyCanToInput = ({ tooltip }) => {
  setChatInput(tooltip)
}

const onExpand = keys => {
  setExpandedKeys(keys)
}

/**
 * Hook
 */
onMounted(() => {
  postAPI_findTextTemplate()
})
</script>

<template>
  <a-tree
    :defaultExpandAll="true"
    :tree-data="canData"
    v-model:expandedKeys="getExpandedKeys"
    @expand="onExpand"
    class="canListTree"
  >
    <template #title="{ title, icon, tooltip }">
      <a-tooltip
        placement="right"
        v-if="tooltip"
        autoAdjustOverflow
        overlayClassName="max-w-[300px] pointer-events-none"
      >
        <template #title>
          <span class="text-sm">{{ tooltip }}</span>
        </template>
        <div class="flex items-center" @click="copyCanToInput({ tooltip })">
          <copy-outlined v-if="icon" class="mr-[5px]" />
          <div>{{ title }}</div>
        </div>
      </a-tooltip>

      <div class="flex items-center" v-else>
        <div>{{ title }}</div>
      </div>
    </template>
  </a-tree>
</template>

<style scoped></style>
