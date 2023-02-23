<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap-result">
        <h2 class="query__title">
          <span v-if="searchOption === 'history'">歷史線上異動資料查詢結果</span>
          <span v-else>今日線上異動資料查詢結果</span>
          <span class="query__total">共 {{ grid.pagination.total }}筆</span>
          <div class="clearfix" />
        </h2>
        <div class="query__table-wrap">
          <div class="query__search-wrap">
            <a
              class="icon__btn"
              href="#"
              @click="downloadList"
            >
              <img
                src="@/assets/button_download.svg"
                alt=""
              >
            </a>
          </div>
          <div class="clearfix" />
        </div>
        <fbl-data-grid
          class="query__table"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :custom-row="grid.customRow"
          :scroll="{ x: true }"
          @tableChange="onPageChange($event)"
        >
          <template
            slot="action"
            slot-scope="data"
          >
            <div class="d-flex">
              <div
                v-if="searchOption === 'today'"
                class="flex-center table__btn table__btn--edit"
                :class="{'table__btn--disabled': (data.data.status !== '1' && data.data.status !== '2') || data.data.appTypeNo === '7'}"
                @click="onEdit(data.data)"
              >
                <img
                  :src="(data.data.status !== '1' && data.data.status !== '2' ) || data.data.appTypeNo === '7' ? require(`@/assets/button_edit_gray.svg`) : require(`@/assets/button_edit.svg`)"
                  alt=""
                >
              </div>
              <div
                v-if="searchOption === 'today'"
                class="flex-center table__btn table__btn--delete"
                :class="{'table__btn--disabled': !(data.data.status == '1' || data.data.status == '2')}"
                @click="(data.data.status == '1' || data.data.status == '2') && onDeleteData(data.data)"
              >
                <img
                  :src="!(data.data.status == '1' || data.data.status == '2') ? require(`@/assets/button_delet_gray.svg`) : require(`@/assets/button_delet.svg`)"
                  alt=""
                >
              </div>
              <img
                class="table__btn--single"
                src="@/assets/image_nextPage.svg"
                alt=""
                @click="toDetail(data.data)"
              >
            </div>
          </template>
        </fbl-data-grid>
        <div
          v-if="searchOption === 'history'"
          class="col-12 pt-5"
        >
          <div class="block__btns text-center">
            <button
              class="btn__radius--primary--outline"
              @click="back"
            >
              上一步
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Modal } from 'ant-design-vue';
import { Action } from 'vuex-class';
import {
 	GiissInschgMasterHistoryQueryDto,
	GiissInschgMasterFindDto,
	PolicyWithAppTimeModel,
	UserInfoDto,
	TodayTransactionToExcelModel,
	HistoryTransactionQueryModel,
	HistoryTransactionToExcelModel,
	TransactionContentModel,
	PolicyModel,
	EmpFamilyPageDto,
	FGPEMPNEmployeeQueryModel,
} from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import notification from '@/plugins/info/infoNotification';

export enum statusENUM {
	unUpload = '2',
	uploaded = '4',
	delete = '5'
}

export enum searchErrorCode {
  ORIGINDATA_NOT_FOUND = '找無資料',
	HISTORY_TRANSACTION_IDNO_ERROR = '身分證字號錯誤',
	HISTORY_TRANSACTION_ENTER_ERROR = '輸入錯誤',
}

export enum deleteErrorCode {
  APPNO_NOT_FOUND = '找不到受理號碼',
}

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class EmployeeFamilyHistoryResultTable extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

	h = this.$createElement;

  // 當前router
  currentRouterName: string;

  //  當前登入者資料
  currentLoginData: UserInfoDto;

  // 現在要處理的為今日還是異動
  searchOption: 'today' | 'history' = 'today';

	// 搜尋關鍵字
	policyModel: PolicyModel;

  todaySearchRequest: PolicyWithAppTimeModel = {
  	poliNo: 'string',
  	poliSeq: 'string',
  };

	historySearchRequset: HistoryTransactionQueryModel;

  todayDownloadRequest: TodayTransactionToExcelModel = {
  	fileName: '今日線上異動資料查詢結果',
  	poliNo: 'string',
  	poliSeq: 'string',
  }

	historyDownloadRequest: HistoryTransactionToExcelModel;

	originData: GiissInschgMasterHistoryQueryDto[] | GiissInschgMasterFindDto[];

	routerOption = [
		{ name: '退保', router: 'EmpFamilyPolicyChangeSurrenderList', attribute: 'employee' },
		{ name: '薪資變更', router: 'EmployeeSalaryChange', attribute: 'employee' },
		{ name: '基本資料變更', router: 'EmployeeGeneralInfoChange', attribute: 'employee' },
		{ name: '基本資料變更', router: 'FamilyGeneralInfoChange', attribute: 'family' },
	];

  public grid: FblPDataGridHolder<GiissInschgMasterHistoryQueryDto | GiissInschgMasterFindDto> = {
  	rowKey: 'appNo',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['10', '25', '50'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'appType',
  			title: '作業別',
  			fixed: 'left',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'appNo',
  			title: '受理號碼',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'appTime',
  			title: '受理日期',
  			formatter: (data) => DateTimeFormmat.transformRocDate(data.appTime),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtNo',
  			title: '保險證號',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insName',
  			title: '被保險人姓名',
  			width: '150px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'idNo',
  			title: '身分證字號/居留證號碼',
  			width: '120px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insAttr',
  			title: '屬性',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'applyFor',
  			title: '申請方式',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'action',
  			title: '',
  			template: 'action',
  			fixed: 'right',
  		},
  	],
  };

	@Watch('$route.name')
  onRouteNameChanged(newVal) {
  	console.log('router name', newVal);
  	this.grid.pagination.current = 1;
  	this.checkParma();
  }

	back() {
		this.$router.push({ name: 'CO_EFHistoryQuery' });
	}

	created() {
		this.checkParma();
  	window.parseWord();
	}

	// 檢查$global.getParam再搜尋
	checkParma() {
		this.currentRouterName = this.$route.name;
		// if (this.currentRouterName === 'EmployeeFamilyHistoryResultTable') {
		// 	if (this.$global.getParam() === null) {
		// 		this.$router.push({ name: 'Index' });
		// 		return;
		// 	}
		// }
		if (this.$global.getParam() === null) {
			if (this.currentRouterName === 'EmployeeFamilyHistoryResultTable') {
				if (this.$global.getParam() === null) {
					this.$router.push({ name: 'Index' });
					return;
				}
			}
		} else if (this.$global.getParam().query.pagination) {
			this.grid.pagination = this.$global.getParam().query.pagination;
		}
		if (sessionStorage.getItem('login_state')) {
			this.policyModel = this.$userInfo.getPolicyModel();
			this.currentLoginData = JSON.parse(sessionStorage.getItem('login_state')).me;
			console.log('this.currentLoginData', this.currentLoginData);
			this.todaySearchRequest.poliNo = this.currentLoginData.policyNo;
			this.todaySearchRequest.poliSeq = this.currentLoginData.policySeq;
		}
  	this.onSearch();
	}

	// 歷史/今日異動查詢
	onSearch() {
		this.setLoading(true);
  	if (this.currentRouterName === 'EmployeeFamilyHistoryResultTable') {
			this.searchOption = 'history';
  		this.historySearchRequset = this.$global.getParam().query.queryRequest;
			this.historySearchRequset.policyModel = {
				policyNo: this.currentLoginData.policyNo,
				policySeq: this.currentLoginData.policySeq,
			};
  		this.historyDownloadRequest = JSON.parse(JSON.stringify(this.historySearchRequset));
  		this.historyDownloadRequest.fileName = '歷史線上異動資料查詢結果';
  		this.$historyTransactionQueryApi
  			.findBypolicyNoAndpolicySeqUsingPOST(
  				this.historySearchRequset,
  				this.grid.pagination.current - 1,
  				this.grid.pagination.pageSize,
				 )
  			.then((resp) => {
					if (resp.data.status === 200) {
						this.grid.pagination.total = parseInt(resp.data.data.totalElements);
						this.grid.data = resp.data.data.content;
					} else {
  					console.log(resp);
					}
  			})
  			.catch((error) => {
  				console.log(error);
  			})
				.finally(() => this.setLoading(false));
  	} else {
			this.searchOption = 'today';
  		this.$todayTransactionQueryApi
  			.findBypolicyNoAndpolicySeqUsingPOST1(
  				this.todaySearchRequest,
  				this.grid.pagination.current - 1,
					this.grid.pagination.pageSize,
  			)
  			.then((resp) => {
  				console.log(resp);
					if (resp.data.status === 200) {
						const p = { ...this.grid.pagination };
						p.total = parseInt(resp.data.data.totalElements);
						this.grid.data = resp.data.data.content;
						this.grid.pagination = p;
						this.grid.data = resp.data.data.content;
					} else {
						console.log(resp);
					}
  			})
  			.catch((error) => {
  				console.log(error);
  			})
				.finally(() => this.setLoading(false));
  	}
	}

	// 是否點選input allow-clear
	searchInputChange(e) {
  	// clear search keyword
  	if (e.type === 'click') {
  		this.grid.data = this.originData;
  	}
	}

	getTodayTWString() {
		const today = new Date();
  	const yyyy = today.getFullYear();
  	const mm = today.getMonth() + 1; // getMonth() is zero-based
  	const dd = today.getDate();
		let yearString = '';
		let monthString = '';
		let dateString = '';
  	if (yyyy - 1911 < 100) {
  		yearString = `0${yyyy - 1911}`;
  	} else {
  		yearString = `${yyyy - 1911}`;
  	}
  	if (mm - 10 < 0) {
  		monthString = `0${mm}`;
  	} else {
			monthString = `${mm}`;
		}
  	if (dd - 10 < 0) {
  		dateString = `0${dd}`;
  	} else {
			dateString = `${dd}`;
		}
  	return `${yearString}${monthString}${dateString}`; // Leading zeros for mm and dd
	}

	// 歷史/今日下載列表
	downloadList() {
		this.setLoading(true);
		if (this.grid.pagination.total < 1) {
			notification.error({
				Content: '無可下載資料',
			});
			this.setLoading(false);
		} else if (this.searchOption === 'history') {
			this.$historyTransactionQueryApi
				.downloadPolicyListUsingPOST1(this.historyDownloadRequest, { responseType: 'blob' })
				.then((resp) => {
					console.log(resp);
					if (resp.headers['content-disposition']) {
						this.$blobUtils.download(
							resp.data as Blob,
							`歷史線上異動資料查詢結果_${this.getTodayTWString()}.xlsx`,
						);
					} else {
						this.$historyTransactionQueryApi
							.downloadPolicyListUsingPOST1(this.historyDownloadRequest)
							.then((resp) => {
								const respData = JSON.stringify(resp);
								const apiErrorMsg = JSON.parse(respData).data.apiError;
								notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
							}).catch((err) => {
								console.log(err);
							}).finally();
					}
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => this.setLoading(false));
		} else {
			this.todayDownloadRequest = {
				...this.todaySearchRequest,
			};
			this.$todayTransactionQueryApi
				.downloadPolicyListUsingPOST2(this.todayDownloadRequest, { responseType: 'blob' })
				.then((resp) => {
					console.log(resp);
					if (resp.headers['content-disposition']) {
						this.$blobUtils.download(
							resp.data as Blob,
							`今日線上異動資料查詢結果_${this.getTodayTWString()}.xlsx`,
						);
					} else {
						this.$todayTransactionQueryApi
							.downloadPolicyListUsingPOST2(this.todaySearchRequest)
							.then((resp) => {
								const respData = JSON.stringify(resp);
								const apiErrorMsg = JSON.parse(respData).data.apiError;
								notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
							}).catch((err) => {
								console.log(err);
							}).finally();
					}
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => this.setLoading(false));
		}
	}

	// 刪除
	onDeleteData(data: GiissInschgMasterHistoryQueryDto | GiissInschgMasterFindDto) {
		console.log('刪除', data);
  	Modal.confirm({
  		title: this.h('div', {}, '刪除確認'),
  		content: '是否刪除該筆受理編號?',
  		okType: 'danger',
  		okText: '確定',
  		cancelText: '取消',
  		icon: () => this.h('span', { attrs: { class: 'modal__icon modal__icon--delete' } }),
  		onOk: () => {
  			// API: 刪除
				this.setLoading(true);
  			if (this.searchOption == 'history') {
					this.$historyTransactionQueryApi
						.modifyStatusUsingPOST(data.appNo)
  					.then((resp) => {
  						console.log(resp);
							if (resp.data.status === 200) {
								notification.success({
									Content: '已完成刪除',
								});
								this.onSearch();
							} else {
								notification.error({
									Content: `無法完成刪除項目:${this.$global.getApiErrorMsg(resp.data.apiError).join('')}。`,
								});
							}
  					})
  					.catch((error) => {
  						console.log(error);
  					})
						.finally(() => this.setLoading(false));
  			} else {
  				this.$todayTransactionQueryApi
  					.modifyStatusUsingPOST1(data.appNo)
  					.then((resp) => {
  						console.log(resp);
							if (resp.data.status === 200) {
								notification.success({
									Content: '已完成刪除',
								});
								this.onSearch();
							} else {
								notification.error({
									Content: `無法完成刪除項目:${this.$global.getApiErrorMsg(resp.data.apiError).join('')}。`,
								});
							}
  					})
  					.catch((error) => {
  						console.log(error);
  					})
						.finally(() => this.setLoading(false));
  			}
  		},
  	});
	}

	// 獲取員工資料
	getEmpInfo(request: FGPEMPNEmployeeQueryModel) {
		return new Promise((reslove, reject) => {
			this.$employeeFamilyEnrollmentApi.empPageByEnrollUsingPOST(request)
				.then((resp) => {
					if (resp.data.status === 200) {
						reslove(resp.data.data);
						console.log('選取要編輯的資料 員工資料', resp.data.data);
					} else {
						notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
					}
				})
				.catch((error) => {
					console.log('error status = ', error);
					reject();
				})
				.finally();
		});
	}

	// 解密眷屬身分證
	async decryptFamId(famList: EmpFamilyPageDto[]) {
		famList.map(async (e) => {
			e.input.insId = await this.$encryptionDecryption.decrypt(e.input.insId);
			return e;
		});
	}

	// 獲取員工特定眷屬資料
	async getWholeFamilyInfo(data: EmpFamilyPageDto, famInsId) {
		const inputData = {
  		crtNo: data.input.crtNo,
  		policyModel: this.$userInfo.getPolicyModel(),
  	};
		return new Promise((reslove, reject) => {
			this.$coUtilityApi.getEmpFamilyPageUsingPOST(inputData)
				.then((resp) => {
					if (resp.data.status === 200) {
						console.log(resp);
						console.log('選取要編輯的資料 眷屬資料', resp.data.data);
						resp.data.data.map(async (e) => {
							e.input.insId = await this.$encryptionDecryption.decrypt(e.input.insId);
							return e;
						});
						const fam = resp.data.data.find((e) => {
							console.log(e.input.insId);
							return e.input.insId === famInsId;
						});
						reslove(fam);
					} else {
						notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
					}
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally();
		});
	}

	// 編輯
	async onEdit(data) {
		console.log('選取要編輯的資料', data);
		if ((data.status == '1' || data.status == '2') && data.appTypeNo !== '7') {
			console.log('選取要編輯的資料', data);
			// console.log('選取要編輯的加密身分證', data.idNoEncrypt);
			this.setLoading(true);

			// 0：保險計劃加保、1：險種計劃加保
			if (data.appTypeNo === '0' || data.appTypeNo === '1') {
				const api = data.insAttr === '員工' ? '$employeeEnrollmentApi' : '$employeeFamilyEnrollmentApi';
				const apiPath = data.insAttr === '員工' ? 'empEnrollAppNoUsingPOST' : 'familyEnrollAppNoUsingPOST';
				const model = data.insAttr === '員工' ? 'EmployeeEnrollmentModel' : 'EmployeeFamilyEnrollmentModel';
				const queryData = data.insAttr === '員工' ? 'empData' : 'empFamData';
				const projectType = this.$userInfo.getProject();
				let productSelect = '';
				if (projectType === 'RC') {
					productSelect = data.appType === '保險計劃加保' ? 'InsurancePlan' : 'InsuranceItem';
				} else {
					productSelect = data.appType === '險種計劃加保' ? 'Plan' : 'InsuranceItem';
				}
				if (data.insAttr === '員工') {
					this.$employeeEnrollmentApi.empEnrollAppNoUsingPOST(data.appNo)
						.then(async (resp) => {
							console.log(resp);
							if (resp.data.status === 200) {
								const empData = resp.data.data;
								empData.appNo = data.appNo;
								const query = {
									EmployeeEnrollmentModel: empData,
									productSelect,
									isEdit: true,
								};
								const queryString = await this.$encryptionDecryption.encrypt(JSON.stringify(query));

								this.$global.changeRouterAndaddParam({
									toRouter: 'CO_EEnrollmentApplication',
									query: queryString,
								});
							} else {
								notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
							}
						})
						.catch(console.error);
				} else {
					// 保險計劃加保：眷屬
					this.$employeeFamilyEnrollmentApi.familyEnrollAppNoUsingPOST(data.appNo)
						.then(async (resp) => {
							console.log(resp);
							if (resp.data.status === 200) {
								const empFamData = resp.data.data;
								empFamData.appNo = data.appNo;

								const query = {
									EmployeeFamilyEnrollmentModel: empFamData,
									productSelect,
									isEdit: true,
								};

								const queryString = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
								this.$global.changeRouterAndaddParam({
									toRouter: 'CO_EEnrollmentApplication',
									query: queryString,
								});
							} else {
								notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
							}
						})
						.catch(console.error);
				}
			}

			// 3：基本資料變更
			if (data.appTypeNo === '3') {
				let query = null;
				let queryString = null;
				let empInfo = null;
				let empFamilyInfo = null;
				this.$employeeFamilyGeneralInfoChangeApi.empFamilyByAppNoUsingPOST(data.appNo)
					.then(async (resp) => {
						if (resp.data.status === 200) {
							if (data.insAttr !== '員工') {
								// 眷屬要用保險證號反查員工資料
								const crtNo = await this.$encryptionDecryption.decrypt(resp.data.data.beforeEmpGeneralInfoDto.crtNo);
								await this.getEmpInfo({
									policyModel: this.policyModel,
									crtNo,
								})
									.then(async (result) => {
										this.getWholeFamilyInfo(result[0], data.idNoEncrypt).then(async (familyResult) => {
											empInfo = result[0];
											empFamilyInfo = familyResult;
											query = {
												...resp.data.data,
												empInfo,
												empFamilyInfo,
												pagination: this.grid.pagination, // 返回今日異動使用
											};
											query.appNo = data.appNo;
											console.log('query', query);
											queryString = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
											// this.setLoading(false);
											this.$global.changeRouterAndaddParam({
												toRouter: data.insAttr === '員工' ? 'EmployeeGeneralInfoChange' : 'FamilyGeneralInfoChange',
												query: queryString,
											});
										});
									})
									.catch((error) => {
										console.log(error);
										this.setLoading(false);
									})
									.finally();
							} else {
								// 員工資料
								query = resp.data.data;
								query.appNo = data.appNo;
								query.pagination = this.grid.pagination;
								console.log('query', query);
								queryString = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
								// this.setLoading(false);
								this.$global.changeRouterAndaddParam({
									toRouter: data.insAttr === '員工' ? 'EmployeeGeneralInfoChange' : 'FamilyGeneralInfoChange',
									query: queryString,
								});
							}
						} else {
							notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
						}
					})
					.catch(() => {
						this.setLoading(false);
					})
					.finally(() => {
						// this.setLoading(false);
					});
			}

			// 4：薪資變更
			if (data.appTypeNo === '4') {
				this.$empFamilyPolicyChangeApi.salaryByAppNoUsingPOST(data.appNo)
					.then(async (resp) => {
						if (resp.data.status === 200) {
							const crtNo = await this.$encryptionDecryption.decrypt(resp.data.data.input.crtNo);
							const employeeData = await this.getEmpInfo({
								policyModel: this.$userInfo.getPolicyModel(),
								crtNo,
							});
							const query = {
								...resp.data.data,
								employeeData,
								pagination: this.grid.pagination,
							};
							const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
							this.$global.changeRouterAndaddParam({
								toRouter: 'EmployeeSalaryChange',
								query: encryptQuery,
							});
						} else {
							notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
						}
					})
					.catch((error) => {
						console.log('error status = ', error);
					})
					.finally(() => {
						this.setLoading(false);
					});
			}

			// 5:險種計劃變更 6: 保險計劃變更
			if (data.appTypeNo === '5' || data.appTypeNo === '6') {
				this.$coUtilityApi.getEmpPageUsingPOST({ crtNo: data.crtNo, policyModel: this.$userInfo.getPolicyModel() })
  		.then(async (resp) => {
  			if (resp.data.status === 200) {
							console.log(resp);
							if (data.insAttr !== '員工') {
								// 眷屬
								this.getWholeFamilyInfo(resp.data.data[0], data.idNoEncrypt).then(async (familyResult: any) => {
									const query = await this.$encryptionDecryption.encrypt(JSON.stringify(
										{
											empInfo: { ...resp.data.data[0], appNo: data.appNo },
											empFamilyInfo: { ...familyResult, appNo: data.appNo },
										},
									));
									this.$global.changeRouterAndaddParam({
										toRouter: 'EmployeeInsuredContentChangeApplication',
										query,
									});
								});
							} else {
								console.log(resp.data.data);
								const query = await this.$encryptionDecryption.encrypt(JSON.stringify({ ...resp.data.data[0], appNo: data.appNo }));
								this.$global.changeRouterAndaddParam({
									toRouter: 'EmployeeInsuredContentChangeApplication',
									query,
								});
							}
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
			}

			// 2: 退保
			if (data.appTypeNo === '2') {
				this.$coUtilityApi.getEmpPageUsingPOST({
					crtNo: data.crtNo,
					policyModel: this.$userInfo.getPolicyModel(),
				})
  		.then(async (resp) => {
  			if (resp.data.status === 200) {
							console.log(resp);
							const query = await this.$encryptionDecryption.encrypt(JSON.stringify({ ...resp.data.data[0], appNo: data.appNo }));
							this.$global.changeRouterAndaddParam({
								toRouter: 'EmpFamilyPolicyChangeSurrenderList',
								query,
							});
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
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
	}

	// 到詳細投保內容
	toDetail(data: GiissInschgMasterHistoryQueryDto | GiissInschgMasterFindDto) {
  	console.log('詳細投保內容', data);
		const request: TransactionContentModel = {
			appNo: data.appNo,
			funtionType: '0',
		};
		if (this.searchOption == 'history') {
			this.$global.changeRouterAndaddParam({
				toRouter: 'EmployeeFamilyHistoryResultDetail',
				query: {
					contentRequest: request,
					pagination: this.grid.pagination,
					queryRequest: this.$global.getParam().query.queryRequest,
				},
			});
		} else {
			this.$global.changeRouterAndaddParam({
				toRouter: 'EmployeeFamilyTodayResultDetail',
				query: {
					contentRequest: request,
					pagination: this.grid.pagination,
				},
			});
		}
	}

	onPageChange(e: FblPageEvent) {
		this.grid.pagination = e.pagination;
		if (this.searchOption == 'history') {
			this.$global.changeRouterAndaddParam({
				toRouter: 'self',
				query: {
					queryRequest: this.$global.getParam().query.queryRequest,
					pagination: e.pagination,
				},
			});
		}
  	this.onSearch();
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
  .info__txt {
    margin: 10px 0;
  }
  .query__content {
    padding-bottom: 80px;
  }
  .input__search {
    max-width: 160px;
  }
  .query__search-wrap {
    float: right;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  ::v-deep {
		.ant-table table {
			font-size: 16px;
		}
    .query__table {
			font-size: 16px;
      tr {
        cursor: pointer;
        td:first-child {
					font-weight: 600;
        }
				td:nth-child(5) {
					font-weight: 600;
					// overflow: hidden;
					// text-overflow: ellipsis;
					// display: -webkit-box;
					// -webkit-line-clamp: 2;
					// -webkit-box-orient: vertical;
					// word-break: break-all;
        }
      }
    }
    .query__tab {
      width: 100%;
      .ant-radio-button-wrapper {
        width: 50%;
        text-align: center;
      }
    }
		.ant-table-thead > tr > th{
			padding: 4px 16px;
		}

  }
</style>
