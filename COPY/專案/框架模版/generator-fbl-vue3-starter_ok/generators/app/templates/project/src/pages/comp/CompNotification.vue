<script setup lang="ts">
import { useForm } from 'ant-design-vue/es/form'
import { getCurrentInstance, ref } from 'vue'

const {
  proxy: { $notification },
} = getCurrentInstance()

const form = ref({
  duration: 10,
})
const rulesRef = ref({
  duration: [
    {
      required: true,
      message: 'duration 欄位必填',
    },
  ],
})
const { validate, validateInfos } = useForm(form, rulesRef)

/**
 * Event
 */
// DefaultNotification
const DefaultNotification = () => {
  $notification.default({
    message: 'default 通知提醒框 標題',
    description: '詳細內容',
  })
}

// InfoNotification
const InfoNotification = () => {
  $notification.info({
    message: 'info 通知提醒框 標題',
    description: '詳細內容',
  })
}

// SuccessNotification
const successNotification = () => {
  $notification.success({
    message: 'success 通知提醒框 標題',
    description: '詳細內容',
  })
}

// ErrorNotification
const errorNotification = () => {
  $notification.error({
    message: 'error 通知提醒框 標題',
    description: '詳細內容',
  })
}

// warningNotification
const warningNotification = () => {
  $notification.warning({
    message: 'warning 通知提醒框 標題',
    description: '詳細內容',
  })
}

const tryDuration = () => {
  validate().then(() => {
    $notification.info({
      message: '延遲 訊息 標題',
      description: '詳細內容',
      duration: form.value.duration,
    })
  })
}

const openNotification = placement => {
  $notification.success({
    message: 'success 通知提醒框 標題',
    description: '詳細內容',
    placement: placement,
  })
}

const destroy = () => {
  $notification.destroy()
}
</script>

<template>
  <div class="page__container flex-fill">
    <div class="container__wrap">
      <h4>Notification 基本用法</h4>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__secondary" @click="DefaultNotification">Default</a-button>
        <a-button class="btn__info" @click="InfoNotification">info</a-button>
        <a-button class="btn__primary" @click="successNotification">Success</a-button>
        <a-button class="btn__danger" @click="errorNotification">Error</a-button>
        <a-button class="btn__warning" @click="warningNotification">Warning</a-button>
      </div>
    </div>
    <div class="container__wrap">
      <h4>自定義 關閉秒數</h4>
      <div class="section__container d-inline-flex gap-3">
        <div class="col">
          <!-- 數字輸入 -->
          <a-form-item v-bind="validateInfos.duration">
            <a-input-number
              class="w-100"
              v-model:value="form.duration"
              placeholder="請輸入關閉秒數"
              min="0"
              addon-after="秒"
            />
          </a-form-item>
        </div>
        <a-button class="btn__primary" @click="tryDuration">產生Notification</a-button>
      </div>
    </div>
    <div class="container__wrap">
      <h4>位置</h4>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__primary" @click="openNotification('topLeft')"><RadiusUpleftOutlined />topLeft</a-button>
        <a-button class="btn__primary" @click="openNotification('topRight')"
          ><RadiusUprightOutlined />topRight</a-button
        >
      </div>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__primary" @click="openNotification('bottomLeft')"
          ><RadiusBottomleftOutlined />bottomLeft</a-button
        >
        <a-button class="btn__primary" @click="openNotification('bottomRight')"
          ><RadiusBottomrightOutlined />bottomRight</a-button
        >
      </div>
    </div>
    <div class="container__wrap">
      <h4>其他功能</h4>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__primary" @click="destroy">消除所有Notification</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
