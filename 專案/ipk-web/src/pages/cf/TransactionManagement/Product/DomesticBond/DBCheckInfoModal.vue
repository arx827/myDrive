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
                <a-form-model
                  layout="vertical"
                  :model="other"
                >
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col
                      v-for="(item,key,index) in other"
                      :key="index"
                      :span="item.span ? item.span : 6"
                    >
                      <a-form-model-item
                        v-if="item.type !== 'action' && item.type !== 'input'"
                        :prop="key"
                        :label="item.label"
                        class="checkInfo"
                      >
                        <a-input
                          v-if="item.type === 'badge'"
                          class="checkInfo__input"
                          :disabled="true"
                        >
                          <a-badge
                            slot="prefix"
                            :color="getBadgeObject(item.key).color"
                            :text="getBadgeObject(item.key).key"
                          />
                        </a-input>
                        <a-textarea
                          v-else-if="item.type === 'textarea'"
                          v-model="item.key"
                          class="checkInfo__input"
                          rows="1"
                          :disabled="true"
                        />
                        <a-input
                          v-else
                          v-model="item.key"
                          class="checkInfo__input"
                          :disabled="true"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        v-if="item.type === 'input'"
                        :prop="key"
                        :label="item.label"
                      >
                        <a-input
                          v-model="item.key"
                          placeholder="請輸入"
                          :disabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.LOCK.val"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
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
                <div class="modal__body__title">
                  我方收付款資訊
                </div>
                <a-form-model
                  ref="formRef"
                  layout="vertical"
                  :model="ssi"
                >
                  <a-row :gutter="[12]" type="flex" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="fbPdAccountBank" label="我方公債帳號對應銀行名稱">
                        <a-input
                          v-model="ssi.fbPdAccountBank"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="fbBfAccountName" label="我方受款人戶名">
                        <a-input
                          v-model="ssi.fbBfAccountName"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="fbTaxId" label="我方統編">
                        <a-input
                          v-model="ssi.fbTaxId"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="safekeepingAccount" label="我方保管帳號">
                        <a-input
                          v-model="ssi.safekeepingAccount"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="safekeepingName" label="我方保管行名稱">
                        <a-input
                          v-model="ssi.safekeepingName"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="fbBfAccount" label="我方受款銀行帳號">
                        <a-input
                          v-model="ssi.fbBfAccount"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="fbBankAccount" label="我方調撥銀行帳號">
                        <a-input
                          v-model="ssi.fbBankAccount"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="fbBankName" label="我方調撥銀行名稱">
                        <a-input
                          v-model="ssi.fbBankName"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <div class="modal__body__title">
                    交易對象收付款資訊
                  </div>
                  <a-row :gutter="[12]" type="flex" align="bottom" :wrap="true">
                    <a-col :span="6">
                      <a-form-model-item prop="cpPdAccountBank" label="交易對象公債帳號對應銀行名稱">
                        <a-input
                          v-model="ssi.cpPdAccountBank"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="cpBfAccountName" label="交易對象公債帳號戶名/受款人戶名">
                        <a-input
                          v-model="ssi.cpBfAccountName"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="cpTaxId" label="交易對象統編">
                        <a-input
                          v-model="ssi.cpTaxId"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="cpPdAccount" label="交易對象公債帳號/債券集保帳號">
                        <a-input
                          v-model="ssi.cpPdAccount"
                          placeholder="請輸入"
                          :disabled="true"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item prop="cpBfBankAccount" label="交易對象受款行銀行名稱/帳號">
                        <IpkSelect
                          v-model="ssi.ssiId"
                          :options="ssiIdOption"
                          :isDisabled="disabledSsiTabCol"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="ssiId"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="noteName" label="照會對象">
                        <IpkAddItemSelect
                          ref="ipkAddItemSelect"
                          v-model="ssi.noteName"
                          :options="counterPartyLicenserOption"
                          :isDisabled="disabledSsiTabCol"
                          placeholder="請選擇"
                          :showSearch="true"
                          refKey="noteName"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="noteTime" label="照會時間">
                        <a-time-picker
                          v-model="ssi.noteTime"
                          :open.sync="noteTimeOpen"
                          format="HH:mm"
                          placeholder="請選擇時間"
                          style="width: 100%"
                          :disabled="disabledSsiTabCol"
                        >
                          <!-- TODO: a-time-picker 裡的確定，待修改 -->
                          <a-button
                            slot="addon"
                            size="small"
                            type="default"
                            class="select__btn--default timePicker_close"
                            @click="noteTimeOpen = false"
                          >
                            <a-icon type="check" />
                            確定
                          </a-button>
                        </a-time-picker>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item prop="memo" label="備註">
                        <a-input
                          v-model="ssi.memo"
                          placeholder="請輸入"
                          :disabled="disabledSsiTabCol"
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
                <div class="my-2">
                  <a-radio-group v-model="attachmentType">
                    <a-radio value="02">
                      上傳交易確認文件
                    </a-radio>
                    <a-radio value="01">
                      上傳成交單
                    </a-radio>
                  </a-radio-group>
                </div>
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
            :buttonDisabled="disabledLockBtn"
            :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataLock"
          />
          <!-- 「已鎖定」才可點選 -->
          <IpkButton
            buttonType="primary"
            buttonText="資料比對"
            iconImg="icon__comparison"
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.LOCK.val"
            :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataComparison"
          />
          <!-- 已比對後，都可以點擊按鈕 -->
          <IpkButton
            buttonType="primary"
            buttonText="列印"
            iconType="printer"
            :buttonDisabled="isEmpty(main.cfStatus.key) || main.cfStatus.key < 2"
            :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
            @handleBtnEmit="handleDataPrint"
          />
          <!-- 「已比對」才可點選 -->
          <IpkButton
            buttonType="primary"
            buttonText="交易確認"
            iconType="check"
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.COMPARED.val"
            :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleDataConfirm"
          />
          <IpkButton
            buttonType="lightRed"
            buttonText="退回"
            iconType="stop"
            :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
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
            :buttonDisabled="main.cfStatus.key !== $cfEnum.cfStatusConstant.LOCK.val && main.cfStatus.key !== $cfEnum.cfStatusConstant.TX_DOUBLE_REIVEW.val"
            :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
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
      :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.GENERATE.val"
      @submitPrint="submitDataPrint($event)"
      @closePrintModal="closePrintModal"
    />
    <!-- 退回 -->
    <ReturnModal
      :modalReturnShow="modalReturnShow"
      :childrenTab="$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val"
      :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
      @handleReturnFront="handleReturnFront"
      @handleReturnLock="handleReturnLock"
      @closeReturnModal="closeReturnModal"
    />
  </div>
</template>
<script src="./DBCheckInfoModal.ts" lang="ts" />

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
  // badge 文字
  .ant-badge-status-text {
    color: $COLOR-MAIN2;
    font-size: 16px;
  }
  // badge 大小
  .ant-badge-status-dot {
    width: 12px;
    height: 12px;
  }
}
.modal__body__title {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
}
.timePicker_close {
  border: none !important;
  justify-content: center;
  align-items: center;
  display: flex;
}
.select__btn--default {
  color: $COLOR-MAIN15;
}
</style>
