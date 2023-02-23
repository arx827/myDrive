<template>
  <div
    v-if="auditDraftContent"
    class="main-contain crawlerindex-container container"
  >
    <div class="row g-0 mb-3">
      <div class="col-1" />
      <div class="col ps-2 text-end">
        <IconTextButton
          class="align-self-stretch"
          text="上一頁"
          type="return"
          @click="toPreviousPage"
        />
      </div>
      <div class="col-auto content__action" />
    </div>
    <div class="row g-0 mb-3">
      <div class="col-1 text-end content__label">
        查核人員：
      </div>
      <div class="col ps-2">
        {{ draftAuditorString }}
      </div>
      <div class="col-auto content__action">
        <div
          v-if="isEditAuditor"
          class="row g-0"
        >
          <div
            v-if="auditDraftContent.canModifyAuditorFlag"
            class="col-5"
          >
            <button
              class="textarea__control__btn btn__icon--edit-acion"
              @click="onEditAuditor"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="row g-0"
      :class="{'mb-3': !auditDraftContent.canUploadFlag}"
    >
      <div class="col-1 text-end content__label">
        查核內容：
      </div>
      <div class="col ps-2">
        <a-form-model
          ref="formRef"
          :model="auditDraftContent"
          :hide-required-mark="true"
          :rules="formRules"
        >
          <a-form-model-item
            prop="content"
          >
            <a-textarea
              v-model="auditDraftContent.content"
              :disabled="!auditDraftContent.canModifyContentFlag"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="col-auto content__action">
        <div class="row g-0">
          <div class="col-5">
            <a-tooltip
              placement="top"
              :overlay-class-name="'whiteTooltip'"
            >
              <template slot="title">
                <span>比對資料</span>
              </template>
              <button
                class="textarea__control__btn btn__icon--comparison mb-3"
                @click="onCompareData"
              />
            </a-tooltip>
          </div>
          <div class="col-5">
            <a-tooltip
              placement="top"
              :overlay-class-name="'whiteTooltip'"
            >
              <template slot="title">
                <span>連結資料</span>
              </template>
              <button
                class="textarea__control__btn btn__icon--small_link mb-3"
                @click="onConnectData"
              />
            </a-tooltip>
          </div>
          <div
            v-if="auditDraftContent.canQaContentFlag"
            class="col-5"
          >
            <a-tooltip
              placement="top"
              :overlay-class-name="'whiteTooltip'"
            >
              <template slot="title">
                <span v-if="auditDraftContent.redQaStatusFlag">待回覆</span>
                <span v-else>回覆提問</span>
              </template>
              <button
                class="textarea__control__btn"
                :class="auditDraftContent.redQaStatusFlag ? 'btn__icon--question_red': 'btn__icon--question'"
                @click="openDraftQAModal"
              />
            </a-tooltip>
          </div>
          <div
            v-if="auditDraftContent.canModifyContentFlag"
            class="col-5"
          >
            <a-tooltip
              placement="top"
              :overlay-class-name="'whiteTooltip'"
            >
              <template slot="title">
                <span v-if="auditDraftContent.redCheckStatusFlag">待確認</span>
                <span v-else>確認修改</span>
              </template>
              <button
                class="textarea__control__btn"
                :class="auditDraftContent.redCheckStatusFlag ? 'btn__icon--confirm' : 'btn__icon--enter1'"
                @click="modifyAuditDraftContent"
              />
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="auditDraftContent.canUploadFlag"
      class="row"
    >
      <div class="col text-center my-4">
        <IconTextButton
          class="align-self-stretch"
          text="查核人員上傳"
          type="upload"
          @click="uploadModal.visible = true"
        />
      </div>
    </div>
    <div class="row g-0">
      <div class="col-1 text-end content__label">
        全部附件：
      </div>
      <div class="col ps-2">
        <div
          v-if="auditDraftContent.auditDraftContentFileVOS && auditDraftContent.auditDraftContentFileVOS.length > 0"
          class="block block--scroll"
        >
          <template v-for="(file,index) in auditDraftContent.auditDraftContentFileVOS">
            <a
              :key="file.auditDraftContentFileId"
              @click.prevent=" onDownload(file.auditDraftContentFileId) "
            >
              {{ file.fileName }}
            </a>
            <span
              v-if="index+1<auditDraftContent.auditDraftContentFileVOS.length"
              :key="index"
            >、</span>
          </template>
        </div>
        <div v-else>
          無
        </div>
      </div>
      <div
        v-if="auditDraftContent.auditDraftContentFileVOS && auditDraftContent.auditDraftContentFileVOS.length > 0"
        class="col-auto content__action"
      >
        <div class="row g-0">
          <div class="col-5">
            <button
              class="textarea__control__btn btn__icon--download_light"
              @click="onDownload()"
            />
          </div>
        </div>
      </div>
    </div>
    <AccordionArea
      :is-line="true"
      class="mt-3"
    >
      <div class="row g-0 mt-3 mb-3">
        <div class="col-1 text-end content__label label--large align-self-center">
          查核意見：
        </div>
        <div class="col-11 align-items-center d-flex">
          <a-radio-group
            v-model="auditDraftContent.opinion"
            :disabled="isDisabledAuditDraftContentOption"
            class="align-self-center"
          >
            <a-radio
              v-for="option in auditOpinionOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-radio>
          </a-radio-group>
          <div class="ms-auto">
            <IconTextButton
              v-if="isShowSaveBtn"
              class="me-3"
              text="暫存"
              type="save"
              @click="saveHandler"
            />
            <IconTextButton
              text="比對資料"
              type="comparison_d"
              @click="onCompareFeed"
            />
          </div>
        </div>
      </div>
      <template v-if="auditOpinionsFrontEnd && auditOpinionsFrontEnd.length > 0">
        <AuditOpinion
          v-for="(auditOpinion,index) in auditOpinionsFrontEnd"
          ref="auditOpinion"
          :key="auditOpinion.auditOpinionId"
          class="mb-3"
          :index="index"
          :audit-opinion.sync="auditOpinionsFrontEnd[index]"
          :original-audit-option="originalAuditOpinionsFrontEnd && originalAuditOpinionsFrontEnd[index]"
          :risk-level-options="riskLevelOptions"
          :current-role="currentRole"
          :current-user="currentUser"
          :audit-draft-content-status="auditDraftContent.status"
          :audit-opinion-unit-options="auditOpinionUnitOptions"
          :opinion="auditDraftContent.opinion"
          :improve-disabled-date="improveDisabledDate"
          :draft-auditor="auditDraftContent.auditors"
          @openOpinionQAModal="openOpinionQAModal"
          @removeMainAuditOpinion="removeMainAuditOpinion"
          @updateAuditOpinion="updateOpinion"
        />
      </template>
      <div
        v-if="isAddMainAuditOpinion"
        class="text-center mb-4 mt-4"
      >
        <button
          class="btn--addblock"
          @click="addAuditOpinion(auditOpinionsFrontEnd)"
        >
          <a-icon
            class="icon"
            type="plus"
          /><span>新增主項</span>
        </button>
      </div>
    </AccordionArea>
    <TemporaryStoreButton
      v-if="isShowSaveBtn"
      @click="saveHandler"
    />
    <QAModal
      :visible="QAModal.visible"
      :type="QAModal.type"
      :audit-opinion.sync="QAModal.auditOpinion"
      :audit-draft-content.sync="QAModal.auditDraftContent"
      @closeModal="QAModal.visible = false"
      @updateAuditOpinion="updateOpinion"
      @reloadDraft="()=>getDraftContent(auditDraftContent.auditDraftContentId)"
    />
    <!-- (彈窗) 編輯查核人員 -->
    <EditAuditorModal
      :visible="editAuditorModal.visible"
      :audit-draft-content-id="auditDraftContent.auditDraftContentId"
      :draft-auditor="auditDraftContent.auditors"
      @closeModal="editAuditorModal.visible = false"
      @reloadDraft="()=>getDraftContent(auditDraftContent.auditDraftContentId)"
    />
    <!-- (彈窗) 連結資料 -->
    <ConnectDataModal
      :visible="connectDataModal.visible"
      :audit-draft-content-id="auditDraftContent.auditDraftContentId"
      @closeModal="connectDataModal.visible = false"
    />
    <!-- 查核內容 比對資料 彈窗 -->
    <CompareDataModal
      :visible="compareDataModal.visible"
      :audit-draft-content-id="compareDataModal.auditDraftContentId"
      :current-data="compareDataModal.currentData"
      @closeModal="compareDataModal.visible = false"
    />
    <!-- 查核意見 比對資料 彈窗 -->
    <CompareFeedModal
      :visible="compareFeedModal.visible"
      :audit-draft-content-id="auditDraftContent.auditDraftContentId"
      @closeModal="compareFeedModal.visible = false"
    />
    <!-- 查核人員上傳附件 彈窗 -->
    <UploadModal
      :visible="uploadModal.visible"
      :audit-draft-content-id="auditDraftContent.auditDraftContentId"
      @closeModal="uploadModal.visible = false"
      @reloadDraft="()=>getDraftContent(auditDraftContent.auditDraftContentId)"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch,
} from 'vue-property-decorator';
import CompareDataModal from '@components/auditing/auditingContent/CompareDataModal.vue';
import CompareFeedModal from '@components/auditing/auditingContent/CompareFeedModal.vue';
import AccordionArea from '@shared/AccordionArea.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import AuditOpinion from '@/components/auditing/auditingContent/AuditOpinion.vue';
import TemporaryStoreButton from '@shared/button/TemporaryStoreButton.vue';
import { Action, namespace } from 'vuex-class';
import { uuid } from 'vue-uuid';
import {
	AccountDto,
	RoleDto,
	AuditOpinionDto,
	SelectOptionDto,
	UpdateDraftContentRequestVO,
	SaveAuditOpinionTmpRequest,
	SearchResponsibleDepartmentDto,
	DownloadAuditDraftContentFileRequestVO,
	AuditOpinionTempRequest,
	AuditDraftContentDetailResponseDto,
} from '@fubonlife/iams-api-axios-sdk';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import QAModal from '@/components/auditing/auditingContent/AuditOpinionQAModal.vue';
import {
	AuditOpinionFrontEndDto, UpdateAuditOpinion, resultModel, auditingDetailSearchForm, AuditOpinionQAModel,
} from '@/pages/auditing/models';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';
import moment from 'moment';
import EditAuditorModal from '@/components/auditing/auditingContent/EditAuditorModal.vue';
import ConnectDataModal from '@/components/auditing/auditingContent/ConnectDataModal.vue';
import UploadModal from '@/components/auditing/auditingContent/UploadModal.vue';

const modalModule = namespace('modalControl');

@Component({
	components: {
		IconTextButton,
		CustomPopConfirm,
		AccordionArea,
		AuditOpinion,
		QAModal,
		EditAuditorModal,
		ConnectDataModal,
		CompareDataModal,
		CompareFeedModal,
		TemporaryStoreButton,
		UploadModal,
	},
})
export default class AuditingContent extends Vue {
	@Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

	// 時間format格式
	formatter = this.$twDateFormatter;

	yearFormatter = this.$twYearFormatter;

	currentRole: RoleDto = this.$global.getCurrentRole();

	currentRoleId: string = this.$global.getCurrentRoleId();

	currentUser: AccountDto = this.$user.getMe();

	// ----------------------------------- 彈窗 -----------------------------------
	// QA 彈窗 prop
	QAModal: AuditOpinionQAModel = {
		visible: false,
		auditOpinion: null,
		auditDraftContent: null,
		type: null,
	}

	// 查核內容 比對資料(彈窗)
	compareDataModal = {
		visible: false,
		auditDraftContentId: null,
		currentData: null,
	};

	// 比對資料(彈窗)
	compareFeedModal = {
		visible: false,
		auditDraftContentId: 0,
	};

	// 編輯查核人員彈窗
	editAuditorModal={
		visible: false,
	}

	// 連結資料彈窗
	connectDataModal: {visible: boolean} = {
		visible: false,
	}

	uploadModal = {
		visible: false,
	}

	// 查核內容 查核內容的原始資料 => 確認修改判斷使用
	originalDraftContent: string = null;

	// 查核內容領隊
	inChargeAuditor = null;

	// 查核內容
	auditDraftContent: AuditDraftContentDetailResponseDto = null;

	// 查核意見選項
	opinionOptions = null;

	// 風險等級radio選項
	riskLevelOptions = null;

	// 查核意見radio選項
	auditOpinionOptions: SelectOptionDto[] = null;

	// 負責部門下拉選單
	auditOpinionUnitOptions = null;

	// 查核意見制式 wording
	templateOpinionContent: SelectOptionDto[] = null;

	// 查核意見改善期限不能選擇的日期
	improveDisabledDate: Date = null;

	// ----------------------------------- 查核意見 -----------------------------------
	// API取得的查核意見
	auditOpinions: AuditOpinionDto[] = [];

	// 制式查核意見格式
	templateAuditOpinions: AuditOpinionFrontEndDto = {
		auditOpinionId: null,
		canModifyFlag: true,
		canQaFlag: null,
		redCheckStatusFlag: null,
		redQaStatusFlag: null,
		auditors: null,
		itemType: 'MAIN',
		subRelMainId: null,
		seq: 1,
		content: null,
		auditOpinionUnits: [],
		suggestion: null,
		opinionSummary: null,
		riskLevel: 'null',
		improveDeadline: null,
		improve: null,
		improveDate: null,
		imporveOption: 'null',
		improveSituation: null,
		subAuditOpinions: [],
		modify: true,
	};

	// 前端使用的查核意見：多imporveOption，來給改善期限radio group binding
	auditOpinionsFrontEnd: AuditOpinionFrontEndDto[] = null;

	// 前端使用的原始查核意見：用來暫存比較變更使用
	originalAuditOpinionsFrontEnd: AuditOpinionFrontEndDto[] = null;

	// 查核欄位檢核
	formRules = {
  	content: [{ required: true, message: '此為必填欄位', trigger: 'change' }],
	}

	/**
	* get
	*/
	// 隱藏查核意見選項
	get isDisabledAuditDraftContentOption(): boolean {
		if (!this.auditDraftContent?.canModifyOpinionFlag) return true;
		// 如果選擇了「有」，有填寫查核意見時，不可再選擇別的項目
		if (this.auditDraftContent?.opinion === 'Y'
		&& this.auditOpinionsFrontEnd
		&& this.auditOpinionsFrontEnd.length > 0) return true;
		return false;
	}

	// 是否可以編輯查核人員
	get isEditAuditor(): boolean {
		return this.auditDraftContent?.canModifyAuditorFlag;
	}

	// 是否可以新增查核意見主項
	get isAddMainAuditOpinion(): boolean {
		if (this.currentRoleId === 'ROLE_Auditor' // 為查核人員
			&& this.auditDraftContent?.status !== '99' && this.auditDraftContent?.status !== '90'
			&& this.auditDraftContent?.opinion === 'Y') return true;
		return false;
	}

	// 是否顯示暫存按鈕
	get isShowSaveBtn(): boolean {
		if (this.auditOpinionsFrontEnd && this.auditOpinionsFrontEnd.length > 0) {
			for (let i = 0; i < this.auditOpinionsFrontEnd.length; i++) {
				if (this.auditOpinionsFrontEnd[i].canModifyFlag) return true;
				if (this.auditOpinionsFrontEnd[i].subAuditOpinions && this.auditOpinionsFrontEnd[i].subAuditOpinions.length > 0) {
					const subAuditOpinions = this.auditOpinionsFrontEnd[i].subAuditOpinions;
					for (let j = 0; j < subAuditOpinions.length; j++) {
						if (subAuditOpinions[j].canModifyFlag) return true;
					}
				}
			}
		}
		return false;
	}

	// 查核內容－查核人員 顯示字串
	get draftAuditorString(): string {
		if (this.auditDraftContent?.auditors?.length > 0) {
			return this.auditDraftContent.auditors.map((auditor) => auditor.value).join('、');
		}
		return '';
	}

	/**
	* 監聽
	*/
	@Watch('auditOpinionsFrontEnd', { deep: true })
	onauditOpinionsFrontEndChanged(val) {
		console.log('auditOpinionsFrontEnd changed => ', val);
	}

	@Watch('auditOpinions', { deep: true })
	onAuditOpinionsChanged(val) {
		// console.log('auditOpinions changed => ', val);
	}

	@Watch('auditDraftContent.opinion')
	onDraftContentOpinionChanged(newVal, oldVal) {
		if ((!this.auditOpinionsFrontEnd || this.auditOpinionsFrontEnd.length === 0) && (newVal === 'N' || newVal === 'X')) {
			const addOpinion: AuditOpinionFrontEndDto = {
				...this.templateAuditOpinions,
				auditOpinionId: `add${uuid.v4()}`,
				auditors:	[{ key: this.currentUser.employee.domainId, value: this.currentUser.employee.name }],
				content: this.templateOpinionContent.find((content) => content.value === newVal)?.label,
			};
			this.auditOpinionsFrontEnd = [addOpinion];
		}
	}

	// --- 彈窗控制 ---
	// 比對查核內容
	onCompareData() {
		// console.log('onCompareData() invoked');
		this.compareDataModal.visible = true;
		this.compareDataModal.auditDraftContentId = this.auditDraftContent.auditDraftContentId;
		this.compareDataModal.currentData = {
			auditDraftContentId: this.auditDraftContent.auditDraftContentId,
			auditDraftContentLogId: null,
			content: this.auditDraftContent.content,
			updateDatetime: '當前編輯項目',
			updateRole: { code: this.currentRoleId, name: this.currentRole.name },
			updateUser: { code: this.currentUser.employee.domainId, name: this.currentUser.employee.name },
		};
	}

	// 比對查核意見
	onCompareFeed() {
		// console.log('onCompareFeed() invoked');
		this.compareFeedModal.visible = true;
	}

	// 編輯查核人員彈窗 開啟
	onEditAuditor() {
		// console.log('編輯查核人員開啟');
		this.editAuditorModal.visible = true;
	}

	// 連結資料彈窗 開啟
	onConnectData() {
		this.connectDataModal.visible = true;
	}

	/**
* Hook
*/
	async created() {
		await this.getOpinionTemplate();
		await this.getAuditOpinionOption();
		await this.getDraftContent(this.$global.getQuery().auditDraftContentId);
		this.inChargeAuditor = this.$global.getQuery().inCharge;
		this.improveDisabledDate = new Date(new Date(this.$global.getQuery().ckEndDate).setHours(23, 59, 59, 59));
		// console.log('this.improveDisabledDate', this.improveDisabledDate);
		this.getRiskLevelOption();
		this.getAuditOpinionUnitOption(this.auditDraftContent.auditDraftSectionId);
		this.auditOpinions = await this.getAuditOpinion(this.auditDraftContent.auditDraftContentId);
		this.initAuditOpinions(this.auditOpinions);
	}

	updated() {
		// console.log('vue updated', this);g0 tj6
	}
	/**
* API
*/

	// API: 撈取查核內容
	async getDraftContent(auditDraftContentId: string) {
		this.setLoading(true);
		await this.$workPaperApi.searchAuditDraftContentDetailUsingPOST(auditDraftContentId)
			.then((resp) => {
				// console.log('查核內容resp', resp);
				this.auditDraftContent = resp.data.result;
				this.originalDraftContent = resp.data.result.content;
			})
			.catch(console.error)
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 撈取風險等級選單
	getRiskLevelOption() {
		this.setLoading(true);
		this.$workPaperApi.searchRiskLevelUsingGET()
			.then((resp) => {
				// console.log('resp', resp);
				this.riskLevelOptions = resp.data.result;
				// 前端必須多一項 'null'，不選擇 選項
				this.riskLevelOptions = [{
					label: '不選擇',
					value: 'null',
				}, ...this.riskLevelOptions];
			})
			.catch(console.error)
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 撈取查核意見選單
	async getAuditOpinionOption() {
		this.setLoading(true);
		await this.$workPaperApi.searchAuditOpinionInWorkPaperUsingGET()
			.then((resp) => {
				// console.log('resp', resp);
				this.auditOpinionOptions = resp.data.result;
			})
			.catch(console.error)
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 取得負責部門選單
	getAuditOpinionUnitOption(auditDraftSectionId) {
		this.setLoading(true);
		this.$workPaperApi.searchResponsibleDepartmentUsingGET(auditDraftSectionId)
			.then((resp) => {
				// console.log('取得負責部門選單 resp', resp);
				this.auditOpinionUnitOptions = this.convertUnitToTreeSelect(resp.data);
			})
			.catch(console.error)
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 取得查詢查核意見制式wording
	async getOpinionTemplate() {
		this.setLoading(true);
		await this.$workPaperApi.searchWordingInWorkPaperUsingGET()
			.then((resp) => {
				// console.log('取得查詢查核意見制式wording resp', resp);
				this.templateOpinionContent = resp.data.result;
			})
			.catch(console.error)
			.finally(() => {
				this.setLoading(false);
			});
	}

	// ----------------------------------- 查核內容 -----------------------------------
	// API: 查核內容確認修改
	modifyAuditDraftContent() {
  	(this.$refs.formRef as any).validate((valid) => {
			if (valid) {
				this.setLoading(true);
				const request: UpdateDraftContentRequestVO = {
					auditDraftContentId: this.auditDraftContent.auditDraftContentId,
					content: this.auditDraftContent.content,
					isModify: this.originalDraftContent !== this.auditDraftContent.content,
				};
				this.$workPaperApi.updateDraftContentUsingPOST(request)
					.then((resp) => {
						// console.log('查核內容確認修改 resp', resp);
						this.setModalState({
							resultModal: {
								visible: true,
								type: 'success',
								title: '修改查核內容成功',
								autoClose: 3,
							},
						});
						this.getDraftContent(this.auditDraftContent.auditDraftContentId);
					})
					.catch(() => {
						console.error();
						this.setModalState({
							resultModal: {
								visible: true,
								type: 'error',
								title: '修改查核內容失敗',
							},
						});
					})
					.finally(() => {
						this.setLoading(false);
					});
			}
		});
	}

	// API: 查核內容 更新（已讀）回覆提問狀態
	updateDraftQAStatus() {
		// this.setLoading(true);
		// this.$workPaperApi.setOpinionQaStatusInWorkPaperUsingPOST()
		// 	.then((resp) => {
		// 		console.log('resp', resp);
		// 		this.auditOpinionOptions = resp.data.result;
		// 	})
		// 	.catch(console.error)
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	// ----------------------------------- 查核意見 -----------------------------------
	// API: 取得查核意見
	async getAuditOpinion(auditDraftContentId: string): Promise<any> {
		this.setLoading(true);
		let result = null;
		await this.$workPaperApi.searchAuditOpinionUsingGET(auditDraftContentId)
			.then((resp) => {
				// console.log('取得查核意見 resp', resp);
				result = resp.data.result;
			})
			.catch((error) => {
				console.error;
			})
			.finally(() => {
				this.setLoading(false);
			});
		return result;
	}

	// API: 暫存查核意見auditDraftContentId
	saveAuditOpinion(request: SaveAuditOpinionTmpRequest) {
		// console.log('saveRequset', request);
		this.setLoading(true);
		this.$workPaperApi.saveAuditOpinionTmpUsingPOST(request)
			.then(async (resp) => {
				// console.log('resp', resp);
				if (resp.data) {
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'success',
							title: '暫存成功',
							autoClose: 3,
						},
					});
					this.auditOpinions = await this.getAuditOpinion(this.auditDraftContent.auditDraftContentId);
					this.initAuditOpinions(this.auditOpinions);
				} else {
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'error',
							title: '暫存失敗',
						},
					});
				}
			})
			.catch((error) => {
				console.error;
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '暫存失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	//	API: 下載查核內容附件
	onDownload(auditDraftContentFileId: any) {
		const arrFileVOS = this.auditDraftContent.auditDraftContentFileVOS;
		const request: DownloadAuditDraftContentFileRequestVO = {
			auditDraftContentFileIds: auditDraftContentFileId ? [auditDraftContentFileId] : arrFileVOS.map((i) => i.auditDraftContentFileId),
		};
		this.setLoading(true);
		this.$workPaperApi.downloadDraftContentFileUsingPOST(request, { responseType: 'blob' })
			.then((resp) => {
				const indexOfFile = arrFileVOS.map((item) => item.auditDraftContentFileId).indexOf(auditDraftContentFileId);
				const fileName = auditDraftContentFileId ? arrFileVOS[indexOfFile].fileName : `${moment(moment().valueOf()).format('MMDD')}全部附件`;
				this.$blobUtils.download((resp.data as unknown as Blob), fileName);
				// console.log('下載檔案', resp, fileName, this.auditDraftContent.auditDraftContentFileVOS);
			})
			.catch((err) => {
				console.error(err, request, 'whoooo', arrFileVOS.map((i) => i.auditDraftContentFileId));
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	/**
	* Event
	*/

	toPreviousPage() {
		this.$router.go(-1);
	}

	// ----------------------------------- 資料整理 -----------------------------------
	// 將API取得的查核意見整理成前端查核意見資料格式
	auditOpinionsToAuditOpinionsFrontEnd(auditOpinions: AuditOpinionDto[]): AuditOpinionFrontEndDto[] {
		if (!auditOpinions || auditOpinions.length === 0) return [];
		const auditOpinionsFrontEnd = this.$global.deepCopyData(auditOpinions);
		return auditOpinionsFrontEnd.map((auditOpinionsFrontEnd) => {
			if (auditOpinionsFrontEnd.subAuditOpinions && auditOpinionsFrontEnd.subAuditOpinions.length > 0) {
				auditOpinionsFrontEnd.subAuditOpinions = this.auditOpinionsToAuditOpinionsFrontEnd(auditOpinionsFrontEnd.subAuditOpinions);
			}
			// 風險等級
			if (auditOpinionsFrontEnd.riskLevel === null) auditOpinionsFrontEnd.riskLevel = 'null';
			// 改善期限
			auditOpinionsFrontEnd.imporveOption = 'null';
			if (auditOpinionsFrontEnd.improve === true) {
				auditOpinionsFrontEnd.imporveOption = 'imporved';
				// auditOpinionsFrontEnd.improveDate = DateTimeFormmat.isValidDate(`${auditOpinionsFrontEnd.improveDate}`);
			} else if (auditOpinionsFrontEnd.improve === false && auditOpinionsFrontEnd.improveDeadline) {
				auditOpinionsFrontEnd.imporveOption = 'deadLine';
				auditOpinionsFrontEnd.improveDeadline = DateTimeFormmat.isValidDate(`${auditOpinionsFrontEnd.improveDeadline}`);
			}
			auditOpinionsFrontEnd.auditDraftContentId = this.auditDraftContent.auditDraftContentId;
			return auditOpinionsFrontEnd;
		});
	}

	// 將前端查核意見格式轉成暫存API需要格式
	auditOpinionsFrontEndToSaveAuditOpinions(auditOpinionsFrontEnd: AuditOpinionFrontEndDto[]): AuditOpinionTempRequest[] {
		let auditOpinionTempRequest: AuditOpinionTempRequest[] = null;
		// 不需要帶過去的 property
		const deleteProperty = ['auditors', 'imporveOption', 'canModifyFlag', 'canQaFlag', 'redCheckStatusFlag', 'redQaStatusFlag'];
		auditOpinionTempRequest = this.$global.deepCopyData(auditOpinionsFrontEnd).map((auditOpinion) => {
			if (auditOpinion.subAuditOpinions && auditOpinion.subAuditOpinions.length > 0) {
				auditOpinion.subAuditOpinions = this.auditOpinionsFrontEndToSaveAuditOpinions(auditOpinion.subAuditOpinions);
			}
			// riskLevel = 'null' 為前端使用，故要調整成 null
			if (auditOpinion.riskLevel === 'null') auditOpinion.riskLevel = null;
			// 判斷是否為前端新增的項目，如果是，帶回空字串給後端
			if (auditOpinion.auditOpinionId.includes('add')) auditOpinion.auditOpinionId = '';
			// if (auditOpinion.improveDate) auditOpinion.improveDate.toISOString();
			// if (auditOpinion.improveDeadline) auditOpinion.improveDeadline.toISOString();
			if (auditOpinion.improveDeadline) auditOpinion.improveDeadline = moment(auditOpinion.improveDeadline).format('YYYY-MM-DD[T]HH:mm:ss');

			if (auditOpinion.itemType === 'SUB' && auditOpinion.subRelMainId.includes('add')) auditOpinion.subRelMainId = '';
			deleteProperty.forEach((property) => delete auditOpinion[property]);
			auditOpinion.auditDraftContentId = this.auditDraftContent.auditDraftContentId;
			return auditOpinion;
		});
		return auditOpinionTempRequest;
	}

	// 初始化查核意見資料：轉前端格式＋備份原始資料
	initAuditOpinions(auditOpinions: AuditOpinionDto[]) {
		this.auditOpinionsFrontEnd = this.auditOpinionsToAuditOpinionsFrontEnd(auditOpinions);
		this.originalAuditOpinionsFrontEnd = this.$global.deepCopyData(this.auditOpinionsFrontEnd);
		// console.log('this.originalAuditOpinionsFrontEnd', this.originalAuditOpinionsFrontEnd);
	}

	// 整理負責部門資料成 tree-select 格式
	convertUnitToTreeSelect(unitList: SearchResponsibleDepartmentDto) {
		const validList = unitList.checkedUnits.concat(unitList.otherUnits);
		return [
			{
				title: '全部',
				value: 'all',
				key: 'all',
				children: validList.map((e) => ({
					title: e.value + e.label,
					value: e.value,
					key: e.value,
				})),
			},
			{
				title: '無效單位',
				value: 'invalid',
				key: 'invalid',
				children: unitList.invalidUnits.map((e) => ({
					title: e.value + e.label,
					value: e.value,
					key: e.value,
				})),
			},
		];
	}

	// ----------------------------------- 查核內容 event -----------------------------------
	openDraftQAModal() {
		this.QAModal = {
			type: 'draft',
			visible: true,
			auditOpinion: null,
			auditDraftContent: this.auditDraftContent,
		};
	}

	// ----------------------------------- 查核意見 event -----------------------------------
	// 檢核是否所有的AuditOpinion都有通過欄位驗證檢核
	async vaildateAllAuditOpinion(): Promise<boolean> {
		// console.log('驗證');
		this.setLoading(true);
		const prmiseArr = [];
		const auditOpinionArr = this.$refs.auditOpinion as any;
		let isValid = true;
		if ((auditOpinionArr && auditOpinionArr.length > 0)) {
			(this.$refs.auditOpinion as any).forEach((element) => {
				prmiseArr.push(element.validateForm());
			});
			await Promise.all(prmiseArr)
				.then((resp) => {
					isValid = resp.find((e) => e === false) === undefined;
					if (!isValid) {
						const getErrorEle = this.$el.querySelector('.has-error');
						// console.log('getErrorEle', getErrorEle);
						if (getErrorEle) {
							getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
						}
						this.setLoading(false);
					} else {
						this.setLoading(false);
					}
				})
				.catch(() => {
					isValid = false;
					this.setLoading(false);
				});
		} else {
			this.setLoading(false);
			isValid = true;
		}
		return isValid;
	}

	// 暫存驗證＋整理request資料
	async saveHandler() {
		this.setLoading(true);
		let saveRequset: SaveAuditOpinionTmpRequest = null;
		await this.forceNextTick(async () => {
			// console.log('this.vaildateAllAuditOpinion()', this.vaildateAllAuditOpinion());
			if (await this.vaildateAllAuditOpinion()) {
				this.setAuditOpinionSequence(this.auditOpinionsFrontEnd);
				saveRequset = {
					auditDraftContentId: this.auditDraftContent.auditDraftContentId,
					opinion: this.auditDraftContent.opinion,
					auditOpinions: this.auditOpinionsFrontEndToSaveAuditOpinions(this.auditOpinionsFrontEnd),
				};
				// console.log('saveRequset', saveRequset);
				this.saveAuditOpinion(saveRequset);
			} else {
			}
		});
		this.setLoading(false);
	}

	// 新增一個主項
	addAuditOpinion(auditOpinionArr: AuditOpinionFrontEndDto[]) {
		const auditOpinion: AuditOpinionFrontEndDto = {
			auditOpinionId: `add${uuid.v4()}`,
			canModifyFlag: true,
			canQaFlag: null,
			redCheckStatusFlag: null,
			redQaStatusFlag: null,
			auditors: [{ key: this.currentUser.employee.domainId, value: this.currentUser.employee.name }], // 加上當前查核人員
			itemType: 'MAIN',
			subRelMainId: null,
			seq: auditOpinionArr?.length + 1,
			content: null,
			auditOpinionUnits: [],
			suggestion: null,
			opinionSummary: null,
			riskLevel: 'null',
			improveDeadline: null,
			improve: null,
			improveDate: null,
			imporveOption: 'null',
			improveSituation: null,
			subAuditOpinions: [],
			modify: true,
		};
		auditOpinionArr.push(auditOpinion);
	}

	// 刪除查核意見主項
	removeMainAuditOpinion(auditOpinionId: string) {
		const index = this.auditOpinionsFrontEnd.findIndex((auditOpinion) => auditOpinion.auditOpinionId === auditOpinionId);
		this.auditOpinionsFrontEnd.splice(index, 1);
	}

	// 暫存前，重新排列主項與子項的seq
	setAuditOpinionSequence(auditOpinionArr: AuditOpinionDto[]) {
		auditOpinionArr.forEach((auditOpinion, index) => {
			auditOpinion.seq = index + 1;
			if (auditOpinion.subAuditOpinions?.length > 0) {
				this.setAuditOpinionSequence(auditOpinion.subAuditOpinions);
			}
		});
	}

	// 取得當前查核意見（主項或子項）
	getSingleAuditOpinion(opinionData: AuditOpinionFrontEndDto): AuditOpinionFrontEndDto | null{
		if (opinionData) {
			if (opinionData.itemType === 'MAIN') {
				return this.auditOpinionsFrontEnd.find((opinion) => opinion.auditOpinionId === opinionData.auditOpinionId);
			}
			if (opinionData.itemType === 'SUB') {
				return this.auditOpinionsFrontEnd.find((opinion) => opinion.auditOpinionId === opinionData.subRelMainId).subAuditOpinions.find((subOpinion) => subOpinion.auditOpinionId === opinionData.auditOpinionId);
			}
			return null;
		}
		return null;
	}

	// 更新查核
	async updateAuditOpinion(auditOpinionId: string, subRelMainId?: string) {
		const databaseOpinionData: AuditOpinionDto[] = await this.getAuditOpinion(this.auditDraftContent.auditDraftContentId);
		if (!databaseOpinionData || databaseOpinionData.length === 0) return;
		let mainNewData: AuditOpinionDto = null;
		let mainIndex: number = null;
		let updateAuditOpinion: AuditOpinionDto = null;
		if (subRelMainId) {
			mainNewData = databaseOpinionData.find((opinion) => opinion.auditOpinionId === subRelMainId);
			mainIndex = this.auditOpinionsFrontEnd.findIndex((mainOpinion) => mainOpinion.auditOpinionId == subRelMainId);
			const subNewDate = mainNewData.subAuditOpinions.find((subOpinion) => subOpinion.auditOpinionId === auditOpinionId);
			const subIndex = this.auditOpinionsFrontEnd[mainIndex].subAuditOpinions.findIndex((subOpinion) => subOpinion.auditOpinionId == auditOpinionId);
			updateAuditOpinion = this.$global.deepCopyData(this.auditOpinionsFrontEnd[mainIndex]);
			updateAuditOpinion.subAuditOpinions[subIndex] = {
				...updateAuditOpinion.subAuditOpinions[subIndex],
				canQaFlag: subNewDate.canQaFlag,
				canModifyFlag: subNewDate.canModifyFlag,
				redCheckStatusFlag: subNewDate.redCheckStatusFlag,
				redQaStatusFlag: subNewDate.redQaStatusFlag,
			};
		} else {
			mainNewData = databaseOpinionData.find((opinion) => opinion.auditOpinionId === auditOpinionId);
			mainIndex = this.auditOpinionsFrontEnd.findIndex((mainOpinion) => mainOpinion.auditOpinionId == auditOpinionId);
			updateAuditOpinion = this.$global.deepCopyData(this.auditOpinionsFrontEnd[mainIndex]);
			updateAuditOpinion = {
				...updateAuditOpinion,
				canQaFlag: mainNewData.canQaFlag,
				canModifyFlag: mainNewData.canModifyFlag,
				redCheckStatusFlag: mainNewData.redCheckStatusFlag,
				redQaStatusFlag: mainNewData.redQaStatusFlag,
			};
		}
		// console.log('更新後資料', updateAuditOpinion);

		Vue.set(this.auditOpinionsFrontEnd, mainIndex, updateAuditOpinion);
	}

	// ----------------------------------- 查核意見 emit -----------------------------------
	// 點擊查核意見QA按鈕
	openOpinionQAModal(QAModalPaload) {
		// console.log('開啟QA彈窗');
		this.QAModal = {
			type: 'opinion',
			visible: true,
			auditDraftContent: null,
			auditOpinion: this.getSingleAuditOpinion(QAModalPaload.auditOpinion),
		};
	}

	updateOpinion({ auditOpinionId, subRelMainId }) {
		this.updateAuditOpinion(auditOpinionId, subRelMainId);
	}

	// 重新更新查核意見(主項 or 子項)
	// async updateAuditOpinion(updateAuditOpinion: UpdateAuditOpinion) {
	// 	const newAuditOpinion: AuditOpinionFrontEndDto[] = this.auditOpinionsToAuditOpinionsFrontEnd(await this.getAuditOpinion(this.auditDraftContent.auditDraftContentId));
	// 	if (updateAuditOpinion.type === 'MAIN') {
	// 		const opinionIndex = this.auditOpinionsFrontEnd.findIndex((opinion) => opinion.auditOpinionId === updateAuditOpinion.auditOpinionId);
	// 		const newMainOpinion = newAuditOpinion.find((opinion, index) => opinion.auditOpinionId === updateAuditOpinion.auditOpinionId);
	// 		// delete newMainOpinion.subAuditOpinions;
	// 		Vue.set(this.auditOpinionsFrontEnd, opinionIndex, newMainOpinion);
	// 	}
	// 	if (updateAuditOpinion.type === 'SUB') {
	// 		let mainOpinionIndex;
	// 		const mainOpinion = this.auditOpinionsFrontEnd.find((opinion, index) => {
	// 			if (opinion.auditOpinionId === updateAuditOpinion.subRelMainId) {
	// 				mainOpinionIndex = index;
	// 				return true;
	// 			}
	// 			return false;
	// 		});
	// 		debugger;
	// 		const subOpinionIndex = mainOpinion.subAuditOpinions.findIndex((opinion) => opinion.auditOpinionId === updateAuditOpinion.auditOpinionId);
	// 		const newSubOpinion = newAuditOpinion.find((opinion, index) => opinion.auditOpinionId === updateAuditOpinion.subRelMainId).subAuditOpinions.find((opinion, index) => opinion.auditOpinionId === updateAuditOpinion.auditOpinionId);
	// 		if (newSubOpinion) {
	// 			Vue.set(this.auditOpinionsFrontEnd[mainOpinionIndex].subAuditOpinions, subOpinionIndex, newSubOpinion);
	// 		}
	// 	}
	// }

	/**
* forceNextTick 強制先更新畫面，再往下執行
*/
	doubleRequestAnimationFrame(callback) {
		requestAnimationFrame(() => {
			requestAnimationFrame(callback);
		});
	}

	forceNextTick(callback) {
		if (callback && typeof callback === 'function') {
			this.doubleRequestAnimationFrame(callback);
		} else {
			return new Promise((resolve) => {
				this.doubleRequestAnimationFrame(resolve);
			});
		}
	}
}
</script>

<style lang="scss" scoped>
  .content__label{
    font-size: 14px;
  }
  .label--large{
		font-size: 18px;
	}
	.textarea__control__btn {
		border: 0;
		padding: 0;
		width: 27px;
		height: 27px;
		display: block;
		margin: 3px auto;
		background-color: transparent;
	}
  .content__action{
    width: 102px;
  }
	.block{
		border: 1px solid #d9d9d9;
    border-radius: 4px;
		padding: 4px 11px;
	}

	.block--scroll{
		max-height: 120px;
		overflow-y: auto;
	}

</style>
