<template>
  <div>
    <a-tabs :animated="false" :tabBarGutter="1.5" defaultActiveKey="1" class="transactionTabsBar">
      <a-tab-pane key="1" tab="投保紀錄" v-if="getDeptSectionConfig.transactionRecordPage.insureRecord">
        <section class="page__section" v-if="insureRecord.data.length > 0">
          <fbl-data-grid
            class="fbl-table table"
            :rowKey="( record, index ) => { return index }"
            :columns="insureRecord.columns"
            :data="insureRecord.data"
            :pagination="false"
            :scroll="{ x: 'max-content' }"
          >
          </fbl-data-grid>
          <p class="recordCount" v-if="getDeptSectionConfig.transactionRecordPage.isRecordCountShow">筆數：<span class="numStyle">{{ insureRecord.data.length-1 }}</span>筆</p>
        </section>
        <section class="page__section section__empty" v-else>
          <a-empty>
            <span slot="description">查無資料</span>
          </a-empty>
        </section>
      </a-tab-pane>

      <a-tab-pane key="2" tab="一年內變更紀錄" v-if="getDeptSectionConfig.transactionRecordPage.transactionChangeRecord">
        <section class="page__section" v-if="transactionChangeRecord.data.length > 0">
          <div class="precautions" v-if="getDeptSectionConfig.transactionRecordPage.transactionChangeRecordMessageTxtGroup != null">
            <a-row class="precautions__header" type="flex" align="middle">
              <a-icon type="warning" theme="filled" />
              <span class="precautions__headerTitle">提醒：有以下情形者，審查是否合理</span>
            </a-row>
            <ol class="precautions__listGroup">
              <li class="precautions__list__item" v-for="(item,index) in getDeptSectionConfig.transactionRecordPage.transactionChangeRecordMessageTxtGroup" :key="index">{{item}}</li>
            </ol>
          </div>
          <fbl-data-grid
            class="fbl-table table"
            :rowKey="( record, index ) => { return index }"
            :columns="transactionChangeRecord.columns"
            :data="transactionChangeRecord.data"
            :pagination="false"
            :scroll="{ x: 'max-content' }"
          >
          </fbl-data-grid>
          <p class="recordCount" v-if="getDeptSectionConfig.transactionRecordPage.isRecordCountShow">筆數：<span class="numStyle">{{transactionChangeRecord.data.length-1}}</span>筆</p>
        </section>
        <section class="page__section section__empty" v-else>
          <a-empty>
            <span slot="description">查無資料</span>
          </a-empty>
        </section>
        <section class="page__section section__custNamef" v-if="transactionChangeSumByCustName">
          <a-row type="flex" :gutter="[0, 20]">
            <a-col :span="6"  class="section__custNamef__card" v-for="(item, index) in transactionChangeSumByCustName" :key="index">
              <p>要保人姓名：{{ item.custNamef }}</p>
              <p>約當台幣總金額：{{ formatMoney(item.caseAmtNtdSum) }}</p>
              <p>筆數：{{ item.rowSize }}</p>
            </a-col>
          </a-row>
        </section>
      </a-tab-pane>

      <a-tab-pane key="3" tab="一年內借/還款紀錄" v-if="getDeptSectionConfig.transactionRecordPage.borrowAndRepayRecord">
        <section class="page__section" v-if="borrowAndRepayRecord.data.length > 0">
          <div class="precautions" v-if="getDeptSectionConfig.transactionRecordPage.borrowAndRepayRecordMessageTxtGroup != null">
            <a-row class="precautions__header" type="flex" align="middle">
              <a-icon type="warning" theme="filled" />
              <span class="precautions__headerTitle">
                {{(typeof getDeptSectionConfig.transactionRecordPage.borrowAndRepayRecordMessageTxtGroup == 'string') 
                ? getDeptSectionConfig.transactionRecordPage.borrowAndRepayRecordMessageTxtGroup 
                : "提醒：有以下情形者，審查是否合理"}}
              </span>
            </a-row>
            <ol class="precautions__listGroup" v-if="(typeof getDeptSectionConfig.transactionRecordPage.borrowAndRepayRecordMessageTxtGroup != 'string')">
              <li class="precautions__list__item" v-for="(item,index) in getDeptSectionConfig.transactionRecordPage.borrowAndRepayRecordMessageTxtGroup" :key="index">{{item}}</li>
            </ol>
          </div>
          <fbl-data-grid
            class="fbl-table table"
            :rowKey="( record, index ) => { return index }"
            :columns="borrowAndRepayRecord.columns"
            :data="borrowAndRepayRecord.data"
            :pagination="false"
            :scroll="{ x: 'max-content' }"
          >
          </fbl-data-grid>
          <p class="recordCount" v-if="getDeptSectionConfig.transactionRecordPage.isRecordCountShow">筆數：<span class="numStyle">{{borrowAndRepayRecord.data.length-1}}</span>筆</p>
        </section>
        <section class="page__section section__empty" v-else>
          <a-empty>
            <span slot="description">查無資料</span>
          </a-empty>
        </section>
        <section class="page__section section__custNamef" v-if="borrowAndRepaySumByCustName">
          <a-row type="flex" :gutter="[0, 20]">
            <a-col :span="6"  class="section__custNamef__card" v-for="(item, index) in borrowAndRepaySumByCustName" :key="index">
              <p>要保人姓名：{{ item.custNamef }}</p>
              <p>約當台幣總金額：{{ formatMoney(item.caseAmtNtdSum) }}</p>
              <p>筆數：{{ item.rowSize }}</p>
            </a-col>
          </a-row>
        </section>
      </a-tab-pane>

      <a-tab-pane key="4" tab="一年內繳款50萬以上紀錄" v-if="getDeptSectionConfig.transactionRecordPage.paymentRecord">
        <section class="page__section" v-if="paymentRecord.data.length > 0">
          <!-- <h3 class="section__title">一年內繳款>50萬元之紀錄(含首∕續期保費、單筆增額、彈性繳...等)：</h3> -->
          <div class="precautions" v-if="getDeptSectionConfig.transactionRecordPage.paymentRecordMessageTxtGroup != null">
            <a-row class="precautions__header" type="flex" align="middle">
              <a-icon type="warning" theme="filled" />
              <span class="precautions__headerTitle">
                {{ typeof getDeptSectionConfig.transactionRecordPage.paymentRecordMessageTxtGroup == 'string' 
                ? getDeptSectionConfig.transactionRecordPage.paymentRecordMessageTxtGroup 
                : "審查是否合理：" }}
              </span>
            </a-row>
            <ol class="precautions__listGroup" v-if="(typeof getDeptSectionConfig.transactionRecordPage.paymentRecordMessageTxtGroup != 'string')">
              <li class="precautions__list__item" v-for="(item,index) in getDeptSectionConfig.transactionRecordPage.paymentRecordMessageTxtGroup" :key="index">{{item}}</li>
            </ol>
          </div>
          <fbl-data-grid
            class="fbl-table table"
            :rowKey="( record, index ) => { return index }"
            :columns="paymentRecord.columns"
            :data="paymentRecord.data"
            :pagination="false"
            :scroll="{ x: 'max-content' }"
          >
          </fbl-data-grid>
          <p class="recordCount" v-if="getDeptSectionConfig.transactionRecordPage.isRecordCountShow">筆數：<span class="numStyle">{{paymentRecord.data.length-1}}</span>筆</p>
        </section>
        <section class="page__section section__empty" v-else>
          <a-empty>
            <span slot="description">查無資料</span>
          </a-empty>
        </section>
      </a-tab-pane>
      
      <a-tab-pane key="5" tab="投保二年內解約/借款紀錄" v-if="getDeptSectionConfig.transactionRecordPage.suspendAndBorrowRecord">
        <section class="page__section section__empty" v-if="applInd">
          <div style="margin: auto; text-align: center">
            <img src="@/assets/images/icon-natural-person.svg" /><br>
            <span>要保人為自然人</span>
          </div>
        </section>
        <section class="page__section" v-else-if="suspendAndBorrowRecord.data && suspendAndBorrowRecord.data.length > 0">
          <!-- <h3 class="section__title">要保人為法人，其所有保單於投保後二年內，部分終止∕解約、借款紀錄：</h3> -->
          <div class="precautions">
            <a-row class="precautions__header" type="flex" align="middle">
              <a-icon type="warning" theme="filled" />
              <span class="precautions__headerTitle">審查重點：法人要保人之所有保單，有無類似交易或關聯，原因是否合理。</span>
            </a-row>
          </div>
          <fbl-data-grid
            class="fbl-table table"
            :rowKey="( record, index ) => { return index }"
            :columns="suspendAndBorrowRecord.columns"
            :data="suspendAndBorrowRecord.data"
            :pagination="false"
            :scroll="{ x: 'max-content' }"
          >
          </fbl-data-grid>
          <p class="recordCount" v-if="getDeptSectionConfig.transactionRecordPage.isRecordCountShow">筆數：<span class="numStyle">{{suspendAndBorrowRecord.data.length-1}}</span>筆</p>
        </section>
        <section class="page__section section__empty" v-else>
          <a-empty>
            <span slot="description">查無資料</span>
          </a-empty>
        </section>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">

import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import {TransRecordListVO, TransRecordDataByCustNameVO} from '@fubonlife/edd-api-axios-sdk';
import Global from "@/plugins/global";
import { Getter } from "vuex-class";
@Component({ components: { FblDataGrid } })
export default class TransactionRecordPage extends Vue {
  
  amlDept = sessionStorage["review_assignment_page"].substring(0,2);
  applInd = false;

  // 取得當前部門顯示規則設定
  @Getter getDeptSectionConfig;

  // 投保紀錄 報表
  public insureRecord: FblPDataGridHolder<TransRecordListVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return data.policyNo ? `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}` : '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "custNamef",
        title: "要保人姓名",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "insNamef",
        title: "被保險人",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseDate",
        title: "主契約始期",
      },
      {
        type: FblColumnType.PLAIN,
        property: "cname", // TODO 轉出來的SDK 參數變全小寫??
        title: "主約險種",
      },
      {
        type: FblColumnType.PLAIN,
        property: "billcurr",
        title: "保單幣別",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtQrg",
        title: "年繳化保費",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(data.caseAmtQrg){
            let parts = data.caseAmtQrg.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "methodDesc",
        title: "繳別",
        formatter:(data:TransRecordListVO) => {
          return data.methodDesc !== undefined ? (data.methodDesc ? data.methodDesc : "無") : "";
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "poStatDesc",
        title: "保單主檔狀態",
        formatter: (data) => {
          return data.poStatCode ? `${data.poStatCode} ${(data.poStatDesc)}` : data.poStatDesc;
        },
      },
    ],
  };

  // 一年內變更紀錄 報表
  public transactionChangeRecord: FblPDataGridHolder<TransRecordListVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return data.policyNo ? `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}` : '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "custNamef",
        title: "要保人姓名",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseDate",
        title: "申請日",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "chgDate",  // 理賠
        title: "變更生效日",
        hidden: this.amlDept !== "CL" ? true : false
      },
      {
        type: FblColumnType.PLAIN,
        property: "tranNo",
        title: "變更案號",
      },
      {
        type: FblColumnType.PLAIN,
        property: "statusDesc", // 理賠
        title: "階段碼",
        hidden: this.amlDept !== "CL" ? true : false
      },
      {
        type: FblColumnType.PLAIN,
        property: "tranItem",
        title: "項目",
      },
      {
        type: FblColumnType.PLAIN,
        property: "billcurr",
        title: "保單幣別",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtQrg",
        title: "給付金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.caseAmtQrg)){
            let parts = data.caseAmtQrg.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtNtd",
        title: "約當台幣金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.caseAmtNtd)){
            let parts = data.caseAmtNtd.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "methodDesc",
        title: "給付方式",
        formatter:(data:TransRecordListVO) => {
          return data.methodDesc !== undefined ? (data.methodDesc ? data.methodDesc : "無") : "";
        }
      },
    ],
  };

  // 一年內變更紀錄 理賠by要保人總計
  public transactionChangeSumByCustName: Array<TransRecordDataByCustNameVO>  = [];
  
  // 一年內借/還款紀錄 報表
  public borrowAndRepayRecord: FblPDataGridHolder<TransRecordListVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return data.policyNo ? `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}` : '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "custNamef",
        title: "要保人姓名",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseDate",
        title: "交易日",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "tranNo",
        title: "借/還款案號",
      },
      {
        type: FblColumnType.PLAIN,
        property: "tranItem",
        title: "項目",
      },
      {
        type: FblColumnType.PLAIN,
        property: "billcurr",
        title: "保單幣別",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtQrg",
        title: "給付還款金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.caseAmtQrg)){
            let parts = data.caseAmtQrg.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtNtd",
        title: "約當台幣給付金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.caseAmtNtd)){
            let parts = data.caseAmtNtd.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "methodDesc",
        title: "給付/還款方式",
        formatter:(data:TransRecordListVO) => {
          return data.methodDesc !== undefined ? (data.methodDesc ? data.methodDesc : "無") : "";
        }
      },
    ],
  };
  
  // 一年內借/還款紀錄 理賠by要保人總計
  public borrowAndRepaySumByCustName: Array<TransRecordDataByCustNameVO>  = [];

  // 一年內繳款50萬以上紀錄 報表
  public paymentRecord: FblPDataGridHolder<TransRecordListVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return data.policyNo ? `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}` : '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "custNamef",
        title: "要保人姓名",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "tranItem",
        title: "項目",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "tranNo",
        title: "變更案號/送金單號",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseDate",
        title: "繳費日期",
      },
      {
        type: FblColumnType.PLAIN,
        property: "billcurr",
        title: "保單幣別",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtQrg",
        title: "繳費金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.caseAmtQrg)){
            let parts = data.caseAmtQrg.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtNtd",
        title: "約當台幣金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.caseAmtNtd)){
            let parts = data.caseAmtNtd.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "methodDesc",
        title: "繳費方式",
        formatter:(data:TransRecordListVO) => {
          return data.methodDesc !== undefined ? (data.methodDesc ? data.methodDesc : "無") : "";
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "payName",
        title: "繳款人",
      },
    ],
  };

  // 投保二年內解約/借款紀錄 報表
  public suspendAndBorrowRecord: FblPDataGridHolder<TransRecordListVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        fixed: "left",
        formatter: (data) => {
          return data.policyNo ? `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}` : '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "custNamef",
        title: "要保人姓名",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "effDate",
        title: "契約始期",
        fixed: "left",
      },
      {
        type: FblColumnType.PLAIN,
        property: "poStatDesc",
        title: "契約狀況",
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseDate",
        title: "申請日",
      },
      {
        type: FblColumnType.PLAIN,
        property: "billcurr",
        title: "保單幣別",
      },
      {
        type: FblColumnType.PLAIN,
        property: "tranItem",
        title: "項目",
      },
      {
        type: FblColumnType.PLAIN,
        property: "casePmQrg",
        title: "已繳保費金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.casePmQrg)){
            let parts = data.casePmQrg.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "casePmNtd",
        title: "約當台幣已繳保費金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.casePmNtd)){
            let parts = data.casePmNtd.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtQrg",
        title: "給付金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.caseAmtQrg)){
            let parts = data.caseAmtQrg.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseAmtNtd",
        title: "約當台幣給付金額",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.caseAmtNtd)){
            let parts = data.caseAmtNtd.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "firstPrdCommAmt",
        title: "首期佣金",
        align: "right",
        formatter:(data:TransRecordListVO) => {
          if(!isNaN(data.firstPrdCommAmt)){
            let parts = data.firstPrdCommAmt.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "$" + parts.join('.');
          }
          else return ''
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "orgUnit",
        title: "原招單位",
      },
      {
        type: FblColumnType.PLAIN,
        property: "orgAgentName1",
        title: "原招業務員1",
      },
      {
        type: FblColumnType.PLAIN,
        property: "orgAgentName2",
        title: "原招業務員2",
      },
    ],
  };

  @Watch('amlDept', { immediate: true })
  onChangeTable(){
    // 一年內借/還款紀錄 報表
    this.borrowAndRepayRecord.columns.map(item => {
      if(item.property == 'caseDate') {
        switch(this.amlDept){
          case 'VP':
            item.title = "申請日"
            break;
          case 'MC':
            item.title = "交易日"
            break;
        }
      }else if(item.property == 'tranItem') {
        switch(this.amlDept){
          case 'VP':
            item.title = "項目"
            break;
          case 'MC':
            item.title = "借/還款"
            break;
        }
      }else if(item.property == 'caseAmtQrg') {
        switch(this.amlDept){
          case 'VP':
            item.title = "給付金額"
            break;
          case 'MC':
            item.title = "金額"
            break;
        }
      }else if(item.property == 'caseAmtNtd') {
        switch(this.amlDept){
          case 'VP':
            item.title = "約當台幣金額"
            break;
          case 'MC':
            item.title = "約當台幣金額"
            break;
        }
      }
    })

    // 一年內繳款50萬以上紀錄 報表
    this.paymentRecord.columns.map(item => {
      if(item.property == 'tranItem') {
        switch(this.amlDept){
          case 'VP':
            item.title = "項目"
            break;
          case 'MC':
            item.title = "繳款項目"
            break;
        }
      }
    })
  }

  created(){
    this.fetchTableDatas()
  }

  mounted(){
  }

  fetchTableDatas(){
    const amlID = sessionStorage["review_assignment_page"];

    this.$reviewApi.getTransactionRecordInReviewUsingGET(amlID).then((resp)=>{
      let data = resp.data.data;
      console.log(data)
      
      // 一年內變更紀錄表格 加總計列
      this.transactionChangeRecord.data = this.appendTotalRow(data.transactionChangeRecord, "1");

      // 一年內借/還款紀錄 加總計列
      this.borrowAndRepayRecord.data = this.appendTotalRow(data.borrowAndRepayRecord, "2");

      // 一年內繳款50萬以上紀錄 加總計列
      this.paymentRecord.data = this.appendTotalRow(data.paymentRecord, "3");

      // 投保紀錄
      this.insureRecord.data = this.appendTotalRow(data.insureRecord, "5");

      // 投保二年內解約/借款紀錄
      this.suspendAndBorrowRecord.data = this.appendTotalRow(data.suspendAndBorrowRecord, "9");
      if(!this.suspendAndBorrowRecord.data) { 
        this.applInd = true;
      }

      // 一年內變更紀錄 理賠by要保人總計
      this.transactionChangeSumByCustName = data.transactionChangeSumByCustName;

      // 一年內借/還款紀錄 理賠by要保人總計
      this.borrowAndRepaySumByCustName = data.borrowAndRepaySumByCustName;
    })
  }

  appendTotalRow(gridData, tranType){
    // loading (call api 後 ~ 載入 table data 前) 新增總金額 row
    if (!gridData) { return null; }

    let data = gridData.data;
    if (tranType === "5" || this.amlDept === "CL") { //理賠跟投保紀錄頁籤不需要總計列
      return data;
    }
    if (data.length > 0 ) {
      let totalRow: TransRecordListVO = {};
      totalRow.casePmQrg = tranType === "9" ? gridData.casePmQrgSum : NaN;
      totalRow.casePmNtd = tranType === "9" ? gridData.casePmNtdSum : NaN;
      totalRow.caseAmtQrg = tranType === "9" ? gridData.caseAmtQrgSum : NaN;
      totalRow.caseAmtNtd = gridData.caseAmtNtdSum;
      totalRow.firstPrdCommAmt = tranType === "9" ? gridData.firstPrdCommAmtSum : NaN;
      data.push(totalRow);
    }
    return data;
  }

  formatMoney(money){
    let parts = money.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return "$" + parts.join('.');
  }
}
</script>

<style lang="scss" scoped>
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

.transactionTabsBar {
  ::v-deep {
    .ant-tabs-nav-scroll {
      background-color: initial;
    }
    .ant-tabs-nav {
      .ant-tabs-tab {
        padding-bottom: 7px;
      }
      .ant-tabs-tab-active {
        color: #02829B;
      }
    }
    .ant-tabs-ink-bar {
      background-color: #02829B;
    }
    .fbl-table {
      // border: 1px solid #C7C7C7;
      border-radius: 4px 4px 0px 0px;
      tr:last-of-type{
        font-size: 20px;
      }
    }
    .ant-tabs-bar {
      margin-bottom: 2px;
      z-index: 100 !important;
    }
  }
}

.precautions {
  margin-top: 15px;
  margin-bottom: 15px;
}

.recordCount {
  color: #227FA8;
  text-align: right;
  .numStyle {
    color: #000;
    margin-right: 10px;
  }
}

.section__empty {
  margin-top: 30px;
  margin-bottom: 30px;
}

.section__custNamef {
  margin-top: 30px !important;
  margin-bottom: 30px;
  padding: 0 3%;
  .section__custNamef__card {
    border-left: #13C2C2 solid 5px;
    padding-left: 14px;
    margin: 15px 0;
    font-size: 16px;
    p:first-of-type {
      margin-bottom: 12px;
    }
    P {
      margin-bottom: 2px;
    }
  }
}
</style>
