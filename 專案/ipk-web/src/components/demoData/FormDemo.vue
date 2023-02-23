<template>
  <div class="btnGroup" @click="selectOpen = false">
    <a-row class="event__block">
      <a-col :span="24">
        <div class="form__title pb-3">
          <span>按鈕樣式</span>
          <span style="font-size:14px; color:#000000">
            ※ button樣式已寫在共用scss檔中，直接複製程式碼至使用區域即可。
          </span>
        </div>
      </a-col>
      <a-col :span="24">
        <button class="btn__main btn__main--primary">
          <a-icon type="plus" class="icon_margin" />
          新增
        </button>
        <button class="btn__main btn__main--primary">
          <a-icon type="search" class="icon_margin" />
          查詢
        </button>
        <button class="btn__main btn__main--lightRed">
          <a-icon type="stop" class="icon_margin" />
          退回
        </button>
        <button class="btn__main btn__main--primary">
          <a-icon type="check" class="icon_margin" />
          放行
        </button>
        <button class="btn__main btn__main--lightRed">
          <a-icon type="stop" class="icon_margin" />
          拒絕
        </button>
        <button class="btn__main btn__main--red">
          <a-icon type="delete" class="icon_margin" />
          刪除
        </button>
        <button class="btn__main btn__main--lightBlue">
          <a-icon type="upload" class="icon_margin" />
          上傳
        </button>
      </a-col>
    </a-row>
    <a-form-model
      ref="formRef"
      :rules="formRules"
      :model="form"
      :label-col="{ span: 9 }"
      :wrapper-col="{ span: 15 }"
      class="event__block"
    >
      <a-row type="flex" :wrap="true">
        <a-col :span="24">
          <div class="form__title pb-3">
            DatePicker 日期選擇框  <span>{{ '＜a-date-picker＞' }}</span>
          </div>
        </a-col>
        <a-col :span="11" class="setting__desc">
          <div>
            常用設定：
          </div>
          <ul class="form__content" />
        </a-col>
        <a-col :span="6">
          <a-form-model-item prop="date" label="日期">
            <a-date-picker
              v-model="form.date"
              format="YYYY/MM/DD"
              placeholder="請選擇日期"
              style="width: 100%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item prop="transactionDate" label="日期">
            <a-range-picker
              v-model="form.transactionDate"
              :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="form__title pb-3">
            TimePicker 時間選擇框  <span>{{ '＜a-time-picker＞' }}</span>
          </div>
        </a-col>
        <a-col :span="11" class="setting__desc">
          <div>
            常用設定：
          </div>
          <ul class="form__content" />
        </a-col>
        <a-col :span="6">
          <a-form-model-item prop="time" label="時間">
            <a-time-picker
              v-model="form.time"
              :open.sync="timeOpen"
              format="HH:mm"
              placeholder="請選擇時間"
              style="width: 100%"
            >
              <a-button
                slot="addon"
                size="small"
                type="default"
                class="select__btn--default timePicker_close"
                @click="timeOpen = false"
              >
                <a-icon type="check" />
                確定
              </a-button>
            </a-time-picker>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="form__title form__title__block">
            Select 選擇器 <span>{{ '＜a-select＞' }}</span>
          </div>
        </a-col>
        <a-col :span="11" class="setting__desc">
          <div>
            常用設定：
          </div>
          <ul class="form__content">
            <li><span class="text--bold">show-search</span> - 搜尋 </li>
            <li><span class="text--bold">:autoFocus="true" </span> - focus 被選取的值。 </li>
            <li><span class="text--bold">mode="multiple"</span> - 多選，若沒有寫 "預設default"單選 </li>
            <li><span class="text--bold">:maxTagCount</span> - 最多顯示多少個 tag (須在多選條件下) </li>
            <li><span class="text--bold">slot="dropdownRender" </span> - 對下拉選單進行功能擴展。 </li>
            <li>多選下拉，初始值須宣告為 <span class="text--bold">undefined </span></li>
          </ul>
        </a-col>
        <a-col :span="6">
          <a-form-model-item prop="singleSelect" label="單選下拉">
            <a-select
              v-model="form.singleSelect"
              placeholder="請選擇"
              show-search
              allowClear
              :autoFocus="true"
            >
              <a-select-option v-for="(item, index) in items" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item prop="multiSelect" label="多選下拉">
            <div @mousedown="e => {
              e.preventDefault()
              selectOpen = true
            }"
            >
              <a-select
                ref="multiSelect"
                v-model="form.multiSelect"
                mode="multiple"
                :maxTagCount="2"
                placeholder="請選擇"
                :filter-option="filterOption"
                :open="selectOpen"
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider class="dropdownRender__divider__block" />
                  <div
                    class="dropdownRender__block btnGroup text-left"
                  >
                    <div v-if="isAdd" class="d-flex">
                      <a-input
                        v-model="form.addItem"
                        class="addItem_wrap"
                        style="width: 100%"
                        placeholder="請輸入"
                        @click="e=>e.target.focus"
                      />
                      <div>
                        <a-icon type="check-circle" class="ms-2 mt-2" style="font-size: 18px" @click="addOptionItem" />
                      </div>
                    </div>
                    <div class="mt-1" @click="isAdd = true">
                      <a-icon type="plus" /> 新增選項
                    </div>
                    <div class="mt-1" @click="selectALL()">
                      <a-icon type="plus" /> 全選
                    </div>
                    <div class="mt-1" @click="clearALL">
                      <a-icon type="minus" /> 清空
                    </div>
                  </div>
                </div>
                <a-select-option v-for="(item, index1) in items" :key="index1" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="form__title form__title__block">
            Input 文字輸入框 <span>{{ '＜a-input＞' }}</span>
          </div>
        </a-col>
        <a-col :span="11" class="setting__desc">
          <div>
            常用設定：
          </div>
          <ul class="form__content">
            <li><span class="text--bold">maxLength</span> - 可輸入最大長度字數 </li>
            <li><span class="text--bold">compact</span> - 將輸入框組合 </li>
          </ul>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            prop="textDesc"
            label="文字輸入框"
          >
            <a-input
              v-model="form.textDesc"
              style="width: 100%"
              placeholder="請輸入"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            prop="desc"
            label="組合輸入框"
          >
            <a-input-group compact>
              <a-input style="width: 25%" default-value="02" />
              <a-input style="width: 75%" default-value="22021234" />
            </a-input-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            prop="desc"
            label="組合輸入框"
          >
            <a-input-group compact>
              <a-input class="input__compact" placeholder="Minimum" />
              <a-input
                class="input__compact__center"
                placeholder="~"
                disabled
              />
              <a-input class="input__compact input__compact__right" placeholder="Maximum" />
            </a-input-group>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="form__title form__title__block">
            Input 數字輸入框 <span>{{ '＜a-input-number＞' }}</span>
          </div>
        </a-col>
        <a-col :span="11" class="setting__desc">
          <div>
            常用設定：
          </div>
          <ul class="form__content">
            <li><span class="text--bold">:step</span> - 每次加減的數值 </li>
            <li><span class="text--bold">:min</span> - 最小值 </li>
            <li><span class="text--bold">:max</span> - 最大值 </li>
            <li><span class="text--bold">:precision="2"</span> - 數值精準度。 </li>
            <li><span class="text--bold">:formatter</span> - 指定輸入框展示值的格式 </li>
            <li><span class="text--bold">:parser</span> - 指定從 formatter 轉換回數字的方式，和 formatter 搭配使用</li>
          </ul>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            prop="desc"
            label="數字輸入框"
          >
            <a-input-number
              v-model="form.numDesc"
              :min="0"
              :max="10"
              :step="0.5"
              style="width: 100%"
              placeholder="請輸入"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            prop="desc"
            label="數字輸入框"
          >
            <a-input-number
              v-model="form.numDesc3"
              :min="0"
              :max="10"
              :precision="2"
              style="width: 100%"
              placeholder="請輸入"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            prop="desc"
            label="前綴字$"
          >
            <a-input-number
              v-model="form.numDesc1"
              :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              style="width: 100%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            prop="desc"
            label="後綴字%"
          >
            <a-input-number
              v-model="form.numDesc2"
              :min="0"
              :max="100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              style="width: 100%"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="form__title form__title__block">
            Textarea 輸入框 <span>{{ '＜a-textarea＞' }}</span>
          </div>
        </a-col>
        <a-col :span="11" class="setting__desc">
          <div>
            常用設定：
          </div>
          <ul class="form__content">
            <li><span class="text--bold">allow-clear</span> - 可以點擊清除圖標刪除内容</li>
            <li><span class="text--bold">:auto-size="{ minRows: 3, maxRows: 5 }" </span> - 內容高度，超過最大高度時，才會出現捲軸。</li>
          </ul>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            prop="rejectDesc"
            label="多行文字輸入"
          >
            <a-textarea
              v-model="form.textarea"
              :auto-size="{ minRows: 3, maxRows: 3 }"
              allow-clear
              style="width: 100%"
              placeholder="請輸入"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" :wrap="true">
        <a-col v-if="!showInputText" :span="7">
          <a-form-model-item prop="transactionDate" label="日期">
            <a-range-picker
              v-model="form.transactionDate"
              :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
          </a-form-model-item>
        </a-col>
        <a-col v-if="showInputText" id="inputDate" :span="7">
          <a-form-model-item prop="inputDate" label="日期">
            <a-input
              v-model="form.inputDate"
              style="width: 100%"
              placeholder="請輸入日期(yyyy或yyyymm)"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="1" style="margin-top: 4px; margin-left: 10px;">
          <a-tooltip placement="top" title="切換" arrow-point-at-center>
            <a-button
              class="btn__select--default"
              @click="showInputText = !showInputText"
            >
              <a-icon type="retweet" />
            </a-button>
          </a-tooltip>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script src="./FormDemo.ts" lang="ts">
</script>

<style lang="scss" scoped>
li {
  margin: 10px 0;
}
.event__block {
  margin-top: 20px;
}
// 表單標題
.form__title {
    color: #2F6A9A;
    font-size: 20px;
    font-weight: 700;
}
.setting__desc {
  border: 1px solid gray;
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 15px;
  margin-right: 10px;
}
.form__title__block {
  padding: 13px 0;
  margin-top: 20px;
}
.form__content {
  list-style: decimal;
}
.text--bold {
  font-weight: bold;
  line-height: 1.5;
}
.input__compact {
  width: 40%;
  text-align: center
}
.input__compact__center {
  width: 20%;
  border-left: 0;
  pointer-events: none;
  background-color: #fff;
}
.input__compact__right {
  border-left: 0;
}
.timePicker_close {
  border: none !important;
  justify-content: center;
  align-items: center;
  display: flex;
}
::v-deep{
  .ant-btn[disabled] {
    &, &:hover {
      color: rgba(0, 0, 0, 0.25);
      background-color: #f5f5f5;
      border-color: #d9d9d9;
      text-shadow: none;
      box-shadow: none;
    }
  }
  #inputDate .has-error .ant-form-explain, .has-error .ant-form-split {
    color: #4222f5;
  }
  #inputDate .has-error .ant-input, .has-error .ant-input:hover {
    background-color: #fff;
    border-color: #d9d9d9;
  }
}

.btn__select--default {
  &, &:focus {
    color: $COLOR-MAIN15;
    border: {
      width: 1px;
      style: solid;
      color: $COLOR-MAIN15;
    }
  }
  &:hover,
  &:active {
    color: $COLOR-MAIN16;
    border: {
      color: $COLOR-MAIN16;
    }
  }
}
</style>
