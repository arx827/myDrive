<template>
  <div>
    <div
      v-if="action"
      class="container"
    >
      <div class="page__title">
        {{ action === 'add'?'新增':'編輯' }}預約資訊
      </div>
      <div class="page__card p-0 page__card--shadow">
        <div class="page__card__title page__card__headerTitle">
          預約資訊
        </div>
        <div class="reservation__info__wrap row">
          <div class="reservation__info__item col-md">
            <div class="info__item__title">
              預約地點
            </div>
            <div class="info__item__data">
              {{ infoData.reserveLoction }}
            </div>
          </div>
          <div class="reservation__info__item col-md">
            <div class="info__item__title">
              預約時間
            </div>
            <div class="info__item__data">
              {{ infoData.actDate }}
            </div>
          </div>
          <div class="reservation__info__item col-md">
            <div class="info__item__title">
              預約時段
            </div>
            <div class="info__item__data">
              {{ infoData.sessionStartDate }}~{{ infoData.sessionEndDate }}
            </div>
          </div>
          <div class="reservation__info__item col-md">
            <div class="info__item__title">
              值班醫師
            </div>
            <div class="info__item__data">
              {{ infoData.physicianName }}
            </div>
          </div>
        </div>
      </div>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="formRules"
        :layout="'vertical'"
        class="pageDoctorConsultReservationFormModel"
      >
        <div class="page__card form__card">
          <div class="form__card__title">
            基本資料填寫
          </div>

          <a-row
            type="flex"
            :gutter="16"
          >
            <!-- 公司 -->
            <a-col
              :span="24"
            >
              <label class="a-form-label">工作地點</label><span class="mark">＊</span>
              <a-form-model-item prop="workArea">
                <a-input
                  v-model="form.workArea"
                  placeholder="e.g. 台北市內湖區瑞湖街62號"
                  disabled
                />
              </a-form-model-item>
            </a-col>

            <!-- 預約人姓名 -->
            <a-col
              :xs="24"
              :md="12"
            >
              <label class="a-form-label">預約人姓名</label><span class="mark">＊</span>
              <a
                href="#"
                class="float-end"
                @click="queryModalVisible=true"
              ><a-icon type="search" /> 員工查詢</a>
              <a-form-model-item prop="reserveName">
                <a-input
                  v-model="form.reserveName"
                  placeholder="e.g. 蕭筠可"
                  type="text"
                  disabled
                />
              </a-form-model-item>
            </a-col>

            <!-- 職稱 -->
            <a-col
              :xs="24"
              :md="12"
            >
              <label class="a-form-label">職稱</label><span class="mark">＊</span>
              <a-form-model-item prop="title">
                <a-input
                  v-model="form.title"
                  placeholder="e.g. 專案襄理"
                  type="text"
                  disabled
                />
              </a-form-model-item>
            </a-col>

            <!-- 身份別/員工編號 -->
            <a-col
              :xs="24"
              :md="12"
            >
              <label class="a-form-label">身份別/員工編號</label><span class="mark">＊</span>
              <a-form-model-item
                ref="reserveUid"
                prop="reserveUid"
              >
                <a-radio-group
                  v-model="form.status"
                  disabled
                >
                  <a-row
                    type="flex"
                    :gutter="[15]"
                  >
                    <a-col
                      :span="24"
                      :sm="{ span:12 }"
                    >
                      <a-row
                        type="flex"
                        align="middle"
                        class="mb-2 mb-sm-0"
                      >
                        <a-radio value="1">
                          內勤
                        </a-radio>
                        <a-input
                          v-model="empId"
                          disabled
                          style="flex: 1;"
                          @blur="() => { $refs.reserveUid.onFieldBlur(); }"
                        />
                      </a-row>
                    </a-col>
                    <a-col
                      :span="24"
                      :sm="{ span:12 }"
                    >
                      <a-row
                        type="flex"
                        align="middle"
                      >
                        <a-radio
                          class="pt-2"
                          value="2"
                        >
                          外勤
                        </a-radio>
                        <a-input
                          v-model="id"
                          disabled
                          style="flex: 1;"
                          @blur="() => { $refs.reserveUid.onFieldBlur(); }"
                        />
                      </a-row>
                    </a-col>
                  </a-row>
                </a-radio-group>
              </a-form-model-item>
            </a-col>

            <!-- 部門/單位 -->
            <a-col
              :xs="24"
              :md="12"
            >
              <label class="a-form-label">部門單位</label><span class="mark">＊</span>
              <a-form-model-item prop="department">
                <a-input
                  v-model="form.department"
                  placeholder="e.g. 系統整合部 職安勤務長文科名科"
                  disabled
                />
              </a-form-model-item>
            </a-col>

            <!-- 總機/分機 -->
            <a-col
              :xs="24"
              :md="12"
            >
              <a-form-item
                :validate-status="checkOperatorNo? 'success' : 'error'"
                :help="checkOperatorNo? '' : operatorErrorMsg"
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
                      @input="checkOperatorNoValidate"
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
                      @input="checkOperatorNoValidate"
                    >
                  </a-col>
                </a-row>
              </a-form-item>
              <!-- <label class="a-form-label">總機/分機</label><span class="mark">＊</span>
              <a-row
                type="flex"
                align="middle"
                :gutter="[5]"
              >
                <a-col :span="15">
                  <a-form-model-item prop="operatorNo">
                    <a-input
                      v-model="form.operatorNo"
                      placeholder="e.g. 333561"
                      type="text"
                      vue="true"
                      alt="webfont"
                      :max-length="15"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="1">
                  <p class="mb-4 text-center">
                    #
                  </p>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item prop="extNo">
                    <a-input
                      v-model="form.extNo"
                      placeholder="e.g. 85707"
                      type="text"
                      vue="true"
                      alt="webfont"
                      :max-length="15"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row> -->
            </a-col>

            <!-- 行動電話 -->
            <a-col
              :xs="24"
              :md="12"
            >
              <a-form-item
                :validate-status="checkMobileNo ? 'success' : 'error'"
                :help="checkMobileNo ? '' : mobileErrorMsg"
              >
                <span slot="label">
                  行動電話<span class="mark-required">*</span>
                </span>
                <input
                  v-model="form.mobileNo"
                  v-mask="'##########'"
                  class="ant-input"
                  placeholder="e.g. 0918372888"
                  @input="checkMobileNoValidate"
                  @blur="checkMobileNoLength"
                >
              </a-form-item>
              <!-- <label class="a-form-label">行動電話</label><span class="mark">＊</span>
              <a-form-model-item prop="mobileNo">
                <a-input
                  v-model="form.mobileNo"
                  placeholder="e.g. 0918372888"
                  type="text"
                  :max-length="15"
                />
              </a-form-model-item> -->
            </a-col>

            <!-- 健康諮詢項目簡述 -->
            <a-col :xs="24">
              <label class="a-form-label">健康諮詢項目簡述 (字數上限500字)</label><span class="mark">＊</span>
              <a-form-model-item prop="description">
                <a-textarea
                  v-model="form.description"
                  placeholder="字數上限500字。"
                  :max-length="500"
                  :auto-size="{ minRows: 6 }"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <div class="page__footer__control btn__wrap">
        <div class="d-flex justify-content-center">
          <button
            class="btn__radius--primary--outline"
            @click="onBack"
          >
            取消
          </button>
          <button
            class="btn__radius--primary"
            @click="onNext"
          >
            確定
          </button>
        </div>
      </div>
    </div>
    <staff-query-modal
      :visible="queryModalVisible"
      @close-modal="closeQueryModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import moment from 'moment';
import { Action } from 'vuex-class';
import {
	ReserveAddInDto,
 	ReserveUpdateInDto,
} from '@fubonlife/oss-api-axios-sdk';
import StaffQueryModal from '@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/StaffQueryModal.vue';
import notification from '@/plugins/notification/infoNotification';

require('bootstrap/js/dist/modal');

@Component({ components: { Breadcrumb, StaffQueryModal } })
export default class SendNoticeModifyReserveConfirm extends Vue {
  @Action('setLoading') setLoading;

  // 預約資訊
  infoData = {};

  // add edit
  action = '';

  // 當前router
  currentRouterName = '';

  // 表單
  form: ReserveAddInDto | ReserveUpdateInDto = {
  	workArea: '',
  	reserveName: '',
  	title: '',
  	status: '1', // 內勤1 外勤2
  	reserveUid: null,
  	sessionId: null,
  	department: '',
  	operatorNo: '',
  	extNo: '',
  	mobileNo: '',
  	description: '',
  };

  empId = null;

  id = null;

  // 檢核規則
  formRules = {
  	workArea: [{ required: true, message: '工作地點不可為空', trigger: 'blur' }],
  	reserveName: [{ required: true, message: '預約人姓名不可為空', trigger: 'blur' }],
  	title: [{ required: true, message: '職稱不可為空', trigger: 'blur' }],
  	reserveUid: [{ required: true, message: '員工編號不可為空', trigger: 'blur' }],
  	department: [{ required: true, message: '部門單位不可為空', trigger: 'blur' }],
  	operatorNo: [{ validator: this.checkOperatorNoValidate, trigger: 'blur' }],
  	mobileNo: [{ validator: this.checkMobileNoValidate, trigger: 'blur' }], // 當 operatorNo 為空時 檢核
  	description: [{ required: true, message: '簡述不可為空', trigger: 'blur' }],
  };

  // 選擇大樓 下拉選項
  buildingOptions = [];

  queryModalVisible = false // 員工查詢modal

  closeQueryModal(data) {
  	console.log(data);
  	this.queryModalVisible = false;
  	this.getEmpName(data);
  }

  getDropDown() {
  	this.setLoading(true);
  	// 查詢職場大樓
  	this.$PCREmpPhysicianConsultControllerApi.getWorkBuildingInfoUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				resp.data.data.forEach((item) => {
  					this.buildingOptions.push({
  						value: item.wbInfoId,
  						label: item.buildingName,
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

  // // 判斷 總機/分機 || 行動電話
  // checkOperatorNo(rule, value, callback) {
  // 	// 先判斷 operatorNo 再判斷 mobileNo (擇一)
  // 	if (!this.form.operatorNo && !this.form.mobileNo) {
  // 		callback('總機/分機、行動電話 請擇一填寫');
  // 	} else {
  // 		callback();
  // 	}
  // }

  /**
   * 檢核
   */
  mobileErrorMsg = '';

  operatorErrorMsg = '';

  checkOperatorNo = true;

  checkMobileNo = true;

  checkOperatorNoValidate() {
  	if (this.form.status == '1') {
  		if ((this.form.operatorNo && this.form.operatorNo.trim() !== '') && (this.form.extNo && this.form.extNo.trim() !== '')) {
  			this.checkOperatorNo = true;
  			this.operatorErrorMsg = '';
  		} else {
  			this.checkOperatorNo = false;
  			this.operatorErrorMsg = '請填寫總機/分機';
  		}
  	}
  }

  checkMobileNoValidate() {
  	if (this.form.status == '2') {
  		if ((this.form.mobileNo && this.form.mobileNo.trim() !== '')) {
  			this.checkMobileNo = true;
  			this.mobileErrorMsg = '';
  		} else {
  			this.checkMobileNo = false;
  			this.mobileErrorMsg = '請填寫行動電話';
  		}
  	}
  }

  // checkOperatorNoAndMobileNoValidate() {
  // 	if ((this.form.operatorNo && this.form.operatorNo.trim() !== '') || (this.form.mobileNo && this.form.mobileNo.trim() !== '')) {
  // 		this.checkMobileNo = true;
  // 		this.mobileErrorMsg = '';
  // 	} else {
  // 		this.checkMobileNo = false;
  // 		this.mobileErrorMsg = '總機/分機、行動電話 請至少填寫一個';
  // 	}
  // }

  // 判斷行動電話 長度不可小於10
  checkMobileNoLength() {
  	if (!this.form.mobileNo) {
  		return;
  	}
  	if (this.form.mobileNo.length === 10) {
  		this.checkMobileNo = true;
  		this.mobileErrorMsg = '';
  	} else {
  		this.checkMobileNo = false;
  		this.mobileErrorMsg = '請填寫有效行動電話';
  	}
  }

  created() {
  	this.setParam();
  	this.getDropDown();
  }

  setParam() {
  	this.currentRouterName = this.$route.name;
  	if (this.$route.params.type === 'add') {
  		this.action = 'add';
  	} else {
  		this.action = 'edit';
  	}
  	this.getData();
  }

  getData() {
  	const query = this.$global.getQuery();
  	this.infoData = query.data;
  	if (this.action === 'edit') {
  		this.form = query.editData;
  		this.empId = query.editData.empId;
  		this.form.status = query.editData.jobType ? query.editData.jobType.toString() : null;
  		if (this.form.status == '2') {
  			this.id = query.editData.id;
  		}
  	} else {
  		this.form.sessionId = query.data.sessionId;
  	}
  }

  // 員工查詢後帶入姓名,工作地點,職稱,內(員編)外勤身分,部門單位,總機/分機,行動電話
  getEmpName(data) {
  	console.log(data);
  	if (!data) return;
  	this.form.workArea = data.workArea;
  	this.form.reserveName = data.userName;
  	this.form.title = data.title;
  	this.form.status = data.jobType.toString(); // 內勤1 外勤2
  	this.form.department = data.department;
  	this.form.operatorNo = data.telNo;
  	this.form.extNo = data.extNo;
  	this.form.mobileNo = data.mobileNo;
  	this.form.reserveUid = data.uid;
  	this.empId = data.userId;
  	if (this.form.status == '2') { // 外勤才有身分證
  		this.id = data.id;
  	}
  	this.checkOperatorNo = true;
  	this.checkMobileNo = true;
  	(this.$refs.ruleForm as any).clearValidate();
  }

  // 取消
  onBack() {
  	this.$router.back();
  }

  // 確定
  onNext() {
  	this.checkOperatorNoValidate();
  	this.checkMobileNoValidate();
  	this.checkMobileNoLength();
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid && this.checkMobileNo && this.checkOperatorNo) {
  			if (this.action === 'edit') {
  				this.setLoading(true);
  				// 編輯預約-執行修改
  				this.$PCRRpnSendRemindAndModifyReservationApi.updateReserveUsingPOST(this.form)
  					.then((resp) => {
  						if (resp.data.status === 200) {
  							this.$global.changeRouterAndaddParam({
  								toRouter: 'SendNoticeModifyReserveConfirmResult',
  								params: {
  									type: 'edit',
  								},
  								query: {
  									data: this.infoData,
  									result: 'success',
  								},
  							});
  						} else {
  							this.$global.changeRouterAndaddParam({
  								toRouter: 'SendNoticeModifyReserveConfirmResult',
  								params: {
  									type: 'edit',
  								},
  								query: {
  									result: 'fail',
  									message: this.$global.getApiErrorMsg(resp.data.apiError),
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
  			} else {
  				this.setLoading(true);
  				console.log(this.form);
  				// 新增預約
  				this.$PCRRpnSendRemindAndModifyReservationApi.addReserveUsingPOST(this.form)
  					.then((resp) => {
  						if (resp.data.status === 200) {
  							this.$global.changeRouterAndaddParam({
  								toRouter: 'SendNoticeModifyReserveConfirmResult',
  								params: {
  									type: 'add',
  								},
  								query: {
  									data: this.infoData,
  									empName: this.form.reserveName,
  									result: 'success',
  								},
  							});
  						} else {
  							this.$global.changeRouterAndaddParam({
  								toRouter: 'SendNoticeModifyReserveConfirmResult',
  								params: {
  									type: 'add',
  								},
  								query: {
  									result: 'fail',
  									message: this.$global.getApiErrorMsg(resp.data.apiError),
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
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .write__card {
    margin-top: 20px;
    padding: 30px 90px;
    border: 0.5px solid #CED4D9;
    border-radius: 10px;
  }

  // 預約資訊
  .reservation__info__wrap {
    padding: 10px;
    padding-left: 50px;
  }
  .reservation__info__item {
    margin: 10px 0;
  }
  .info__item__title {
    font-size: 16px;
    font-weight: 600;
    color: $COLOR-BLACK;
  }
  .info__item__data {
    font-size: 18px;
  }

  // 基本資料填寫
  .form__card {
    background: $COLOR-MAIN10;
    padding: 30px 50px;
    @include rwd-sm {
      padding: 30px 92px;
    }
  }
  .form__card__title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .pageDoctorConsultReservationFormModel {
    margin-top: 20px;
    ::v-deep {
      .ant-form-item-control {
        line-height: 2;
      }
    }
  }
  // .ant-form label {
  //   margin-bottom: 25px;
  // }
  .mark {
    width: 20px;
    height: 20px;
    color: #FC001A;
    font-size: 25px;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 27px;
  }

  ::v-deep {
    .ant-radio-disabled + span, .ant-input:disabled, .ant-input-number-disabled {
      color: #3d3d3d;
    }
    .ant-input, .ant-select-selection--single, .ant-select-selection__rendered {
      height: 40px;
    }
    .ant-select-selection-selected-value {
      padding-top: 5px;
    }
    .mx-input {
      font-size: 16px;
      height: 40px;
    }
    textarea.ant-input {
      padding: 8px 11px;
    }
  }
</style>
