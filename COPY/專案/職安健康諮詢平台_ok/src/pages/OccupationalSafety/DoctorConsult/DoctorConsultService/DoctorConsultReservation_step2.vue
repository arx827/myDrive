<template>
  <div class="pageDoctorConsultReservationStep2">
    <div class="info__card__wrap">
      <div class="page__card page__card--shadow p-0">
        <div class="page__card__title page__card__headerTitle">
          預約資訊
        </div>
        <div class="reservation__info__wrap d-lg-flex justify-content-center">
          <div class="reservation__info__item">
            <div class="info__item__title">
              預約地點
            </div>
            <div class="info__item__data">
              {{ reservationInfo.actLocation }}
            </div>
          </div>
          <div class="reservation__info__item">
            <div class="info__item__title">
              預約時間
            </div>
            <div class="info__item__data">
              {{ reservationInfo.actDate }}
            </div>
          </div>
          <div class="reservation__info__item">
            <div class="info__item__title">
              預約時段
            </div>
            <div class="info__item__data">
              {{ reservationInfo.sessionTime }}
            </div>
          </div>
          <div class="reservation__info__item">
            <div class="info__item__title">
              值班醫師
            </div>
            <div class="info__item__data">
              Dr. {{ reservationInfo.physicianName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page__card form__card">
      <div class="form__card__title">
        基本資料填寫
      </div>
      <a-form-model
        ref="pageDoctorConsultReservationFormModelRef"
        :form="form"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        :colon="false"
        class="pageDoctorConsultReservationFormModel"
      >
        <a-row
          type="flex"
          :gutter="16"
        >
          <!-- 公司 -->
          <!-- <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item prop="company">
              <span slot="label">
                公司<span class="mark-required">*</span>
              </span>
              <a-input
                v-model="form.company"
                :allow-clear="true"
                size="large"
              />
            </a-form-model-item>
          </a-col> -->

          <!-- 所屬行政大樓 -->
          <a-col
            :xs="24"
            :md="24"
          >
            <a-form-model-item prop="workArea">
              <span slot="label">
                工作地點<span class="mark-required">*</span>
              </span>
              <a-input
                v-model="form.workArea"
                :allow-clear="true"
                size="large"
                disabled
              />
            </a-form-model-item>
          </a-col>

          <!-- 預約人姓名 -->
          <a-col
            :xs="24"
            :md="12"
          >
            <a-form-model-item prop="reserveName">
              <span slot="label">
                預約人姓名<span class="mark-required">*</span>
              </span>
              <a-input
                v-model="form.reserveName"
                :allow-clear="true"
                size="large"
                disabled
              />
            </a-form-model-item>
          </a-col>

          <!-- 職稱 -->
          <a-col
            :xs="24"
            :md="12"
          >
            <a-form-model-item prop="title">
              <span slot="label">
                職稱<span class="mark-required">*</span>
              </span>
              <a-input
                v-model="form.title"
                :allow-clear="true"
                size="large"
              />
            </a-form-model-item>
          </a-col>

          <!-- 身份別/員工編號 -->
          <a-col
            :xs="24"
            :md="12"
          >
            <a-form-model-item>
              <span slot="label">
                身份別/員工編號<span class="mark-required">*</span>
              </span>
              <a-row
                type="flex"
                :gutter="[15, 15]"
              >
                <a-radio-group
                  v-model="form.status"
                  class="w-100 radio-identity"
                  disabled
                >
                  <a-col
                    :span="24"
                    :md="12"
                  >
                    <a-form-item
                      :validate-status="reserveUid1? 'success' : 'error'"
                      :help="reserveUid1? '' : '請填寫員工編號'"
                    >
                      <a-radio value="1">
                        內勤
                      </a-radio>
                      <a-input
                        v-model="reserveUidArr[0]"
                        size="large"
                        disabled
                        style="flex: 1;"
                        @change="checkReserveUid1Validate"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col
                    :span="24"
                    :md="12"
                  >
                    <a-form-item
                      :validate-status="reserveUid2? 'success' : 'error'"
                      :help="reserveUid2? '' : '請填寫ID'"
                    >
                      <a-radio value="2">
                        外勤
                      </a-radio>
                      <!-- <a-input
                        v-model="reserveUidArr[1]"
                        size="large"
                        disabled
                        placeholder="e.g. TP12345"
                        @change="checkReserveUid2Validate"
                      />-->
                    </a-form-item>
                  </a-col>
                </a-radio-group>
              </a-row>
            </a-form-model-item>
          </a-col>

          <!-- 部門/單位 -->
          <a-col
            :xs="24"
            :md="12"
          >
            <div class="ant-col ant-form-item-label">
              <label
                title=""
                class="ant-form-item-required ant-form-item-no-colon"
              >
                <span data-v-75b4b748="">部門單位<span
                  data-v-75b4b748=""
                  class="mark-required"
                >*</span></span>
              </label>
            </div>
            <a-form-model-item
              prop="dptName"
            >
              <a-input
                v-model="form.dptName"
                :allow-clear="true"
                size="large"
              />
            </a-form-model-item>
          </a-col>

          <!-- 總機/分機 -->
          <a-col
            :xs="24"
            :md="12"
          >
            <a-form-item
              :validate-status="checkOperatorNoAndMobileNo? 'success' : 'error'"
              :help="checkOperatorNoAndMobileNo? '' : mobileErrorMsg"
            >
              <span slot="label">
                總機/分機<span class="mark-required">*</span>
              </span>

              <a-row
                type="flex"
                align="middle"
                :gutter="[5]"
              >
                <a-col :span="15">
                  <input
                    v-model="form.operatorNo"
                    v-mask="'##########'"
                    class="ant-input"
                    placeholder="e.g. 333561"
                    @input="checkOperatorNoAndMobileNoValidate"
                  >
                </a-col>
                <a-col :span="1">
                  <p class="mb-0 text-center">
                    #
                  </p>
                </a-col>
                <a-col :span="8">
                  <input
                    v-model="form.extNo"
                    v-mask="'##########'"
                    class="ant-input"
                    placeholder="e.g. 20219"
                  >
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>

          <!-- 行動電話 -->
          <a-col
            :xs="24"
            :md="12"
          >
            <a-form-item
              :validate-status="checkOperatorNoAndMobileNo && checkMobileNo ? 'success' : 'error'"
              :help="checkOperatorNoAndMobileNo && checkMobileNo ? '' : mobileErrorMsg"
            >
              <span slot="label">
                行動電話<span class="mark-required">*</span>
              </span>
              <input
                v-model="form.mobileNo"
                v-mask="'##########'"
                class="ant-input"
                placeholder="e.g. 0918372888"
                @input="checkOperatorNoAndMobileNoValidate"
                @blur="checkMobileNoLength"
              >
            </a-form-item>
          </a-col>

          <!-- 健康諮詢項目簡述 -->
          <a-col :xs="24">
            <a-form-model-item prop="description">
              <span
                slot="label"
                class="a-form-label__large"
              >
                健康諮詢項目簡述 (上限字數500字)<span class="mark-required">*</span>
              </span>
              <a-textarea
                v-model="form.description"
                :max-length="1000"
                :auto-size="{ minRows: 6 }"
                size="large"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="page__footer__control btn__wrap d-flex justify-content-center">
      <button
        class="form__btn btn__radius--primary--outline"
        @click="handlePrevStep"
      >
        上一步
      </button>
      <button
        class="form__btn btn__radius--primary"
        @click="handleNextStep"
      >
        確認
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({})
export default class DoctorConsultReservationStep2 extends Vue {
  @Action('setLoading') setLoading;

  reservationInfo = {
  	actLocation: '',
  	actDate: '',
  	sessionTime: '',
  	physicianName: '',
  };

  reserveUidArr = [null, null];

  empInfo = null;

  mobileErrorMsg = '';

  // TEST:
  // form = {
  // 	company: '富邦人壽',
  // 	workArea: 1,
  // 	reserveName: '銀河',
  // 	title: '小小超大專員',
  // 	status: '2', // 內勤 外勤
  // 	reserveUid: 911499,
  // 	department: '系統部',
  // 	unit: '系統支援一科',
  // 	operatorNo: '22222',
  // 	extNo: '28924',
  // 	mobileNo: '0912345',
  // 	description: '邦宇宙邦往宇宙邁進',
  // 	sessionId: 1, // 活動場次
  // 	srcFrom: '員工健康管理', // 資料來源
  // };
  form = {
  	workArea: undefined,
  	reserveName: undefined,
  	title: undefined,
  	status: undefined, // 內勤 外勤
  	reserveUid: 0,
  	dptName: undefined,
  	operatorNo: undefined,
  	extNo: undefined,
  	mobileNo: undefined,
  	description: undefined,
  	sessionId: null, // 活動場次
  	srcFrom: undefined, // 資料來源
  	caseId: null, // 案件編號
  };

  rules: { [key: string]: ValidationRule[] } = {
  	workArea: [{ required: true, message: '工作地點為必填', trigger: 'change' }],
  	reserveName: [{ required: true, message: '預約人姓名為必填', trigger: 'change' }],
  	title: [{ required: true, message: '職稱為必填', trigger: 'change' }],
  	// status: [{ validator: this.checkIdentityType, trigger: 'change' }],
  	dptName: [{ required: true, message: '部門單位為必填', trigger: 'change' }],
  	description: [
  		{
  			required: true,
  			message: '簡述為必填',
  			trigger: 'change',
  		},
  		{
  			message: '字數上限500字',
  			trigger: 'change',
  			max: 500,
  		},
  	],
  };

  disabledDate(current) {
  	// 以當天為基準，禁用過去的時間
  	const date = new Date();
  	return current && current < moment().subtract(1, 'day');
  }

  // API: 取得職場大樓 (下拉)
  // getWorkBuilding() {
  // 	this.setLoading(true);
  // 	this.$PCREmpPhysicianConsultControllerApi.getWorkBuildingInfoUsingPOST()
  // 		.then((resp) => {
  // 			if (resp.data.status == 200) {
  // 				const getData = resp.data.data;
  // 				this.buildingOptions = getData.map((i) => ({
  // 					value: i.wbInfoId,
  // 					label: i.buildingName,
  // 				}));
  // 			} else {
  // 				// 查找失敗訊息
  // 			}
  // 		})
  // 		.catch((error) => {
  // 			// API失敗
  // 			console.log(error.response);
  // 		})
  // 		.finally(() => {
  // 			this.setLoading(false);
  // 		});
  // }

  // API: 儲存預約資訊
  addPhyConsult() {
  	console.log(this.form);
  	this.setLoading(true);
  	this.$PCREmpPhysicianConsultControllerApi.savePhyConsultReserveInfoUsingPOST(this.form)
  		.then((resp) => {
        	let nextRouter;
  			switch (this.$route.name) {
  			case 'CaseMaintainReservationStep2':
  				nextRouter = 'CaseMaintainReservationStep3';
  				break;

  			case 'MotherPlanDoctorReservationStep2':
  				nextRouter = 'MotherPlanDoctorReservationStep3';
  				break;

  			default:
  				nextRouter = 'DoctorConsultReservationStep3';
  				break;
  			}
  			this.$global.changeRouterAndaddParam({
  					toRouter: nextRouter,
  					query: {
  						response: resp.data,
  						reservationInfo: this.reservationInfo,
  					},
  				});
  		})
  		.catch((error) => {
  			// API失敗
  			console.log(error.response);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 儲存預約資訊(護理師預約)
  addPhyConsultByRpn() {
  	const data = {
  			department: this.form.dptName,
  			description: this.form.description,
  			extNo: this.form.extNo,
  			mobileNo: this.form.mobileNo,
  			operatorNo: this.form.operatorNo,
  			reserveName: this.form.reserveName,
  			reserveUid: this.form.reserveUid,
  			sessionId: this.form.sessionId,
  			srcFrom: this.form.srcFrom,
  			status: this.form.status,
  			title: this.form.title,
  			workArea: this.form.workArea,
  			caseId: this.form.caseId,
  		};
  	console.log(data);
  	this.setLoading(true);
  	this.$PCRRpnSendRemindAndModifyReservationApi.addReserveUsingPOST(data)
  		.then((resp) => {
  	    	let nextRouter;
  			switch (this.$route.name) {
  			case 'CaseMaintainReservationStep2':
  				nextRouter = 'CaseMaintainReservationStep3';
  				break;

  			case 'MotherPlanDoctorReservationStep2':
  				nextRouter = 'MotherPlanDoctorReservationStep3';
  				break;

  			default:
  				nextRouter = 'DoctorConsultReservationStep3';
  				break;
  			}
  			this.$global.changeRouterAndaddParam({
  					toRouter: nextRouter,
  					query: {
  						response: resp.data,
  						reservationInfo: this.reservationInfo,
  					},
  				});
  		})
  		.catch((error) => {
  			// API失敗
  			console.log(error.response);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
   * 檢核
   */
  checkOperatorNoAndMobileNo = true;

  checkMobileNo = true;

  checkOperatorNoAndMobileNoValidate() {
  	if ((this.form.operatorNo && this.form.operatorNo.trim() !== '') || (this.form.mobileNo && this.form.mobileNo.trim() !== '')) {
  		this.checkOperatorNoAndMobileNo = true;
  		this.checkMobileNo = true;
  		this.mobileErrorMsg = '';
  	} else {
  		this.checkOperatorNoAndMobileNo = false;
  		this.mobileErrorMsg = '總機/分機、行動電話 請至少填寫一個';
  	}
  }

  // 判斷行動電話 長度不可小於10
  checkMobileNoLength() {
  	if (!this.form.mobileNo) {
  		return;
  	}
  	if (this.form.mobileNo.length === 10) {
  		this.checkMobileNo = true;
  		this.checkOperatorNoAndMobileNo = true;
  		this.mobileErrorMsg = '';
  	} else {
  		this.checkMobileNo = false;
  		this.mobileErrorMsg = '請填寫有效行動電話';
  	}
  }

  reserveUid1 = true;

  reserveUid2 = true;

  checkReserveUid1Validate() {
  	if (this.form.status === '1' && this.reserveUidArr[0] && this.reserveUidArr[0] !== 0) {
  		this.reserveUid1 = true;
  	} else {
  		this.reserveUid1 = false;
  	}
  }

  checkReserveUid2Validate() {
  	if (this.form.status === '2' && this.reserveUidArr[1] && this.reserveUidArr[1] !== 0) {
  		this.reserveUid2 = true;
  	} else {
  		this.reserveUid2 = false;
  	}
  }

  /**
   * Event
   */
  handlePrevStep() {
  	this.$router.go(-1);
  }

  handleNextStep() {
  	if (this.form.status === '1') {
  		this.checkReserveUid1Validate();
  	} else if (this.form.status === '2') {
  		this.checkReserveUid2Validate();
  	} else {
  		this.reserveUid1 = false;
  		this.reserveUid2 = false;
  	}
  	this.checkOperatorNoAndMobileNoValidate();
  	this.checkMobileNoLength();
  	(this.$refs.pageDoctorConsultReservationFormModelRef as any).validate()
  		.then(() => {
  			if (this.checkOperatorNoAndMobileNo && this.checkMobileNo && ((this.form.status === '1' && this.reserveUid1) || (this.form.status === '2' && this.reserveUid2))) {
  				if (this.$user.getSelectedRole() === '2') {
  					this.addPhyConsultByRpn();
  				} else {
  					this.addPhyConsult();
  				}
  			}
  		})
  		.catch((error) => {
  			// 驗證失敗 要捲到 輸入框
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  		});
  	// this.$router.push({ name: 'DoctorConsultReservationStep3' });
  }

  /**
   * Hook
   */
  async created() {
  	this.$emit('changeParent', { step: 2, pageTitle: '基本資料填寫' });
  	const query = this.$global.getQuery();
  	const selectBooking = query.selectBooking;
  	const caseInfo = JSON.parse(await this.$encryptionDecryption.decrypt(query.caseInfo));
  	console.log(caseInfo);
  	this.form.sessionId = selectBooking.sessionId;
  	this.form.caseId = caseInfo ? caseInfo.caseId : null;
  	this.form.srcFrom = caseInfo ? caseInfo.srcFrom : null;
  	this.reservationInfo.actLocation = selectBooking.actLocation ? selectBooking.actLocation : '';
  	this.reservationInfo.actDate = selectBooking.actDate ? moment(selectBooking.actDate).format('YYYY/MM/DD') : '';
  	this.reservationInfo.sessionTime = selectBooking.sessionStartDate ? `${DateTimeFormmat.formatStringHourAndMinute(selectBooking.sessionStartDate)}~${DateTimeFormmat.formatStringHourAndMinute(selectBooking.sessionEndDate)}` : '';
  	this.reservationInfo.physicianName = `${selectBooking.physicianName}`;
  	// 取得職場大樓下拉
  	// this.getWorkBuilding();

  	// 取得人事資料 帶入欄位
  	let $getMe;

  	if (caseInfo && caseInfo.caseEmpId) {
  		await this.getEmpInfo(caseInfo.caseEmpId);
  		Object.assign(this.form, {
  			reserveName: this.empInfo.userName,
  			title: this.empInfo.title,
  			dptName: this.empInfo.department,
  			workArea: this.empInfo.workArea,
  			status: this.empInfo.jobType.toString(),
  			operatorNo: this.empInfo.telNo,
  			extNo: this.empInfo.extNo,
  			// mobileNo: this.empInfo.mobileNo,
  		});
  		console.log(this.form.mobileNo);
  		this.reserveUidArr[this.empInfo.jobType - 1] = this.empInfo.jobType === 1 ? this.empInfo.userId : this.empInfo.id;
  		this.form.reserveUid = this.empInfo.uid;
  		console.log(this.reserveUidArr);
  	} else {
  		const $getMe = this.$user.getMe();
  		Object.assign(this.form, {
  			reserveName: $getMe.name,
  			title: $getMe.title,
  			dptName: $getMe.dptName,
  			workArea: $getMe.workArea,
  			status: $getMe.jobType.toString(),
  			operatorNo: $getMe.telNo,
  			extNo: $getMe.extNo,
  			// mobileNo: $getMe.mobileNo,
  		});
  		this.reserveUidArr[$getMe.jobType - 1] = $getMe.jobType === 1 ? $getMe.empId : $getMe.idNo;
  		this.form.reserveUid = $getMe.userId;
  	}
  }

  async getEmpInfo(empInfo) {
  	await this.$PCRRpnSendRemindAndModifyReservationApi.queryAccountInfoUsingPOST(empInfo)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  	      this.empInfo = resp.data.data[0];
  			} else {
  				// notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  updated() {
  	window.parseWord();
  }

	/**
   * 監聽
   */
	// 紀錄內勤或外勤員工編號
	// @Watch('reserveUidArr', { deep: true })
	// watchReserveUidArr(val) {
	// 	this.form.reserveUid = this.reserveUidArr[(this.form.status === '1') ? 0 : 1];
	// }

	// @Watch('form.status', { deep: true })
	// watchStatus(val) {
	// 	// console.log(val);
	// 	if (val === '1') {
	// 		if (this.reserveUidArr[0] && this.reserveUidArr[0] !== 0) {
	// 			this.reserveUid1 = true;
	// 		} else {
	// 			this.reserveUid1 = false;
	// 		}
	// 		this.reserveUid2 = true;
	// 	} else if (val === '2') {
	// 		if (this.reserveUidArr[1] && this.reserveUidArr[1] !== 0) {
	// 			this.reserveUid2 = true;
	// 		} else {
	// 			this.reserveUid2 = false;
	// 		}
	// 		this.reserveUid1 = true;
	// 	}

	// 	this.form.reserveUid = this.reserveUidArr[(val === '1') ? 0 : 1];
	// }
}
</script>

<style lang="scss" scoped>
  // 預約資訊
  .info__card__wrap {
    margin-left: 30px;
    margin-right: 30px;
    @include rwd-sm {
      margin-left: 0;
      margin-right: 0;
    }
  }
  .reservation__info__wrap {
    padding: 20px 30px;
    @include rwd-xl {
      padding: 30px;
    }
  }
  .reservation__info__item {
    margin-top: 10px;
    @include rwd-lg {
      margin: 0 20px;
      padding: 0 10px;
    }
  }
  .info__item__title {
    font-size: 14px;
    font-weight: 600;
    color: $COLOR-BLACK;
    @include rwd-xl {
      font-size: 16px;
    }
  }
  .info__item__data {
    font-size: 16px;
    margin-top: 5px;
    @include rwd-xl {
      font-size: 18px;
      margin-top: 0;
    }
  }

  // 基本資料填寫
  .form__card {
    background: $COLOR-MAIN10;
    padding: 20px 30px;
    @include rwd-sm {
      padding: 30px 92px;
    }
  }
  .form__card__title {
    font-size: 18px;
    font-weight: 600;
    color: $COLOR-BLACK;
    @include rwd-sm {
      font-size: 20px;
    }
  }
  .pageDoctorConsultReservationFormModel {
    margin-top: 20px;
    ::v-deep {
      .ant-form-item-control {
        line-height: 1.5;
      }
      .ant-form-item {
        margin-bottom: 0;
      }
      .ant-form-item-label {
        font-weight: 600;
        color: $COLOR-BLACK;
        line-height: 2;
        label {
          font-size: 14px;
          @include rwd-xl {
            font-size: 16px;
          }
        }
        .a-form-label__large {
          font-size: 14px;
          @include rwd-xl {
            font-size: 20px;
          }
          .mark-required {
            @include rwd-xl {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
  .mark-required {
    color: $ERROR-COLOR;
    vertical-align: top;
    display: inline-block;
    margin-left: 5px;
    font-weight: 600;
    font-size: 14px;
  }

  .btn__wrap {
    padding: 40px 30px 10px;
    margin: 0 -7px;
    @include rwd-sm {
      margin: 0 -8px;
    }
    @include rwd-xl {
      padding: 40px 30px;
    }
    button {
      width: 200px;
      max-width: 100%;
      margin-left: 7px;
      margin-right: 7px;
      margin-top: 0;
      @include rwd-sm {
        margin-left: 8px;
        margin-right: 8px;
      }
    }
  }

  ::v-deep {
    .ant-radio-disabled + span, .ant-input:disabled, .ant-input-number-disabled {
      color: #3d3d3d;
    }
		.ant-input {
      height: 36px;
    }
  }

	.radio-identity {
		::v-deep {
			.ant-form-item-children {
				display: flex;
				width: 100%;
				align-items: center;
			}
		}
	}

</style>
