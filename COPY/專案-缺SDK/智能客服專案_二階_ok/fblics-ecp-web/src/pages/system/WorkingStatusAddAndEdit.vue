<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { Form } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import type { BaseOptionType } from 'ant-design-vue/es/select'

const $router = useRouter()
const $route = useRoute()

const {
  proxy: { $fblicsEnum, $global },
} = getCurrentInstance()

const formTitle = computed<string>(() => {
  return $route.params.type === 'edit' ? '修改工作狀態' : '新增工作狀態'
})

const formData = ref({
  workingStatusName: '',
  workingStatus: null,
})

const formRules = ref({
  workingStatusName: [{ required: true, message: '請輸入 工作狀態名稱' }],
  workingStatus: [{ required: true, message: '請選擇 狀態分類' }],
})

// 重整成選單格式
const statusOption: BaseOptionType[] = $fblicsEnum.workingStatus.map(i => ({
  label: i.label,
  value: i.value,
}))

const { validate, validateInfos } = Form.useForm(formData.value, formRules.value)

// 初始化欄位
const initData = (): void => {
  formData.value.workingStatusName = ''
  formData.value.workingStatus = null
}

// 取得 Query 並帶入資料
const setEditParam = () => {
  const $query = $global.getQuery()
  if ($route.params.type === 'edit' && $query) {
    formData.value.workingStatusName = $query.name
    formData.value.workingStatus = $query.status
  } else {
    $router.replace({ name: 'WorkingStatusAddAndEdit', params: { type: 'add' } })
  }
}

/**
 * Event
 */
const onCancel = (): void => {
  initData()
  prevPage()
}
const onSubmit = (): void => {
  validate()
    .then(res => {
      console.log('儲存成功', res)
    })
    .catch(error => {
      console.log('儲存失敗', error)
    })
}
const prevPage = (): void => {
  $router.replace({ name: 'WorkingStatusTable' })
}

/**
 * Hook
 */
onMounted(() => {
  setEditParam()
})
</script>
<template>
  <FormTitle :title="formTitle" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
      <a-form-item label="工作狀態名稱" v-bind="validateInfos.workingStatusName">
        <a-input v-model:value="formData.workingStatusName" placeholder="例 : 用餐時間" allowClear />
      </a-form-item>
      <a-form-item label="狀態分類" v-bind="validateInfos.workingStatus">
        <a-select v-model:value="formData.workingStatus" placeholder="請選擇" allowClear :options="statusOption" />
      </a-form-item>
    </div>
  </a-form>
  <div class="flex justify-center gap-4">
    <ButtonRectangle btnStyle="outline" letter @click="onCancel">取消</ButtonRectangle>
    <ButtonRectangle letter @click="onSubmit">確定</ButtonRectangle>
  </div>
</template>

<style scoped></style>
