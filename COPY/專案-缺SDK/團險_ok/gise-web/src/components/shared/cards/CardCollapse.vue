<script setup lang="ts">
import { ref, watch } from 'vue'
import 'ant-design-vue/lib/collapse/style'

export interface CardCollapsed {
  checking: boolean
  title: string
  isCollapseOpen: boolean
  slotName?: string
  content?: string
}
interface CardCollapsedProp {
  items: Array<CardCollapsed>
  htmlInsert?: boolean
}

const $props = withDefaults(defineProps<CardCollapsedProp>(), {
  items: () => [{ checking: false, title: '標題名稱', isCollapseOpen: false, slotName: 'description1' }],
  htmlInsert: false,
})

const collapseItems = ref([])

function collapseClick(idx: number): void {
  collapseItems.value[idx].isCollapseOpen = !collapseItems.value[idx].isCollapseOpen
}

watch(
  $props,
  value => {
    collapseItems.value = value?.items
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div class="ant-collapse ant-collapse-icon-position-right collapseCard rounded text-base lg:text-lg">
    <div v-for="(item, index) in collapseItems" :key="index" class="ant-collapse-item">
      <div
        class="ant-collapse-header"
        role="button"
        :tabindex="index"
        aria-expanded="false"
        @click="collapseClick(index)"
      >
        <a-checkbox v-model:checked="item.checking" @click.stop></a-checkbox>
        <p class="pl-2 font-bold">{{ item.title }}</p>
        <span class="anticon anticon-right ant-collapse-arrow">
          <up-outlined v-if="item.isCollapseOpen" />
          <down-outlined v-else />
        </span>
      </div>
      <slide-up-down v-model="item.isCollapseOpen" :duration="300">
        <div class="ant-collapse-content ant-collapse-content-inactive">
          <div class="ant-collapse-content-box max-h-[200px] overflow-auto">
            <slot :name="item.slotName">
              <div :class="{ 'whitespace-pre-line': !htmlInsert }">
                <div v-if="htmlInsert">
                  <div v-html="item.content"></div>
                </div>
                <div v-else>{{ item.content }}</div>
              </div>
            </slot>
          </div>
        </div>
      </slide-up-down>
    </div>
  </div>
</template>

<style scoped lang="postcss">
/* 設定 description 有 連結文字時的樣式 */
.notice a {
  @apply underline underline-offset-4;
}
:deep(ol, ul) {
  @apply ps-[25px] !important;
}
</style>
