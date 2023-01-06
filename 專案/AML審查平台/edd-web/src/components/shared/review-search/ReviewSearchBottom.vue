<template>
  <a-form-model ref="reviewBottom" class="reviewBottom__group">
    <h4 class="reviewBottom__title">審查結果</h4>
    <div class="reviewBottom__titleBlock">
      <a-row type="flex" align="middle">
        <a-col>
          <a-button class="toggle__btn" @click="onClick('history')" v-html="message('history')" />
        </a-col>
        <a-col>
          <div class="reviewProcess__title">審覆核歷程</div>
        </a-col>
      </a-row>
      <div class="reviewProcess__wrap" v-show="isHidden.history">
        <a-textarea class="reviewProcess__textarea" read-only v-model="historyText" :auto-size="{maxRows: 3 }"/>
      </div>
    </div>
    <div class="reviewBottom__titleBlock suggestion_block">
      <a-row type="flex" align="middle">
        <a-col>
          <a-button class="toggle__btn" @click="onClick('opinion')" v-html="message('opinion')" />
        </a-col>
        <a-col>
          <div class="reviewProcess__title">{{isConfirm?'覆核意見':'審查意見'}}<span class="mark-required">*</span></div>
        </a-col>
        <a-col style="margin-left: auto;">
          <span :class="{'textareaWordCountError': textareaWordCountError}">字數：{{textareaWordCount}}</span>/{{textareaWordCountMax}}
        </a-col>
      </a-row>
      <div class="reviewProcess__wrap" v-show="isHidden.opinion" >
        <a-form-item :validate-status="(error.opinionTextError !='')? 'error': 'success'" :help="error.opinionTextError">
          <a-textarea class="reviewProcess__textarea" read-only ref="test" v-model="memoDesc" :auto-size="{ maxRows: 8 }" :maxLength="textareaWordCountMax"/>
        </a-form-item>
      </div>
    </div>

    <a-row
      type="flex"
      justify="center"
      align="middle"
      class="announceInd__group"
    >
      <a-col>
        <a-checkbox
          value="2"
          :checked="customerdata.announceInd != null ? customerdata.announceInd == 'N' : false"
          :disabled="true"
        ><span style="color: black">無需進行可疑交易通報</span></a-checkbox>
        <a-checkbox
          value="1"
          :checked="customerdata.announceInd != null ? customerdata.announceInd == 'Y' : false"
          :disabled="true"
        ><span style="color: black">進行可疑交易通報</span></a-checkbox>
      </a-col>

    </a-row>
    <a-row
      type="flex"
      justify="center"
      align="middle"
      :gutter="8"
      class="reviewBottom__btns"
    >
      <a-col>
        <a-button class="btn btn__layout--green" @click="onPreview">預覽審查表</a-button>
      </a-col>
      <a-col>
        <a-button class="btn btn__layout--green" @click="onLeave">離開</a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script lang="tsx">
import { Vue, Component } from "vue-property-decorator";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Prop, Watch } from "vue-property-decorator";
import { Getter, Action, namespace } from 'vuex-class';
import { CommentHistoryVO, SaveRequestDto } from "@fubonlife/edd-api-axios-sdk";
import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
  getterType: 'CustomerData/getField',
  mutationType: 'CustomerData/updateField',
});

const FinanceJobInfo = namespace('FinanceJobInfo');
const CustomerData = namespace('CustomerData');
const SuspectLaundering = namespace('SuspectLaundering');
@Component({
  computed: {
    ...mapFields([
    'customerdata',
    ])
  }
})
export default class ReviewSearchBottom extends Vue {
  @Prop()
  mergeAmlData: any;

  isConfirm: boolean = false  ;
  @Getter public getMemoDesc!: string;
  @Action('setMemoDesc') setMemoDesc;

  // 財務與職業資訊
  @FinanceJobInfo.State financialSourceB!: []
  @FinanceJobInfo.State financialSourceBOther!: string
  @FinanceJobInfo.State debitUsed!: string[]
  @FinanceJobInfo.State debitUsedOther!: string
  @FinanceJobInfo.State debitSource!: string[]
  @FinanceJobInfo.State debitSourceOther!: string
  @FinanceJobInfo.State personalProperty_b!: number
  @FinanceJobInfo.State realProperty_b!: number
  @FinanceJobInfo.State guarantorAnnualIncome_b!: number
  @FinanceJobInfo.State insuredAnnualIncome_b!: number
  @FinanceJobInfo.State debt_b!: number
  @FinanceJobInfo.Action('fetchInitDatas') fetchInitDatas;
  @FinanceJobInfo.State isFinanceJobinfoUpdate;

  //客戶資料
  @CustomerData.State customerdata;
  @CustomerData.State toFormData;
  @CustomerData.State selectedCheck;
  @CustomerData.State isCustomerUpdate;

  // 疑似洗錢態樣
  @SuspectLaundering.State amlReportData!:[];
  @SuspectLaundering.State verCode;
  @SuspectLaundering.State isSuspectUpdate;

  notifyRequired: boolean = null;
  // opinionText: string = "";
  historyText: string = "";

  isHidden = {
    history: false,
    opinion: false
  };

 // 字數限制
  textareaWordCountMax: number = 2000;
  textareaWordCount: number = 0;
  textareaWordCountError: boolean = false;

  h = this.$createElement;

  @Action public setLoading: (payload: boolean) => void;

  unwatchPolicyDataProp;
  public isReviewValidate: boolean = false;

  error = {
    opinionTextError: '',
  }
  // 偵測是否進行變更，點選離開時 需不需要彈窗提醒未儲存
  isDataChange = undefined;
  leaveAndSaveVisible = false;
  leaveVisible = false;

  // 目前明細頁 AML審查檔號
  currentAmlId: string = '';


/**
 * Func
 */
  // 展開收合 按鈕符號 
  message(block) {
    return (this.isHidden[block]) ? '-' : '+';
  }
  // 取得字數計算
  getStringCount(str) {
    // NOTE: 扣除換行符，但是antd 的 maxlength 有含換行符，所以先以antd 為主
    // return str.replace(/\n/g, '').length;
    return (str)? str.length : 0;
  }

  get memoDesc() {
    return this.getMemoDesc;
  }
  set memoDesc(value) {
    this.setMemoDesc(value);
  }

getCommentHistory() {
    this.$searchAMLReviewDataApi
    .getCommentHistoryInSearchUsingGET(this.currentAmlId)
    .then(resp => {
      if(resp.data.success === true) {
        const getData = resp.data.data;
        this.historyText = getData.memoDesc;

        // 取得審查說明紀錄
        if(getData.fileStat == '1' || getData.fileStat == '2' || getData.fileStat == '20'  ){
            this.isConfirm = false;
            // 待審查
            this.$reviewApi.getReviewCommentInReviewUsingPOST({
              "efileNo": this.currentAmlId,
              "memoType": "2"
            })
            .then(resp => {
              const getData = resp.data.data;
              this.setMemoDesc(getData.memoDesc);
            })
        }else{
            this.isConfirm = true;
            // 待覆核
            this.$confirmApi.getReviewCommentInConfirmUsingPOST({
              "efileNo": this.currentAmlId,
              "memoType": "4"
            })
            .then(resp => {
              const getData = resp.data.data;
              this.setMemoDesc(getData.memoDesc);
            })
        }      

      }
    })

  }

// 偵測是否變更用 (computed 監聽)
  get dataChange() {
    return {
      "amlReportData": this.amlReportData, //疑似洗錢或資恐交易態樣[檢核每個【是否符合】欄位不為空值]
      "announceInd": this.customerdata.announceInd, //是否進行可疑交易通報
      "fnOccuData": {  // 財務與職業資訊
        "applAnnualIncome": this.guarantorAnnualIncome_b, //要保人家庭年收入
        "applFamilyIncome": this.insuredAnnualIncome_b, //被保險人家庭年收入
        "debt": this.debitUsed, //借款用途,
        "fundSrc": this.financialSourceB, //資金來源
        "fundSrcDesc": this.financialSourceBOther, //資金來源-其他:補充說明
        "insFamilyIncome": this.personalProperty_b, //動產(含存款/股票/基金)
        "loanUseDesc": this.debitUsedOther, //借款用途-其他:補充說明
        "movableProperty": this.realProperty_b, //不動產
        "realEstate": this.debt_b, //負債
        "repayFundSrc": this.debitSource, //還款資金來源
        "repayFundSrcDesc": this.debitSourceOther //還款資金來源-其他:補充說明
      },
      "others": this.toFormData.others,  //疑似洗錢交易態樣:其他(只送自行選擇之選項)
      "policies": this.customerdata.policyData, //已繳總保費[保費數值不能小於0]
      "reportData": this.toFormData.reportData, //疑似洗錢或資恐交易態樣(可複選)
      "reviewComment": this.getMemoDesc, //審覆核意見[必填]
      // "verifyMethodAg": "string",
      // "verifyMethodFn": "string",
      // "verifyMethodOw": "string",
      // "verifyMethodTel": "string",
      // "verifyMethodVs": "string"
    }
  }

/**
 * Event
 */
  // 標頭 展開收合按鈕
  onClick(block) {
    this.isHidden[block] = !this.isHidden[block];
  }

  // 『 預覽審查表 』 
  onPreview() {
    this.setLoading(true);
    const amlID = sessionStorage["review_assignment_page"];

    this.$searchAMLReviewDataApi
      .exportPreviewReportInSearchUsingGET(amlID, {responseType: "blob"})
      .then(resp => {
        console.log(resp)
        const URL = window.URL || window.webkitURL;
        const url = URL.createObjectURL(resp.data);
        window.open(url,`${amlID}_pdf_preview`);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 『 離開 』 
  async onLeave(isSave) {
    this.$emit("close");
    window.close();
    this.leaveAndSaveVisible = false;
  }

/**
 * Hook
 */
  async created() {
    this.isReviewValidate = true;
    this.currentAmlId = sessionStorage["review_assignment_page"];

    // 取得審查歷程& 審查說明紀錄
    this.getCommentHistory();
  }

  mounted() {
    this.leaveVisible = false;
  }

/**
 * 驗證
 */
  rules: { [key: string]: ValidationRule[] } = {
    operType: [
      {
        required: true,
        message: "請選擇作業別",
        trigger: "change",
      },
    ],
  };
  validateReviewFields() {
    (this.$refs.reviewFields as any)
      .validateForm()
      .then((valid) => {
        this.isReviewValidate = valid;
      })
      .catch((valid) => {
        this.isReviewValidate = valid;
      });
  }

/**
 * 監聽
 */
  // 審查意見/覆核意見 計算字數
   @Watch('getMemoDesc', { immediate: true, deep: true })
  private watchGetMemoDesc(newVal) {
    this.textareaWordCount = this.getStringCount(newVal);
    if(this.textareaWordCount > this.textareaWordCountMax){
      this.textareaWordCountError = true;
    }else{
      this.textareaWordCountError = false;
    }
    if(newVal !== ''){
      this.error.opinionTextError = '';
    }
  }
  @Watch('notifyRequired')
  private watchNotifyRequired(newVal) {
    this.customerdata.amlInd = newVal;
  }
  // 監聽資料變更
  @Watch('dataChange', {deep: true})
  private watchDataChange(newVal) {
    // 第一次偵測到的變更為 資料載入 先放過，
    // 載入完後偵測的變更 才是真的變更
    if(this.isCustomerUpdate && this.isFinanceJobinfoUpdate && this.isSuspectUpdate) {
      if(this.isDataChange == undefined){
        this.isDataChange = false;
      }else if(this.isDataChange == false){
        this.isDataChange = true;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.reviewBottom__group {
  .ant-form-item {
    margin-bottom: 0;
  }
  .announceInd__group {
    padding: 8px;
  }
  .reviewBottom__btns {
    margin-top: 0;
    padding: 6px;
    background: white;
  }
}
.reviewBottom__title {
  font-size: 16px;
  color: black;
  font-weight: 600;
}

.toggle__btn {
  border: 2px #0090FF solid;
  background: #E6F7FF;
  padding: 0px;
  height: 22px;
  line-height: 0px;
  color: #0090FF;
  font-weight: bold;
  width: 22px;
  text-align: center;
}

.reviewBottom__titleBlock {
  margin-top: 5px;
  margin-bottom: 5px;
}
.reviewProcess__title {
  font-size: 16px;
  margin-left: 10px;
}

.reviewProcess__textarea {
  resize: none;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  border: 1px solid #c7c7c7;
  border-radius: 2px;
  margin-top: 12px;
  margin-bottom: 0;
  &[readonly] {
    background: #EEE;
  }
}
.has-error {
  .reviewProcess__textarea {
    border-color: #f5222d;
  }
}

.btn {
  width: 140px;
  height: 32px;
  font-size: 16px;
  border-radius: 2px;
  background: #13C2C2;
  color: white;
}

.textareaWordCountError {
  color: #ff4d4f;
}

.suggestion_block {
  margin-top: 10px;
  margin-bottom: 0;
}

.msgGroup {
  margin-top: 20px;
  list-style-type: disc;
  margin-left: 1em;
}
</style>
