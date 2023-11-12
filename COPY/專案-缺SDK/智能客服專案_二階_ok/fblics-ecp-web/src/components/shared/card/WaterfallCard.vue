<script setup lang="ts">
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

import type { CardInfoByIdResponseDto } from '@fubonlife/fblics-api-axios-sdk'

interface IProps {
  cardsArr?: CardInfoByIdResponseDto[]
}

const $props = withDefaults(defineProps<IProps>(), {})
</script>
<template>
  <Waterfall :list="$props.cardsArr" :gutter="15" :backgroundColor="''" :hasAroundGutter="false" :breakpoints="{}">
    <template #item="{ item }">
      <slot name="cardData" :slotProps="item"></slot>
    </template>
  </Waterfall>
</template>

<style scoped></style>
