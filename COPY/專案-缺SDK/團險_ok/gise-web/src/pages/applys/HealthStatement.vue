<script setup lang="ts">
import { onMounted, ref, watch, getCurrentInstance } from 'vue'
import { useWindowSize } from '@vueblocks/vue-use-core'
import { useLoadingStore } from '@/stores'
import { Empty } from 'ant-design-vue'
import { useHealthStatement } from '@/composables/useHealthStatement'
import { useTermsAndNotice } from '@/composables/useTermsAndNotice'
import editSvg from '@/assets/imgs/button_edit.svg?url'
import searchSVG from '@assets/imgs/button_search.svg?url'
import type { HealthDeclarationInfoDto, ETermGroupDto } from '@fubonlife/gise-api-axios-sdk'

const loadingStore = useLoadingStore()
const {
  proxy: { $user, $global },
} = getCurrentInstance()

// 空白圖示
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

// composables
const { width } = useWindowSize()
const { healthStatementTableColumn, healthStatementCardColumn, healthStatementData, fetchHealthStatmentData } =
  useHealthStatement(true)
const { collapseItems, fetchTermsAndNotice } = useTermsAndNotice()

const {
  healthDeclarationFormRef,
  isEdit,
  isAllChecked,
  isOpenModal,
  infoData: healthDeclarationInfoData,
  handleOpen,
  handleOk,
  handleClose,
  closeAndRefreash,
} = useModal()
const { prevStep, nextStep } = useNavigatePage()

// 自費案代號
const caseMainId = $user.getMe()?.caseMainId

const applyId = $global.handleApplyId('Get')

const healthStatementGrid = ref({
  rowKey: 'key',
  data: healthStatementData,
  columns: healthStatementTableColumn,
  pagination: false,
})

// 是否已完成所有應填寫的健康聲明書
const isAllFillIn = ref<boolean>(true)

onMounted(async () => {
  loadingStore.setLoading(true)
  const termGroup: ETermGroupDto = {
    route: 'HealthStatement',
    termsGroup: 'EMP_HEALTH',
  }
  await Promise.all([fetchTermsAndNotice(termGroup), fetchHealthStatmentData({ applyId, caseMainId })]).finally(() =>
    loadingStore.setLoading(false),
  )
})

watch(
  healthStatementData,
  value => {
    if (!value) return
    const count = value.reduce((acc, item) => {
      if (item.fillInType === '1' && item.fillInStatus === 'N') return acc + 1
      return acc
    }, 0)
    isAllFillIn.value = !(count > 0)
  },
  { deep: true },
)

function useModal() {
  const healthDeclarationFormRef = ref(null)

  const isEdit = ref<boolean>(false)

  const isOpenModal = ref<boolean>(false)

  const infoData = ref<HealthDeclarationInfoDto>({})

  // 是否全選告知事項
  const isAllChecked = ref<boolean>(false)

  const handleOpen = async (data: HealthDeclarationInfoDto, type: 'edit' | 'preview') => {
    infoData.value = data
    isEdit.value = !!(type === 'edit')
    isOpenModal.value = true
  }

  const handleOk = (): void => {
    healthDeclarationFormRef.value.beforeSubmitForm()
  }

  const handleClose = () => {
    if (isEdit.value)
      // 清空告知事項勾選框
      collapseItems.value.map(e => {
        e.checking = false
        e.isCollapseOpen = false
      })
    isOpenModal.value = false
    healthDeclarationFormRef.value.clearValidate()
    healthDeclarationFormRef.value.resetFields()
  }

  // 關閉彈窗並刷新表格資料
  const closeAndRefreash = () => {
    fetchHealthStatmentData({ applyId, caseMainId })
    handleClose()
  }

  watch(
    collapseItems,
    value => {
      isAllChecked.value = value.every(e => e.checking)
    },
    { deep: true },
  )

  return {
    healthDeclarationFormRef,
    isEdit,
    isAllChecked,
    isOpenModal,
    infoData,
    handleOpen,
    handleOk,
    handleClose,
    closeAndRefreash,
  }
}

function useNavigatePage() {
  const situation: 'applyArea' | 'searchArea' = $global.getQuery<any>()?.situation

  const prevStep = () => {
    $global.changeRouterAndaddParam({
      toRouter: 'InsuredData',
      query: { situation },
    })
  }
  const nextStep = (): void => {
    $global.changeRouterAndaddParam({
      toRouter: 'PaymentApproach',
      query: { situation },
    })
  }
  return { prevStep, nextStep }
}
</script>
<template>
  <FormTitle title="被保險人健康聲明書" />
  <div v-if="width < 768">
    <div v-if="healthStatementData.length === 0" class="rounded-[4px] border-[1px] border-neutral-entry">
      <a-empty
        :image="simpleImage"
        class="m-auto flex min-h-[222px] w-[calc(12*14px)] flex-col justify-center lg:w-[calc(12*16px)]"
      >
        <template #description>
          <span class="text-base text-[#6A6A6A] lg:text-lg">目前尚無任何健康聲明資料</span>
        </template>
      </a-empty>
    </div>
    <template v-else>
      <CardInfo
        v-for="(cardItem, index) in healthStatementData"
        class="mb-4"
        :key="index"
        :title="`健康聲明書 : ${cardItem?.status?.label}`"
        :type="cardItem?.status?.color"
        :columns="healthStatementCardColumn"
        :data="cardItem"
      >
        <template #headerControl>
          <ButtonRectangle
            :disabled="cardItem.status?.label === '不需填寫'"
            btnStyle="secondary"
            @click="handleOpen(cardItem, 'preview')"
          >
            預覽
          </ButtonRectangle>
          <ButtonRectangle
            :disabled="cardItem.status?.label === '不需填寫'"
            btnStyle="secondary"
            @click="handleOpen(cardItem, 'edit')"
          >
            修改
          </ButtonRectangle>
        </template>
      </CardInfo>
    </template>
  </div>
  <FblDataGrid
    v-else
    class="mb-2"
    :dataSource="healthStatementGrid.data"
    :columns="healthStatementGrid.columns"
    :pagination="healthStatementGrid.pagination"
    :size="'small'"
  >
    <template #status="{ scope: { value } }">
      <BadgeDot :type="value.color" :text="value.label"></BadgeDot>
    </template>
    <template #preview="{ scope: { record } }">
      <ButtonIconic
        tooltip="預覽"
        :hoverWhite="true"
        @click="handleOpen(record, 'preview')"
        :disabled="record.status?.label === '不需填寫'"
      >
        <img :src="searchSVG" alt="預覽" />
      </ButtonIconic>
    </template>
    <template #edit="{ scope: { record } }">
      <ButtonIconic
        tooltip="修改"
        :hoverWhite="true"
        @click="handleOpen(record, 'edit')"
        :disabled="record.status?.label === '不需填寫'"
      >
        <img :src="editSvg" alt="修改" />
      </ButtonIconic>
    </template>
  </FblDataGrid>

  <div class="mt-4 flex justify-center lg:mt-8">
    <ButtonRoundedSecondary @click="prevStep">上一步</ButtonRoundedSecondary>
    <ButtonRoundedPrimary class="ml-[15px] md:ml-[16px] lg:ml-[32px]" @click="nextStep" :disabled="!isAllFillIn"
      >下一步</ButtonRoundedPrimary
    >
  </div>

  <ModalMain
    v-model:visible="isOpenModal"
    title="被保險人健康聲明書"
    width="824px"
    :maskClosable="false"
    :after-close="handleClose"
  >
    <template #content>
      <HealthDeclarationForm
        v-model:isOpenModal="isOpenModal"
        ref="healthDeclarationFormRef"
        :isEdit="isEdit"
        :infoData="healthDeclarationInfoData"
        @close="handleClose"
        @closeAndRefreash="closeAndRefreash"
      ></HealthDeclarationForm>
      <div v-if="isEdit">
        <FormTitle title="健康告知書簡述(同意請打勾)" class="mt-4 lg:mt-8" />
        <CardCollapse :items="collapseItems" />
      </div>
    </template>
    <template #footer>
      <div class="mb-4 flex justify-center md:mb-0">
        <ButtonRoundedPrimary v-if="!isEdit" @click="handleClose">關閉</ButtonRoundedPrimary>
        <ButtonRoundedSecondary v-if="isEdit" @click="handleClose">取消</ButtonRoundedSecondary>
        <ButtonRoundedPrimary
          v-if="isEdit"
          :disabled="!isAllChecked"
          class="ml-[15px] md:ml-[16px] lg:ml-[32px]"
          @click="handleOk"
        >
          確定
        </ButtonRoundedPrimary>
      </div>
    </template>
  </ModalMain>
</template>

<style scoped>
/* Ant design vue - icon */
:deep(.anticon > svg) {
  @apply h-4 w-4;
}
:deep(.ant-form-item-label > label, .ant-form label) {
  @apply font-normal;
}

.descriptionForm:deep(.ant-input) {
  text-align: inherit;
}
.descriptionForm:deep(.ant-input:placeholder-shown) {
  @apply font-normal;
}

:deep(.ant-collapse-content-box) {
  @apply max-h-[200px] overflow-scroll;
}

:deep(.ant-form-item-has-error .ant-radio-wrapper),
:deep(.ant-form-item-has-error .ant-radio-inner) {
  border-color: red !important;
}
</style>
