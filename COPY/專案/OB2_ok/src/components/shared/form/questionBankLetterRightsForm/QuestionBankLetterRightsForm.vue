<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-model-item prop="itemTitleCode" label="題目類型"
                         :has-feedback="itemTitleValid.feedback" :validateStatus="itemTitleValid.state">
        <a-popover placement="top" v-model="itemTitleValid.hoverShow" :trigger="itemTitleValid.hover" :content="itemTitleValid.msg">
          <a-select v-model="form.itemTitleCode" :options="selectItemTitleOptions" :disabled="isEditing"></a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="itemCode" label="題目編號"
                         :has-feedback="codeValid.feedback" :validateStatus="codeValid.state">
        <a-popover placement="top" v-model="codeValid.hoverShow" :trigger="codeValid.hover" :content="codeValid.msg">
          <a-input type="text" v-model="form.itemCode" :disabled="isEditing" :maxLength="20"></a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="itemContent" label="題目內容"
                         :has-feedback="contentValid.feedback" :validateStatus="contentValid.state">
        <a-popover placement="top" v-model="contentValid.hoverShow" :trigger="contentValid.hover" :content="contentValid.msg">
          <a-input type="text" v-model="form.itemContent" :maxLength="500"></a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="answerTypeCode" label="答案類別"
                         :has-feedback="answerTypeValid.feedback" :validateStatus="answerTypeValid.state">
        <a-popover placement="top" v-model="answerTypeValid.hoverShow" :trigger="answerTypeValid.hover" :content="answerTypeValid.msg">
          <a-select v-model="form.answerTypeCode" :options="selectAnswerTypeOptions" @change="onAnswerTypeChange"></a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="answerOptionId" label="答案選項">
        <a-select v-model="form.answerOptionId" :options="selectAnswerOptions" :disabled="!isAnswerOptionEdit" 
                  @change="onAnswerOptionIdChange"></a-select>
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 16, offset: 6 }" v-show="isSubShow">
        <a-button type="primary" @click="openSubForm"> 子題項設定 </a-button>
      </a-form-model-item>

      <a-form-model-item prop="itemEnable" label="是否啟用"
                         :has-feedback="enableValid.feedback" :validateStatus="enableValid.state">
        <a-popover placement="top" v-model="enableValid.hoverShow" :trigger="enableValid.hover" :content="enableValid.msg">
          <a-select v-model="form.itemEnable">
            <a-select-option key="0" value="0">啟用</a-select-option>
            <a-select-option key="1" value="1">停用</a-select-option>
          </a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="權益信函內容">
        <a-input type="text" v-model="form.rightsContent" :maxLength="500"> </a-input>
      </a-form-model-item>

      <a-form-model-item label="Q&A說明">
        <a-input type="text" v-model="form.questAnswer" :maxLength="500"> </a-input>
      </a-form-model-item>

      <a-form-model-item prop="updateReason" label="修改原因"
                         :has-feedback="reasonValid.feedback" :validateStatus="reasonValid.state">
        <a-popover placement="top" v-model="reasonValid.hoverShow" :trigger="reasonValid.hover" :content="reasonValid.msg">
          <a-input type="text" v-model="form.updateReason" :maxLength="500" :disabled="!isEditing"> </a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="createId" label="建立人員">
        <a-input type="text" v-model="form.createId" :disabled="true"></a-input>
      </a-form-model-item>

      <a-form-model-item prop="createDate" label="建立日期" v-show="isEditing">
        <a-input type="text" v-model="form.createDate" :disabled="true"> </a-input>
      </a-form-model-item>

      <a-form-model-item prop="updateId" label="最後異動人員" v-show="isEditing">
        <a-input type="text" v-model="form.updateId" :disabled="true"> </a-input>
      </a-form-model-item>

      <a-form-model-item prop="updateDate" label="最後異動日期" v-show="isEditing">
        <a-input type="text" v-model="form.updateDate" :disabled="true"> </a-input>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script src="./QuestionBankLetterRightsForm.ts" lang="ts"></script>

<style>
/** Form scroll */
.ant-modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
