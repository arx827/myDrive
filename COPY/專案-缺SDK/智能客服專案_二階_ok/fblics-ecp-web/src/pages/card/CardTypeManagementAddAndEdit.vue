<script setup lang="ts">
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { Form, message, Modal } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import type { RuleObject } from 'ant-design-vue/es/form'
import { useLoadingStore } from '@/stores'

import type { CardTypeManagementAddAndEdit } from '@pages/page_modal'

const $router = useRouter()
const $route = useRoute()
const { setLoading } = useLoadingStore()

const {
  proxy: { $global, $cardCategoryManagementApi },
} = getCurrentInstance()

const formTitle = computed<string>(() => {
  return isEdit.value ? '修改卡片類型' : '新增卡片類型'
})

const formData = ref<CardTypeManagementAddAndEdit.formDataType>({
  cardCategoryName: '',
  cardCategoryId: '',
})

const isEdit = computed<boolean>(() => {
  // 網址附帶 cardId 就認定為 編輯頁
  return !!$route.params.cardCategoryId
})

const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  cardCategoryName: [{ required: true, message: '請輸入 卡片類型名稱' }],
})

const { validate, validateInfos, resetFields } = Form.useForm(formData.value, formRules.value)

// 取得 Query 並帶入資料
const setEditParam = () => {
  const $params = $route.params
  if ($params.cardCategoryId) {
    postAPI_findCardCategoryById($params.cardCategoryId)
  } else {
    $router.replace({ name: 'CardTypeManagementAdd' })
  }
}

/**
 * API
 */
// API: 取得 卡片類型(單筆)資料
const postAPI_findCardCategoryById = async propData => {
  setLoading(true)
  $cardCategoryManagementApi
    .findCardCategoryByIdUsingPOST(propData)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      formData.value.cardCategoryId = $getData.cardCategoryId
      formData.value.cardCategoryName = $getData.cardCategoryName
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

// API: 新增卡片類型
const postAPI_insertCardCategory = propData => {
  setLoading(true)
  $cardCategoryManagementApi
    .insertCardCategoryUsingPOST(propData)
    .then(() => {
      message.success('新增成功')
      prevPage()
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: 修改卡片類型
const postAPI_updateCardCategory = propData => {
  setLoading(true)
  $cardCategoryManagementApi
    .updateCardCategoryUsingPOST(propData)
    .then(() => {
      message.success('修改成功')
      prevPage()
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

/**
 * Event
 */
const onCancel = (): void => {
  resetFields()
  prevPage()
}
const onSubmit = (): void => {
  validate()
    .then(() => {
      const $submitData: {
        cardCategoryName: string
        cardCategoryId?: string
      } = { cardCategoryName: formData.value.cardCategoryName }
      if (formData.value.cardCategoryId) {
        // 編輯
        $submitData.cardCategoryId = formData.value.cardCategoryId
        postAPI_updateCardCategory($submitData)
      } else {
        // 新增
        postAPI_insertCardCategory($submitData)
      }
    })
    .catch(error => {
      console.log('檢核失敗', error)
    })
}
const prevPage = (): void => {
  $router.replace({ name: 'CardTypeManagementIndex' })
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
      <a-form-item label="卡片類型名稱" v-bind="validateInfos.cardCategoryName">
        <a-input v-model:value="formData.cardCategoryName" placeholder="請輸入卡片類型名稱" allowClear />
      </a-form-item>
    </div>
  </a-form>
  <div class="flex justify-center gap-4">
    <ButtonRectangle btnStyle="outline" letter @click="onCancel">取消</ButtonRectangle>
    <ButtonRectangle letter @click="onSubmit">確定</ButtonRectangle>
  </div>
</template>

<style scoped></style>
