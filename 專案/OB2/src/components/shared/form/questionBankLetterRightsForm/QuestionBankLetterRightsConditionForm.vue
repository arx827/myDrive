<template>
  <a-spin :spinning="isLoading">
    <a-form-model
      ref="formRef"
      :model="form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 15 }"
    >
      <a-row>
        <a-col :span="6">
          <a-form-model-item label="題目編號" prop="itemCode">
            <a-input type="text" v-model="form.itemCode" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>

      <!-- 動態條件明細物件 -->
      <a-row v-for="(data, index) in conditionList" :key="data.itemSequence">
        <a-col :span="6">
          <a-form-model-item :label="'條件' + (index + 1)">
            <a-input type="text" v-model="data.itemConditionDesc" :maxLength="500"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item label="運算式">
            <a-select v-model="data.itemConditionExpress" :options="selectExpressOptions"></a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item label="條件欄位">
            <a-input type="text" v-model="data.itemConditionColumn" :maxLength="500"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item label="條件參數">
            <a-input type="text" v-model="data.itemConditionPara" placeholder="使用 : 區隔多筆參數" :maxLength="500"></a-input>
          </a-form-model-item>
        </a-col>

        <div :class="(conditionList.length > 0)? 'delBtnDiv':'noneDiv'" @click="doDelObj(data)">
          <a-icon class="delBtn" type="minus-circle" />
        </div>
      </a-row>

      <a-row>
        <a-col :span="6">
          <a-form-model-item prop="createId" label="建立人員">
            <a-input type="text" v-model="form.createId" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item prop="createDate" label="建立日期">
            <a-input type="text" v-model="form.createDate" :disabled="true"> </a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item prop="updateId" id="updateId" label="最後異動人員">
            <a-input type="text" v-model="form.updateId" :disabled="true"> </a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item prop="updateDate" id="updateDate" label="最後異動日期">
            <a-input type="text" v-model="form.updateDate" :disabled="true"> </a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-spin>
</template>
<script src="./QuestionBankLetterRightsConditionForm.ts" lang="ts"></script>

<style>
  /** 刪除物件按鈕Div */
  .delBtnDiv {
    display: inline-block;
    width: 22px;
    height: 32px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: -16px;
  }
  .noneDiv {
    display: none;
  }

  /** 刪除物件按鈕 */
  .delBtn {
    font-size: 20px;
    color: #F5222D;
  }

  /** 錯誤窗\n換行 */
  .ant-modal-confirm-content{
    white-space: pre-line;
  }
  
  /** 最後異動人員、日期標題樣式 */
  label[for=updateId], label[for=updateDate]{
    font-size: 13px;
    white-space: pre !important;
  }
</style>

<style scoped>
  /** 欄位標題自動換行 */
  ::v-deep .ant-form-item-label > label {
    width: 100%;
    line-height: 18px;
    display: inline-block;
    white-space: pre-wrap;
  }
</style>