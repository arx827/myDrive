<script setup lang="ts">
interface FormTitleProp {
  title: string
}

const $props = defineProps<FormTitleProp>()
</script>

<template>
  <div class="flex items-center py-[14px]">
    <h4 class="my-2 border-l-4 pl-2 text-xl font-bold leading-[22px] text-info">
      <div>
        {{ $props.title }}
      </div>
    </h4>
    <div class="ml-auto">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
