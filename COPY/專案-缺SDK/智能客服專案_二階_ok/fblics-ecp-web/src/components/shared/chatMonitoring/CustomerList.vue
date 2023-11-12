<script setup lang="ts">
import { getCurrentInstance } from 'vue'

import type { ChatHistoryResultDto } from '@fubonlife/fblics-api-axios-sdk'
const {
  proxy: { $fblicsEnum },
} = getCurrentInstance()

interface propDataAddClientValidation extends ChatHistoryResultDto {
  clientValidation?: string
}

interface PropData {
  propData: propDataAddClientValidation
  clientId?: string
  activeId?: string
}
const $props = defineProps<PropData>()

// 進線管道 Enum文字轉換
const loginSystemStr = str => {
  return $fblicsEnum.getLabel('loginSystemEnum', str)
}

const clientValidationStr = str => {
  return $fblicsEnum.getLabel('clientValidationEnum', str)
}
</script>

<template>
  <div
    class="relative my-[8px] cursor-pointer rounded-[10px] px-[8px] py-[5px] pr-[20px] text-[12px]"
    :class="{ 'bg-white': $props.activeId === $props.propData.mobvoiChatId }"
  >
    <div class="flex">
      <div>
        <span>進線時間：</span>
        <span class="ml-[5px]">{{ $props.propData.createTime }}</span>
      </div>
    </div>
    <div class="flex">
      <div>
        <span>姓名：</span>
        <span class="ml-[5px]">{{ $props.propData.clientName }}</span>
      </div>
    </div>
    <div class="flex">
      <div>
        <span>IP：</span>
        <span class="ml-[5px]">{{ $props.propData.clientIp }}</span>
      </div>
    </div>
    <div class="flex">
      <div>
        <span>客服：</span>
        <span class="ml-[5px]">{{ $props.propData.attendantName }}</span>
      </div>
    </div>
    <div class="flex">
      <div>
        <span>進線管道：</span>
        <span class="ml-[5px]">{{ loginSystemStr($props.propData.loginSystem) }}</span>
      </div>
    </div>
    <div class="flex">
      <div>
        <span>核身狀態：</span>
        <span class="ml-[5px]">{{ clientValidationStr($props.propData.clientValidation) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
