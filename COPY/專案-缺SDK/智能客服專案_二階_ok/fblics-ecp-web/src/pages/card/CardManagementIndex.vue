<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import type { BaseOptionType } from 'ant-design-vue/es/select'

import { Form, message, Modal } from 'ant-design-vue'
import { useLoadingStore } from '@/stores'
import type { Rule } from 'ant-design-vue/es/form'

import type { CardInfoResponseDto } from '@fubonlife/fblics-api-axios-sdk'

import type { CardManagementIndex } from '@pages/page_modal'

const {
  proxy: { $global, $cardCategoryManagementApi, $cardManagementApi },
} = getCurrentInstance()

const { setLoading } = useLoadingStore()
const $router = useRouter()

const formData = ref<CardManagementIndex.formDataType>({
  keyword: '',
  cardCategory: null,
})

// 多欄位擇一填寫
const manyToValidate = async (_rule: Rule, value: string) => {
  if (!formData.value.keyword && !value) {
    return Promise.reject('必須擇一填寫')
  } else {
    return Promise.resolve()
  }
}
const keywordValidate = async (_rule: Rule, value: string) => {
  if (!formData.value.cardCategory && !value) {
    return Promise.reject('必須擇一填寫')
  } else {
    return Promise.resolve()
  }
}

const formRules = ref({
  keyword: [{ validator: keywordValidate }],
  cardCategory: [{ validator: manyToValidate }],
})

const { validate, validateInfos, resetFields, clearValidate } = Form.useForm(formData.value, formRules.value)

// 卡片類型 (select 選單)
const cardTypeOption = ref<BaseOptionType[]>([])

// 卡片資訊
const cardsArr = ref<CardInfoResponseDto[]>([])

// 刪除資訊 (彈窗)
const confirmModalData = ref({
  visible: false,
  cardId: 0,
  submitModal: () => {
    postAPI_deleteCard(confirmModalData.value.cardId)
  },
  closeModal: () => {
    confirmModalData.value.visible = false
  },
})

/**
 * API
 */
// API: 卡片類型 (清單)
const postAPI_findCardCategory = async () => {
  setLoading(true)
  await $cardCategoryManagementApi
    .findCardCategoryUsingPOST()
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      cardTypeOption.value = $getData.map(i => ({
        label: i.cardCategoryName,
        value: i.cardCategoryId,
      }))
      // 預設選取第一筆資料
      formData.value.cardCategory = cardTypeOption.value[0].value
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

// API: 查詢卡片
const postAPI_findCard = () => {
  setLoading(true)
  const $submit = {
    cardCategory: formData.value.cardCategory,
    keyword: formData.value.keyword,
  }
  $cardManagementApi
    .findCardUsingPOST($submit.cardCategory, $submit.keyword)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      cardsArr.value = $getData
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: 刪除卡片
const postAPI_deleteCard = cardId => {
  setLoading(true)
  const $submit = {
    cardId,
  }
  $cardManagementApi
    .deleteCardUsingPOST($submit)
    .then(() => {
      message.success('刪除成功')
      // 刷新列表
      postAPI_findCard()
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
      confirmModalData.value.visible = false
    })
}

/**
 * Event
 */
// 彈窗 變更紀錄
const onOpenChangeLog = () => {
  const newPage = $router.resolve({ name: 'CardChangeLog' })
  window.open(newPage.href, 'CardChangeLog', '_blank')
}

// btn 新增卡片
const onAddCard = () => {
  $router.push({ name: 'CardManagementAdd' })
}

// btn 清除
const onCancel = () => {
  resetFields()
}

// btn 查詢
const onSearch = () => {
  validate().then(() => {
    postAPI_findCard()
  })
}

// btn 編輯
const onEdit = slotProps => {
  // console.log('編輯 =>', slotProps)
  $global.changeRouterAndaddParam({
    toRouter: 'CardManagementEdit',
    params: {
      cardId: slotProps.cardId,
    },
  })
}

// btn 刪除
const onRemove = cardId => {
  confirmModalData.value.visible = true
  confirmModalData.value.cardId = cardId
}

// 欄位 資料變更 觸發驗證
const changeForm = () => {
  clearValidate()
  validate()
}

/**
 * Hook
 */
onMounted(async () => {
  await postAPI_findCardCategory()
  // 觸發 初始查詢
  postAPI_findCard()
})
</script>
<template>
  <FormTitle title="卡片管理">
    <div class="flex gap-2">
      <!-- <ButtonRectangle btn-style="outline" @click="onOpenChangeLog">變更紀錄</ButtonRectangle> -->
      <ButtonRectangle @click="onAddCard">新增卡片</ButtonRectangle>
    </div>
  </FormTitle>
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
      <a-form-item label="關鍵字" v-bind="validateInfos.keyword">
        <a-input
          class="w-full"
          v-model:value="formData.keyword"
          placeholder="請輸入關鍵字"
          allowClear
          @change="changeForm"
        />
      </a-form-item>
      <a-form-item label="卡片類型" v-bind="validateInfos.cardCategory">
        <a-select
          v-model:value="formData.cardCategory"
          placeholder="請選擇"
          allowClear
          :options="cardTypeOption"
          @change="changeForm"
        />
      </a-form-item>
    </div>
  </a-form>
  <div class="mb-[16px] flex justify-center gap-4">
    <ButtonRectangle btnStyle="outline" letter @click="onCancel">清除</ButtonRectangle>
    <ButtonRectangle letter @click="onSearch">查詢</ButtonRectangle>
  </div>
  <template v-if="cardsArr.length > 0">
    <template v-for="(item, index) in cardsArr" :key="index">
      <div class="mt-[16px] bg-primary-light px-[25px] py-[16px] text-lg">
        <p class="mb-4 font-semibold">{{ item.cardCategoryName }}</p>
        <WaterfallCard :cardsArr="item.cardList">
          <template #cardData="{ slotProps }">
            <Card
              :cardTitle="slotProps.cardTitle"
              :cardDescription="slotProps.cardDescription"
              :itemList="slotProps.itemList"
              :cardId="slotProps.cardId"
              :cardImage="$global.returnCardImgPath(slotProps.cardImage)"
              :isApply="slotProps.apply"
              :lockClick="true"
              @onEdit="onEdit(slotProps)"
              @onRemove="onRemove(slotProps.cardId)"
            />
          </template>
        </WaterfallCard>
      </div>
    </template>
  </template>
  <template v-else>
    <div class="mt-[16px] flex min-h-[250px] items-center justify-center bg-primary-light px-[25px] py-[16px] text-lg">
      <a-empty description="查無資料" />
    </div>
  </template>

  <ConfirmModal v-model:visible="confirmModalData.visible">
    <div>刪除設定需經過審核，是否送審？？</div>
    <template #footer>
      <div class="flex justify-end gap-3">
        <ButtonRectangle letter @click="confirmModalData.submitModal">確定</ButtonRectangle>
        <ButtonRectangle btn-style="outline" letter @click="confirmModalData.closeModal">取消</ButtonRectangle>
      </div>
    </template>
  </ConfirmModal>
</template>

<style scoped></style>
