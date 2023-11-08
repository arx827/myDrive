<template>
  <div>
    <div class="container">
      <h2 class="page__title">
        查詢結果
      </h2>
      <div class="query__wrapper d-lg-flex align-items-center mb-4 text-center">
        <a-radio-group
          v-model="tableType"
          class="query__radio m-auto"
          button-style="solid"
        >
          <a-radio-button
            v-for="(item,index) in tableTypeOption"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
        <div class="query__check mt-4 mt-lg-0">
          <button
            class="btn__main btn__main--light"
            @click="openNurseRecordModal"
          >
            查看護理紀錄
          </button>
        </div>
      </div>
      <div class="page__card p-0 block--padding">
        <div class="page__card__title page__card__headerTitle">
          個人基本資料
        </div>
        <div
          v-if="infoData"
          class="row card__info"
        >
          <div class="col-md card__info__col">
            <div
              v-for="colItem in infoTable.column1"
              :key="colItem.value"
              class="row mb-2"
            >
              <div class="col-6 col-md-3 title--green">
                {{ colItem.label }}
              </div>
              <div class="col-6 col-md-9">
                {{ infoData[colItem.value] }}
              </div>
            </div>
          </div>
          <div class="col-md card__info__col">
            <div
              v-for="colItem in infoTable.column2"
              :key="colItem.value"
              class="row mb-2"
            >
              <div class="col-6 title--green">
                {{ colItem.label }}
              </div>
              <div class="col-6">
                {{ infoData[colItem.value] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="notMobile">
        <a-collapse
          default-active-key="1"
          :bordered="false"
        >
          <a-collapse-panel
            key="1"
          >
            <template slot="header">
              <a-checkbox-group
                v-model="recordType"
                style="width: 100%"
              >
                <div class="row">
                  <div class="col">
                    <div class="collapse__title">
                      護理紀錄類別
                    </div>
                  </div>
                  <div
                    v-for="(item, index) in recordTypeOption"
                    :key="index"
                    class="col"
                    @click.stop
                  >
                    <a-checkbox
                      :value="item.value"
                      class="query__wrap"
                    >
                      {{ item.label }}
                    </a-checkbox>
                  </div>
                </div>
              </a-checkbox-group>
            </template>
            <div class="row collapse__content">
              <div class="col" />
              <div
                v-for="i in 5"
                :key="i"
                class="col"
              >
                <a-textarea
                  v-model="recordForm[i-1]"
                  :auto-size="{ minRows: 6 }"
                  placeholder="備註：字數上限250"
                  :max-length="250"
                />
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="isMobile">
        <a-collapse
          default-active-key="1"
          :bordered="false"
        >
          <a-collapse-panel
            key="1"
            header="護理紀錄類別"
          >
            <div class="row collapse__content">
              <a-checkbox-group
                v-model="recordType"
                style="width: 100%"
              >
                <div
                  v-for="(item, index) in recordTypeOption"
                  :key="index"
                >
                  <a-checkbox
                    :value="item.value"
                    class="query__wrap mb-2"
                  >
                    {{ item.label }}
                  </a-checkbox>
                  <a-textarea
                    v-model="recordForm[index]"
                    class="mb-3"
                    :auto-size="{ minRows: 2 }"
                    placeholder="備註：字數上限250"
                    :max-length="250"
                  />
                </div>
              </a-checkbox-group>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="form__wrap">
        <div
          class="btn__wrap d-sm-flex justify-content-between text-center"
        >
          <button
            v-if="tableType"
            class="btn__black"
          >
            當年度歷程
          </button>
          <div class="d-flex justify-content-end mt-3 m-sm-0">
            <div
              v-if="tableType && (tableType!='ergonomic') && (tableType!='mother')"
              class="d-flex form__year--select"
            >
              其他年度歷程
              <a-select
                v-model="period"
                :options="yearOpts"
                :show-arrow="true"
                class="ms-2 w-50"
              />
            </div>
            <button
              v-if="tableType=='doctor' || tableType=='health'"
              class="btn__main btn__main--light me-1 me-sm-2 btn--ergonomic"
              @click="downloadForm('doctor')"
            >
              下載空白醫師諮詢表
            </button>
            <button
              v-if="tableType=='ergonomic'"
              class="btn__main btn__main--light me-1 me-sm-2 btn--ergonomic"
              @click="downloadForm('ergonomic')"
            >
              下載人因工程檢核表
            </button>
            <button
              v-if="tableType=='mother' || tableType=='ergonomic'"
              class="btn__main btn__main--light me-1 me-sm-2"
              @click="openHistoryModal"
            >
              查看歷年歷程
            </button>
            <button
              v-if="tableType=='mother'||tableType=='overload'"
              class="btn__main btn__main--light"
              @click="addpersonal"
            >
              新增個人歷程
            </button>
          </div>
        </div>
        <div v-if="tableType ==='ergonomic'">
          <!-- 人因表格 -->
          <div v-if="Object.keys(gridData.data).length > 0">
            <div
              v-for="(item, index) in Object.values(gridData.data)"
              :key="`ergonomic_${index}`"
            >
              <a-table
                class="table-mother"
                :row-key="gridData.rowKey"
                :data-source="item"
                :columns="gridData.columns[`table_${index}`]"
                :pagination="gridData.pagination"
                :scroll="{ x: true }"
              >
                <!-- 表單項目/編號 -->
                <template
                  slot="formNo"
                  slot-scope="text, slotProps"
                >
                  <div
                    :class="{'text--green':slotProps.formName !== '醫師諮詢表'}"
                    @click="openErgonomicFormPreviwModal(slotProps)"
                  >
                    {{ slotProps.formNo }}
                  </div>
                </template>
                <!-- 按鈕 功能列 -->
                <template
                  slot="handleTemp"
                  slot-scope="text, slotProps"
                >
                  <div class="table__btnWrap">
                    <!-- mail -->
                    <button
                      v-if="slotProps.formTypeDesc === '自我評估'"
                      class="icon__btn"
                      :class="{'btn--disable':form[tableType][index].oriCloseStatus}"
                      :disabled="form[tableType][index].oriCloseStatus"
                      @click="mailBtn(slotProps.caseId, null)"
                    >
                      <img
                        v-if="slotProps.formNo"
                        src="@/assets/images/button_mail_green.svg"
                      >
                      <img
                        v-else
                        src="@/assets/images/button_mail_gray.svg"
                      >
                    </button>
                    <!-- edit -->
                    <button
                      v-if="slotProps.formName == '簡易人因工程檢核表'"
                      class="icon__btn"
                      :disabled="form[tableType][index].oriCloseStatus"
                      :class="{'btn--disable':form[tableType][index].oriCloseStatus}"
                      @click="editBtn(slotProps)"
                    >
                      <a-icon type="edit" />
                    </button>
                    <!-- add -->
                    <!-- <button
                    v-if="slotProps.formName == '簡易人因工程檢核表'"
                    class="icon__btn"
                    @click="addBtn(slotProps.formName, slotProps.formNo)"
                  >
                    <a-icon type="plus" />
                  </button> -->
                    <!-- upload -->
                    <a-upload
                      v-if="slotProps.formName == '醫師諮詢表'"
                      name="file"
                      accept=".pdf, .docx, .doc, .xls, .xlsx"
                      :file-list="uploadedErgonomicFileList"
                      :custom-request="uploadFlie"
                      :before-upload="beforeUpload"
                      :show-upload-list="false"
                      :disabled="form[tableType][index].oriCloseStatus || slotProps.uploadable!=='Y'"
                      @change="handleChange"
                    >
                      <button
                        class="icon__btn"
                        :class="{'btn--disable':form[tableType][index].oriCloseStatus || slotProps.uploadable!=='Y'}"
                        :disabled="form[tableType][index].oriCloseStatus || slotProps.uploadable!=='Y'"
                        @click="uploadBtn(slotProps, form[tableType][index])"
                      >
                        <a-icon type="upload" />
                      </button>
                    </a-upload>
                    <!-- download -->
                    <button
                      class="icon__btn"
                      :class="{'btn--disable':!slotProps.formNo || slotProps.downloadable!=='Y'}"
                      :disabled="!slotProps.formNo || slotProps.downloadable!=='Y'"
                      @click="downloadBtn(slotProps.caseId, null, null, null, slotProps)"
                    >
                      <a-icon type="download" />
                    </button>
                  </div>
                </template>
                <!-- 結案狀態/原因 -->
                <template
                  slot="formCategory"
                  slot-scope="text, slotProps"
                >
                  <template v-if="slotProps.rowkey == item.length">
                    <div class="pb-2">
                      結案狀態/原因
                    </div>
                    <a-switch
                      :checked-children="form[tableType][index].oriCloseStatus?'已結案':'結案'"
                      un-checked-children="未結"
                      :checked="form[tableType][index].isClose"
                      :disabled="form[tableType][index].oriCloseStatus"
                      @click="switchBtn(index)"
                    />
                  </template>
                  <template v-else-if="slotProps.rowkey == (item.length-1)">
                    <div class="pb-2">
                      備註
                    </div>
                  </template>
                  <template v-else>
                    {{ slotProps.formCategory }}
                  </template>
                </template>
                <!-- 異常歷程 -->
                <template
                  slot="formName"
                  slot-scope="text, slotProps"
                >
                  <template v-if="slotProps.rowkey == item.length">
                    <a-textarea
                      v-model="form[tableType][index].closedDesc"
                      :auto-size="{ minRows: 3 }"
                      :disabled="form[tableType][index].oriCloseStatus"
                      placeholder="e.g. 已完成醫師諮詢。"
                      class="mt-1"
                    />
                  </template>
                  <template v-else-if="slotProps.rowkey == (item.length-1)">
                    <a-textarea
                      v-model="form[tableType][index].remark"
                      :auto-size="{ minRows: 3 }"
                      :disabled="form[tableType][index].oriCloseStatus"
                      placeholder=""
                      class="mt-1"
                    />
                  </template>
                  <template v-else>
                    {{ slotProps.formName }}
                  </template>
                </template>
              </a-table>
            </div>
          </div>
          <div
            v-else
            class="table__nodata"
          >
            <div class="border nodata__wrap">
              <div class="nodata__text">
                暫無資料
              </div>
              <img src="@/assets/images/image_nothing.svg">
            </div>
          </div>
        </div>
        <OverloadCaseGrid
          v-if="tableType==='overload'"
          ref="OverloadCaseGrid"
          :period="period"
          :uid="userInfo.uid"
          @getModifyHistoryRespData="getModifyHistoryRespData"
          @getLastestUncloseCase="overloadGetLastestUncloseCase"
        />
        <DoctorConsultCaseGrid
          v-if="tableType==='health' || tableType==='doctor'"
          ref="doctorCunsult"
          :period="period"
          :uid="userInfo.uid"
        />
        <div v-if="tableType==='mother'">
          <div
            v-if="Object.keys(gridData.data).length > 0"
            class="doctor__table"
          >
            <div
              v-for="(item, index) in Object.values(gridData.data)"
              :key="index"
            >
              <a-table
                class="table-mother"
                :row-key="gridData.rowKey"
                :data-source="item"
                :columns="gridData.columns.mother[`table_${index}`]"
                :pagination="gridData.pagination"
                :scroll="{ x: true }"
              >
                <!-- 表單項目/編號 -->
                <template
                  slot="formId"
                  slot-scope="text, slotProps"
                >
                  <div
                    :class="{'txt__formNo--click':slotProps.formTypeEnum !== 'PHY_CONSULT'}"
                    @click="openMotherFormPreviwModal(slotProps)"
                  >
                    {{ (slotProps.formNo?slotProps.formNo.substring(0,17):null) || slotProps.formId }}
                  </div>
                </template>
                <!-- 按鈕 功能列 -->
                <template
                  slot="handleTemp"
                  slot-scope="text, slotProps"
                >
                  <div class="table__btnWrap">
                    <!-- mail -->
                    <button
                      v-if="slotProps.formTypeEnum == 'MOTHER' || slotProps.formTypeEnum == 'PREGNANT'"
                      class="icon__btn"
                      :class="{'btn--disable':!slotProps.showSend || form[tableType][index].oriCloseStatus}"
                      :disabled="!slotProps.showSend || form[tableType][index].oriCloseStatus"
                      @click="mailBtn(slotProps.formCaseId, slotProps.formId, slotProps.formstatus)"
                    >
                      <img
                        v-if="slotProps.showSend"
                        src="@/assets/images/button_mail_green.svg"
                      >
                      <img
                        v-else
                        src="@/assets/images/button_mail_gray.svg"
                      >
                    </button>
                    <!-- edit -->
                    <button
                      v-if="(slotProps.formTypeEnum == 'INTERVIEW' || slotProps.formTypeEnum == 'WORK_ARRANGEMENT' || slotProps.formTypeEnum == 'WORK_PLACE')"
                      class="icon__btn"
                      :class="{'btn--disable':!slotProps.showEdited || form[tableType][index].oriCloseStatus}"
                      :disabled="!slotProps.showEdited || form[tableType][index].oriCloseStatus"
                      @click="editBtn(slotProps)"
                    >
                      <a-icon type="edit" />
                    </button>
                    <!-- add -->
                    <button
                      v-if="(slotProps.formTypeEnum == 'INTERVIEW' || slotProps.formTypeEnum == 'WORK_ARRANGEMENT' || slotProps.formTypeEnum == 'WORK_PLACE')"
                      class="icon__btn"
                      :disabled="!slotProps.showAdd || form[tableType][index].oriCloseStatus"
                      :class="{'btn--disable':!slotProps.showAdd || form[tableType][index].oriCloseStatus}"
                      @click="addBtn(slotProps.formTypeEnum, slotProps.formCaseId)"
                    >
                      <a-icon type="plus" />
                    </button>
                    <!-- upload -->
                    <a-upload
                      v-if="slotProps.formTypeEnum == 'PHY_CONSULT'"
                      name="file"
                      accept=".pdf, .docx, .doc, .xls, .xlsx"
                      :disabled="form[tableType][index].oriCloseStatus||!slotProps.showUpload"
                      :file-list="motherFileList"
                      :custom-request="uploadFlie"
                      :before-upload="beforeUpload"
                      :show-upload-list="false"
                      @change="handleChange"
                    >
                      <button
                        class="icon__btn"
                        :class="{'btn--disable':form[tableType][index].oriCloseStatus||!slotProps.showUpload}"
                        :disabled="form[tableType][index].oriCloseStatus||!slotProps.showUpload"
                        @click="uploadBtn(slotProps, form[tableType][index], slotProps.formId, slotProps.reserveInfoId, slotProps.formTypeEnum)"
                      >
                        <a-icon type="upload" />
                      </button>
                    </a-upload>
                    <!-- download -->
                    <button
                      class="icon__btn"
                      :class="{'btn--disable':!slotProps.showDownload}"
                      :disabled="!slotProps.showDownload"
                      @click="downloadBtn(slotProps.formCaseId, slotProps.formId, slotProps.reserveInfoId, slotProps.formTypeEnum)"
                    >
                      <a-icon type="download" />
                    </button>
                  </div>
                </template>
                <!-- 結案狀態/原因 -->
                <template
                  slot="formCategory"
                  slot-scope="text, slotProps"
                >
                  <template v-if="slotProps.rowkey == item.length">
                    <div class="pb-2">
                      結案狀態/原因
                    </div>
                    <a-switch
                      checked-children="結案"
                      un-checked-children="未結"
                      :checked="form[tableType][index].closeFlag"
                      :disabled="form[tableType][index].oriCloseStatus"
                      @click="switchBtn(index)"
                    />
                  </template>
                  <template v-else>
                    {{ slotProps.formCategory }}
                  </template>
                </template>
                <!-- 異常歷程 -->
                <template
                  slot="formBaseName"
                  slot-scope="text, slotProps"
                >
                  <template v-if="slotProps.rowkey == item.length">
                    <a-textarea
                      v-model="form[tableType][index].closeText"
                      :auto-size="{ minRows: 3 }"
                      :disabled="form[tableType][index].oriCloseStatus"
                      placeholder="e.g. 已完成醫師諮詢。"
                      class="mt-1"
                    />
                  </template>
                  <template v-else>
                    {{ slotProps.formBaseName }}
                  </template>
                </template>
              </a-table>
            </div>
          </div>
          <div
            v-else
            class="table__nodata"
          >
            <div class="border nodata__wrap">
              <div class="nodata__text">
                暫無資料
              </div>
              <img src="@/assets/images/image_nothing.svg">
            </div>
          </div>
        </div>

        <div class="under btn__wrap text-center">
          <router-link :to="'/occupationSafety/Other/caseMaintain/index'">
            <button class="btn__radius--primary--outline">
              返回查詢主頁
            </button>
          </router-link>
          <button
            class="btn__radius--primary--outline"
            :disabled="!lastestUncloseCase && tableType!=='doctor' && tableType!=='health'"
            @click="goDoc"
          >
            去預約醫師諮詢
          </button>
          <button
            class="btn__radius--primary"
            @click="onSave"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
    <HistoryModal
      :visible="historyModalVisible"
      :tab-type="tableType"
      :title="title"
      :history-data="historyData"
      @closeModal="historyModalVisible=false"
    />
    <ViewNurseRecordModal
      :uid="userInfo.uid"
      :visible="ViewModalVisible"
      @closeViewModal="ViewModalVisible=false"
    />
    <EmailModal
      :visible="EmailModalVisible"
      :mail-drop-list="mailSend.mailDropList"
      :user-data="mailSend.sendUser"
      :send-case-id="mailSend.sendCaseId"
      :send-form-id="mailSend.sendFormId"
      :send-form-status="mailSend.sendFormStatus"
      @closeModal="EmailModalVisible=false"
    />
    <CaseMotherFormPreviewMoadl
      :form-title="caseMotherModal.formTitle"
      :visible="caseMotherModal.formModalVisible"
      :form-input="caseMotherModal.formInput"
      @closeFormModal="closeMotherFormPreviwModal"
    />
    <!-- 人因預覽表單 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
    <QaModal
      :visible="caseErgonomicModal.qaModalVisible"
      :record-id="caseErgonomicModal.recordId"
      @closeQaModal="closeErgonomicFormPreviwModal"
    />
    <MuscleModal
      :visible="caseErgonomicModal.muscleModalVisible"
      :record-id="caseErgonomicModal.recordId"
      @closeMuscleModal="closeErgonomicFormPreviwModal"
    />
    <DescModal
      :visible="caseErgonomicModal.descModalVisible"
      :record-id="caseErgonomicModal.recordId"
      @closeDescModal="closeErgonomicFormPreviwModal"
    />
    <ErgonomicHazardFormModal
      :visible="caseErgonomicModal.ergonomicHazardFormModalVisible"
      :case-id="caseErgonomicModal.caseId"
      :record-id="caseErgonomicModal.recordId"
      :level="caseErgonomicModal.level"
      @closeHazardFormModal="closeErgonomicFormPreviwModal"
    />
    <!-- 人因預覽表單 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import HistoryModal from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/HistoryModal.vue';
import ViewNurseRecordModal from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/ViewNurseRecordModal.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import QaModal from '@/pages/OccupationalSafety/ErgonomicHazard/ErMyRecord/qaModal.vue';
import MuscleModal from '@/pages/OccupationalSafety/ErgonomicHazard/ErMyRecord/muscleModal.vue';
import DescModal from '@/pages/OccupationalSafety/ErgonomicHazard/ErMyRecord/descModal.vue';
import ErgonomicHazardFormModal from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/ErgonomicHazardFormModal.vue';
import EmailModal from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/EmailNotificationModal.vue';
import {
	UserIdDto,
	MonPlanCaseCloseInfoDto,
	AddFromWithType,
	AddFromWithTypeFormTypeEnumEnum,
	MonPlanCaseIdAndFormIdDto,
	FormIdDto,
	FileIdAndFormIdDto,
	AccountInfoOutDto,
	CiIdDto,
	MonPlanFormDtoFormTypeEnumEnum,
	CaseMaintainEmailDropListInputDto,
	CaseMaintainResultInputDto,
	RpnRecordSaveDto,
	HumanHazardInformationQuerryInputDto,
	HfeFormRecordDownloadDto,
	HfeCaseCloseDto, PhyCaseUploadDtoIsClosedEnum,
	CaseMaintainResultInputInfoDto,
	RpnCareRecordSaveDto,
	HfeCaseCloseListDto,
} from '@fubonlife/oss-api-axios-sdk';
import infoModal from '@/plugins/notification/infoModal';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import notification from '@/plugins/notification/infoNotification';
import moment from 'moment';
import DoctorConsultCaseGrid from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/DoctorConsultCaseGrid.vue';
import OverloadCaseGrid from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/Overload/OverloadCaseGrid.vue';
import CaseMotherFormPreviewMoadl from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/CaseMotherFormPreviewModal.vue';
import { config } from 'rxjs';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';

@Component({
	components: {
		HistoryModal, ViewNurseRecordModal, FblDataGrid, EmailModal, CaseMotherFormPreviewMoadl, OverloadCaseGrid, QaModal, MuscleModal, DescModal, ErgonomicHazardFormModal, DoctorConsultCaseGrid,
	},
})
export default class CaseMaintainList extends Vue {
  @Action('setLoading') setLoading;

  title = '母性健康保護';

	// 查詢的員工資料
	userInfo: AccountInfoOutDto = {};

	// 讀到的結案狀態
	oriStatus = [];

	h = this.$createElement;

	// 查看歷年歷程Modal
  historyModalVisible = false;

  // 查看護理紀錄Modal
  ViewModalVisible = false;

	EmailModalVisible = false;

	// 查看歷年歷程資料
	historyData = []

	yearOpts = [];

	period = null;

	uid: number = null;

	tableType = '';

	// disabledBtnGoDoc = false // 控制是否能跳轉到醫生諮詢

	tableTypeOption = [
		{ label: '醫師諮詢服務', value: 'doctor' },
		// { label: '健康快e通', value: 'health' },
		// { label: '異常負荷預防', value: 'overload' },
		// { label: '人因危害預防', value: 'ergonomic' },
		// { label: '母性健康保護', value: 'mother' },
	]

	passSaveRpnRecord = null;

  // 個人基本資料
  infoData = null

  // 個人基本資料 表格
  infoTable = {
  	column1: [
  		{ label: '員工姓名', value: 'name' },
  		{ label: '性別', value: 'sex' },
  		{ label: '出生日期', value: 'birth' },
  		{ label: '身分證字號', value: 'id' },
  		{ label: '部門/單位', value: 'dep' },
  		{ label: '受雇日期(投保日期)', value: 'apply' },
  		{ label: '工作地點', value: 'place' },
  	],
  	column2: [
  		{ label: '檢查日期(最近一次)', value: 'check' },
  		// { label: '異常工作負荷預防風險等級', value: 'overload' },
  		// { label: '母性健康保護階段', value: 'mother' },
  		// { label: '肌肉骨骼問券分析', value: 'muscle' },
  		// { label: '提供衛教時間(最近一次)', value: 'health' },
  		// { label: '發送醫師諮詢時間(最近一次)', value: 'send' },
  		{ label: '已預約醫師諮詢時間(最近一次)', value: 'reserve' },
  		{ label: '完成醫師諮詢時間(最近一次)', value: 'end' },
  	],
  }

  // 護理紀錄類別 選項
  recordTypeOption = null;

  // 護理紀錄類別 checkbox
  recordType = []

  // 護理紀錄類別 textarea
  recordForm = []

	// 母性健康caseId
	monPlanCaseId = null

	formIdentityRowSpan = {}

	formCategoryRowSpan = {}

	formBaseNameRowSpan = {}

  form = {
  	mother: [], // 母性健康保護
  	ergonomic: [], // 人因危害預防
  }

	gridData = {
		rowKey: 'rowkey',
  	data: [],
  	pagination: false,
		columns: {
			mother: {},
		},
	}

	motherOriginData = null;

	saveCaseRespData = null;

	ergonomicOriginData = null;

	// 母性健康預覽彈窗
	caseMotherModal = {
		formTitle: null,
		formModalVisible: false,
		formInput: null,
	}

	lastestUncloseCase = null; // 最新未結案caseId

	// API: 發送通知
	onNotify({ formType, infoId }) {
		infoModal.alertSuccess({
			title: '是否發送Email表單填寫通知',
			confirm: true,
			content: '即將執行發送Email表單填寫通知給該位同仁，請問您確定要發送嗎？',
			customContent: null,
			onCallback: () => {
				const API_KEYS = {
					getSendFormNotificationUsingPOST: 'E0401', // 發送表單填寫通知
					getSendTenYearMentalBurdenScaleNotificationUsingPOST: 'E0402', // 發送十年心力負荷量表通知
				};

				for (const [key, value] of Object.entries(API_KEYS)) {
					if (value === formType) {
						this.setLoading(true);
						this.$AlRpnAlRpnWorkOvertimeListControllerApi[key]([infoId])
							.then((resp) => {
								// TEST:
								// console.log(resp);
								this.$global.changeRouterAndaddParam({
									toRouter: 'CaseMaintainResult',
									params: {
										type: 'email',
									},
									query: {
										result: resp.data.status === 200 ? 'success' : 'fail',
										errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
									},
								});
							})
							.catch((error) => {
								console.log('error status = ', error);
							})
							.finally(() => {
								this.setLoading(false);
							});
					}
				}
			},
		});
	}

	openHistoryModal() {
  	// this.historyData = [];
  	console.log('查看歷年歷程');
  	// API: 查看歷年歷程 API
  	if (this.tableType == 'mother') {
			// this.historyData = this.fakeMotherHistoryData;
			const userData: UserIdDto = {
				userId: this.userInfo.uid,
			};
			this.setLoading(true);
			this.$MONPLANRpnMaintainApi.recordWithYearHisReportNUsingPOST(userData)
				.then((resp) => {
					console.log('historyModal', resp.data.data);
					this.historyData = resp.data.data;
					// this.historyData = this.fakeMotherHistoryData;
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally(() => {
					this.setLoading(false);
				});
  	} else {
			this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanHazardYearInformationQuerryUsingPOST({ uid: this.userInfo.uid })
				.then((resp) => {
					console.log('historyModal', resp.data.data);
					this.historyData = resp.data.data;
					// this.historyData = this.fakeMotherHistoryData;
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally(() => {
					this.setLoading(false);
				});
  	}
  	this.historyModalVisible = true;
	}

	// 母性上傳檔案列表
	motherFileList = [];

	// 人因上傳檔案列表
	uploadedErgonomicFileList = [];

	doctorId = null;

	nowUploadInfo = { // 母性
		isClosed: null,
		remark: null,
		reserveInfoId: null,
		formId: null,
		srcFrom: 'D0102',
	}

	uploadErgonomicCaseId = null;

	// 	上傳
	uploadBtn(data, formCloseInfo) {
		// this.doctorId = formId;
		console.log(data, formCloseInfo);
		if (this.tableType === 'mother') {
			this.nowUploadInfo = {
				formId: data.formId,
				isClosed: formCloseInfo.closeFlag,
				remark: formCloseInfo.closeText,
				reserveInfoId: data.reserveInfoId,
				srcFrom: 'D0102',
			};
		} else if (this.tableType === 'ergonomic') {
			this.uploadErgonomicCaseId = data.caseId;
		}
	}

	uploadFlie(options) {
		console.log(options);
		// console.log('formId', this.doctorId);
  	if (this.beforeUpload) {
			if (this.tableType === 'mother') {
				this.uploadMotherFile(options.file);
			} else if (this.tableType === 'ergonomic') {
				this.uploadErgonomicFile(options.file);
			}
		}
	}

	uploadMotherFile(motherFile) {
		this.setLoading(true);
		this.$CaseMaintainUtilityApi.uploadFileAboutCaseMaintainUsingPOST(motherFile)
			.then((resp) => {
				if (resp.data.status === 200) {
					this.uploadSave(this.nowUploadInfo, resp.data.data);
				} else {
					notification.error({ content: '上傳失敗' });
				}
			})
			.catch((error) => {
				console.log('error status = ', error);
				notification.error({ content: '上傳失敗' });
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// api/case-maintain/utility/info 儲存結果
	uploadSave(formData, fileId) {
		const data = [{
			isClosed: 'Y', // 固定
			remark: formData.remark, // 有沒有打字都不影響
			reserveInfoId: formData.reserveInfoId,
			srcFrom: formData.srcFrom,
			uid: this.userInfo.uid,
			uploadFileId: fileId,
		}];
		this.$CaseMaintainUtilityApi.saveUsingPOST({ caseMaintainResultInputInfoDtoList: data })
			.then((resp) => {
				console.log(resp);
				if (resp.data.status === 200) {
					notification.success({ content: '上傳成功' });
					setTimeout(() => {
						location.reload();
					}, 500);
				} else {
					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
			})
			.catch((error) => {
				console.log('error status = ', error);
				notification.error({ content: '上傳失敗' });
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 上傳檔案檢核
	beforeUpload(file, fileList) {
  	this.resetFile();
		let fileLists;
		switch (this.tableType) {
		case 'mother':
			fileLists = this.motherFileList;
			break;

		case 'ergonomic':
			fileLists = this.uploadedErgonomicFileList;
			break;

		default:
			break;
		}
		const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		fileLists,
  		'.pdf,.docx,.doc,.xls,.xlsx',
  		3,
  		1,
  	);
  	if (vaildResult.vaild == false) {
  		infoModal.alertError({ content: '限上傳 pdf、doc、docx、xls、xlsx 格式' });
  		return false;
  	}
  	return vaildResult.vaild;
	}

	resetFile() {
  	this.motherFileList = [];
		this.uploadedErgonomicFileList = [];
	}

	// 上傳醫師諮詢附件-人因性問卷答案填寫記錄檔
	uploadErgonomicFile(file) {
		this.$customUpload.fetchAPI(
  		UploadAPIUrl.ERGONOMICUPLOADDOC,
  		'caseIdDto',
  		{
				caseId: this.uploadErgonomicCaseId,
				isClosed: PhyCaseUploadDtoIsClosedEnum.Y,
				reMark: '',
				srcForm: 'D0104',
			},
  		'file',
  		[file],
  		(resp) => {
  			notification.success({ content: '上傳成功' });
  		},
  		(msg) => {
  			notification.error({ content: this.$global.getApiErrorMsg(msg).join('') });
  		},
  		() => {
  			this.setLoading(false);
  		},
  	);
		// this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanFactorCasePhyConsultFileUploadUsingPOST(file)
		// 	.then((resp) => {
		// 		// this.uploadSave(this.nowUploadInfo, resp.data.data);
		// 		this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanFactorCaseSavePhyConsultFileUploadRecordUsingPOST(
		// 			{
		// 				caseId: this.uploadErgonomicCaseId,
		// 				fileName: resp.data.data.fileName,
		// 				filePath: resp.data.data.filePath,
		// 				isClosed: PhyCaseUploadDtoIsClosedEnum.Y,
		// 				reMark: '',
		// 				srcForm: 'D0104',
		// 			},
		// 		)
		// 			.then((resp) => {
		// 				if (resp.data.status === 200) {
		// 					notification.success({ content: '上傳成功' });
		// 				} else {
		// 					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
		// 				}
		// 			})
		// 			.catch((error) => {
		// 				console.log('error status = ', error);
		// 				notification.error({ content: '上傳失敗' });
		// 			})
		// 			.finally(() => {
		// 				this.setLoading(false);
		// 			});
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status = ', error);
		// 		notification.error({ content: '上傳失敗' });
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	async handleChange(e) {
		let fileLists;
		switch (this.tableType) {
		case 'mother':
			fileLists = this.motherFileList;
			break;

		case 'ergonomic':
			fileLists = this.uploadedErgonomicFileList;
			break;

		default:
			break;
		}
  	fileLists = fileLists.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		fileLists = e.fileList.slice(-1);
  		fileLists.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			return val;
  		});
  	}
  	if (e.file.status == 'removed') {
  		fileLists = fileLists.filter(
  			(val) => val.uid !== e.file.uid,
  		);
  	}
  	console.log(fileLists);
	}

	userId = null;

	// API: 母性健康-根據UserId查詢個案
	async getMotherData() {
		this.setLoading(true);
		const data: UserIdDto = {
			userId: this.userInfo.uid,
			// userId: 1, // 測試用
		};
		// 根據UserId查詢個案
		await this.$MONPLANRpnMaintainApi.findByUserIdUsingPOST(data)
			.then((resp) => {
				console.log('mother', resp.data.data);
				this.motherOriginData = resp.data.data;
				// this.form.mother = this.motherOriginData;
				const getData = resp.data.data as any;
				getData.forEach((respItem, respIdx) => {
					let identity = null;
					if (respItem.pregnantCategoryEnum === 'MOTHER') {
						identity = '產後一年';
					} else if (respItem.pregnantCategoryEnum === 'PREGNANT') {
						identity = '妊娠中';
					}
					// const status = respItem.selForm.status;
					const date = respItem.selForm.date;
					const caseId = respItem.monPlanCaseId;
					const closeText = respItem.closeText;
					const closeFlag = respItem.closeFlag;
					const selfList = respItem.selForm.selfForm.map(({
						formBaseName, formId, sendInfoRecordId, formStatus, ...other
					}, index) => ({
						rowkey: index + 1,
						formBaseName,
						formId,
						sendInfoRecordId,
						formstatus: formStatus,
						formdate: date,
						formIdentity: identity,
						formCategory: '自我評估',
						formCaseId: caseId,
						...other,
					}));
					// const consultStatus = respItem.counselingForm.status;
					const consultDate = respItem.counselingForm.date;
					const consultList = respItem.counselingForm.counselingForm.map(({
						formBaseName, formId, sendInfoRecordId, formStatus, ...other
					}, conIdx) => ({
						rowkey: respItem.selForm.selfForm.length + conIdx + 1,
						formBaseName,
						formId,
						sendInfoRecordId,
						formstatus: formStatus,
						formdate: consultDate,
						formIdentity: identity,
						formCategory: '醫師諮詢',
						formCaseId: caseId,
						...other,
					}));
					const conbineList = selfList.concat(consultList);
					this.gridData.data = {
						...this.gridData.data,
						[`table_${respIdx}`]: [...conbineList,
							{
								rowkey: conbineList.length + 1,
								formIdentity: identity,
								formCategory: respItem.closeFlag,
								formBaseName: respItem.closeText,
								// formBaseName: '2222',
							}],
					};
					this.form.mother.push({
  					caseId,
  					closeText,
						closeFlag,
						oriCloseStatus: closeFlag,
  				});
				});
				console.log('test', this.gridData.data);
				console.log('mother', this.form.mother);
			})
			.catch((error) => {
				console.log('error status = ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 母性健康-處理表格合併欄位
	async fetchMotherData() {
		await this.getMotherData();
		Object.values(this.gridData.data).forEach((item) => {
			if (item) {
				for (const [key, value] of Object.entries(this.gridData.data)) {
  				const maxIndex = value.length - 1;
					this.$set(this.formIdentityRowSpan, key, this.getRowSpan('formIdentity', value));
					this.$set(this.formCategoryRowSpan, key, this.getRowSpan('formCategory', value));
					this.$set(this.formBaseNameRowSpan, key, this.getRowSpan('formBaseName', value));
					this.gridData.columns.mother = {
						...this.gridData.columns.mother,
						[key]: [
							{
								title: '身份別',
								dataIndex: 'formIdentity',
								key: 'formIdentity',
								width: 50,
								customRender: (data, record, index) => ({
									children: data,
									style: {
										textAlign: 'center',
									},
									attrs: {
										rowSpan: this.formIdentityRowSpan[key][index],
									} as any,
								}),
							},
							{
								title: '表單類別',
								dataIndex: 'formCategory',
								key: 'formCategory',
								width: 100,
								customCell: (record, index) => {
									const obj = {
										style: {} as any,
										attrs: {} as any,
									};
									if (index == maxIndex - 1) {
										obj.attrs.colSpan = value - 1;
									}
									if (this.formCategoryRowSpan[key][index] === 0) {
										obj.style.display = 'none';
									} else {
										obj.attrs.rowSpan = this.formCategoryRowSpan[key][index];
									}

									return obj;
								},
								scopedSlots: { customRender: 'formCategory' },
							},
							{
								title: '表單名稱',
								dataIndex: 'formBaseName',
								key: 'formBaseName',
								width: 180,
								customCell: (record, index) => {
									const obj = {
										style: {} as any,
										attrs: {} as any,
									};
									if (index == maxIndex) {
										obj.attrs.colSpan = maxIndex + 1;
										obj.style.borderRight = '1px solid #e8e8e8';
									}

									if (this.formBaseNameRowSpan[key][index] === 0) {
										obj.style.display = 'none';
									} else {
										obj.attrs.rowSpan = this.formBaseNameRowSpan[key][index];
									}
									return obj;
								},
								scopedSlots: { customRender: 'formBaseName' },
							},
							{
								title: '表單項目/編號',
								dataIndex: 'formId',
								key: 'formId',
								width: 150,
								customCell: (record, index) => {
									const obj = {
										style: {
											borderRight: 'none',
										} as any,
										attrs: {} as any,
									};
									if (index > maxIndex - 1) {
										obj.style.display = 'none';
									}
									return obj;
								},
								scopedSlots: { customRender: 'formId' },
							},
							{
								title: '',
								dataIndex: 'action',
								key: 'action',
								width: 150,
								customCell: (record, index) => {
									const obj = {
										style: {} as any,
										attrs: {} as any,
									};
									if (record.formCategory === '自我評估') {
										obj.style = {
											borderRight: 'none',
										};
									}
									if (index > maxIndex - 1) {
										obj.style.display = 'none';
									}
									return obj;
								},
								scopedSlots: { customRender: 'handleTemp' },
							},
							{
								title: '執行狀態',
								dataIndex: 'statusDesc',
								key: 'statusDesc',
								width: 90,
								customRender: (data, record, index) => {
									const obj = {
										children: data,
										attrs: {} as any,
									};
									if (index > maxIndex - 1) {
										obj.attrs.colSpan = 0;
									}
									return obj as any;
								},
							},
							{
								title: '執行時間',
								dataIndex: 'executeDate',
								key: 'executeDate',
								width: 90,
								customRender: (data, record, index) => {
									const obj = {
										children: data ? moment(data).format('YYYY/MM/DD') : '-',
										attrs: {} as any,
									};
									if (index > maxIndex - 1) {
										obj.attrs.colSpan = 0;
									}
									return obj as any;
								},
							},
						],
					};
				}
			}
		});
	}

	// API: 人因危害
	async getErgonomicData() {
		this.setLoading(true);
		const query = this.$global.getQuery();
		const data: HumanHazardInformationQuerryInputDto = {
			period: query.data.period || new Date().getFullYear().toString(),
			uid: this.userInfo.uid,
			// uid: 3, // TEST
		};
		await this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanHazardInformationQuerryUsingPOST(data)
			.then((resp) => {
				if (resp.data.status === 200) {
					let rowkey = 1;
  				const getData = resp.data.data;
					this.ergonomicOriginData = resp.data.data;
  				getData.forEach(({
  					caseId, levelDesc, hfePersonalHistoryQueryList, hfePhysicianConsultationQueryList, remark, isClosed, closedDesc,
  				}, respIdx) => {
  					if (hfePersonalHistoryQueryList || hfePhysicianConsultationQueryList) {
  						const mappingList = hfePersonalHistoryQueryList.map(({
								formTypeDesc, formNameDes, recordId, ...other
							}, index) => ({
  							rowkey: rowkey++,
  							levelDesc,
  							formTypeDesc,
								formName: formNameDes,
								formCategory: '自我評估',
								caseId,
								recordId,
  							...other,
  						}));
  						const mappingDocList = hfePhysicianConsultationQueryList.map(({
  							formTypeDesc, formNameDes, recordId, ...other
  						}) => ({
  							rowkey: rowkey++,
  							levelDesc,
  							formTypeDesc,
								formName: formNameDes,
								formCategory: '醫師諮詢',
								caseId,
								recordId,
  							...other,
  						}));

  						this.gridData.data = {
  							...this.gridData.data,
  							[`table_${respIdx}`]: [
  								...mappingList,
  								...mappingDocList,
  								{
  									rowkey: rowkey++,
  									levelDesc,
  									formCategory: '備註',
										formName: '1',
										remark,
  								},
  								{
  									rowkey: rowkey++,
  									levelDesc,
  									formCategory: isClosed,
										formName: closedDesc,
										isClosed,
										closedDesc,
  								},
								],
  						};
  					}
						this.form.ergonomic.push({
							caseId,
  						isClose: !!(isClosed === 'Y'),
  						closedDesc,
							remark,
							oriCloseStatus: !!(isClosed === 'Y'),
  					});
  				});
				} else {
					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
			})
			.catch((error) => {
				console.log('error status = ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	levelDescRowSpan={}

	// 處理表格合併欄位(人因危害)
	async mappingErgonmicTable() {
		await this.getErgonomicData();
		console.log(this.gridData.data);
		for (const [key, value] of Object.entries(this.gridData.data)) {
  		const maxIndex = value.length - 1;
  		this.$set(this.levelDescRowSpan, key, this.getRowSpan('levelDesc', value));
  		this.$set(this.formCategoryRowSpan, key, this.getRowSpan('formCategory', value));
  		this.$set(this.formBaseNameRowSpan, key, this.getRowSpan('formName', value));
  		this.gridData.columns = {
  			...this.gridData.columns,
  			[key]: [
  				{
  					title: '級別',
  					dataIndex: 'levelDesc',
  					key: 'levelDesc',
  					width: 50,
  					customRender: (data, record, index) => ({
  						children: data,
  						style: {
  							textAlign: 'center',
  						},
  						attrs: {
  							rowSpan: this.levelDescRowSpan[key][index],
  						} as any,
  					}),
  				},
  				{
  					title: '表單類別',
  					dataIndex: 'formCategory',
  					key: 'formCategory',
  					width: 100,
  					customCell: (record, index) => {
  						const obj = {
  							style: {} as any,
  							attrs: {} as any,
  						};
  						// if (index == maxIndex - 1) {
  						// 	obj.attrs.colSpan = maxIndex;
  						// }
  						if (this.formCategoryRowSpan[key][index] === 0) {
  							obj.style.display = 'none';
  						} else {
  							obj.attrs.rowSpan = this.formCategoryRowSpan[key][index];
  						}

  						return obj;
  					},
  					scopedSlots: { customRender: 'formCategory' },
  				},
  				{
  					title: '表單名稱',
  					dataIndex: 'formName',
  					key: 'formName',
  					width: 180,
  					customCell: (record, index) => {
  						const obj = {
  							style: {} as any,
  							attrs: {} as any,
  						};
  						if (index == maxIndex || index == (maxIndex - 1)) {
  							obj.attrs.colSpan = maxIndex + 1;
  							obj.style.borderRight = '1px solid #e8e8e8';
  						}

  						if (this.formBaseNameRowSpan[key][index] === 0) {
  							obj.style.display = 'none';
  						} else {
  							obj.attrs.rowSpan = this.formBaseNameRowSpan[key][index];
  						}
  						return obj;
  					},
  					scopedSlots: { customRender: 'formName' },
  				},
  				{
  					title: '表單項目/編號',
  					dataIndex: 'formNo',
  					key: 'formNo',
  					width: 150,
  					customCell: (record, index) => {
  						const obj = {
  							style: {
  								borderRight: 'none',
  							} as any,
  							attrs: {} as any,
  						};
  						if (index > maxIndex - 2) {
  							obj.style.display = 'none';
  						}
  						return obj;
  					},
  					scopedSlots: { customRender: 'formNo' },
  				},
  				{
  					title: '',
  					dataIndex: 'action',
  					key: 'action',
  					width: 150,
  					customCell: (record, index) => {
  						const obj = {
  							style: {} as any,
  							attrs: {} as any,
  						};
  						if (index > maxIndex - 2) {
  							obj.style.display = 'none';
  						}
  						return obj;
  					},
  					scopedSlots: { customRender: 'handleTemp' },
  				},
  				{
  					title: '執行狀態',
  					dataIndex: 'execStatus',
  					key: 'execStatus',
  					width: 90,
  					customRender: (data, record, index) => {
  						const obj = {
  							children: data,
  							attrs: {} as any,
  						};
  						if (index > maxIndex - 2) {
  							obj.attrs.colSpan = 0;
  						}
  						return obj as any;
  					},
  				},
					{
						title: '執行時間',
						dataIndex: 'execDt',
						key: 'execDt',
						width: 90,
						customRender: (data, record, index) => {
							const obj = {
								children: data !== 'null' ? moment(data).format('YYYY/MM/DD') : '-',
								attrs: {} as any,
							};
							if (index > maxIndex - 2) {
								obj.attrs.colSpan = 0;
							}
							return obj as any;
						},
					},
  			],
  		};
  	}
	}

	// 新增個人歷程
	addpersonal() {
  	let path;
  	if (this.tableType === 'mother') { // 母性健康保護
			this.$global.changeRouterAndaddParam({
				toRouter: 'CaseMaintainAddPersonalResume',
				params: {
					type: 'mother',
				},
				query: {
					uid: this.userInfo.uid,
				},
			});
  	}
  	if (this.tableType === 'overload') { // 異常負荷預防
  	  this.$global.changeRouterAndaddParam({
				toRouter: 'CaseMaintainAddPersonalResume',
				params: {
					type: 'abnormal',
				},
				query: {
					uid: this.userInfo.uid,
				},
			});
  	}
	}

	// 新增
	addBtn(data, caseid) {
  	if (this.tableType === 'mother') { // 母性健康保護
			console.log(data);
			if (data === 'WORK_PLACE') {
				const motherData: AddFromWithType = {
					caseId: caseid,
					formTypeEnum: AddFromWithTypeFormTypeEnumEnum.WORKPLACE,
				};
				this.setLoading(true);
				// 根據CaseId和Type新增表格
				this.$MONPLANRpnMaintainApi.reNewByUserIdUsingPOST(motherData)
					.then((resp) => {
						console.log('123', resp.data);
						if (resp.data.status === 200) {
							notification.success({ content: '新增成功' });
							setTimeout(() => {
								location.reload();
							}, 100);
						} else {
							infoModal.alertError({
								content: '無此權限',
							});
						}
					})
					.catch((error) => {
						console.log('error status = ', error);
					})
					.finally(() => {
						this.setLoading(false);
					});
			} else if (data === 'INTERVIEW') {
				const motherData: AddFromWithType = {
					caseId: caseid,
					formTypeEnum: AddFromWithTypeFormTypeEnumEnum.INTERVIEW,
				};
				this.setLoading(true);
				// 根據CaseId和Type新增表格
				this.$MONPLANRpnMaintainApi.reNewByUserIdUsingPOST(motherData)
					.then((resp) => {
						console.log('123', resp.data);
						if (resp.data.status === 200) {
							notification.success({ content: '新增成功' });
							setTimeout(() => {
								location.reload();
							}, 100);
						} else {
							infoModal.alertError({
								content: '無此權限',
							});
						}
					})
					.catch((error) => {
						console.log('error status = ', error);
					})
					.finally(() => {
						this.setLoading(false);
					});
			} else if (data === 'WORK_ARRANGEMENT') {
				const motherData: AddFromWithType = {
					caseId: caseid,
					formTypeEnum: AddFromWithTypeFormTypeEnumEnum.WORKARRANGEMENT,
				};
				console.log(motherData);
				this.setLoading(true);
				// 根據CaseId和Type新增表格
				this.$MONPLANRpnMaintainApi.reNewByUserIdUsingPOST(motherData)
					.then((resp) => {
						console.log('123', resp.data);
						if (resp.data.status === 200) {
							notification.success({ content: '新增成功' });
							setTimeout(() => {
								location.reload();
							}, 100);
						} else {
							infoModal.alertError({
								content: '無此權限',
							});
						}
					})
					.catch((error) => {
						console.log('error status = ', error);
					})
					.finally(() => {
						this.setLoading(false);
					});
			} else if (data === 'PHY_CONSULT') {
				const motherData: AddFromWithType = {
					caseId: caseid,
					formTypeEnum: AddFromWithTypeFormTypeEnumEnum.PHYCONSULT,
				};
				this.setLoading(true);
				// 根據CaseId和Type新增表格
				this.$MONPLANRpnMaintainApi.reNewByUserIdUsingPOST(motherData)
					.then((resp) => {
						console.log('123', resp.data);
						if (resp.data.status === 200) {
							notification.success({ content: '新增成功' });
							setTimeout(() => {
								location.reload();
							}, 100);
						} else {
							infoModal.alertError({
								content: '無此權限',
							});
						}
					})
					.catch((error) => {
						console.log('error status = ', error);
					})
					.finally(() => {
						this.setLoading(false);
					});
			}
  	}
  	if (this.tableType === 'overload') { // 異常負荷預防
  		if (data === 'doc') { // 醫師面談結果及採行措施表
  			this.$router.push({ path: '/occupationSafety/Other/caseMaintain/docTalkForm/add' });
  		}
  	}
		if (this.tableType === 'ergonomic') {

		}
	}

	// 編輯
	editBtn(data) {
  	console.log(data);
		console.log(this.motherOriginData);
		// 拿取自我評估表最新ID

  	switch (this.tableType) {
  	case 'mother': // 母性健康保護
			let selfForm = null;
			this.motherOriginData.forEach((element) => {
				if (element.monPlanCaseId == data.formCaseId) {
					selfForm = element.selForm.selfForm;
					console.log(element);
				}
			});
			// const maxSelfId = selfForm && selfForm.length !== 0 ? selfForm.reduce((p, v) => (p.formId > v.formId ? p.formId : v.formId)).formId : null; // 最新id
  		console.log(selfForm);
			let maxSelfId;
			if (selfForm && selfForm.length > 1) {
				maxSelfId = selfForm.reduce((p, v) => (p.formId > v.formId ? p.formId : v.formId));
			} else if (selfForm && selfForm.length === 1) {
				maxSelfId = selfForm.reduce((p, v) => (p.formId > v.formId ? p.formId : v.formId)).formId;
			} else {
				maxSelfId = null;
			}
			if (data.formTypeEnum === 'WORK_PLACE') { // 作業環境評估表
				this.$global.changeRouterAndaddParam({
					toRouter: 'CaseMaintainWorkEnv',
					query: { formId: data.formId, caseId: data.formCaseId, formTypeEnum: MonPlanFormDtoFormTypeEnumEnum.WORKPLACE },
				});
  		} else if (data.formTypeEnum === 'INTERVIEW') { // 面談紀錄
				this.$global.changeRouterAndaddParam({
					toRouter: 'CaseMaintainTalkNote',
					query: {
						formId: data.formId, caseId: data.formCaseId, formTypeEnum: MonPlanFormDtoFormTypeEnumEnum.INTERVIEW, selfFormID: maxSelfId,
					},
				});
  		} else if (data.formTypeEnum === 'WORK_ARRANGEMENT') { // 工作適性安排建議表
				this.$global.changeRouterAndaddParam({
					toRouter: 'CaseMaintainWorkFit',
					query: {
						formId: data.formId, caseId: data.formCaseId, formTypeEnum: MonPlanFormDtoFormTypeEnumEnum.WORKARRANGEMENT, selfFormID: maxSelfId,
					},
				});
  		}
  		break;
  	case 'ergonomic':
			this.$global.changeRouterAndaddParam({
				toRouter: 'CaseMaintainErgonomicForm',
				query: {
					caseId: data.caseId,
					level: data.levelDesc,
				},
			});
  		break;
  	case 'overload':
  		if (data == 'doc') {
  			this.$router.push({ path: '/occupationSafety/Other/caseMaintain/docTalkForm/edit' });
  		}
  		break;
  	}
	}

	// 開啟母性預覽表單彈窗
	openMotherFormPreviwModal(data) {
		console.log(data);
		if (data.formTypeEnum === 'PHY_CONSULT') return;
		this.caseMotherModal.formModalVisible = true;
		this.caseMotherModal.formTitle = data.formBaseName;
		this.caseMotherModal.formInput = {
			caseId: data.formCaseId,
			formNo: data.formId,
			pregnantCategoryEnum: data.formTypeEnum,
		};
	}

	// 關閉母性預覽表單彈窗
	closeMotherFormPreviwModal() {
		this.caseMotherModal.formModalVisible = false;
		this.caseMotherModal.formTitle = '';
		this.caseMotherModal.formInput = null;
	}

	// 人因健康預覽彈窗
	caseErgonomicModal = {
		caseId: null,
		qaModalVisible: false,
		muscleModalVisible: false,
		descModalVisible: false,
		ergonomicHazardFormModalVisible: false,
		recordId: null,
		level: null,
	}

	// 開啟人因預覽表單彈窗
	openErgonomicFormPreviwModal(data) {
		console.log(data);
		switch (data.formName) {
		case '人因性危害預防計畫問卷':
			this.caseErgonomicModal.qaModalVisible = true;
			break;
		case '自覺肌肉骨骼不適症狀調查':
			this.caseErgonomicModal.muscleModalVisible = true;
			break;
		case '症狀及病史說明':
			this.caseErgonomicModal.descModalVisible = true;
			break;

		case '簡易人因工程檢核表':
			this.caseErgonomicModal.ergonomicHazardFormModalVisible = true;
			break;

		default:
			break;
		}
		this.caseErgonomicModal.recordId = data.recordId;
		this.caseErgonomicModal.caseId = data.caseId;
		this.caseErgonomicModal.level = data.levelDesc;
		console.log(this.caseErgonomicModal);
	}

	// 關閉人因預覽表單彈窗
	closeErgonomicFormPreviwModal() {
		this.caseErgonomicModal.recordId = null;
		this.caseErgonomicModal.caseId = null;
		this.caseErgonomicModal.level = null;
		this.caseErgonomicModal.qaModalVisible = false;
		this.caseErgonomicModal.muscleModalVisible = false;
		this.caseErgonomicModal.descModalVisible = false;
		this.caseErgonomicModal.ergonomicHazardFormModalVisible = false;
	}

	// 信件發送資料
	mailSend = {
		mailDropList: [],
		sendUser: null,
		sendCaseId: null,
		sendFormId: null,
		sendFormStatus: null,
	}

	// 發送
	mailBtn(caseId, formId, formStatus) {
		console.log('this.sendFormStatus => ', formStatus);
		this.mailSend.mailDropList = [];
		this.setLoading(true);
		let srcFrom;
		switch (this.tableType) {
		case 'mother':
			srcFrom = 'D0102';
			break;
		case 'ergonomic':
			srcFrom = 'D0104';
			break;

		default:
			break;
		}
		const mailData: CaseMaintainEmailDropListInputDto = {
			srcFrom,
		};
		this.$CaseMaintainUtilityApi.humanFactorCaseDropDownListQueryUsingPOST(mailData)
			.then((resp) => {
				console.log(resp.data.data);
				this.mailSend.mailDropList = resp.data.data;
				this.mailSend.sendUser = this.userInfo.uid;
				// this.sendUser = 123; // 測試用
				this.mailSend.sendCaseId = caseId;
				this.mailSend.sendFormId = formId;
				this.mailSend.sendFormStatus = formStatus;
			})
			.catch((error) => {
				console.log('error status=', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
		this.EmailModalVisible = true;
	}

	// 下載
	downloadBtn(caseid, formId, reserveInfoId, formTypeEnum, datas) {
  	console.log(caseid, formId, reserveInfoId, formTypeEnum, datas);
		const formData: FormIdDto = {
			caseId: caseid,
			formId,
		};
  	switch (this.tableType) {
  	case 'mother':
			if (formTypeEnum === 'PHY_CONSULT') {
				// 醫生諮詢表單的下載另外處理
				this.downloadByDoctorConsult(reserveInfoId);
				return;
			}
			// 根據表格Id下載表單
  		this.setLoading(true);
			this.$MONPLANRpnMaintainApi.exportFormUsingPOST1(formData, { responseType: 'blob' })
				.then((resp) => {
					const disposition = resp.headers['content-disposition'];
					if (disposition) {
						let filename = '';
						if (disposition.indexOf('attachment') !== -1) {
							const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
							const matches = filenameRegex.exec(disposition);
							if (matches != null && matches[1]) {
								filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
							}
						}
						this.$blobUtils.download(
							resp.data as Blob,
							filename,
							resp.headers['content-type'],
						);
					} else {
						this.$MONPLANRpnMaintainApi.exportFormUsingPOST1(formData)
							.then((resp) => {
								const respData = JSON.stringify(resp);
								const apiErrorMsg = JSON.parse(respData).data.apiError;
								this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
							})
							.catch((error) => {
								console.log(error);
							})
							.finally(() => {
								this.setLoading(false);
							});
					}
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally(() => {
					this.setLoading(false);
				});
  		break;
		case 'ergonomic':
			let formName;
			switch (datas.formName) {
			case '人因性危害預防計畫問卷':
				formName = 'F0201';
				break;
			case '自覺肌肉骨骼不適症狀調查':
				formName = 'F0202';
				break;
			case '症狀及病史說明':
				formName = 'F0203';
				break;
			case '醫師諮詢表':
				formName = 'F0204';
				break;
			case '簡易人因工程檢核表':
				formName = 'F0205';
				break;

			default:
				break;
			}
			const data: HfeFormRecordDownloadDto = {
				caseId: caseid,
				formName,
			};
			this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.loF02UsingPOST(data, { responseType: 'blob' })
				.then((resp) => {
					const disposition = resp.headers['content-disposition'];
					if (disposition) {
						let filename = '';
						if (disposition.indexOf('attachment') !== -1) {
							const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
							const matches = filenameRegex.exec(disposition);
							if (matches != null && matches[1]) {
								filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
							}
						}
						this.$blobUtils.download(
							resp.data as Blob,
							filename,
							resp.headers['content-type'],
						);
					} else {
						this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.loF02UsingPOST(data)
							.then((resp) => {
								const respData = JSON.stringify(resp);
								const apiErrorMsg = JSON.parse(respData).data.apiError;
								this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
							})
							.catch((error) => {
								console.log(error);
							})
							.finally(() => {
								this.setLoading(false);
							});
					}
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally(() => {
					this.setLoading(false);
				});
			break;
  	}
	}

	// [母性]根據發送紀錄代碼下載表單By醫生諮詢
	downloadByDoctorConsult(reserveInfoId) {
  	this.setLoading(true);
		this.$CaseMaintainUtilityApi.getphysicianDownLoadUsingPOST({ reserveInfoId }, { responseType: 'blob' })
			.then((resp) => {
				const disposition = resp.headers['content-disposition'];
				if (disposition) {
					let filename = '';
					if (disposition.indexOf('attachment') !== -1) {
						const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
						const matches = filenameRegex.exec(disposition);
						if (matches != null && matches[1]) {
							filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
						}
					}
					this.$blobUtils.download(
							resp.data as Blob,
							filename,
							resp.headers['content-type'],
					);
				} else {
					this.$CaseMaintainUtilityApi.getphysicianDownLoadUsingPOST({ reserveInfoId })
						.then((resp) => {
							const respData = JSON.stringify(resp);
							const apiErrorMsg = JSON.parse(respData).data.apiError;
							this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
						})
						.catch((error) => {
							console.log(error);
						})
						.finally(() => {
							this.setLoading(false);
						});
				}
			})
			.catch((error) => {
				console.log('error status = ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 結案狀態
	switchBtn(index) {
		if (this.tableType === 'ergonomic') {
			this.form[this.tableType][index].isClose = !this.form[this.tableType][index].isClose;
		} else {
			this.form[this.tableType][index].closeFlag = !this.form[this.tableType][index].closeFlag;
		}
		console.log(this.form);
	}

	// 表格-合併列
	getRowSpan(property, gridData) {
  	const rowSpanList = [];
  	const dataTitle = gridData.length > 0 && gridData.map((dto) => dto[property]);
  	// 計算相同元素並以物件key顯示
  	const countedColumns = dataTitle.reduce((all, col) => {
  		if (col in all) {
  			all[col]++;
  		} else {
  			all[col] = 1;
  		}
  		return all;
  	}, {});
  	// 取相同元素的值
  	Object.values(countedColumns as number).forEach((item) => {
  		rowSpanList.push(item);
  		if (item > 1) {
  			for (let i = 0; i < item - 1; i++) {
  				rowSpanList.push(0);
  			}
  		}
  	});
  	return rowSpanList;
	}

	async setResultParam() {
		// const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	const query = this.$global.getQuery();
		if (query) {
			this.uid = query.uid;
			this.userInfo = query.data;
			// this.tableType = query.type ? query.type : '';
		}

		if (sessionStorage.getItem('caseMaintainType')) {
			this.tableType = JSON.parse(sessionStorage.getItem('caseMaintainType')).tableType;
		}
	}

	// 2.1.3	個案維護-個人基本資料API
	getCaseMaintainUserInfo() {
		this.setLoading(true);
		const userData = this.userInfo.uid;
		this.$CaseMaintainUtilityApi.personalInfoUsingPOST({ userId: userData })
			.then((resp) => {
				const $data = resp.data.data;
				this.infoData = {
					name: $data.name,
					sex: $data.sex,
					birth: $data.birthday ? moment($data.birthday).format('YYYY/MM/DD') : '',
					id: $data.idNo,
					dep: $data.dptName,
					apply: $data.baseDt ? moment($data.baseDt).format('YYYY/MM/DD') : '',
					place: $data.workArea,
					check: $data.checkDate ? moment($data.checkDate).format('YYYY/MM/DD') : '',
					strange: $data.level,
					mother: $data.pregnanCategoryEnum,
					muscle: $data.boneAnalysis,
					health: $data.educationDt ? moment($data.educationDt).format('YYYY/MM/DD HH:mm:ss') : '',
					send: $data.sendConsultDt ? moment($data.sendConsultDt).format('YYYY/MM/DD HH:mm:ss') : '',
					reserve: $data.reserveConsultDt ? moment($data.reserveConsultDt).format('YYYY/MM/DD HH:mm:ss') : '-',
					end: $data.finishConsultDt ? moment($data.finishConsultDt).format('YYYY/MM/DD HH:mm:ss') : '',
				};
			})
			.catch((error) => {
				console.log('error status = ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 2.1.4	個案維護-查詢護理紀錄類別API
	getCaseNurseRecordCate() {
		this.setLoading(true);
		this.$CaseMaintainUtilityApi.rpnRecordTypeUsingPOST()
			.then((resp) => {
				this.recordTypeOption = resp.data.data.map((e) => ({
					label: e.careRecordDesc,
					value: e.careRecordType,
				}));
			})
			.catch((error) => {
				console.log('error status = ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 2.1.6	個案維護-儲存護理紀錄API
	async fetchSaveRpnRecord(RpnRecord) {
		this.setLoading(true);
		await this.$CaseMaintainUtilityApi.saveRpnRecordUsingPOST(RpnRecord)
			.then((resp) => {
				if (resp.data.status === 200) {
					this.passSaveRpnRecord = true;
					notification.success({ content: '護理紀錄儲存成功' });
				} else {
					this.passSaveRpnRecord = false;
					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
			})
			.catch((error) => {
				console.log('error status => ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: [人因]下載人因工程檢核表
	downloadErgonomicList() {
		this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanFactorCaseDownLoadUsingPOST({ uidList: [this.userInfo.uid] }, { responseType: 'blob' })
			.then((resp) => {
				const disposition = resp.headers['content-disposition'];
				if (disposition) {
					let filename = '';
					if (disposition.indexOf('attachment') !== -1) {
						const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
						const matches = filenameRegex.exec(disposition);
						if (matches != null && matches[1]) {
							filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
						}
					}
					this.$blobUtils.download(
							resp.data as Blob,
							filename,
							resp.headers['content-type'],
					);
				} else {
					this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanFactorCaseDownLoadUsingPOST({ uidList: [this.userInfo.uid] })
						.then((resp) => {
							const respData = JSON.stringify(resp);
							const apiErrorMsg = JSON.parse(respData).data.apiError;
							this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
						})
						.catch((error) => {
							console.log(error);
						})
						.finally(() => {
							this.setLoading(false);
						});
				}
			})
			.catch((error) => {
				console.log('error status = ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	 // API: 下載空白醫生諮詢表(職場健康醫師諮詢申請單)
	fetchDownloadHealthForm() {
		this.setLoading(true);
  	this.$CaseMaintainUtilityApi.downloadHealthFormUsingPOST({ responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  			  let filename = '';
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
						resp.data as Blob,
						filename,
						resp.headers['content-type'],
  				);
  			} else {
  				this.$CaseMaintainUtilityApi.downloadHealthFormUsingPOST()
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						// TEST:
  						// console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	openNurseRecordModal() {
		this.ViewModalVisible = true;
	}

	async created() {
		for (let i = 0; i < 7; i++) {
			const yearStr = JSON.stringify(moment().year() - i);
			this.yearOpts.push({ value: yearStr, label: yearStr });
		}
		this.period = JSON.stringify(moment().year());
		await this.setResultParam();
		this.getCaseMaintainUserInfo();
		this.getCaseNurseRecordCate();

		// this.lastestUncloseCase = this.getLastestUncloseCase();

		// this.form[this.tableType]
		// this.getDoctorData();
		// this.getHealthData();
	}

	// { label: '醫師諮詢服務', value: 'doctor' },
	// 	{ label: '健康快e通', value: 'health' },
	// 	{ label: '異常負荷預防', value: 'overload' },
	// 	{ label: '人因危害預防', value: 'ergonomic' },
	// 	{ label: '母性健康保護', value: 'mother' },

	async getLastestUncloseCase() {
		let caseId = null;
		switch (this.tableType) {
		case 'mother':
			const motherArr = this.form.mother.filter((e) => (!e.closeFlag));
			caseId = motherArr.length > 0 ? motherArr[0].caseId : null;
			break;
		case 'ergonomic':
			const ergonomicArr = this.form.ergonomic.filter((e) => (!e.isClose));
			caseId = ergonomicArr.length > 0 ? ergonomicArr[0].caseId : null;
			break;

		case 'overload':
			await this.$nextTick();
			let overloadArr = await (this.$refs.OverloadCaseGrid as any).getFormList();
			overloadArr = overloadArr.filter((e) => (e.isClose === 'N'));
			caseId = overloadArr.length > 0 ? overloadArr[0].infoId : null;
			break;

		default:
			caseId = null; // 醫師諮詢服務、健康快e通不用回傳caseId
			break;
		}

		return caseId;
	}

	overloadGetLastestUncloseCase() {
		this.getLastestUncloseCase().then((e) => {
			this.lastestUncloseCase = e;
			console.log('lastestUncloseCase', e);
		});
	}

	getRpnCareRecord(): RpnRecordSaveDto {
		const RpnRecord = {
			srcFrom: JSON.parse(sessionStorage.getItem('caseMaintainType')).srcFrom,
			uid: this.userInfo.uid,
			rpnCareRecordSaveDtoList: [],
		};
		this.recordType.forEach((item) => {
			switch (item) {
			case 'Z0301':
				RpnRecord.rpnCareRecordSaveDtoList.push({
					careRecordRemark: this.recordForm[0],
					careRecordType: item,
				});
				break;
			case 'Z0302':
				RpnRecord.rpnCareRecordSaveDtoList.push({
					careRecordRemark: this.recordForm[1],
					careRecordType: item,
				});
				break;
			case 'Z0305':
				RpnRecord.rpnCareRecordSaveDtoList.push({
					careRecordRemark: this.recordForm[2],
					careRecordType: item,
				});
				break;
			case 'Z0303':
				RpnRecord.rpnCareRecordSaveDtoList.push({
					careRecordRemark: this.recordForm[3],
					careRecordType: item,
				});
				break;
			case 'Z0304':
				RpnRecord.rpnCareRecordSaveDtoList.push({
					careRecordRemark: this.recordForm[4],
					careRecordType: item,
				});
				break;
			}
		});
		return RpnRecord;
	}

	getModifyHistoryRespData(data) {
		this.saveCaseRespData = data;
	}

	// 儲存母性個案
	async saveMotherCase() {
		// this.$notification.destroy(); // 清除錯誤彈窗
		const motherData: MonPlanCaseCloseInfoDto = {
			monPlanCaseCloseInfoList: [],
		};
		const form = this.form.mother.filter((e) => (!e.oriCloseStatus) && (e.closeFlag));
		motherData.monPlanCaseCloseInfoList = form.map((e) => ({
			caseId: e.caseId,
			closeFlag: e.closeFlag,
			closeText: e.closeText,
		}));

		if (motherData.monPlanCaseCloseInfoList.length === 0 && this.getRpnCareRecord().rpnCareRecordSaveDtoList.length === 0) {
			notification.error({ content: '請選填欲編輯表單' });
			return;
		}
		if (motherData.monPlanCaseCloseInfoList.length === 0) {
			this.saveCaseRespData = {};
			this.saveCaseRespData.status = 200;
		} else {
			this.setLoading(true);
			// 根據CaseId和Close相關訊息
			await this.$MONPLANRpnMaintainApi.saveInfoUsingPOST(motherData)
				.then((resp) => {
					this.saveCaseRespData = resp.data;
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally(() => {
					this.setLoading(false);
				});
		}
	}

	// 儲存人因個案
	async saveErgonomicCase() {
		// this.$notification.destroy(); // 清除錯誤彈窗
		const data: HfeCaseCloseDto = {
			caseCloseListDtos: [],
		};
		const form = this.form.ergonomic.filter((e) => (e.isClose) && (!e.oriCloseStatus));
		data.caseCloseListDtos = form.map((e) => ({
			caseId: e.caseId,
			closedDesc: e.closedDesc,
			remark: e.remark,
			srcFrom: 'D0104',
		}));
		console.log(data);
		if (data.caseCloseListDtos.length === 0 && this.getRpnCareRecord().rpnCareRecordSaveDtoList.length === 0) {
			notification.error({ content: '請選填欲編輯表單' });
			return;
		}
		if (data.caseCloseListDtos.length === 0) {
			this.saveCaseRespData = {};
			this.saveCaseRespData.status = 200;
		} else {
			await this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanFactorCaseCloseUsingPOST(data)
				.then((resp) => {
					this.saveCaseRespData = resp.data;
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally(() => {
					this.setLoading(false);
				});
		}
	}

	// API: 2.1.2	個案維護-儲存結果API
	async fetchSaveInfo(caseMaintainResultInputInfoDtoList) {
  	this.setLoading(true);
  	await this.$CaseMaintainUtilityApi.saveUsingPOST({ caseMaintainResultInputInfoDtoList })
  		.then((resp) => {
				this.saveCaseRespData = resp.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// 跳轉醫生諮詢
	async goDoc() {
		this.$notification.destroy();
		// this.$router.push({ name: 'CaseMaintainReservation' });
		let srcFrom;
		switch (this.tableType) {
		case 'doctor':
			srcFrom = 'D0105';
			break;
		case 'health':
			srcFrom = 'D0101';
			break;
		case 'mother':
			srcFrom = 'D0102';
			break;
		case 'overload':
			srcFrom = 'D0103';
			break;
		case 'ergonomic':
			srcFrom = 'D0104';
			break;

		default:
			break;
		}

		const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify({
			caseId: this.lastestUncloseCase,
			srcFrom,
			caseEmpId: this.infoData.id, // 導頁去醫生諮詢用
		}));

		sessionStorage.setItem('caseInfo', encryptQuery);

		this.$global.changeRouterAndaddParam({
			toRouter: 'CaseMaintainReservation',
			query: {
				caseId: this.lastestUncloseCase,
				srcFrom,
			},
		});
	}

	// 儲存
	async onSave(type?) {
		// 儲存護理紀錄類別
		const rpnRecord = this.getRpnCareRecord();
		if (rpnRecord.rpnCareRecordSaveDtoList.length > 0) {
			await this.fetchSaveRpnRecord(rpnRecord);
		} else {
			this.passSaveRpnRecord = true;
		}

		if (!this.passSaveRpnRecord) {
			return;
		}

		// 儲存個案結果
		let formData;
		let validate;
  	switch (this.tableType) {
  	case 'mother':
			await this.saveMotherCase();
  		break;
		case 'overload':
			await (this.$refs.OverloadCaseGrid as any).modifyHistory();
			break;
		case 'doctor':
			formData = (this.$refs.doctorCunsult as any).getFormData();
			// 檢核有上傳附件的該筆狀態是否為結案且有備註
			validate = formData.length !== 0;
			formData.every((el, index) => {
				if (!el.uploadFileId || el.isClosed === 'N' || !el.remark) {
					validate = false;
					return false;
				}
			});
			if (!validate) {
				infoModal.alertError({
					title: '提醒',
					content: '請確認是否已上傳附件和填寫護理紀錄及進行結案',
				});
				return;
			}
			await this.fetchSaveInfo(formData);
			break;
		case 'health':
			formData = (this.$refs.doctorCunsult as any).getFormData();
			// 檢核有上傳附件的該筆狀態是否為結案且有備註
			validate = formData.length !== 0;
			formData.every((el, index) => {
				if (!el.uploadFileId || el.isClosed === 'N' || !el.remark) {
					validate = false;
					return false;
				}
			});
			if (!validate) {
				infoModal.alertError({
					title: '提醒',
					content: '請確認是否已上傳附件和填寫護理紀錄及進行結案',
				});
				return;
			}
			await this.fetchSaveInfo(formData);
			break;
		case 'ergonomic':
			await this.saveErgonomicCase();
			break;
		default:
  		break;
  	}

		// 跳轉頁面
		if (this.saveCaseRespData) {
			if (type === 'toDoc') {
				this.$notification.destroy();
				this.$router.push({ name: 'CaseMaintainReservation' });
			} else {
				this.$notification.destroy();
				this.$global.changeRouterAndaddParam({
					toRouter: 'CaseMaintainResult',
					params: { type: 'list' },
					query: {
						result: this.saveCaseRespData.status === 200 ? 'success' : 'fail',
						errorMsg: this.saveCaseRespData.apiError && this.$global.getApiErrorMsg(this.saveCaseRespData.apiError).join(''),
					},
				});
			}
		}
	}

	downloadForm(type) {
  	if (type == 'doctor') {
  		this.fetchDownloadHealthForm();
  	} else if (type === 'ergonomic') {
			this.downloadErgonomicList();
  	}
	}

	@Watch('tableType')
	async onTableTypeChange(val) {
		sessionStorage.setItem('caseMaintainType', JSON.stringify({
			tableType: val,
			srcFrom: this.$enum.getKey('srcFromEnum', this.tableTypeOption.find((e) => e.value === val).label),
		}));
		this.period = JSON.stringify(moment().year());
		this.gridData.data = [];
		switch (val) {
		case 'doctor':
			this.$nextTick(() => {
				(this.$refs.doctorCunsult as any).fetchCaseMaintain();
			});
			break;
		case 'health':
			this.$nextTick(() => {
				(this.$refs.doctorCunsult as any).fetchCaseMaintain();
			});
			break;
		case 'overload':
			await this.$nextTick();
			await (this.$refs.OverloadCaseGrid as any).fetchOverloadHistory();
			break;
		case 'mother':
			this.title = '母性健康保護';
			await this.fetchMotherData();
			break;
		case 'ergonomic':
			this.title = '人因危害預防';
			await this.mappingErgonmicTable();
			break;
		default:
			break;
		}
		this.getLastestUncloseCase().then((e) => {
			this.lastestUncloseCase = e;
			console.log('lastestUncloseCase', e);
		});
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
.query__radio{
	display: block;
	justify-content: center;
  padding: 0;
  @include rwd-md {
    display: flex;
  }
  @include rwd-lg {
    padding-left: 146px;
  }
}
::v-deep {
	.ant-radio-button-wrapper{
		min-width: 120px;
		text-align: center;
	}
	.ant-table-placeholder{
		display: none;
	}
}
.query__check {
	button {
		padding: 8px 24px;
    width: 146px;
	}
}

.notMobile {
  display: none;
  @include rwd-sm {
    display: block;
  }
}
.isMobile {
  @include rwd-sm {
    display: none;
  }
}

// 個人基本資料
.page__card {
  border: 0.5px solid #CED4D9;
  margin-bottom: 20px;
  margin-top: 0;
  width: auto;
  border-radius: 0;
}
.card__info {
  padding: 20px;
}
.card__info__col {
  padding-left: 30px;
  &:nth-child(1) {
    border: 0;
    @include rwd-md {
      border-right: 1px solid #D1D1D1;
    }
  }
  @include rwd-lg {
    padding-left: 90px;
  }
}
.title--green {
  color: #23C4A8;
  font-weight: 600;
}

// collapse
.collapse__title {
  font-weight: bold;
  padding: 8px 10px;
}
.query__wrap {
  background-color: #fff;
  padding: 8px 10px;
  width: 100%;
  border-radius: 4px;
}
.collapse__content {
  padding-left: 23px;
}
::v-deep {
  .ant-collapse {
    background-color: #F5F8FC;
  }
  .ant-collapse-item {
    border: 0;
  }
}

// button
.form__wrap {
  .btn__wrap {
    margin: 25px 0;
    button {
      padding: 8px 24px;
      width: 155px;
    }
    .btn__black {
      font-weight: bold;
      color: #fff;
      background-color: #363636;
      border-radius: 25px;
      border: 0;
      width: 135px;
    }
		.btn--ergonomic{
			width:auto
		}
  }
}
.form__year--select{
	width: 250px;
	align-items: center;
}
.under.btn__wrap {
  margin: 40px;
  button {
    width: 220px;
    margin: 5px;
  }
}

// table
.table__wrap {
  padding: 0;
  width: 100%;
  overflow-x: scroll;
}
table {
  margin-top: 25px;
  width: 100%;
  min-width: 890px;
}
.table__th {
  background-color: #F5F8FC;
  border-right: 1px solid #F5F8FC;
  font-weight: bold;
}
.bg--blue {
  background-color: #F5F8FC;
}
td {
  padding: 10px 12px;
}
tr {
  width: 100%;
  border-bottom: 1px solid #E9E9E9;
}
.text--green {
  text-decoration: underline;
  color: #23C4A8;
  white-space: pre-line;
}

.txt__formNo--click {
	text-decoration: underline;
  color: #23C4A8;
  white-space: pre-line;
	cursor: pointer;
}
.table__btnWrap {
  text-align: right;
  vertical-align: middle;
  button {
    margin-right: 10px;
    img {
      width: 16px;
      display: inline-block;
    }
  }
}
.table__width {
	width: 300px;
}
::v-deep {
	.table-overload {
		.ant-table-tbody > tr > td {
			border-right: 1px solid #e8e8e8;
		}
		.ant-table-tbody {
			.ant-table-row:first-of-type {
				.ant-table-row-cell-break-word:first-of-type {
					background: $COLOR-MAIN10;
				}
			}
		}
	}
	.table-mother {
		.ant-table-tbody > tr > td {
			border-right: 1px solid #e8e8e8;
		}
		.ant-table-tbody > tr > td:nth-last-child(2) {
			border-right: 1px solid transparent;
		}
		.ant-table-tbody {
			.ant-table-row:first-of-type {
				.ant-table-row-cell-break-word:first-of-type {
					background: $COLOR-MAIN10;
				}
			}
		}
	}
  .ant-switch {
    background-color: #CB5B4D;
  }
  .ant-switch-checked {
    background-color: #23C4A8;
  }
  .switch--disable {
    background-color: #999999;
  }
	.ant-checkbox-inner {
		border-radius: 100%;
	}
}
.icon__btn {
  background: #F5F8FC;
  border-radius: 16px;
  border: 0;
  width: 40px;
  height: 32px;
  color: #23C4A8;
  &:hover {
    color: #FFFFFF;
    background: #23C4A8;
    cursor: pointer;
		img {
			content: url("../../../../assets/images/button_mail_white.svg");
		}
  }
  img {
    margin: auto;
  }
}
.btn--disable, .btn--disable:hover {
  background-color: #F5F5F5;
  color: #999999;
  cursor: default;
	img {
		content: url("../../../../assets/images/button_mail_gray.svg");
	}
}
.nodata__wrap {
  padding: 20px 0;
  width: 100%;
  text-align: center;
  .nodata__text {
    font-size: 20px;
    margin-bottom: 10px;
  }
  img {
    margin: auto;
  }
}
.table__nodata {
	margin-top: 25px;
  table {
    min-width: 100%;
  }
}
.doctor__table {
	margin-top: 25px;
}
</style>
