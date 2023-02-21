<script setup lang="ts">
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { Form } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import router from '@/router'
import { useLoadingStore } from '@/stores'
const store = useLoadingStore()

const {
  proxy: { $user, $authApi },
} = getCurrentInstance()
const titleName = ref(import.meta.env.VITE_APP_TITLE)
const isLoading = ref(false)

interface formType {
  username: string
  password: string
}

const form = ref<formType>({
  username: '',
  password: '',
})
const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
})
const { resetFields, validate, validateInfos } = Form.useForm(form, formRules)

// 帳密必填之後，才開啟登入按鈕
const disabled = computed(() => {
  return !(form.value.username && form.value.password)
})

/**
 * API
 */
function login(submitData: formType) {
  store.SET_LOADING(true)
  $authApi
    .crowdLoginUsingPOST(submitData)
    .then(resp => {
      if (resp.status === 200) {
        $user.signIn(resp.data.jwtTokenPair.accessToken)
        router.replace({ path: '/' }).catch(err => {
          err
        })
      }
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      store.SET_LOADING(false)
    })
}

/**
 * Event
 */

function onSubmit() {
  validate()
    .then(() => {
      login(form.value)
    })
    .catch(err => {
      console.log('error', err)
    })
}

/**
 * Hooks
 */
onMounted(() => {
  resetFields()
})
</script>

<template>
  <a-modal :visible="true" :title="titleName" :footer="null" :closable="false" :width="300">
    <a-spin :spinning="isLoading" :delay="200">
      <a-form name="formRef" :model="form" :rules="formRules" class="login-form">
        <a-form-item name="username" v-bind="validateInfos.username">
          <a-input placeholder="帳號" v-model:value="form.username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password" v-bind="validateInfos.password">
          <a-input-password placeholder="密碼" v-model:value="form.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button block :disabled="disabled" type="primary" @click="onSubmit"> 登入 </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
  <Loading />
</template>

<style scoped lang="scss"></style>
