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
        <a-checkbox v-model="customerdata.riskInd" :disabled="true"
          >風險評級為高風險</a-checkbox
        >
      </a-row>
      <a-row type="flex">
        <a-col>
          <a-checkbox :checked="selectedCheck.length > 0" :disabled="true"
            >疑似洗錢或資恐交易態樣(可複選)
          </a-checkbox>
        </a-col>
        <a-col flex="1">
          <a-checkbox-group v-model="selectedCheck" style="width: 100%">
            <a-row type="flex">
              <template v-for="(item, index) in reviewReasonSuspectedOpts">
                <template v-if="item.value !== '其他'">
                  <a-checkbox
                    :value="item.key"
                    :disabled="
                      isConfirm ||
                      reviewReasonSuspectedDefault.includes(item.key)
                    "
                    :key="index"
                    >{{ item.key }}. {{ item.value }}</a-checkbox
                  >
                </template>
              </template>
            </a-row>

            <!-- 處理其他項目 -->
            <template v-for="(item, index) in reviewReasonSuspectedOpts">
              <a-row
                type="flex"
                style="margin-top: 10px"
                v-if="item.value == '其他'"
                :key="index"
              >
                <a-col>
                  <!-- <a-checkbox value="F" :disabled="true">F. 其他: <span class="borderBottom">{{DefaultReviewReasonOtherOption}}</span></a-checkbox> -->
                  <a-checkbox value="F" style="display: none"></a-checkbox>
                  <label style="margin: 0 4px; padding-right: 8px"
                    >F. 其他:
                    <span class="borderBottom">{{
                      reviewReasonOtherDefaultString
                    }}</span></label
                  >
                </a-col>
                <a-col flex="1">
                  <a-select
                    mode="multiple"
                    v-model="selectedOthers"
                    style="width: 500px"
                    :showArrow="!isConfirm"
                    placeholder="請選擇"
                    :allowClear="true"
                    :notFoundContent="false"
                    :disabled="isConfirm"
                  >
                    <a-select-option
                      v-for="item in filteredReviewReasonOtherOption"
                      :key="item.key"
                      :value="item.value"
                    >
                      {{ item.value }}
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
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template v-slot:totalPaidInsuranceFeeInput="slotProps">
          <a-input-number
            v-model="slotProps.data.mtotal"
            :disabled="isConfirm"
            style="width: 150px"
            :min="0"
            placeholder="請輸入金額(NTD)"
          >
          </a-input-number>
        </template>
        <!-- <template v-slot:template="slotProps">
          <span style="white-space: pre-line;">
            {{ slotProps.data.caseType }}
          </span>
        </template> -->
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
          <p
            v-for="(item, index) in matchResult"
            :key="index"
            class="list__count-item"
          >
            {{ item.name }}：{{ item.type }}
          </p>
        </a-col>
      </a-row>
      <div
        class="precautions"
        v-if="
          matchResultMessage &&
          getDeptSectionConfig.customerDataPage.matchResultMessageTxtGroup
        "
      >
        <a-row class="precautions__header" type="flex" align="middle">
          <a-icon type="warning" theme="filled" />
          <span class="precautions__headerTitle">提醒審查重點：</span>
        </a-row>
        <ol class="precautions__listGroup">
          <li
            class="precautions__list__item"
            v-for="(item, index) in getDeptSectionConfig.customerDataPage
              .matchResultMessageTxtGroup"
            :key="index"
          >
            {{ item }}
          </li>
        </ol>
      </div>
    </section>

    <!-- 是否有需執行客戶驗證的項目 -->
    <section class="page__section" v-show="depId === 'MC' || depId === 'RN'">
      <a-row type="flex">
        <a-col
          ><h4 class="section__title">是否有需執行客戶驗證的項目：</h4></a-col
        >
        <a-col
          ><span>{{ formatVerifyItem(verifyItem) }}</span></a-col
        >
      </a-row>
    </section>

    <!-- 本次已執行驗證的方式為 -->
    <section class="page__section" v-show="depId === 'MC' || depId === 'RN'">
      <a-row type="flex">
        <a-col
          ><h4 class="section__title">
            本次已執行驗證的方式為：<span
              class="mark-required"
              v-show="verifyItem !== 'N'"
              >*</span
            >
          </h4></a-col
        >
        <a-col flex="1" :class="{ 'has-error': isError }">
          <a-checkbox-group
            style="width: 100%"
            @change="onVerifyMethodsChange"
            v-if="verifyItem !== 'N'"
            :default-value="verifyMethods.checkOptions"
          >
            <a-row type="flex">
              <a-checkbox
                v-for="item in verifyMethods.options"
                :disabled="isConfirm"
                :key="item.key"
                :value="item.key"
              >
                {{ item.value }}
              </a-checkbox>
            </a-row>
            <span class="error__message">此為必填欄位</span>
          </a-checkbox-group>
          <span v-else-if="verifyItem === 'N'">無</span>
        </a-col>
      </a-row>
    </section>

    <!-- 近三個月AML審查紀錄 -->
    <section class="page__section">
      <a-row type="flex">
        <!-- TODO: API: 要保人姓名 -->
        <h4 class="section__title">
          <span class="borderBottom people" v-if="historyDataApplFname">{{
            historyDataApplFname
          }}</span
          ><span>AML審查紀錄</span><small>(近三個月)</small>
        </h4>
      </a-row>
      <fbl-data-grid
        class="fbl-table"
        :rowKey="amlReviewGrid.rowKey"
        :columns="amlReviewGrid.columns"
        :data="amlReviewGrid.data"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template v-slot:file="slotProps">
          <a
            @click="downloadFile(slotProps.data)"
            v-if="slotProps.data.imgIdxId && slotProps.data.reportName"
            >{{ slotProps.data.reportName }}</a
          >
        </template>
        <template v-slot:caseHandle="slotProps" v-if="!isConfirm">
          <a-popconfirm
            title="您確定要匯入資料嗎？"
            ok-text="確定"
            cancel-text="取消"
            ok-type="green"
            icon=" "
            overlayClassName="customPopconfirm"
            v-if="slotProps.data.caseLink == 'import'"
            @confirm="() => importData(slotProps.data)"
          >
            <button
              @click="setAction(slotProps.data)"
              class="case__button"
              :class="setButtonClass(slotProps.data.caseLink)"
            >
              {{ slotProps.data.caseHandle }}
            </button>
          </a-popconfirm>
          <button
            v-else-if="slotProps.data.caseLink == 'imported'"
            class="case__button"
            :class="setButtonClass(slotProps.data.caseLink)"
          >
            {{ slotProps.data.caseHandle }}
          </button>
          <button
            v-else-if="slotProps.data.caseLink == 'merged'"
            class="case__button"
            :class="setButtonClass(slotProps.data.caseLink)"
          >
            {{ slotProps.data.caseHandle }}
          </button>
          <button
            v-else-if="
              ['merge', 'unMerge'].includes(slotProps.data.caseLink) &&
              slotProps.data.caseHandle != ''
            "
            @click="setAction(slotProps.data)"
            class="case__button"
            :class="setButtonClass(slotProps.data.caseLink)"
          >
            {{ slotProps.data.caseHandle }}
          </button>
        </template>
      </fbl-data-grid>
    </section>
    <!-- TODO: 點擊「送覆核」時的檢核 -->
    <!-- TEST: -->
    <!-- <a-button @click="check">Test Validation</a-button> -->
  </div>
</template>

<script lang="ts">
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import { Vue, Component } from "vue-property-decorator";
import { Prop, Watch } from "vue-property-decorator";
import moment from "moment";

import { Getter, Action, namespace } from "vuex-class";
import { createHelpers } from "vuex-map-fields";
import { PolicyVO, HistoryMainVO } from "@fubonlife/edd-api-axios-sdk";
const { mapFields } = createHelpers({
  getterType: "CustomerData/getField",
  mutationType: "CustomerData/updateField",
});
import { Modal } from "ant-design-vue";
const CustomerData = namespace("CustomerData");

import Global from "@/plugins/global";

@Component({
  components: { FblDataGrid },
  computed: {
    ...mapFields([
      "customerdata",
      "selectedCheck",
      "selectedOthers",
      // 'ways_to_perform_verificationDataCheck'
    ]),
  },
})
export default class CustomerDataPage extends Vue {
  @Getter isConfirm!: boolean;
  @Action("setMemoDesc") setMemoDesc;
  @Action public setLoading: (payload: boolean) => void;
  customerDataPageLoading: boolean = false;

  @Action public reflashPage: (payload: { page: string; val: boolean }) => void;

  @CustomerData.Getter getCustomerDataPageLoading;
  @CustomerData.Action("setCustomerDataPageLoading") setCustomerDataPageLoading;

  // 審查原因 選項
  @CustomerData.Getter reviewReasonSuspectedOpts;
  // 審查原因 系統帶入的選項
  @CustomerData.Getter reviewReasonSuspectedDefault;
  @CustomerData.Action("updateSuspectedform") updateSuspectedform;

  // 審查原因 其他選項 選項
  // @CustomerData.Getter reviewReasonOtherOption;
  // 審查原因 系統帶入的選項 轉文字顯示
  @CustomerData.Getter reviewReasonOtherDefaultString;
  // 審查原因 其他選項 排除系統預設&已選取的選項
  @CustomerData.Getter filteredReviewReasonOtherOption;
  @CustomerData.Action("updateSuspectedotherform") updateSuspectedotherform;

  // 風險評級
  @CustomerData.Getter riskLevel;
  // 名單比對結果
  @CustomerData.Getter matchResult;

  // 本次交易之保單資料
  @CustomerData.Getter getPolicyData;
  @CustomerData.Action("updatePolicydata") updatePolicydata;

  // AML審查紀錄 要保人姓名
  @CustomerData.Getter historyDataApplFname;
  @CustomerData.Getter gethistoryData;

  // 取得驗證項目 & 驗證方式
  @CustomerData.Getter verifyItem;
  @CustomerData.Getter verifyMethodCheckedOptions;
  @CustomerData.Action("updateVerifyMethod") updateVerifyMethod;

  // 取得當前部門顯示規則設定
  @Getter getDeptSectionConfig;

  //----------------- 2. 本次交易之保單資料 -----------------//
  public grid: FblPDataGridHolder<PolicyVO> = undefined;

  VPMCNBGrid: FblPDataGridHolder<PolicyVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
        sorter: (a, b) => a.sysType.localeCompare(b.sysType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${
            data.idDup ? " " + data.idDup : ""
          }`;
        },
        sorter: (a, b) =>
          (a.policyNo + a.policySeq + a.idDup).localeCompare(
            b.policyNo + b.policySeq + b.idDup
          ),
      },
      {
        type: FblColumnType.PLAIN,
        property: "effDate",
        title: "契約始期",
        fixed: "left",
        sorter: (a, b) => moment(a.effDate).unix() - moment(b.effDate).unix(),
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
        sorter: (a, b) => a.mtotal - b.mtotal,
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
          let parts = data.caseAmt.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return data.billcurr + "$" + parts.join(".");
        },
        sorter: (a, b) => a.caseAmt - b.caseAmt,
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseType",
        title: "本次交易項目",
        customRender: (data) => {
          if (data.caseType) {
            return data.caseType.map((x) => this.$createElement("div", `${x}`));
          } else {
            return "";
          }
        },
        sorter: (a, b) => a.caseType[0].localeCompare(b.caseType[0]),
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
        sorter: (a, b) => moment(a.riskDate).unix() - moment(b.riskDate).unix(),
      },
    ],
  };

  RNGrid: FblPDataGridHolder<PolicyVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
        sorter: (a, b) => a.sysType.localeCompare(b.sysType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${
            data.idDup ? " " + data.idDup : ""
          }`;
        },
        sorter: (a, b) =>
          (a.policyNo + a.policySeq + a.idDup).localeCompare(
            b.policyNo + b.policySeq + b.idDup
          ),
      },
      {
        type: FblColumnType.PLAIN,
        property: "effDate",
        title: "契約始期",
        fixed: "left",
        sorter: (a, b) => moment(a.effDate).unix() - moment(b.effDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "item",
        title: "險種",
        fixed: "left",
        sorter: (a, b) => a.item.localeCompare(b.item),
      },
      {
        type: FblColumnType.PLAIN,
        title: "每期應繳保費(年/半/季/月)",
        formatter: (data) => {
          let parts = data.prem.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return "$" + parts.join(".") + "(" + data.mop + ")";
        },
        sorter: (a, b) => a.prem - b.prem,
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmt",
        title: "本次交易金額",
        formatter: (data) => {
          if (data.caseAmt === null) {
            return "N/A";
          }
          let parts = data.caseAmt.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return "$" + parts.join(".");
        },
        sorter: (a, b) => a.caseAmt - b.caseAmt,
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseType",
        title: "本次交易項目",
        customRender: (data) => {
          if (data.caseType) {
            return data.caseType.map((x) => this.$createElement("div", `${x}`));
          } else {
            return "";
          }
        },
        sorter: (a, b) => a.caseType[0].localeCompare(b.caseType[0]),
      },
      {
        type: FblColumnType.PLAIN,
        property: "payOrReturn",
        title: "繳費/退費",
        sorter: (a, b) => a.payOrReturn.localeCompare(b.payOrReturn),
      },
    ],
  };

  CLGrid1: FblPDataGridHolder<PolicyVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
        sorter: (a, b) => a.sysType.localeCompare(b.sysType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${
            data.idDup ? " " + data.idDup : ""
          }`;
        },
        sorter: (a, b) =>
          (a.policyNo + a.policySeq + a.idDup).localeCompare(
            b.policyNo + b.policySeq + b.idDup
          ),
      },
      {
        type: FblColumnType.PLAIN,
        property: "item",
        title: "險種",
        fixed: "left",
        sorter: (a, b) => a.item.localeCompare(b.item),
      },
      {
        type: FblColumnType.PLAIN,
        property: "effDate",
        title: "契約始期",
        fixed: "left",
        sorter: (a, b) => moment(a.effDate).unix() - moment(b.effDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "applId",
        title: "要保人ID",
        fixed: "left",
        sorter: (a, b) => a.applId.localeCompare(b.applId),
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
        property: "caseNo",
        title: "交易案號",
        fixed: "left",
        sorter: (a, b) => a.caseNo.localeCompare(b.caseNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "scanType",
        title: "掃描類別",
        sorter: (a, b) => a.scanType.localeCompare(b.scanType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmt",
        title: "本次給付金額",
        formatter: (data) => {
          let parts = data.caseAmt.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return data.billcurr + "$" + parts.join(".");
        },
        sorter: (a, b) => a.caseAmt - b.caseAmt,
      },
      {
        type: FblColumnType.PLAIN,
        property: "methodDesc",
        title: "給付方式",
        sorter: (a, b) => a.methodDesc.localeCompare(b.methodDesc),
      },
      {
        type: FblColumnType.PLAIN,
        property: "scanDate",
        title: "結案日",
        fixed: "left",
        sorter: (a, b) => moment(a.caseDate).unix() - moment(b.scanDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "accidId",
        title: "事故人ID",
        sorter: (a, b) => a.accidId.localeCompare(b.accidId),
      },
      {
        type: FblColumnType.PLAIN,
        property: "accidName",
        title: "事故人姓名",
        sorter: (a, b) => a.accidName.localeCompare(b.accidName),
      },
      {
        type: FblColumnType.PLAIN,
        property: "contDp",
        title: "單位名稱",
        sorter: (a, b) => a.contDp.localeCompare(b.contDp),
      },
      {
        type: FblColumnType.PLAIN,
        property: "contName",
        title: "窗口聯絡人",
        sorter: (a, b) => a.contName.localeCompare(b.contName),
      },
      {
        type: FblColumnType.PLAIN,
        property: "deadDate",
        title: "身故日",
        sorter: (a, b) => moment(a.deadDate).unix() - moment(b.deadDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "disableDate",
        title: "失能日",
        sorter: (a, b) =>
          moment(a.disableDate).unix() - moment(b.disableDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "critIllDate",
        title: "重疾日",
        sorter: (a, b) =>
          moment(a.critIllDate).unix() - moment(b.critIllDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "cancerDate",
        title: "罹癌日",
        sorter: (a, b) =>
          moment(a.cancerDate).unix() - moment(b.cancerDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "accidReason",
        title: "事故原因",
        sorter: (a, b) => a.accidReason.localeCompare(b.accidReason),
      },
    ],
  };

  CLGrid2: FblPDataGridHolder<PolicyVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
        sorter: (a, b) => a.sysType.localeCompare(b.sysType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "custName",
        title: "客戶姓名",
        fixed: "left",
        sorter: (a, b) => a.custName.localeCompare(b.custName),
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${
            data.idDup ? " " + data.idDup : ""
          }`;
        },
        sorter: (a, b) =>
          (a.policyNo + a.policySeq + a.idDup).localeCompare(
            b.policyNo + b.policySeq + b.idDup
          ),
      },
      {
        type: FblColumnType.PLAIN,
        property: "item",
        title: "險種",
        fixed: "left",
        sorter: (a, b) => a.item.localeCompare(b.item),
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseNo",
        title: "交易案號",
        fixed: "left",
        sorter: (a, b) => a.caseNo.localeCompare(b.caseNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseType",
        title: "申請事項",
        customRender: (data) => {
          if (data.caseType) {
            return data.caseType.map((x) => this.$createElement("div", `${x}`));
          } else {
            return "";
          }
        },
        sorter: (a, b) => a.caseType[0].localeCompare(b.caseType[0]),
      },
      {
        type: FblColumnType.PLAIN,
        property: "scanType",
        title: "掃描類別",
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
        sorter: (a, b) => moment(a.riskDate).unix() - moment(b.riskDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "isBan",
        title: "高風險國家",
        sorter: (a, b) => a.isBan.localeCompare(b.isBan),
      },
    ],
  };

  //----------------- 4. 名單比對結果 -----------------//
  // 提醒文字 (客利)
  matchResultMessageTxtGroup = [
    "確認要保人、被保險人、關係人等有無負面新聞。",
    "確認交易時間點、犯罪時間點、負面新聞被揭露時間點…等各時間點是否有關聯，有否隱匿不法資金(如還款資金來源有無合理說明)。",
    "確認資金來源與其身分、收入是否相當；或與其營利性質是否相關。",
  ];

  //----------------- 6. 近三個月AML審查紀錄 -----------------//
  // aml審查紀錄 grid
  mergeAmlData = [];
  public amlReviewGrid = {
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
          if (data.custTypes) {
            return data.custTypes.map((x) =>
              this.$createElement("div", `${x.description}`)
            );
          } else {
            return "";
          }
        },
        sorter: (a, b) =>
          a.custTypes[0].description.localeCompare(b.custTypes[0].description),
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
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${
            data.idDup ? " " + data.idDup : ""
          }`;
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
          if (data.clients) {
            return data.clients.map((x) =>
              this.$createElement("div", `${x.custName}`)
            );
          } else {
            return "";
          }
        },
        sorter: (a, b) =>
          a.clients[0].custName.localeCompare(b.clients[0].custName),
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
  // focus input時
  // focusInput(e) {
  //   // 如果為零，則文字圈選，方便修改
  //   if(e.target.ariaValueNow == '0') {
  //     e.target.select();
  //   }
  // }
  // 近三個月 AML審查紀錄
  downloadFile({ efileNo, imgIdxId, reportName }) {
    this.setLoading(true);
    if (!this.isConfirm) {
      this.$reviewApi
        .fmsDownloadInReviewUsingGET(efileNo, imgIdxId, {
          responseType: "blob",
        })
        .then((resp) => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          const downloadName = reportName;
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}`);
          downloadlink.click();
          downloadlink.remove();
        })
        .catch((err) => {
          console.log(err);
          Modal.error({
            title: "下載失敗，請重新操作",
            okType: "green",
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
        });
    } else {
      this.$confirmApi
        .fmsDownloadInConfirmUsingGET(efileNo, imgIdxId, {
          responseType: "blob",
        })
        .then((resp) => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          const downloadName = reportName;
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}`);
          downloadlink.click();
          downloadlink.remove();
        })
        .catch((err) => {
          console.log(err);
          Modal.error({
            title: "下載失敗，請重新操作",
            okType: "green",
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
        });
    }
  }

  //----------------- 4. 名單比對結果 -----------------//
  // 只要有一筆不是`無比中名單`，就出現訊息
  get matchResultMessage(): boolean {
    return this.matchResult.some((currentValue) => {
      return !/^無比中名單$/.test(currentValue.type);
    });
  }

  //----------------- 5. 是否有需執行客戶驗證的項目 (保服、保費才有) -----------------//
  // DATA: 本次已執行驗證的方式為
  verifyMethods = {
    options: [
      { key: "VERIFY_METHOD_AG", value: "業報書" },
      { key: "VERIFY_METHOD_TEL", value: "電訪" },
      { key: "VERIFY_METHOD_VS", value: "親訪" },
      { key: "VERIFY_METHOD_OW", value: "要保人變更之業務員聲明書" },
    ],
    checkOptions: [],
  };

  //----------------- 6. 近三個月AML審查紀錄 -----------------//
  setButtonClass(record) {
    let $return = "";
    switch (record) {
      case "merge":
        $return = "case__merge";
        break;
      case "unMerge":
        $return = "case__unMerge";
        break;
      case "merged":
        $return = "case__merged";
        break;
      case "import":
        $return = "case__import";
        break;
      case "imported":
        $return = "case__importAfter";
        break;
      default:
        break;
    }
    return $return;
  }
  setAction(action) {
    switch (action.caseLink) {
      case "merge":
        this.mergeCheck(action);
        break;
      case "unMerge":
        action.caseHandle = "併件";
        action.caseLink = "merge";
        this.mergeAmlData = this.mergeAmlData.filter(item => item != action.efileNo);
        this.notifyDatasetChange();
        break;
      default:
        break;
    }
  }
  // 匯入資料
  importData(slotPropsData) {
    if (!this.isConfirm) {
      this.customerDataPageLoading = true;
      // 待審查API
      this.$reviewApi
        .importDataInReviewUsingPOST({
          efileNo: sessionStorage["review_assignment_page"],
          importingEfileNo: slotPropsData.efileNo,
        })
        .then(async (resp) => {
          if (resp.data.success === true) {
            slotPropsData.caseHandle = "已匯入";
            slotPropsData.caseLink = "imported";
            this.notifyDatasetChange();

            if (resp.data.data.reviewComment) {
              this.setMemoDesc(resp.data.data.reviewComment);
              Modal.success({
                okType: "green",
                okText: "確定",
                icon: "''",
                centered: true,
                content: this.h("div", { attrs: { class: "wrap" } }, [
                  this.h("a-icon", {
                    props: {
                      type: "check-circle",
                      theme: "filled",
                    },
                    attrs: {
                      class: "wrap__icon-success",
                    },
                  }),
                  this.h("div", { attrs: { class: "wrap__text" } }, "匯入成功"),
                  this.h("i", { attrs: { class: "wrap__img-success" } }),
                ]),
                onOk: () => {},
              });
            } else {
              console.log("resp: reviewComment無資料");
            }
            // 更新佐證資料 (只為了觸發watch)
            await this.reflashPage({ page: "ReviewEvidenceData", val: true });
            await this.reflashPage({ page: "ReviewEvidenceData", val: false });
          } else {
            Modal.error({
              okType: "green",
              okText: "確定",
              icon: "''",
              centered: true,
              content: this.h("div", { attrs: { class: "wrap" } }, [
                this.h("a-icon", {
                  props: {
                    type: "close-circle",
                    theme: "filled",
                  },
                  attrs: {
                    class: "wrap__icon-fail",
                  },
                }),
                this.h("div", { attrs: { class: "wrap__text" } }, "匯入失敗"),
                this.h("i", { attrs: { class: "wrap__img-fail" } }),
              ]),
            });
          }
        })
        .catch((error) => {
          Modal.error({
            okType: "green",
            okText: "確定",
            icon: "''",
            centered: true,
            content: this.h("div", { attrs: { class: "wrap" } }, [
              this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
                attrs: {
                  class: "wrap__icon-fail",
                },
              }),
              this.h("div", { attrs: { class: "wrap__text" } }, "匯入失敗"),
              this.h("i", { attrs: { class: "wrap__img-fail" } }),
            ]),
          });
        })
        .finally(() => {
          this.customerDataPageLoading = false;
        });
    }
  }
  // setRowClass(record) {
  //   return record.caseLink === "unMerge" ? "data-row-disable" : "";
  // }

  /**
   * Event
   */
  //----------------- 2. 本次交易之保單資料 -----------------//
  // onInput(dataValue, target) {
  //   const $rgx = /[^0-9]/gm;
  //   const $replace = dataValue.totalPaidInsuranceFee.replace($rgx, '');
  //   dataValue.totalPaidInsuranceFee = Number($replace);
  // }

  isError: boolean = false;

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

  formatVerifyItem(verifyItem: string) {
    if (verifyItem === "N") {
      return "無";
    } else if (verifyItem === "B") {
      return "要保人換人/附約新加保";
    } else if (verifyItem === "A") {
      return "要保人換人";
    } else if (verifyItem === "C") {
      return "附約新加保";
    }
  }

  mergeCheck(slotPropsData) {
    this.$reviewApi
      .mergeCheckUsingPOST({
        efileNo: sessionStorage["review_assignment_page"],
        mergingEfileNo: slotPropsData.efileNo,
      })
      .then(async (resp) => {
        if (resp.data.data.errorCode == "") {
          this.mergeAmlData.push(slotPropsData.efileNo);
          slotPropsData.caseHandle = "取消併件";
          slotPropsData.caseLink = "unMerge";
          this.notifyDatasetChange();
          const message = this.mergeAmlData.map((i) => "【" + i + "】").join("、");
          Modal.success({
            title: "併件資料",
            content: message,
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
            onOk: () => {},
          });
        } else if (resp.data.data.errorCode !== "") {
          Modal.error({
            title: "錯誤",
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
      });
  }

  notifyDatasetChange() {
    this.amlReviewGrid.data = [];
    this.amlReviewGrid.data = this.gethistoryData;
  }

  /**
   * 監聽
   */
  // 更新疑似洗錢或資恐交易態樣
  @Watch("selectedCheck", { immediate: true, deep: true })
  onChangeCheck() {
    this.updateSuspectedform(); // 處理代碼轉換 並存到Vuex
  }

  // 偵測 審查原因 勾選變更_其他
  @Watch("selectedOthers", { immediate: true, deep: true })
  onOtherChangeCheck() {
    this.updateSuspectedotherform(); // 處理代碼轉換 並存到Vuex
  }

  // get grid 近三個月AML審查紀錄
  @Watch("gethistoryData", { immediate: true, deep: true })
  onChangeHistoryData() {
    this.customerDataPageLoading = true;
    this.amlReviewGrid.data = this.gethistoryData;
    this.customerDataPageLoading = false;
  }

  @Watch("mergeAmlData")
  onMergeAmlDataChanged() {
    this.$emit("merge-aml-data", this.mergeAmlData);
  }

  onVerifyMethodsChange(checkedValues) {
    this.updateVerifyMethod(checkedValues);
  }

  // 部門代碼
  depId = "";

  /**
   * Hook
   */
  created() {
    const efileNo = sessionStorage["review_assignment_page"];
    this.depId = efileNo.substring(0, 2);
    const caseFrom = JSON.parse(
      sessionStorage["review_assignment_data"]
    ).caseFrom;
    if (this.depId === "VP" || this.depId === "MC" || this.depId === "NB") {
      this.grid = this.VPMCNBGrid;
    } else if (this.depId === "RN") {
      this.grid = this.RNGrid;
    } else if (this.depId === "CL" && caseFrom === "RCLAML03") {
      this.grid = this.CLGrid1;
    } else if (
      this.depId === "CL" &&
      (caseFrom === "RCLAML30" ||
        caseFrom === "RCLAML32" ||
        caseFrom === "AML-ADD")
    ) {
      this.grid = this.CLGrid2;
    }

    // 驗證方式
    this.verifyMethods.checkOptions = this.verifyMethodCheckedOptions;

    // get grid 本次交易之保單資料 (once)
    this.unwatchPolicyDataProp = this.$watch("getPolicyData", (newVal) => {
      if (newVal) {
        this.setCustomerDataPageLoading(true);
        let rowkey = this.getPolicyData.map((item, index) => {
          // 加序號
          return Object.assign(item, { rowkey: index + 1 });
        });
        this.grid.data = rowkey;
        // 確保資料已經進來了 就取消監聽
        if (this.grid.data.length > 0) {
          this.unwatchPolicyDataProp();
        }
        this.setCustomerDataPageLoading(false);
      }
    });

    if (!this.isConfirm) {
      // 待審查 AML審查紀錄(近三個月)表格 才有 案件處理 欄位
      this.amlReviewGrid.columns.push({
        type: FblColumnType.TEMPLATE,
        property: "caseHandle",
        title: "案件處理",
        template: "caseHandle",
        fixed: "right",
        sorter: (a, b) => a.caseHandle.localeCompare(b.caseHandle),
      });
    }
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
  border: 1px solid #c7c7c7;
  color: #000;
  background: #eee;
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
    background: #eee;
  }
}

.case__merge {
  background: #fff;
  border-color: #13c2c2;
  color: #13c2c2;
}
.case__unMerge {
  background: #13c2c2;
  border-color: #13c2c2;
  color: #fff;
}
.case__import {
  background: #fff;
  border-color: #0090ff;
  color: #0090ff;
}
.case__importAfter {
  background: #eeeeee;
  border-color: #c7c7c7;
  color: black;
}
.case__merged {
  background: #eeeeee;
  border-color: #c7c7c7;
  color: black;
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
  ::v-deep [type="checkbox"] {
    + .ant-checkbox-inner {
      border-color: #f5222d;
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
