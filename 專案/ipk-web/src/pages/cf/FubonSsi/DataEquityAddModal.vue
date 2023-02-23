<template>
  <a-modal
    ref="modal"
    v-model="modalVisible"
    title="新增券"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    :footer="null"
    :destroyOnClose="true"
    @cancel="closeAddAndEditModal()"
  >
    <div>
      <div class="modal__body">
        <a-form-model
          ref="formRef"
          :model="oriForm"
          :rules="addFormRules"
          :layout="'vertical'"
        >
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="safekeepingAccount" label="保管帳號">
                <a-input
                  v-model="oriForm.safekeepingAccount"
                  placeholder="請輸入"
                  :maxLength="30"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="safekeepingName" label="保管行名稱">
                <a-input
                  v-model="oriForm.safekeepingName"
                  placeholder="請輸入"
                  :maxLength="100"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="market" label="Market">
                <IpkAddItemSelect
                  v-model="oriForm.market"
                  :options="marketOption"
                  placeholder="請選擇"
                  :showSearch="true"
                  refKey="market"
                />

                <!-- <div
                  @mousedown="
                    (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectOpen = true;
                    }
                  "
                >
                  <a-select
                    v-model="oriForm.market"
                    placeholder="請選擇"
                    show-search
                    allowClear
                    :open="selectOpen"
                    @select="closeAddOptionItem()"
                    @click="(e) => e.target.focus"
                  >
                    <div slot="dropdownRender" slot-scope="menu">
                      <v-nodes :vnodes="menu" />
                      <a-divider class="dropdownRender__divider__block" />
                      <div class="dropdownRender__block btnGroup text-left">
                        <a-row v-if="isAdd">
                          <a-col span="20">
                            <a-input
                              v-model="addItem"
                              style="width: 100%"
                              placeholder="請輸入"
                              @click="(e) => e.target.focus"
                            />
                          </a-col>
                          <a-col span="4">
                            <a-icon
                              type="check-circle"
                              class="ms-2 mt-2"
                              style="font-size: 18px"
                              @click="addOptionItem"
                            />
                          </a-col>
                        </a-row>
                        <div
                          class="m-1 select__btn--default"
                          @click="isAdd = true"
                        >
                          <a-icon type="plus" /> 新增選項
                        </div>
                      </div>
                    </div>
                    <a-select-option
                      v-for="(item, index2) in marketOption"
                      :key="index2"
                      :value="item.value"
                      allow-clear
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </div> -->
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                prop="settlementLocation"
                label="Settlement Location"
              >
                <a-input
                  v-model="oriForm.settlementLocation"
                  placeholder="請輸入"
                  :maxLength="20"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item
                prop="CustodianIdType"
                label="Custodian ID Type"
              >
                <a-input
                  v-model="oriForm.custodianIdType"
                  placeholder="請輸入"
                  :maxLength="10"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="custodianId" label="Custodian ID">
                <a-input
                  v-model="oriForm.custodianId"
                  placeholder="請輸入"
                  :maxLength="20"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                prop="custodianAccount"
                label="Custodian Account"
              >
                <a-input
                  v-model="oriForm.custodianAccount"
                  placeholder="請輸入"
                  :maxLength="50"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="clearerIdType" label="Clearer ID Type">
                <a-input
                  v-model="oriForm.clearerIdType"
                  placeholder="請輸入"
                  :maxLength="10"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="clearerId" label="Clearer ID">
                <a-input
                  v-model="oriForm.clearerId"
                  placeholder="請輸入"
                  :maxLength="20"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="clearerAccount" label="Clearer Account">
                <a-input
                  v-model="oriForm.clearerAccount"
                  placeholder="請輸入"
                  :maxLength="50"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="taxId" label="統編">
                <a-input
                  v-model="oriForm.taxId"
                  placeholder="請輸入"
                  :maxLength="8"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="pdAccountBank" label="公債帳號對應銀行">
                <a-input
                  v-model="oriForm.pdAccountBank"
                  placeholder="請輸入"
                  :maxLength="100"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="12">
              <a-form-model-item prop="memo" label="附言">
                <a-textarea
                  v-model="oriForm.memo"
                  placeholder="請輸入"
                  :auto-size="{ minRows: 1, maxRows: 1 }"
                  :maxLength="200"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="remark" label="備註">
                <a-textarea
                  v-model="oriForm.remark"
                  placeholder="請輸入"
                  :auto-size="{ minRows: 1, maxRows: 1 }"
                  :maxLength="200"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="isDefault" label="預設">
                <a-switch v-model="isDefault" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="modal__btn__wrap btnGroup">
          <IpkButton
            buttonType="lightBlue"
            buttonText="取消"
            iconType="close"
            :isAuthorize="false"
            @handleBtnEmit="closeAddAndEditModal('cancel')"
          />
          <!-- TODO: 權限待修改 -->
          <IpkButton
            buttonType="primary"
            buttonText="送出"
            iconType="check"
            :buttonDisabled="validateSubmit()"
            :isAuthorize="false"
            @handleBtnEmit="submitAddEquityInfo"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script src="./DataEquityAddModal.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
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
  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
}
</style>
