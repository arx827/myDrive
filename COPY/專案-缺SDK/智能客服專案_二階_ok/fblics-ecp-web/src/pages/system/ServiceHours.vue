<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import { Form, Modal } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import { useLoadingStore } from '@/stores'

import type { ServiceHours } from '@pages/page_modal'

const { setLoading } = useLoadingStore()

const {
  proxy: { $serviceSettingsApi },
} = getCurrentInstance()

const formData = ref<ServiceHours.IFormData>({
  serviceStartHour: null,
  serviceStartMinute: null,
  serviceEndHour: null,
  serviceEndMinute: null,
})

const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  serviceStartHour: [{ required: true, message: '服務進線時間小時_起' }],
  serviceStartMinute: [{ required: true, message: '服務進線時間分鐘_起' }],
  serviceEndHour: [{ required: true, message: '服務進線時間小時_迄' }],
  serviceEndMinute: [{ required: true, message: '服務進線時間分鐘_迄' }],
})

const { validateInfos } = Form.useForm(formData.value, formRules.value)

/**
 * API
 */
// API: 查詢 查詢服務時段
const postAPI_getServiceHours = () => {
  setLoading(true)
  $serviceSettingsApi
    .getServiceHoursUsingPOST()
    .then(res => {
      const $getData = res.data
      formData.value.serviceStartHour = $getData.serviceStartHour.toString()
      formData.value.serviceStartMinute = $getData.serviceStartMinute.toString()
      formData.value.serviceEndHour = $getData.serviceEndHour.toString()
      formData.value.serviceEndMinute = $getData.serviceEndMinute.toString()
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
// const onSubmit = (): void => {
//   validate()
//     .then(res => {
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
  postAPI_getServiceHours()
})
</script>
<template>
  <FormTitle title="客服人員服務時段" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
      <a-form-item label="文字客服-服務進線時間小時_起" v-bind="validateInfos.serviceStartHour">
        <a-time-picker
          class="w-full"
          v-model:value="formData.serviceStartHour"
          :showNow="false"
          value-format="HH"
          format="HH"
          disabled
        />
      </a-form-item>
      <a-form-item label="文字客服-服務進線時間分鐘_起" v-bind="validateInfos.serviceStartMinute">
        <a-time-picker
          class="w-full"
          v-model:value="formData.serviceStartMinute"
          :showNow="false"
          value-format="mm"
          :minuteStep="5"
          format="mm"
          disabled
        />
      </a-form-item>
      <a-form-item label="文字客服-服務進線時間小時_迄" v-bind="validateInfos.serviceEndHour">
        <a-time-picker
          class="w-full"
          v-model:value="formData.serviceEndHour"
          :showNow="false"
          format="HH"
          value-format="HH"
          disabled
        />
      </a-form-item>
      <a-form-item label="文字客服-服務進線時間分鐘_迄" v-bind="validateInfos.serviceEndMinute">
        <a-time-picker
          class="w-full"
          v-model:value="formData.serviceEndMinute"
          :showNow="false"
          format="mm"
          value-format="mm"
          :minuteStep="5"
          disabled
        />
      </a-form-item>
    </div>
  </a-form>
  <!-- <div class="flex justify-center gap-4">
    <ButtonRectangle letter @click="onSubmit">儲存</ButtonRectangle>
  </div> -->
</template>

<style scoped></style>
