<script setup lang="ts">
import { useForm } from 'ant-design-vue/es/form'
import { ref, getCurrentInstance } from 'vue'
const {
  proxy: { $global },
} = getCurrentInstance()

const formEl = ref(null)

const form = ref({
  policyNo: undefined,
  send: 'query',
})
const rulesRef = ref({
  policyNo: [
    {
      required: true,
      message: '保單號碼 欄位必填',
    },
  ],
  organizationInsuredName: [
    {
      required: true,
      message: '要保人/要保單位 欄位必填',
    },
  ],
})
const { validate, validateInfos, resetFields } = useForm(form, rulesRef)

/**
 * Event
 */
// 查詢
const handleSearch = () => {
  validate()
    .then(() => {
      $global.changeRouterAndaddParam({
        toRouter: 'GetParams',
        [form.value.send]: {
          policyNo: form.value.policyNo,
        },
      })
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = formEl.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        // 新語法試用 scrollIntoView
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}

// 清除
const resetSearch = () => {
  resetFields()
}
</script>
<template>
  <div class="page__container flex-fill">
    <div class="container__wrap" ref="formEl">
      <h4>保單查詢</h4>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :noStyle="true" :labelCol="{ span: 7 }">
          <a-row>
            <!-- 保單號碼 -->
            <a-col :span="24">
              <a-form-item label="保單號碼" v-bind="validateInfos.policyNo">
                <a-input v-model:value="form.policyNo" placeholder="請輸入 保單號碼" />
              </a-form-item>
            </a-col>

            <!-- Radio -->
            <a-col :span="24">
              <a-form-item label="傳遞參數方式">
                <a-radio-group v-model:value="form.send" name="radioGroup" option-type="button" button-style="solid">
                  <a-radio value="query">Query</a-radio>
                  <a-radio value="params">Param</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <a-divider />

        <div class="d-flex justify-content-end">
          <button class="btn__main" theme="light" @click="resetSearch">清除</button>
          <button class="btn__main" theme="primary" @click="handleSearch"><SearchOutlined class="me-1" />查詢</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
