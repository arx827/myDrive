<template>
  <div class="onDutyPage">
    <div class="odp-content-header">
      <div class="top-menu">
        <div
          v-for="(item, idx) in topMenu"
          :key="idx"
          :class="[
            'top-menu-item',
            item.isAvailable ? 'top-menu-item-enable' : 'top-menu-item-disable',
          ]"
          @click="item.isAvailable ? handleTest(item.label) : ''"
        >
          <a-dropdown>
            <span style="display: flex"
              ><i class="odp-icon" :class="item.class" />{{ item.label }}</span
            >

            <a-menu
              slot="overlay"
              v-if="item.label == '調檔' && item.isAvailable"
              class="transferFilelist"
            >
              <a-menu-item
                v-if="authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_FMS.show"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="fmsFileTransferUrl"
                  >{{ $t("onDutyPage_FMSmanageSystem") }}</a
                >
              </a-menu-item>
              <a-menu-item
                v-if="authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_F2B.show"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="f2bFileTransferUrl"
                  >{{ $t("onDutyPage_F2BFubon") }}</a
                >
              </a-menu-item>
              <a-menu-item
                v-if="authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_INSUR.show"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="insuranceTransferUrl"
                  >{{ $t("onDutyPage_insurancePlatform") }}</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
      <div class="top-feature">
        <template v-for="item in topFeature">
          <div
            :key="item.key"
            :class="[
              'top-feature-item',
              item.key === 'interViewRemark' && 'top-feature-item-disable',
            ]"
            v-if="item.key != 'appeal' || isCustMark"
            @click="topRightButtonAction(item.key)"
          >
            <template v-if="item.key != 'alert'"> {{ item.label }} </template>
            <template v-else
              >{{ item.label }}
              <a-icon
                v-if="showTransitionMark"
                type="exclamation-circle"
                style="color: #f5222d"
            /></template>
          </div>
        </template>
      </div>
    </div>
    <div class="odp-content-infoBar">
      <p class="info-cack">
        <span class="info-cack__title">名單序號</span>
        <span class="info-cack__data">{{ packNo }}</span>
      </p>
    </div>
    <a-modal
      v-model="interViewRemarkVisible"
      :title="$t('interViewer_remark')"
      class="error-modal-util-class"
      :cancelText="$t('global_cancel')"
      :okText="$t('roleSF_confirm')"
      :maskClosable="false"
      @ok="interViewRemarkSubmit()"
      @cancel="interViewRemarkCancel()"
    >
      <a-row type="flex" justify="start">
        <a-col :span="24">
          <InterViewerRemarkForm
            ref="userForm"
            @reloadData="closeInterViewerRemarks"
          >
          </InterViewerRemarkForm>
        </a-col>
      </a-row>
      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="interViewRemarkCancel()">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="interViewRemarkSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <div class="odp-content-body">
      <div class="body-section body-section--left" ref="sectionLeft">
        <!-- (綠色框線) -->

        <!-- [測試用]查看問卷區塊回傳資料及自訂pack_no -->
        <!--<a-row>
          <a-col :span="16">
            <a-input type="text" v-model="packNoTest" :maxLength="20"></a-input>
          </a-col>
          <a-col :span="8">
            <a-button type="primary" @click="getQuestAreaData"> 查詢 </a-button>
            <a-button type="primary" @click="clickAnswer"> 資料 </a-button>
          </a-col>
        </a-row>-->

        <!-- 問卷「開場白」顯示區塊 -->
        <div v-if="true" class="sectionRight-block">
          <BlockHeader
            ref="headerOpen"
            :blockTitle="'開場白'"
            :themeColor="'theme3'"
            :collapse="true"
          />

          <div class="quest-content">
            <QuestOpenArea
              :openAreaData="openAreaData"
              :questAllData="questAllData"
            >
            </QuestOpenArea>

            <CustomerAnswer
              custType="open"
              :questAllData="questAllData"
              :packNo="packNo"
            >
            </CustomerAnswer>
          </div>
        </div>

        <!-- 問卷「核身」顯示區塊 -->
        <div v-if="true" class="sectionRight-block">
          <BlockHeader
            ref="headerCheckId"
            :blockTitle="'核對身份'"
            :themeColor="'theme3'"
            :collapse="true"
          />

          <div class="quest-content">
            <QuestCheckIdArea
              :checkIdAreaData="checkIdAreaData"
              :questAllData="questAllData"
            >
            </QuestCheckIdArea>

            <CustomerAnswer
              custType="checkId"
              :questAllData="questAllData"
              :packNo="packNo"
            >
            </CustomerAnswer>
          </div>
        </div>

        <!-- 問卷「題目」顯示區塊 -->
        <div v-if="true" class="sectionRight-block">
          <BlockHeader
            ref="headerQuest"
            :blockTitle="questTitle"
            :showTipIcon="this.questAreaData.isChangeWork"
            :themeColor="'theme3'"
            :collapse="true"
            :tipMessage="questTipMsg"
          />

          <div class="quest-content">
            <QuestArea
              :questAreaData="questAreaData"
              :endData="endData"
              :questAllData="questAllData"
              @saveAllQuest="saveAllQuest"
            >
            </QuestArea>
          </div>
        </div>

        <!-- 電訪結果 table -->
        <div class="sectionRight-block">
          <TeleResult
            v-if="isShowTeleResult"
            :currentPack="currentPack"
            :questAreaData="questAreaData"
            :questAllData="questAllData"
            @saveAllQuest="saveAllQuest"
            @changeOpenCount="changeOpenCount"
            @clossAllFormByTeleResultArea="clossAllFormByTeleResultArea"
            @changeTransitionMark="setTransitionMark"
            ref="teleResultArea"
          />
        </div>
      </div>

      <div class="body-section body-section--right">
        <!-- 電訪資料 table -->
        <a-spin :spinning="isTransferFileLoading">
          <div class="sectionLeft-block">
            <!-- 電訪資料 -->
            <BlockHeader
              :blockTitle="$t('onDutyPage_teleData')"
              :themeColor="'theme2'"
            />
            <div class="result__table">
              <FblDataGrid
                :themeColor="'theme2'"
                :scroll="{ x: 1300, y: 150 }"
                :row-key="gridTelData.rowKey"
                :columns="gridTelData.columns"
                :data="gridTelData.data"
                :pagination="gridTelData.pagination"
                :empty-data="gridTelData.data.length <= 0"
              >
                <template v-slot:sysSourceTypeTemp="slotProps">
                  <a-popover
                    :content="slotProps.data.sysSourceTypeName"
                    trigger="click"
                  >
                    <p>{{ slotProps.data.casePolicy }}</p>
                  </a-popover>
                </template>
                <template v-slot:videoListTemp="slotProps">
                  <!-- 電訪資料-影像清單 -->
                  <!-- 新契約-F2B/FMS -->
                  <i
                    v-if="
                      slotProps.data.businessTypeCode == 'NB' &&
                      authComponent.ON_DUTY_TELDATA_F2B_FMS.show
                    "
                    class="odp-icon odp-icon__detailPage"
                    @click="videoListAction(slotProps.data)"
                  />
                  <!-- 保全 -->
                  <a-button
                    v-if="
                      ['MC', 'PS', 'MC1', 'PS1'].includes(
                        slotProps.data.sysSourceType
                      ) && authComponent.ON_DUTY_TELDATA_PS.show
                    "
                    @click="videoListAction(slotProps.data)"
                    type="primary"
                    :block="true"
                    >{{ $t("onDutyPage_f2b") }}</a-button
                  >
                </template>
                <template v-slot:riskControlDetailsTemp="slotProps">
                  <i
                    class="odp-icon odp-icon__detailPage"
                    @click="riskControlDetailsAction(slotProps.data)"
                  />
                </template>
              </FblDataGrid>
            </div>
          </div>
        </a-spin>

        <!-- 保單基本資料 table -->
        <div class="sectionLeft-block">
          <BlockHeader
            :blockTitle="$t('onDutyPage_policyData')"
            :themeColor="'theme1'"
            :displayAll="true"
            :blockName="'policyData'"
            @showAll="showAllData"
            :countNum="policyDataCountNum"
          />
          <div class="result__table">
            <PolicyData
              :currentPack="currentPack"
              :isModal="isPolicyDataFormVisiable"
              :isGetPolicyContractStatus="isGetPolicyContractStatusData"
              @havePolicyData="havePolicyDataShow"
            ></PolicyData>
          </div>
        </div>

        <!-- 交辦部門註記 table -->
        <div class="sectionLeft-block">
          <BlockHeader
            :blockTitle="$t('onDutyPage_deptMark')"
            :themeColor="'theme2'"
            :displayAll="true"
            :blockName="'deptMark'"
            :countNum="deptMarkDataCountNum"
            @showAll="showAllData"
          />
          <DeptMark ref="deptMark" @totalDataLength="totalDataLength" />
        </div>

        <!-- 服務歷程-電訪紀錄 table -->
        <div class="sectionLeft-block">
          <BlockHeader
            :blockTitle="$t('onDutyPage_serveHistory')"
            :themeColor="'theme1'"
            :tabsArray="gridDTabEnum"
            :defaultTabKey="defaultTabDKey"
            :countNum="serveContactLenght"
            :displayAll="true"
            :blockName="'serveHistory'"
            :tabKey="serveTabKey"
            @changeTab="handleChangeTabD"
            @showAll="showAllData"
          />
          <ServeContactHistroy
            :isModal="isServeHistoryFormVisible"
            :tabKey="serveTabKey"
            :currentPack="currentPack"
            @getLength="serveContactDataLength"
          ></ServeContactHistroy>
        </div>

        <!-- 撥號歷程 table -->
        <div class="sectionLeft-block">
          <BlockHeader
            :blockTitle="$t('case_search_grid_haveCallUpHis')"
            :themeColor="'theme2'"
            :displayAll="true"
            :blockName="'phoneCallHistory'"
            :countNum="callUpHistoryCountNum"
            @showAll="showAllData"
          />
          <div class="result__table">
            <CallupHistory
              @getCount="callUpHistoryCount"
              :callUpHistoryParam="callUpHistoryParam"
            />
          </div>
        </div>
      </div>

      <!-- 撥號面板 -->
      <DragModal
        class="c-section c-section--else pointer-events-none"
        :visible="isCallUpFormVisible"
        :title="$t('OnDutyPage_dialerTitle')"
        width="75%"
        :okText="$t('onDutyPage_close')"
        @ok="onDialerSave($event)"
        :closable="false"
        :removeCancelButton="true"
        :isMasked="false"
      >
        <CallUpForm ref="callUpForm" @dialerValue="onDialerValueSave" />
      </DragModal>

      <!-- 發送通知 -->
      <a-modal
        v-model="isNoticeFormVisible"
        :title="$t('onDutyPage_sendNotice')"
        width="70%"
        :closable="true"
        :maskClosable="false"
        :keyboard="false"
        :footer="null"
        :destroyOnClose="true"
      >
        <NoticeForm ref="noticeForm" />

        <!-- <template slot="footer">
          <a-button type="primary" @click="closeNoticeForm()"> {{ $t("global_close") }} </a-button>
        </template> -->
      </a-modal>

      <!-- 風控明細 -->
      <!-- <a-modal
        :visible="isRiskControlDetails"
        :title="'風控明細'"
        width="70%"
        :closable="false"
      > -->
      <!-- 風控明細 -->
      <DragModal
        class="c-section c-section--else pointer-events-none"
        :visible="isRiskControlDetails"
        :title="$t('onDutyPage_riskControlDetailsTemp')"
        width="45%"
        :okText="$t('onDutyPage_close')"
        :closable="true"
        @cancel="isRiskControlDetails = false"
        :removeCancelButton="true"
        :isMasked="false"
      >
        <RiskControl
          ref="riskControl"
          :riskControlDetailsShowData="riskControlDetailsShowData"
          :theRiskControlDetailsData="theRiskControlDetailsData"
          :theBusinessTypeCode="theBusinessTypeCode"
          :isPolicyBasicDateChanged="isPolicyBasicDateChanged"
          :thePolicyBasicBackupData="thePolicyBasicBackupData"
        />
        <template slot="footer">
          <a-button
            type="primary"
            @click="isRiskControlDetails = !isRiskControlDetails"
          >
            {{ $t("global_close") }}
          </a-button>
        </template>
      </DragModal>
      <!-- </a-modal> -->
    </div>

    <!-- 照會 Modal -->
    <a-modal
      v-model="isNotificationFormVisible"
      :title="$t('teleResultArea_afterTel_noti_btn')"
      width="70%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <NotificationModal
        :step="notificationData.notiStep"
        :propCaseNo="notificationData.caseNo"
        @onLeave="onCloseModal('isNotificationFormVisible')"
      />
    </a-modal>

    <!-- 會辦 Modal -->
    <a-modal
      v-model="isCountersignatureFormVisible"
      :title="'會辦'"
      width="70%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <CuntersignatureModal
        :step="cuntersignatureData.infStep"
        :propCaseNo="cuntersignatureData.caseNo"
        :propPackNo="packNo"
        @onLeave="onCloseModal('isCountersignatureFormVisible')"
      />
    </a-modal>

    <!-- 會辦單覆核 Modal -->
    <!-- <a-modal
      v-model="isCountersignatureFormVisible"
      :title="'會辦單覆核'"
      width="70%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <CuntersignatureModal
        :caseType="'review'"
        :policyNo="cuntersignatureData.policyNo"
        @onLeave="onCloseModal('isCountersignatureFormVisible')"
      />
    </a-modal> -->

    <!-- 檔案上傳Modal --->
    <!-- 檔案上傳 -->
    <a-modal
      v-model="isFileUploadFormVisible"
      :title="$t('onDutyPage_fileUpload')"
      width="70%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <FileUploadForm ref="fileUploadForm" :packNo="packNo" />
    </a-modal>

    <!-- 案件查詢Modal --->
    <!-- 目前此modal無使用 -->
    <!-- <a-modal
      v-model="isCaseSearchModalVisible"
      :title="'案件查詢'"
      width="70%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <CaseSearchForm ref="CaseSearchGrid" />
    </a-modal> -->

    <!-- 案件查詢 Modal --->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="isCaseSearchModalVisible"
      :title="$t('notiInfNotClose_caseSearch')"
      width="85%"
      :visibleFooter="false"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      :okText="$t('onDutyPage_close')"
      @ok="onCloseModal('isCaseSearchModalVisible')"
      @cancel="onCloseModal('isCaseSearchModalVisible')"
    >
      <CaseSearchPage
        ref="CaseSearchPageForm"
        :casePolicyNumber="notiInfNotCloseCasePolicyNumber"
      >
      </CaseSearchPage>
    </DragModal>

    <!-- 歸戶提示訊息Modal -->
    <a-modal
      v-model="isTransitionFormVisible"
      title="歸戶提示訊息"
      width="70%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <TransitionForm @onLeave="onCloseModal('isTransitionFormVisible')" />
    </a-modal>

    <!-- 保單基本資料全部資訊Modal -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="isPolicyDataFormVisiable && isPolicyDataVisiableIfHaveData"
      :title="$t('onDutyPage_policyData')"
      width="75%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @ok="onCloseModal('isPolicyDataFormVisiable')"
      @cancel="onCloseModal('isPolicyDataFormVisiable')"
    >
      <PolicyData
        :currentPack="currentPack"
        :isModal="isPolicyDataFormVisiable"
        :isGetPolicyContractStatus="isGetPolicyContractStatusData"
        @havePolicyData="havePolicyDataShow"
      ></PolicyData>
    </DragModal>

    <!-- 交辦部門註記  -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="isDeptMarkVisible"
      :title="$t('onDutyPage_deptMark')"
      width="75%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @ok="onCloseModal('isDeptMarkVisible')"
      @cancel="onCloseModal('isDeptMarkVisible')"
    >
      <DeptMark
        @totalDataLength="totalDataLength"
        :amIform="isDeptMarkVisible"
      />
    </DragModal>

    <!-- 服務歷程外部系統 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="isServeHistoryFormVisible"
      :title="$t('onDutyPage_serveHistory')"
      width="65%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @ok="onCloseModal('isServeHistoryFormVisible')"
      @cancel="onCloseModal('isServeHistoryFormVisible')"
    >
      <ServeContactHistroy
        :isModal="isServeHistoryFormVisible"
        :tabKey="serveTabKey"
      ></ServeContactHistroy>
    </DragModal>
    <!-- F2B影像清單 -->
    <DragModal
      :visible="isF2BFileListvisible"
      :title="$t('f2BFileForm_F2BFileList')"
      width="60%"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="isF2BFileListvisible = false"
    >
      <F2BFileForm
        :iniData="f2BFileListiniData"
        :f2BPreviewUrl="f2BPreviewUrl"
      ></F2BFileForm>
    </DragModal>

    <!-- 電訪資料-特保/申訴 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="isAppealFormVisible"
      :title="$t('policyMark_policyAndAppeal')"
      width="50%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      :footer="null"
      :bodyStyle="{ maxHeight: '800px', overflow: 'auto' }"
      @cancel="onCloseModal('isAppealFormVisible')"
      @ok="onCloseModal('isAppealFormVisible')"
    >
      <!-- 特保註記 -->
      <BlockHeader
        v-if="custMarList.success"
        :blockTitle="$t('policyMark_policyMark')"
        :themeColor="'theme1'"
        :displayAll="false"
      />
      <div class="result__table">
        <DescriptionsForm
          :initData="custMarList.dataList"
          :name="'custMark'"
          :themeColor="'theme1'"
        />
      </div>
      <!-- 來電提示 -->
      <BlockHeader
        v-if="inCallingList.success"
        :blockTitle="$t('policyMark_inCalling')"
        :themeColor="'theme2'"
        :displayAll="false"
      />
      <div class="result__table">
        <DescriptionsForm
          :initData="inCallingList.dataList"
          :name="'inCalling'"
          :themeColor="'theme2'"
        />
      </div>
      <!-- 申訴紀錄 -->
      <!-- <p class="appealRemind" v-if="appealData.remind">『※此為最近一筆申訴案件，如需確認其他申訴案件請科長或場控至「客戶申訴暨服務改善管理系統」查詢』</p> -->
      <BlockHeader
        v-if="appealData.caseNo"
        :blockTitle="$t('policyMark_appeal')"
        :themeColor="'theme4'"
        :displayAll="false"
        :headerText="appealRemindText"
        :headerTextStyle="appealRemindStyle"
        :isHeaderTextShow="appealData.remind"
      />
      <a-descriptions
        bordered
        size="small"
        :column="2"
        class="appeal-descirption"
        v-if="appealData.success"
      >
        <!-- 案號 -->
        <a-descriptions-item :label="$t('policyMark_appealCaseNo')">
          <div class="description-content">
            {{ appealData.caseNo }}
          </div>
        </a-descriptions-item>
        <!-- 受理日 -->
        <a-descriptions-item :label="$t('policyMark_asReceiveDate')">
          <div class="description-content">
            {{ appealData.asreceiveDate }}
          </div>
        </a-descriptions-item>
        <!-- 申訴人 -->
        <a-descriptions-item :label="$t('policyMark_appealId')">
          <div class="description-content">
            {{ appealData.appealID }}
          </div>
        </a-descriptions-item>
        <!-- 保單號碼 -->
        <a-descriptions-item :label="$t('policyMark_policyNo')">
          <div class="description-content">
            {{ appealData.policyNo }}
          </div>
        </a-descriptions-item>
        <!-- 主要類別 -->
        <a-descriptions-item :label="$t('policyMark_appealType')">
          <div class="description-content">
            {{ appealData.appealType }}
          </div>
        </a-descriptions-item>
        <!-- 申訴來源 -->
        <a-descriptions-item :label="$t('policyMark_appealSource')">
          <div class="description-content">
            {{ appealData.appealSource }}
          </div>
        </a-descriptions-item>
        <!-- 承辦人 -->
        <a-descriptions-item :label="$t('policyMark_processName')">
          <div class="description-content">
            {{ appealData.processName }}
          </div>
        </a-descriptions-item>
        <!-- 處理狀態 -->
        <a-descriptions-item :label="$t('policyMark_appealStatus')">
          <div class="description-content">
            {{ appealData.appealStatus }}
          </div>
        </a-descriptions-item>
        <!-- 申訴主題 -->
        <a-descriptions-item :label="$t('policyMark_appealTheme')">
          <div class="description-content appealTheme">
            {{ appealData.appealTheme }}
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </DragModal>
    <!-- 撥號歷程所有資料Modal -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="isPhoneCallHistoryFormVisible"
      :title="$t('case_search_grid_haveCallUpHis')"
      width="65%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @ok="onCloseModal('isPhoneCallHistoryFormVisible')"
      @cancel="onCloseModal('isPhoneCallHistoryFormVisible')"
    >
      <div class="result__table">
        <CallupHistory :callUpHistoryParam="callUpHistoryParam" />
      </div>
    </DragModal>
    <!-- 照會/會辦未結案提醒表單 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="isNotiInfNotCloseRemindFormVisible"
      :title="$t('notiInfNotClose_notCloseNotify')"
      width="85%"
      :visibleFooter="false"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      :okText="$t('onDutyPage_close')"
      @ok="onCloseModal('isNotiInfNotCloseRemindFormVisible')"
      @cancel="onCloseModal('isNotiInfNotCloseRemindFormVisible')"
    >
      <NotiInfNotCloseRemind
        :notiInfNotCloseList="notiInfNotCloseList"
        @notiInfNotCloseRemindCaseSearch="notiInfNotCloseRemindCaseSearch"
      />
    </DragModal>
  </div>
</template>

<script src="./OnDutyPage.ts" lang="ts"></script>
<style lang="less" scoped>
/deep/ .appeal-descirption {
  // 申訴紀錄資料固定大小
  .ant-descriptions-item-content {
    width: 50%;
  }
  .ant-descriptions-item-label {
    color: @theme1;
    font-weight: 600;
    background-color: white;
    // 申訴紀錄固定th
    word-break: keep-all;
    width: 6em;
  }
}
/deep/.ant-descriptions {
  padding-top: 2px;
  // box-shadow:0px 0px 5px 2px rgb(0 0 0 / 20%);
}

.transferFilelist a:hover {
  color: black;
  background-color: #72bfdb;
}
// 原本申訴紀錄談窗與遮蔽css 暫無使用
// .description-content {
//   width: 100%;
//   overflow: hidden;
//   display: -webkit-box;
//   text-overflow: ellipsis;
//   -webkit-line-clamp: 1; /*行數*/
//   -webkit-box-orient: vertical;
//   white-space: normal;
//   &.appealTheme{
//     -webkit-line-clamp: 2; /*行數*/
//   }
// }
// .appealTheme-popover {
//   width: 500px;
// }
</style>