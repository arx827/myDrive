<template>
  <div>
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- 郵寄文件-->
          <span class="card__title">{{
            $t("noticeManualLetterForm_mailDocuments")
          }}</span>
        </div>

        <div class="card__infomation">
          <a-row>
            <a-col :span="19">
              <a-spin :spinning="mailByPostSettingsloading">
                <fbl-data-grid
                  :themeColor="'theme2'"
                  :rowKey="mailByPostSettingsGrid.rowKey"
                  :columns="mailByPostSettingsGrid.columns"
                  :data="mailByPostSettingsGrid.data"
                  :pagination="false"
                  :checkSelected="checkSelected"
                  @checkedChange="onCheckedChange($event)"
                  :checkboxDisabledCheck="checkboxDisabledCheck"
                  @actionClick="onMailByPostSettingTableActionClick($event)"
                  @onSelectOptionsChange="onSelectOptions($event)"
                  @onSelectionInputChange="onSelectionInputChange($event)"
                >

                <template v-slot:selectionAndInputTemplate="slotProps"
                >
            <a-select
            style="width: 200px"
            v-model="slotProps.data.noLetterReasonCode"
            :options="
                slotProps.data.noLetterReasonOptions
            "
            @change="onSelectOptionsChange(slotProps.data)"
            :disabled="!checkSelected(slotProps.data)"
          >
          </a-select>
          <a-input
            v-model="slotProps.data.noLetterContent"
            v-if="
              '' != slotProps.data.noLetterReasonCode &&
              'S' ==slotProps.data.noLetterReasonCode
            "
            style="width: 350px"
            :maxLength="30"
            @change="onSelectionInputChange(slotProps.data,$event)"
          ></a-input>

                </template>
                </fbl-data-grid>
              </a-spin>
            </a-col>
            <a-col :span="5"> </a-col>
          </a-row>
          <a-row style="margin-top: 16px">
            <a-col :span="18"></a-col>
            <a-col :span="5">
              <div style="margin-bottom: 16px">
                <!-- 儲存 -->
                <a-button type="primary" @click="onSaveMailByPostSettingSubmit">
                  儲存
                </a-button>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-row>

    <a-row style="padding-top: 25px" v-if="mailInformationCardVisible">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <span class="card__title">{{
            $t("noticeManualLetterForm_mailInformation")
          }}</span>
        </div>

        <div class="card__infomation">
          <a-form-model
            class="modal-formGroup"
            :model="mailInformationForm"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 15 }"
            :rules="mailLetterEditFormRules"
            ref="mailInformationForm"
          >
            <!-- 客戶姓名 -->
            <a-row>
              <a-col align="left">
                <a-form-model-item :label="$t('email_custName')">
                  <label>{{ mailInformationForm.custName }}</label>
                </a-form-model-item>
              </a-col>
            </a-row>

            <!-- 客戶編號 -->
            <a-row style="padding-bottom: 0px; height: 10px">
              <a-col align="left">
                <a-form-model-item :label="$t('noticeManualLetterForm_custId')">
                  <a-row type="flex">
                    <a-col :span="8">
                      <label>{{ mailInformationForm.custId }}</label>
                    </a-col>
                    <a-col :span="11">
                      <!-- 掛號號碼 -->
                      <a-form-model-item
                        :label="$t('noticeManualLetterForm_registerNo')"
                      >
                        <label>{{ mailInformationForm.registerNo }}</label>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </a-col>
            </a-row>

            <!-- 保單號碼 -->
            <a-row style="padding-top: 0px">
              <a-col align="left">
                <a-form-model-item :label="$t('pedding_policyNo')">
                  <label>{{ mailInformationForm.casePolicy }}</label>
                </a-form-model-item>
              </a-col>
            </a-row>

            <!-- 郵寄日期 -->
            <a-row>
              <a-col align="left">
                <a-row>
                  <a-col>
                    <a-form-model-item
                      :label="$t('noticeManualLetterForm_mailbyPostDate')"
                      prop="mailByPostDate"
                      required
                      :has-feedback="
                        callCommonUtilFeildFeedback(
                          mailLetterEditValidationForm.mailByPostDate
                        )
                      "
                      :validateStatus="
                        callCommonUtilFeildStatus(
                          mailLetterEditValidationForm.mailByPostDate
                        )
                      "
                    >
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeildMsg(
                            mailLetterEditValidationForm.mailByPostDate
                          )
                        "
                        :trigger="
                          callCommonUtilFeildTrigger(
                            mailLetterEditValidationForm.mailByPostDate
                          )
                        "
                        :visible="
                          callCommonUtilFeildHoverVisible(
                            mailLetterEditValidationForm.mailByPostDate
                          )
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            mailLetterEditValidationForm.mailByPostDate
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <date-picker
                          :formatter="formatter"
                          @change="onMailPostDateChange"
                          :disabled-date="disabledDate"
                          v-model="mailByPostDateMoment"
                          :range="false"
                          style="width: 10%"
                          :clearable="false"
                        >
                          <a-input
                            slot="input"
                            :value="mailByPostDateString"
                          ></a-input>
                        </date-picker>
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>

            <!-- 收件人 -->
            <a-row>
              <a-col align="left">
                <a-form-model-item
                  :label="$t('noticeManualLetterForm_receiver')"
                  prop="custName"
                  required
                  :has-feedback="
                    callCommonUtilFeildFeedback(
                      mailLetterEditValidationForm.custName
                    )
                  "
                  :validateStatus="
                    callCommonUtilFeildStatus(
                      mailLetterEditValidationForm.custName
                    )
                  "
                >
                  <a-popover
                    placement="top"
                    :content="
                      callCommonUtilFeildMsg(
                        mailLetterEditValidationForm.custName
                      )
                    "
                    :trigger="
                      callCommonUtilFeildTrigger(
                        mailLetterEditValidationForm.custName
                      )
                    "
                    :visible="
                      callCommonUtilFeildHoverVisible(
                        mailLetterEditValidationForm.custName
                      )
                    "
                    @visibleChange="
                      callCommonUtilFeildVisibleChange(
                        mailLetterEditValidationForm.custName
                      )
                    "
                    :destroyTooltipOnHide="true"
                  >
                    <a-input
                      type="text"
                      v-model="mailInformationForm.custName"
                      :maxLength="100"
                      style="width: 250px"
                      @change="onSelectCustName()"
                    />
                  </a-popover>
                </a-form-model-item>
              </a-col>
            </a-row>

            <!--郵寄地址類型 -->
            <a-row style="padding-bottom: 0px; height: 30px">
              <a-col align="left">
                <a-form-model-item
                  :label="$t('noticeManualLetterForm_address')"
                  required
                >
                  <a-row type="flex" :gutter="[16, 0]">
                    <a-col :span="8">
                      <a-select
                        v-model="mailInformationForm.addressType"
                        style="width: 150px"
                        :options="addressOptions"
                        @change="onSelectAddressType()"
                      >
                      </a-select>
                    </a-col>
                    <!-- 郵遞區號 -->
                    <a-col :span="2" :pull="4">
                      <a-form-model-item
                        label=""
                        prop="zipCode"
                        :has-feedback="
                          callCommonUtilFeildFeedback(
                            mailLetterEditValidationForm.zipCode
                          )
                        "
                        :validateStatus="
                          callCommonUtilFeildStatus(
                            mailLetterEditValidationForm.zipCode
                          )
                        "
                      >
                        <a-popover
                          placement="top"
                          :content="
                            callCommonUtilFeildMsg(
                              mailLetterEditValidationForm.zipCode
                            )
                          "
                          :trigger="
                            callCommonUtilFeildTrigger(
                              mailLetterEditValidationForm.zipCode
                            )
                          "
                          :visible="
                            callCommonUtilFeildHoverVisible(
                              mailLetterEditValidationForm.zipCode
                            )
                          "
                          @visibleChange="
                            callCommonUtilFeildVisibleChange(
                              mailLetterEditValidationForm.zipCode
                            )
                          "
                          :destroyTooltipOnHide="true"
                        >
                          <a-input
                            type="text"
                            v-model="mailInformationForm.zipCode"
                            :maxLength="5"
                            @change="onSelectZipCode()"
                            class="collapse-receiverAddressInput"
                            :disabled="addressTypeDisabled"
                          />
                        </a-popover>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </a-col>
            </a-row>

            <!--空白郵寄地址 -->
            <a-row>
              <a-col align="left">
                <a-form-model-item
                  label=""
                  prop="address"
                  :validateStatus="
                    callCommonUtilFeildStatus(
                      mailLetterEditValidationForm.address
                    )
                  "
                >
                  <a-row
                    type="flex"
                    :gutter="[0, 0]"
                    style="padding-left: 40px"
                    width="400px"
                  >
                    <a-col :span="8" :offset="4">
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeildMsg(
                            mailLetterEditValidationForm.address
                          )
                        "
                        :trigger="
                          callCommonUtilFeildTrigger(
                            mailLetterEditValidationForm.address
                          )
                        "
                        :visible="
                          callCommonUtilFeildHoverVisible(
                            mailLetterEditValidationForm.address
                          )
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            mailLetterEditValidationForm.address
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          v-model="mailInformationForm.address"
                          :maxLength="200"
                          style="width: 380px"
                          @change="onSelectAddress()"
                          class="collapse-receiverAddressInput"
                          :disabled="addressTypeDisabled"
                        />
                      </a-popover>
                    </a-col>
                    <a-col :span="2" :offset="2">
                      <a-button type="primary" @click="onManualLetterSend()">{{
                        $t("noticeManualLetterForm_produceLetter")
                      }}</a-button>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>

          <a-row>
            <a-col :span="24">
               <a-spin :spinning="mailByPostGridloading">
              <fbl-data-grid
                :themeColor="'theme2'"
                :rowKey="mailByPostGrid.rowKey"
                :columns="mailByPostGrid.columns"
                :data="mailByPostGrid.data"
                :pagination="false"
                @beforeUpload="beforeUpload"
                @actionClick="onMailByPostTableActionClick($event)"
                @handleUploadChange="handleUploadChange"
              >
              </fbl-data-grid>
               </a-spin>
            </a-col>
          </a-row>
          <a-row>
            <div style="margin-top: 16px">
              <a-col :span="23"></a-col>
              <!-- 離開-->
              <a-col :span="1">
                <a-button type="primary" @click="leaveMailInformation">
                  離開
                </a-button>
              </a-col>
            </div>
          </a-row>
        </div>
      </div>
    </a-row>

    <a-modal
      v-model="cancelLetterVisible"
      :title="$t('noticeManualLetterForm_cancelLetter')"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      :maskClosable="false"
      :destroyOnClose="true"
      @ok="onCancelMailLetterSubmit"
    >
      <MailLetterCancelForm
        :initData="cancelLetterFormData"
        ref="mailLetterCancelForm"
        @reloadMailByPostGrid="afterCancelLetterMailByPostGridReload()"
      >
      </MailLetterCancelForm>
      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="cancelLetterVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="onCancelMailLetterSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="modifyLetterVisible"
      :title="$t('noticeManualLetterForm_modify_mailInformation')"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      :maskClosable="false"
      width="800px"
      :destroyOnClose="true"
      @ok="onUpdateMailLetterSubmit"
    >
      <MailLetterEditForm
        :initData="modifyLetterFormData"
        :validatedPostDateList="mailInformationForm.validatedPostDateList"
        ref="mailLetterEditForm"
        @reloadMailByPostGrid="
          modifyLetterVisible = false;
          mailByPostGridReload($event);
        "
      >
      </MailLetterEditForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="modifyLetterVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="onUpdateMailLetterSubmit"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>
  </div>
</template>



<script src="./MailLetterForm.ts" lang="ts"></script>
<style lang="less">
// 卡片樣式
.section-card {
  border: 1px solid #eee;
  border-radius: 5px;
  position: relative;
  min-height: 2em;
  margin-top: 5px;
  + .section-card {
    margin-top: 30px;
  }
  margin-left: 15px;
  margin-right: 15px;
}
.card__infomation {
  padding: 30px 15px 15px;
  box-shadow: 1px 4px 8px #ddd;
  .ant-row-flex {
    + .ant-row-flex {
      margin-top: 10px;
    }
  }
}

.card__title-position {
  position: absolute;
  top: 0;
  left: 5px;
  transform: translateY(-50%);
}
.card__title {
  background: @COLOR-WHITE;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 600;
  font-size: 18px;
}

.modal-formGroup {
  /deep/ .ant-form-item {
    display: flex;
    align-items: center;
    .ant-form-item-label {
      padding-bottom: 5px;
      padding-top: 5px;
    }
  }
}

.collapse-receiverAddressInput {
  /deep/ .ant-col,
  .ant-form-item-control-wrapper {
    width: 100%;
  }
}
</style>