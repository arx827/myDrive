<script setup lang="ts">
import { AlertOutlined } from '@ant-design/icons-vue'
import { getCurrentInstance, ref, createVNode, onMounted } from 'vue'
const {
  proxy: { $modal },
} = getCurrentInstance()

const customModal = ref({
  visible: false,
  loading: false,
  width: 'md',
  center: false,
  top: null,
  footer: true,
  handleOk: () => {
    customModal.value.loading = true
    setTimeout(() => {
      customModal.value.handleCancel()
    }, 1000)
  },
  handleCancel: () => {
    customModal.value.init()
  },
  init: () => {
    customModal.value.visible = false
    customModal.value.loading = false
    customModal.value.width = 'md'
    customModal.value.center = false
    customModal.value.top = null
    customModal.value.footer = true
  },
})

/**
 * Event
 */
// InfoModal
const InfoModal = () => {
  $modal.info({
    content: '此功能無授權任一頁籤權限',
  })
}

// SuccessMessage
const successMessage = () => {
  $modal.success({
    content: '此功能無授權任一頁籤權限',
  })
}

// ErrorMessage
const errorMessage = () => {
  $modal.error({
    content: '此功能無授權任一頁籤權限',
  })
}

// WarningMessage
const warningMessage = () => {
  $modal.warning({
    content: '此功能無授權任一頁籤權限',
  })
}

const openModal = () => {
  customModal.value.visible = !customModal.value.visible
}

const sizeModal = size => {
  customModal.value.width = size || customModal.value.width
  customModal.value.visible = !customModal.value.visible
}

const centerModal = () => {
  customModal.value.center = true
  openModal()
}

const toTop = px => {
  customModal.value.top = px
  openModal()
}

const confirmModal = () => {
  $modal.confirm({
    title: '確定執行刪除？',
    content: '確定刪除後，將無法回復！',
    icon: createVNode(AlertOutlined, { class: 'c-red' }),
    okType: 'danger',
  })
}

const promiseConfirmModal = () => {
  $modal.confirm({
    title: '確定執行刪除？',
    content: '確定刪除後，將無法回復！',
    icon: createVNode(AlertOutlined, { class: 'c-red' }),
    okType: 'danger',
    async onOk() {
      try {
        return await new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
        })
      } catch {
        return console.log('Oops errors!')
      }
    },
    onCancel() {},
  })
}

const destroyModal = () => {
  for (let i = 0; i < 3; i += 1) {
    setTimeout(() => {
      $modal.confirm({
        title: '確定執行刪除？',
        content: '確定刪除後，將無法回復！',
        icon: createVNode(AlertOutlined, { class: 'c-red' }),
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        cancelText: 'Click to destroy all',
        onCancel() {
          $modal.destroy()
        },
      })
    }, i * 500)
  }
}

/**
 * Hook
 */
onMounted(() => {
  customModal.value.footer = null
})
</script>

<template>
  <div class="page__container flex-fill">
    <div class="container__wrap">
      <h4>Modal 訊息提示</h4>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__info" @click="InfoModal">info</a-button>
        <a-button class="btn__primary" @click="successMessage">Success</a-button>
        <a-button class="btn__danger" @click="errorMessage">Error</a-button>
        <a-button class="btn__warning" @click="warningMessage">Warning</a-button>
      </div>
    </div>
    <div class="container__wrap">
      <h4>自定義</h4>
      <div class="section__container d-flex gap-3">
        Basic：
        <a-button class="btn__primary" @click="openModal">開啟</a-button>
      </div>
      <div class="section__container d-flex gap-3">
        寬度：
        <a-button class="btn__primary" @click="sizeModal('sm')">小</a-button>
        <a-button class="btn__primary" @click="sizeModal('md')">中</a-button>
        <a-button class="btn__primary" @click="sizeModal('lg')">大</a-button>
      </div>
      <div class="section__container d-flex gap-3">
        位置：
        <a-button class="btn__primary" @click="toTop('20px')">置上</a-button>
        <a-button class="btn__primary" @click="centerModal">置中</a-button>
      </div>
    </div>
    <div class="container__wrap">
      <h4>確認對話框</h4>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__primary" @click="confirmModal">Confirm</a-button>
        <a-button class="btn__primary" @click="promiseConfirmModal">With promise</a-button>
        <a-button class="btn__primary" @click="destroyModal">消除所有確認對話框</a-button>
      </div>
    </div>

    <!-- 自定義彈窗 -->
    <CustomModal
      v-model:visible="customModal.visible"
      title="確定送出審核意見？"
      :width="customModal.width"
      :centered="customModal.center"
      :style="{ top: customModal.top }"
      :footer="customModal.footer"
      @afterClose="customModal.init"
      @cancel="customModal.handleCancel"
    >
      <h6>注意：</h6>
      <p>一但送出，無法終止...</p>
      <template #footer>
        <a-button class="btn__primary" :loading="customModal.loading" @click="customModal.handleOk">送出</a-button>
      </template>
    </CustomModal>
  </div>
</template>

<style scoped lang="scss"></style>
