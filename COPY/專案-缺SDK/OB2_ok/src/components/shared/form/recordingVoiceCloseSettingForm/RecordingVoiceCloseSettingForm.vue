<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-model-item prop="itemTypeCode" label="段落類型"
                         :has-feedback="itemTypeValid.feedback" :validateStatus="itemTypeValid.state">
        <a-popover placement="top" v-model="itemTypeValid.hoverShow" :trigger="itemTypeValid.hover" :content="itemTypeValid.msg">
          <a-select v-model="form.itemTypeCode" :options="selectItemTypeOptions" :disabled="isEditing"></a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="itemCode" label="編號"
                         :has-feedback="codeValid.feedback" :validateStatus="codeValid.state">
        <a-popover placement="top" v-model="codeValid.hoverShow" :trigger="codeValid.hover" :content="codeValid.msg">
          <a-input type="text" v-model="form.itemCode" :disabled="isEditing" :maxLength="20"></a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="itemContent" label="內容"
                         :has-feedback="contentValid.feedback" :validateStatus="contentValid.state">
        <a-popover placement="top" v-model="contentValid.hoverShow" :trigger="contentValid.hover" :content="contentValid.msg">
          <a-input type="text" v-model="form.itemContent" :maxLength="500"></a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="answerTypeCode" label="答案類別"
                         :has-feedback="answerTypeValid.feedback" :validateStatus="answerTypeValid.state">
        <a-popover placement="top" v-model="answerTypeValid.hoverShow" :trigger="answerTypeValid.hover" :content="answerTypeValid.msg">
          <a-select v-model="form.answerTypeCode" @change="onAnswerTypeChange">
            <a-select-option value="ATC01">單選</a-select-option>
            <a-select-option value="null">無選項</a-select-option>
          </a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="answerOptionId" label="答案選項">
        <a-select v-model="form.answerOptionId" :options="selectAnswerOptions" :disabled="!isAnswerOptionEdit"></a-select>
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

      <a-form-model-item prop="updateReason" label="修改原因"
                         :has-feedback="reasonValid.feedback" :validateStatus="reasonValid.state">
        <a-popover placement="top" v-model="reasonValid.hoverShow" :trigger="reasonValid.hover" :content="reasonValid.msg">
          <a-input type="text" v-model="form.updateReason" :maxLength="500" :disabled="!isEditing"></a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="createId" label="建立人員">
        <a-input type="text" v-model="form.createId" :disabled="true"></a-input>
      </a-form-model-item>

      <a-form-model-item prop="createDate" label="建立日期" v-show="isEditing">
        <a-input type="text" v-model="form.createDate" :disabled="true"></a-input>
      </a-form-model-item>

      <a-form-model-item prop="updateId" label="最後異動人員" v-show="isEditing">
        <a-input type="text" v-model="form.updateId" :disabled="true"></a-input>
      </a-form-model-item>

      <a-form-model-item prop="updateDate" label="最後異動日期" v-show="isEditing">
        <a-input type="text" v-model="form.updateDate" :disabled="true"></a-input>
      </a-form-model-item>

    </a-form-model>
  </a-spin>
</template>

<script src="./RecordingVoiceCloseSettingForm.ts" lang="ts"></script>