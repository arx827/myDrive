<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { Form, message, Modal } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import { useLoadingStore } from '@/stores'
import type { SystemSetting } from '@pages/page_modal'

const {
  proxy: { $serviceSettingsApi, $robotApi },
} = getCurrentInstance()

const { setLoading } = useLoadingStore()

// 每坐席最大同時服務數量 disabled
const disabledMaxServiceNum = ref<boolean>(true)
const formData = ref<SystemSetting.formDataType>({
  serviceSwitch: null,
  maxServiceNum: 0,
})

const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  serviceSwitch: [{ required: true, message: '請選擇 文字客服系統開關' }],
  maxServiceNum: [{ required: true, message: '請輸入 每坐席最大同時服務數量' }],
})

const { validate, validateInfos } = Form.useForm(formData.value, formRules.value)

/**
 * API
 */
// API: 查詢智能客服開關設定狀態
const postAPI_getIcsServiceStatus = async (): Promise<boolean> => {
  setLoading(true)
  return await $serviceSettingsApi
    .getRobotServiceStatusUsingPOST()
    .then(res => {
      return res.data.robotServiceStatus
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: 查詢可供服務量設定
const postAPI_getServiceUpperLimit = (): Promise<number> => {
  setLoading(true)
  return $serviceSettingsApi
    .getServiceUpperLimitUsingPOST()
    .then(res => {
      return res.data.serviceUpperLimit
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: 更新智能客服開關設定狀態
const postAPI_updateServiceStatus = () => {
  setLoading(true)
  return $robotApi
    .updateServiceStatusUsingPOST(formData.value.serviceSwitch)
    .then(() => {
      message.success('修改成功')
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
const submitFormData = (): void => {
  validate().then(() => {
    postAPI_updateServiceStatus()
  })
}

/**
 * Hook
 */
onMounted(async () => {
  formData.value.serviceSwitch = await postAPI_getIcsServiceStatus()
  formData.value.maxServiceNum = await postAPI_getServiceUpperLimit()
})
</script>
<template>
  <FormTitle title="系統設定" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="md:grid md:grid-cols-3 lg:grid-cols-4">
      <a-form-item label="智能服務開關" v-bind="validateInfos.serviceSwitch">
        <a-radio-group v-model:value="formData.serviceSwitch" name="radioGroup">
          <a-radio :value="true">開啟</a-radio>
          <a-radio :value="false">關閉</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="每坐席最大同時服務數量" v-bind="validateInfos.maxServiceNum">
        <a-input
          v-model:value="formData.maxServiceNum"
          placeholder="請輸入"
          allowClear
          :disabled="disabledMaxServiceNum"
        />
      </a-form-item>
    </div>
  </a-form>
  <div class="flex justify-center">
    <ButtonRectangle letter @click="submitFormData">儲存</ButtonRectangle>
  </div>
</template>

<style scoped lang="postcss"></style>
