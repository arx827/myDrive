<script setup lang="ts">
import { watch, ref, getCurrentInstance, defineProps, defineEmits, useAttrs } from 'vue'
import type { ModalProps } from 'ant-design-vue'
import closeImgSVG from '@/assets/imgs/button_close_2.svg?url'
import VuePdfApp from 'vue3-pdf-app'
import type { ToolbarConfig } from 'vue3-pdf-app/dist/types/types/'
import { useLoadingStore } from '@/stores'
import 'vue3-pdf-app/dist/icons/main.css'
import type { CaseMainIdAndVersionDto, WebRestResponse } from '@fubonlife/gise-api-axios-sdk'

interface ModalPDFViewerProp extends ModalProps {
  visible: boolean
  width?: number | string
  fileDetail: CaseMainIdAndVersionDto
}

const $props = withDefaults(defineProps<ModalPDFViewerProp>(), {
  visible: false,
  width: 1040,
})

const $attr = useAttrs()
const $emit = defineEmits(['update:visible', 'cancel'])
const loadingStore = useLoadingStore()
const {
  proxy: { $selfPayEFormApi, $modal, $global, $blobUtils },
} = getCurrentInstance()

const viewerConfig: ToolbarConfig = {
  toolbar: {
    toolbarViewerRight: {
      openFile: false,
      print: false,
      viewBookmark: false,
    },
  },
}
const pdfArrayBuffer = ref<ArrayBuffer>()

const fetchDownloadInsurancePlan = async ({ caseMainId, version }: CaseMainIdAndVersionDto): Promise<void> => {
  $selfPayEFormApi
    .downloadInsurancePlanUsingPOST({ caseMainId, version }, { responseType: 'blob' })
    .then(async resp => {
      // console.log('resp', resp)
      const disposition = resp.headers['content-disposition']
      if (disposition) {
        pdfArrayBuffer.value = await (resp.data as Blob).arrayBuffer()
      } else {
        let errorMsg: WebRestResponse = await $blobUtils.convertErrorBlobToString(resp.data)
        $modal.error({
          title: '錯誤',
          content: $global.getApiErrorMsg(errorMsg?.apiError, errorMsg?.errors),
        })
      }
    })
}

const handleClose = (): void => {
  $emit('update:visible', false)
}

watch(
  () => $props.visible,
  async val => {
    if (!val) return
    loadingStore.setLoading(true)
    await fetchDownloadInsurancePlan({
      caseMainId: $props?.fileDetail?.caseMainId,
      version: $props?.fileDetail?.version,
    })
    loadingStore.setLoading(false)
  },
)
</script>
<template>
  <a-modal
    :visible="$props.visible"
    :title="null"
    :footer="null"
    :closable="false"
    :width="$props.width"
    wrap-class-name="gise-main-modal"
    v-bind="$attr"
    @cancel="handleClose"
  >
    <div
      class="relative flex justify-between border-b-[1px] border-neutral-entry px-4 pb-3 pt-5 align-middle text-base font-semibold md:border-b-0 md:py-4 md:text-3xl lg:px-12"
    >
      預覽保險計畫
      <div
        class="flex cursor-pointer justify-center align-middle md:absolute md:right-[-33px] md:top-[-33px] md:h-[34px] md:w-[34px] md:rounded-full md:bg-white md:shadow-md"
        @click="handleClose"
      >
        <img class="h-[10px] w-[10px] self-center" :src="closeImgSVG" alt="" />
      </div>
    </div>
    <div class="md:max-h-ful flex-1 rounded-b-md md:mx-4 md:overflow-y-auto lg:mx-12">
      <vue-pdf-app
        :pdf="pdfArrayBuffer"
        theme="light"
        :config="viewerConfig"
        :title="true"
        :fileName="''"
      ></vue-pdf-app>
    </div>
    <div class="p-4 text-center md:pb-0">
      <ButtonRoundedPrimary @click="handleClose">關閉</ButtonRoundedPrimary>
    </div>
  </a-modal>
</template>

<style lang="css" scoped></style>
