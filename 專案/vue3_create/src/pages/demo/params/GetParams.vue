<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const {
  proxy: { $global },
} = getCurrentInstance()

const $router = useRouter()

let $query = ref({
  policyNo: '',
})

let $params = ref({
  policyNo: '',
})

$query = $global.deepCopyData($global.getQuery()) || null
$params = $global.deepCopyData($router.currentRoute.value.params) || null

/**
 * Event
 */
// 重新查詢
const resetSearch = () => {
  $router.push({
    name: 'PassParams',
  })
  // 清除 Storage
  $global.clearParam()
}
</script>
<template>
  <div class="page__container flex-fill">
    <div class="container__wrap">
      <h4>查詢結果頁</h4>
      <div class="section__container">
        <p>傳送來源：{{ $query?.policyNo ? 'Query' : $params?.policyNo ? 'Params' : '' }}</p>
        <p v-if="$query?.policyNo">
          保單號碼：<span>{{ $query?.policyNo }}</span>
        </p>
        <p v-if="$params?.policyNo">
          保單號碼：<span>{{ $params?.policyNo }}</span>
        </p>

        <a-divider />

        <div class="d-flex justify-content-center">
          <button class="btn__main" theme="primary" @click="resetSearch">重新產生</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
