<template>
  <div class="main-contain crawlerindex-container container">
    <a-form-model
      ref="formRef"
      class="row flex-grow-1"
      :hide-required-mark="true"
    >
      <div class="d-flex align-items-center">
        <section class="auditItem__titleWrap me-4">
          <span class="auditItem__title">查核項目：</span>
          <span>{{ auditItemTitle }}</span>
        </section>
        <div class="col-6 col-lg-auto d-flex align-items-center">
          <div class="d-flex align-items-center w-auto">
            <a-form-model-item class="mb-0">
              <a-checkbox
                v-model="submitForm.toDo"
                :disabled="todoDisabled"
                @change="todoChange"
              >
                待辦
              </a-checkbox>
            </a-form-model-item>
          </div>
          <div class="d-flex align-items-center w-auto ms-4">
            <a-form-model-item class="mb-0">
              <a-checkbox
                v-model="submitForm.hasOpinion"
              >
                有查核意見
              </a-checkbox>
            </a-form-model-item>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center flex-wrap mt-3">
        <div class="col-12 col-lg-5">
          <a-form-model-item class="mb-0">
            <div class="d-flex align-items-center">
              <div class="search-form__label">
                Section：
              </div>
              <a-select
                v-model="submitForm.auditDraftSectionId"
                class="col section__selectWidth"
                placeholder="請選擇Section"
                :options="selectorOption.section"
              />
            </div>
          </a-form-model-item>
        </div>
        <div
          v-if="sectionAuditors.length > 0"
          class="col ms-lg-3 mt-3 mt-lg-0"
        >
          <span class="search-form__label">Section查核人員：</span>
          <span>{{ sectionAuditors.join('、') }}</span>
        </div>
      </div>
      <div class="d-flex align-items-center mt-3">
        <div class="col">
          <a-form-model-item class="mb-0">
            <div class="d-flex align-items-start">
              <div class="search-form__label">
                無意見綜合評述：
              </div>
              <a-textarea
                v-model="noOpionComment.value"
                class="col"
                :auto-size="{ minRows: 4 }"
                :disabled="!submitForm.auditDraftSectionId || !noOpionComment.editStatus"
              />
              <div class="noOpionComment__btnGroup d-flex flex-column justify-content-center">
                <template v-if="submitForm.auditDraftSectionId">
                  <!-- <CustomPopConfirm
									:title="'確認復原'"
									@confirm="onRecoveryAuditItem(slotData.data)"
								> -->
                  <button
                    v-if="!noOpionComment.editStatus"
                    class="btn--action py-2"
                    @click="onEditComment"
                  >
                    編輯
                  </button>
                  <template v-else>
                    <button
                      class="btn--action py-2"
                      @click="onSaveComment"
                    >
                      儲存
                    </button>
                    <button
                      class="btn--action py-2"
                      @click="onCancelComment"
                    >
                      取消
                    </button>
                  </template>
                <!-- </CustomPopConfirm> -->
                </template>
              </div>
            </div>
          </a-form-model-item>
        </div>
      </div>
    </a-form-model>
    <!-- title bar-->
    <div class="search-header d-flex flex-wrap align-items-center">
      <div class="titleBar d-flex">
        <div class="search-header__title">
          查核內容
        </div>
      </div>
      <div class="btnGroup ms-auto">
        <ActionBar
          :audit-opinion-status="auditOpinionStatus"
          :check-man="checkMan"
          :communicate-type="communicateType"
          :show-button-status="showButtonStatus"
          :audit-draft-section-id="submitForm.auditDraftSectionId"
          :sort-data-num="sortDataNum"
          :role="currentRole.id"
          @click="emitClick"
        />
      </div>
    </div>
    <fbl-data-grid
      class="preparation-table"
      :row-key="grid.rowKey"
      :columns="grid.columns"
      :data="grid.data"
      :pagination="grid.pagination"
      :scroll="{ x: true }"
      :row-selection="rowSelection"
      @inspectClick="workContent"
    >
      <template v-slot:seq="slotData">
        <span :class="{'rowNo__deleteStyle' : slotData.data.status.keyId == '90'}">{{ slotData.data.seq }}</span>
      </template>
      <template v-slot:actions="slotData">
        <CustomPopConfirm
          v-if="slotData.data.showDeleteButton === 'Y'"
          @confirm="onRemoveSelectAuditItem(slotData.data)"
        >
          <i class="btn__icon--delete-action" />
        </CustomPopConfirm>
        <CustomPopConfirm
          v-else-if="slotData.data.showDeleteButton === 'N'"
          :title="'確認復原'"
          @confirm="onRecoveryAuditItem(slotData.data)"
        >
          <button class="btn--action py-2">
            復原
          </button>
        </CustomPopConfirm>
      </template>
    </fbl-data-grid>
    <!-- (彈窗) 上傳 -->
    <UpLoadModal
      :visible.sync="upLoadModal.visible"
      :audit-draft-id="submitForm.auditDraftId"
      @setModal="resultModal"
    />
    <!-- (彈窗) 序號排序 -->
    <AuditingSortModal
      :visible.sync="auditingSortModal.visible"
      :slot-data="grid.data"
      @updateData="getApi_auditItemList"
    />
    <!-- (彈窗) 新增查核 -->
    <AddAuditModal
      :visible.sync="addAuditModal.visible"
      :audit-draft-section-id="submitForm.auditDraftSectionId"
      @updateData="getApi_auditItemList"
    />
    <!-- (彈窗) 副總稽核 -->
    <SendOfficeBossViceModal
      :visible.sync="sendOfficeBossViceModal.visible"
      @updateData="onReview"
    />
    <!-- (彈窗) 匯出總表 -->
    <ExportModal
      :visible.sync="exportModal.visible"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import ActionBar from '@/components/auditing/auditingDetail/ActionBar.vue';

// import AddInsidePlan from '@/components/preparation/preparationIndex/AddInsidePlan.vue';
import { Getter, Action, namespace } from 'vuex-class';
import {
	RoleDto,
} from '@fubonlife/iams-api-axios-sdk';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import moment from 'moment';
import AuditingSortModal from '@components/auditing/auditingDetail/AuditingSortModal.vue';
import AddAuditModal from '@components/auditing/auditingDetail/AddAuditModal.vue';
import SendOfficeBossViceModal from '@components/auditing/auditingDetail/SendOfficeBossViceModal.vue';
import UpLoadModal from '@components/auditing/auditingDetail/UploadModal.vue';
import ExportModal from '@components/auditing/auditingDetail/ExportModal.vue';
import {
	auditingDetailSearchForm,
} from './models';

const modalModule = namespace('modalControl');

@Component({
	components: {
		IconTextButton,
		ActionBar,
		FblDataGrid,
		// AddInsidePlan,
		CustomPopConfirm,
		AuditingSortModal,
		AddAuditModal,
		SendOfficeBossViceModal,
		UpLoadModal,
		ExportModal,
	},
})
export default class PreparationIndex extends Vue {
	@Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

	@modalModule.Getter('getResultModal') getResultModal;

	@Getter getWindowSize!: string;

	// 時間format格式
  formatter = this.$twDateFormatter;

	yearFormatter = this.$twYearFormatter;

  isLoading: boolean = false;

	currentRole: RoleDto = null;

	auditingDetailData = {};

	get todoDisabled() {
		return ['ROLE_Audit_Office_Boss'].includes(this.$global.getCurrentRoleId());
	}

	// 產生Section下拉
	get selectSection() {
		return this.selectorOption.section.find((i) => i.value === this.submitForm.auditDraftSectionId);
	}

	// Section查核人員
	get checkMan() {
		return this.selectSection && ('checkMan' in this.selectSection) ? this.selectSection.checkMan : [];
	}

	// 選擇的section 查核人員
	get sectionAuditors() {
  	return this.selectSection && ('checkMan' in this.selectSection) ? this.selectSection.checkMan.map((i) => i.name) : [];
	}

	get sortDataNum() {
		return this.grid.data.length;
	}

	get auditOpinionStatus() {
		// 查核內容 狀態
		return this.$global.getQuery().status.keyId;
	}

	auditItemTitle = '保費帳務處理作業';

	// 溝通階段
	communicateType = 'A';

	// 下拉選項
	selectorOption = {
		section: [],		// section
	}

	noOpionComment = {
		cache: '',
		value: '',
		isEdit: false,
		editStatus: true,
	}

	// 查詢輸入框
	submitForm: auditingDetailSearchForm = {
		toDo: false,
		hasOpinion: false,
		auditDraftSectionId: undefined,
		auditDraftId: '',
		quarterPlanMId: '',
	}

	// ActionBar 按鈕 卡控資料
	showButtonStatus = {
		auditFinishButton: false,		// 查核結束按鈕
		commnuicateEndButton: false,		// 溝通結束按鈕
		commnuicateStartButton: false,		// 溝通啟動按鈕
		reportFinishButton: false,		// 稽核報告審閱完畢按鈕
		reviewButton: false,		// 審畢按鈕
		submitButton: false,		// 送出按鈕
		// addButton: false,	// 新增查核按鈕
	}

	// 領隊資料
	inCharge = {};

	// 查核欄位檢核
	// rules = {
	// 	year: [{ required: true, message: '請選擇年度', trigger: 'change' }],
	// 	month: [{ required: true, message: '請選擇月份', trigger: 'change' }],
	// }

	// FblPDataGridHolder<>
  grid = {
  	rowKey: 'auditDraftContentId',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'seq',
  			title: '序號',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'content',
  			inspect: true,
  			title: '查核內容',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'opinion',
  			title: '查核意見',
  			formatter: (data) => data.opinion.valueName,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'status',
  			title: '查核狀態',
  			formatter: (data) => data.status.valueName,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'actions',
  			width: '130px',
  			title: '刪除',
  		},
  	],
  };

  // 查核內容排序 彈窗
  upLoadModal = {
  	visible: false, // -> syncedVisible
  };

  // 查核內容排序 彈窗
  auditingSortModal = {
  	visible: false, // -> syncedVisible
  };

  // 新增查核 彈窗
  addAuditModal = {
  	visible: false, // -> syncedVisible
  };

  // 副總稽核 彈窗
  sendOfficeBossViceModal = {
  	visible: false, // -> syncedVisible
  	auditDraftContentIds: [],
  };

  // 匯出總表 彈窗
  exportModal = {
  	visible: false, // -> syncedVisible
  };

  // table 勾選項目 props
  rowSelection = {
  	onChange: this.rowSelectionChange,
  	selectedRowKeys: [],
  	getCheckboxProps: this.getCheckboxProps,
  }

  // 監聽 Section 應該刷新
  get changeSection() {
  	return {
  		toDo: this.submitForm.toDo,
  		hasOpinion: this.submitForm.hasOpinion,
  	};
  }

  // table 勾選事件
  rowSelectionChange(selectedRowKeys, selectedRows) {
  	this.rowSelection.selectedRowKeys = selectedRowKeys;
  	// console.log('selectedRows', selectedRows);
  }

  // 設定表格 checkbox disabled
  getCheckboxProps(record) {
  	return {
  		props: { disabled: record.showCheckboxEnabled === false },
  	};
  }

  // API: action開啟彈窗
  emitClick(item) {
   	switch (item) {
  	case 'upload':
  		// console.log('上傳資料');
  		this.upLoadModal.visible = true;
  		break;
  	case 'commnuicateStart':
  		this.getApi_commnuicateStart();
  		break;
  	case 'commnuicateEnd':
  		this.getApi_commnuicateEnd();
  		break;
  	case 'reportFinish':
  		this.getApi_reportFinish();
  		break;
  	case 'auditFinishButton':
  		this.getApi_auditFinish();
  		break;
  	case 'add':
  		this.addAuditModal.visible = true;
  		break;
  	case 'sort':
  		this.auditingSortModal.visible = true;
  		break;
  	case 'submit':
  		this.onSubmit(this.rowSelection.selectedRowKeys);
  		break;
  	case 'review':
  		this.sendOfficeBossViceModal.auditDraftContentIds = this.rowSelection.selectedRowKeys;
  		// 是否要彈出 選擇 副總稽核 彈窗
  		if (this.selectSection.viceCheck === null) {
  			this.sendOfficeBossViceModal.visible = true;
  		} else {
  			// 以原始viceCheck 傳送
  			this.onReview(this.selectSection.viceCheck);
  		}
  		break;
  	case 'export':
  		this.exportModal.visible = true;
  		break;
  	case 'back':
  		this.$router.go(-1);
  		break;
  	}
  }

  // 初始化搜尋條件
  initSearchForm() {
  	this.submitForm.toDo = false;
  	this.submitForm.hasOpinion = false;
  	this.submitForm.auditDraftSectionId = undefined;
  	this.submitForm.auditDraftId = '';
  	this.submitForm.quarterPlanMId = '';
  }

  // 取得 Query 並帶入資料
  setParam() {
  	const $query = this.$global.getQuery();
  	const $cacheData = $query.cacheData;
  	if ($query) {
  		this.submitForm.toDo = $cacheData.toDo;
  		this.submitForm.hasOpinion = $cacheData.hasOpinion;

  		this.submitForm.auditDraftId = $cacheData.auditDraftId;
  		this.submitForm.quarterPlanMId = $cacheData.quarterPlanMId;
  		this.inCharge = $query.inCharge;
  		this.auditItemTitle = $query.auditItemName;
  	}
  }

  resultModal(value) {
  	this.setModalState({
  		resultModal: {
  			...value,
  		  visible: true,
  		},
  	});
  }

  /**
	 * API
	 */
  // API: 取得 Section 下拉選項
  async getApi_section() {
  	this.setLoading(true);
  	const submitData = {
  		toDo: this.submitForm.toDo,
  		hasOpinion: this.submitForm.hasOpinion,
  		auditDraftId: this.submitForm.auditDraftId,
  		quarterPlanMId: this.submitForm.quarterPlanMId,
  	};
  	await this.$workPaperApi.searchAuditDraftSectionDataInWorkPaperUsingPOST(submitData)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.selectorOption.section = getData.sectionResponseVos.map((i) => ({
  				label: `${this.$enum.intNumToCh(i.seq)}、${i.auditDraftSectionName}`,
  				value: i.auditDraftSectionId,
  				checkMan: i.checkMan,
  				noOptionComment: i.noOptionComment,
  				viceCheck: i.isViceCheck,
  			}));
  			if (this.$global.getQuery().cacheData.auditDraftSectionId && this.selectorOption.section.map((i) => i.value).includes(this.$global.getQuery().cacheData.auditDraftSectionId)) {
  				this.submitForm.auditDraftSectionId = this.$global.getQuery().cacheData.auditDraftSectionId;
  			} else if (this.selectorOption.section.length > 0) {
  				this.submitForm.auditDraftSectionId = this.selectorOption.section[0].value;
  			} else {
  				this.submitForm.auditDraftSectionId = undefined;
  			}
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // API: 查詢 查核內容
  getApi_auditItemList() {
  	this.setLoading(true);
  	this.grid.data = [];
  	this.rowSelection.selectedRowKeys = [];
  	this.$workPaperApi.searchAuditDraftContentInWorkPaperUsingPOST(this.submitForm)
  		.then((resp) => {
  			const getData = resp.data.result;
  			if (getData) {
  				this.grid.data = getData.contentResponseVos;
  				this.showButtonStatus.auditFinishButton = getData.showAuditFinishButton;
  				this.showButtonStatus.commnuicateEndButton = getData.showCommnuicateEndButton;
  				this.showButtonStatus.commnuicateStartButton = getData.showCommnuicateStartButton;
  				this.showButtonStatus.reportFinishButton = getData.showReportFinishButton;
  				this.showButtonStatus.reviewButton = getData.showReviewButton;
  				this.showButtonStatus.submitButton = getData.showSubmitButton;
  			}
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 更新Section無意見綜合評述
  getApi_updateComment() {
  	this.setLoading(true);
  	const submit = {
  		auditDraftSectionId: this.submitForm.auditDraftSectionId,
  		noOpinionComment: this.noOpionComment.value,
  	};
  	this.$workPaperApi.setSectionOpinionUsingPOST(submit)
  		.then((resp) => {
  			// 刷新
  			this.getApi_section();
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '刪除失敗',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  	this.noOpionComment.cache = this.noOpionComment.value;
  }

  // API: 刪除 查核內容
  onRemoveSelectAuditItem(slotData) {
  	this.setLoading(true);
  	this.$workPaperApi.deleteAudifDraftContentUsingPOST(slotData.auditDraftContentId)
  		.then((resp) => {
  			const getData = resp.data.result;
  			// console.log(getData);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '刪除成功',
  					autoClose: 3,
  				},
  			});
  			// 刷新
  			this.getApi_auditItemList();
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '刪除失敗',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // API: 復原 查核內容
  onRecoveryAuditItem(slotData) {
  	this.setLoading(true);
  	this.$workPaperApi.recoveryAudifDraftContentUsingPOST(slotData.auditDraftContentId)
  		.then((resp) => {
  			const getData = resp.data.result;
  			// console.log(getData);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '復原成功',
  					autoClose: 3,
  				},
  			});
  			// 刷新
  			this.getApi_auditItemList();
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '復原失敗',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // API: 送出覆核
  onSubmit(auditDraftContentIds) {
  	if (auditDraftContentIds.length) {
  		this.setLoading(true);
  		this.$workPaperApi.reviewAuditDraftUsingPOST(auditDraftContentIds)
  			.then((resp) => {
  				const getData = resp.data.result;
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'success',
  						title: '覆核成功',
  						autoClose: 3,
  					},
  				});
  				// 刷新
  				this.getApi_auditItemList();
  			})
  			.catch(() => {
  				console.error();
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: '覆核失敗',
  					},
  				});
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	} else {
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'error',
  				title: '覆核失敗，請先勾選查核內容',
  			},
  		});
  	}
  }

  // API: 審畢
  onReview(isViceCheck) {
  	if (this.sendOfficeBossViceModal.auditDraftContentIds.length) {
  		this.setLoading(true);
  		this.$workPaperApi.reviewEndsAuditDraftUsingPOST(this.sendOfficeBossViceModal.auditDraftContentIds, isViceCheck)
  			.then((resp) => {
  				const getData = resp.data.result;
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'success',
  						title: '審畢成功',
  						autoClose: 3,
  					},
  				});
  				// 刷新
  				this.getApi_auditItemList();
  			})
  			.catch(() => {
  				console.error();
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: '審畢失敗',
  					},
  				});
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	} else {
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'error',
  				title: '審畢失敗，請先勾選查核內容',
  			},
  		});
  	}
  }

  // API: 溝通啟動
  getApi_commnuicateStart() {
  	// console.log('溝通啟動');
  	this.setLoading(true);
  	this.$workPaperApi.communicateStartUsingPOST(this.submitForm.auditDraftId)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '溝通啟動成功',
  					autoClose: 3,
  				},
  			});
  			// 刷新
  			this.getApi_auditItemList();
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '溝通啟動失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 溝通結束
  getApi_commnuicateEnd() {
  	// console.log('溝通結束');
  	this.setLoading(true);
  	this.$workPaperApi.communicateEndUsingPOST(this.submitForm.auditDraftId)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '溝通結束成功',
  					autoClose: 3,
  				},
  			});
  			// 刷新
  			this.getApi_auditItemList();
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '溝通結束失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 稽核報告審閱完畢結束
  getApi_reportFinish() {
  	// console.log('稽核報告審閱完畢');
  	this.setLoading(true);
  	this.$workPaperApi.reviewCompletedUsingPOST(this.submitForm.auditDraftId)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '稽核報告審閱完畢結束成功',
  					autoClose: 3,
  				},
  			});
  			// 刷新
  			this.getApi_auditItemList();
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '稽核報告審閱完畢結束失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查核結束
  getApi_auditFinish() {
  	// console.log('查核結束');
  	this.setLoading(true);
  	this.$workPaperApi.auditEndUsingPOST(this.submitForm.auditDraftId)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '查核結束成功',
  					autoClose: 3,
  				},
  			});
  			// 刷新
  			this.getApi_auditItemList();
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '查核結束失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
	 * Event
	 */
  // 待辦切換
  todoChange() {
  	// 檢核 重置
  	(this.$refs.formRef as any).clearValidate();
  }

  // 前往 查核內容 明細
  workContent(slotData) {
  	// 紀錄 cache 查詢資料，用於回頭做查詢
  	this.$global.addParam({
  		toRouter: 'AuditingDetail',
  		query: {
  			...this.$global.getQuery(),
  			cacheData: {
  				toDo: this.submitForm.toDo,
  				hasOpinion: this.submitForm.hasOpinion,
  				auditDraftId: this.submitForm.auditDraftId,
  				quarterPlanMId: this.submitForm.quarterPlanMId,
  				auditDraftSectionId: this.submitForm.auditDraftSectionId,
  			},
  		},
  	});
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'AuditingContent',
  		query: {
  			...slotData.data,
  			ckEndDate: this.$global.getQuery().ckEndDate,
  			checkMan: this.selectorOption.section.find((i) => i.value === this.submitForm.auditDraftSectionId).checkMan,
  			inCharge: this.inCharge,
  		},
  	});
  }

  onEditComment() {
  	this.noOpionComment.editStatus = true;
  }

  onSaveComment() {
  	this.getApi_updateComment();
  	this.noOpionComment.editStatus = false;
  }

  onCancelComment() {
  	this.noOpionComment.editStatus = false;
  	this.noOpionComment.value = this.noOpionComment.cache;
  }

  /**
	 * Hook
	 */
  created() {
  	this.currentRole = this.$global.getCurrentRole();
  }

  async mounted() {
  	// 取得 下拉選單
  	await this.setParam();	// 取得 query
  	await this.getApi_section(); // section

  	// TEST:
  	// this.upLoadModal.visible = true;
  }

  destroyed() {
  	this.initSearchForm();
  }

  /**
	 * 監聽
	 */
	@Watch('submitForm', { deep: true })
  watchSearchFormSection(nV) {
  	this.$nextTick(() => {
  		if (nV.auditDraftSectionId && this.selectorOption.section.length > 0) {
  			this.noOpionComment.value = this.selectSection.noOptionComment;
  			this.noOpionComment.cache = this.selectSection.noOptionComment;
  			this.noOpionComment.editStatus = false;
  			this.getApi_auditItemList();
  		}
  	});
  }

	@Watch('changeSection', { deep: true })
	watchChangeSection(nV) {
  	this.getApi_section();
	}
}
</script>

<style lang="scss" scoped>
.auditItem__titleWrap {
	> span {
		font-size: 18px;
	}
}
.auditItem__title {
	font-weight: bold;
}
.search-header {
	padding: 10px 0 0;
}

.titleBar {
	padding-top: 15px;
	padding-bottom: 10px;
}

.search-form__label {
	line-height: 1.5;
	width: 65px;
	margin-right: 10px;
}

.noOpionComment__btnGroup {
	width: 80px;
	margin-left: 20px;
	.btn--action {
		padding: 7px;
		+.btn--action {
			margin-top: 15px;
		}
	}
}

.search-header__title {
  font-size: 18px;
  font-weight: bold;
  color: $FONT-NORMAL;
	align-self: center;
}

// 刪除的序號樣式
.rowNo__deleteStyle {
	color: $COLOR-MAIN16;
	text-decoration: line-through;
}

.section__selectWidth {
	max-width: calc(100% - 65px);
}
</style>
