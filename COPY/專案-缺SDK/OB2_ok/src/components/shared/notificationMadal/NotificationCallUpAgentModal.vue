<template>
  <a-spin :spinning="isSalesmanInfoLoading">
    <div class="Notification__CallupAgent">
      <!-- 載入第一順位業務員、共招業務員(預設資料帶入第一順位業務員聯絡資訊) -->
      <div class="section-card section__basic">
        <div class="card__infomation">
          <div>
            <a-radio-group
              class="notiCallUpAgent__radioGroup"
              v-model="pickedAgentRadioValue"
              :disabled="isDisableAgent"
              @change="onAgentPick"
              size="small"
            >
              <a-descriptions
                :column="{ xs: 1, sm: 1, md: 2, lg: 2, xxl: 3 }"
                bordered
                layout="vertical"
              >
                <!-- 業務員 -->
                <a-descriptions-item
                  :label="$t('notificationCallUpAgentModal_agent')"
                >
                  <div class="radioVerticalStyle">
                    <a-radio
                      :value="1"
                      v-if="
                        notificationAgentDto && notificationAgentDto.agentId1
                      "
                    >
                      {{ notificationAgentDto.agent1 }}
                    </a-radio>
                    <a-radio
                      :value="3"
                      v-if="
                        notificationAgentDto && notificationAgentDto.agentId2
                      "
                    >
                      {{ notificationAgentDto.agent2 }}
                    </a-radio>
                  </div>
                </a-descriptions-item>
                <!-- 直屬主管 -->
                <a-descriptions-item
                  :label="$t('notificationCallUpAgentModal_manager')"
                >
                  <div class="radioVerticalStyle">
                    <a-radio
                      :value="2"
                      v-if="
                        notificationAgentDto && notificationAgentDto.managerId1
                      "
                    >
                      {{ notificationAgentDto.manager1 }}
                    </a-radio>
                    <a-radio
                      :value="4"
                      v-if="
                        notificationAgentDto && notificationAgentDto.managerId2
                      "
                    >
                      {{ notificationAgentDto.manager2 }}
                    </a-radio>
                  </div>
                </a-descriptions-item>
              </a-descriptions>

              <div
                type="flex"
                justify="end"
                style="text-align: right; margin: 16px auto"
              >
                <!-- 查詢其他業務員 -->
                <a-button
                  type="primary"
                  :disabled="isDisableAgent"
                  @click="onSearchOtherAgent()"
                >
                  {{ $t("notificationCallUpAgentModal_searchOtherAgent") }}
                </a-button>
              </div>
              <div v-if="this.pickedAgentList.length > 0">
                <!-- 其他業務員 -->
                <span class="card__title" style="display: table">{{
                  $t("notificationCallUpAgentModal_otherAgent")
                }}</span>
                <a-descriptions
                  :column="{ xs: 1, sm: 1, md: 2, lg: 2, xxl: 2 }"
                  bordered
                  layout="vertical"
                >
                  <a-descriptions-item
                    v-for="(col, index) in pickedAgentList"
                    :key="index.toString()"
                    :label="
                      $t('notificationCallUpAgentModal_otherAgent') +
                      (index + 1)
                    "
                  >
                    <div class="radioVerticalStyle">
                      <a-radio :value="index + 5" v-if="col && col.agentId">
                        {{ col.agent }}
                      </a-radio>
                    </div>
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </a-radio-group>
            <!-- <div v-if="this.pickedAgentList.length > 0">
              <p>其他業務員</p>
              <a-row type="flex">
                <a-col flex="5">
                  {{ "其他業務員" }}
                </a-col>
              </a-row>
            </div> -->
          </div>
        </div>

        <a-modal
          class="c-section c-section--else pointer-events-none"
          :visible="searchOtherAgentShow"
          :title="$t('notificationCallUpAgent_searchForOtherAgent')"
          width="65%"
          :okText="$t('onDutyPage_close')"
          :closable="true"
          :isMasked="false"
          :removeCancelButton="true"
          @ok="searchOtherAgentShow = false"
          @cancel="searchOtherAgentShow = false"
          @afterClose="searchOtherAgentShow = false"
        >
          <div class="result__table">
            <NotificationAgentSearchModal
              :searchOtherAgentShow="searchOtherAgentShow"
              @pickAgent="pickAgent"
            />
          </div>
          <template #footer>
            <a-row type="flex" justify="end">
              <!-- 離開 -->
              <a-button key="submit" @click="searchOtherAgentShow = false">{{
                $t("global_leave")
              }}</a-button>
            </a-row>
          </template>
        </a-modal>
      </div>

      <!-- 聯絡對象區 -->
      <NotificationCallUpAgentContactPerson
        ref="NotificationCallUpAgentContactPerson"
        :initData="notificationAgentDto"
        :agentPickValue="pickedAgentRadioValue"
        :initAgentData="initAgentData"
        :searchOtherAgentData="searchOtherAgentData"
        :caseLogId="propCaseLogId"
        :caseNo="caseNo"
        :isFromOnDuty="isFromOnDuty"
        @codingNo="getCodingNo"
        @isSaveCallUpResult="getIsSaveCallUpResult"
        @isSendMessage="getIsSendMessage"
      />

      <!-- 訊息發送區 -->
      <NotificationCallUpAgentInfo
        ref="NotificationCallUpAgentInfo"
        :caseLogId="propCaseLogId"
        :caseNo="caseNo"
        :notiInfoId="notiInfoId"
        :initData="notificationAgentDto"
        :agentPickValue="pickedAgentRadioValue"
        :initAgentData="initAgentData"
        :searchOtherAgentData="searchOtherAgentData"
        :isSendMessage="isSendMessage"
        @contactAgentData="getContactAgentData"
        @isSendMessage="getIsSendMessage"
      />
    </div>
  </a-spin>
</template>

<script src="./NotificationCallUpAgentModal.ts" lang="ts"></script>
<style lang="less" scoped>
/deep/ .Notification__CallupAgent {
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-descriptions-view {
    overflow: auto;
  }
  .ant-descriptions-item-label {
    white-space: nowrap;
  }

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

  // 欄位樣式
  .readonly__textarea {
    background-color: @COLOR-GRAY4;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    line-height: 1.5;
    padding: 10px;
  }
  .file__lists {
    margin-left: 80px;
    margin-right: 80px;
  }

  // footerBar
  .countersignature__footerBar {
    margin-top: 20px;
  }

  // 業務員 直屬主管選項
  .notiCallUpAgent__radioGroup {
    width: 100%;
    text-align: center;
  }

  // 第二業務員 直屬主管選項
  .radioVerticalStyle {
    display: flex;
    flex-direction: column;
    .ant-radio-wrapper {
      + .ant-radio-wrapper {
        margin-top: 10px;
      }
    }
  }
}
</style>