<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div
        v-if="empInfo"
        class="query__content"
      >
        <div class="query__title">
          請勾選您要退保的對象
        </div>
        <p class="info__txt primary__txt">
          注意：「員工」退保，則其附帶眷屬將會一併轉出，敬請留意！
        </p>
        <div class="surrenderuser__wrap">
          <div class="query__table">
            <div class="clearfix" />
            <div class="block__line--blue">
              員工資料
            </div>
            <div class="clearfix" />
            <div class="position-relative">
              <a-checkbox
                v-model="empInfo.isCheck"
                class="user__check"
                :disabled="isFromEdit"
              />
              <UserDataCard
                :card-selected="empInfo.isCheck"
                :user-name="empInfo.insName"
                :user-sex="empInfo.sex"
                :user-type="0"
                :datas="[empInfo.insId,empInfo.nationality,empInfo.sex,empInfo.birthDate,empInfo.crtNo]"
              />
            </div>
          </div>
          <div
            v-if="empFamilyInfo!==null"
            class="query__table"
          >
            <div class="clearfix" />
            <div class="block__line--blue">
              眷屬資料
            </div>
            <div class="clearfix" />
            <div
              v-for="(family, index) in empFamilyInfo"
              :key="index"
              class="position-relative"
            >
              <a-checkbox
                v-model="family.isCheck"
                :disabled="empInfo.isCheck || isFromEdit"
                class="user__check"
              />
              <UserDataCard
                :card-selected="family.isCheck"
                :user-name="family.insName"
                :user-sex="family.sex"
                :user-type="1"
                :datas="[family.insId, family.nationality, family.sex, family.birthDate, family.attribute]"
              />
            </div>
          </div>
        </div>
        <div>退保/離職日期</div>
        <div>
          <a-form-model
            ref="ruleForm"
            :model="form"
            :layout="'vertical'"
            :rules="formRules"
          >
            <a-form-model-item prop="date">
              <date-picker
                v-model="form.date"
                type="date"
                :formatter="formatter"
                :allow-clear="true"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="block__btns text-center">
          <button
            class="btn__radius--primary--outline"
            @click="back"
          >
            上一步
          </button>
          <button
            class="btn__radius--primary"
            :disabled="isSending"
            @click="onSubmit"
          >
            確定
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
import { PolicySurrenderModel } from '@fubonlife/co-giiss-api-axios-sdk';
import UserDataCard from '@/components/shared/info/UserDataCard.vue';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb, UserDataCard } })
export default class EmpFamilyPolicyChangeSurrenderList extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  formatter = this.$twDateFormatter;

  form = {
  	date: null,
  }

  formRules = {
  	date: [{ required: true, message: '請填入有效退保/離職日期' }],
  }

  empInfo = null; // 員工資料

  empFamilyInfo = null; // 員眷資料

  isSending = false; // 送出按鈕鎖定變數

  // 0: 員工查詢功能, 1: 歷史異動編輯
  // 記錄從哪頁面來, 若從歷史異動要隱藏[上一步]按鈕
  // fromWhere = 0;

  appNo = null; // 受理號碼, 異動編輯過來的才會有

  // 若勾選員工退保，要自動勾選該全部眷屬
  @Watch('empInfo.isCheck')
  onChange(val) {
  	if (val && this.empFamilyInfo && !this.appNo) {
  		this.empFamilyInfo.forEach((element) => {
  			element.isCheck = true;
  		});
  	}
  	if (!val && this.empFamilyInfo && !this.appNo) {
  		this.empFamilyInfo.forEach((element) => {
  			element.isCheck = false;
  		});
  	}
  }

  get isFromEdit() {
  	return !!this.appNo;
  }

  async getUserInfo() {
  	const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	const query = JSON.parse(decryptString);
  	const data = {
  		crtNo: query.input.crtNo,
  		policyModel: this.$userInfo.getPolicyModel(),
  	};
  	this.appNo = query.appNo ? query.appNo : null;

  	this.setLoading(true);

  	if (this.appNo) {
  		// 從異動編輯來
  		await this.$empFamilyPolicyChangeApi.policySurrenderByAppNoUsingPOST(this.appNo)
  			.then((resp: any) => {
  				if (resp.data.status === 200) {
  					const crtSeq = resp.data.data.chooseDate.crtSeq;
  					this.empInfo = resp.data.data.emp;
  					this.empInfo.isCheck = this.empInfo.crtSeq === resp.data.data.chooseDate.crtSeq;
  					console.log(this.empInfo.crtSeq);
  					this.empFamilyInfo = resp.data.data.family;
  					this.empFamilyInfo.forEach((element) => {
  						element.isCheck = element.crtSeq === resp.data.data.chooseDate.crtSeq;
  						console.log(element.crtSeq === resp.data.data.chooseDate.crtSeq);
  					});
  					this.form.date = new Date(resp.data.data.updateDate);
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
  	} else {
  	query.isCheck = false;
  	this.empInfo = query;
  		this.$coUtilityApi.getEmpFamilyPageUsingPOST(data)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					console.log(resp);
  					if (resp.data.data.length !== 0) {
  						this.empFamilyInfo = resp.data.data;
  						this.empFamilyInfo.forEach((e) => {
  							this.$set(e, 'isCheck', false);
  							// e.birthDate = `${DateTimeFormmat.transformRocDate(e.birthDate)}`;
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
  }

  async created() {
  	if (this.$global.getParam() === null) {
  		notification.error({
  			Content: '無查詢條件，請重新查詢',
  			onCallback: () => {
  				this.$router.push({ path: '/empFamilyPolicyChangeSurrender/query' }).catch((err) => { err; });
  			},
  		});
  		return;
  	}
  	// if (this.$global.getParam().fromPage == 'CO_EFTodayResultTable') {
  	// 	this.fromWhere = 1;
  	// }
  	console.log(this.$global.getParam().fromPage);
  	await this.getUserInfo();
  }

  formatDate(date) {
  	return moment(date).toISOString();
  }

  back() {
  	window.history.go(-1);
  }

  send() {
  	const loginInfo = this.$user.getMe();
  	let inputsData = null;
  	let surrenderName = null;
  	if (this.empFamilyInfo) {
  		inputsData = [...[this.empInfo].filter((e) => e.isCheck), ...this.empFamilyInfo.filter((e) => e.isCheck)];
  	  surrenderName = [...[this.empInfo].filter((e) => e.isCheck).map((e) => e.insName), ...this.empFamilyInfo.filter((e) => e.isCheck).map((e) => e.insName)];
  	} else {
  		inputsData = [...[this.empInfo].filter((e) => e.isCheck)];
  		surrenderName = [...[this.empInfo].filter((e) => e.isCheck).map((e) => e.insName)];
  	}

  	if (inputsData.length === 0) {
  		notification.error({ Content: '請選擇欲退保對象' });
  		return;
  	}

  	const data: PolicySurrenderModel = {
  		appOcDate: this.formatDate(this.form.date),
  		inputs: inputsData.map((e) => e.input),
  		policyModel: this.$userInfo.getPolicyModel(),
  		userId: loginInfo.userId,
  		save: true,
  	};

  	data.appNo = this.appNo;

  	this.isSending = true;
  	this.$empFamilyPolicyChangeApi.empFamilyPolicySurrenderUsingPOST(data)
  		.then((resp) => {
  			// 傳員工姓名&被退保人姓名到下一頁
  			if (resp.data.status === 200) {
  	      	this.$global.changeRouterAndaddParam({
  					  toRouter: 'EmpFamilyPolicyChangeSurrenderSuccess',
  					  query: {
  						  empName: this.empInfo.insName,
  						  surrenderName,
  						  // fromWhere: this.fromWhere,
  					  },
  				  });
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'EmpFamilyPolicyChangeSurrenderFail',
  					query: {
  						  empName: this.empInfo.insName,
  						  surrenderName,
  						  message: this.$global.getApiErrorMsg(resp.data.apiError),
  						  // fromWhere: this.fromWhere,
  					},
  				});
  				console.log(resp);
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.isSending = false;
  		});

  	console.log(data);
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.send();
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
.user__check {
  position: absolute;
  left: -31px;
  top: 50%;
  margin-top: -12px;
}
.surrenderuser__wrap {
  border-bottom: 1px #CECECE dashed;
  padding-bottom: 10px;
  margin-bottom: 25px;
}
</style>
