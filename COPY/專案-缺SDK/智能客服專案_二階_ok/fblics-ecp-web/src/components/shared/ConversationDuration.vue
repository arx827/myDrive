<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'

import { useSocket } from '@composables/useSocket'
const { socketUtil } = useSocket()

const {
  proxy: { $numberUtil },
} = getCurrentInstance()
const waitRefresh = ref(null)

const $props = defineProps<{ dataTime: string; solar?: boolean; send?: string }>()

const duration = ref('')

const calculate = () => {
  if (!$props.dataTime) {
    duration.value = '00:00'
  } else {
    const nowFormat = dayjs()
    let loginTimeFormat = dayjs($props.dataTime)
    if ($props.solar) loginTimeFormat = loginTimeFormat.add(1911, 'year') // 西元年
    const $totalSecond = Math.floor(nowFormat.diff(loginTimeFormat) / 1000)

    const $totalMinutes = Math.floor($totalSecond / 60)

    const $minutes = $totalMinutes % 60
    const $second = $totalSecond % 60
    if ($totalMinutes > 60) {
      const $hours = Math.floor($totalMinutes / 60)
      duration.value = `${$hours}:${$numberUtil.padStart($minutes, 2)}:${$numberUtil.padStart($second, 2)}`
    } else {
      duration.value = `${$numberUtil.padStart($minutes, 2)}:${$numberUtil.padStart($second, 2)}`
    }
  }
  if ($props.send) {
    socketUtil.socketSend_noResponseDuration(duration.value, $props.send)
  }
}

onMounted(() => {
  waitRefresh.value = setInterval(() => {
    calculate()
  }, 1000)
})

onUnmounted(() => {
  window.clearInterval(waitRefresh.value)
})
</script>

<template>
  {{ duration }}
</template>

<style scoped></style>
