<script setup lang="ts">
import { getCurrentInstance, computed } from 'vue'
import type { IEnum } from '@plugins/global/enumData'
interface IProps {
  status: number
  emunName?: string
}

const {
  proxy: { $fblicsEnum },
} = getCurrentInstance()

const $props = withDefaults(defineProps<IProps>(), {
  status: 1,
})

const getPropsObj = computed<IEnum<string>>(() => {
  if ($props.emunName) {
    return $fblicsEnum.getObject($props.emunName, $props.status.toString())
  }
  return $fblicsEnum.getObject('actionStatus', $props.status) || $fblicsEnum.getObject('workingStatus', $props.status)
})
</script>
<template>
  <a-badge class="badgeStyle" :color="getPropsObj?.color" :text="getPropsObj?.label" />
</template>

<style scoped lang="postcss">
.badgeStyle {
  :deep(.ant-badge-status-dot) {
    @apply h-[12px] w-[12px];
  }
  :deep(.ant-badge-status-text) {
    @apply mx-[8px];
  }
}
</style>
