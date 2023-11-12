<script setup lang="ts">
import { ref, getCurrentInstance, computed, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores'
import { message, Modal } from 'ant-design-vue/es'

import type { ReviewConfirm } from '@pages/page_modal'

const $router = useRouter()
const { setLoading } = useLoadingStore()

const {
  proxy: { $global, $fblicsEnum, $applyManagementApi },
} = getCurrentInstance()

const agree = ref<number>(null)

const dataGridData = ref<ReviewConfirm.dataGridDataType>({
  applyData: {
    applyId: 0,
    changeId: 0,
    applyType: 0,
    modifyType: 0,
    modifyUser: '',
    modifyDate: '',
  },
  gridDataType1: [],
  gridDataType2: {
    startTimeHour: '',
    startTimeMinute: '',
    endTimeHour: '',
    endTimeMinute: '',
  },
  gridDataType3: [],
  gridDataType4: '',
  gridDataType5: '',
  gridDataTypeCard1: null,
  gridDataTypeCard2: null,
})

// 組裝 審核型態 名稱
const getModifyType = computed(() => {
  return `${$fblicsEnum.getLabel('actionStatus', dataGridData.value.applyData.modifyType)}`
})
const getReviewTypeTitle = computed(() => {
  // return dataGridData.value.applyData.applyType
  return `${$fblicsEnum.getLabel('reviewTypeStatus', dataGridData.value.applyData.applyType)}`
})

// 取得 Query 並帶入資料
const setEditParam = async () => {
  const $query = $global.getQuery()
  if ($query) {
    dataGridData.value.applyData = $global.deepCopyData($query)

    if ([1, 2].includes(dataGridData.value.applyData.applyType)) {
      dataGridData.value[`gridDataTypeCard${dataGridData.value.applyData.applyType}`] =
        await postAPI_findApplyStatusById($query.applyId)
    } else {
      dataGridData.value[`gridDataType${dataGridData.value.applyData.applyType}`] = await postAPI_findApplyStatusById(
        $query.applyId,
      )
    }
  } else {
    $router.replace({ name: 'ReviewIndex' })
  }
}

/**
 * API
 */
// API: 查詢審核作業(單筆)
const postAPI_findApplyStatusById = applyId => {
  setLoading(true)
  return $applyManagementApi
    .findApplyByIdUsingPOST(applyId)
    .then(res => {
      let $getData = $global.deepCopyData(res.data)
      return $getData
    })
    .catch(error => {
      Modal.error({
        content: `${error.response.data.message || error.response.data.error}，請重新操作`,
      })
    })
    .finally(() => {
      setLoading(false)
    })

  // 處理模板資料
  // TODO:
  // dataGridData.value[`gridDataType${applyId}`] = $getData

  // 處理審核狀態
  // dataGridData.value.applyData.modifyName = $getData.modifyName

  // return {
  //   cardCategoryId: 1,
  //   cardCategoryName: '熱門問題',
  //   modifyStatus: 1,
  //   applyStatus: 3,
  //   modifyName: '劉Ｏ宏',
  //   modifyDate: '112/06/19',
  // }
  // return {
  //   cardId: 1,
  //   cardCategory: 1,
  //   cardImage: '/fblics-web/images/card/document.png',
  //   cardTitle: 'STEP1 準備文件',
  //   cardDescription: '',
  //   itemList: [
  //     {
  //       itemId: 1,
  //       itemTitle: '開啟理賠申請書(PDF)',
  //       itemType: 1,
  //       itemShowTitle: '',
  //       itemFAQ: '',
  //       itemUrl: '/fblics-web/pdf/個人保險理賠保險金申請書.pdf',
  //     },
  //     {
  //       itemId: 2,
  //       itemTitle: '理賠申請書填寫範例(PDF)',
  //       itemType: 1,
  //       itemShowTitle: '',
  //       itemFAQ: '',
  //       itemUrl: '/fblics-web/pdf/個人保險理賠保險金申請書填寫說明.pdf',
  //     },
  //     {
  //       itemId: 3,
  //       itemTitle: '應備文件',
  //       itemType: 2,
  //       itemShowTitle: '理賠應備文件',
  //       itemFAQ: '理賠應備文件',
  //       itemUrl: '',
  //     },
  //   ],
  // }
}

// API: 審核作業 (1.審核退回, 2.審核通過, 3.審核待審)
const postAPI_apply = (id, status) => {
  setLoading(true)
  $applyManagementApi
    .applyUsingPOST(id, status)
    .then(() => {
      // let $getData = $global.deepCopyData(res.data)
      $router.replace({ name: 'ReviewIndex' }).then(() => {
        message.success('已覆核成功')
      })
      // console.log('查詢審核作業 =>', $getData)
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
// 取消
const onReviewCancel = () => {
  $router.replace({ name: 'ReviewIndex' })
}

// 確定
const onReviewCheck = () => {
  postAPI_apply(dataGridData.value.applyData.applyId, agree.value)
}

/**
 * Hook
 */
onMounted(() => {
  setEditParam()
})
</script>
<template>
  <!-- 工作狀態新增 / 修改 -->
  <!-- <template v-if="$applyType === 'system_1'">
    <ReviewType-1 :gridData="dataGridData.gridDataType1" />
  </template> -->

  <!-- 客服人員服務時段 -->
  <!-- <template v-if="$applyType === 'system_2'">
    <ReviewType-2 :gridData="dataGridData.gridDataType2" />
  </template> -->

  <!-- 平日假日設定 -->
  <!-- <template v-if="$applyType === 'system_3'">
    <ReviewType-3 :gridData="dataGridData.gridDataType3" />
  </template> -->

  <!-- 非服務時段宣告文字訊息 -->
  <!-- <template v-if="$applyType === 'system_4'">
    <ReviewType-4 :gridData="dataGridData.gridDataType4" />
  </template> -->

  <!-- 非服務時段宣告文字訊息 -->
  <!-- <template v-if="$applyType === 'system_5'">
    <ReviewType-5 :gridData="dataGridData.gridDataType5" />
  </template> -->

  <!-- 卡片類型管理 -->
  <template v-if="dataGridData.applyData.applyType === 1 && dataGridData.gridDataTypeCard1">
    <ReviewTypeCard-1 :gridData="dataGridData.gridDataTypeCard1" :modifyType="dataGridData.applyData.modifyType" />
  </template>

  <!-- 卡片管理 -->
  <template v-if="dataGridData.applyData.applyType === 2 && dataGridData.gridDataTypeCard2">
    <ReviewTypeCard-2 :gridData="dataGridData.gridDataTypeCard2" :modifyType="dataGridData.applyData.modifyType" />
  </template>
  <div class="mt-[32px]">
    <div class="overflow-hidden rounded-[4px] bg-primary-light">
      <ReviewCard title="審核狀態">
        <template #content>
          <a-descriptions :column="2" :colon="false" class="reviewDescriptions">
            <a-descriptions-item label="送審人員">{{ dataGridData.applyData?.modifyUser }}</a-descriptions-item>
            <a-descriptions-item label="送審日期">{{ dataGridData.applyData?.modifyDate }}</a-descriptions-item>
            <a-descriptions-item label="審核類型"> {{ getModifyType }} {{ getReviewTypeTitle }}</a-descriptions-item>
            <a-descriptions-item label="審核結果">
              <a-radio-group v-model:value="agree" name="radioGroup">
                <a-radio :value="2">同意</a-radio>
                <a-radio :value="1">退回</a-radio>
              </a-radio-group>
            </a-descriptions-item>
          </a-descriptions>
        </template>
        <template #footer>
          <ButtonRectangle btnStyle="outline" letter @click="onReviewCancel">取消</ButtonRectangle>
          <ButtonRectangle letter @click="onReviewCheck" :disabled="!agree">確定</ButtonRectangle>
        </template>
      </ReviewCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reviewDescriptions {
  :deep(.ant-descriptions-item-label) {
    display: block;
    width: 128px;
    margin-right: 30px;
    text-align: right;
    font-weight: 600;
  }
}
</style>
