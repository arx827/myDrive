<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSocket } from '@composables/useSocket'
import { useUtils } from '@composables/useUtils'
const { createAudio } = useUtils()

const { openSocket, disconnect, socketUtil } = useSocket()

// 托跩事件
const resize = ref(null) // 控制線

// 托跩 不超過以下 三個尺寸 (自定義)
const onDutySiderMinW: number = 175 // 側邊欄 最小可接受寬度
const onDutyChatAreaMinW: number = 200 // 中間輸入框 最小可接受寬度
const onDutyRightTabsW: number = 200 // 右側Tab 最小可接受寬度

const currentClientW = ref<number>(0) // resize 時，判斷縮放方向用

const onDutyRightTabsReSizeW = ref<number>(500)
const leftBoundary = onDutySiderMinW + onDutyChatAreaMinW

// 滑鼠事件
const resize_mouseDown = ele => {
  ele.preventDefault()

  resize.value.classList.add('active')

  document.onmousemove = function (e) {
    const rightBoundary = document.body.clientWidth - onDutyRightTabsW
    const clientX = e.clientX

    // 介於 左邊界 與 右側 Tab 最小可接受寬度
    if (clientX <= leftBoundary) {
      onDutyRightTabsReSizeW.value = document.body.clientWidth - leftBoundary
      resize.value.classList.remove('stop')
      return
    }
    if (clientX >= rightBoundary) {
      onDutyRightTabsReSizeW.value = onDutyRightTabsW
      resize.value.classList.remove('stop')
      return
    }
    onDutyRightTabsReSizeW.value = document.body.clientWidth - clientX
  }
  document.onmouseup = function () {
    document.onmousemove = null
    document.onmouseup = null
    resize.value.classList.remove('active')
  }
}

// 自動計算高度
const resizeEvent = () => {
  const oldWidth = currentClientW.value
  currentClientW.value = document.body.clientWidth
  const newWidth = currentClientW.value
  const lastWidth = document.body.clientWidth - leftBoundary
  if (oldWidth > newWidth) {
    // 畫面縮小時
    if (lastWidth < onDutyRightTabsReSizeW.value) {
      onDutyRightTabsReSizeW.value = lastWidth
    }
  } else {
    // 畫面放大時
    if (lastWidth > 500) {
      onDutyRightTabsReSizeW.value = 500
    } else {
      onDutyRightTabsReSizeW.value = lastWidth
    }
  }
}

/**
 * Hook
 */
// 初始先建立 鈴聲
onMounted(async () => {
  createAudio()
  resizeEvent()
  window.addEventListener('resize', resizeEvent)
  currentClientW.value = document.body.clientWidth
  await openSocket()

  // 訂閱 header 資訊
  socketUtil.socket_clientMonitoringResult()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEvent)
  disconnect()
})
</script>

<template>
  <Loading />

  <div class="flex min-h-screen flex-col">
    <!-- header -->
    <OnDutyHeader />

    <!-- main -->
    <div class="flex flex-1">
      <!-- 左側 進線區塊 -->
      <OnDutySider />

      <!-- 中間 對話區塊 -->
      <OnDutyChatArea />

      <!-- 左右拖曳 控制大小bar -->
      <div ref="resize" class="resize" @mousedown="resize_mouseDown"></div>

      <!-- 右側 歷史對話 & 罐頭訊息 -->
      <OnDutyRightTabs :resizeW="onDutyRightTabsReSizeW" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
/* 右側  */
.ant-tabs {
  @apply text-neutral;
  :deep(.ant-tabs-nav) {
    margin-bottom: 8px;
  }
  :deep(.ant-tabs-nav-wrap) {
    @apply px-[15px] pt-[3px];
  }
}

.resize {
  @apply relative w-[2px] cursor-col-resize bg-neutral-entry;
  &.active,
  &:hover {
    @apply bg-primary;
  }
}
</style>
