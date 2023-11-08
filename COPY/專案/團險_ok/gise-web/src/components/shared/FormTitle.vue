<script setup lang="ts">
interface FormTitleProp {
  title: string
}

const $props = defineProps<FormTitleProp>()
</script>

<template>
  <h4 class="mb-2 border-l-4 pl-2 text-lg font-bold leading-[22px] text-info lg:mb-4 lg:text-2xl">
    {{ $props.title }}
  </h4>
</template>

<style scoped></style>
