<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { Form, Modal } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import { useLoadingStore } from '@/stores'

import type { MaintenMessage } from '@pages/page_modal'

const {
  proxy: { $serviceSettingsApi },
} = getCurrentInstance()

const { setLoading } = useLoadingStore()

const formData = ref<MaintenMessage.formDataType>({
  message: '',
})

const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  message: [{ required: true, message: '請輸入 系統維護宣告文字訊息' }],
})

const { validateInfos } = Form.useForm(formData.value, formRules.value)

/**
 * API
 */
// API: 系統維護宣告文字訊息
const getAPI_getMaintenanceMessage = () => {
  setLoading(true)
  $serviceSettingsApi
    .getMaintenanceMessageUsingPOST()
    .then(res => {
      const $getData = res.data
      formData.value.message = $getData.message
    })
    .catch(error => {
      Modal.error({
        content: `${error.response.data.message || error.response.data.error}，請重新操作`,
      })
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * Event
 */
// const onSubmit = () => {
//   validate()
//     .then(res => {
//       console.log(formData.value.message)
//       console.log('儲存成功', res)
//     })
//     .catch(error => {
//       console.log('儲存失敗', error)
//     })
// }

/**
 * Hook
 */
onMounted(() => {
  getAPI_getMaintenanceMessage()
})
</script>
<template>
  <FormTitle title="系統維護宣告文字訊息" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <a-form-item label="系統維護宣告文字訊息(支援HTML)" v-bind="validateInfos.message">
      <a-textarea v-model:value="formData.message" placeholder="請輸入" disabled />
    </a-form-item>
  </a-form>
  <p class="mb-3 font-semibold">預覽</p>
  <div class="previewBox border-b border-b-neutral-entry pb-2" v-html="formData.message" />
  <!-- <div class="mt-[16px] flex justify-center gap-4">
    <ButtonRectangle class="w-[64px]" letter @click="onSubmit">儲存</ButtonRectangle>
  </div> -->
</template>

<style scoped lang="postcss">
textarea.ant-input {
  @apply min-h-[8rem];
}
.previewBox {
  :deep(a) {
    @apply text-primary underline decoration-primary;
  }
}
</style>
