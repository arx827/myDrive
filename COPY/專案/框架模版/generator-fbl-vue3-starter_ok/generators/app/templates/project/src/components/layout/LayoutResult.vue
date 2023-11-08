<script setup lang="ts">
import { computed } from 'vue'
const $props = defineProps({
  pageTitle: String,
  resultTitle: String,
  resultType: {
    type: String,
    default: 'error',
  },
})

const getResultTitle = computed(() => {
  return $props.resultType === 'success' ? 'success__title' : 'error__title'
})
</script>
<template>
  <div class="container">
    <div class="result__wrap">
      <div class="result__header">
        <h1 class="result__title">
          {{ pageTitle }}
        </h1>
      </div>
      <div class="result__body">
        <div class="result__body-title" :class="getResultTitle">
          {{ resultTitle }}
        </div>
        <slot name="body" />
      </div>
      <div class="result__footer">
        <slot name="buttons" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result__wrap {
  padding: 20px 0;
}
.result__title {
  color: $COLOR-BLACK;
  font-weight: 600;
  font-size: 30px;
}
.result__body {
  background-color: $COLOR-WHITE;
  padding: 25px 10%;
  border-radius: 10px;
  width: 100%;
  margin: 20px auto;
  min-height: 200px;
  box-shadow: 0px 3px 0px $COLOR-GRAY2;
  border: 1px solid $COLOR-GRAY2;
}
.result__body-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}
.success__title {
  color: $COLOR-MAIN1;
}
.error__title {
  color: $COLOR-MAIN6;
}
.result__footer {
  margin: 30px auto;
  text-align: center;
}
</style>
