<template>
  <div class="customerData__page list__count-reset">
    <a-row class="spin__wrap" v-if="getCustomerDataPageLoading">
      <a-spin
        :spinning="getCustomerDataPageLoading"
        tip="資料處理中，請稍候..."
        :delay="200"
        class="spin"
      >
    </a-spin>
    </a-row>
    <!-- TODO: 趕時間，先改為客利資料，後續要做切換 -->
    <!-- 審查原因 -->
    <section class="page__section">
      <a-row type="flex">
        <h4 class="section__title">審查原因：</h4>
      </a-row>
      <a-row>
        <a-checkbox v-model="customerdata.riskInd" :disabled="true">風險評級為高風險</a-checkbox>
      </a-row>
      <a-row type="flex">
        <a-col>
          <a-checkbox :checked="selectedCheck.length > 0" :disabled="true">疑似洗錢或資恐交易態樣(可複選): </a-checkbox>
        </a-col>
        <a-col flex="1">
          <a-checkbox-group v-model="selectedCheck" style="width: 100%;">
            <a-row type="flex">
              <template v-for="(item, index) in reviewReasonSuspectedOpts">
                <template v-if="item.value !== '其他'">
                  <a-checkbox :value="item.key" :disabled="true || reviewReasonSuspectedDefault.includes(item.key)" :key="index">{{item.key}}. {{item.value}}</a-checkbox>
                </template>
              </template>
            </a-row>

            <!-- 處理其他項目 -->
            <template v-for="(item, index) in reviewReasonSuspectedOpts">
              <a-row type="flex" style="margin-top: 10px;" v-if="item.value == '其他'" :key="index">
                <a-col>
                  <!-- <a-checkbox value="F" :disabled="true">F. 其他: <span class="borderBottom">{{DefaultReviewReasonOtherOption}}</span></a-checkbox> -->
                  <a-checkbox value="F" style="display: none"></a-checkbox>
                  <label style="margin: 0 4px; padding-right: 8px;">F. 其他: <span class="borderBottom">{{reviewReasonOtherDefaultString}}</span></label>
                </a-col>
                <a-col flex="1"> 
                  <a-select
                    mode="multiple"
                    v-model="selectedOthers"
                    style="width: 500px;"
                    :showArrow="true"
                    placeholder="請選擇"
                    :allowClear="true"
                    :notFoundContent="false"
                    :disabled="true"
                  >
                    <a-select-option v-for="item in filteredReviewReasonOtherOption" :key="item.key" :value="item.value">
                      {{item.value}}
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </template>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </section>

    <!-- 本次交易之保單資料 -->
    <section class="page__section">
      <a-row type="flex">
        <h4 class="section__title">本次交易之保單資料：</h4>
      </a-row>
      <fbl-data-grid
        class="fbl-table"
        :rowKey="( record, index ) => { return index }"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template v-slot:totalPaidInsuranceFeeInput="slotProps">
          <a-input-number
            v-model="slotProps.data.mtotal"
            :disabled="true"
            style="width: 150px"
            :min="0"
            placeholder="請輸入金額(NTD)"
            >
          </a-input-number>
        </template>
        <template v-slot:template="slotProps">
          <span style="white-space: pre-line;">
            {{ slotProps.data.caseType }}
          </span>
        </template>
      </fbl-data-grid>
    </section>

    <!-- 風險評級 -->
    <section class="page__section">
      <a-row type="flex">
        <h4 class="section__title">風險評級：</h4>
        <a-col flex="1">
          <div>{{ riskLevel }}</div>
        </a-col>
      </a-row>
    </section>
    
    <!-- 名單比對結果 -->
    <section class="page__section">
      <a-row type="flex">
        <h4 class="section__title">名單比對結果：</h4>
        <a-col flex="1">
          <p v-for="(item, index) in match_result" :key="index" class="list__count-item">{{item.name}}：{{item.type}}</p>
        </a-col>
      </a-row>
      <div class="precautions" v-if="matchResultMessage">
        <a-row class="precautions__header" type="flex" align="middle">
          <a-icon type="warning" theme="filled" />
          <span class="precautions__headerTitle">提醒審查重點：</span>
        </a-row>
        <ol class="precautions__listGroup">
          <li class="precautions__list__item" v-for="(item,index) in matchResultMessageTxtGroup" :key="index">{{item}}</li>
        </ol>
      </div>
    </section>

    <!-- 是否有需執行客戶驗證的項目 只有保福有 先隱藏-->
    <section class="page__section">
      <a-row type="flex">
        <a-col><h4 class="section__title">是否有需執行客戶驗證的項目：</h4></a-col>
        <a-col><span>{{ need_to_be_verified_by_the_clientData }}</span></a-col>
      </a-row>
    </section>

    <!-- 本次已執行驗證的方式為 只有保福有 先隱藏-->
    <section class="page__section">
      <a-row type="flex">
        <a-col><h4 class="section__title">本次已執行驗證的方式為：<span class="mark-required">*</span></h4></a-col>
        <a-col flex="1" :class="{'has-error': isError}">
          <a-checkbox-group v-model="ways_to_perform_verificationDataCheck" style="width: 100%;" @change="onChange">
            <a-row type="flex">
              <a-checkbox
                v-for="item in ways_to_perform_verificationData.options"
                :disabled="isConfirm"
                :key="item.key"
                :value="item.key">
                  {{item.value}}
              </a-checkbox>
            </a-row>
            <span class="error__message">此為必填欄位</span>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </section>

    <!-- 近三個月AML審查紀錄 -->
    <section class="page__section">
      <a-row type="flex">
        <!-- TODO: API: 要保人姓名 -->
        <h4 class="section__title"><span class="borderBottom people" v-if="historyDataApplFname">{{historyDataApplFname}}</span><span>AML審查紀錄</span><small>(近三個月)</small></h4>
      </a-row>
      <fbl-data-grid
        class="fbl-table"
        :rowKey="searchGrid.rowKey"
        :columns="searchGrid.columns"
        :data="searchGrid.data"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template v-slot:file="slotProps">
          <a @click="downloadFile(slotProps.data)" v-if="slotProps.data.imgIdxId && slotProps.data.reportName">{{slotProps.data.reportName}}</a>
        </template>
      </fbl-data-grid>
    </section>
    <!-- TODO: 點擊「送覆核」時的檢核 -->
    <!-- TEST: -->
    <!-- <a-button @click="check">Test Validation</a-button> -->
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import { Vue, Component} from "vue-property-decorator";
import { Prop, Watch } from "vue-property-decorator";
import moment from "moment";

import {
  Getter,
  Action,
  namespace } from 'vuex-class';
import { createHelpers } from 'vuex-map-fields';
import {
  PolicyVO, HistoryMainVO
} from "@fubonlife/edd-api-axios-sdk";
const { mapFields } = createHelpers({
  getterType: 'CustomerData/getField',
  mutationType: 'CustomerData/updateField',
});
import { Modal } from "ant-design-vue";
const CustomerData = namespace('CustomerData');

import Global from "@/plugins/global";

@Component({
  components: { FblDataGrid },
  computed: {
    ...mapFields([
    'customerdata',
    'selectedCheck',
    'selectedOthers',
    // 'ways_to_perform_verificationDataCheck'
    ])
  }

})
export default class CustomerDataPage extends Vue {

  @Action('setMemoDesc') setMemoDesc;
  @Action public setLoading: (payload: boolean) => void;
  customerDataPageLoading: boolean = false;

  @Action public reflashPage: (payload: {page: string, val: boolean}) => void;

  @CustomerData.Getter getCustomerDataPageLoading;
  @CustomerData.Action('setCustomerDataPageLoading') setCustomerDataPageLoading;


  // 審查原因 選項
  @CustomerData.Getter reviewReasonSuspectedOpts;
  // 審查原因 系統帶入的選項
  @CustomerData.Getter reviewReasonSuspectedDefault;
  @CustomerData.Action("updateSuspectedform") updateSuspectedform

  // 審查原因 其他選項 選項
  //@CustomerData.Getter reviewReasonOtherOption;
  // 審查原因 系統帶入的選項 轉文字顯示
  @CustomerData.Getter reviewReasonOtherDefaultString;
  // 審查原因 其他選項 排除系統預設&已選取的選項
  @CustomerData.Getter filteredReviewReasonOtherOption;
  @CustomerData.Action("updateSuspectedotherform") updateSuspectedotherform

  // 風險評級
  @CustomerData.Getter riskLevel;
  // 名單比對結果
  @CustomerData.Getter match_result;

  // 本次交易之保單資料
  @CustomerData.Getter getPolicyData;
  @CustomerData.Action("updatePolicydata") updatePolicydata
  
  // AML審查紀錄 要保人姓名
  @CustomerData.Getter historyDataApplFname;
  @CustomerData.Getter gethistoryData;


//----------------- 2. 本次交易之保單資料 -----------------//
  public grid: FblPDataGridHolder<PolicyVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
        sorter: (a, b) => a.system.localeCompare(b.system),
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}`;
        },
        sorter: (a, b) => a.policyNo.localeCompare(b.policyNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "effDate", 
        title: "契約始期",
        fixed: "left",
        sorter: (a, b) =>
          moment(a.effDate).unix() - moment(b.effDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "applName",
        title: "要保人姓名",
        fixed: "left",
        sorter: (a, b) => a.applName.localeCompare(b.applName),
      },
      {
        type: FblColumnType.PLAIN,
        property: "item",
        title: "險種",
        sorter: (a, b) => a.item.localeCompare(b.item),
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "mtotal",
        title: "已繳總保費",
        template: "totalPaidInsuranceFeeInput",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseNo",
        title: "交易案號",
        sorter: (a, b) => a.caseNo.localeCompare(b.caseNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmt",
        title: "本次交易金額",
        formatter: (data) => {
          let parts = data.caseAmt.toString().split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return "NTD$" + parts.join('.');
        },
        sorter: (a, b) => a.caseAmt.localeCompare(b.caseAmt),
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "caseType",
        title: "本次交易項目",
        template: "template",
        sorter: (a, b) => a.caseType.localeCompare(b.caseType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "methodDesc",
        title: "給付方式",
        sorter: (a, b) => a.methodDesc.localeCompare(b.methodDesc),
      },
      {
        type: FblColumnType.PLAIN,
        property: "scanType",
        title: "本次掃描類別",
        sorter: (a, b) => a.scanType.localeCompare(b.scanType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "scanDate",
        title: "掃描日期",
        sorter: (a, b) => moment(a.scanDate).unix() - moment(b.scanDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "riskDate",
        title: "名單確認時間",
        sorter: (a, b) => a.riskDate.localeCompare(b.riskDate),
      },
    ],
  };

//----------------- 4. 名單比對結果 -----------------//
  // 提醒文字 (客利)
  matchResultMessageTxtGroup = [
    '確認要保人、被保險人、關係人等有無負面新聞。',
    '確認交易時間點、犯罪時間點、負面新聞被揭露時間點…等各時間點是否有關聯，有否隱匿不法資金(如還款資金來源有無合理說明)。',
    '確認資金來源與其身分、收入是否相當；或與其營利性質是否相關。'
  ]

//----------------- 6. 近三個月AML審查紀錄 -----------------//
  // aml審查紀錄 grid
  mergeAmlData = [];
  files: string = "test.pdf";
  public searchGrid = {
    rowKey: "efileNo",
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "efileNo",
        title: "AML審查編號",
        fixed: "left",
        sorter: (a, b) => a.efileNo.localeCompare(b.efileNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "rptDate",
        title: "產生日期",
        fixed: "left",
        sorter: (a, b) => moment(a.rptDate).unix() - moment(b.rptDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "operType",
        title: "作業別",
        fixed: "left",
        customRender: (data) => {
          return data.operType.code;
        },
        sorter: (a, b) => a.operType.code.localeCompare(b.operType.code),
      },
      {
        type: FblColumnType.PLAIN,
        property: "custTypes",
        title: "案件類型",
        fixed: "left",
        customRender: (data) => {
          if(data.custTypes) {
            return data.custTypes.map(x => this.$createElement('div', `${x.description}`));
          }else{
            return '';
          }
        },
        sorter: (a, b) => a.custTypes[0].description.localeCompare(b.custTypes[0].description),
      },
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        customRender: (data) => {
          return data.sysType.code;
        },
        sorter: (a, b) => a.sysType.code.localeCompare(b.sysType.code),
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}`;
        },
        sorter: (a, b) => a.policyNo.localeCompare(b.policyNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseNo",
        title: "交易案號",
        sorter: (a, b) => a.caseNo.localeCompare(b.caseNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "applFname",
        title: "要保人姓名",
        sorter: (a, b) => a.applFname.localeCompare(b.applFname),
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: "客戶姓名",
        customRender: (data) => {
          if(data.clients) {
            return data.clients.map(x => this.$createElement('div', `${x.custName}`));
          }else{
            return '';
          }
        },
        sorter: (a, b) => a.clients[0].custName.localeCompare(b.clients[0].custName),
      },
      {
        type: FblColumnType.PLAIN,
        property: "fileStat",
        title: "案件狀態",
        sorter: (a, b) => a.fileStat.localeCompare(b.fileStat),
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "reportName",
        title: "檔案", 
        template: "file",
        fixed: "right",
        sorter: (a, b) => a.reportName.localeCompare(b.reportName),
      },
    ],
  };
  unwatchPolicyDataProp;
  

/**
 * Func
 */
  h = this.$createElement;
  // 表格內斷行
  formatString(items: Array<string>): string {
    var str: string = "";
    var index = 1;
    for (var item of items) {
      str = str + index + ". " + item + "\n";
      index++;
    }
    return str;
  }


//----------------- 4. 名單比對結果 -----------------//
  // 只要有一筆不是`無比中名單`，就出現訊息
  get matchResultMessage() :boolean {
    return this.match_result.some(currentValue => {
      return !(/^無比中名單$/).test(currentValue.type);
    })
  }


  // 近三個月 AML審查紀錄
  downloadFile({efileNo, imgIdxId, reportName}) {
    this.setLoading(true);
    this.$searchAMLReviewDataApi.fmsDownloadInSearchUsingGET(efileNo, imgIdxId, {responseType: "blob"})
    .then(resp => {
      const downloadlink: HTMLAnchorElement = document.createElement("a");
      const URL = window.URL || window.webkitURL;
      const url = URL.createObjectURL(resp.data as unknown as Blob);
      const downloadName = reportName;
      downloadlink.setAttribute("href", url);
      downloadlink.setAttribute("download", `${downloadName}`);
      downloadlink.click();
      downloadlink.remove();
    })
    .catch(err => {
      console.log(err);
      Modal.error({
        title: '下載失敗，請重新操作',
        okType: 'green',
        okText: "確定",
        icon: () =>
          this.h("a-icon", {
            props: {
              type: "close-circle",
              theme: "filled",
            },
          }),
        onOk: () => {},
      });
    })
    .finally(() => {
      this.setLoading(false);
    })    
  }

//----------------- 5. 是否有需執行客戶驗證的項目 (保服才有) -----------------//
  // DATA: 是否有需執行客戶驗證的項目
  // need_to_be_verified_by_the_clientData = "要保人換人。";

  // DATA: 本次已執行驗證的方式為
  // ways_to_perform_verificationData = {
  //   options: [
  //     { key: 'A', value: '業報書',},
  //     { key: 'B', value: '電訪',},
  //     { key: 'C', value: '親訪',},
  //     { key: 'D', value: '要保人變更之業務員聲明書',}
  //   ],
  //   checkOptions: ['B', 'D']
  // }
  // }


//----------------- 6. 近三個月AML審查紀錄 -----------------//
  setButtonClass(record) {
    let $return = '';
    switch(record){
      case 'merge':
        $return = 'case__merge';
        break;
      case 'unMerge':
        $return = 'case__unMerge';
        break;
      case 'import':
        $return = 'case__import';
        break;
      default:
        break;
    }
    return $return;
  }

/**
 * Event
 */
  //----------------- 2. 本次交易之保單資料 -----------------//
  // onInput(dataValue, target) {
  //   const $rgx = /[^0-9]/gm;
  //   const $replace = dataValue.totalPaidInsuranceFee.replace($rgx, '');
  //   dataValue.totalPaidInsuranceFee = Number($replace);
  // }
  
  // isError :boolean = false;

  //----------------- 送檢核 -----------------//

  // TODO: API: TEST: 點擊「送覆核」時的檢核
  // check() {
  //   console.log('審查原因：', this.reviewReason);
  //   console.log('本次交易之保單資料：', this.grid.data.map((item) =>{
  //     return item.totalPaidInsuranceFee;
  //   }));
  //   this.isError = this.ways_to_perform_verificationData.checkOptions.length <= 0;
  //   if(!this.isError){
  //     console.log('審查原因：', this.reviewReason);
  //     console.log('本次交易之保單資料：', this.grid.data.map((item) =>{
  //       return item.totalPaidInsuranceFee;
  //     }));
  //     console.log('本次已執行驗證的方式：', this.ways_to_perform_verificationData.checkOptions);
  //   }else{
  //     console.log('本次已執行驗證的方式 未填寫');
  //   }
  // }

  // // error reset
  // onChange() {
  //   this.isError = false;
  // }


/**
 * 監聽
 */
  // 偵測 審查原因 勾選變更_其他
  @Watch('selectedOthers', {immediate: true, deep: true})
  onOtherChangeCheck() {
    this.updateSuspectedotherform();   // 處理代碼轉換 並存到Vuex
  }

  // 更新疑似洗錢或資恐交易態樣
  @Watch('selectedCheck', {immediate: true, deep: true})
  onChangeCheck() {
    this.updateSuspectedform();   // 處理代碼轉換 並存到Vuex
  }



  // get grid 近三個月AML審查紀錄
  @Watch('gethistoryData', {immediate: true, deep: true})
  onChangeHistoryData() {
    this.customerDataPageLoading = true;
    this.searchGrid.data = this.gethistoryData;
    this.customerDataPageLoading = false;
  }
  // @Watch("mergeAmlData")
  // onMergeAmlDataChanged() {
  //   this.$emit("merge-aml-data", this.mergeAmlData);
  // }

/**
 * Hook
 */
  created() {
    // get grid 本次交易之保單資料 (once)
    this.unwatchPolicyDataProp = this.$watch('getPolicyData', (newVal) => {
      if (newVal) {
        this.setCustomerDataPageLoading(true);

        this.grid.data = this.getPolicyData;
        // 確保資料已經進來了 就取消監聽
        if(this.grid.data.length > 0) {
          this.unwatchPolicyDataProp();
        }
        this.setCustomerDataPageLoading(false);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.customerData__page {
  font-size: 16px;
  p {
    margin-bottom: 0;
  }

  // 審查原因 checkbox disabled 樣式
  ::v-deep .ant-checkbox-wrapper {
    &.ant-checkbox-wrapper-disabled {
    cursor: initial;
  }
  }
  ::v-deep .ant-checkbox-disabled {
    cursor: initial;
    .ant-checkbox-input {
      cursor: initial;
    }
    + span {
      cursor: initial;
      color: rgba(0, 0, 0, 0.65);
    }
    
  }
}

.space__left {
  margin-left: 10px;
  p {
    margin-bottom: 0;
  }
}

.table {
  .ant-table-thead {
    line-height: 26px !important;
  }
}
.data-row-vvv {
  background-color: gray;
}

.case__button {
  border: 1px solid #C7C7C7;
  color: #000;
  background: #EEE;
  border-radius: 3px;
  padding: 2px;
  min-width: 100px;
  font-size: 16px;
  font-weight: 300;
}
.case__merge,
.case__unMerge,
.case__import {
  cursor: pointer;
  &:active {
    background: #EEE;
  }
}

.case__merge {
  background: #FFF;
  border-color: #13C2C2;
  color: #13C2C2;
}
.case__unMerge {
  background: #13C2C2;
  border-color: #13C2C2;
  color: #FFF;
}
.case__import {
  background: #FFF;
  border-color: #0090FF;
  color: #0090FF;
}
.case__importAfter {
  background: #cbdbe2;
}

.people {
  font-weight: normal;
  margin-left: 10px;
  margin-right: 15px;
}

.borderBottom {
  border-bottom: 1px solid #707070;
  margin-bottom: 5px;
  display: inline-block;
}

.list__count-item {
  & + & {
    margin-top: 10px;
    margin-bottom: 0;
  }
}
.error__message {
  display: none;
  color: #f5222d;
}
.has-error {
  .error__message {
    display: block;
  }
  ::v-deep [type='checkbox'] {
    + .ant-checkbox-inner {
      border-color: #f5222d ;
    }
  }
}

.ant-select.ant-select-disabled {
  .ant-select-arrow {
    display: none;
  }
}

::v-deep {
  .ant-input-number-input {
    text-align: right;
  }
}

</style>
