<template>
  <a-modal
    ref="modal"
    v-model="modalVisible"
    title="檢視"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    :footer="null"
    :destroyOnClose="true"
    @cancel="closeCheckInfoModal()"
  >
    <div>
      <div class="modal__body tabline">
        <a-form-model ref="formRef" :model="form" :layout="'vertical'">
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="custodianBankCode" label="保管機構">
                <a-input
                  v-model="form.custodianBankCode.key"
                  class="checkInfo__input"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="currency" label="幣別">
                <a-input
                  v-model="form.currency.key"
                  class="checkInfo__input"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="type" label="使用類別">
                <a-input
                  v-model="form.type.key"
                  class="checkInfo__input"
                  disabled
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <a-tabs
          v-model="activeKey"
          hide-add
          type="editable-card"
        >
          <!-- 款帳號資訊 -->
          <a-tab-pane key="1" tab="款帳號資訊" :closable="false" :disabled="(activeKey ==='2' )">
            <div v-if="activeKey === '1'">
              <div>
                <div>
                  <div class="modal__body">
                    <a-form-model
                      layout="vertical"
                      :model="form"
                    >
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="6">
                          <a-form-model-item prop="bfBankId" label="受款銀行代碼">
                            <a-input
                              v-model="form.bfBankId.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="bfBankAccount" label="受款銀行帳號">
                            <a-input
                              v-model="form.bfBankAccount.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-model-item prop="bfBankName" label="受款銀行名稱">
                            <a-input
                              v-model="form.bfBankName.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="6">
                          <a-form-model-item prop="bfAccount" label="受款人帳號">
                            <a-input
                              v-model="form.bfAccount.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-model-item prop="bfAccountName" label="受款人戶名">
                            <a-input
                              v-model="form.bfAccountName.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="6">
                          <a-form-model-item prop="imBankCode" label="中間行代碼">
                            <a-input
                              v-model="form.imBankCode.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-model-item prop="imBankName" label="中間行名稱">
                            <a-input
                              v-model="form.imBankName.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="6">
                          <a-form-model-item prop="tfBankAccount" label="調撥銀行帳號">
                            <a-input
                              v-model="form.tfBankAccount.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-model-item prop="tfBankName" label="調撥銀行名稱">
                            <a-input
                              v-model="form.tfBankName.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="12">
                          <a-form-model-item prop="memo" label="附言">
                            <a-input
                              v-model="form.memo.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-model-item prop="remark" label="備註">
                            <a-input
                              v-model="form.remark.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="24">
                          <a-form-model-item prop="isDefault" label="預設">
                            <a-switch v-model="form.isDefault.key" :disabled="true" />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-form-model>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <!-- 券帳號資訊 -->
          <a-tab-pane key="2" tab="券帳號資訊" :closable="false" :disabled="(activeKey ==='1' )">
            <div v-if="activeKey === '2'">
              <div>
                <div>
                  <div class="modal__body">
                    <a-form-model
                      layout="vertical"
                      :model="form"
                    >
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="6">
                          <a-form-model-item prop="safekeepingAccount" label="保管帳號">
                            <a-input
                              v-model="form.safekeepingAccount.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="safekeepingName" label="保管行名稱">
                            <a-input
                              v-model="form.safekeepingName.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="market" label="Market">
                            <a-input
                              v-model="form.market.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="settlementLocation" label="Settlement Location">
                            <a-input
                              v-model="form.settlementLocation.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="6">
                          <a-form-model-item prop="custodianIdType" label="Custodian ID Type">
                            <a-input
                              v-model="form.custodianIdType.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="custodianId" label="Custodian ID">
                            <a-input
                              v-model="form.custodianId.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="custodianAccount" label="Custodian Account">
                            <a-input
                              v-model="form.custodianAccount.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="6">
                          <a-form-model-item prop="clearerIdType" label="Clearer ID Type">
                            <a-input
                              v-model="form.clearerIdType.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="clearerId" label="Clearer ID">
                            <a-input
                              v-model="form.clearerId.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="clearerAccount" label="Clearer Account">
                            <a-input
                              v-model="form.clearerAccount.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="6">
                          <a-form-model-item prop="taxId" label="統編">
                            <a-input
                              v-model="form.taxId.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                          <a-form-model-item prop="pdAccountBank" label="公債帳號對應銀行">
                            <a-input
                              v-model="form.pdAccountBank.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="12">
                          <a-form-model-item prop="memo" label="附言">
                            <a-input
                              v-model="form.memo.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-model-item prop="remark" label="備註">
                            <a-input
                              v-model="form.remark.key"
                              class="checkInfo__input"
                              :disabled="true"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="[12]" type="flex" :wrap="true">
                        <a-col :span="24">
                          <a-form-model-item prop="isDefault" label="預設">
                            <a-switch v-model="form.isDefault.key" :disabled="true" />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-form-model>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="modal__btn__wrap btnGroup">
      <IpkButton
        buttonType="lightBlue"
        buttonText="關閉"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="closeCheckInfoModal"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="拒絕"
        iconType="stop"
        :buttonDisabled="isDisabled"
        :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleReject"
      />
      <IpkButton
        buttonType="primary"
        buttonText="放行"
        iconType="check"
        :buttonDisabled="isDisabled"
        :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleReview"
      />
    </div>
  </a-modal>
</template>

<script src="./PendingCheckInfoModal.ts" lang="ts" />

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
  .checkInfo__input {
    border: none;
    border-bottom: 1px solid $COLOR-GRAY13;
    border-radius: 0;
    color: $COLOR-MAIN2;
    font-size: 16px;
    padding: 0;
  }
  .ant-input[disabled] {
    background-color: transparent;
  }
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-form-vertical .ant-form-item-label, .ant-col-24.ant-form-item-label, .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
}
</style>
