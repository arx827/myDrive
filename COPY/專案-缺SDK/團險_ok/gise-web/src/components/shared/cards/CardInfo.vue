<script setup lang="ts">
import { computed } from 'vue'

export interface CardInfoColumn {
  key: string
  label: string
}

interface CardInfoProp<T> {
  title?: string
  type?: string
  columns?: CardInfoColumn[]
  data?: T
}
const $props = withDefaults(defineProps<CardInfoProp<any>>(), {
  type: 'neutral',
})

const $twClass = computed<string>(() => {
  return `bg-${$props.type}`
})
</script>
<template>
  <div class="overflow-hidden">
    <div :class="$twClass" class="rounded-lg rounded-b-none px-4 py-2.5">
      <div class="flex items-center font-semibold text-white">
        <div class="flex-auto" v-if="$props.title">{{ $props.title }}</div>
        <div class="ml-2 flex gap-2">
          <slot name="headerControl" />
        </div>
      </div>
    </div>
    <div class="rounded-lg rounded-t-none border border-t-0 border-neutral-entry p-4">
      <template v-if="$props.data && $props.columns">
        <div class="flex pb-2" v-for="(column, index) in $props.columns" :key="index">
          <span class="flex-1">{{ column.label }}</span>
          <slot name="customCell" :data="$props.data" :column="column">
            <span class="flex-1 text-right font-semibold"> {{ $props.data[column.key] }}</span>
          </slot>
        </div>
      </template>
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
