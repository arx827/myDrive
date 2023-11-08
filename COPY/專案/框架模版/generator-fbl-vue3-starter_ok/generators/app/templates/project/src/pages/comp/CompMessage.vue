<script setup lang="ts">
import { useForm } from 'ant-design-vue/es/form'
import { ref, getCurrentInstance } from 'vue'

const {
  proxy: { $message },
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
// InfoMessage
const infoMessage = () => {
  $message.info({
    content: 'info 訊息',
  })
}

// SuccessMessage
const successMessage = () => {
  $message.success({
    content: 'success 訊息',
  })
}

// ErrorMessage
const errorMessage = () => {
  $message.error({
    content: 'error 訊息',
  })
}

// WarningMessage
const warningMessage = () => {
  $message.warning({
    content: 'warning 訊息 ',
  })
}

const tryDuration = () => {
  validate().then(() => {
    $message.info({
      content: '延遲 訊息',
      duration: form.value.duration,
    })
  })
}

const destroy = () => {
  $message.destroy()
}
</script>

<template>
  <div class="page__container flex-fill">
    <div class="container__wrap">
      <h4>Message 基本用法</h4>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__info" @click="infoMessage">Info</a-button>
        <a-button class="btn__primary" @click="successMessage">Success</a-button>
        <a-button class="btn__danger" @click="errorMessage">Error</a-button>
        <a-button class="btn__warning" @click="warningMessage">Warning</a-button>
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
        <a-button class="btn__primary" @click="tryDuration">產生Message</a-button>
      </div>
    </div>
    <div class="container__wrap">
      <h4>其他功能</h4>
      <div class="section__container d-flex gap-3">
        <a-button class="btn__primary" @click="destroy">消除所有Message</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
