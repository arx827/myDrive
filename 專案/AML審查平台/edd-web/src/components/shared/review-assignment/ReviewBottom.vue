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
          <a-textarea class="reviewProcess__textarea" ref="test" v-model="memoDesc" :auto-size="{ maxRows: 8 }" :maxLength="textareaWordCountMax"/>
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
          @change="onCheckChange"
          :disabled="isConfirm"
        ><span style="color: black">無需進行可疑交易通報</span></a-checkbox>
        <a-checkbox
          value="1"
          :checked="customerdata.announceInd != null ? customerdata.announceInd == 'Y' : false"
          @change="onCheckChange"
          :disabled="isConfirm"
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
      <a-col v-if="getDeptSectionConfig.ReviewBottom.isConfirmMergeCaseBtnShow">
        <a-button class="btn submitButton" @click="onMergeCase">併件確認</a-button>
      </a-col>
      <a-col>
        <a-button class="btn submitButton" @click="onPreview">預覽審查表</a-button>
      </a-col>
      <a-col>
        <a-popconfirm
          :title="this.$createElement( 'div', {attrs: { class: 'popconfirm__txtStyle'}} ,[
            this.$createElement( 'p', { attrs: { class: 'popconfirm__title' }}, '您確定要進行資料更新?'),
            this.$createElement( 'small', { attrs: { class: 'popconfirm__sub' }}, '更新資料需要一點時間，系統會關閉明細頁，導回結果清單頁!')
          ])"
          ok-text="確定"
          cancel-text="取消"
          ok-type="green"
          icon=" "
          @confirm="onUpdateData"
          v-if="!isConfirm"
        >
          <a-button class="btn submitButton">更新資料</a-button>
        </a-popconfirm>
        <a-popconfirm
          :title="this.$createElement( 'div', {attrs: { class: 'popconfirm__txtStyle'}} ,[
            this.$createElement( 'p', { attrs: { class: 'popconfirm__title' }}, '是否要退回重審?')
          ])"
          ok-text="確定"
          cancel-text="取消"
          ok-type="green"
          icon=" "
          @confirm="onReject"
          v-else
        >
          <a-button class="btn submitButton">退回重審</a-button>
        </a-popconfirm>
      </a-col>
      <a-col>
        <a-button class="btn submitButton" @click="onSave">儲存</a-button>
      </a-col>
      <a-col>
        <a-popconfirm
          :title="this.$createElement( 'div', {attrs: { class: 'popconfirm__txtStyle'}} ,[
            this.$createElement( 'p', { attrs: { class: 'popconfirm__title' }}, '審查資料尚未儲存，請確認是否需儲存?')
          ])"
          ok-text="儲存"
          cancel-text="不儲存"
          ok-type="green"
          icon=" "
          :visible="leaveAndSaveVisible"
          @confirm="onLeave('AndSave')"
          @cancel="onLeave()"
        >
          <a-popconfirm
            :title="this.$createElement( 'div', {attrs: { class: 'popconfirm__txtStyle'}} ,[
              this.$createElement( 'p', { attrs: { class: 'popconfirm__title' }}, '是否要離開?')
            ])"
            ok-text="確定"
            cancel-text="取消"
            ok-type="green"
            icon=" "
            @confirm="onLeavehandleVisible"
          >
            <a-button class="btn submitButton">離開</a-button>
          </a-popconfirm>
        </a-popconfirm>
      </a-col>
      <a-col>
        <a-popconfirm
          :title="this.$createElement( 'div', {attrs: { class: 'popconfirm__txtStyle'}} ,[
            this.$createElement( 'p', { attrs: { class: 'popconfirm__title' }}, '是否要送覆核?')
          ])"
          ok-text="確定"
          cancel-text="取消"
          ok-type="green"
          icon=" "
          @confirm="onSubmit"
          v-if="!isConfirm"
        >
          <a-button class="btn submitButton">送覆核</a-button>
        </a-popconfirm>
        <a-popconfirm
          :title="this.$createElement( 'div', {attrs: { class: 'popconfirm__txtStyle'}} ,[
            this.$createElement( 'p', { attrs: { class: 'popconfirm__title' }}, '是否要覆核?')
          ])"
          ok-text="確定"
          cancel-text="取消"
          ok-type="green"
          icon=" "
          @confirm="onConfirmSubmit"
          v-else
        >
          <a-button class="btn submitButton">覆核確認</a-button>
        </a-popconfirm>
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
export default class ReviewBottom extends Vue {
  @Prop()
  mergeAmlData: any;

  @Getter public isConfirm!: boolean;
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
  

  // 是否為『A-大額還款交易』，若無，［9A 有辦理「保單還款（50萬以上）」資金來源/財務狀況問項］灰階不能填寫
  // @FinanceJobInfo.Getter hasCaseAType;
  // 是否為『9-短期密集借/還款交易』，若無，［9B 有辦理「短期密集借還款」資金來源/用途問項］灰階不能填寫
  // @FinanceJobInfo.Getter hasCaseNineType;

  //客戶資料
  @CustomerData.State customerdata;
  @CustomerData.State toFormData;
  @CustomerData.State selectedCheck;
  @CustomerData.State isCustomerUpdate;

  // 疑似洗錢態樣
  @SuspectLaundering.State amlReportData!:[];
  @SuspectLaundering.State verCode;
  @SuspectLaundering.State isSuspectUpdate;

  // 取得當前部門顯示規則設定
  @Getter public getDeptSectionConfig;

  notifyRequired: boolean = null;
  // opinionText: string = "";
  // historyText: string = "109/11/01 10:30 韓OO\n1.	保單說明: \n(1)	保單號碼 1020724490-0 投保安泰喬壽還本終身壽險（繳費十年）10LS2D，投保至今已逾10年。名單客戶韓坤儒為該 保單之法定代理人與被保險人韓易洋關係為父子，與要保人韓易洋關係為父子。\n2.	名單比中說明:\n(1) 名單客戶韓坤儒比對名單為金控自建名單，風險評級為高。\n3.	本次交易說明：為依條款約定給付保單借款，給付金額3,000,000元，給付方式匯款予名單客戶韓坤儒。\n4.	客戶財務與職業資訊說明:\n(1) 名單客戶韓坤儒\n(a) 依保單號碼F 102072310-0要保文件告知職業為內勤。\n(b) 依保單號碼F 102072310-0要保文件告知個人年收入150萬，家庭年入200萬，動產400萬，不動產1800萬，負債200萬。\n5.	綜上，因評估無其他異常交易或疑似洗錢之徵兆，無須進行疑似洗錢通報。\n6.	惟對於該客戶所為各項交易會持續追蹤與監控後續交易，如有發現其他疑似洗錢特徵，將依「洗錢防制法」、「金融機構防制洗錢辦法」等規定辦理通報。\n\n109/11/12 16:30 陳OO\n退回重審:佐證資料不足，請再確認。";
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
  // 更新SoftLock
  updateSoftLock(key) {
    this.$reviewApi.updateSoftLockInReviewUsingPOST({
      "efileNo": sessionStorage["review_assignment_page"],
      "softLock": key
    })
    .then(resp => {
      if(resp.data.data == 1) {
        console.log(`${key}-${resp.data.data}`)
      }else{
        let $case = '';
        switch(key){
          case 'Y':
            $case = '人員取件失敗';
            break;
          case 'N':
            $case = '案件釋放失敗';
            break;
        }
        if($case) {
          Modal.error({
            title: $case,
            okType: 'green',
            okText: "確定",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
              }),
            onOk: async () => {
              this.$emit("close");
              window.close();
            },
          });
        }
      }
    })
    .catch(() => {
      let $case = '';
      switch(key){
        case 'Y':
          $case = '人員取件失敗';
          break;
        case 'N':
          $case = '案件釋放失敗';
          break;
      }
      if($case) {
        Modal.error({
          title: $case,
          okType: 'green',
          okText: "確定",
          icon: () =>
            this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
            }),
          onOk: async () => {
            this.$emit("close");
            window.close();
          },
        });
      }
    })
  }
  // checkError() {
  //   let isError = false;
  //   if(this.getMemoDesc == ''){
  //     this.error.opinionTextError = `${(this.isConfirm) ? '覆核意見' : '審查意見'} 不得為空`;
  //     isError = true;
  //   }
  //   return isError
  // }
  get memoDesc() {
    return this.getMemoDesc;
  }
  set memoDesc(value) {
    this.setMemoDesc(value);
  }

  // 取得審查歷程
  getCommentHistory() {
    if(!this.isConfirm){
      // 待審查
      this.$reviewApi
      .getCommentHistoryInReviewUsingGET(this.currentAmlId)
      .then(resp => {
        if(resp.data.success === true) {
          const getData = resp.data.data;
          this.historyText = getData.memoDesc;
        }
      })
    }else{
      // 待覆核
      this.$confirmApi
      .getCommentHistoryInConfirmUsingGET(this.currentAmlId)
      .then(resp => {
        if(resp.data.success === true) {
          const getData = resp.data.data;
          this.historyText = getData.memoDesc;
        }
      })
    }
  }
  // 取得審查說明紀錄
  getReviewComment() {
    if(!this.isConfirm){
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
      "verifyMethodAg": this.customerdata.verifyMethodAg,
      "verifyMethodOw": this.customerdata.verifyMethodOw,
      "verifyMethodTel": this.customerdata.verifyMethodTel,
      "verifyMethodVs": this.customerdata.verifyMethodVs
    }
  }




/**
 * Event
 */
  // 標頭 展開收合按鈕
  onClick(block) {
    this.isHidden[block] = !this.isHidden[block];
  }

  // 可疑交易通報 checkBox onChange
  onCheckChange(e) {
    if ( (e.target.value === "1" && this.customerdata.announceInd == 'Y') || (e.target.value === "2" && this.customerdata.announceInd == 'N') ) {
      this.customerdata.announceInd = null;
    } else if (e.target.value === "1") {
      this.customerdata.announceInd = 'Y';
    } else if (e.target.value === "2") {
      this.customerdata.announceInd = 'N';
    }
  }

  // 『 預覽審查表 』 (待審查 / 待覆核)
  onPreview() {
    this.setLoading(true);
    const amlID = sessionStorage["review_assignment_page"];
    if(!this.isConfirm) {
      this.$reviewApi
      .exportPreviewReportInReviewUsingGET(amlID, {responseType: "blob"})
      .then(resp => {
        console.log(resp)
        const URL = window.URL || window.webkitURL;
        const url = URL.createObjectURL(resp.data);
        window.open(url,`${amlID}_pdf_preview`);
      })
      .finally(() => {
        this.setLoading(false);
      });
    }else{
      this.$confirmApi
      .exportPreviewReportInConfirmUsingGET(amlID, {responseType: "blob"})
      .then(resp => {
        const URL = window.URL || window.webkitURL;
        const url = URL.createObjectURL(resp.data);
        window.open(url,`${amlID}_pdf_preview`);
      })
      .finally(() => {
        this.setLoading(false);
      });
    }
  }

  // 『 更新資料 』 (待審查)
  async onUpdateData() {
    // 更新頁籤「客戶資料」(包含點選併件與匯入資料之案件)、「交易記錄」、「財務與職業資訊」與「態樣來源」
    // if (this.notifyRequired == null) {
    //   alert("Error!");
    // }

    // 更新主查詢頁資料
    localStorage['currentGridData'] = JSON.stringify({
      table: "grid",
      efileNo: this.currentAmlId,
      type: 'U'
    });
    localStorage.removeItem('currentGridData');     // 主頁 addEventListener 已接收，所以可以移除了

    window.opener.postMessage(this.mergeAmlData, window.location.origin);
    await this.onSave();
    await this.updateSoftLock('U');
    this.$emit("close");
    window.close();
  }

  // 『 儲存 』 (待審查 / 待覆核)
  async onSave() {
    this.setLoading(true);
    // 事件上傳
    const amlID = sessionStorage["review_assignment_page"];
    let data:SaveRequestDto = {
      "amlReportData": this.amlReportData, //疑似洗錢或資恐交易態樣[檢核每個【是否符合】欄位不為空值]
      "announceInd": this.customerdata.announceInd, //是否進行可疑交易通報
      "efileNo": amlID, //AML審查檔號
      "fnOccuData": {  //財務與職業資訊
        "applAnnualIncome": this.guarantorAnnualIncome_b, //要保人家庭年收入
        "applFamilyIncome": this.insuredAnnualIncome_b, //被保險人家庭年收入
        "debt": this.debitUsed || [], //借款用途,
        "efileNo": amlID || '', //審查檔號
        "fundSrc": this.financialSourceB || [], //資金來源
        "fundSrcDesc": this.financialSourceBOther || '', //資金來源-其他:補充說明
        "insFamilyIncome": this.personalProperty_b, //動產(含存款/股票/基金)
        "loanUseDesc": this.debitUsedOther || '', //借款用途-其他:補充說明
        "movableProperty": this.realProperty_b, //不動產
        "realEstate": this.debt_b, //負債
        "repayFundSrc": this.debitSource || [], //還款資金來源
        "repayFundSrcDesc": this.debitSourceOther || '' //還款資金來源-其他:補充說明
      },
      "verCode": this.verCode,  //疑似洗錢或資恐交易態樣 版本號
      "others": this.toFormData.others,  //疑似洗錢交易態樣:其他(只送自行選擇之選項)
      "policies": this.customerdata.policyData, //已繳總保費[保費數值不能小於0]
      "reportData": this.toFormData.reportData, //疑似洗錢或資恐交易態樣(可複選)
      "reviewComment": this.getMemoDesc, //審覆核意見[必填]
      "verifyMethodAg": this.customerdata.verifyMethodAg,
      "verifyMethodOw": this.customerdata.verifyMethodOw,
      "verifyMethodTel": this.customerdata.verifyMethodTel,
      "verifyMethodVs": this.customerdata.verifyMethodVs
    };
    let errMsg = [];
    let res:boolean;

    // (for 客利)
    let hasCaseAType = this.selectedCheck.includes('D');
    let hasCaseNineType = this.selectedCheck.includes('E');

    // 有 A-大額還款交易，保單還款（新台幣50萬元以上）(for 客利)
    if(!hasCaseAType) {
      // 無 A-大額還款交易，傳送 null 給後端
      const fnOccuData = ['applAnnualIncome', 'applFamilyIncome', 'insFamilyIncome', 'realEstate', 'movableProperty', 'fundSrc', 'fundSrcDesc'];
      fnOccuData.map(item => data.fnOccuData[item] = null);
    }

    // 有 9-短期密集借/還款交易，短期密集借還款 (for 客利)
    if(!hasCaseNineType) {
      // 無 9-短期密集借/還款交易，傳送 null 給後端
      const fnOccuData = ['debt', 'loanUseDesc', 'repayFundSrc', 'repayFundSrcDesc'];
      fnOccuData.map(item => data.fnOccuData[item] = null);
    }

    // 無 A-大額還款交易 & 9-短期密集借/還款交易 整份object 傳送 null
    if(!hasCaseAType && !hasCaseNineType) {
      data.fnOccuData = null
    }

    if(!this.isConfirm) {
      // console.log(data);
      await this.$reviewApi
      .saveForReviewInReviewUsingPOST(data)
      .then(resp => {
        if(resp.data.success === true) {
          const getData = resp.data.data;
          res = (getData == 1) ? true : false;
          Modal.error({
            okType: 'green',
            okText: '確定',
            icon: "''",
            centered: true,
            content:
              this.h("div", {attrs:{ class: 'wrap'}},[
                this.h("a-icon", {
                  props: {
                    type: (res) ? "check-circle" : "close-circle",
                    theme: "filled",
                  },
                  attrs: {
                    class: (res) ? "wrap__icon-success" : "wrap__icon-fail"
                  }
                }),
                this.h("div",{attrs:{ class: "wrap__text"}}, (res)? "儲存成功" : "儲存失敗"),
                this.h("i",{attrs: { class: (res)? "wrap__img-success" : "wrap__img-fail"}}),
              ])
          });
          if(res) {
            // init;
            this.isDataChange = false;
          }
        }else{
          res = false;
        }
      })
      .catch(err => {
        let errData = err.errors;
        errData.map(item => {
          switch(item) {
            case 'MTOTAL_ERROR':
              errMsg.push('客戶資料 - 已繳總保費不能<0');
              break;
            case 'FIN_VALUE_ERROR':
              errMsg.push('財務與職業資訊 - 您填入的財務狀況有部分欄位未填齊全或不得為<0!');
              break;
            case 'FUND_SRC_OR_FIN_SHOULD_NOT_EMPTY':
              errMsg.push('財務與職業資訊 - 資金來源與財務狀況兩個問項必須擇一填寫!');
              break;
            case 'FUND_SRC_DESC_SHOULD_NOT_EMPTY':
              errMsg.push('財務與職業資訊 - 資金來源若勾選 5.其他，但未輸入說明文字');
              break;
            case 'DEBT_OR_REPAY_FUND_SRC_SHOULD_NOT_EMPTY':
              errMsg.push('財務與職業資訊 - 借款用途與還款資金來源兩項都全空');
              break;
            case 'REPAY_FUND_SRC_DESC_SHOULD_NOT_EMPTY':
              errMsg.push('財務與職業資訊 - 還款資金來源若勾選 6.其他，但未輸入說明文字');
              break;
            case 'LOAN_USE_DESC_SHOULD_NOT_EMPTY':
              errMsg.push('財務與職業資訊 - 借款用途若勾選 6.其他，但未輸入說明文字');
              break;
            case 'SUSPECT_LAUNDER_ERROR':
              errMsg.push('疑似洗錢與資恐交易態樣 - 檢查必填');
              break;
            case 'REVIEW_COMMENT_ERROR':
              errMsg.push('審覆核意見 - 文字內不可以有 自行填寫 等四個字');
              break;
          }
        })
        Modal.error({
          okType: 'green',
          okText: '確定',
          centered: true,
          icon: "''",
          content:
          this.h("div", {}, [
            this.h("div", {attrs: { class: 'wrap'}},
              [
                this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
                attrs: {
                  class: "wrap__icon-fail"
                }
              }),
                this.h("div",{attrs: { class: "wrap__text"}}, "儲存失敗"),
                this.h("i",{attrs: { class: "wrap__img-fail"}})
              ]
            ),
            this.h('ul', {attrs: { class: "msgGroup list-with-border"}}, errMsg.map(x => this.h('li', x))),
          ])
        });
      })
      .finally(() => {
        this.setLoading(false);
      })
    }else{
      await this.$confirmApi
      .saveInConfirmUsingPOST(data)   //TODO: 改資料格式
      .then(resp => {
        if(resp.data.success === true) {
          const getData = resp.data.data;
          res = (getData == 1) ? true : false;
          if(res) {
            // init;
            this.isDataChange = false;
          }
        }else{
          res = false;
        }
      })
      .finally(() => {
        this.setLoading(false);
        Modal.error({
          okType: 'green',
          okText: '確定',
          icon: "''",
          centered: true,
          content:
          this.h("div", {attrs:{ class: 'wrap'}},
            [
              this.h("a-icon", {
              props: {
                type: (res) ? "check-circle" : "close-circle",
                theme: "filled",
              },
              attrs: {
                class: (res) ? "wrap__icon-success" : "wrap__icon-fail"
              }
            }),
              this.h("div",{attrs:{ class: "wrap__text"}}, (res)? "儲存成功" : "儲存失敗"),
              this.h("i",{attrs: { class: (res)? "wrap__img-success" : "wrap__img-fail"}}),
            ]
            )
        });
      })
    }
  }

  // 『 離開 』 (待審查 / 待覆核)
  async onLeave(isSave) {
    if(isSave == 'AndSave') {
      await this.onSave();
    }
    await this.updateSoftLock('N');
    this.$emit("close");
    window.close();
    this.leaveAndSaveVisible = false;
  }
  onLeavehandleVisible() {
    if(!this.isDataChange) {
      this.onLeave(undefined);
    }else{
      this.leaveAndSaveVisible = true;
    }
  }

  // 『 送覆核 』 (待審查)
  onSubmit() {
    // if (this.notifyRequired == null) {
    //   alert("Error!");
    // }
    const amlID = sessionStorage["review_assignment_page"];

    let data:SaveRequestDto = {
      "amlReportData": this.amlReportData, //疑似洗錢或資恐交易態樣[檢核每個【是否符合】欄位不為空值]
      "announceInd": this.customerdata.announceInd, //是否進行可疑交易通報
      "efileNo": amlID, //AML審查檔號
      "fnOccuData": {  //財務與職業資訊
        "applAnnualIncome": this.guarantorAnnualIncome_b, //要保人家庭年收入
        "applFamilyIncome": this.insuredAnnualIncome_b, //被保險人家庭年收入
        "debt": this.debitUsed || [], //借款用途,
        "efileNo": amlID || '', //審查檔號
        "fundSrc": this.financialSourceB || [], //資金來源
        "fundSrcDesc": this.financialSourceBOther || '', //資金來源-其他:補充說明
        "insFamilyIncome": this.personalProperty_b, //動產(含存款/股票/基金)
        "loanUseDesc": this.debitUsedOther || '', //借款用途-其他:補充說明
        "movableProperty": this.realProperty_b, //不動產
        "realEstate": this.debt_b, //負債
        "repayFundSrc": this.debitSource || [], //還款資金來源
        "repayFundSrcDesc": this.debitSourceOther || '' //還款資金來源-其他:補充說明
      },
      "verCode": this.verCode,  //疑似洗錢或資恐交易態樣 版本號
      "others": this.toFormData.others,  //疑似洗錢交易態樣:其他(只送自行選擇之選項)
      "policies": this.customerdata.policyData, //已繳總保費[保費數值不能小於0]
      "reportData": this.toFormData.reportData, //疑似洗錢或資恐交易態樣(可複選)
      "reviewComment": this.getMemoDesc, //審覆核意見[必填]
      "verifyMethodAg": this.customerdata.verifyMethodAg,
      "verifyMethodOw": this.customerdata.verifyMethodOw,
      "verifyMethodTel": this.customerdata.verifyMethodTel,
      "verifyMethodVs": this.customerdata.verifyMethodVs
    };
    // TEST:
    // console.log(data);
    // 資料檢核後送POST
    let errMsg = [];

    // (for 客利)
    let hasCaseAType = this.selectedCheck.includes('D');
    let hasCaseNineType = this.selectedCheck.includes('E');
  
    if (this.getMemoDesc.trim() == '') {
      errMsg.push("審查意見為必填");
    }else if(/自行填寫/.test(this.getMemoDesc)) {
      errMsg.push("審查結果區內有”自行填寫”文字，請確認審查結果填寫是否完整。");
    }
    if(data.amlReportData.some((item,index) => data.amlReportData[index].ansFlag === undefined)) {
      errMsg.push("疑似洗錢或資恐交易態樣 - 尚有項目未完成，請確認!");
    }
    if(data.policies.some((item,index) => data.policies[index].mtotal <= 0)) {
      errMsg.push("客戶資料 - 已繳總保費不可<0, 請確認!");
    }
    if(typeof data.announceInd !== 'string') {
      errMsg.push("請判斷並確認是否進行可疑交易通報");
    }
    // 有 A-大額還款交易，檢核 保單還款（新台幣50萬元以上）
    if(hasCaseAType) {
      const fnOccuData = ['applAnnualIncome', 'applFamilyIncome', 'insFamilyIncome', 'realEstate', 'movableProperty'];
      let fnOccuDataHasEmpty = fnOccuData.map(item => data.fnOccuData[item]).some(item => (item == undefined || item == null) || item.toString().trim() == '');
      let fnOccuDataHasAllEmpty = fnOccuData.map(item => data.fnOccuData[item]).every(item => (item == undefined || item == null) || item.toString().trim() == '');

      // 資金來源 & 財務狀況 皆未填寫
      if(data.fnOccuData.fundSrc.length <= 0 && fnOccuDataHasAllEmpty) {
        errMsg.push("「財務狀況與職業」之「保單還款（新台幣50萬元以上）」資金來源與財務狀況兩個問項必須擇一填寫!");
      }
      
      // 資金來源 檢核
      if(data.fnOccuData.fundSrc.length > 0) {
        // 填寫 資金來源
        if(data.fnOccuData.fundSrc.includes('5') && data.fnOccuData.fundSrcDesc === '') {
          // 資金來源 勾選 其他 但未填寫內容
          errMsg.push("「財務狀況與職業」之「保單還款（新台幣50萬元以上）」中[(1)資金來源] 選擇”其他”，必須填入說明文字，請確認!");
        }else if(!data.fnOccuData.fundSrc.includes('5')){
          // 未勾選 不存 說明文字
          data.fnOccuData.fundSrcDesc = '';
        }
      }
      
      // 財務狀況 檢核
      if(fnOccuDataHasEmpty && !fnOccuDataHasAllEmpty) {
        // 財務狀況 部分未填
        errMsg.push("「財務狀況與職業」之「保單還款（新台幣50萬元以上）」中[(2)財務狀況] 您填入的財務狀況有部分欄位未填齊全或不得為<0!");
      }
    }else{
      // 無 A-大額還款交易，傳送 null 給後端
      const fnOccuData = ['applAnnualIncome', 'applFamilyIncome', 'insFamilyIncome', 'realEstate', 'movableProperty', 'fundSrc', 'fundSrcDesc'];
      fnOccuData.map(item => data.fnOccuData[item] = null);
    }

    // 有 9-短期密集借/還款交易，檢核 短期密集借還款
    if(hasCaseNineType) {
      // 借款用途 & 還款資金來源 有一項 未填寫
      if(data.fnOccuData.debt.length <= 0 || data.fnOccuData.repayFundSrc.length <= 0) {
        errMsg.push("「財務狀況與職業」之「短期密集借還款」借款用途與還款資金來源兩個問項都必須填寫!");
      }
      if(data.fnOccuData.debt.includes('6') && data.fnOccuData.loanUseDesc === '') {
        errMsg.push("「財務狀況與職業」之「短期密集借還款」中[(1)借款用途] 選擇”其他” 必須填入說明文字，請確認!");
      }else if(!data.fnOccuData.debt.includes('6')){
        // 未勾選 不存 說明文字
        data.fnOccuData.loanUseDesc = '';
      }
      if(data.fnOccuData.repayFundSrc.includes('6') && data.fnOccuData.repayFundSrcDesc === '') {
        errMsg.push("「財務狀況與職業」之「短期密集借還款」中[(2)還款資金來源] 選擇”其他” 必須填入說明文字，請確認!");
      }else if(!data.fnOccuData.repayFundSrc.includes('6')){
        // 未勾選 不存 說明文字
        data.fnOccuData.repayFundSrcDesc = '';
      }
    }else{
      // 無 9-短期密集借/還款交易，傳送 null 給後端
      const fnOccuData = ['debt', 'loanUseDesc', 'repayFundSrc', 'repayFundSrcDesc'];
      fnOccuData.map(item => data.fnOccuData[item] = null);
    }

    // 無 A-大額還款交易 & 9-短期密集借/還款交易 整份object 傳送 null
    if(!hasCaseAType && !hasCaseNineType) {
      data.fnOccuData = null
    }

    if(data.verifyMethodAg !== 'Y' && data.verifyMethodOw !== 'Y' && data.verifyMethodTel !== 'Y' && data.verifyMethodVs !== 'Y') {
      errMsg.push('客戶驗證方式沒有勾選, 請確認! ');
    }

    if(errMsg.length <= 0){
      // 待確認: 成功與失敗訊息
      this.setLoading(true);
      this.$reviewApi.toConfirmInReviewUsingPOST(JSON.parse(JSON.stringify(data)))
      .then((resp) => {
        if(resp.data.success == true) {
          Modal.success({
            okType: 'green',
            okText: "確定",
            centered: true,
            icon: "''",
            content:
              this.h("div", {attrs:{ class: 'wrap'}},
                [
                  this.h("a-icon", {
                  props: {
                    type: "check-circle",
                    theme: "filled",
                  },
                  attrs: {
                    class: "wrap__icon-success"
                  }
                }),
                  this.h("div",{attrs:{ class: "wrap__text"}}, "送覆核成功"),
                  this.h("i",{attrs: { class: "wrap__img-success"}}),
                ]
            ),
            onOk: async () => {
              // 更新主查詢頁資料
              localStorage['currentGridData'] = JSON.stringify({
                table: "grid",
                efileNo: this.currentAmlId,
                type: 'D'
              });
              localStorage.removeItem('currentGridData');     // 主頁 addEventListener 已接收，所以可以移除了

              await window.opener.postMessage(this.mergeAmlData, window.location.origin);
              await this.updateSoftLock('N');
              this.$emit("close");
              window.close();
            }
          });
        }else{
          console.log('送覆核API success不是true');
        }
      })
      .catch((err) => {
        let errData = err.errors;
        if(errData.length > 0) {
          errData.map(item => {
            switch(item) {
              case 'MTOTAL_ERROR':
                errMsg.push('客戶資料 - 已繳總保費不能<0');
                break;
              case 'FIN_VALUE_ERROR':
                errMsg.push('財務與職業資訊 - 您填入的財務狀況有部分欄位未填齊全或不得為<0!');
                break;
              case 'FUND_SRC_OR_FIN_SHOULD_NOT_EMPTY':
                errMsg.push('財務與職業資訊 - 資金來源與財務狀況兩個問項必須擇一填寫!');
                break;
              case 'FUND_SRC_DESC_SHOULD_NOT_EMPTY':
                errMsg.push('財務與職業資訊 - 資金來源若勾選 5.其他，但未輸入說明文字');
                break;
              case 'DEBT_OR_REPAY_FUND_SRC_SHOULD_NOT_EMPTY':
                errMsg.push('財務與職業資訊 - 借款用途與還款資金來源兩項都全空');
                break;
              case 'REPAY_FUND_SRC_DESC_SHOULD_NOT_EMPTY':
                errMsg.push('財務與職業資訊 - 還款資金來源若勾選 6.其他，但未輸入說明文字');
                break;
              case 'LOAN_USE_DESC_SHOULD_NOT_EMPTY':
                errMsg.push('財務與職業資訊 - 借款用途若勾選 6.其他，但未輸入說明文字');
                break;
              case 'SUSPECT_LAUNDER_ERROR':
                errMsg.push('疑似洗錢與資恐交易態樣 - 檢查必填');
                break;
              case 'REVIEW_COMMENT_ERROR':
                errMsg.push('審覆核意見 - 文字內不可以有 自行填寫 等四個字');
                break;
            }
          })
        }
        Modal.error({
          okType: 'green',
          okText: '確定',
          centered: true,
          icon: "''",
          content:
          this.h("div", {}, [
            this.h("div", {attrs: { class: 'wrap'}},
              [
                this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
                attrs: {
                  class: "wrap__icon-fail"
                }
              }),
                this.h("div",{attrs: { class: "wrap__text"}}, "送覆核失敗"),
                this.h("i",{attrs: { class: "wrap__img-fail"}})
              ]
            ),
            this.h('ul', {attrs: { class: "msgGroup list-with-border"}}, errMsg.map(x => this.h('li', x))),
          ])
        });
      })
      .finally(() => {
        this.setLoading(false);
      })
    }else{
      Modal.error({
        okType: 'green',
        okText: '確定',
        centered: true,
        icon: "''",
        content:
        this.h("div", {}, [
          this.h("div", {attrs: { class: 'wrap'}},
            [
              this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
              attrs: {
                class: "wrap__icon-fail"
              }
            }),
              this.h("div",{attrs: { class: "wrap__text"}}, "送覆核失敗"),
              this.h("i",{attrs: { class: "wrap__img-fail"}})
            ]
          ),
          this.h('ul', {attrs: { class: "msgGroup list-with-border"}}, errMsg.map(x => this.h('li', x))),
        ])
      });
    }
  }

  callToMergeApi() {
    this.setLoading(true);
    const efileNo = sessionStorage["review_assignment_page"];
    this.$reviewApi.toMergeUsingPOST({
      efileNo: efileNo,
      mergingEfileNos: this.mergeAmlData
    }).then(async (resp) => {
      if (resp.data.data.errorCode == null) {
          Modal.success({
            title: "併件成功",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "check-circle",
                  theme: "filled",
                },
              }),
            class: "modal__custom",
            okText: "確定",
            okType: "okButton",
            onOk: () => {
              window.opener.postMessage(this.mergeAmlData, window.location.origin);
              this.$emit("close");
              window.close();
            },
          });
        } else if (resp.data.data.errorCode !== "") {
          Modal.error({
            title: "併件失敗",
            content: `${resp.data.data.message}`,
            icon: () => this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
            }),
            class: "modal__custom",
            okText: "確定",
            okType: "okButton",
            onOk: () => {},
          });
        }
    }).catch((err) => {
      let xhrResponse = err.response;
      let apiError = xhrResponse === undefined ? err.data : xhrResponse.data;
      console.log(apiError);
      Modal.error({
        title: "併件失敗",
        content: `${apiError.apiErrorCode}`,
        icon: () => this.h("a-icon", {
          props: {
            type: "close-circle",
            theme: "filled",
          },
        }),
        class: "modal__custom",
        okText: "確定",
        okType: "okButton",
        onOk: () => {},
      });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // // 按鈕_併件確認
  onMergeCase() {
    if (this.mergeAmlData.length === 0) {
      alert("未選擇併件案號。");
      return;
    }
    Modal.confirm({
      title: "是否要併件?",
      content: "更新資料需要一點時間，系統會關閉明細頁，導回結果清單頁!",
      okText: "確定",
      cancelText: "取消",
      onOk: () => {
        this.callToMergeApi(); 
      },
      onCancel: () => {},
    });
  }

  // 按鈕_覆核確認 (待覆核)
  onConfirmSubmit() {
    const amlID = sessionStorage["review_assignment_page"];
    let data: SaveRequestDto = {
      "amlReportData": this.amlReportData, //疑似洗錢或資恐交易態樣[檢核每個【是否符合】欄位不為空值]
      "announceInd": this.customerdata.announceInd, //是否進行可疑交易通報
      "efileNo": amlID, // AML審查檔號
      "fnOccuData": {  // 財務與職業資訊
        "applAnnualIncome": this.guarantorAnnualIncome_b, //要保人家庭年收入
        "applFamilyIncome": this.insuredAnnualIncome_b, //被保險人家庭年收入
        "debt": this.debitUsed, //借款用途,
        "efileNo": amlID, //審查檔號
        "fundSrc": this.financialSourceB, //資金來源
        "fundSrcDesc": this.financialSourceBOther, //資金來源-其他:補充說明
        "insFamilyIncome": this.personalProperty_b, //動產(含存款/股票/基金)
        "loanUseDesc": this.debitUsedOther, //借款用途-其他:補充說明
        "movableProperty": this.realProperty_b, //不動產
        "realEstate": this.debt_b, //負債
        "repayFundSrc": this.debitSource, //還款資金來源
        "repayFundSrcDesc": this.debitSourceOther //還款資金來源-其他:補充說明
      },
      "verCode": this.verCode,  //疑似洗錢或資恐交易態樣 版本號
      "others": this.toFormData.others,  //疑似洗錢交易態樣:其他(只送自行選擇之選項)
      "policies": this.customerdata.policyData, //已繳總保費[保費數值不能小於0]
      "reportData": this.toFormData.reportData, //疑似洗錢或資恐交易態樣(可複選)
      "reviewComment": this.getMemoDesc, //審覆核意見[必填]
    };

    let errMsg = [];
    if (this.getMemoDesc == '') {
      errMsg.push("覆核意見為必填");
    }else if(/自行填寫/.test(this.getMemoDesc)) {
      errMsg.push("覆核結果區內有”自行填寫”文字，請確認覆核結果填寫是否完整。");
    }

    if(errMsg.length <= 0){
      this.setLoading(true);
      this.$confirmApi.confirmOkUsingPOST(data).then( resp => { //TODO: 改資料格式
        if(resp.data.success == true) {
          Modal.success({
            title: '覆核成功',
            okType: 'green',
            okText: "確定",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "check-circle",
                  theme: "filled",
                },
              }),
            onOk: async () => {
              // 更新主查詢頁資料
              localStorage['currentGridData'] = JSON.stringify({
                table: "grid",
                efileNo: this.currentAmlId,
                type: 'D'
              });
              localStorage.removeItem('currentGridData');     // 主頁 addEventListener 已接收，所以可以移除了

              await this.updateSoftLock('N');
              this.$emit("close");
              window.close();
            }
          });
        }else{
          console.log('覆核確認API success不是false')
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
    }else{
      Modal.error({
        okType: 'green',
        okText: '確定',
        centered: true,
        icon: "''",
        content:
        this.h("div", {}, [
          this.h("div", {attrs: { class: 'wrap'}},
            [
              this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
              attrs: {
                class: "wrap__icon-fail"
              }
            }),
              this.h("div",{attrs: { class: "wrap__text"}}, "覆核失敗"),
              this.h("i",{attrs: { class: "wrap__img-fail"}})
            ]
          ),
          this.h('ul', {attrs: { class: "msgGroup list-with-border"}}, errMsg.map(x => this.h('li', x))),
        ])
      });
    }
  }

  // 按鈕_退回重審 (待覆核)
  async onReject() {
    const amlID = sessionStorage["review_assignment_page"];
    const reviewer = JSON.parse(sessionStorage["review_assignment_data"]).reviewer;

    let data:SaveRequestDto = {
      "amlReportData": this.amlReportData, //疑似洗錢或資恐交易態樣[檢核每個【是否符合】欄位不為空值]
      "announceInd": this.customerdata.announceInd, //是否進行可疑交易通報
      "efileNo": amlID, //AML審查檔號
      "fnOccuData": {  //財務與職業資訊
        "applAnnualIncome": this.guarantorAnnualIncome_b, //要保人家庭年收入
        "applFamilyIncome": this.insuredAnnualIncome_b, //被保險人家庭年收入
        "debt": this.debitUsed, //借款用途,
        "efileNo": amlID, //審查檔號
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
    };
    let errMsg = [];
    if (this.getMemoDesc.trim() == '') {
      errMsg.push("覆核意見為必填");
    }else if(/自行填寫/.test(this.getMemoDesc)) {
      errMsg.push("覆核結果區內有”自行填寫”文字，請確認覆核結果填寫是否完整。");
    }

    // 退回重審: 成功與失敗訊息
    if(errMsg.length <= 0){
      this.setLoading(true);
      this.$confirmApi.rejectInConfirmUsingPOST(data).then( async resp => {
        if(resp.data.success == true) {
          await this.updateSoftLock('N');
          Modal.success({
            title: `已成功退回審核人員${resp.data.data.contMan.name}(此審查件審查人員重新審查)`,
            okType: 'green',
            okText: "確定",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "check-circle",
                  theme: "filled",
                },
              }),
            onOk: () => {
              // 更新主查詢頁資料
              localStorage['currentGridData'] = JSON.stringify({
                table: "grid",
                efileNo: this.currentAmlId,
                type: 'D'
              });
              localStorage.removeItem('currentGridData');     // 主頁 addEventListener 已接收，所以可以移除了

              this.$emit("close");
              window.close();
            }
          });
        }else{
          Modal.error({
            title: '退回重審失敗，請重新操作',
            okType: 'green',
            okText: '確定',
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
              }),
          });
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
    }else{
      Modal.error({
        okType: 'green',
        okText: '確定',
        centered: true,
        icon: "''",
        content:
        this.h("div", {}, [
          this.h("div", {attrs: { class: 'wrap'}},
            [
              this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
              attrs: {
                class: "wrap__icon-fail"
              }
            }),
              this.h("div",{attrs: { class: "wrap__text"}}, "退回重審失敗"),
              this.h("i",{attrs: { class: "wrap__img-fail"}})
            ]
          ),
          this.h('ul', {attrs: { class: "msgGroup list-with-border"}}, errMsg.map(x => this.h('li', x))),
        ])
      });
    }
  }

/**
 * Hook
 */
  async created() {
    this.isReviewValidate = true;
    this.currentAmlId = sessionStorage["review_assignment_page"];

    // 取得審查歷程
    this.getCommentHistory();
    // 取得審查說明紀錄
    this.getReviewComment();
    
    // this.unwatchPolicyDataProp = this.$watch('customerdata.announceInd', (newVal) => {
    //   // if (newVal) {
    //   //   this.notifyRequired = newVal;
    //   //   if(this.notifyRequired) {
    //   //     this.unwatchPolicyDataProp();
    //   //   }
    //   // }
    //   this.customerdata.announceInd = newVal;
    // });
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
