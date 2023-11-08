<script setup lang="ts">
const $props = defineProps({
  type: String,
})
</script>

<template>
  <pre v-highlightjs class="preCode">
    <code :class="$props.type"><slot name="code" /></code>
  </pre>
</template>

<style scoped lang="scss">
.preCode {
  white-space: normal;
  code {
    white-space: pre;
  }
}
</style>
