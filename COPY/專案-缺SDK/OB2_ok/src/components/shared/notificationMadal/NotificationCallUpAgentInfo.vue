<template>
  <div class="section-card section__interview">
    <div class="card__title-position">
      <!-- test -->
      <span class="card__title"></span>
    </div>
    <div class="card__infomation">
      <a-form-model
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :gutter="[{ xs: 10, xxl: 10 }, 0]"
        :model="notiCallUpAgentInfoForm"
        :rules="notiCallUpAgentInfoFormRules"
        labelAlign="right"
      >
        <a-row>
          <a-col>
            {{ notiCallUpAgentInfoForm.agent }}
          </a-col>
        </a-row>
        <a-row>
          <a-col span="12">
            <a-form-model-item
              :label="$t('notificationCallUpAgentInfo_sendMessage')"
            >
              <a-row type="flex">
                <a-col>
                  <a-checkbox
                    :value="'Y'"
                    :checked="
                      notiCallUpAgentInfoForm.checkSend !== ''
                        ? notiCallUpAgentInfoForm.checkSend == 'Y'
                        : false
                    "
                    @change="onChenkSendMessage"
                  >
                    <!-- 是 -->
                    <span>{{ $t("global_yes") }}</span>
                  </a-checkbox>
                  <a-checkbox
                    :value="'N'"
                    @change="onChenkSendMessage"
                    :checked="
                      notiCallUpAgentInfoForm.checkSend !== ''
                        ? notiCallUpAgentInfoForm.checkSend == 'N'
                        : false
                    "
                  >
                    <!-- 否 -->
                    <span>{{ $t("global_no") }}</span>
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <!-- E-mail -->
            <a-form-model-item
              :label="$t('notificationCallUpAgentInfo_email')"
              class=""
              prop="email"
              style="margin-bottom: 0px"
              :has-feedback="
                callCommonUtilFeildFeedback(
                  notiCallUpAgentInfoValidateForm.email
                )
              "
              :validateStatus="
                callCommonUtilFeildStatus(notiCallUpAgentInfoValidateForm.email)
              "
            >
              <a-popover
                placement="top"
                :destroyTooltipOnHide="true"
                :content="
                  callCommonUtilFeildMsg(notiCallUpAgentInfoValidateForm.email)
                "
                :trigger="
                  callCommonUtilFeildTrigger(
                    notiCallUpAgentInfoValidateForm.email
                  )
                "
                :visible="
                  callCommonUtilFeildHoverVisible(
                    notiCallUpAgentInfoValidateForm.email
                  )
                "
                @visibleChange="
                  callCommonUtilFeildVisibleChange(
                    notiCallUpAgentInfoValidateForm.email
                  )
                "
              >
                <a-input type="text" v-model="notiCallUpAgentInfoForm.email">
                </a-input>
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-divider />
        <a-row v-if="notiCallUpAgentInfoForm.checkSend == 'Y'">
          <a-col>
            <!-- 保戶姓名 -->
            <a-form-model-item
              :label="$t('notificationCallUpAgentInfo_custName')"
              class=""
              prop="custName"
              style="margin-bottom: 0px"
              :has-feedback="
                callCommonUtilFeildFeedback(
                  notiCallUpAgentInfoValidateForm.custName
                )
              "
              :validateStatus="
                callCommonUtilFeildStatus(
                  notiCallUpAgentInfoValidateForm.custName
                )
              "
            >
              <a-popover
                placement="top"
                :destroyTooltipOnHide="true"
                :content="
                  callCommonUtilFeildMsg(
                    notiCallUpAgentInfoValidateForm.custName
                  )
                "
                :trigger="
                  callCommonUtilFeildTrigger(
                    notiCallUpAgentInfoValidateForm.custName
                  )
                "
                :visible="
                  callCommonUtilFeildHoverVisible(
                    notiCallUpAgentInfoValidateForm.custName
                  )
                "
                @visibleChange="
                  callCommonUtilFeildVisibleChange(
                    notiCallUpAgentInfoValidateForm.custName
                  )
                "
              >
                <a-input
                  type="text"
                  v-model="notiCallUpAgentInfoForm.custName"
                  :maxLength="60"
                />
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="notiCallUpAgentInfoForm.checkSend == 'Y'">
          <a-col>
            <!-- 保單號碼 -->
            <a-form-model-item
              :label="$t('handleInfoForm_polNo')"
              class=""
              prop="casePolicy"
              style="margin-bottom: 0px"
              :has-feedback="
                callCommonUtilFeildFeedback(
                  notiCallUpAgentInfoValidateForm.casePolicy
                )
              "
              :validateStatus="
                callCommonUtilFeildStatus(
                  notiCallUpAgentInfoValidateForm.casePolicy
                )
              "
            >
              <a-popover
                placement="top"
                :destroyTooltipOnHide="true"
                :content="
                  callCommonUtilFeildMsg(
                    notiCallUpAgentInfoValidateForm.casePolicy
                  )
                "
                :trigger="
                  callCommonUtilFeildTrigger(
                    notiCallUpAgentInfoValidateForm.casePolicy
                  )
                "
                :visible="
                  callCommonUtilFeildHoverVisible(
                    notiCallUpAgentInfoValidateForm.casePolicy
                  )
                "
                @visibleChange="
                  callCommonUtilFeildVisibleChange(
                    notiCallUpAgentInfoValidateForm.casePolicy
                  )
                "
              >
                <a-input
                  type="text"
                  v-model="notiCallUpAgentInfoForm.casePolicy"
                  :maxLength="25"
                >
                </a-input>
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="notiCallUpAgentInfoForm.checkSend == 'Y'">
          <a-col>
            <!-- 保戶電話 -->
            <a-form-model-item
              :label="$t('notificationCallUpAgentInfo_custMobChang')"
              class=""
              prop="custMobChang"
              style="margin-bottom: 0px"
              :has-feedback="
                callCommonUtilFeildFeedback(
                  notiCallUpAgentInfoValidateForm.custMobChang
                )
              "
              :validateStatus="
                callCommonUtilFeildStatus(
                  notiCallUpAgentInfoValidateForm.custMobChang
                )
              "
            >
              <a-popover
                placement="top"
                :destroyTooltipOnHide="true"
                :content="
                  callCommonUtilFeildMsg(
                    notiCallUpAgentInfoValidateForm.custMobChang
                  )
                "
                :trigger="
                  callCommonUtilFeildTrigger(
                    notiCallUpAgentInfoValidateForm.custMobChang
                  )
                "
                :visible="
                  callCommonUtilFeildHoverVisible(
                    notiCallUpAgentInfoValidateForm.custMobChang
                  )
                "
                @visibleChange="
                  callCommonUtilFeildVisibleChange(
                    notiCallUpAgentInfoValidateForm.custMobChang
                  )
                "
              >
                <a-input
                  type="text"
                  v-model="notiCallUpAgentInfoForm.custMobChang"
                  :maxLength="30"
                />
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="notiCallUpAgentInfoForm.checkSend == 'Y'">
          <a-col>
            <!-- 保戶訴求 -->
            <a-form-model-item
              :label="$t('notificationCallUpAgentInfo_custAppeal')"
              class=""
              prop="custAppeal"
              style="margin-bottom: 0px"
              :has-feedback="
                callCommonUtilFeildFeedback(
                  notiCallUpAgentInfoValidateForm.custAppeal
                )
              "
              :validateStatus="
                callCommonUtilFeildStatus(
                  notiCallUpAgentInfoValidateForm.custAppeal
                )
              "
            >
              <a-popover
                placement="top"
                :destroyTooltipOnHide="true"
                :content="
                  callCommonUtilFeildMsg(
                    notiCallUpAgentInfoValidateForm.custAppeal
                  )
                "
                :trigger="
                  callCommonUtilFeildTrigger(
                    notiCallUpAgentInfoValidateForm.custAppeal
                  )
                "
                :visible="
                  callCommonUtilFeildHoverVisible(
                    notiCallUpAgentInfoValidateForm.custAppeal
                  )
                "
                @visibleChange="
                  callCommonUtilFeildVisibleChange(
                    notiCallUpAgentInfoValidateForm.custAppeal
                  )
                "
              >
                <a-select
                  v-model="notiCallUpAgentInfoForm.custAppeal"
                  :options="emailTemplateOpts"
                  :filter-option="filterOption"
                  show-search
                  @change="changeEmailTemplate($event)"
                >
                </a-select>
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="notiCallUpAgentInfoForm.checkSend == 'Y'">
          <a-col>
            <!-- Email主旨 -->
            <a-form-model-item
              :label="$t('email_subject')"
              class=""
              prop="emailSubject"
              style="margin-bottom: 0px"
              :has-feedback="
                callCommonUtilFeildFeedback(
                  notiCallUpAgentInfoValidateForm.emailSubject
                )
              "
              :validateStatus="
                callCommonUtilFeildStatus(
                  notiCallUpAgentInfoValidateForm.emailSubject
                )
              "
            >
              <a-popover
                placement="top"
                :destroyTooltipOnHide="true"
                :content="
                  callCommonUtilFeildMsg(
                    notiCallUpAgentInfoValidateForm.emailSubject
                  )
                "
                :trigger="
                  callCommonUtilFeildTrigger(
                    notiCallUpAgentInfoValidateForm.emailSubject
                  )
                "
                :visible="
                  callCommonUtilFeildHoverVisible(
                    notiCallUpAgentInfoValidateForm.emailSubject
                  )
                "
                @visibleChange="
                  callCommonUtilFeildVisibleChange(
                    notiCallUpAgentInfoValidateForm.emailSubject
                  )
                "
              >
                <a-input
                  type="text"
                  v-model="notiCallUpAgentInfoForm.emailSubject"
                  :maxLength="30"
                  :defaultValue="notiCallUpAgentInfoForm.emailSubject"
                />
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="notiCallUpAgentInfoForm.checkSend == 'Y'">
          <a-col>
            <!-- 訊息內容 -->
            <a-form-model-item
              :label="$t('notificationCallUpAgentInfo_emailContent')"
              class=""
              prop="emailContent"
              style="margin-bottom: 0px"
              :has-feedback="
                callCommonUtilFeildFeedback(
                  notiCallUpAgentInfoValidateForm.emailContent
                )
              "
              :validateStatus="
                callCommonUtilFeildStatus(
                  notiCallUpAgentInfoValidateForm.emailContent
                )
              "
            >
              <a-popover
                placement="top"
                :destroyTooltipOnHide="true"
                :content="
                  callCommonUtilFeildMsg(
                    notiCallUpAgentInfoValidateForm.emailContent
                  )
                "
                :trigger="
                  callCommonUtilFeildTrigger(
                    notiCallUpAgentInfoValidateForm.emailContent
                  )
                "
                :visible="
                  callCommonUtilFeildHoverVisible(
                    notiCallUpAgentInfoValidateForm.emailContent
                  )
                "
                @visibleChange="
                  callCommonUtilFeildVisibleChange(
                    notiCallUpAgentInfoValidateForm.emailContent
                  )
                "
              >
                <a-textarea
                  type="text"
                  v-model="notiCallUpAgentInfoForm.emailContent"
                  :auto-size="{ minRows: 4, maxRows: 10 }"
                  :maxLength="500"
                />
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="notiCallUpAgentInfoForm.checkSend == 'Y'">
          <div
            type="flex"
            justify="end"
            style="text-align: right; margin: 16px auto"
          >
            <!-- 發送 -->
            <a-button type="primary" @click="sendInfoToAgent">
              {{ $t("notificationModal_send") }}
            </a-button>
          </div>
        </a-row>
      </a-form-model>
    </div>
  </div>
</template>
<script src="./NotificationCallUpAgentInfo.ts" lang="ts"></script>
 
<style lang="less" scoped>
</style>