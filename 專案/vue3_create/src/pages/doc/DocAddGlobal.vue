<script setup lang="ts"></script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">共用方法建立 (對話框為例)</h5>
      <div>參考檔案: plugins/modal/index.ts</div>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">引入ant-design-vue Modal</h5>
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{
                `import { Modal } from 'ant-design-vue' // 引入Antd Modal
import type { ModalFuncProps } from 'ant-design-vue/es/modal' // 引入Antd Modal參數型態`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">註冊全域</h5>
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{
                `declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: ModalService
  }
}`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">撰寫方法</h5>
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{
                `export class ModalService {
  // 預設項目
  private config = props => ({
    wrapClassName: 'modalCustom',
    title: '提醒',
    okText: '確定',
    ...props,
  })

  public info(option?: ModalFuncProps) {
    Modal.info(this.config({ ...option }))
  }
  ....
}`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">於頁面/元件使用共用彈窗</h5>
          <h6>頁面註冊宣告</h6>
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{
                `const {
  proxy: { $modal },
} = getCurrentInstance()`
              }}
            </template>
          </PreCode>
          <h6>在方法內使用</h6>
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{
                `$modal.info({
  content: '訊息訊息',
  ...
})`
              }}
            </template>
          </PreCode>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">使用共用Loading(Pinia)</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">於頁面/元件引入store</h5>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{ `import { useLoadingStore } from '@/stores'` }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">宣告後使用</h5>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{ `const store = useLoadingStore()` }}
            </template>
          </PreCode>
          <div>打開loading</div>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{ `store.SET_LOADING(true)` }}
            </template>
          </PreCode>
          <div>關閉loading</div>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{ `store.SET_LOADING(false)` }}
            </template>
          </PreCode>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
