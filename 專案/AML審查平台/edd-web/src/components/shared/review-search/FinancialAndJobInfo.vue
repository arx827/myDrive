<template>
  <div>
    <!-- 客戶之財務與職業資訊 -->
    <section class="page__section">
            <a-row class="spin__wrap" v-if="getFinanceJobinfoPageLoading">
        <a-spin
          :spinning="getFinanceJobinfoPageLoading"
          tip="資料處理中，請稍候..."
          :delay="200"
          class="spin"
        >
        </a-spin>
      </a-row>
      <a-row type="flex">
        <h4 class="section__title list__count">財務與職業影像資訊：<span v-if="!fnOccuImages">無5年內資料</span></h4>
      </a-row>
      <div class="precautions">
        <a-row class="precautions__header" type="flex" align="middle">
          <a-icon type="warning" theme="filled" />
          <span class="precautions__headerTitle">提醒事項：</span>
        </a-row>
        <ol class="precautions__listGroup">
          <li class="precautions__list__item">若名單客戶非要保人且有其他保單者，需說明名單客戶及命中保單之要保人資訊。</li>
          <li class="precautions__list__item">若名單客戶非要保人且無查無其他保單者，請說明命中保單之要保人資訊。</li>
        </ol>
      </div>
      <fbl-data-grid
        class="fbl-table"
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template v-slot:template="slotProps">
          <a @click="downloadFile(slotProps.data)" v-if="slotProps.data.imgIdxId && slotProps.data.fileName">{{slotProps.data.fileName}}</a>
        </template>
      </fbl-data-grid>
      
    </section>
    <!-- 有辦理「單筆增額（50萬以上）」***只有保服有*** -->
    <!-- <section class="page__section">
      <a-row type="flex">
        <h4 class="section__title list__count ">有辦理「單筆增額（50萬以上）」者請填本項，(1)資金來源或(2)財務狀況擇一填寫：</h4>
      </a-row>
      <a-row type="flex" :gutter="[15, 16]">
        <a-col>(1) 資金來源：</a-col>
        <a-col class="checkBlock" flex="1">
          <a-checkbox-group name="checkboxgroup" v-model="financialSourceA" style="width: 100%;">
            <a-checkbox v-for="(item, index) in financialSourceOpts" :disabled="isConfirm" :value="item.value" :key="index" class="nowrap">
              <a-space>
                <span style="color: black">{{index + 1}}.{{item.label}}</span>
                <a-input v-if="item.value==='5'" :disabled="isConfirm" v-model="financialSourceAOther" class="otherInput" type="text" />
              </a-space>
            </a-checkbox>              
          </a-checkbox-group>
        </a-col>
      </a-row>

      <a-row type="flex" :gutter="[15, 16]">
        <a-col style="line-height: 30px;">(2) 財務狀況：</a-col>
        <a-col flex="1">
          <a-row type="flex" :gutter="[15, 16]">
            <a-col :span="11">
              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                  <div>
                    要保人家庭年收入
                  </div>
                </a-col>
                <a-col :span="14">
                  <a-input-number 
                  v-model="guarantorAnnualIncome_a" 
                  :min="0"
                  placeholder="輸入金額(大於0)" 
                  :disabled="isConfirm" 
                  class="input-number" />
                  <span>萬元</span>
                </a-col>
              </a-row>

              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                    <div>
                      動產
                    </div>
                    <div class="txt-small">
                      (含動產、股票、基金)
                    </div>
                </a-col>
                <a-col :span="14">
                  <a-input-number 
                  v-model="personalProperty_a" 
                  :min="0"
                  placeholder="輸入金額(大於0)" 
                  :disabled="isConfirm" 
                  class="input-number" />
                  <span>萬元</span>
                </a-col>
              </a-row>

              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                  <div>
                    負債
                  </div>
                </a-col>
                <a-col :span="14">
                  <a-input-number 
                    :min="0"
                      v-model="debt_a" 
                    placeholder="輸入金額(大於0)" 
                    :disabled="isConfirm" 
                    class="input-number" />
                  <span>萬元</span>
                </a-col>
              </a-row>
              
            </a-col>
            <a-col :span="2"></a-col>
            <a-col :span="11">
              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                  <div>
                    被保險人家庭年收入
                  </div>
                </a-col>
                <a-col :span="14">
                  <a-input-number 
                    v-model="insuredAnnualIncome_a" 
                    :min="0"
                    placeholder="輸入金額(大於0)" 
                    :disabled="isConfirm" 
                    class="input-number" />
                  <span>萬元</span>
                </a-col>
              </a-row>

              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                    <div>
                      不動產
                    </div>
                </a-col>
                <a-col :span="14">
                  <a-input-number 
                    v-model="realProperty_a"
                    :min="0"
                    placeholder="輸入金額(大於0)" 
                    :disabled="isConfirm" 
                    class="input-number" />
                  <span>萬元</span>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div class="matchResult__message">
        審查是否合理
        <ol>
          <li>資金來源。</li>
          <li>財務狀況是否顯著不相當。</li>
        </ol>
      </div>
      <div class="precautions">
        <div>
          <a-space>
            <a-icon
              type="warning"
              theme="filled"
              style="color: orange; fontSize: 24px;"
            />            
            <span>提醒：若自行電訪，請一併檢附『電話訪談記錄單』，將檔案轉為PDF檔，到[佐證資料]頁籤上傳</span>
          </a-space>
        </div>
      </div>
    </section> -->
    
    <!-- TODO: 本件之案件類型若無「A-大額還款交易」：灰階不能填寫 -->
    <!-- 有辦理9A「保單還款（50萬以上）」資金來源/財務狀況問項 ***只有客利有*** -->
    <section class="page__section">
      <a-row type="flex">
        <h4 class="section__title list__count">辦理「保單還款（新台幣50萬元以上）」者，(1)資金來源-可以複選 或 (2)財務狀況，擇一填寫：</h4>
      </a-row>
      <div class="precautions">
        <a-row class="precautions__header" type="flex" align="middle">
          <a-icon type="warning" theme="filled" />
          <span class="precautions__headerTitle">審查是否合理：</span>
        </a-row>
        <ol class="precautions__listGroup">
          <li class="precautions__list__item">資金來源。</li>
          <li class="precautions__list__item">財務狀況是否顯著不相當<div>提醒審查事項：若為自行電訪，請一併檢附『電話訪談紀錄單』，將檔案轉為PDF檔，自行上傳到[佐證資料]。</div></li>
        </ol>
      </div>
      <a-row type="flex" :gutter="[15, 16]">
        <a-col>(1) 資金來源：</a-col>
        <a-col class="checkBlock" flex="1">
          <a-checkbox-group name="checkboxgroup" v-model="financialSourceB" style="width: 100%;">
            <a-checkbox v-for="(item, index) in financialSourceOpts" :disabled="isConfirm || !hasCaseAType" :class="{ nowrap : true , displayBlock : item.value==='5'}" :value="item.value" :key="index">
              <span style="color: black; margin-right: 8px">{{index + 1}}.{{item.label}} </span>
              <a-input v-model="financialSourceBOther" v-if="item.value==='5'" :disabled="isConfirm || !hasCaseAType || financialSourceBOther_disabled" style="width: calc(100% - 85px)" :maxLength="60" type="text" placeholder="輸入說明文字"/>
            </a-checkbox>              
          </a-checkbox-group>
        </a-col>
      </a-row>
      <a-row type="flex" :gutter="[15, 16]">
        <a-col style="line-height: 30px;">(2) 財務狀況：</a-col>
        <a-col flex="1">
          <a-row type="flex" :gutter="[15, 16]">
            <a-col :span="11">
              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                  <div>
                    要保人家庭年收入
                  </div>
                </a-col>
                <a-col :span="14">
                  <a-input
                    v-model="guarantorAnnualIncome_b" 
                    :disabled="isConfirm || !hasCaseATyoe" 
                    :min="0"
                    formatter="number"
                    placeholder="輸入金額(大於0)" 
                    class="input-number"
                    @change="filterNumber('guarantorAnnualIncome_b')" />                
                  <span>萬元</span>
                </a-col>
              </a-row>

              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                    <div>
                      動產
                    </div>
                    <div class="txt-small">
                      (含動產、股票、基金)
                    </div>
                </a-col>
                <a-col :span="14">
                  <a-input 
                    v-model="personalProperty_b"
                    :min="0"
                    formatter="number"
                    :disabled="isConfirm || !hasCaseAType" 
                    placeholder="輸入金額(大於0)" 
                    class="input-number"
                    @change="filterNumber('personalProperty_b')" />
                  <span>萬元</span>
                </a-col>
              </a-row>

              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                  <div>
                    負債
                  </div>
                </a-col>
                <a-col :span="14">
                  <a-input
                    v-model="debt_b"
                    :min="0"
                    formatter="number"
                    :disabled="isConfirm || !hasCaseAType" 
                    placeholder="輸入金額(大於0)" 
                    class="input-number"
                    @change="filterNumber('debt_b')" />
                  <span>萬元</span>
                </a-col>
              </a-row>
              
            </a-col>
            <a-col :span="2"></a-col>
            <a-col :span="11">
              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                  <div>
                    被保險人家庭年收入
                  </div>
                </a-col>
                <a-col :span="14">
                  <a-input 
                    v-model="insuredAnnualIncome_b" 
                    :min="0"
                    formatter="number"
                    :disabled="isConfirm || !hasCaseAType" 
                    placeholder="輸入金額(大於0)" 
                    class="input-number"
                    @change="filterNumber('insuredAnnualIncome_b')" />
                  <span>萬元</span>
                </a-col>
              </a-row>

              <a-row type="flex" align="middle" justify="start" :gutter="[0, 16]">
                <a-col :span="10">
                    <div>
                      不動產
                    </div>
                </a-col>
                <a-col :span="14">
                  <a-input 
                    v-model="realProperty_b"
                    :min="0"
                    formatter="number"
                    :disabled="isConfirm || !hasCaseAType" 
                    placeholder="輸入金額(大於0)" 
                    class="input-number"
                    @change="filterNumber('realProperty_b')" />
                  <span>萬元</span>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </section>

    <!-- TODO: 本件之案件類型若無「9-短期密集借/還款交易」：灰階不能填寫 -->
    <!-- 9B有辦理「短期密集借還款」資金來源/用途問項 -->
    <section class="page__section">
      <a-row type="flex">
        <h4 class="section__title list__count">辦理「短期密集借還款」者，請<span class="mark-text">必填</span>(1)借款用途及(2)還款資金來源：</h4>
      </a-row>
      <div class="precautions">
        <a-row class="precautions__header" type="flex" align="middle">
          <a-icon type="warning" theme="filled" />
          <span class="precautions__headerTitle">審查是否合理：</span>
        </a-row>
        <ol class="precautions__listGroup">
          <li class="precautions__list__item">資金來源。</li>
          <li class="precautions__list__item">財務狀況是否顯著不相當<div>提醒審查事項：若為自行電訪，請一併檢附『電話訪談紀錄單』，將檔案轉為PDF檔，自行上傳到[佐證資料]。</div></li>
        </ol>
      </div>
      <div>
        <div>(1) 借款用途(可以複選)：<span class="mark-required">*</span></div>
        <div class="checkBlock">
          <a-checkbox-group name="checkboxgroup" v-model="debitUsed" style="width: 100%;">
            <a-checkbox v-for="(item, index) in debitUsedOpts" :class="{ nowrap : true , displayBlock : item.value==='6'}" :disabled="isConfirm || !hasCaseNineType" :value="item.value" :key="index">
              <span style="color: black; margin-right: 8px">{{index + 1}}.{{item.label}}</span>
              <a-input v-model="debitUsedOther" v-if="item.value==='6'" :disabled="isConfirm || !hasCaseNineType || debitUsedOther_disabled" style="width: calc(100% - 81px)" :maxLength="60" type="text" placeholder="請輸入說明文字"/>
            </a-checkbox>              
          </a-checkbox-group>
        </div>
      </div>
      <div>
        <div>(2) 還款資金來源(可以複選)：<span class="mark-required">*</span></div>
        <div class="checkBlock">
          <a-checkbox-group name="checkboxgroup" v-model="debitSource" style="width: 100%;">
            <a-checkbox v-for="(item, index) in debitSourceOpts" :class="{ nowrap : true , displayBlock : item.value==='6'}" :disabled="isConfirm || !hasCaseNineType" :value="item.value" :key="index">
              <span style="color: black; margin-right: 8px">{{index + 1}}.{{item.label}}</span>
              <a-input v-model="debitSourceOther" v-if="item.value==='6'" :disabled="isConfirm || !hasCaseNineType || debitSource_disabled" style="width: calc(100% - 81px)" :maxLength="60" type="text" placeholder="請輸入說明文字"/>
            </a-checkbox>              
          </a-checkbox-group>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
class Attachment {
  id: string;
  name: string;
  systemType: string;
  insuranceNum: string;
  guarantorName: string;
  type: string;
  fileName: string;
  filePath: string;
  fileScanDate: string;

  constructor(
    id: string,
    name: string,
    systemType: string,
    insuranceNum: string,
    guarantorName: string,
    type: string,
    fileName: string,
    filePath: string,
    fileScanDate: string,
  ) {
    this.id = id;
    this.name = name;
    this.systemType = systemType;
    this.insuranceNum = insuranceNum;
    this.guarantorName = guarantorName;
    this.type = type;
    this.fileName = fileName;
    this.filePath = filePath;
    this.fileScanDate = fileScanDate;
  }
}
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import Vue from "vue";
import Component from "vue-class-component";
import {
  Getter,
  Action,
  namespace } from 'vuex-class';
import { Prop, Watch } from "vue-property-decorator";

import { createHelpers } from 'vuex-map-fields';
import {FnOccuDataVO, FnOccuImageVO} from '@fubonlife/edd-api-axios-sdk';
import Global from "@/plugins/global";
import { Modal } from "ant-design-vue";

const { mapFields } = createHelpers({
  getterType: 'FinanceJobInfo/getField',
  mutationType: 'FinanceJobInfo/updateField',
});

const CustomerData = namespace('CustomerData');
const FinanceJobInfo = namespace('FinanceJobInfo');
@Component({ 
  components: { FblDataGrid },
  computed: {
    ...mapFields(['personalProperty_a',
    'realProperty_a',
    'guarantorAnnualIncome_a',
    'insuredAnnualIncome_a',
    'debt_a',
    'personalProperty_b',
    'realProperty_b',
    'guarantorAnnualIncome_b',
    'insuredAnnualIncome_b',
    'debt_b',
    'financialSourceAOther',
    'financialSourceBOther',
    'debitUsedOther',
    'debitSourceOther',
    'financialSourceA',
    'financialSourceB',
    'debitUsed',
    'debitSource',
    ])
  }
})
export default class FinancialAndJobInfo extends Vue {

  isConfirm : boolean = true;
  @Action public setLoading: (payload: boolean) => void;

  @CustomerData.State selectedCheck;
  @FinanceJobInfo.Action('updateCaseType') updateCaseType

  h = this.$createElement;

  @FinanceJobInfo.State data;
  @FinanceJobInfo.State isFinanceJobinfoUpdate;

  @FinanceJobInfo.Getter getFinanceJobinfoPageLoading;
  @FinanceJobInfo.Action('setFinanceJobinfoPageLoading') setFinanceJobinfoPageLoading;

  hasCaseAType = true;
  hasCaseNineType = true;

  // 財務與職業影像資訊表格
  @FinanceJobInfo.Getter fnOccuImages;
  // 是否為『A-大額還款交易』，若無，［9A 有辦理「保單還款（50萬以上）」資金來源/財務狀況問項］灰階不能填寫
  // @FinanceJobInfo.Getter hasCaseAType;
  // 是否為『9-短期密集借/還款交易』，若無，［9B 有辦理「短期密集借還款」資金來源/用途問項］灰階不能填寫
  // @FinanceJobInfo.Getter hasCaseNineType;

  // data grid
  public grid: FblPDataGridHolder<FnOccuImageVO> = {
    rowKey: "rowkey",
    data: [
      // new Attachment(
      //   "L123545677",
      //   "王先生",
      //   "F",
      //   "1234567890-00-1",
      //   "王先生",
      //   "財務告知書",
      //   "XX1.pdf",
      //   "./test.pdf",
      //   "110/10/26",
      // )
    ],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "custId",
        title: 'ID',
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "custName",
        title: '姓名',
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: '系統別',
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}`;
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "applFname",
        title: "要保人姓名",
      },
      {
        type: FblColumnType.PLAIN,
        property: "docName",
        title: "類型",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "fileName",
        title: "檔案",
        template: "template",
      },
      {
        type: FblColumnType.PLAIN,
        property: "scanDate",
        title: "影像掃描日期",
      },
      {
        type: FblColumnType.PLAIN,
        property: "fileType",
        title: "檔案類別",
      },
      {
        type: FblColumnType.PLAIN,
        property: "fileNo",
        title: "檔案代號",
      },
    ],
  };
  financialSourceOpts: { label: string; value: string;}[] = [
    { value: "1", label: "薪資"},
    { value: "2", label: "投資收入" },
    { value: "3", label: "退休金" },
    { value: "4", label: "存款" },
    { value: "6", label: "財產繼承" },
    { value: "7", label: "貸款" },
    { value: "9", label: "保單借款" },
    { value: "B", label: "終止契約(解約)" },
    { value: "5", label: "其他"}
  ];
  debitUsedOpts: { label: string; value: string }[] = [
    { value: "1", label: "投資理財" },
    { value: "2", label: "教育支出" },
    { value: "3", label: "醫療支出" },
    { value: "4", label: "旅遊支出" },
    { value: "5", label: "購屋" },
    { value: "6", label: "其他" }
  ];
  debitSourceOpts: { label: string; value: string }[] = [
    { value: "1", label: "定儲到期" },
    { value: "2", label: "投資收益" },
    { value: "3", label: "保險給付" },
    { value: "4", label: "績效獎金" },
    { value: "5", label: "年終獎金" },
    { value: "6", label: "其他" }
  ];


  financialSourceBOther_disabled:boolean = true;
  debitUsedOther_disabled:boolean = true;
  debitSource_disabled:boolean = true;

/**
 * Func
 */
  downloadFile({efileNo, imgIdxId, fileName}) {
    this.setLoading(true);
    if(!this.isConfirm) {
      this.$reviewApi.fmsDownloadInReviewUsingGET(efileNo, imgIdxId, {responseType: "blob"})
        .then(resp => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          const downloadName = fileName;
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}`);
          downloadlink.click();
          downloadlink.remove();
        })
        .catch(err => {
          // console.log(err);
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
    }else{
      this.$confirmApi.fmsDownloadInConfirmUsingGET(efileNo, imgIdxId, {responseType: "blob"})
        .then(resp => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          const downloadName = fileName;
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}`);
          downloadlink.click();
          downloadlink.remove();
        })
        .catch(err => {
          // console.log(err);
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
  }
  filterNumber(key) {
    if(this[key] != ''){
      if(this[key] == 0) {
        this[key] = 0;
      }else if(Number(this[key])){
        this[key] = Number(this[key]);
      }else{
        this[key] = '';
      }
    }
  }

  created(){
    if (this.isFinanceJobinfoUpdate) {
      this.setFinanceJobinfoPageLoading(true);
      let data = this.fnOccuImages;
      // 加序號
      data.map((item,index) => {
        return Object.assign(item, {rowkey: index + 1})
      })
      this.grid.data = data;
      this.setFinanceJobinfoPageLoading(false);
    }
  }

/**
 * 監聽
 */
  @Watch('financialSourceB', {immediate: true})
  watchFinancialSourceB(val){
    this.financialSourceBOther_disabled = (val && val.includes('5')) ? false : true;
  }
  @Watch('debitUsed', {immediate: true})
  watchDebitUsed(val){
    this.debitUsedOther_disabled = (val && val.includes('6')) ? false : true;
  }
  @Watch('debitSource', {immediate: true})
  watchDebitSource(val){
    this.debitSource_disabled = (val && val.includes('6')) ? false : true;
  }
  @Watch('selectedCheck', {immediate: true})
  watchCustomerReportData(val){
    // AML大額還款交易名單：代號A :選項D (for 客利)
    // AML短期密集借/還款交易名單：代號9 :選項E (for 客利)
    this.hasCaseAType = val.includes('D');
    this.hasCaseNineType = val.includes('E');
  }
}
</script>

<style lang="scss" scoped>
.input-number {
  width: 60%;
  margin-right: 16px;
}
.txt-small {
  font-size: 14px;
}
.table {
  .ant-table-thead {
    line-height: 26px !important;
  }
}
#million_dollars {
  font-size: 16px;
  line-height: 44px;
  margin-left: 16px;
}

input,.ant-input-number {
  border: 1px #227FA8 solid !important;
}

.nowrap{
  white-space: nowrap;
}

.page__section {
  font-size: 16px;
  &:last-child {
    margin-bottom: 16px;
  }
}

.fbl-table {
  margin-bottom: 25px;
}
::v-deep {
  input[disabled] {
    color: black;
  }
}
.checkBlock {
  line-height: 2.5;
  padding-left: 30px;
  .ant-checkbox-wrapper {
    margin: 0 8px 8px;
  }
}
.displayBlock {
  display: block;
  margin: 0 0 8px 8px !important;
}
</style>
