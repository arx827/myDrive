<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap-result">
        <h2 class="query__title">
          <span :class="{value__blue:!readOnly}">{{ pageTitle }}</span>
          <span class="query__total">共{{ grid.data.length }}筆</span>
          <div class="clearfix" />
        </h2>
        <fbl-data-grid
          v-if="readOnly"
          class="query__table"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          :custom-row="grid.customRow"
          :scroll="{ x: true }"
          @tableChange="onPageChange($event)"
        >
          <template #salary="data">
            <a-input-number
              v-model.lazy="data.data.salary"
              tpye="number"
              :formatter="value => autoAddComdify(value.slice(0,9))"
              class="table__input"
              :min="0"
              @blur="valueChange(data.data, 'salary')"
            />
          </template>
          <template #allowance="data">
            <a-input-number
              v-model="data.data.allowance"
              :disabled="!respEmpWithoutSalary.showAllowance"
              class="table__input"
              :min="0"
              :formatter="value => autoAddComdify(value.slice(0,6))"
              @blur="valueChange(data.data, 'allowance')"
            />
          </template>
          <template #scInsAmt="data">
            <a-select
              v-model="data.data.scInsAmt"
              :default-value="data.data.scInsAmt"
              class="select"
              type="number"
              @change="valueChange(data.data, 'scInsAmt')"
            >
              <a-select-option
                class="select__option"
                :value="0"
              >
                選擇金額
              </a-select-option>
              <a-select-option
                v-for="(item, index) in scInsAmtList[data.data.appNo]"
                :key="index"
                class="select__option"
                :value="item"
              >
                {{ autoAddComdify(item) }}
              </a-select-option>
            </a-select>
          </template>
          <template #scInsAmt_disabled="data">
            <a-select
              v-model="data.data.scInsAmt"
              :default-value="data.data.scInsAmt"
              disabled
              class="select"
              type="number"
            />
          </template>
          <template
            #action="data"
          >
            <div class="checkdetail__btn">
              <button
                class="btn__radius--primary--small"
                @click="setDeTailModal1Visible(data.data)"
              >
                查看
              </button>
            </div>
          </template>
        </fbl-data-grid>
        <fbl-data-grid
          v-else
          class="query__table newquery__table"
          :row-key="newGrid.rowKey"
          :columns="newGrid.columns"
          :data="newGrid.data"
          :pagination="false"
          :custom-row="newGrid.customRow"
          :scroll="{ x: true }"
          @tableChange="onPageChange($event)"
        />
        <div v-if="grid.data">
          <div
            v-if="readOnly&&grid.data.length!==0"
            class="block__btns col-12 text-center flex-center"
          >
            <button
              class="btn__radius--primary"
              @click="checkUpdateData"
            >
              下一步
            </button>
          </div>
          <div
            v-if="!readOnly&&grid.data.length!==0"
            class="block__btns group__btn col-12 text-center flex-center"
          >
            <button
              class="btn__radius--primary--outline"
              @click="() => (readOnly = !readOnly)"
            >
              上一步
            </button>
            <button
              class="btn__radius--primary"
              @click="updateData"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="components-modal-demo-position">
      <a-modal
        v-model="detailModalVisible"
        :centered="true"
        :footer="null"
        :closable="false"
        width="auto"
      >
        <EmployeeFamilyPolicyChangeWithoutSalaryDetail
          :query="detailData"
          @closeModal="() => (detailModalVisible = false)"
        />
      </a-modal>
    </div>
  </div>
</template>
<!--a-form-model-item a-select-option a-form-model-->
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	EmpSalaryUpdateModel,
	EmpWithoutSalaryDto,
	EmpWithoutSalary,
	UserInfoDto,
	PolicyModel,
	EmpSalaryDto,
	UpdateSalaryDto,
	PolicyModelWithUpdateDateAndEffDate,
} from '@fubonlife/co-giiss-api-axios-sdk';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import modal from '@/plugins/info/infoModal';
import EmployeeFamilyPolicyChangeWithoutSalaryDetail from '@/pages/EmpFamilyPolicyChangeWithoutSalary/EmpFamilyPolicyChangeWithoutSalaryDetail.vue';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';

@Component({ components: { Breadcrumb, FblDataGrid, EmployeeFamilyPolicyChangeWithoutSalaryDetail } })
export default class EmpFamilyPolicyChangeWithoutSalaryTable extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

	h = this.$createElement;

  //  當前登入者資料
  currentLoginData: UserInfoDto;

	pageTitle: string = '加保薪資登錄';

	// list頁是否點擊下一步
	readOnly: boolean = true;

	// 控制詳細投內容modal
	detailModalVisible: boolean = false;

	// 傳至詳細投保內容彈窗 porps
	detailData: EmpWithoutSalary={};

	// 登錄薪資request
	updateRequest: EmpSalaryUpdateModel = {
		empSalaryDtos: [],
		userId: '',
	};

	// 查詢需加保薪資登錄人員request
	policyModel: PolicyModel ;

	// 查詢需加保薪資登錄人員 response
	respEmpWithoutSalary: EmpWithoutSalaryDto;

	// 查詢職保級距request
	scInsAmtRequest: PolicyModelWithUpdateDateAndEffDate

	// 儲存API回傳的職保薪資級距
	scInsAmtList={}

	// 儲存職保薪資promise陣列
	laborInsPromiseArray = [];

	laborApiErr: Array<string> = null

  public grid: FblPDataGridHolder<EmpWithoutSalary> = {
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
  			property: 'appNo',
  			title: '受理號碼',
  			fixed: 'left',
  			// width: 180,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insName',
  			title: '被保險人姓名',
  			width: 180,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insId',
  			title: '身分證字號/居留證號碼',
  			width: 165,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'salary',
  			title: '實際提報工資(TWD/元)',
  			template: 'salary',
  			width: 153,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'allowance',
  			title: '津貼(TWD/元)',
  			width: 153,
  			template: 'allowance',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'scInsAmt',
  			title: '職保薪資(TWD/元)',
  			template: 'scInsAmt',
  			width: 153,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'action',
  			title: '投保內容',
  			template: 'action',
  		},
  	],
  };

	public newGrid: FblPDataGridHolder<EmpWithoutSalary> = {
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
  			property: 'appNo',
  			title: '受理號碼',
  			fixed: 'left',
  			// width: 180,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insName',
  			title: '被保險人姓名',
  			width: 180,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insId',
  			title: '身分證字號/居留證號碼',
  			width: 165,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'salary',
  			title: '實際提報工資(TWD/元)',
  			width: 162,
				customRender: (data) => this.h('div', {
					attrs: {
						class: this.isValueChange('salary', data.index) ? 'value__blue' : null,
					},
				}, this.autoAddComdify(data.salary)),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'allowance',
  			title: '津貼(TWD/元)',
  			width: 162,
				customRender: (data) => this.h('div', {
					attrs: {
						class: this.isValueChange('allowance', data.index) ? 'value__blue' : null,
					},
				}, this.autoAddComdify(data.allowance)),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'scInsAmt',
  			title: '職保薪資(TWD/元)',
  			width: 162,
				customRender: (data) => this.h('div', {
					attrs: {
						class: this.isValueChange('scInsAmt', data.index) ? 'value__blue' : null,
					},
				}, this.autoAddComdify(data.scInsAmt)),
  		},
			{
  			type: FblColumnType.PLAIN,
  			property: ' ',
  			title: '  ',
  			// width: 92,
  		},
  	],
	};

	async created() {
		this.setLoading(true);
		if (this.$user.loginState) {
			// 查詢需登錄薪資的Modal
			this.policyModel = this.$userInfo.getPolicyModel();
			this.scInsAmtRequest = {
				...this.policyModel,
			};
			console.log('職保級距request', this.scInsAmtRequest);
		}
		await this.getData();
	}

	// 取得職保薪資級距
	getLaborInsStep(appno, effDate) {
		// 取得職保薪資級距的Model
		this.scInsAmtRequest.effDate = effDate;
		return this.$coUtilityApi.listLaborInsStepUsingPOST(this.scInsAmtRequest)
			.then((resp) => {
				if (resp.status === 200) {
					this.scInsAmtList[appno] = resp.data.data;
				} else {
					this.laborApiErr.push(this.$global.getApiErrorMsg(resp.data.apiError).join(''));
					// notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
			})
			.catch((err) => {
				console.log(`職保薪資級距: ${err}`);
			});
	}

	getAllLaborInsStep() {
		this.respEmpWithoutSalary.empWithoutSalaryList.map((item) => {
			this.laborInsPromiseArray.push(this.getLaborInsStep(item.appNo, item.effDate));
		});
	}

	async loadTokenAndLaborIns() {
		const vm = this;
  	this.setLoading(true);
  	this.$user.changeisChangingToken(true);
		console.log(this.$user.loginState.accessToken);
  	await this.$globalAuthApi.getJwtByAccountUsingPOST({
  		headers: {
  				Authorization: `Bearer ${this.$user.loginState.accessToken}`,
  			},
  	})
  		.then(async (resp) => {
  			if (resp.data.status === 200) {
  				const getData = resp.data.data as any;
  				const loginStateObj = JSON.parse(sessionStorage.getItem('login_state'));
  				this.$user.changeLoginStateAccessToken(getData.accessToken);
  				loginStateObj.accessToken = getData.accessToken;
  				await sessionStorage.setItem('login_state', JSON.stringify(loginStateObj));
  				this.getAllLaborInsStep();
					await Promise.all(this.laborInsPromiseArray)
  					.then((resp) => {
  						console.log(resp);
  					})
  					.catch(console.error)
  					.finally(() => {
  						this.setLoading(false);
  					});
					this.$forceUpdate();
					if (this.laborApiErr) {
						notification.error({ Content: this.laborApiErr.join('') });
  				}
				} else {
  				modal.alertForSingleError({
  					title: '錯誤訊息',
  					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					onCallback() {
  						vm.$user.signOut(false);
  	          vm.$router.replace({ path: '/login' });
  					},
  				});
  				this.setLoading(false);
  			}
  		})
  		.catch((resp) => {
  			notification.error({
  				Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  			});
  			this.setLoading(false);
  		})
			.finally(() => {
				this.$user.changeisChangingToken(false);
			});
	}

	// 查詢需登錄薪資資料
	getData() {
		return this.$empFamilyPolicyChangeApi.listEmployeesWithoutSalaryUsingPOST(this.policyModel)
			.then((resp) => {
				if (resp.data.status === 200) {
					this.respEmpWithoutSalary = resp.data.data;
					this.respEmpWithoutSalary.empWithoutSalaryList.forEach((item, i) => {
						const indexData = {
							...item,
							index: i,
						};
						if (!item.salary) {
							indexData.salary = 0;
							this.respEmpWithoutSalary.empWithoutSalaryList[i].salary = 0;
						}
						if (!this.respEmpWithoutSalary.showAllowance || !item.allowance) {
							// 不顯示津貼 或 原值為 null
							indexData.allowance = 0;
							this.respEmpWithoutSalary.empWithoutSalaryList[i].allowance = 0;
						}
						if (!this.respEmpWithoutSalary.showScInsAmt || !item.scInsAmt) {
							// 不顯示職保薪資 或 原值為 null
							indexData.scInsAmt = 0;
							this.respEmpWithoutSalary.empWithoutSalaryList[i].scInsAmt = 0;
						}
						this.grid.data.push(indexData);
					});
					const scInsAmtColumn = this.grid.columns.find((element) => element.property === 'scInsAmt');
					// 職保薪資欄位顯示
					if (this.respEmpWithoutSalary.showScInsAmt) {
						scInsAmtColumn.template = 'scInsAmt';
						this.loadTokenAndLaborIns();
					} else {
						scInsAmtColumn.template = 'scInsAmt_disabled';
						this.setLoading(false);
					}
				} else {
					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
					this.setLoading(false);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally();
	}

	// 當提報薪資、津貼、職保薪資有更動
	valueChange(data, property) {
		const index = data.index;
		const inputvalue = this.grid.data[index][property];
		const originValue = this.respEmpWithoutSalary.empWithoutSalaryList[index][property];
		if (inputvalue >= 500000) {
			const hint = '輸入之實際提報工資/津貼，超過50萬元，請確認是否正確。';
			modal.alertForSingleError({
				title: '實際提報工資/津貼金額提示',
				content: hint,
			});
		} else if (originValue && originValue !== 0) {
			if ((inputvalue / originValue) > 1.5) {
				const hint = '輸入之實際提報工資/津貼，超過原始實際提報工資/津貼之1.5倍，請確認是否正確。';
				modal.alertForSingleError({
					title: '實際提報工資/津貼金額提示',
					content: hint,
				});
			}
		}
		if (!inputvalue) {
			this.grid.data[index][property] = null;
		}
	}

	// 點擊下一步按鈕
	onClickReadOnly() {
		this.newGrid.data = this.grid.data;
		this.readOnly = !this.readOnly;
		this.pageTitle = '請確認以下變更內容';
	}

	// 點擊查看 打開modal
	setDeTailModal1Visible(data) {
		// 儲存要預覽登錄資料
		this.detailData = { ...data };
		this.detailModalVisible = true;
	}

	// 檢核數值有變動列提報薪資、職保薪資不可為0
	hasValueZero() {
		const zeroValueError = [];
		this.updateRequest.empSalaryDtos.forEach((item, index) => {
			let err = null;
			if (!item.salary || item.salary === 0) {
				err = `${this.grid.data.find((i) => i.appNo === item.appNo).insName} 提報工資為必填。`;
			}

			if (this.respEmpWithoutSalary.showScInsAmt) {
				if (!item.scInsAmt || item.scInsAmt === 0) {
					if (err) {
						err += '請選擇有效職保薪資。';
					} else {
						err = `${this.grid.data.find((i) => i.appNo === item.appNo).insName} 請選擇有效職保薪資。`;
					}
				}
			}
			if (err) {
				zeroValueError.push(err);
			}
		});
		if (zeroValueError.length !== 0) {
			return zeroValueError;
		}
		return null;
	}

	// 設定登錄薪資Request
	queryUpdateRequest() {
		this.updateRequest.empSalaryDtos = [];
		this.grid.data.forEach((item, index) => {
			// 判斷某列有沒有欄位變動
			if (this.isValueChange('allowance', index) || this.isValueChange('salary', index) || this.isValueChange('scInsAmt', index)) {
				const empSalary: EmpSalaryDto = {
					appNo: item.appNo,
					effDate: item.effDate,
				};
				if (item.salary) {
					empSalary.salary = Number(item.salary.toString().slice(0, 9));
				}
				// 職保薪資、津貼顯示為true才登錄
				if (this.respEmpWithoutSalary.showAllowance) {
					// const allowance = Number(item.allowance.toString().slice(0, 9));
					empSalary.allowance = item.allowance;
				}
				if (this.respEmpWithoutSalary.showScInsAmt) empSalary.scInsAmt = item.scInsAmt;
				this.updateRequest.empSalaryDtos.push(empSalary);
			}
		});
		this.updateRequest.userId = this.$user.getMe().userId;
		this.updateRequest.policyModel = this.policyModel;
	}

	// 輸入頁點擊下一步進行欄位檢核
	checkUpdateData() {
		this.queryUpdateRequest();
		if (this.updateRequest.empSalaryDtos.length === 0) {
			notification.error({ Content: '無提報薪資，請確認。' });
			return;
		}

		if (this.hasValueZero()) {
			modal.alertForListError({
				contentList: this.hasValueZero(),
			});
		} else {
			this.setLoading(true);
			this.updateRequest.save = false;
			// patch薪資登錄API檢核，確認是否有apiError
			this.$empFamilyPolicyChangeApi.updateEmployeesSalaryUsingPOST(this.updateRequest)
				.then((resp) => {
					if (resp.data.status === 200 && resp.data.data.success) {
						// 檢核成功進入確認頁
						this.onClickReadOnly();
					} else {
						const respErr = resp.data.data.returnMessage.split('\n');
						respErr.splice(respErr.length - 1, 1);
						modal.alertForListError({
							contentList: respErr,
						});
					}
				}).catch((err) => {
					console.log(err);
				}).finally(() => {
					this.setLoading(false);
				});
		}
	}

	// 登錄修改薪資資料
	updateData() {
		this.setLoading(true);
		this.queryUpdateRequest();
		this.updateRequest.save = true;
		this.$empFamilyPolicyChangeApi.updateEmployeesSalaryUsingPOST(this.updateRequest)
			.then((resp) => {
				if (resp.data.status === 200) {
					const returnMessege: UpdateSalaryDto = {
						success: resp.data.data.success,
						returnMessage: resp.data.data.returnMessage,
						count: resp.data.data.count,
					};
					this.changeRouterToResultPage(returnMessege);
				} else {
					notification.error({
  							Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  						});
				}
			}).catch((err) => {
				console.log(err);
			}).finally(() => {
				this.setLoading(false);
			});
	}

	// 前往受理結果頁
	changeRouterToResultPage(msg) {
		if (msg.success) {
			this.$global.changeRouterAndaddParam({
				toRouter: 'EmpFamilyPolicyChangeWithoutSalarySuccess',
				query: {
					data: msg,
				},
  	});
		} else {
			this.$global.changeRouterAndaddParam({
				toRouter: 'EmpFamilyPolicyChangeWithoutSalaryFail',
				query: {
					data: msg,
				},
  	});
		}
	}

	// 轉千分位
	autoAddComdify(val) {
		if (!val) return val;
		// const str = val.split('.');
		const rgx = /(\d)(?=(?:\d{3})+$)/g;
		const c = val.toString().replace(rgx, '$1,');
		// const c = val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
		return c;
	}

	updated() {
		window.parseWord();
	}

	isValueChange(property, index) {
		const oriData = this.respEmpWithoutSalary.empWithoutSalaryList;
		const newData = this.grid.data;
		if (newData[index][property] !== oriData[index][property]) {
			return true;
		}
		return false;
	}
}
</script>

<style lang="scss" scoped>
	.checkdetail__btn{
		display: flex;
		justify-content: center;
		font-size: 14px;
	}
  ::v-deep {
		.select{
			width: 130px;
			.ant-select-selection-selected-value{
				font-size: 14px;
			}
			svg{
				font-size: 10px;
			}
		}
		.ant-modal-mask{
			z-index: 800;
		}
		.ant-modal-wrap{
			z-index: 900;
		}
		.ant-modal-body{
			padding: 0px;
		}

		.ant-table table {
			font-size: 16px;
		}
		.ant-input-number{
			width: 130px;
			.ant-input-number-input-wrap{
			font-size: 14px;
			}
			.ant-input-number-handler-wrap{
				display: none;
			}
		}
		.query__title{
			span{
				font-size: 18px;
			}
		}

    .query__table {
			font-size: 16px;
			.ant-table-column-title{
				font-size: 14px;
			}
      tr {
				td {
					padding-top: 7.5px;
					padding-bottom: 7.5px;
				}
				td:nth-child(2) {
					padding-right: 0;
					padding-left: 0;
        }
      }
    }
		.newquery__table {
			tr {
				td {
					padding-top: 12.5px;
					padding-bottom: 12.5px;
				}
      }
		}
    .query__tab {
      width: 100%;
    }
		.ant-table-thead > tr > th {
			padding: 14px 16px;
			font-size: 14px;
		}
		.ant-table-thead > tr > th:nth-child(2){
			padding-left: 0;
		}
		.ant-table-tbody > tr > td:first-child{
			width: 140px;
		}

  }

	.error-modal-titel{
		font-weight: bold;
	}
	.error-modal-body{
		font-size: 14px;
	}
	.group__btn{
		button:nth-of-type(1){
			margin-right: 10px;
			color: $BUTTON-MAIN;
			background-color: #ffffff;
			border: 1px solid $BUTTON-MAIN;
		}
	}
	.table__input{
		font-size: 14px;
	}
	.block__btns{
		margin-top: 80px;
		button{
			padding: 12px auto;
		}
	}
	.value__blue{
		color: $COLOR-MAIN6;
	}
	.list-with-border{
		padding-left: 16px;
		li{
		font-size: 14px;
		list-style-type: disc;
		}
	}
	.ant-modal-confirm-btns{
		button{
			span{
				font-size: 14px;
			}
		}
	}
</style>
