<template>
  <a-modal
    ref="modal"
    v-model="modalVisible"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    :destroyOnClose="true"
    @cancel="closeAddAndEditModal('cancel')"
  >
    <div class="btnGroup tabline">
      <a-tabs v-model="activeKey" hide-add type="editable-card">
        <!-- 款帳號資訊 -->
        <a-tab-pane key="1" tab="款帳號資訊" :closable="false">
          <div :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
            <div v-show="activeKey === '1'">
              <div class="modal__body">
                <a-form-model
                  ref="cashFormRef"
                  :model="cash"
                  :rules="cashRules"
                  :layout="'vertical'"
                >
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="2">
                      <a-form-model-item prop="isCash" label="新增款">
                        <a-switch
                          v-model="isCash"
                          :disabled="isEdit"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="isCashEffectStatus" label="生效">
                        <a-switch
                          v-model="isCashEffectStatus"
                          :disabled="!isCash"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="isCashDefault" label="預設">
                        <a-switch
                          v-model="isCashDefault"
                          :disabled="!isCash"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="counterpartyId" label="機構編號">
                        <IpkSelect
                          v-model="cash.counterpartyId"
                          :options="counterpartyIdOption"
                          :isDisabled="isEdit || !isCash"
                          placeholder="請至少輸入4位關鍵字搜尋選項清單"
                          :showSearch="true"
                          :showSelfDefined="true"
                          refKey="counterpartyId"
                          @input="onCashCounterpartyIdSelect($event, 'counterpartyId')"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-model-item prop="productId" label="產品別">
                        <IpkSelect
                          v-model="cash.productId"
                          :options="productClassOption"
                          :isDisabled="isEdit || !isCash"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="productId"
                          @input="handleChangeProduct($event, 'cash', 'equity')"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="currency" label="幣別">
                        <IpkSelect
                          v-model="cash.currency"
                          :options="currencyOption"
                          :isDisabled="isEdit || !isCash"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="currency"
                          @input="changeCashOrEquity($event, 'equity', 'currency')"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankCode" label="受款銀行代碼">
                        <IpkAddItemSelect
                          v-model="cash.bfBankCode"
                          :options="bankNoOption"
                          :isDisabled="!isCash"
                          placeholder="請至少輸入4位關鍵字搜尋選項清單"
                          :showSearch="true"
                          :showSelfDefined="true"
                          refKey="bfBankCode"
                          :formRule="3"
                          @input="getBfBankName($event)"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="bfBankName" label="受款銀行名稱">
                        <a-input
                          v-model="cash.bfBankName"
                          placeholder="請輸入"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankAccount" label="受款行銀行帳號">
                        <a-input
                          v-model="cash.bfBankAccount"
                          placeholder="請輸入"
                          :maxLength="50"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankType" label="受款銀行類型">
                        <a-input
                          v-model="cash.bfBankType"
                          placeholder="請輸入"
                          :maxLength="5"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="bfAccountName" label="受款人名稱">
                        <a-input
                          v-model="cash.bfAccountName"
                          placeholder="請輸入"
                          :maxLength="100"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfAccount" label="受款人帳號">
                        <a-input
                          v-model="cash.bfAccount"
                          placeholder="請輸入"
                          :maxLength="50"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="imBankCode" label="中間行代碼">
                        <a-input
                          v-model="cash.imBankCode"
                          placeholder="請輸入"
                          :maxLength="15"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="imBankName" label="中間行名稱">
                        <a-input
                          v-model="cash.imBankName"
                          placeholder="請輸入"
                          :maxLength="50"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="imBankCodeType" label="中間行代碼類型">
                        <a-input
                          v-model="cash.imBankCodeType"
                          placeholder="請輸入"
                          :maxLength="5"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="draweeCode" label="付款人代碼">
                        <a-input
                          v-model="cash.draweeCode"
                          placeholder="請輸入"
                          :maxLength="8"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="draweeName" label="付款人名稱">
                        <a-input
                          v-model="cash.draweeName"
                          placeholder="請輸入"
                          :maxLength="50"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="draweeType" label="付款人類型">
                        <a-input
                          v-model="cash.draweeType"
                          placeholder="請輸入"
                          :maxLength="5"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bfAccountNameCode" label="受款人帳戶名稱代碼">
                        <a-input
                          v-model="cash.bfAccountNameCode"
                          placeholder="請輸入"
                          :maxLength="15"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfAccountNoType" label="受款人帳戶號碼類型">
                        <a-input
                          v-model="cash.bfAccountNoType"
                          placeholder="請輸入"
                          :maxLength="15"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfAccountNameType" label="受款人帳戶名稱類型">
                        <a-input
                          v-model="cash.bfAccountNameType"
                          placeholder="請輸入"
                          :maxLength="15"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankAba" label="受款銀行ABA">
                        <a-input
                          v-model="cash.bfBankAba"
                          placeholder="請輸入"
                          :maxLength="9"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bfBankIban" label="受款銀行IBAN號碼">
                        <a-input
                          v-model="cash.bfBankIban"
                          placeholder="請輸入"
                          :maxLength="34"
                          :disabled="!isCash"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="charges" label="Pay Charges Indicator">
                        <IpkSelect
                          v-model="cash.charges"
                          :options="chargesOption"
                          :isDisabled="!isCash"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="charges"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="indicator" label="Financial Indicator">
                        <IpkSelect
                          v-model="cash.indicator"
                          :options="indicatorOption"
                          :isDisabled="!isCash"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="indicator"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="12">
                      <a-form-model-item prop="memo" label="附言">
                        <a-textarea
                          v-model="cash.memo"
                          placeholder="請輸入"
                          :auto-size="{ minRows: 1, maxRows: 1 }"
                          :disabled="!isCash"
                          style="width: 100%"
                          @change="changeCashOrEquity(cash.memo, 'equity', 'memo')"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="remark" label="備註">
                        <a-textarea
                          v-model="cash.remark"
                          placeholder="請輸入"
                          :auto-size="{ minRows: 1, maxRows: 1 }"
                          :disabled="!isCash"
                          style="width: 100%"
                          @change="changeCashOrEquity(cash.remark, 'equity', 'remark')"
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
            <div v-show="activeKey === '2'">
              <div class="modal__body">
                <a-form-model
                  ref="equityFormRef"
                  :model="equity"
                  :rules="equityRules"
                  :layout="'vertical'"
                >
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="2">
                      <a-form-model-item prop="isEquity" label="新增券">
                        <a-switch
                          v-model="isEquity"
                          :disabled="isEdit"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="isEquityEffectStatus" label="生效">
                        <a-switch
                          v-model="isEquityEffectStatus"
                          :disabled="!isEquity"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="isEquityDefault" label="預設">
                        <a-switch
                          v-model="isEquityDefault"
                          :disabled="!isEquity"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="counterpartyId" label="機構編號">
                        <IpkSelect
                          v-model="equity.counterpartyId"
                          :options="counterpartyIdOption"
                          :isDisabled="isEdit || !isEquity"
                          placeholder="請至少輸入4位關鍵字搜尋選項清單"
                          :showSearch="true"
                          :showSelfDefined="true"
                          refKey="counterpartyId"
                          @input="oneEquityCounterpartyIdSelect($event, 'counterpartyId')"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-model-item prop="productId" label="產品別">
                        <IpkSelect
                          v-model="equity.productId"
                          :options="productClassOption"
                          :isDisabled="isEdit || !isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="productId"
                          @input="handleChangeProduct($event, 'equity', 'cash')"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="currency" label="幣別">
                        <IpkSelect
                          v-model="equity.currency"
                          :options="currencyOption"
                          :isDisabled="isEdit || !isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="currency"
                          @input="changeCashOrEquity($event, 'cash', 'currency')"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="custodian" label="保管行">
                        <IpkSelect
                          v-model="equity.custodian"
                          :options="custodianOption"
                          :isDisabled="!isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="custodian"
                          @input="handleChangeCustodian($event)"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="market" label="Market" :validateStatus="isJPM">
                        <IpkAddItemSelect
                          v-model="equity.market"
                          :options="psetCodeOptionByEquity"
                          :isDisabled="!isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="market"
                          @input="handleChangeEquityMarkt($event)"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="2">
                      <a-form-model-item prop="cycd" label="CyCd" :validateStatus="isBONY">
                        <a-input
                          v-model="equity.cycd"
                          placeholder="請輸入"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-model-item prop="psetCode" label="PSET CODE" :validateStatus="isBONY_JPM">
                        <IpkAddItemSelect
                          v-model="equity.psetCode"
                          :options="psetByMarketOptionByEquity"
                          :isDisabled="!isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="psetCode"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="settlementLocation" label="Settlement Location" :validateStatus="isCITI_TDCC">
                        <IpkAddItemSelect
                          v-model="equity.settlementLocation"
                          :options="settlementLocationOption"
                          :isDisabled="!isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="settlementLocation"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="brokerIdType" label="Broker ID Type" :validateStatus="isBONY_JPM">
                        <IpkAddItemSelect
                          v-model="equity.brokerIdType"
                          :options="brokerOptionByBrokerIdType"
                          :isDisabled="!isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="brokerIdType"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="brokerId" label="Broker ID" :validateStatus="isBONY_JPM">
                        <a-input
                          v-model="equity.brokerId"
                          placeholder="請輸入"
                          :maxLength="20"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="brokerName" label="Broker Name">
                        <a-input
                          v-model="equity.brokerName"
                          placeholder="請輸入"
                          :maxLength="50"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="clearerIdType" label="Clearer ID Type" :validateStatus="isBONY_JPM">
                        <IpkAddItemSelect
                          v-model="equity.clearerIdType"
                          :options="brokerOptionByClearerIdType"
                          :isDisabled="!isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="clearerIdType"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clearerId" label="Clearer ID" :validateStatus="isBONY_JPM_TDCC">
                        <a-input
                          v-model="equity.clearerId"
                          placeholder="請輸入"
                          :maxLength="20"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="clearerName" label="Clearer Name">
                        <a-input
                          v-model="equity.clearerName"
                          placeholder="請輸入"
                          :maxLength="50"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="brokerAccount" label="Broker Account" :validateStatus="isBONY_JPM">
                        <a-input
                          v-model="equity.brokerAccount"
                          placeholder="請輸入"
                          :maxLength="30"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clearerAccount" label="Clearer Account" :validateStatus="isBONY">
                        <a-input
                          v-model="equity.clearerAccount"
                          placeholder="請輸入"
                          :maxLength="30"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="settlementIndicator" label="Settlement Indicator">
                        <a-input
                          v-model="equity.settlementIndicator"
                          placeholder="請輸入"
                          :maxLength="20"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bsCodeType" label="Buyer/Seller code Type" :validateStatus="isCITI">
                        <IpkAddItemSelect
                          v-model="equity.bsCodeType"
                          :options="brokerOptionByBsCodeType"
                          :isDisabled="!isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="bsCodeType"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bsCode" label="Buyer/Seller Code" :validateStatus="isCITI">
                        <a-input
                          v-model="equity.bsCode"
                          placeholder="請輸入"
                          :maxLength="20"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="bsName" label="Buyer/Seller Name" :validateStatus="isCITI_TDCC">
                        <a-input
                          v-model="equity.bsName"
                          placeholder="請輸入"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="clAgentCodeType" label="Clearer Agent Code Type" :validateStatus="isCITI">
                        <a-input
                          v-model="equity.clAgentCodeType"
                          placeholder="請輸入"
                          :maxLength="10"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clAgentCode" label="Clearer Agent code/ Clearing Broker" :validateStatus="isCITI_TDCC">
                        <a-input
                          v-model="equity.clAgentCode"
                          placeholder="請輸入"
                          :maxLength="15"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="clAgentName" label="Clearer Agent Name">
                        <a-input
                          v-model="equity.clAgentName"
                          placeholder="請輸入"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="equityTdccAccount" label="股權集保帳號">
                        <a-input
                          v-model="equity.equityTdccAccount"
                          placeholder="請輸入"
                          :maxLength="12"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="brokerage" label="證券商(130)">
                        <a-input
                          v-model="equity.brokerage"
                          placeholder="請輸入"
                          :maxLength="20"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="brokerageCode" label="證券代號">
                        <a-input
                          v-model="equity.brokerageCode"
                          placeholder="請輸入"
                          :maxLength="50"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bondTdccAccount" label="債券集保帳號">
                        <a-input
                          v-model="equity.bondTdccAccount"
                          placeholder="請輸入"
                          :maxLength="11"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="pdAccountBank" label="公債帳號對應銀行">
                        <a-input
                          v-model="equity.pdAccountBank"
                          placeholder="請輸入"
                          :maxLength="30"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="pdAccount" label="公債帳號">
                        <a-input
                          v-model="equity.pdAccount"
                          placeholder="請輸入"
                          :maxLength="14"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="pdAccountName" label="公債帳號戶名">
                        <a-input
                          v-model="equity.pdAccountName"
                          placeholder="請輸入"
                          :maxLength="30"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="taxId" label="統編">
                        <a-input
                          v-model="equity.taxId"
                          placeholder="請輸入"
                          :maxLength="8"
                          :disabled="!isEquity"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="12">
                      <a-form-model-item prop="memo" label="附言">
                        <a-textarea
                          v-model="equity.memo"
                          placeholder="請輸入"
                          :auto-size="{ minRows: 1, maxRows: 1 }"
                          :disabled="!isEquity"
                          style="width: 100%"
                          @change="cash.memo = equity.memo"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="remark" label="備註">
                        <a-textarea
                          v-model="equity.remark"
                          placeholder="請輸入"
                          :auto-size="{ minRows: 1, maxRows: 1 }"
                          :disabled="!isEquity"
                          style="width: 100%"
                          @change="cash.remark = equity.remark"
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
        <a-tab-pane key="3" tab="聯絡資訊" :closable="false">
          <div :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
            <div v-show="activeKey === '3'">
              <div class="modal__body">
                <a-form-model :model="contact" :layout="'vertical'">
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="12">
                      <a-form-model-item label="通訊地址">
                        <a-input
                          v-model="contact.address"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="傳真號碼一">
                        <a-input
                          v-model="contact.faxNumber1"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="傳真號碼二">
                        <a-input
                          v-model="contact.faxNumber2"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item label="連絡人姓名一">
                        <a-input
                          v-model="contact.licenserName1"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人電話一">
                        <a-input
                          v-model="contact.licenserTel1"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人行動電話一">
                        <a-input
                          v-model="contact.licenserMobile1"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人E-MAIL一">
                        <a-input
                          v-model="contact.licenserEmail1"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item label="連絡人姓名二">
                        <a-input
                          v-model="contact.licenserName2"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人電話二">
                        <a-input
                          v-model="contact.licenserTel2"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人行動電話二">
                        <a-input
                          v-model="contact.licenserMobile2"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人E-MAIL二">
                        <a-input
                          v-model="contact.licenserEmail2"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item label="連絡人姓名三">
                        <a-input
                          v-model="contact.licenserName3"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人電話三">
                        <a-input
                          v-model="contact.licenserTel3"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人行動電話三">
                        <a-input
                          v-model="contact.licenserMobile3"
                          class="checkInfo__input"
                          disabled
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item label="連絡人E-MAIL三">
                        <a-input
                          v-model="contact.licenserEmail3"
                          class="checkInfo__input"
                          disabled
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
            <div v-show="activeKey === '4'">
              <div class="modal__body">
                <a-form-model
                  ref="attachmentFormRef"
                  :model="attachment"
                  :rules="attachmentRules"
                  :layout="'vertical'"
                >
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="attachmentType" label="檔案類型">
                        <IpkSelect
                          v-model="attachment.attachmentType"
                          :options="fileTypeOption"
                          :isDisabled="!isCash && !isEquity"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="attachmentType"
                          @input="changeAttachmentType($event)"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="productCode" label="產品代碼">
                        <IpkSelect
                          v-model="attachment.productCode"
                          :options="productCodeOption"
                          :isDisabled="(!isCash && !isEquity) || attachment.attachmentType !== '3'"
                          placeholder="請至少輸入4位關鍵字搜尋選項清單"
                          :showSearch="true"
                          :showSelfDefined="true"
                          refKey="productCode"
                          @input="validateAttachmentCol($event, 'productCode')"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="market" label="市場別">
                        <IpkSelect
                          v-model="attachment.market"
                          :options="psetCodeOptionByAttachment"
                          :isDisabled="(!isCash && !isEquity) ||attachment.attachmentType !== '3'"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="market"
                          @input="validateAttachmentCol($event, 'market')"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true" class="mt-3">
                    <a-col :span="24">
                      <UploadDragger
                        :fileUploadData="fileUploadData"
                        :fileList="fileList"
                        @deleteFile="deleteUpload"
                        @handleChange="handleChange"
                      />
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="24" style="text-align: right" class="mb-2">
                      <!-- TODO: 權限待修改 -->
                      <IpkButton
                        buttonType="primary"
                        buttonText="上傳"
                        iconType="upload"
                        :buttonDisabled="(!isCash && !isEquity)"
                        :childrenTab="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
                        :buttonKey="$cfButtonKey.buttonKey.UPLOAD.val"
                        @handleBtnEmit="handleUpload"
                      />
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="24">
                      <IpkVxeTable
                        :ipkGrid="ipkAttachmentGrid"
                        @getPendingSelected="handleDeleteFile($event)"
                        @openCheckInfoModal="handleDownload($event)"
                      />
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
        v-if="!isEdit"
        buttonType="lightBlue"
        buttonText="清空"
        iconImg="icon__clear"
        :isAuthorize="false"
        @handleBtnEmit="reset()"
      />
      <IpkButton
        buttonType="lightBlue"
        buttonText="取消"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="closeAddAndEditModal('cancel')"
      />
      <IpkButton
        buttonType="primary"
        buttonText="送出"
        iconType="check"
        :buttonDisabled="submitDisabled"
        :childrenTab="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
        :buttonKey="buttonKey"
        @handleBtnEmit="handleSubmit"
      />
    </template>
  </a-modal>
</template>

<script src="./SsiAddAndEditModal.ts" lang="ts"/>

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
  .ant-tabs-bar {
    margin: 0 0 5px 0;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    background: $COLOR-WHITE;
    border-bottom: 3px solid $COLOR-MAIN2 !important;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    background: $COLOR-WHITE;
    border: 1px solid $COLOR-WHITE;
  }
  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
  .checkInfo__input {
    border: none;
    border-bottom: 1px solid $COLOR-GRAY13;
    border-radius: 0;
    color: $COLOR-MAIN2;
    font-size: 16px;
    padding: 0;
    background-color: transparent;
  }
  .select__btn--default {
    color: $COLOR-MAIN15;
  }
  .icon--clear{
    display: inline-block;
    width: 20px;
    height: 10px;
		background: url('~@images/icon_clear.svg') no-repeat center;
		&:focus, &:hover {
			background: url('~@images/icon_clear_blue.svg') no-repeat center;
		}
  }
}
</style>
