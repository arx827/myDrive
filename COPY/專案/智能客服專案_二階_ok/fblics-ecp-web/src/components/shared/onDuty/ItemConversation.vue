<script setup lang="ts">
import { getCurrentInstance, computed } from 'vue'

import type { conversationMessageType } from '@stores/use_model'
import { useOnDutyStore } from '@stores/useOnDutyStore'

const { lastClientMessage, isDisabledRoom } = useOnDutyStore()

const {
  proxy: { $fblicsEnum },
} = getCurrentInstance()

const $emit = defineEmits(['click'])

const $props = defineProps<{ propData: conversationMessageType; active: boolean }>()

const messageNum = computed(() => {
  return $props.propData.messageNum > 99 ? '99+' : $props.propData.messageNum
})

// 進線管道 Enum文字轉換
const loginSystemStr = str => {
  return $fblicsEnum.getLabel('loginSystemEnum', str)
}

const clientValidationStr = str => {
  return $fblicsEnum.getLabel('clientValidationEnum', str)
}

const $lastClientMessage = computed(() => {
  return lastClientMessage($props.propData.chatroomName)
})
</script>

<template>
  <div
    class="relative my-[8px] cursor-pointer rounded-[10px] px-[8px] py-[5px] pr-[20px] text-[12px]"
    :class="{ shineClass: $props.propData.wait, activeClass: $props.active }"
    @click="$emit('click')"
  >
    <div>
      <span class="whitespace-nowrap">姓名：</span>
      <span class="ml-[5px]">{{ $props.propData.name }}</span>
    </div>
    <div class="mt-[2px]">
      <span class="whitespace-nowrap">ID：</span>
      <span class="ml-[5px]">{{ $props.propData.clientId }}</span>
    </div>
    <div class="mt-[2px]">
      <span class="whitespace-nowrap">登入時間：</span>
      <span class="ml-[5px]">{{ $props.propData.loginTime }}</span>
    </div>
    <div class="mt-[2px]">
      <span class="whitespace-nowrap">未回覆時長：</span>
      <span class="ml-[5px]"
        ><ConversationDuration
          :data-time="$lastClientMessage"
          :send="$props.propData.chatroomName"
          v-if="!isDisabledRoom($props.propData.chatroomName)"
        /><span v-else>0:00</span></span
      >
    </div>
    <div class="mt-[2px]">
      <span class="whitespace-nowrap">進線管道：</span>

      <span class="ml-[5px]">{{ loginSystemStr($props.propData.loginSystem) }}</span>
    </div>
    <div class="mt-[2px]">
      <span class="whitespace-nowrap">核身狀態：</span>

      <span class="ml-[5px]">{{ clientValidationStr($props.propData.clientValidation) }}</span>
    </div>
    <div
      v-if="Number(messageNum) > 0"
      class="absolute right-[3px] top-[50%] inline-flex h-[20px] min-w-[20px] translate-y-[-50%] items-center justify-center rounded-full bg-danger px-[5px] text-white"
    >
      {{ messageNum }}
    </div>
  </div>
</template>

<style scoped lang="postcss">
.shineClass {
  animation: shine 1.5s ease-in-out infinite;
}
.activeClass {
  @apply bg-white;
}
@keyframes shine {
  0% {
    background-color: transparent;
  }
  40% {
    background-color: transparent;
  }
  50% {
    background-color: #ffe8e8;
  }
  90% {
    background-color: #ffe8e8;
  }
  100% {
    background-color: transparent;
  }
}
</style>
