<template>
  <div>
    <!-- 選單頁籤 -->
    <div>
      <a-tabs v-model="form.questTabKey" @change="onTabChange">
        <a-tab-pane v-for="(data, index) in questAreaData.questDto" :key="index.toString()">
          <div slot="tab" :class="getTabClass(data.caseNo, data.closeCase)">{{ getTabTitle(data.business, data.casePolicy, data.questName) }}</div>
        </a-tab-pane>

        <a-tab-pane key="changeWork" :disabled="changeWorkDisaled">
          <div slot="tab" :class="(!changeWorkDisaled)? 'tabTipStar':''">電話變更作業</div>
        </a-tab-pane>
      </a-tabs>
    </div>

    

    
    <!-- 問卷內容 -->
    <div v-if="form.questTabKey != 'changeWork'">

      <!-- 錯誤訊息提示 -->
      <div v-if="form.errTip != ''" style="color:red;">{{form.errTip}}</div>

      <!-- 保單資料區 -->
      <a-row v-for="(data, index) in form.questPolicyDto" :key="'policy_'+index" style="margin:20px 0px;">
        <a-col>
          <div ref="policyRef" v-html="data.content"></div>
        </a-col>

        <a-col style="text-align:center; margin-top:10px;">
          <a-button v-for="(btn, i) in data.answerOptions" :key="'pBtn_' + i" :class="'block-btn block-btn--next ' + btn.class"
                    @click="clickPolicyAnswer(btn.questIndex, i, btn.key)" :disabled="policyDisaled || checkPlayRecord(data.isPlayRecord)">
            {{btn.cont}}
          </a-button>
        </a-col>
      </a-row>


      <!-- 案件狀態 -->
      <!--<div v-if="form.closeCase" style="color:red;">案件狀態：已結案({{this.form.closeReasonCode}})</div>-->

      <!-- 執行時機 -->
      <!--<div v-if="form.executeTime != ''">執行時機：{{form.executeTime}}</div>-->

      <!-- 主機代碼-->
      <!--<div v-if="form.coreSystemCode != ''">主機代碼：{{form.coreSystemCode}}</div>-->


      <!-- 題庫 -->
      <a-row v-for="(data) in form.questContDto" :id="form.caseNo+'_'+data.itemCode" :style="getBackgroundStyle(form.caseNo, data.itemCode)" :key="data.itemCode" :class="(data.isShow)? 'questRow':''">
        <!--<div v-if="!data.isShow" style="color:#ff00cd; border-bottom:1px solid #C7C7C7;">[測試用]這裡有子題隱藏</div>-->
        <div v-if="data.isShow">
          <a-col span="2">
            <div class="questNum">Q{{data.questNumber}}.</div>
            <div v-if="data.questSubNumber > 0" class="questNum">{{data.questSubNumber}}</div>
          </a-col>

          <a-col span="11">
            <!--題目:<br>-->
            <div v-html="data.content" class="questContent"></div>
          </a-col>

          <a-col span="10" style="padding-left:15px;">
            <!--
            選項({{data.answerTypeCode}}):<br>
            {{data.answerOption}}<br>
            答案紀錄：{{data.answer}}<br>
            

            保戶回答：<br>
            <div v-html="data.customerAnswer"></div>
            -->
            

            <div v-if="radio.includes(data.answerTypeCode)">
              <!-- 如類型為題組(ATC05)不需訪員選取答案 -->
              <RadioGroup v-model="radioAns[data.itemCode]" :name="data.itemCode" @change="onRadioChange" :disabled="questDisabled || data.answerTypeCode == 'ATC05'">
                <Radio v-for="(radio, index) in data.answerOptions" :key="data.itemCode + '_option_' + index" :value="radio.value" @click="clickRadioAnswer(data.itemCode, radio)">
                  {{radio.cont}}
                  <a-input v-model="inputAns[data.itemCode][radio.value]" v-if="input.includes(data.answerTypeCode) && radio.input" :name="data.itemCode + '_' + radio.value" class="remark" :disabled="questDisabled || !(radioAns[data.itemCode] == radio.value)" @blur="onInputChange($event, data.itemCode, radio)" onkeyup="this.value=this.value.replace(/[-:]/g,'')"/>
                </Radio>
              </RadioGroup>
            </div>

            <div v-if="checkbox.includes(data.answerTypeCode)">
              <a-checkbox-group v-model="checkboxAns[data.itemCode]" :name="data.itemCode" @change="onCheckboxChange" :disabled="questDisabled">
                <a-checkbox v-for="(check) in data.answerOptions" :key="check.value" :value="check.value" @click="clickCheckboxAnswer(data.itemCode, check)"><!-- :value="check.value"  -->
                  {{check.cont}}
                  <a-input v-model="inputAns[data.itemCode][check.value]" v-if="input.includes(data.answerTypeCode) && check.input" class="remark" :name="data.itemCode + '_' + check.value" :disabled="questDisabled || !(checkboxAns[data.itemCode].includes(check.value))" @blur="onInputChange($event, data.itemCode, check)" onkeyup="this.value=this.value.replace(/[-:]/g,'')"/>
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </a-col>

          <a-col span="1">
            <a-popover v-model="popoverShow[data.itemCode]" placement="right" trigger="click">
              <div slot="title" class="ant-popover-title">常見問題Q&A</div>
              <div slot="content" class="ant-popover-content" v-html="data.questAnswer"></div>
              <div slot="content" class="ant-popover-button-div">
                <a-button class="block-btn block-btn--next ant-popover-button " @click="popoverShow[data.itemCode]=false">離開</a-button>
              </div>
              <div v-if="data.questAnswer != null && data.questAnswer != ''" class="qAndABtn">？</div>
            </a-popover>
            <div v-if="false" v-html="data.questAnswer"></div>
          </a-col>
        </div>
        <!--
        <a-col>
          保戶回答:<br>
          <div v-html="data.customerAnswer"></div>
        </a-col>
        -->
        <CustomerAnswer v-if="data.isShow" custType="quest" :questAllData="questAllData" :caseNo="form.caseNo" :itemCode="data.itemCode">
        </CustomerAnswer>
      </a-row>

      <!-- 重寄信函區塊 -->
      <div v-if="form.reSendLetter"> <!-- style="margin:10px 0px; border-bottom:1px #C7C7C7 solid;" -->
        <div style="color:#FFF; background-color:#7ca7d6; padding:2px 10px;">重寄信函</div>
        <div style="padding:10px; border:1px solid #7ca7d6;">
          <RadioGroup v-model="form.reSendType" style="width:100%;">
            <Radio value="0" @click="onReSendTypeChange('0')">郵寄原址：{{form.reSendOriAddr}}<font style="color:red;">核身未通過或未核身僅能郵寄原地址</font></Radio>
            <br>
            <Radio value="1" @click="onReSendTypeChange('1')" style="width:100%; padding-top:10px;" :disabled="reSendLetterDisabled">改寄地址：<a-input v-model="form.reSendAddr" style="width: calc(100% - 95px);" @blur="onReSendAddrChange" :disabled=" !(form.reSendType=='1' && !reSendLetterDisabled) "></a-input></Radio>
          </RadioGroup>
        </div>
      </div>

      <!-- 問卷檢核按鈕 -->
      <div style="text-align:center; margin-top:5px;">
        <a-button class="block-btn block-btn--save" :disabled="questDisabled" @click="onQuestCheckClick(form.caseNo)">問卷檢核</a-button>
        <a-button class="block-btn block-btn--next" :disabled="questDisabled" @click="onNoAnswerCheckClick(form.caseNo)">拒答檢核</a-button>
      </div>

      <!-- <div style="text-align:right; margin-top:5px;">
        電訪結果
        <a-select style="width:120px;" :dropdownMatchSelectWidth="false" v-model="form.callOutResult" :options="selectCallOutResultOptions" @change="onCallOutResultChange" :disabled="questDisabled"></a-select>
        <a-select style="width:120px;margin-left:5px" :dropdownMatchSelectWidth="false" v-model="form.closeReasonCodeCase" :options="selectCloseReasonCodeCaseOptions" :disabled="questDisabled"></a-select>
        <a-button class="block-btn send-btn" @click="sendDataButton()" :disabled="questDisabled">確認</a-button>
      </div> -->

      <!-- 結束語 -->
      <div style="position: relative;">
        <a-row v-for="(data, index) in form.questEndAreaDto.questEndDto" :key="index" style="margin-top:25px;">
          <a-col v-if="getDisplayOrNot(data.itemCode)">
            <!--{{data.itemCode}}-->
            <div v-html="data.content"></div>
          </a-col>
        </a-row>
        <!--
        <div v-if="form.questEndAreaDto.customerAnswer != undefined" 
            v-html="'保戶回答:<br>' + form.questEndAreaDto.customerAnswer">
        </div>-->
        <CustomerAnswer v-if="form.questEndAreaDto.questEndDto != null && form.questEndAreaDto.questEndDto.length > 0" 
                        custType="end" :questAllData="questAllData" :caseNo="form.caseNo">
        </CustomerAnswer>
      </div>

    </div>

    <!-- 電話變更作業內容區塊 -->
    <div id="changeCaseArea" v-if="form.questTabKey == 'changeWork'" style="height:calc(100% - 200px); overflow:auto;">
      <QuestTelChange 
        changeType="quest"
        :isReSend="changeCase.isReSend"
        :reviewNo="changeCase.reviewNo"
        :changePackNo="changeCase.packNo"
        :changeCaseNo="changeCase.caseNo"
        @resultLoading="resultLoading"
      >
      </QuestTelChange>
      <!--
      <a-row v-for="(data, index) in questList" :key="'changeCase_' + index" style="padding:10px 0px;">
        <a-col v-if="data.answerType != null" :span="16" style="padding-right:10px;">
          {{data.content}}
        </a-col>
        <a-col v-if="data.answerType == null" colSpan=2 style="padding-right:10px;">
          {{data.content}}
        </a-col>
        <a-col :span="8">
          <div v-if="data.answerType == 'checkbox'">
            <a-checkbox v-for="(check, index) in data.answerOption" :key="'cCheck_' + index" :value="check.value">
              {{check.cont}}
            </a-checkbox>
          </div>
          <div v-if="data.answerType == 'radio'">
            <RadioGroup v-model="form.checkIdAnswer" name="checkIdRadioGroup">
              <Radio v-for="(radio, index) in data.answerOption" :key="'cRadio_' + index" :value="radio.value">
                {{radio.cont}}
              </Radio>
            </RadioGroup>
          </div>
          <div v-if="data.answerType == 'button'">
            <a-button v-for="(button, index) in data.answerOption" :key="'cButton_' + index">
              {{button.cont}}
            </a-button>
          </div>
          <div v-if="data.answerType == 'input'">
            <a-input v-for="(input, index) in data.answerOption" :key="'cInput_' + index" :placeholder="data.cont">
            </a-input>
          </div>
        </a-col>
      </a-row>

      <a-button @click="submitChangeWork">儲存</a-button>-->

    </div>

    <!-- 共用結束語區 -->
    <div id="commonEnd" style="background-color:#FFF4F4; margin:5px -10px -10px -10px; padding:5px 10px; min-height:40px;">
      <div class="commonEndTitle">結束語</div>
      <div v-html="endData.content"></div>
    </div>

  </div>
</template>
<script src="./QuestArea.ts" lang="ts"></script>

<style lang="less" scoped>
#changeCaseArea > .ant-row {
  border: 1px solid #000;
}

/deep/ .ant-tabs-tab {
  white-space: normal;
  word-break: break-all;
  text-align: justify;
  text-justify: auto;
  max-width: 220px;
  padding: 5px;
  vertical-align: middle;
}

/deep/ .ant-tabs-tab:last-child {
  width: 220px;
  height: 55px;
  line-height: 50px;
  margin-bottom: 5px;
  background-color: #FFF4DD;
  text-align: center;
}

/* popover提示窗標題 */
.ant-popover-title {
  background-color: #848484;
  color: #FFF;
  font-weight: 600;
  margin-top: -5px;
  margin-left: -16px;
  width: calc(100% + 32px);
}
/* popover提示窗內容 */
.ant-popover-content {
  line-height: 25px;
  margin-top: -5px;
  max-width: 600px;
  max-height: 600px;
  overflow: auto;
}
/* popover提示窗關閉按鈕div */
.ant-popover-button-div {
  width: 100%;
  text-align: right;
  margin-top: 5px;
}
/* popover提示窗關閉按鈕 */
.ant-popover-button {
  min-width: 75px !important;
  min-height: 30px !important;
  border-radius: 5px !important;
}
.ant-popover-button:hover {
  border-color: #a2a2a2;
  color: #6d6d6d;
}


/* 答案按鈕 */
.selected {
  background-color:#56B4B5 !important;
  color:#FFF;
}
.selected:disabled,
.selected:disabled:hover {
  color: #EEE !important;
}
.default {
  background-color:#EEEEEE !important;
}
.block-btn {
    min-width: 130px;
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
.send-btn {
  min-width: 50px;
  min-height: 37px;
  border-radius: 20px;
  margin-left: 10px;
  background-color: @BUTTON-BG-GREEN;
  .text-white-format()
}


/* 複選答案 */
.ant-checkbox-wrapper {
  margin-left: 0px;
}

/* 題號 */
.questNum {
  display: inline-block;
  color: #055A98;
  font: normal normal bold 16px Arial;
}

/* Q&A按鈕 */
.qAndABtn {
  width:23px;
  height:23px;
  //background-color:#0099CC;
  color: #0099CC;
  cursor: pointer;
  border: 2px #0099CC solid;
  border-radius: 100%;
  font-size: 17px;
  padding-left: 1px;
  line-height: 21px;
}
.qAndABtn:hover {
  background-color: #0099CC;
  color: #FFF;
}

/* 頁籤灰字 */
.tabClose {
  color: #c3c3c3;
}
/* 頁籤驚嘆號提示 */
.tabTipIcon::after {
  content: "！";
  color: red;
}

/* 頁籤星號提示 */
.tabTipStar::after {
  content: "★";
  color: #FAAD14;
  font-size: 16px;
  margin-left: 2px;
}

/* 問卷題目欄 */
.questRow {
  padding:10px 25px 10px 0px;
  border-bottom:1px solid #C7C7C7;
}

/* 答案備註欄位 */
.remark {
  width: calc(100% - 80px);
  max-width: 150px;
}

/* 共用結束語標題 */
.commonEndTitle {
  display: block;
  float: left; 
  background: #0099CC;
  color: #FFF;
  height: 25px;
  line-height: 25px;
  width: 58px;
  margin-bottom: 10px;
  position: relative;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0px 2px 2px 0px rgba(0, 153, 204, .2);
}
.commonEndTitle::before {
  content: "";
  border-color: #0099CC #0099CC transparent transparent;
  border-style: solid solid solid solid;
  border-width: 6px 0px 7px 10px;
  position: absolute;
  bottom: -13px;
  left: 40px;
  height: 0px;
  width: 0px;
}
.commonEndTitle::after {
  content: "";
  border-bottom: 1px solid #0099CC;
  width: 25px;
  position: absolute;
  bottom: -6px;
  left: 30px;
  box-shadow: 0px 2px 2px 0px rgba(0, 153, 204, .2);
}
</style>

<style>
/* 問卷題目 */
.questContent,
.questContent > font {
  text-align: justify;
  word-wrap: break-word;
  word-break: break-all;
}

/* 語音宣告按鈕 */
.recordBtn {
  border-radius: 20px;
  background-color: #56B4B5 !important;
  color: #FFF;
}
.recordBtn:hover,
.recordBtn:focus {
  color: #FFF;
}
.recordBtn:disabled,
.recordBtn:disabled:hover {
  color: #EEE;
}

</style>