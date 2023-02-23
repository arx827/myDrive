<template>
  <div class="outside">
    <div class="container modal__container">
      <div class="row">
        <div class="col">
          <div class="title">
            詳細投保內容
          </div>
        </div>
      </div>
      <div
        v-if="isRender"
        class="row m-0"
      >
        <div class="card px-3 px-lg-0">
          <div class="row user__info">
            <div class="col-2 col-lg-1 offset-0 offset-lg-1">
              <img
                v-if="userData.insSex == '女'"
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
                {{ userData.insName }}
              </div>
              <div class="user__name user__name--en">
                {{ userData.engInsName }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-3 col-lg-4 offset-0 offset-lg-1">
              <div class="info__header">
                個人資料
              </div>
              <template v-for="(item, index) in userDataList">
                <div
                  v-if="item.categrory == 'personInfo'"
                  :key="index"
                  class="info__item"
                >
                  <template v-if="item.isShow">
                    <div class="info__item__title">
                      {{ item.title }}
                    </div>
                    <div class="info__item__content">
                      {{ item.value }}
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <div class="col-3 col-lg-2">
              <div class="info__header">
                投保資料
              </div>
              <template v-for="(item, index) in userDataList">
                <div
                  v-if="item.categrory == 'policy'"
                  :key="index"
                  class="info__item"
                >
                  <template v-if="item.isShow">
                    <div class="info__item__title">
                      {{ item.title }}
                    </div>
                    <div class="info__item__content">
                      {{ item.value }}
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <div class="col-3 col-lg-2 info__block">
              <div class="info__header">
                任職資料
              </div>
              <template v-for="(item, index) in userDataList">
                <div
                  v-if="item.categrory == 'career'"
                  :key="index"
                  class="info__item"
                >
                  <template v-if="item.isShow">
                    <div class="info__item__title">
                      {{ item.title }}
                    </div>
                    <div class="info__item__content">
                      {{ item.value }}
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <div class="col-3 col-lg-2 info__block">
              <div class="info__header">
                備註
              </div>
              <template v-for="(item, index) in userDataList">
                <div
                  v-if="item.categrory == 'remark' && ((userData.appType == '保險計劃加保') || (userData.appType == '險種計劃加保'))"
                  :key="index"
                  class="info__item"
                >
                  <template v-if="item.isShow">
                    <div class="info__item__content">
                      {{ item.value }}
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isRender && ((userData.appType == '保險計劃加保') || (userData.appType == '險種計劃加保') || (userData.appType == '保險計劃變更') || (userData.appType == '險種計劃變更'))"
        class="row product__header"
      >
        <div class="col-10 offset-0">
          保險計劃/專案
        </div>
        <div
          v-if="userData.policyPlan"
          class="col-10 offset-0 product__header--bold"
        >
          {{ userData.policyPlan }} {{ userData.policyPlanName }}
        </div>
      </div>
      <div
        v-if="isRender && ((userData.appType == '保險計劃加保') || (userData.appType == '險種計劃加保') || (userData.appType == '保險計劃變更') || (userData.appType == '險種計劃變更'))"
        class="row bg--light product__content"
      >
        <div class="col-12 offset-0">
          <div>
            <div class="product__content__hearder d-flex justify-content-between">
              <div class="header__text header__text--main">
                投保內容（險種/計畫/保額）
              </div>
              <div class="header__text header__text--main">
                <span class="header__text header__text--sub">金額單位／</span>
                新台幣TWD
              </div>
            </div>
            <div class="product__content__line product__content__line--main" />
            <div
              v-for="(item,index) in userData.giissInschgSpecs"
              :key="index"
            >
              <div
                class="product__content__item"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="item__title">
                      ＊{{ item.itemName }}({{ item.item }})
                    </div>
                    <div
                      v-if="policyType === 'RC'"
                      class="item__title item__title--primary"
                    >
                      {{ item.plan }} {{ item.descriptionOfInsurancePlan }}
                    </div>
                  </div>
                  <div
                    v-if="policyType === 'RC' && item.sa == 0"
                    class="item__cost"
                  >
                    是
                  </div>
                  <div
                    v-else-if="policyType === 'CB' && item.sa == 0"
                    class="item__cost"
                  >
                    {{ item.plan }} {{ item.descriptionOfInsurancePlan }}
                  </div>
                  <div
                    v-else
                    class="item__cost"
                  >
                    {{ item.saumitName ? (item.saumitName.indexOf('元') !== -1 ? '$': ''):'' }} {{ item.sa.toLocaleString() }} {{ item.saumitName }}
                  </div>
                </div>
              </div>
              <div
                v-if="index+1 < userData.giissInschgSpecs.length"
                class="product__content__line product__content__line--dash"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row product__back">
        <div class="block__btns text-center">
          <button
            class="btn btn__main btn__main--primary"
            @click="closeModal"
          >
            確認
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
import {
	TransactionContentModel,
	GiissInschgMasterContentDto,
	UserInfoDto,
	EmpWithoutSalaryDto,
	EmpWithoutSalary,
} from '@fubonlife/co-giiss-api-axios-sdk';
import { FormItem } from 'ant-design-vue/types/form/form-item';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import UserInfoCard from '@/components/shared/info/UserInfoCard.vue';
import notification from '@/plugins/info/infoNotification';

@Component({ components: { UserInfoCard, Breadcrumb } })
export default class EmpFamilyPolicyChangeWithoutSalaryDetail extends Vue {
  @Prop()
  breadcrumb: {}

  // table頁傳過來的資料
	@Prop({ default: false }) query!: EmpWithoutSalary;

  @Action('setLoading') setLoading;

  @Watch('query', { immediate: true, deep: true })
  onPersonChanged(val, oldVal) {
  	this.setLoading(true);
  	this.getData();
  }

  // 承辦人資訊
  currentLoginData: UserInfoDto = {}

	detailContentQuery: TransactionContentModel = {
		appNo: 'string',
		funtionType: '0',
	}

	userData: GiissInschgMasterContentDto ;

  userDataList = [];

  // 接收到API資料後再渲染畫面
  isRender: boolean = true;

  // 目前為RC還是CB保單
  policyType: 'RC' | 'CB' = null;
  // Hook

  created() {
  	window.scrollTo(0, 0);
  	// if (!sessionStorage.param) {
  	// 	this.$router.push({ name: 'Index' });
  	// }
  	if (sessionStorage.login_state) {
  		this.currentLoginData = JSON.parse(sessionStorage.login_state).me;
  	}
  	this.policyType = this.$userInfo.getProject();

  	// this.getData();
  }

  formatVal(val) {
  	return val === null || val.length < 1 ? '' : val;
  }

  // 取得詳細投保資料
  getData() {
  	this.detailContentQuery.appNo = this.query.appNo;
  	this.isRender = false;
  	this.$empFamilyPolicyChangeApi.contentUsingPOST(this.query.appNo)
  		.then((resp) => {
  			if (resp.status === 200) {
  				console.log(resp);
  				this.userData = resp.data.data;
  				const respData = resp.data.data;
  				this.userDataList = [
 						{
  						categrory: 'personInfo',
  						title: '員工姓名',
  						key: 'insName',
  						value: this.formatVal(respData.insName),
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '屬性',
  						key: 'insAttr',
  						value: respData.insAttr,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '出生日期',
  						key: 'insBirthDate',
  						value: respData.insBirthDate,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '國籍',
  						key: 'nationAlity',
  						value: respData.nationAlity,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '身分證字號/居留證號碼',
  						key: 'idNo',
  						value: respData.idNo,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '電話',
  						key: 'mobile',
  						value: respData.mobile,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '電子信箱',
  						key: 'email',
  						value: respData.email,
  						isShow: true,
  					},
  					{
  						categrory: 'policy',
  						title: '保險證號',
  						key: 'crtNo',
  						value: respData.crtNo,
  						isShow: true,
  					},
  					{
  						categrory: 'policy',
  						title: '加保日期',
  						key: 'appocDate',
  						value: respData.appocDate,
  						isShow: !!(respData.appType == '保險計劃加保' || respData.appType == '險種計劃加保'),
  					},
  					{
  						categrory: 'policy',
  						title: '退保日期',
  						key: 'appocDate',
  						value: respData.appocDate,
  						isShow: respData.appType == '退保',
  					},
  					{
  						categrory: 'policy',
  						title: '變更日期',
  						key: 'appocDate',
  						value: respData.appocDate,
  						isShow: !!(respData.appType == '保險計劃變更' || respData.appType == '險種計劃變更'),
  					},
  					{
  						categrory: 'policy',
  						title: '受理日期',
  						key: 'appTime',
  						value: respData.appTime,
  						isShow: true,
  					},
  					{
  						categrory: 'policy',
  						title: '受益人',
  						key: 'benType',
  						value: respData.benType,
  						isShow: !!(respData.appType == '保險計劃加保' || respData.appType == '險種計劃加保'),
  					},
  					{
  						categrory: 'career',
  						title: '部門',
  						key: 'depNo',
  						value: respData.depNo,
  						isShow: !!(((respData.insAttr == '員工' && respData.appType == '保險計劃加保') || (respData.insAttr == '員工' && respData.appType == '險種計劃加保')) || ((respData.insAttr == '員工' && respData.appType == '基本資料變更')) || (respData.insAttr == '員工' && respData.appType == '險種計劃變更')),
  					},
  					{
  						categrory: 'career',
  						title: '工作內容',
  						key: 'rankNo',
  						value: respData.rankNo,
  						isShow: !!(((respData.insAttr == '員工' && respData.appType == '保險計劃加保') || (respData.insAttr == '員工' && respData.appType == '險種計劃變更'))),
  					},
  					{
  						categrory: 'career',
  						title: '提報工資(TWD)',
  						key: 'salary',
  						value: this.autoAddComdify(respData.salary),
  						isShow: !!((this.currentLoginData.authNameList[0] == '一級權限' && respData.appType == '險種計劃變更')),
  					},
  					{
  						categrory: 'career',
  						title: '職保薪資(TWD)',
  						key: 'scInsAmt',
  						value: this.autoAddComdify(respData.scinsamt),
  						isShow: !!((this.currentLoginData.authNameList[0] == '一級權限' && respData.appType == '險種計劃變更')),
  					},
  					{
  						categrory: 'career',
  						title: '津貼(TWD)',
  						key: 'allowance',
  						value: this.autoAddComdify(respData.allowance),
  						isShow: !!(this.currentLoginData.authNameList[0] == '一級權限' && respData.appType == '險種計劃變更'),
  					},
  					{
  						categrory: 'remark',
  						title: '備註',
  						key: 'remark',
  						value: this.formatVal(respData.note),
  						isShow: !!((respData.appType == '保險計劃加保') || (respData.appType == '險種計劃變更')),
  					},
  				];
  				this.isRender = true;
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log(error);
  		})
  		.finally(() => this.setLoading(false));
  }

  // 返回上一頁
  closeModal() {
  	this.$emit('closeModal');
  	this.isRender = true;
  }

  updated() {
  	window.parseWord();
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
}
</script>

<style lang="scss" scoped>
.outside{
  min-height: calc(100vh - 147px);
  background-color: $COLOR-MAIN4;
	margin-bottom: 70px;
	margin-top: 80px;
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
.modal__container{
	padding: 0 76px;
}

.title{
	margin:0px auto;
	margin-top: 40px;
	margin-bottom: 12px;
	width: 936px;
}
.card{
	padding: 20px 16px;
	margin: 0px auto;
	margin-bottom: 10px;
}
.info__header{
	padding:1px 12px;
}
.col_other{
	width:184px
}
.col_first{
	width: 368px;
}
.product__header,  .product__content{
	margin: 0px;
	padding: 10px 8px;
}
.product__content__item{
	margin: 0px auto;
}
.user__info{
	margin: 0;
	margin-bottom: 20px;
}
.block__btns{
	button{
		padding: 12px 50px;
	}
}
</style>
