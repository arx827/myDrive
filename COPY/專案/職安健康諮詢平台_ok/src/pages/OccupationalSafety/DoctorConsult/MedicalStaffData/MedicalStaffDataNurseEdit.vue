<template>
  <div>
    <div class="container nurse__page">
      <h2 class="page__title">
        編輯護理人員資訊
      </h2>
      <div class="staff">
        <div class="colored" />
        <div class="face" />
        <p class="user__name">
          {{ nurseInfo.nurseName }}
        </p>
        <div class="staff__info">
          <div class="staff__info__detail">
            <p class="staff__info__detail__label">
              身分證字號
            </p>
            <p class="staff__info__detail__text">
              {{ nurseInfo.idNo ? nurseInfo.idNo : '-  -' }}
            </p>
          </div>
          <div class="staff__info__detail">
            <p class="staff__info__detail__label">
              員工編號
            </p>
            <p class="staff__info__detail__text">
              {{ nurseInfo.adId ? nurseInfo.adId : '-  -' }}
            </p>
          </div>
          <div class="staff__info__detail">
            <p class="staff__info__detail__label">
              出生年月日
            </p>
            <p class="staff__info__detail__text">
              {{ nurseInfo.birthday ? nurseInfo.birthday : '-  -' }}
            </p>
          </div>
          <div class="staff__info__detail">
            <p class="staff__info__detail__label">
              部門單位
            </p>
            <p class="staff__info__detail__text">
              {{ nurseInfo.department ? nurseInfo.department : '-  -' }}
            </p>
          </div>
          <div class="staff__info__detail">
            <p class="staff__info__detail__label">
              工作縣市
            </p>
            <p class="staff__info__detail__text">
              {{ nurseInfo.workArea ? nurseInfo.workArea : '-  -' }}
            </p>
          </div>
        </div>
      </div>
      <a-form-model
        ref="formRef"
        :model="form"
        :rules="formRule"
        layout="horizontal"
      >
        <div class="report row gx-2">
          <div class="col">
            <div class="report__data bg__light">
              <h4>衛生福利部報備資訊</h4>
              <a-form-model-item
                label="證書類別"
                prop="hwCertificateType"
              >
                <a-select
                  v-model="form.hwCertificateType"
                  placeholder="請選擇證書類別"
                  :default-value="form.hwCertificateType"
                >
                  <a-select-option value="A0201">
                    護士
                  </a-select-option>
                  <a-select-option value="A0202">
                    護理師
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                label="證書字號"
                prop="hwCertificateNo"
              >
                <a-input
                  v-model="form.hwCertificateNo"
                  placeholder="e.g. 12345678"
                />
              </a-form-model-item>
              <a-form-model-item
                label="執照字號"
                prop="hwLicenseNo"
              >
                <a-input
                  v-model="form.hwLicenseNo"
                  placeholder="e.g. 12345678"
                />
              </a-form-model-item>
              <a-form-model-item
                label="執業登記日期"
                prop="hwPracticeRegistDate"
              >
                <date-picker
                  v-model="form.hwPracticeRegistDate"
                  placeholder="請選擇日期"
                  type="date"
                  style="width: 100%"
                  :formatter="formatter"
                  :default-value="form.hwPracticeRegistDate"
                />
              </a-form-model-item>
              <a-form-model-item
                label="執照更新日期"
                prop="hwLicenseUpdateDate"
              >
                <date-picker
                  v-model="form.hwLicenseUpdateDate"
                  type="date"
                  placeholder="請選擇日期"
                  :formatter="formatter"
                  style="width: 100%"
                />
              </a-form-model-item>
              <a-form-model-item
                label="執照到期日期"
                prop="hwLicenseExpireDate"
              >
                <date-picker
                  v-model="form.hwLicenseExpireDate"
                  type="date"
                  placeholder="請選擇日期"
                  :formatter="formatter"
                  style="width: 100%"
                />
              </a-form-model-item>
              <a-form-model-item
                label="護理積分"
                prop="hwNursePoints"
              >
                <a-input
                  v-model="form.hwNursePoints"
                  placeholder="e.g. 10"
                />
              </a-form-model-item>
              <a-form-model-item
                label="報備支援期間開始/結束"
                prop="hwSupportDate"
              >
                <date-picker
                  v-model="form.hwSupportDate"
                  placeholder="請選擇日期"
                  type="date"
                  :allow-clear="true"
                  :range="true"
                  :formatter="formatter"
                  :editable="true"
                  style="width: 100%"
                />
              </a-form-model-item>
              <a-form-model-item
                label="報備地點"
                prop="hwSupportLocation"
              >
                <a-input
                  v-model="form.hwSupportLocation"
                  placeholder="e.g. 台北市"
                />
              </a-form-model-item>
              <a-form-model-item
                prop="hwRemark"
                label="備註(字數上限500字)"
              >
                <a-textarea
                  v-model="form.hwRemark"
                  placeholder="字數上限500字"
                  :auto-size="{ minRows: 4 }"
                />
              </a-form-model-item>
            </div>
          </div>

          <div class="col">
            <div class="report__data bg__light">
              <h4>勞動部職安署報備資訊</h4>
              <a-form-model-item
                label="證書字號"
                prop="oshaCertificateNo"
              >
                <a-input
                  v-model="form.oshaCertificateNo"
                  placeholder="e.g. 1234567890"
                />
              </a-form-model-item>
              <a-form-model-item
                label="發證日期"
                prop="oshaIssueDate"
              >
                <date-picker
                  v-model="form.oshaIssueDate"
                  type="date"
                  placeholder="請選擇日期"
                  style="width: 100%"
                  :formatter="formatter"
                />
              </a-form-model-item>
              <a-form-model-item
                label="下次回訓期限"
                prop="oshaTrainingDate"
              >
                <date-picker
                  v-model="form.oshaTrainingDate"
                  type="date"
                  placeholder="請選擇日期"
                  style="width: 100%"
                  :formatter="formatter"
                />
              </a-form-model-item>
              <a-form-model-item
                prop="oshaRemark"
                label="備註"
              >
                <a-textarea
                  v-model="form.oshaRemark"
                  placeholder="字數上限500字"
                  :auto-size="{ minRows: 4 }"
                />
              </a-form-model-item>
            </div>
          </div>
        </div>
      </a-form-model>
      <div class="form__check-block">
        <button
          class="btn__main btn__main--light"
          @click="onCancel"
        >
          取消
        </button>
        <button
          class="btn__main btn__main--primary"
          @click="onSubmit"
        >
          確認
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { NurseInfoDetailDto, NurseInfoSaveModel } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

@Component
export default class MedicalStaffDataNurseEdit extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

  formatter = this.$twDateFormatter;

  nurseInfo: NurseInfoDetailDto = {
  	nurseName: '',
  	idNo: '',
  	department: '',
  	birthday: '',
  	workArea: '',
  }

  postRequest: NurseInfoSaveModel

  queryId: number

  form = {
  	hwSupportDate: null,
  	hwSupportEndDate: null,
  	hwSupportStartDate: null,
  	hwCertificateType: '',
  	hwCertificateNo: '',
  	hwLicenseNo: '',
  	hwPracticeRegistDate: null,
  	hwLicenseUpdateDate: null,
  	hwLicenseExpireDate: null,
  	hwNursePoints: '',
  	hwSupportLocation: '',
  	hwRemark: '',
  	oshaIssueDate: null,
  	oshaCertificateNo: '',
  	oshaTrainingDate: null,
  	oshaRemark: '',
  }

  formRule={
  	hwCertificateType: [{ required: true, trigger: 'change', message: '證書類別為必填' }],
  	hwCertificateNo: [{ required: true, trigger: 'change', message: '證書字號為必填' }],
  	hwLicenseNo: [{ required: true, trigger: 'change', message: '執照字號為必填' }],
  	hwPracticeRegistDate: [{ required: true, trigger: 'change', message: '執業登記日期為必填' }],
  	hwLicenseUpdateDate: [{ required: true, trigger: 'change', message: '執照更新日期為必填' }],
  	hwLicenseExpireDate: [{ required: true, trigger: 'change', message: '執照到期日期為必填' }],
  	hwNursePoints: [{ required: true, trigger: 'change', message: '護理積分為必填' }],
  	hwSupportLocation: [{ validator: this.checkLocation, trigger: 'change' }],
  	oshaIssueDate: [{ required: true, trigger: 'change', message: '發證日期為必填' }],
  	oshaTrainingDate: [{ required: true, trigger: 'change', message: '下次回訓日期為必填' }],
  	oshaCertificateNo: [{ required: true, trigger: 'change', message: '證書字號為必填' }],
  }

  checkLocation(rule, value, callback) {
  	if (this.form.hwSupportDate[0] || this.form.hwSupportDate[1]) {
  		if (!value || value === '') {
  			console.log('支援期間有值,我空值');
  			callback(new Error('支援期間已填，報備地點為必填'));
  		} else {
  			callback();
  		}
  	} else {
  		callback();
  	}
  }

  async created() {
  	await this.getData();
  	// this.setData();
  }

  async getData() {
  	this.queryId = this.$global.getQuery();
  	await this.$PCRRpnMedStaffInfoManagementApi.getOneNurseInfoRUsingPOST(this.queryId).then((resp) => {
  		if (resp.data.status === 200) {
  			this.setData(resp.data.data);
  		}
  	}).catch((err) => {
  		console.log(err);
  	}).finally(() => {
  		this.setLoading(false);
  	});
  }

  setData(data) {
  	this.nurseInfo = data;
  	console.log(this.nurseInfo);
  	this.nurseInfo.birthday = moment(this.nurseInfo.birthday).format('YYYY/MM/DD');
  	this.form.hwSupportDate = [new Date(this.nurseInfo.hwSupportStartDate), new Date(this.nurseInfo.hwSupportEndDate)];
  	this.form.hwCertificateType = String(this.nurseInfo.hwCertificateType);
  	this.form.hwCertificateNo = this.nurseInfo.hwCertificateNo;
  	this.form.hwLicenseNo = this.nurseInfo.hwLicenseNo;
  	this.form.hwPracticeRegistDate = new Date(this.nurseInfo.hwPracticeRegistDate);
  	this.form.hwLicenseUpdateDate = new Date(this.nurseInfo.hwLicenseUpdateDate);
  	this.form.hwLicenseExpireDate = new Date(this.nurseInfo.hwLicenseExpireDate);
  	this.form.hwNursePoints = this.nurseInfo.hwNursePoints;
  	this.form.hwSupportLocation = this.nurseInfo.hwSupportLocation;
  	this.form.hwRemark = this.nurseInfo.hwRemark;
  	this.form.oshaCertificateNo = this.nurseInfo.oshaCertificateNo;
  	this.form.oshaIssueDate = new Date(this.nurseInfo.oshaIssueDate);
  	this.form.oshaTrainingDate = new Date(this.nurseInfo.oshaTrainingDate);
  	this.form.oshaRemark = this.nurseInfo.oshaRemark;
  }

  onCancel() {
  	this.$router.back();
  }

  onSubmit() {
  	(this.$refs.formRef as any).validate()
  		.then(() => {
  			this.form.hwSupportStartDate = this.form.hwSupportDate[0];
  			this.form.hwSupportEndDate = this.form.hwSupportDate[1];
  			delete this.form.hwSupportDate;
  			this.postRequest = {
  				...this.form,
  				hwSupportStartDate: this.form.hwSupportStartDate.toISOString(),
  				hwSupportEndDate: this.form.hwSupportEndDate.toISOString(),
  				hwLicenseExpireDate: this.form.hwLicenseExpireDate.toISOString(),
  				hwLicenseUpdateDate: this.form.hwLicenseUpdateDate.toISOString(),
  				hwPracticeRegistDate: this.form.hwPracticeRegistDate.toISOString(),
  				oshaIssueDate: this.form.oshaIssueDate.toISOString(),
  				oshaTrainingDate: this.form.oshaTrainingDate.toISOString(),
  				nurseInfoId: this.nurseInfo.nurseInfoId,
  				updDt: null,
  				updUid: null,
  			};
  			// console.log(this.postRequest);
  			this.setLoading(true);
  			this.$PCRRpnMedStaffInfoManagementApi.saveNurseInfoRUsingPOST(this.postRequest).then((resp) => {
  				if (resp.status === 200) {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'MedicalStaffDataNurseResult',
  						params: {
  							type: 'edit',
  						},
  						query: {
  							result: 'success',
  						},
  					});
  				} else {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'MedicalStaffDataNurseResult',
  						params: {
  							type: 'edit',
  						},
  						query: {
  							result: 'fail',
  							msg: this.$global.getApiErrorMsg(resp.data.apiError).join('、'),
  						},
  					});
  				}
  			}).catch((err) => {
  				console.log(err);
  			}).finally(() => {
  				this.setLoading(false);
  			});
  	})
  		.catch((err) => {
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  		});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.staff{
  border: 0.5px solid #D9D9D9;
  box-shadow: 0px 3px 0px #C9C9C9;
  border-radius: 4px;
  position: relative;
  padding:21px 92px ;
}
.face{
  background-image: url('../../../../assets/images/image_face.svg');
  background-repeat: no-repeat;
  position: absolute;
  object-fit: cover;
  width: 8%;
  height: 62%;
  right:0px;
  top:0px;
  background-position: top right;
}
.colored{
  height: 100%;
  position: absolute;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  left: 0px;
  top: 0px;
  background-color: $COLOR-MAIN1;
  width: 10px;
}
.user__name{
  font-weight: bold;
  font-size: 18px;
  color: #000;
  margin: 0;
}
.staff__info{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.staff__info__detail{
  color: #000;
  margin-top: 15px;
  .staff__info__detail__label{
    font-weight: bold;
    margin: 0;
  }
  .staff__info__detail__text{
    font-size: 18px;
    margin: 0;
  }
}
::v-deep .nurse__page{
  .ant-form{
    height: 100%;
  }
  .ant-form-item-label{
    font-weight: bold;
  }
  .ant-form-item-label{
    line-height: 18px;
  }

  input::-webkit-input-placeholder , textarea::-webkit-input-placeholder{
    font-size: 14px;
    color: #999999;
  }
  .mx-input{
    width: 100%;
    height: 40px;
    border: 1px solid #D9D9D9;
    font-size: 16px;
    color: #000;
  }
  .ant-input{
    border: 1px solid #D9D9D9;
  }
  input.ant-input{
    height: 40px;
  }
  textarea.ant-input{
    padding: 14px 18px;
  }
  .ant-select-selection--single{
    height: 40px;
  }
  .ant-select-selection__rendered{
    height: 100%;
    display: flex;
    align-items: center;
  }
}

.report{
  margin: 0;
  margin-top:20px;

}
.report__data{
  height: 100%;
  padding: 24px 92px;
  border-radius: 10px;
  h4 {
    color: #50BDC6;
    font-weight: bold;
    font-size: 20px;
  }
}
.form__check-block{
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 80px;
  button{
    margin: 0px 5px;
  }
  .btn__main{
    padding: 9px 84px;
  }
}
</style>
