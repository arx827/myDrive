<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import { Form, message, Modal } from 'ant-design-vue'
import { useLoadingStore } from '@/stores'
import type { RuleObject } from 'ant-design-vue/es/form'
import dayjs from 'dayjs'

import type { ServiceClosed } from '@pages/page_modal'

const {
  proxy: { $serviceSettingsApi },
} = getCurrentInstance()

const { setLoading } = useLoadingStore()

const formData = ref<ServiceClosed.IFormData>({
  date: null,
  description: null,
})

const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  date: [{ required: true, message: '欄位必填' }],
})

const { validate, validateInfos } = Form.useForm(formData.value, formRules.value)

/**
 * Event
 */
const onSubmit = (): void => {
  validate()
    .then(() => {
      getAPI_updateChatroomServiceHolidays()
    })
    .catch(error => {
      console.log('驗證失敗', error)
    })
}

/**
 * API
 */
// API: 查詢文字客服關閉服務資訊
const getAPI_getChatroomServiceHolidays = (): void => {
  setLoading(true)
  $serviceSettingsApi
    .getChatroomServiceHolidaysUsingPOST()
    .then(res => {
      const $getData = res.data
      formData.value.date = dayjs($getData.date)
      formData.value.description = $getData.description
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

// API: 更新文字客服關閉服務資訊
const getAPI_updateChatroomServiceHolidays = (): void => {
  setLoading(true)
  const $submit = {
    date: dayjs(formData.value.date).format('YYYY-MM-DD'),
    description: formData.value.description,
  }
  $serviceSettingsApi
    .updateChatroomServiceHolidaysUsingPOST($submit)
    .then(() => {
      message.success('儲存成功')
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * Hook
 */
onMounted(() => {
  getAPI_getChatroomServiceHolidays()
})
</script>
<template>
  <FormTitle title="文字客服關閉服務" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
      <a-form-item label="日期" v-bind="validateInfos.date">
        <a-date-picker class="w-full" v-model:value="formData.date" placeholder="yyyy/mm/dd" />
      </a-form-item>
      <a-form-item label="備註">
        <a-textarea v-model:value="formData.description" allowClear placeholder="請輸入說明" :rows="1" />
      </a-form-item>
    </div>
  </a-form>
  <div class="flex justify-center gap-4">
    <ButtonRectangle letter @click="onSubmit">儲存</ButtonRectangle>
  </div>
</template>

<style scoped></style>
