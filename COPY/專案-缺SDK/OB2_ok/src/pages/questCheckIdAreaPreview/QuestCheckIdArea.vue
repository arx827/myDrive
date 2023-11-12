<template>
  <div>
    <a-row type="flex" style="padding-right:20px;" align="middle">
      <a-col :span="10">
        <div v-if="isDisabled"  class="checkIdImgBtnNone button-checkId"></div> 
        <div v-if="!isDisabled" class="checkIdImgBtn button-checkId" @click="onCheckIdBtnClick"></div>
      </a-col>

      <a-col :span="14" style="padding-left:20px;">
        <RadioGroup v-model="questAllData.answer.checkId" name="checkIdRadioGroup" :disabled="isDisabled">
          <Radio v-for="(data, index) in checkIdAnsOption" :key="index" :value="data.key" @click="onCheckIdAnsClick(data.key)">
            {{data.cont}}
          </Radio>
        </RadioGroup>
      </a-col>
    </a-row>
  </div>
</template>
<script src="./QuestCheckIdArea.ts" lang="ts"></script>

<style lang="less" scoped>
.checkIdImgBtn {
  height: 85px;
  width: 100%;
  display: block;
  margin: auto;
  cursor: pointer;
}

/* 關閉核身按鈕 */
.checkIdImgBtnNone {
  height: 85px;
  width: 100%;
  display: block;
  margin: auto;
  pointer-events: none;
}
</style>
