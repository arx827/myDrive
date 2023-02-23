<template>
  <a-modal
    v-model="modalVisible"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    :body-style="{ maxHeight: '700px', overflow: 'hidden', overflowY: 'scroll'}"
    :destroyOnClose="true"
    @cancel="closeCheckInfoModal"
  >
    <div class="btnGroup tabline">
      <a-tabs v-model="activeKey" hide-add type="editable-card">
        <!-- 款帳號資訊 -->
        <a-tab-pane key="1" tab="款帳號資訊" :closable="false">
          <div :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
            <div v-if="activeKey === '1'">
              <div class="modal__body">
                <a-form-model
                  ref="cashFormRef"
                  :model="cash"
                  :layout="'vertical'"
                  class="checkInfo"
                >
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="2">
                      <a-form-model-item prop="isCash" label="新增款">
                        <a-input
                          v-model="isCash"
                          placeholder=""
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="effectStatus" label="生效">
                        <a-input
                          v-model="cash.effectStatus"
                          placeholder=""
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="isDefault" label="預設">
                        <a-input
                          v-model="cash.isDefault"
                          placeholder=""
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="counterpartyId" label="機構編號">
                        <a-input
                          v-model="cash.counterpartyId"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-model-item prop="productName" label="產品別">
                        <a-input
                          v-model="cash.productName"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="currency" label="幣別">
                        <a-input
                          v-model="cash.currency"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankCode" label="受款銀行代碼">
                        <a-input
                          v-model="cash.bfBankCode"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="bfBankName" label="受款銀行名稱">
                        <a-input
                          v-model="cash.bfBankName"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankAccount" label="受款行銀行帳號">
                        <a-input
                          v-model="cash.bfBankAccount"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankType" label="受款銀行類型">
                        <a-input
                          v-model="cash.bfBankType"
                          class="checkInfo__input"
                          :maxLength="5"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="bfAccountName" label="受款人名稱">
                        <a-input
                          v-model="cash.bfAccountName"
                          class="checkInfo__input"
                          :maxLength="100"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfAccount" label="受款人帳號">
                        <a-input
                          v-model="cash.bfAccount"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="imBankCode" label="中間行代碼">
                        <a-input
                          v-model="cash.imBankCode"
                          class="checkInfo__input"
                          :maxLength="15"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="imBankName" label="中間行名稱">
                        <a-input
                          v-model="cash.imBankName"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="imBankCodeType" label="中間行代碼類型">
                        <a-input
                          v-model="cash.imBankCodeType"
                          class="checkInfo__input"
                          :maxLength="5"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="draweeCode" label="付款人代碼">
                        <a-input
                          v-model="cash.draweeCode"
                          class="checkInfo__input"
                          :maxLength="8"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="draweeName" label="付款人名稱">
                        <a-input
                          v-model="cash.draweeName"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="draweeType" label="付款人類型">
                        <a-input
                          v-model="cash.draweeType"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item
                        prop="bfAccountNameCode"
                        label="受款人帳戶名稱代碼"
                      >
                        <a-input
                          v-model="cash.bfAccountNameCode"
                          class="checkInfo__input"
                          :maxLength="15"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfAccountNoType" label="受款人帳戶號碼類型">
                        <a-input
                          v-model="cash.bfAccountNoType"
                          class="checkInfo__input"
                          :maxLength="15"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfAccountNameType" label="受款人帳戶名稱類型">
                        <a-input
                          v-model="cash.bfAccountNameType"
                          class="checkInfo__input"
                          :maxLength="15"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankAba" label="受款銀行ABA">
                        <a-input
                          v-model="cash.bfBankAba"
                          class="checkInfo__input"
                          :maxLength="9"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankIban" label="受款銀行IBAN號碼">
                        <a-input
                          v-model="cash.bfBankIban"
                          class="checkInfo__input"
                          :maxLength="34"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="payChargesIndicator" label="Pay Charges Indicator">
                        <a-input
                          v-model="cash.charges"
                          class="checkInfo__input"
                          :maxLength="100"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="financialIndicator" label="Financial Indicator">
                        <a-input
                          v-model="cash.indicator"
                          class="checkInfo__input"
                          :maxLength="100"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="12">
                      <a-form-model-item prop="memo" label="附言">
                        <a-textarea
                          v-model="cash.memo"
                          class="checkInfo__input"
                          :auto-size="{ minRows: 1, maxRows: 1 }"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="remark" label="備註">
                        <a-textarea
                          v-model="cash.remark"
                          class="checkInfo__input"
                          :auto-size="{ minRows: 1, maxRows: 1 }"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <!-- 券帳號資訊 -->
        <a-tab-pane key="2" tab="券帳號資訊" :closable="false">
          <div :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
            <div v-if="activeKey === '2'">
              <div class="modal__body">
                <a-form-model
                  ref="equityFormRef"
                  :model="equity"
                  :layout="'vertical'"
                  class="checkInfo"
                >
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="2">
                      <a-form-model-item prop="isEquity" label="新增券">
                        <a-input
                          v-model="isEquity"
                          placeholder=""
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="effectStatus" label="生效">
                        <a-input
                          v-model="equity.effectStatus"
                          placeholder=""
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="isDefault" label="預設">
                        <a-input
                          v-model="equity.isDefault"
                          placeholder=""
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="counterpartyId" label="機構編號">
                        <a-input
                          v-model="equity.counterpartyId"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-model-item prop="productName" label="產品別">
                        <a-input
                          v-model="equity.productName"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="currency" label="幣別">
                        <a-input
                          v-model="equity.currency"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="custodian" label="保管行">
                        <a-input
                          v-model="equity.custodian"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="market" label="Market">
                        <a-input
                          v-model="equity.market"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="cycd" label="CyCd">
                        <a-input
                          v-model="equity.cycd"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-model-item prop="psetCode" label="PSET CODE">
                        <a-input
                          v-model="equity.psetCode"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item
                        prop="settlementLocation"
                        label="settlement Location"
                      >
                        <a-input
                          v-model="equity.settlementLocation"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item
                        prop="brokerIdType"
                        label="Broker ID Type"
                      >
                        <a-input
                          v-model="equity.brokerIdType"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="brokerId" label="Broker ID">
                        <a-input
                          v-model="equity.brokerId"
                          class="checkInfo__input"
                          :maxLength="20"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="brokerName" label="Broker Name">
                        <a-input
                          v-model="equity.brokerName"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="clearerIdType" label="Clearer ID Type">
                        <a-input
                          v-model="equity.clearerIdType"
                          class="checkInfo__input"
                          :maxLength="20"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clearerId" label="Clearer ID">
                        <a-input
                          v-model="equity.clearerId"
                          class="checkInfo__input"
                          :maxLength="20"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="clearerName" label="Clearer Name">
                        <a-input
                          v-model="equity.clearerName"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="brokerAccount" label="Broker Account">
                        <a-input
                          v-model="equity.brokerAccount"
                          class="checkInfo__input"
                          :maxLength="30"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clearerAccount" label="Clearer Account">
                        <a-input
                          v-model="equity.clearerAccount"
                          class="checkInfo__input"
                          :maxLength="30"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item
                        prop="settlementIndicator"
                        label="settlement Indicator"
                      >
                        <a-input
                          v-model="equity.settlementIndicator"
                          class="checkInfo__input"
                          :maxLength="20"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bsCodeType" label="Buyer/Seller Code Type">
                        <a-input
                          v-model="equity.bsCodeType"
                          class="checkInfo__input"
                          :maxLength="20"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bsCode" label="Buyer/Seller Code">
                        <a-input
                          v-model="equity.bsCode"
                          class="checkInfo__input"
                          :maxLength="20"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="bsName" label="Buyer/Seller Name">
                        <a-input
                          v-model="equity.bsName"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="clAgentCodeType" label="Clearer Agent Code Type">
                        <a-input
                          v-model="equity.clAgentCodeType"
                          class="checkInfo__input"
                          :maxLength="10"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clAgentCode" label="Clearer Agent code/ ClearingBroker">
                        <a-input
                          v-model="equity.clAgentCode"
                          class="checkInfo__input"
                          :maxLength="15"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="clAgentName" label="Clearing Agent Name">
                        <a-input
                          v-model="equity.clAgentName"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="equityTdccAccount" label="股權集保帳號">
                        <a-input
                          v-model="equity.equityTdccAccount"
                          class="checkInfo__input"
                          :maxLength="12"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="brokerage" label="證券商(130)">
                        <a-input
                          v-model="equity.brokerage"
                          class="checkInfo__input"
                          :maxLength="20"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="brokerageCode" label="證券代號">
                        <a-input
                          v-model="equity.brokerageCode"
                          class="checkInfo__input"
                          :maxLength="50"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bondTdccAccount" label="債券集保帳號">
                        <a-input
                          v-model="equity.bondTdccAccount"
                          class="checkInfo__input"
                          :maxLength="11"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="pdAccountBank" label="公債帳號對應銀行">
                        <a-input
                          v-model="equity.pdAccountBank"
                          class="checkInfo__input"
                          :maxLength="30"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="pdAccount" label="公債帳號">
                        <a-input
                          v-model="equity.pdAccount"
                          class="checkInfo__input"
                          :maxLength="14"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="pdAccountName" label="公債帳號戶名">
                        <a-input
                          v-model="equity.pdAccountName"
                          class="checkInfo__input"
                          :maxLength="30"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="taxId" label="統編">
                        <a-input
                          v-model="equity.taxId"
                          class="checkInfo__input"
                          :maxLength="8"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="12">
                      <a-form-model-item prop="memo" label="附言">
                        <a-textarea
                          v-model="equity.memo"
                          class="checkInfo__input"
                          :auto-size="{ minRows: 1, maxRows: 1 }"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="remark" label="備註">
                        <a-textarea
                          v-model="equity.remark"
                          class="checkInfo__input"
                          :auto-size="{ minRows: 1, maxRows: 1 }"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <!-- 聯絡資訊 -->
        <a-tab-pane v-if="!isPending" key="3" tab="聯絡資訊" :closable="false">
          <div :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
            <div v-if="activeKey === '3'">
              <div class="modal__body">
                <a-form-model
                  ref="contentForm"
                  :model="contact"
                  :layout="'vertical'"
                  class="checkInfo"
                >
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="12">
                      <a-form-model-item prop="isEquity" label="通訊地址">
                        <a-input
                          v-model="contact.address"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="傳真號碼一">
                        <a-input
                          v-model="contact.faxNumber1"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="傳真號碼二">
                        <a-input
                          v-model="contact.faxNumber2"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item label="連絡人姓名一">
                        <a-input
                          v-model="contact.licenserName1"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人電話一">
                        <a-input
                          v-model="contact.licenserTel1"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人行動電話一">
                        <a-input
                          v-model="contact.licenserMobile1"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人E-MAIL一">
                        <a-input
                          v-model="contact.licenserEmail1"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item label="連絡人姓名二">
                        <a-input
                          v-model="contact.licenserName2"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人電話二">
                        <a-input
                          v-model="contact.licenserTel2"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人行動電話二">
                        <a-input
                          v-model="contact.licenserMobile2"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人E-MAIL二">
                        <a-input
                          v-model="contact.licenserEmail2"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item label="連絡人姓名三">
                        <a-input
                          v-model="contact.licenserName3"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人電話三">
                        <a-input
                          v-model="contact.licenserTel3"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人行動電話三">
                        <a-input
                          v-model="contact.licenserMobile3"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人E-MAIL三">
                        <a-input
                          v-model="contact.licenserEmail3"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <!-- 上傳附件 -->
        <a-tab-pane key="4" tab="上傳附件" :closable="false">
          <div :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
            <div v-if="activeKey === '4'">
              <div class="modal__body">
                <a-form-model
                  ref="attachmentFormRef"
                  :layout="'vertical'"
                  class="checkInfo"
                >
                  <a-row :gutter="[24]" type="flex" :wrap="true">
                    <a-col :span="24">
                      <div>
                        <IpkVxeTable
                          :ipkGrid="ipkGrid"
                          @openCheckInfoModal="handleDownload($event)"
                        />
                      </div>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template slot="footer">
      <IpkButton
        buttonType="lightBlue"
        buttonText="關閉"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="closeCheckInfoModal"
      />
      <!-- 資料明細與待放行頁籤共用檢視彈窗，放行/拒絕為待放行頁籤功能。 -->
      <IpkButton
        v-if="isPending"
        buttonType="lightBlue"
        buttonText="拒絕"
        iconType="stop"
        :buttonDisabled="isDisabled"
        :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleReject"
      />
      <IpkButton
        v-if="isPending"
        buttonType="primary"
        buttonText="放行"
        iconType="check"
        :buttonDisabled="isDisabled"
        :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleReview"
      />
    </template>
  </a-modal>
</template>

<script src="./SsiCheckInfoModal.ts" lang="ts"/>

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-bar {
    margin-bottom: 0 !important;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    background: $COLOR-WHITE;
    border-bottom: 3px solid $COLOR-MAIN2 !important;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    background: $COLOR-WHITE;
    border: 1px solid $COLOR-WHITE;
  }
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
  .ant-modal-body {
    padding: 5px 10px;
  }
  .checkInfo {
    .ant-input {
      border: none;
      border-radius: 0;
      resize: none;
      cursor: default;
    }
    .ant-input[disabled] {
      background-color: transparent;
    }
    .checkInfo__input {
      border: none;
      border-bottom: 1px solid $COLOR-GRAY13;
      border-radius: 0;
      color: $COLOR-MAIN2;
      font-size: 16px;
      padding: 0;
    }
  }
}
</style>
