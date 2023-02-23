<template>
  <div>
    <a-modal
      v-model="snCheckInfoModalVisible"
      :maskClosable="false"
      :keyboard="false"
      :width="'70%'"
      :after-close="closeSNCheckInfoModal"
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
            :disabled="isEmpty(main.cfStatus) || main.cfStatus.key === $cfEnum.cfStatusConstant.RETURN_UNLOCKED.val || main.cfStatus.key === $cfEnum.cfStatusConstant.EMPTY.val"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-show="activeKey === $authService.ssiTab.key">
                <a-form-model
                  ref="ssiModalForm"
                  layout="vertical"
                  :model="ssi"
                  :rules="ssiRules"
                >
                  <a-row :gutter="[12]" type="flex" justify="center" align="bottom" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="safekeepingAccount" label="保管銀行帳號">
                        <a-input
                          v-model="ssi.safekeepingAccount"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="fbSettlementLocation" label="Settlement Location" required>
                        <a-select
                          v-model="ssi.fbSettlementLocation"
                          placeholder="請選擇"
                          :options="fbSettlementLocations"
                          :disabled="disabledSsiTabCol"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="fbClearerId" label="Fubon ECL Clearing Agent Code">
                        <a-input
                          v-model="ssi.fbClearerId"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="cpCounterpartyId" label="Broker Name">
                        <a-input
                          v-model="ssi.cpCounterpartyId"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="cpClAgentCode" label="Broker Agent Code" required>
                        <a-select
                          v-model="ssi.cpClAgentCode"
                          placeholder="請選擇"
                          :options="cpClAgentCodes"
                          :disabled="disabledSsiTabCol"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="cpSettlementLocation" label="Broker Settlement Location">
                        <a-input
                          v-model="ssi.cpSettlementLocation"
                          placeholder="請輸入"
                          :disabled="true"
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
            :disabled="isEmpty(main.cfStatus) || main.cfStatus.key === $cfEnum.cfStatusConstant.RETURN_UNLOCKED.val || main.cfStatus.key === $cfEnum.cfStatusConstant.EMPTY.val"
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
            :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataLock"
          />
          <IpkButton
            buttonType="primary"
            buttonText="資料比對"
            iconImg="icon__comparison"
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.LOCK.val"
            :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataComparison"
          />
          <IpkButton
            buttonType="primary"
            buttonText="產檔"
            iconType="download"
            :buttonDisabled="isEmpty(main.cfStatus.key) || main.cfStatus.key < 2"
            :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
            @handleBtnEmit="handleDataFile"
          />
          <IpkButton
            buttonType="primary"
            buttonText="列印"
            iconType="printer"
            :buttonDisabled="isEmpty(main.cfStatus.key) || main.cfStatus.key < 1"
            :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
            @handleBtnEmit="handleDataPrint"
          />
          <IpkButton
            buttonType="primary"
            buttonText="交易確認"
            iconType="check"
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.COMPARED.val"
            :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataConfirm"
          />
          <IpkButton
            buttonType="lightRed"
            buttonText="退回"
            iconType="stop"
            :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataReturn"
          />
          <IpkButton
            buttonType="lightBlue"
            buttonText="取消"
            iconType="close"
            :isAuthorize="false"
            @handleBtnEmit="closeSNCheckInfoModal"
          />
          <IpkButton
            buttonType="primary"
            buttonText="儲存"
            iconType="save"
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.LOCK.val"
            :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
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
      :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @submitPrint="submitDataPrint($event)"
      @closePrintModal="closePrintModal"
    />
    <!-- 退回 -->
    <ReturnModal
      :modalReturnShow="modalReturnShow"
      :childrenTab="$cfChildrenTab.childrenTab.STRUCTURE_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
      @handleReturnFront="handleReturnFront"
      @handleReturnLock="handleReturnLock"
      @closeReturnModal="closeReturnModal"
    />
  </div>
</template>
<script src="./SNCheckInfoModal.ts" lang="ts" />

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
</style>
