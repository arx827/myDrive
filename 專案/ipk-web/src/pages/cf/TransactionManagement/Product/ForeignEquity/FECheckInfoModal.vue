<template>
  <div>
    <a-modal
      v-model="checkInfoModalVisible"
      :maskClosable="false"
      :keyboard="false"
      :width="'70%'"
      :after-close="closeCheckInfoModal"
      :class="[`modal-cfStatus__${dividerBase}`]"
      :destroyOnClose="true"
    >
      <div class="tabline">
        <a-tabs v-model="activeKey" hide-add type="editable-card">
          <!-- 前台成交資訊 -->
          <a-tab-pane
            :key="$authService.mainTab.key"
            :tab="$authService.mainTab.label"
            :closable="false"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === $authService.mainTab.key">
                <CheckInfoForm
                  :form="main"
                  badgeKey="cfStatusEnum"
                />
              </div>
            </div>
          </a-tab-pane>
          <!-- 其他成交資訊 -->
          <a-tab-pane
            :key="$authService.otherTab.key"
            :tab="$authService.otherTab.label"
            :closable="false"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === $authService.otherTab.key">
                <CheckInfoForm
                  :form="other"
                  badgeKey="cfStatusEnum"
                />
              </div>
            </div>
          </a-tab-pane>
          <!-- 收付款資訊 -->
          <a-tab-pane
            :key="$authService.ssiTab.key"
            :tab="$authService.ssiTab.label"
            :closable="false"
            :disabled="main.cfStatus.key === $cfEnum.cfStatusConstant.RETURN_UNLOCKED.val || main.cfStatus.key === $cfEnum.cfStatusConstant.EMPTY.val"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-show="activeKey === $authService.ssiTab.key">
                <a-form-model
                  ref="formRef"
                  layout="vertical"
                  :model="ssi"
                  :rules="ssiRules"
                >
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="safekeepingAccount" label="Safekeeping Account">
                        <a-input
                          v-model="ssi.safekeepingAccount"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" justify="center" align="bottom" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="brokerIdType" label="Broker ID Type">
                        <a-input
                          v-model="ssi.brokerIdType"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="brokerId" label="Broker ID">
                        <a-input
                          v-model="ssi.brokerId"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="brokerAccount" label="Broker Account">
                        <a-input
                          v-model="ssi.brokerAccount"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-model-item prop="memo" label="Special Instruction">
                        <a-input
                          v-model="ssi.memo"
                          placeholder="請輸入"
                          :disabled="disabledSsiTabCol"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="1">
                      <!-- TODO: 按鈕樣式待調整 -->
                      <a-button class="upload__btn" @click="openSsiCheckInfoModal">
                        <a-icon type="paper-clip" />
                      </a-button>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="clearerIdType" label="Clearer ID Type">
                        <a-input
                          v-model="ssi.clearerIdType"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clearerId" label="Clearer ID">
                        <a-input
                          v-model="ssi.clearerId"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clearerAccount" label="Clearer Account">
                        <a-input
                          v-model="ssi.clearerAccount"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="bsCodeType" label="Buyer/Seller code Type">
                        <a-input
                          v-model="ssi.bsCodeType"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bsCode" label="Buyer/Seller code">
                        <a-input
                          v-model="ssi.bsCode"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="bsName" label="Buyer/Seller Name">
                        <a-input
                          v-model="ssi.bsName"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="clAgentCodeType" label="Clearing Agent Code Type">
                        <a-input
                          v-model="ssi.clAgentCodeType"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clAgentCode" label="Clearing Agent Code">
                        <a-input
                          v-model="ssi.clAgentCode"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="clearerName" label="Clearer Name">
                        <a-input
                          v-model="ssi.clearerName"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="market" label="Market">
                        <a-input
                          v-model="ssi.market"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="cycd" label="cycd">
                        <a-input
                          v-model="ssi.cycd"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="psetCode" label="PSET CODE">
                        <a-select
                          v-model="ssi.psetCode"
                          placeholder="請選擇"
                          allowClear
                          :disabled="disabledSsiTabCol"
                          @select="changeTxSsi"
                        >
                          <a-select-option
                            v-for="(item, index) in psetCodeOption"
                            :key="index"
                            :value="item.value"
                          >
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="settlementLocation" label="Settlement Location">
                        <a-input
                          v-model="ssi.settlementLocation"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="pot" label="Settlement Transaction Indicator">
                        <a-input
                          v-model="ssi.pot"
                          placeholder="請輸入"
                          :maxLength="10"
                          :disabled="disabledSsiTabCol"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="potNarrative" label="Place of Trade">
                        <a-input
                          v-model="ssi.potNarrative"
                          placeholder="請輸入"
                          :maxLength="10"
                          :disabled="disabledSsiTabCol"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="indicator" label="Place of Trade Narrative">
                        <a-input
                          v-model="ssi.indicator"
                          placeholder="請輸入"
                          :maxLength="10"
                          :disabled="disabledSsiTabCol"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="equityCutOffDate" label="保銀下指示日期">
                        <a-date-picker
                          v-model="ssi.equityCutOffDate"
                          format="YYYY/MM/DD"
                          placeholder="請輸入"
                          style="width: 100%"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="equityCutOffTime" label="保銀下指示時間">
                        <a-time-picker
                          v-model="ssi.equityCutOffTime"
                          format="HH:mm"
                          placeholder="請選擇時間"
                          style="width: 100%"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="equityBufferTime" label="目標放行時間">
                        <a-time-picker
                          v-model="ssi.equityBufferTime"
                          format="HH:mm"
                          placeholder="請選擇時間"
                          style="width: 100%"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="lastTx" label="前次交易日期">
                        <a-input
                          v-model="ssi.lastTx"
                          placeholder="請輸入"
                          :disabled="true"
                          style="width: 100%"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </div>
          </a-tab-pane>
          <!-- 上傳附件 -->
          <a-tab-pane
            :key="$authService.attachmentTab.key"
            :tab="$authService.attachmentTab.label"
            :closable="false"
            :disabled="main.cfStatus.key === $cfEnum.cfStatusConstant.RETURN_UNLOCKED.val || main.cfStatus.key === $cfEnum.cfStatusConstant.EMPTY.val"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === $authService.attachmentTab.key">
                <UploadDragger
                  :fileUploadData="fileUploadData"
                  :fileList="attachmentInfo"
                  @handleChange="handleChange"
                  @deleteFile="deleteUpload"
                  @handleDownload="handleDownloadAttachment"
                />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template slot="footer">
        <div class="btnGroup tabline">
          <IpkButton
            buttonType="primary"
            buttonText="鎖定"
            iconType="lock"
            :buttonDisabled="!isEmpty(main.cfStatus.key)
              && main.cfStatus.key !== $cfEnum.cfStatusConstant.RETURN_UNLOCKED.val"
            :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataLock"
          />
          <IpkButton
            buttonType="primary"
            buttonText="資料比對"
            iconImg="icon__comparison"
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.LOCK.val"
            :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataComparison"
          />
          <!-- 已比對後，都可以點擊按鈕 -->
          <IpkButton
            buttonType="primary"
            buttonText="產檔"
            iconType="download"
            :buttonDisabled="isEmpty(main.cfStatus.key) || main.cfStatus.key < 2"
            :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
            @handleBtnEmit="handleDataFile"
          />
          <IpkButton
            buttonType="primary"
            buttonText="列印"
            iconType="printer"
            :buttonDisabled="isEmpty(main.cfStatus.key) || main.cfStatus.key < 2"
            :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
            @handleBtnEmit="handleDataPrint"
          />
          <!-- 已比對後，都可以點擊按鈕 -->
          <IpkButton
            buttonType="primary"
            buttonText="交易確認"
            iconType="check"
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.COMPARED.val"
            :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataConfirm"
          />
          <IpkButton
            buttonType="lightRed"
            buttonText="退回"
            iconType="stop"
            :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataReturn"
          />
          <IpkButton
            buttonType="lightBlue"
            buttonText="取消"
            iconType="close"
            :isAuthorize="false"
            @handleBtnEmit="closeCheckInfoModal"
          />
          <IpkButton
            buttonType="primary"
            buttonText="儲存"
            iconType="save"
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.LOCK.val"
            :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.SAVE.val"
            @handleBtnEmit="handleSaveDetail"
          />
        </div>
      </template>
    </a-modal>
    <!-- 列印 -->
    <PrintModal
      :modal-print-show="modalPrintShow"
      :fileCodeOption="fileCodeOption"
      :defaultVal="defaultVal"
      :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @submitPrint="submitDataPrint($event)"
      @closePrintModal="closePrintModal"
    />
    <!-- 退回 -->
    <ReturnModal
      :modalReturnShow="modalReturnShow"
      :childrenTab="$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
      @handleReturnFront="handleReturnFront"
      @handleReturnLock="handleReturnLock"
      @closeReturnModal="closeReturnModal"
    />
    <!-- 收付款資訊交易對手附件彈窗 -->
    <SsiFileCheckInfoModal
      :modalSsiCheckInfoShow="modalSsiCheckInfoShow"
      :formData="formData"
      @closeSsiCheckInfoModal="closeSsiCheckInfoModal"
    />
  </div>
</template>
<script src="./FECheckInfoModal.ts" lang="ts" />

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
}
.modal_content  {
  font-weight: $TEXT-BOLD;
  color: $COLOR-BLACK;
}
.modal_content_wrap {
  margin-left: 27px;
}
.upload__btn {
  margin-bottom: 20px;
  padding: 5px;
}
.iconDisabled {
  ::v-deep img {
    filter: grayscale(100%);
    opacity: 0.8;
  }
}
</style>
