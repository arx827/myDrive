<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 14 }"
    >
      
      <a-form-model-item  prop="answerTypeCode" label="答案選項類別"
                          :has-feedback="typeCodeValid.feedback" :validateStatus="typeCodeValid.state">
        <a-popover placement="top" v-model="typeCodeValid.hoverShow" :trigger="typeCodeValid.hover" :content="typeCodeValid.msg">
          <a-select  v-model="form.answerTypeCode" @change="onAnswerTypeChange"
                      :placeholder="$t('請選擇')"
                      :options="selectStatusOptions"
                      :disabled="isEditing">
          </a-select>
        </a-popover> 

        <div @click="onAnswerTypeTipClick" class="tipBtn">
          <img class="tipImgBtn" src="@/assets/imgs/help.png" />
        </div>
      </a-form-model-item>
      
      <transition name="router-slid">
        <div id="answerTip" class="tipCont" v-show="isHidden">請先選擇答案選項類別</div>
      </transition>

      <a-form-model-item prop="answerOptionId" label="答案選項代碼"
                         :has-feedback="optionIdValid.feedback" :validateStatus="optionIdValid.state">
        <a-popover placement="top" v-model="optionIdValid.hoverShow" :trigger="optionIdValid.hover" :content="optionIdValid.msg">
          <a-input type="text" v-model="form.answerOptionId" :disabled="isEditing" :maxLength="20"> </a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="answerOption" label="答案選項"
                         :has-feedback="optionValid.feedback" :validateStatus="optionValid.state">
        <a-popover placement="top" v-model="optionValid.hoverShow" :trigger="optionValid.hover" :content="optionValid.msg">
          <a-input type="text" v-model="form.answerOption" :maxLength="500"> </a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="answerEnable" label="是否啟用"
                         :has-feedback="enableValid.feedback" :validateStatus="enableValid.state">
        <a-popover placement="top" v-model="enableValid.hoverShow" :trigger="enableValid.hover" :content="enableValid.msg">
          <a-select v-model="form.answerEnable">
            <a-select-option key="0" value="0">啟用</a-select-option>
            <a-select-option key="1" value="1">停用</a-select-option>
          </a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item prop="answerDesc" label="說明">
        <a-input type="text" v-model="form.answerDesc" :maxLength="500"> </a-input>
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

<script src="./AnswerOptionSettingForm.ts" lang="ts"></script>

<style>
  /* 提示按鈕 */
  .tipBtn {
    display:inline-block;
    width:22px;
    height:32px;
    cursor:pointer;
    position:absolute;
    top:-12px;
    right:-23px;
  }

  /* 提示按鈕圖式 */
  .tipImgBtn {
    width:24px;
    height:24px;
    -webkit-filter:hue-rotate(340deg);
    filter: hue-rotate(340deg);
  }
  .tipImgBtn:hover {
    -webkit-filter:hue-rotate(330deg) brightness(1.3);
    filter:hue-rotate(330deg) brightness(1.3);
  }

  /* 提示內容 */
  .tipCont {
    clear:both;
    min-height:24px;
    background-color:#eef6f8;
    width:79%;
    margin-left:60px;
    margin-top:-24px;
    padding:0px 5px;
  }

  /* 提示內容範例 */
  .tipEx {
    font-weight:bold;
    color:black;
  }

  /* 提示內容動畫 */
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s ease;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(0, -0.5rem, 0);
    opacity: 0;
  }
  
  @media (max-width: 576px){
    .tipCont {
      width:100%;
      margin-left:0px;
    }
  }
</style>
