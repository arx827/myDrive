<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, getCurrentInstance } from 'vue'
import { Form, message, Modal } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import type { BaseOptionType } from 'ant-design-vue/es/select'
import { useLoadingStore } from '@/stores'

import { useUpload } from '@/composables/useUpload'

import type { CardManagementAddAndEdit } from '@pages/page_modal'
import { FileDownloadFileCategoryEnum } from '@fubonlife/fblics-api-axios-sdk'
import type { ItemListDto } from '@fubonlife/fblics-api-axios-sdk'

const { beforeUpload } = useUpload()
// import AjaxService from '@plugins/uploadFile'

const { setLoading } = useLoadingStore()
const $router = useRouter()
const $route = useRoute()

// 操作 上傳動作時，紀錄 index，儲存資料必要的索引
const $cacheFileIndex = ref<number>(null)

const {
  proxy: { $global, $cardCategoryManagementApi, $blobUtils, $cardManagementApi, $fileManagementApi },
} = getCurrentInstance()

const formTitle = computed<string>(() => {
  return isEdit.value ? '修改卡片' : '新增卡片'
})

const formData = ref<CardManagementAddAndEdit.formDataType<ItemListDto>>({
  cardId: null,
  cardCategory: null,
  cardImage: null,
  cardTitle: '',
  cardDescription: '',
  itemList: [
    {
      itemId: null,
      itemTitle: '',
      itemType: null,
      itemShowTitle: '',
      itemFAQ: '',
      itemUrl: '',
      fileDownload: {},
    },
    {
      itemId: null,
      itemTitle: '',
      itemType: null,
      itemShowTitle: '',
      itemFAQ: '',
      itemUrl: '',
      fileDownload: {},
    },
    {
      itemId: null,
      itemTitle: '',
      itemType: null,
      itemShowTitle: '',
      itemFAQ: '',
      itemUrl: '',
      fileDownload: {},
    },
    {
      itemId: null,
      itemTitle: '',
      itemType: null,
      itemShowTitle: '',
      itemFAQ: '',
      itemUrl: '',
      fileDownload: {},
    },
    {
      itemId: null,
      itemTitle: '',
      itemType: null,
      itemShowTitle: '',
      itemFAQ: '',
      itemUrl: '',
      fileDownload: {},
    },
  ],
})

const isEdit = computed<boolean>(() => {
  // 網址附帶 cardId 就認定為 編輯頁
  return !!$route.params.cardId
})

const getItemListOneItemError = ref({
  itemTitle: false,
  itemType: false,
})

const formRules = ref({
  cardImage: [{ required: true, message: '欄位必填' }],
  cardCategory: [{ required: true, message: '欄位必填' }],
})

const { validate, validateInfos } = Form.useForm(formData.value, formRules.value)

const coverPhohoOptions = ref<BaseOptionType[]>([])

const cardTypeOptions = ref<BaseOptionType[]>([])

const linkTypeOptions = ref<BaseOptionType[]>([
  {
    label: 'URL',
    value: 3,
  },
  {
    label: 'FAQ',
    value: 2,
  },
  {
    label: '附件',
    value: 1,
  },
])

// 取得 Query 並帶入資料
const setEditParam = () => {
  if ($route.name === 'CardManagementEdit' && $route.params.cardId) {
    postAPI_findCardById($route.params.cardId)
  } else {
    $router.replace({
      name: 'CardManagementAdd',
    })
  }
}

const $returnCardImgPath = computed(() => {
  return formData.value.cardImage ? $global.returnCardImgPath(formData.value.cardImage) : ''
})

/**
 * API
 */
// API: 取得 查詢卡片類型 (下拉選單)
const postAPI_findCardCategory = async () => {
  setLoading(true)
  await $cardCategoryManagementApi
    .findCardCategoryUsingPOST()
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      cardTypeOptions.value = $getData.map(i => ({
        label: i.cardCategoryName,
        value: i.cardCategoryId,
      }))
      // 下拉選項生成後，新增項目，預設為第一筆選項
      if (cardTypeOptions.value.length && !isEdit.value) {
        formData.value.cardCategory = cardTypeOptions.value[0].value
      }
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

// API: 取得 卡片封面圖片 (下拉選單)
const postAPI_getCardCoverImage = async () => {
  setLoading(true)
  await $cardManagementApi
    .getCardCoverImageUsingPOST()
    .then(res => {
      const $getData = $global.deepCopyData(res.data)
      coverPhohoOptions.value = $getData.map(i => ({
        label: i.imageName,
        value: i.imagePath,
      }))
      // 下拉選項生成後，新增項目，預設為第一筆選項
      if (coverPhohoOptions.value.length && !isEdit.value) {
        formData.value.cardImage = coverPhohoOptions.value[0].value
      }
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

// API: 取得 修改卡片(單筆)資料
const postAPI_findCardById = cardId => {
  setLoading(true)
  $cardManagementApi
    .findCardByIdUsingPOST(cardId)
    .then(res => {
      const $getData = $global.deepCopyData(res.data)

      formData.value.cardId = $getData.cardId
      // 卡片類型 有此選項 才自動選擇
      if (cardTypeOptions.value.map(i => i.value).includes($getData.cardCategory)) {
        formData.value.cardCategory = $getData.cardCategory
      }
      // 封面照片 有此選項 才自動選擇
      if (coverPhohoOptions.value.map(i => i.value).includes($getData.cardImage)) {
        formData.value.cardImage = $getData.cardImage
      }
      formData.value.cardTitle = $getData.cardTitle
      formData.value.cardDescription = $getData.cardDescription

      // 處理 itemList
      let limit = 0
      do {
        if ($getData.itemList[limit]) {
          // 處理已經有的資料
          formData.value.itemList[limit] = { ...formData.value.itemList[limit], ...$getData.itemList[limit] }
        }
        limit++
      } while (limit < 5)

      // TEST:
      // console.log('取得卡片資料 =>', $getData)
      // console.log('formData =>', formData.value)
    })
    .catch(error => {
      message.error(error.response.data.message)
      $global.changeRouterAndaddParam({
        toRouter: 'CardManagementAddAndEdit',
        params: {
          type: 'add',
        },
      })
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: submit 修改卡片
const postAPI_updateCard = data => {
  setLoading(true)
  $cardManagementApi
    .updateCardUsingPOST(data)
    .then(() => {
      prevPage()
      message.success('編輯成功')
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: submit 新增卡片
const postAPI_insertCard = data => {
  setLoading(true)
  $cardManagementApi
    .insertCardUsingPOST(data)
    .then(() => {
      prevPage()
      message.success('新增成功')
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: 上傳檔案
const postAPI_uploadFile = file => {
  // TEST:
  console.log('上傳檔案 file =>', file)
  // 上傳成功，取得 fileId，存進資料，watch監聽到 fileId 改變，觸發取得資料
  setLoading(true)
  $fileManagementApi
    .uploadFileUsingPOST('CARD', file)
    .then(resp => {
      formData.value.itemList[$cacheFileIndex.value].fileDownload = { ...resp.data.fileDownload }

      // TEST:
      console.log('上傳檔案 成功 取得fileId resp =>', formData.value.itemList)
    })
    .catch(error => {
      message.error(error.response.data.message || error.response.data.error)
    })
    .finally(() => {
      setLoading(false)
    })
}

// API: 取得 下載資料 (blob)
const postAPI_downloadFileBlob = fileDownload => {
  setLoading(true)
  return $fileManagementApi
    .downloadFileUsingPOST(fileDownload.fileCategory, fileDownload.fileId, fileDownload.fileStatus, {
      responseType: 'blob',
    })
    .then(resp => {
      $blobUtils.download(resp.data as Blob, fileDownload.fileName || '附件連結', resp.headers['content-type'])
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
  prevPage()
}
const onSubmit = (): void => {
  // 檢核 連結名稱1 & 連結方式1 (必填)
  formatItemError('itemTitle', formData.value.itemList[0].itemTitle)
  formatItemError('itemType', formData.value.itemList[0].itemType)
  validate().then(() => {
    if ([getItemListOneItemError.value.itemTitle, getItemListOneItemError.value.itemType].every(i => i == false)) {
      const $submit = $global.deepCopyData(formData.value)
      // 排除 沒有設定連結名稱的項目
      $submit.itemList = $submit.itemList.filter(i => i.itemTitle)

      // 排除 itemType === 1(附件)，但是 fileId 沒有值 (未上傳檔案)
      // $submit.itemList = $submit.itemList.filter(i => !(i.itemType === 1 && !i.fileDownload.fileId))

      if ($route.params.type === 'add') {
        postAPI_insertCard($submit)
      } else {
        postAPI_updateCard($submit)
      }
    }
  })
}
const prevPage = (): void => {
  $router.replace({ name: 'CardManagementIndex' })
}

// 連結名稱1 & 連結方式1 檢核
const changeItemList = (ele, value, item, index) => {
  if (index === 0) {
    formatItemError(ele, value)
  }
  // 變更連結方式，清空其他連結方式欄位
  initData(ele, item)
}

const formatItemError = (ele, value) => {
  getItemListOneItemError.value[ele] = !value ? true : false
}
const initData = (ele, item) => {
  if (ele === 'itemType') {
    item.itemFAQ = ''
    // item.itemType !== 1 的時候，改為 空陣列
    item.fileDownload =
      item.itemType === 1
        ? {
            fileCategory: FileDownloadFileCategoryEnum.CARD,
            fileId: null,
            fileStatus: null,
            fileName: '',
          }
        : {}
    item.itemShowTitle = ''
    item.itemUrl = ''
  }
}

const onDownloadFile = async fileDownload => {
  await postAPI_downloadFileBlob(fileDownload)
}

// 自定義上傳檔案
const uploadFlie = options => {
  postAPI_uploadFile(options.file)
}

const saveIndex = index => {
  $cacheFileIndex.value = index
}

/**
 * Hook
 */
onMounted(async () => {
  await postAPI_findCardCategory() // 取得 查詢卡片類型 (下拉選單)
  await postAPI_getCardCoverImage() // 取得 卡片封面圖片 (下拉選單)
  setEditParam()
})

onUnmounted(() => {
  $global.clearParam()
})
</script>
<template>
  <FormTitle :title="formTitle" />
  <a-form :model="formData" name="basic" autocomplete="off" layout="vertical">
    <div class="gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
      <a-form-item label="標題">
        <a-input v-model:value="formData.cardTitle" placeholder="請輸入標題" allowClear />
      </a-form-item>
      <a-form-item label="封面照片" v-bind="validateInfos.cardImage">
        <a-select v-model:value="formData.cardImage" placeholder="請選擇" :options="coverPhohoOptions" />
      </a-form-item>
      <a-form-item label="卡片類型" v-bind="validateInfos.cardCategory">
        <a-select v-model:value="formData.cardCategory" placeholder="請選擇" allowClear :options="cardTypeOptions" />
      </a-form-item>
      <a-form-item label="編號" v-if="$route.params.cardId">
        <a-input v-model:value="formData.cardId" disabled />
      </a-form-item>
      <a-form-item label="說明" class="col-span-2 lg:col-span-4">
        <a-textarea v-model:value="formData.cardDescription" placeholder="請輸入說明" allowClear :auto-size="true" />
      </a-form-item>
    </div>

    <template v-for="(item, index) in formData.itemList" :key="index">
      <a-divider class="my-[12px] border-t-2 border-neutral-light" dashed />
      <div class="gap-4 md:grid md:grid-cols-3 lg:grid-cols-4">
        <a-form-item
          :help="index === 0 && getItemListOneItemError.itemTitle ? '欄位必填' : ''"
          :validateStatus="index === 0 && getItemListOneItemError.itemTitle ? 'error' : 'success'"
          :label="`連結名稱 ${index + 1}`"
          :required="index === 0"
        >
          <a-input
            v-model:value="item.itemTitle"
            placeholder="請輸入名稱"
            allowClear
            @change="changeItemList('itemTitle', $event.target.value, item, index)"
          />
        </a-form-item>
        <a-form-item
          :help="index === 0 && getItemListOneItemError.itemType ? '欄位必填' : ''"
          :validateStatus="index === 0 && getItemListOneItemError.itemType ? 'error' : 'success'"
          :label="`連結方式 ${index + 1}`"
          :required="index === 0"
        >
          <a-select
            v-model:value="item.itemType"
            placeholder="請選擇連結方式"
            :options="linkTypeOptions"
            allowClear
            @change="changeItemList('itemType', $event, item, index)"
          />
        </a-form-item>
        <!-- 連結 URL temp -->
        <template v-if="item.itemType === 3">
          <a-form-item :label="`URL ${index + 1}`" class="col-span-2">
            <a-input v-model:value="item.itemUrl" placeholder="請輸入連結" allowClear />
          </a-form-item>
        </template>

        <!-- FAQ temp -->
        <template v-else-if="item.itemType === 2">
          <a-form-item :label="`FAQ ${index + 1}`">
            <a-input v-model:value="item.itemFAQ" placeholder="請輸入FAQ" allowClear />
          </a-form-item>
          <a-form-item :label="`對話內容顯示 ${index + 1}`">
            <a-input v-model:value="item.itemShowTitle" placeholder="請輸對話內容顯示" allowClear />
          </a-form-item>
        </template>

        <!-- 附件 temp -->
        <template v-else-if="item.itemType === 1">
          <div class="flex w-full md:mt-[calc(1.57rem+8px)] md:flex-col">
            <a-upload
              :custom-request="uploadFlie"
              :before-upload="beforeUpload"
              @change="saveIndex(index)"
              :showUploadList="false"
            >
              <a-button class="flex min-h-[35px] items-center rounded-[4px]">
                <upload-outlined />
                上傳檔案
              </a-button>
            </a-upload>
            <!-- fileDownload 中 fileId、fileStatus、fileCategory、fileName 都有值才顯示下載連結 -->
            <!-- <li
              class="mt-[10px] flex w-full flex-1 items-start"
              v-if="Object.keys(item.fileDownload).every(i => item.fileDownload[i])"
            > -->
            <!-- 只要有 fileId 就顯示，並出現『 附件連結 』文字 -->
            <li class="mt-[10px] flex w-full flex-1 items-center md:items-start" v-if="item.fileDownload.fileId">
              <link-outlined class="mt-[5px]" />
              <div class="mx-[10px] text-primary">
                <a @click="onDownloadFile(item.fileDownload)">{{ item.fileDownload.fileName || '附件連結' }}</a>
              </div>
            </li>
          </div>
        </template>
      </div>
    </template>
  </a-form>
  <div>
    <p class="font-semibold">預覽</p>
    <div class="mt-[5px] inline-flex justify-start bg-primary-light px-[30px] py-[16px]">
      <Card
        :cardTitle="formData.cardTitle"
        :cardDescription="formData.cardDescription"
        :itemList="formData.itemList"
        :cardId="formData.cardId"
        :cardImage="$returnCardImgPath"
        :lockClick="true"
      />
    </div>
  </div>
  <div class="my-[16px] flex justify-center gap-4">
    <ButtonRectangle btnStyle="outline" letter @click="onCancel">取消</ButtonRectangle>
    <ButtonRectangle letter @click="onSubmit">確定</ButtonRectangle>
  </div>
</template>

<style scoped></style>
