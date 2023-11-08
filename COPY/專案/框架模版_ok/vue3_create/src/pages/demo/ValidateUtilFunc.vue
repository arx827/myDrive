<script setup lang="ts">
import { useForm } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/css'
import { ref, getCurrentInstance } from 'vue'
const {
  proxy: { $validateUtil },
} = getCurrentInstance()

const form_1_El = ref(null)
const form_1 = ref<{ data: string }>({
  data: 'Q123456789',
})
const rulesRef_1 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      message: '身分證 格式不符',
      pattern: $validateUtil.pattern.idNumber(),
      trigger: 'blur',
    },
  ],
})
const form_1_useForm = useForm(form_1, rulesRef_1)

const form_2_El = ref(null)
const form_2 = ref<{ data: string }>({
  data: '0912345678',
})
const rulesRef_2 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      message: '手機號碼 格式不符',
      pattern: $validateUtil.pattern.phoneNumber(),
      trigger: 'blur',
    },
  ],
})
const form_2_useForm = useForm(form_2, rulesRef_2)

const form_3_El = ref(null)
const form_3 = ref<{ data: string }>({
  data: 'abc@gmail.com',
})
const rulesRef_3 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      message: 'Email 格式不符',
      pattern: $validateUtil.pattern.email(),
      trigger: 'blur',
    },
  ],
})
const form_3_useForm = useForm(form_3, rulesRef_3)

const form_4_El = ref(null)
const form_4 = ref<{ data: string; num: number }>({
  data: 'abcdefghij',
  num: 10,
})
const rulesRef_4 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      validator: (rule, value, callback) => {
        if (!$validateUtil.validator.length(value, form_4.value.num)) {
          callback('字數不符')
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
})
const form_4_useForm = useForm(form_4, rulesRef_4)

const form_5_El = ref(null)
const form_5 = ref<{ data: string }>({
  data: 'abcdefghij',
})
const rulesRef_5 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      validator: (rule, value, callback) => {
        if ($validateUtil.validator.fullWidthAcd(value)) {
          callback('請輸入半型')
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
})
const form_5_useForm = useForm(form_5, rulesRef_5)

const form_6_El = ref(null)
const form_6 = ref<{ data: string }>({
  data: '35000',
})
const rulesRef_6 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      message: '請輸入數字',
      pattern: $validateUtil.pattern.num(),
      trigger: 'blur',
    },
  ],
})
const form_6_useForm = useForm(form_6, rulesRef_6)

const form_7_El = ref(null)
const form_7 = ref<{ data: string }>({
  data: 'abcD',
})
const rulesRef_7 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      message: '請輸入英文',
      pattern: $validateUtil.pattern.en(),
      trigger: 'blur',
    },
  ],
})
const form_7_useForm = useForm(form_7, rulesRef_7)

const form_8_El = ref(null)
const form_8 = ref<{ data: string }>({
  data: 'abcd5237',
})
const rulesRef_8 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      message: '請輸入英數字',
      pattern: $validateUtil.pattern.enAndNum(),
      trigger: 'blur',
    },
  ],
})
const form_8_useForm = useForm(form_8, rulesRef_8)

const form_9_El = ref(null)
const form_9 = ref<{ data: string }>({
  data: '測試資料',
})
const rulesRef_9 = ref({
  data: [
    {
      required: true,
      message: '欄位必填',
    },
    {
      message: '請輸入中文',
      pattern: $validateUtil.pattern.ch(),
      trigger: 'blur',
    },
  ],
})
const form_9_useForm = useForm(form_9, rulesRef_9)

/**
 * Event
 */
// Form1 click
const handle_1_Validate = () => {
  form_1_useForm
    .validate()
    .then(() => {
      message.success(`${form_1.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_1_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
// Form2 click
const handle_2_Validate = () => {
  form_2_useForm
    .validate()
    .then(() => {
      message.success(`${form_2.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_2_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
// Form3 click
const handle_3_Validate = () => {
  form_3_useForm
    .validate()
    .then(() => {
      message.success(`${form_3.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_3_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
// Form4 click
const handle_4_Validate = () => {
  form_4_useForm
    .validate()
    .then(() => {
      message.success(`${form_4.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_4_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
// Form5 click
const handle_5_Validate = () => {
  form_5_useForm
    .validate()
    .then(() => {
      message.success(`${form_5.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_5_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
// Form6 click
const handle_6_Validate = () => {
  form_6_useForm
    .validate()
    .then(() => {
      message.success(`${form_6.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_6_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
// Form7 click
const handle_7_Validate = () => {
  form_7_useForm
    .validate()
    .then(() => {
      message.success(`${form_7.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_7_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
// Form8 click
const handle_8_Validate = () => {
  form_8_useForm
    .validate()
    .then(() => {
      message.success(`${form_8.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_8_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
// Form9 click
const handle_9_Validate = () => {
  form_9_useForm
    .validate()
    .then(() => {
      message.success(`${form_9.value.data}_驗證成功`)
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = form_9_El.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">身分證驗證</h5>
      <div class="section__container" ref="form_1_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="身分證" v-bind="form_1_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 身分證字號" v-model:value="form_1.data" />
              </a-form-item>
            </div>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_1_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">手機號碼驗證</h5>
      <div class="section__container" ref="form_2_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="手機號碼" v-bind="form_2_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 手機號碼" v-model:value="form_2.data" />
              </a-form-item>
            </div>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_2_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">Email驗證</h5>
      <div class="section__container" ref="form_3_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="Email" v-bind="form_3_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 Email" v-model:value="form_3.data" />
              </a-form-item>
            </div>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_3_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">字數驗證</h5>
      <div class="section__container" ref="form_4_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="字數驗證" v-bind="form_4_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 " v-model:value="form_4.data" />
              </a-form-item>
            </div>
            <a-form-item label="字數">
              <a-input-number placeholder="請輸入 限制字數" v-model:value="form_4.num" />
            </a-form-item>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_4_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">半形驗證</h5>
      <div class="section__container" ref="form_5_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="半形" v-bind="form_5_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 半形" v-model:value="form_5.data" />
              </a-form-item>
            </div>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_5_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">數字驗證</h5>
      <div class="section__container" ref="form_6_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="數字" v-bind="form_6_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 數字" v-model:value="form_6.data" />
              </a-form-item>
            </div>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_6_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">英文驗證</h5>
      <div class="section__container" ref="form_7_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="英文" v-bind="form_7_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 英文" v-model:value="form_7.data" />
              </a-form-item>
            </div>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_7_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">英數字驗證</h5>
      <div class="section__container" ref="form_8_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="英數字" v-bind="form_8_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 英數字" v-model:value="form_8.data" />
              </a-form-item>
            </div>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_8_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">中文驗證</h5>
      <div class="section__container" ref="form_9_El">
        <a-form :labelWrap="true">
          <div class="d-flex align-items-start gap-3">
            <!-- 輸入 欄位 -->
            <div class="col">
              <a-form-item label="中文" v-bind="form_9_useForm.validateInfos.data">
                <a-input class="w-100" placeholder="請輸入 中文" v-model:value="form_9.data" />
              </a-form-item>
            </div>
            <a-form-item>
              <a-button class="btn__primary" @click="handle_9_Validate">驗證</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
