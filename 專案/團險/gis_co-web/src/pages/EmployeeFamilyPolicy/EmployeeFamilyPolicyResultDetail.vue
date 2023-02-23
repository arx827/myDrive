<template>
  <div class="outside">
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div
      v-if="pageParam!==null"
      class="container"
    >
      <div class="row">
        <div class="col">
          <div class="title">
            詳細投保內容
          </div>
        </div>
      </div>
      <div class="row">
        <div class="card px-3 px-lg-0">
          <div class="row user__info">
            <div class="col-2 col-lg-1 offset-0 offset-lg-1">
              <img
                v-if="userDatas.gender === '女'"
                class="user__img"
                src="@/assets/image_girl_small.svg"
              >
              <img
                v-else
                class="user__img"
                src="@/assets/image_boy_small.svg"
              >
            </div>
            <div class="col-9 col-lg-9 d-flex flex-column justify-content-between">
              <div class="user__title">
                被保險人資訊
              </div>
              <div class="user__name user__name--ch">
                {{ userDatas.name }}
              </div>
              <div class="user__name user__name--en">
                <!-- Fubon LineFubonLineFubonLineF -->
                {{ userDatas.englishName }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4 col-lg-4 offset-0 offset-lg-1">
              <div class="info__header">
                個人資料
              </div>
              <template v-for="item in data">
                <div
                  v-if="item.categrory == 'personInfo'"
                  :key="(item.key)"
                  class="info__item"
                >
                  <div class="info__item__title">
                    {{ item.title }}
                  </div>
                  <div class="info__item__content">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </div>
            <div class="col-4 col-lg-2">
              <div class="info__header">
                投保資料
              </div>
              <template v-for="item in data">
                <div
                  v-if="item.categrory == 'policy'"
                  :key="(item.key)"
                  class="info__item"
                >
                  <div class="info__item__title">
                    {{ item.title }}
                  </div>
                  <div class="info__item__content">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </div>
            <div class="col-4 col-lg-2 info__block">
              <div class="info__header">
                任職資料
              </div>
              <template v-for="item in data">
                <div
                  v-if="item.categrory == 'career' && item.isShow"
                  :key="(item.key)"
                  class="info__item"
                >
                  <div class="info__item__title">
                    {{ item.title }}
                  </div>
                  <div class="info__item__content">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </div>
            <!-- <div class="col-12 col-lg-2 info__block">
              <div class="info__header">
                備註
              </div>
              <template v-for="item in data">
                <div
                  v-if="item.categrory == 'remark'"
                  :key="(item.key)"
                  class="info__item"
                >
                  <div class="info__item__title">
                    {{ item.title }}
                  </div>
                  <div class="info__item__content">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </div> -->
          </div>
        </div>
      </div>
      <div class="row product__header">
        <div class="col-10 offset-0 offset-lg-1 product__header--bold">
          險種計畫
        </div>
      </div>
      <div
        v-if="contentDatas.length > 0"
        class="row bg--light product__content"
      >
        <div class="col-12 col-lg-10 offset-0 offset-lg-1">
          <div>
            <div class="product__content__hearder d-flex justify-content-between">
              <div class="header__text">
                投保內容（險種/計畫/保額）
              </div>
              <div class="header__text header__text--main">
                金額單位／新台幣TWD
              </div>
            </div>
            <div class="product__content__line product__content__line--main" />
            <ul>
              <li
                v-for="(content, index) in contentDatas"
                :key="index"
                class="product__content__item"
                :class="{'product__content__item--sub' : !content.insuranceName.includes('＊')}"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div class="item__title">
                    {{ content.insuranceName }}
                  </div>
                  <div class="item__cost">
                    {{ content.insuredUnit === '元' ? '$': '' }} {{ content.amount }} {{ content.insuredUnit }}
                  </div>
                </div>
              </li>
              <!-- <div
                v-show="index !== contentDatas.length - 1 && content.insuranceName.includes('＊')"
                class="product__content__line product__content__line--dash"
              /> -->
            </ul>
          </div>
        </div>
      </div>
      <div class="row product__back">
        <div class="block__btns text-center">
          <button
            class="btn__radius--primary"
            @click="onClick"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	InsuredInfo, EmpPolicyContentDto,
} from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import UserInfoCard from '@/components/shared/info/UserInfoCard.vue';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { UserInfoCard, Breadcrumb } })
export default class EmployeeFamilyproductResultDetail extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  backUrl = '/employeeFamilyPolicy/employeeFamilyPolicyResultTable';

  userDatas: InsuredInfo = {};

  contentDatas = [];

  pageParam = null;

  // Hook
  data = []

  formatVal(val) {
  	return val === null || val.length < 1 ? '' : val;
  }

  checkAuth() {
  	// 有薪資權限(一級權限)的人才能顯示部分資訊(提報工資,職保薪資)
  	const authList = this.$user.getMe().authNameList;
  	return !!authList.includes('一級權限');
  }

  checkIfTopAuth() {
  	// 一級權限人員才能查看detail
  	const authList = this.$user.getMe().authNameList;
  	console.log(authList);
  	return authList.includes('一級權限') ? 'Y' : 'N';
  }

  created() {
  	this.pageParam = this.$global.getParam();
  	if (this.pageParam === null) {
  		notification.error({
  			Content: '無查詢條件，請重新查詢',
  			onCallback: () => {
  				this.$router.push({ path: '/' }).catch((err) => { err; });
  			},
  		});
  		return;
  	}
  	this.setLoading(true);
  	const loginInfo = this.$user.getMe();
  	const policyDetail = this.$user.getPolicyDetail();
  	const query = this.$global.getParam().query;
  	const data: EmpPolicyContentDto = {
  		authority: this.checkIfTopAuth(), // 一級權限給Y
  		crtNo: query.crtNo,
  		crtSeq: query.crtSeq,
  		userId: loginInfo.userId,
  		policyModel: {
  			policyNo: policyDetail.poliId.toString(),
  			policySeq: policyDetail.poliSeq,
  			times: query.times,
  		},
  	};
  	console.log(data);
  	this.$employeeFamilyPolicyApi.onePolicyContentUsingPOST(data)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				const user = resp.data.data;
  				this.userDatas = user;
  				this.contentDatas = resp.data.data.insuredContent;
  				this.data = [
  					{
  						categrory: 'empName',
  						title: '員工姓名',
  						key: 'name',
  						value: this.formatVal(user.name),
  					},
  					{
  						categrory: 'personInfo',
  						title: '屬性',
  						key: 'insarrt',
  						value: this.formatVal(user.type),
  					},
  					{
  						categrory: 'personInfo',
  						title: '出生日期',
  						key: 'insBirthDate',
  						value: DateTimeFormmat.transformRocDate(user.birthday),
  					},
  					{
  						categrory: 'personInfo',
  						title: '國籍',
  						key: 'nationAlity',
  						value: this.formatVal(user.nationality),
  					},
  					{
  						categrory: 'personInfo',
  						title: '身分證字號/居留證號碼',
  						key: 'idNo',
  						value: this.formatVal(user.idNumber),
  					},
  					{
  						categrory: 'personInfo',
  						title: '電話',
  						key: 'phone',
  						value: this.formatVal(user.phoneNo),
  					},
  					{
  						categrory: 'personInfo',
  						title: '電子信箱',
  						key: 'mail',
  						value: this.formatVal(user.emailAddress),
  					},
  					{
  						categrory: 'policy',
  						title: '保險證號',
  						key: 'crtNo',
  						value: this.formatVal(user.insuranceNumber),
  					},
  					{
  						categrory: 'policy',
  						title: '加保日期',
  						key: 'jnDate',
  						value: DateTimeFormmat.transformRocDate(user.addDate),
  					},
  					{
  						categrory: 'policy',
  						title: '受益人',
  						key: 'beneficicary',
  						value: this.formatVal(user.beneficiary),
  					},
  					{
  						categrory: 'career',
  						title: '提報工資(TWD)',
  						key: 'salary',
  						value: this.formatVal(user.salary),
  						isShow: this.checkAuth(),
  					},
  					{
  						categrory: 'career',
  						title: '職保薪資(TWD)',
  						key: 'insuredSalary',
  						value: this.formatVal(user.insuredSalary),
  						isShow: this.checkAuth(),
  					},
  				];
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error.status);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  updated() {
  	window.parseWord();
  }

  onClick() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EmployeeFamilyPolicyResultTable',
  		query: {
  			pageQuery: this.pageParam.query.pageQuery,
  			pagination: this.pageParam.query.pagination,
  		},
  	});
  	// setTimeout(() => {
  	// 	this.$router.push({ path: '/employeeFamilyPolicy/EmployeeFamilyPolicyResultTable' }).catch((err) => { err; });
  	// }, 300);
  }
}
</script>

<style lang="scss" scoped>
.outside{
  min-height: calc(100vh - 147px);
  background-color: $COLOR-MAIN4;
}
.title{
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  margin-top: 20px;
}
.bg--light{
  background-color: #fff;
}
.product__content{
  padding-bottom: 20px;
}

</style>
