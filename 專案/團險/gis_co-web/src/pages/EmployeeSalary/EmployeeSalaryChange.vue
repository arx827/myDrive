<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div
      v-if="scIns"
      class="container"
    >
      <div
        v-if="empInfo"
        class="query__content"
      >
        <div class="query__title">
          請填寫薪資變更金額
        </div>
        <div class="surrenderuser__wrap">
          <div class="query__table">
            <div class="clearfix" />
            <div class="block__line">
              員工資料
            </div>
            <div class="clearfix" />
            <div class="position-relative">
              <UserDataCard
                :card-selected="true"
                :user-name="empInfo.insName"
                :user-sex="empInfo.sex"
                :user-type="0"
                :datas="[empInfo.insId,empInfo.nationality,empInfo.sex,empInfo.birthDate,empInfo.crtNo]"
              />
            </div>
          </div>
        </div>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :layout="'vertical'"
          :rules="formRules"
        >
          <a-row
            class="my-3"
          >
            <a-col
              :span="12"
              class="pe-2"
            >
              實際提報工資(TWD/元)
              <a-form-model-item prop="salary">
                <a-input-number
                  v-model.lazy="form.salary"
                  :min="0"
                  :formatter="value => value.toString().slice(0, 9).replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :style="{ width: '100%'}"
                />
                <transition>
                  <div
                    v-show="isSalaryTip"
                    class="tip"
                  >
                    {{ salaryTip }}
                  </div>
                </transition>
                <div
                  v-if="isSalaryTip"
                  class="pb-2"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              v-if="viewSubsidy"
              :span="12"
              class="ps-2"
            >
              津貼(TWD/元)
              <a-form-model-item prop="subsidy">
                <a-input-number
                  v-model.lazy="form.subsidy"
                  :min="0"
                  :formatter="value => value.toString().slice(0, 6).replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :style="{ width: '100%'}"
                />
                <transition>
                  <div
                    v-show="isSubsidyTip"
                    class="tip"
                  >
                    {{ subsidyTip }}
                  </div>
                </transition>
                <div
                  v-if="isSubsidyTip"
                  class="pb-2"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row
            v-if="viewLaborSalary"
            class="mb-4"
          >
            <a-col :span="12">
              職保薪資(TWD/元)
              <a-form-model-item prop="selectLaborSalary">
                <a-select
                  v-model="form.selectLaborSalary"
                  class="pe-2 w-100"
                  :disabled="loborDisabled"
                >
                  <a-select-option
                    v-for="(list, index) in laborSalary"
                    :key="index"
                    :value="list"
                  >
                    {{ list | currency }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" />
          </a-row>
          <hr>
          <div class="mt-4">
            變更日期
            <a-form-model-item prop="date">
              <date-picker
                v-model="form.date"
                type="date"
                :formatter="formatter"
                :clearable="false"
                class="datepicker--width"
              />
            </a-form-model-item>
          </div>
        </a-form-model>
        <div class="block__btns text-center">
          <button
            class="btn__radius--primary--outline me-1"
            @click.prevent="onBack"
          >
            上一步
          </button>
          <button
            class="ms-1 btn__radius--primary"
            type="primary"
            @click.prevent="onNext"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import UserDataCard from '@/components/shared/info/UserDataCard.vue';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import modal from '@/plugins/info/infoModal';

// 錢錢加逗號
Vue.filter('currency', (number) => new Intl.NumberFormat().format(number));

@Component({ components: { Breadcrumb, UserDataCard } })
export default class EmployeeSalaryChange extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  // 時間format格式
  formatter = this.$twDateFormatter;

  scIns = false; // 是否於要保單位投保職保

  viewSalary = false; // 是否顯示提報工資

  viewSubsidy = false; // 是否顯示津貼

  viewLaborSalary = false; // 是否顯示職保薪資

  preSalary = null; // 調整前實際提報工資

  preSubsidy = null; // 調整前津貼

  preLaborSalary = null; // 調整前職保薪資

  laborSalary = []; // 職保薪資

	subsidyTip = '';

	salaryTip = '';

	fromWhere = 0; // 異動編輯為1

	appNo = 0; // 受理號碼

	historyPage = 0; // 從今日異動傳來的頁數

  // 表單
  form = {
  	salary: null, // 實際提報工資
  	subsidy: null, // 津貼
  	selectLaborSalary: null, // 選擇的職保薪資
  	date: null, // 變更日期
  }

  // 檢核規則
  formRules = {
  	salary: [
  		{ required: true, message: '請輸入實際提報工資' },
  		{ pattern: /^\+?[1-9][0-9]*$/, message: '僅能填入正整數' },
  	],
  	subsidy: [
  		// { required: true, message: '請輸入津貼' },
  		{ pattern: /^[0-9]+$/, message: '僅能填入零或正整數' },
  	],
  	selectLaborSalary: [
  		{ required: true, message: '請選擇職保薪資' },
  	],
  	date: [{ required: true, message: '請填入有效變更日期' }],
  }

  empInfo = null;

  isSending = false;

	isSalaryTip = false; // 提報工資提示顯示

	isSubsidyTip = false; // 津貼提示顯示

	loborDisabled = true; // 職保disabled

	isFirst = true;

	disabledDate(current) {
		return current < moment().startOf('day');
	}

	@Watch('form.salary', { deep: true })
	onSalaryChange(val) {
  	this.setTipRule(val, this.preSalary, 'salaryTip', '實際提報工資', 'isSalaryTip');
	}

	@Watch('form.subsidy', { deep: true })
	onSubsidyChange(val) {
  	this.setTipRule(val, this.preSubsidy, 'subsidyTip', '津貼', 'isSubsidyTip');
	}

	@Watch('form.date')
	onDateChange() {
		this.getLabor();
	}

	// 提報工資、津貼提示，不阻擋
	setTipRule(val, preVal, key, txt, tip) {
		if (val !== null && val !== '' && val !== undefined) {
  		if (parseInt(val) > 500000) {
  			this[key] = `${txt}超過50萬元，請確認是否正確`;
				this[tip] = true;
  		} else if (parseInt(val) > parseInt(preVal) * 1.5) {
  			this[key] = `變更後之${txt}，超過原始工資之1.5倍，請確認是否正確`;
				this[tip] = true;
  		} else {
				this[tip] = false;
  		}
  	} else {
			this[tip] = false;
		}
	}

	async getUserInfo() {
		const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	const query = JSON.parse(decryptString);
  	// const applyCheck = '2';
  	const data = {
			crtNo: query.input.crtNo,
  		crtSeq: query.input.crtSeq,
			policyModel: this.$userInfo.getPolicyModel(),
  	};

  	query.isCheck = false;

  	if (this.$global.getParam().fromPage == 'CO_EFTodayResultTable') {
  		this.fromWhere = 1;
			this.empInfo = query.employeeData[0];
			this.appNo = query.appNo;
			this.historyPage = query.pagination;
  	} else {
			this.empInfo = query;
			this.form.date = this.getTomorrow();
		}

  	this.setLoading(true);

  	// 檢查是否有申請退保
  	this.$coUtilityApi.checkSurrenderedOrNotUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (!resp.data.data) {
  					notification.error({
  						Content: '請至今日線上異動查詢將該筆退保資料刪除後才能進行變更',
  						onCallback: () => {
  							if (!this.fromWhere) {
									this.$router.push({ path: '/empFamilyPolicyChangeQuery' }).catch((err) => { err; });
								} else {
									this.$router.push({ path: '/employeeFamilyToday' }).catch((err) => { err; });
								}
  						},
  					});
  				}
  			} else {
  				notification.error({
						Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
						onCallback: () => {
							if (!this.fromWhere) {
								this.$router.push({ path: '/empFamilyPolicyChangeQuery' }).catch((err) => { err; });
							} else {
								this.$router.push({ path: '/employeeFamilyToday' }).catch((err) => { err; });
							}
  					},
					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		});

		// if (!this.fromWhere) {
		// 	// 檢查是否已申請過變更
		// 	this.$coUtilityApi.checkAlreadyApplyUsingPOST(data, applyCheck)
		// 		.then((resp) => {
		// 			if (resp.data.status === 200) {
		// 				if (!resp.data.data) {
		// 					notification.error({
		// 						Content: '無法進行薪資變更',
		// 						onCallback: () => {
		// 							this.$router.push({ path: '/empFamilyPolicyChangeQuery' }).catch((err) => { err; });
		// 						},
		// 					});
		// 				}
		// 			} else {
		// 				notification.error({
		// 					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
		// 					onCallback: () => {
		// 						this.$router.push({ path: '/empFamilyPolicyChangeQuery' }).catch((err) => { err; });
		// 					},
		// 				});
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			console.log('error status = ', error);
		// 		});
		// }

  	// 提報工資/職保薪資/津貼顯示
  	this.$empFamilyPolicyChangeApi.checKScInsUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.scIns = resp.data.data.scIns;
  				this.viewSalary = resp.data.data.salary;
  				if (!this.scIns || !this.viewSalary) {
  					notification.error({
  						Content: '無法進行薪資變更',
  						onCallback: () => {
  							if (!this.fromWhere) {
									this.$router.push({ path: '/empFamilyPolicyChangeQuery' }).catch((err) => { err; });
								} else {
									this.$router.push({ path: '/employeeFamilyToday' }).catch((err) => { err; });
								}
  						},
  					});
  				}
  				this.viewSubsidy = resp.data.data.allowance;
  				this.viewLaborSalary = resp.data.data.scInsAmt;
  			} else {
  				notification.error({
						Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
						onCallback: () => {
							if (!this.fromWhere) {
								this.$router.push({ path: '/empFamilyPolicyChangeQuery' }).catch((err) => { err; });
							} else {
								this.$router.push({ path: '/employeeFamilyToday' }).catch((err) => { err; });
							}
  					},
					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
			.finally(() => {
				this.setLoading(false);
			});

		if (!this.fromWhere) {
			// 取得員工薪資資料
			this.$empFamilyPolicyChangeApi.getEmpSalaryDataUsingPOST(data)
				.then((resp) => {
					if (resp.data.status === 200) {
						this.preSalary = resp.data.data.salary;
						this.preSubsidy = resp.data.data.allowance;
						this.preLaborSalary = resp.data.data.scInsAmt;
						this.form.salary = resp.data.data.salary;
						this.form.subsidy = resp.data.data.allowance;
						this.form.selectLaborSalary = this.autoAddComdify(resp.data.data.scInsAmt);
					} else {
						notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
					}
				})
				.catch((error) => {
					console.log('error status = ', error);
				});
		} else {
			this.preSalary = query.newSalary;
			this.preSubsidy = query.newAllowance;
			this.preLaborSalary = query.newScInsAmt;
			this.form.salary = query.newSalary;
			this.form.subsidy = query.newAllowance;
			this.form.selectLaborSalary = query.newScInsAmt;
			this.form.date = new Date(query.appOcDate);
		}
	}

	async getLabor() {
		if (!this.isFirst) {
			modal.alertForSingleError({
				title: '提示',
				content: '變更日期已異動，請重新確認資訊是否正確',
			});
		}
		this.isFirst = false;
		const data = {
			policyNo: this.$userInfo.getPolicyModel().policyNo,
			policySeq: this.$userInfo.getPolicyModel().policySeq,
			times: this.$userInfo.getPolicyModel().times,
			updateDate: this.form.date,
		};
		// 取得職保級距列表
		await this.$coUtilityApi.listLaborInsStepUsingPOST(data)
			.then((resp) => {
				if (resp.data.status === 200) {
					this.laborSalary = resp.data.data;
				} else {
					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
			})
			.catch((error) => {
				console.log('error status = ', error);
			});
		this.loborDisabled = false;
		let isSameLabor = false;
		this.laborSalary.forEach((item) => {
			if ((item === this.form.selectLaborSalary) || (isNaN(this.form.selectLaborSalary) && item === Number(this.form.selectLaborSalary.replace(/[^0-9]/ig, '')))) {
				isSameLabor = true;
			}
		});
		if (!isSameLabor) {
			this.form.selectLaborSalary = null;
		}
	}

	getTomorrow() {
  	const tomorrow = new Date();
  	tomorrow.setDate(tomorrow.getDate() + 1);
  	return tomorrow;
	}

	// 轉千分位
	autoAddComdify(val) {
		if (!val) return val;
		const rgx = /(\d)(?=(?:\d{3})+$)/g;
		const c = val.toString().replace(rgx, '$1,');
		return c;
	}

	created() {
  	if (this.$global.getParam() === null) {
  		notification.error({
  			Content: '無查詢條件，請重新查詢',
  			onCallback: () => {
  				this.$router.push({ path: '/empFamilyPolicyChangeQuery' }).catch((err) => { err; });
  			},
  		});
  		return;
  	}
  	this.getUserInfo();
	}

	// 上一步
	onBack() {
		if (this.fromWhere == 1) {
			this.$global.changeRouterAndaddParam({
				toRouter: 'CO_EFTodayResultTable',
				query: {
					pagination: this.historyPage,
				},
  		});
		} else {
  		this.$router.back();
		}
	}

	async send() {
		const query = {
  			empInfo: this.empInfo,
  			scIns: this.scIns,
  			viewSalary: this.viewSalary,
  			viewSubsidy: this.viewSubsidy,
  			viewLaborSalary: this.viewLaborSalary,
  			preSalary: this.preSalary,
  			preSubsidy: this.preSubsidy,
  			preLaborSalary: this.preLaborSalary,
  			newSalary: this.form.salary.toString().slice(0, 9),
  			newSubsidy: null,
  			newLaborSalary: this.form.selectLaborSalary,
  			// date: this.form.date,
			  date: DateTimeFormmat.transformRocDate(
				moment(this.form.date).format(
					'YYYY-MM-DDTHH:mm:ss.sssZ',
				),
			),
  			fromWhere: this.fromWhere,
  			appNo: this.appNo,
			  historyPage: this.historyPage,
  		};
		if (this.form.subsidy) {
			query.newSubsidy = this.form.subsidy.toString().slice(0, 6);
		}
		console.log(query);
		if (isNaN(this.form.selectLaborSalary)) {
			query.newLaborSalary = this.form.selectLaborSalary.replace(/[^0-9]/ig, '');
		}
		const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EmployeeSalaryConfirm',
  		query: encryptQuery,
  	});
	}

	// 下一步
	onNext() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			if (!this.viewLaborSalary) {
  				const laborData = {
  					allowance: this.preSubsidy,
						policyModel: this.$userInfo.getPolicyModel(),
  					salary: this.form.salary,
  				};
  				// 計算取得職保薪資
  				this.$coUtilityApi.getScInsAmtUsingPOST(laborData)
  					.then((resp) => {
  						if (resp.data.status === 200) {
  							this.form.selectLaborSalary = resp.data.data;
  			        this.send();
  						} else {
  							notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  						}
  					})
  					.catch((error) => {
  						console.log('error status = ', error);
  					});
  			} else {
  			  this.send();
  			}
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
.datepicker--width {
  width: 260px;
}
.block__btns {
  padding-top: 80px;
  button {
    width: 150px;
    max-width: 100%;
    margin: 0 5px;
  }
}
.query__content {
  width: 900px;
  max-width: 100%;
  margin: auto;
  padding: 57px 0 40px 0;
}
.query__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 9px;
}
.block__line {
  background-color: #7CACD3;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  padding: 9px 10px;
  margin-bottom: 25px;
  margin-top: 10px;
}
.surrenderuser__wrap {
  border-bottom: 1px #CECECE dashed;
  padding-bottom: 10px;
  margin-bottom: 25px;
}
hr {
  border: 0;
  border-bottom: 1px #CECECE dashed;
  outline: 0;
}
.tip {
	position: absolute;
	opacity: 100;
	color: #f5222d;
	top: 28px;
}
::v-deep .ant-input-number-handler-wrap{
	display: none;
}
.v-enter-active, .v-leave-active {
	transition: all .3s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.v-enter, .v-leave-to {
	opacity: 0;
	color: rgba(0, 0, 0, 0.45);
	top: 20px;
}
</style>
