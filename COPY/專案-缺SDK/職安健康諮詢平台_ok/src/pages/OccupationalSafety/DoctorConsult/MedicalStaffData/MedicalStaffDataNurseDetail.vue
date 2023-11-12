<template>
  <div>
    <div class="container">
      <div class="page__top">
        <h2 class="page__title">
          護理人員資訊
        </h2>
        <button
          class="btn__radius--primary--outline--small"
          @click="clickEdit"
        >
          編輯
        </button>
      </div>
      <div class="staff">
        <div class="colored" />
        <div class="face" />
        <p class="user__name">
          {{ nurseName }}
        </p>
        <div class="staff__info">
          <template v-for="(item, index) in nurseDataList">
            <div
              v-if="item.category == 'personalInfo' "
              :key="index"
              class="staff__info__detail"
            >
              <template>
                <p class="staff__info__detail__label">
                  {{ item.title }}
                </p>
                <p
                  v-if="item.value"
                  class="staff__info__detail__text"
                >
                  {{ item.value }}
                </p>
                <p
                  v-else
                  class="staff__info__detail__text"
                >
                  -  -
                </p>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="report row gx-3">
        <div class="col">
          <div class="report__data bg__light">
            <h4>衛生福利部報備資訊</h4>
            <template v-for="(item, index) in nurseDataList">
              <div
                v-if="item.category == 'hwInfo'"
                :key="index"
                class="report__data__block"
              >
                <template v-if="item.title == '證書類別'">
                  <label>{{ item.title }}</label>
                  <p> {{ item.value == "A0201" ? '護士' : '護理師' }} </p>
                </template>
                <template v-else>
                  <label>{{ item.title }}</label>
                  <p v-if="item.value">
                    {{ item.value }}
                  </p>
                  <p v-else>
                    -  -
                  </p>
                </template>
              </div>
            </template>
          </div>
        </div>
        <div class="col">
          <div class="report__data bg__light">
            <h4>勞動部職安署報備資訊</h4>
            <template v-for="(item, index) in nurseDataList">
              <div
                v-if="item.category == 'oshaInfo'"
                :key="index"
                class="report__data__block"
              >
                <template>
                  <label>{{ item.title }}</label>
                  <p v-if="item.value">
                    {{ item.value }}
                  </p>
                  <p v-else>
                    -  -
                  </p>
                </template>
              </div>
            </template>
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
import { Action } from 'vuex-class';
import { NurseInfoDetailDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

@Component
export default class MedicalStaffDataNurseDetail extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

  queryId: number

  nurseInfoDetail: NurseInfoDetailDto = {}

  nurseDataList = []

  nurseName = null

  nurseData = {
  	personalInfo: {
  		idNum: 'G123456789',
  		crtNo: '#00000',
  		birth: '1998/9/26',
  		department: '職業管理部',
  		city: '屏東縣',
  	},
  	healthInfo: {
  		certificationType: 'RPN',
  		certificationNum: 1234567890,
  		registerNum: 987654321,
  		registerDate: '2022/01/01',
  		updateDate: '2022/01/02',
  		deadLine: '2022/01/03',
  		nurseScore: 10,
  		supportRange: ['2022/01/01', '2022/01/03'],
  		location: '文字說明',
  		note: null,
  	},
  	laborInfo: {
  		certificationDate: '2022/01/01',
  		certificationNum: '1234567789',
  		nextTraining: null,
  		note: null,
  	},
  }

  getData() {
  	this.queryId = this.$global.getQuery();
  	this.$PCRRpnMedStaffInfoManagementApi.getOneNurseInfoRUsingPOST(this.queryId).then((resp) => {
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
  	this.nurseInfoDetail = data;
  	const start = moment(this.nurseInfoDetail.hwSupportStartDate).format('YYYY/MM/DD');
  	const end = moment(this.nurseInfoDetail.hwSupportEndDate).format('YYYY/MM/DD');
  	this.nurseName = this.nurseInfoDetail.nurseName;
  	this.nurseDataList = [
  		{
  			category: 'personalInfo',
  			title: '身分證字號',
  			property: 'idNo',
  			value: this.nurseInfoDetail.idNo,
  		},
  		{
  			category: 'personalInfo',
  			title: '員工編號',
  			property: 'adId',
  			value: this.nurseInfoDetail.adId,
  		},
  		{
  			category: 'personalInfo',
  			title: '出生年月日',
  			property: 'birthday',
  			value: moment(this.nurseInfoDetail.birthday).format('YYYY/MM/DD'),
  		},
  		{
  			category: 'personalInfo',
  			title: '部門單位',
  			property: 'department',
  			value: this.nurseInfoDetail.department,
  		},
  		{
  			category: 'personalInfo',
  			title: '工作縣市',
  			property: 'workArea',
  			value: this.nurseInfoDetail.workArea,
  		},
  		{
  			category: 'hwInfo',
  			title: '證書類別',
  			property: 'hwCertificateType',
  			value: this.nurseInfoDetail.hwCertificateType,
  		},
  		{
  			category: 'hwInfo',
  			title: '證書字號',
  			property: 'hwCertificateNo',
  			value: this.nurseInfoDetail.hwCertificateNo,
  		},
  		{
  			category: 'hwInfo',
  			title: '執照字號',
  			property: 'hwLicenseNo',
  			value: this.nurseInfoDetail.hwLicenseNo,
  		},
  		{
  			category: 'hwInfo',
  			title: '執業登記日期',
  			property: 'hwPracticeRegistDate',
  			value: moment(this.nurseInfoDetail.hwPracticeRegistDate).format('YYYY/MM/DD'),
  		},
  		{
  			category: 'hwInfo',
  			title: '執照更新日期',
  			property: 'hwLicenseUpdateDate',
  			value: moment(this.nurseInfoDetail.hwLicenseUpdateDate).format('YYYY/MM/DD'),
  		},
  		{
  			category: 'hwInfo',
  			title: '執照到期日期',
  			property: 'hwLicenseExpireDate',
  			value: moment(this.nurseInfoDetail.hwLicenseExpireDate).format('YYYY/MM/DD'),
  		},
  		{
  			category: 'hwInfo',
  			title: '護理積分',
  			property: 'hwNursePoints',
  			value: this.nurseInfoDetail.hwNursePoints,
  		},
  		{
  			category: 'hwInfo',
  			title: '報備支援期間開始/結束',
  			property: 'hwSupportStartDate',
  			value: `${start} - ${end}`,

  		},
  		{
  			category: 'hwInfo',
  			title: '報備地點',
  			property: 'hwSupportLocation',
  			value: this.nurseInfoDetail.hwSupportLocation,
  		},
  		{
  			category: 'hwInfo',
  			title: '備註',
  			property: 'hwRemark',
  			value: this.nurseInfoDetail.hwRemark,
  		},
  		{
  			category: 'oshaInfo',
  			title: '證書字號',
  			property: 'oshaCertificateNo',
  			value: this.nurseInfoDetail.oshaCertificateNo,
  		},
  		{
  			category: 'oshaInfo',
  			title: '發證日期',
  			property: 'oshaIssueDate',
  			value: moment(this.nurseInfoDetail.oshaIssueDate).format('YYYY/MM/DD'),
  		},
  		{
  			category: 'oshaInfo',
  			title: '下次回訓期限',
  			property: 'oshaTrainingDate',
  			value: moment(this.nurseInfoDetail.oshaTrainingDate).format('YYYY/MM/DD'),
  		},
  		{
  			category: 'oshaInfo',
  			title: '備註',
  			property: 'oshaRemark',
  			value: this.nurseInfoDetail.oshaRemark,
  		},
  	];
  }

  created() {
  	this.getData();
  }

  clickEdit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'MedicalStaffDataNurseEdit',
  		query: this.queryId,
  	});
  }
}
</script>

<style lang="scss" scoped>
.page__top{
  display: flex;
  justify-content: space-between;
  margin: 20px 0px;
}
.page__title{
  margin: 0;
}
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
.report{
  margin: 0;
  margin-top:20px;
  padding-bottom: 50px;
  .col:first-child{
    padding-left: 0px;
  }
  .col:last-child{
    padding-right: 0px;
  }
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
.report__data__block{
  color: #000;
  label{
    font-weight: bold;

  }
}
</style>
