<script setup lang="ts">
import { onMounted, getCurrentInstance } from 'vue'

const {
  proxy: { $global },
} = getCurrentInstance()

/**
 * Event
 */
const goto = (type: String) => {
  $global.changeRouterAndaddParam({
    toRouter: 'ResultType',
    params: {
      type: type,
    },
  })
}

/**
 * Hook
 */
onMounted(() => {})
</script>

<template>
  <div class="page__container flex-fill">
    <div class="container__wrap">
      <h4>Result 前往結果頁</h4>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__primary" @click="goto('success')">Success</a-button>
        <a-button class="btn__danger" @click="goto('error')">Error</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
