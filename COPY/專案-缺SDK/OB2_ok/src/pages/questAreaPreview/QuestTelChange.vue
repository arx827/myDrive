<template>
    <div>

      <a-row v-for="(data, index) in questList" :key="'changeCase_' + index" style="padding:5px 10px;border:1px solid #7ca7d6;">
        <a-col v-if="data.answerType != null" :span="16" style="padding-right:10px;">
          {{data.content}}
        </a-col>
        <a-col v-if="data.answerType == null" colSpan=2 style="padding-right:10px;">
          <p v-html="data.content"></p>
        </a-col>
        <a-col :span="8">
          <div v-if="data.answerType == 'checkbox'">
            <a-checkbox v-for="(check, index) in data.answerOption" :key="'cCheck_' + index" @change="clickCheckboxAnswer($event, data.item, check)" :disabled="data.disable" >
              {{check.cont}}
            </a-checkbox>
          </div>
          <div v-if="data.answerType == 'radio'">
            <RadioGroup v-model="radioAns[data.item]" name="telRadioGroup">
              <Radio v-for="(radio, index) in data.answerOption" :key="'cRadio_' + index" :value="radio.value" @click="clickRadioAnswer(data.item, radio)" :disabled="data.disable" :checked="true" >
                {{radio.cont}}
              </Radio>
            </RadioGroup>
          </div>
          <div v-if="data.answerType == 'button'">
            <a-button :class="data.disable? 'block-btn block-btn--next':'block-btn block-btn--save'" v-for="(button, index) in data.answerOption" :key="'cButton_' + index" @click="clickButtonAnswer(data.item, button)" :disabled="data.disable">
              {{button.cont}}
            </a-button>
            <a-checkbox v-if="data.item == 'item02'" @click="cancelPlayRecord($event)" :disabled="data.disable" >
              取消播放語音宣告
            </a-checkbox>
          </div>
          <div v-if="data.answerType == 'input'">
            <a-form-model-item :validateStatus="data.status">
              <a-input v-model="inputAns[data.item]" v-for="(input, index) in data.answerOption" :key="'cInput_' + index" :placeholder="data.cont" @blur="textChange($event, data.item)" :disabled="data.disable">
              </a-input>
            </a-form-model-item>
          </div>
        </a-col>
      </a-row>

      <!--<a-button @click="submitChangeWork">儲存</a-button>-->

    </div>
</template>
<script src="./QuestTelChange.ts" lang="ts"></script>

<style lang="less" scoped>
.block-btn {
    min-width: 90px;
    min-height: 37px;
    border-radius: 20px;
    &--save {
        background-color: @BUTTON-BG-GREEN;
        .text-white-format()
    }
    &--next {
        background-color: @BUTTON-BG-LIGHT-GRAY;
        margin-left: 15px;
    }
}
</style>