<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
import { useRouter } from 'vue-router'

const {
  proxy: { $global },
} = getCurrentInstance()

const $router = useRouter()
defineProps({
  pageTitle: String,
  resultTitle: String,
  resultType: {
    type: String,
    default: 'error',
  },
})

let $type = ref('')

$type.value = $global.deepCopyData($router.currentRoute.value.params.type) || null

let $isSuccess = computed(() => {
  return $type.value === 'success'
})

/**
 * Event
 */
const goBack = () => {
  $router.push({
    name: 'Result',
  })
}
</script>

<template>
  <div class="page__container flex-fill">
    <LayoutResult
      :page-title="'我的預約'"
      :result-title="$isSuccess ? '取消預約成功' : '取消預約失敗'"
      :result-type="$type"
    >
      <template #body>
        <div v-if="$isSuccess">
          <p>親愛的同仁您好，</p>
          <p>您欲取消預約的項目已處理成功，謝謝。</p>
        </div>
        <div v-else>
          親愛的同仁您好，
          <br />
          您欲取消預約的項目，因不明因素。
          <br />
          如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template #buttons>
        <a class="btn__radius--primary me-1" @click="goBack">回到我的預約</a>
      </template>
    </LayoutResult>
  </div>
</template>

<style scoped lang="scss"></style>
