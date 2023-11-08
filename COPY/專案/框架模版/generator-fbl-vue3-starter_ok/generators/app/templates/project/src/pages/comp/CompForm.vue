<script setup lang="ts">
import { useForm } from 'ant-design-vue/es/form'
import { toRaw, ref } from 'vue'

const formEl = ref(null)

const form = ref({
  inputText: undefined,
  inputNumber: undefined,
  radio: undefined,
  checkbox: [],
  rate: 2,
  select: undefined,
  selectMultiple: [],
  slider: 70,
  switch: false,
  textarea: undefined,
  timePicker: '',
  datePicker: '',
  datePickerRange: [],
  dateTimePicker: '',
})
const rulesRef = ref({
  inputText: [
    {
      required: true,
      message: 'inputText 欄位必填',
    },
  ],
  inputNumber: [
    {
      required: true,
      message: 'inputNumber 欄位必填',
    },
  ],
  textarea: [
    {
      required: true,
      message: 'textarea 欄位必填',
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
      console.log(toRaw(form.value))
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
      <a-form :labelWrap="true" :colon="false" :noStyle="true" :labelCol="{ span: 7 }">
        <a-row :gutter="12">
          <!-- 文字輸入 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="文字輸入" v-bind="validateInfos.inputText">
              <a-input v-model:value="form.inputText" placeholder="請輸入內容" />
            </a-form-item>
          </a-col>

          <!-- 數字輸入 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="數字輸入" v-bind="validateInfos.inputNumber">
              <a-input-number class="w-100" v-model:value="form.inputNumber" placeholder="請輸入內容" min="0" />
            </a-form-item>
          </a-col>

          <!-- Radio -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="Radio">
              <a-radio-group v-model:value="form.radio" name="radioGroup" option-type="button" button-style="solid">
                <a-radio value="A">A</a-radio>
                <a-radio value="B">B</a-radio>
                <a-radio value="C">C</a-radio>
                <a-radio value="D">D</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <!-- Checkbox -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="Checkbox">
              <a-checkbox-group
                v-model:value="form.checkbox"
                name="radioGroup"
                option-type="button"
                button-style="solid"
              >
                <a-checkbox value="A">A</a-checkbox>
                <a-checkbox value="B">B</a-checkbox>
                <a-checkbox value="C">C</a-checkbox>
                <a-checkbox value="D">D</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>

          <!-- 評分 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="評分">
              <a-rate v-model:value="form.rate" />
            </a-form-item>
          </a-col>

          <!-- 單選下拉 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="單選下拉">
              <a-select ref="select" v-model:value="form.select" placeholder="請選擇內容">
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!-- 多選下拉 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="多選下拉">
              <a-select
                ref="select"
                mode="multiple"
                v-model:value="form.selectMultiple"
                placeholder="請選擇內容"
                :showArrow="true"
              >
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!-- 滑動輸入 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="滑動輸入">
              <div class="d-flex">
                <a-slider class="col" v-model:value="form.slider" :tooltip-visible="true" />
                <a-input class="slider__input" v-model:value="form.slider" />
              </div>
            </a-form-item>
          </a-col>

          <!-- 開關 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="開關">
              <a-switch v-model:checked="form.switch" checked-children="開" un-checked-children="關" />
            </a-form-item>
          </a-col>

          <!-- 時間 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="時間">
              <a-time-picker
                class="w-100"
                v-model:value="form.timePicker"
                :showNow="false"
                format="HH:mm A"
                :minuteStep="30"
                placeholder="請選擇時間"
              />
            </a-form-item>
          </a-col>

          <!-- 日期 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="日期">
              <date-picker
                class="w-100"
                v-model:value="form.datePicker"
                format="YYYY/MM/DD"
                placeholder="請選擇 日期"
              />
              <!-- <a-date-picker
                class="w-100"
                v-model:value="form.datePicker"
                format="YYYY/MM/DD"
                placeholder="請選擇日期"
              /> -->
            </a-form-item>
          </a-col>

          <!-- 日期區間-->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="日期區間">
              <date-picker
                class="w-100"
                v-model:value="form.datePickerRange"
                format="YYYY/MM/DD"
                placeholder="請選擇 日期區間"
                range
              />
              <!-- <a-date-picker
                class="w-100"
                v-model:value="form.datePicker"
                format="YYYY/MM/DD"
                placeholder="請選擇日期"
              /> -->
            </a-form-item>
          </a-col>

          <!-- 日期 + 時間 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="日期 + 時間">
              <date-picker
                class="w-100"
                type="datetime"
                v-model:value="form.dateTimePicker"
                :show-second="true"
                format="YYYY/MM/DD HH:mm:ss"
                show-time-header="true"
                placeholder="請選擇日期時間"
              />
              <!-- <a-date-picker
                class="w-100"
                v-model:value="form.dateTimePicker"
                format="YYYY/MM/DD HH:mm"
                placeholder="請選擇日期時間"
                showTime
                :showNow="false"
              /> -->
            </a-form-item>
          </a-col>

          <!-- 多行文字輸入 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="多行文字輸入" v-bind="validateInfos.textarea">
              <a-textarea v-model:value="form.textarea" placeholder="請輸入內容" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <div class="d-block d-md-flex justify-content-end row row-cols-auto">
        <div class="col">
          <button class="btn__main btn-demo" theme="primary" danger>按鈕</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="light" danger>按鈕</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="dashed" danger>按鈕</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="text" danger>按鈕</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="link" danger>按鈕</button>
        </div>
      </div>

      <div class="d-block d-md-flex justify-content-end row row-cols-auto">
        <div class="col">
          <button class="btn__main btn-demo" theme="primary">按鈕</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="light">按鈕</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="dashed">按鈕</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="text">按鈕</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="link">按鈕</button>
        </div>
      </div>
      <a-divider />

      <div class="d-block d-md-flex justify-content-end row row-cols-auto">
        <div class="col">
          <button class="btn__main btn-demo" theme="light" @click="resetSearch">清除</button>
        </div>
        <div class="col">
          <button class="btn__main btn-demo" theme="primary" @click="handleSearch">
            <SearchOutlined class="me-1" />查詢
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider__input {
  width: 50px;
}
.btn-demo {
  width: calc(100% - 10px);
}
</style>
