<template>
  <div style="width: calc(100vw - 50px)" class="card">
    <a-tabs 
      default-active-key="1"
      size="large"
      :tab-position="mode"
      @change="callback"
      @prevClick="callback"
      @nextClick="callback"
    >
    
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon type="apple" />
          客戶基本資料
        </span>
        <template>
          <customer-data style="padding: 20px"></customer-data>
        </template>
      </a-tab-pane>

      <a-tab-pane key="2">
        <span slot="tab">
          <a-icon type="transaction" />
          代為交易之被委託人基本資料
        </span>
        <template>
          <trustor-customer-data style="padding: 20px"></trustor-customer-data>
        </template>
      </a-tab-pane>

      <a-tab-pane key="3">
        <span slot="tab">
          <a-icon type="check-square" />
          控制權辨識資料
        </span>
        <template>
         <control-identify-data style="padding: 20px"></control-identify-data>
        </template>
      </a-tab-pane>
      <a-tab-pane key="4">
        <span slot="tab">
          <a-icon type="profile" />
          交易明細資料
        </span>
        <transaction-details style="padding: 20px"></transaction-details>
      </a-tab-pane>
      <a-tab-pane key="5">
        <span slot="tab">
          <a-icon type="file-search" />
          交易帳號可疑理由之陳述
        </span>
        <transaction-account style="padding: 20px"></transaction-account>
      </a-tab-pane>
      <a-tab-pane key="6">
        <span slot="tab">
          <a-icon type="safety-certificate" />
          符合可疑交易表徵
        </span>
       
      </a-tab-pane>
      <a-tab-pane key="7">
        <span slot="tab">
          <a-icon type="file-word" />
          檢附相關交易資料
        </span>
      </a-tab-pane>
      <a-tab-pane key="8">
        <span slot="tab">
          <a-icon type="file-text" />
          申報機構
        </span>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CustomerData from "@/components/shared/sus-trans/CustomerData.vue";
import TrustorCustomerData from "@/components/shared/sus-trans/TrustorCustomerData.vue";
import ControlIdentifyData from "@/components/shared/sus-trans/ControlIdentifyData.vue";
import TransactionDetails from "@/components/shared/sus-trans/TransactionDetails.vue";
import TransactionAccount from "@/components/shared/sus-trans/TransactionAccount.vue";
import TestTableDemo from "@/components/shared/sus-trans/TestTableDemo.vue";


@Component({ components: { CustomerData, TrustorCustomerData,ControlIdentifyData,TransactionDetails,TransactionAccount,TestTableDemo } })
export default class QrySusTrans2Page extends Vue {
  private mode: string = "top";
  private tabName: { key: string; name: string; value: string }[] = [
    { key: "A", name: "team", value: "客戶基本資料" },
    { key: "B", name: "transaction", value: "代為交易之被委託人基本資料" },
    { key: "C", name: "check-square", value: "控制權辨識資料" },
    { key: "D", name: "profile", value: "交易明細資料" },
    { key: "E", name: "unknown", value: "交易帳號" },
  ];
  private tabIcon: { key: string; value: string }[] = [
    { key: "1", value: "team" },
    { key: "2", value: "transaction" },
    { key: "3", value: "check-square" },
    { key: "4", value: "profile" },
    { key: "5", value: "unknown" },
  ];
  callback() {}

  data() {
    return {};
  }
}
</script>

<style scoped>
.title {
  font-size: 18px;
  color: #227fa8;
  font-weight: Medium;
}
.button {
  background-color: #13c2c2;
  color: white;
  font-size: 16px;
  width: 150px;
  height: 32px;
  float: right;
  bottom: 24px;
}
.container {
  background-color: transparent;
}
.card {
  background: white;
  width: 100%;
  padding: 24px;
  border-radius: 2px;
}

</style>
