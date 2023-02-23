<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div>
        <div class="query__title">
          請確認以下變更內容
        </div>
        <a-row
          class="my-3"
        >
          <a-col
            :span="12"
            class="pe-2"
          >
            <div class="card card__before">
              <div class="card-header py-2 card-header__before">
                調整前
              </div>
              <div class="card-body">
                <p
                  class="card-text pt-4"
                >
                  實際提報工資(TWD/元)
                  <span class="float-end text__money">{{ preSalary | currency }}</span>
                </p>
                <p
                  v-if="viewSubsidy"
                  class="card-text pt-1"
                >
                  津貼(TWD/元)
                  <span class="float-end text__money">{{ preSubsidy | currency }}</span>
                </p>
                <p
                  class="card-text pb-2 pt-1"
                >
                  職保薪資(TWD/元)
                  <span class="float-end text__money">{{ preLaborSalary | currency }}</span>
                </p>
              </div>
            </div>
          </a-col>
          <a-col
            :span="12"
            class="ps-2"
          >
            <div class="card card__after">
              <div class="card-header py-2 card-header__after">
                調整後
              </div>
              <div class="card-body">
                <p
                  class="card-text pt-4"
                >
                  實際提報工資(TWD/元)
                  <span class="float-end text__money">{{ newSalary | currency }}</span>
                </p>
                <p
                  v-if="viewSubsidy"
                  class="card-text pt-1"
                >
                  津貼(TWD/元)
                  <span class="float-end text__money">{{ newSubsidy ? parseInt(newSubsidy).toLocaleString() : '' }}</span>
                </p>
                <p
                  class="card-text pb-2 pt-1"
                >
                  職保薪資(TWD/元)
                  <span class="float-end text__money">{{ newLaborSalary | currency }}</span>
                </p>
              </div>
            </div>
          </a-col>
        </a-row>
        <div class="mt-4">
          變更日期
          <p class="fw-bold date--ls mt-1">
            {{ date }}
          </p>
        </div>
        <div class="block__btns text-center mb-5">
          <button
            class="btn__radius--primary--outline me-1"
            @click="onBack"
          >
            上一步
          </button>
          <button
            class="ms-1 btn__radius--primary"
            @click="onNext"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

// 錢錢加逗號
Vue.filter('currency', (number) => new Intl.NumberFormat().format(number));

@Component({ components: { Breadcrumb } })
export default class EmployeeSalaryConfirm extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  scIns = false; // 是否於要保單位投保職保

  viewSalary = false; // 是否顯示提報工資

  viewSubsidy = false; // 是否顯示津貼

  viewLaborSalary = false; // 是否顯示職保薪資

  preSalary = null; // 調整前實際提報工資

  preSubsidy = null; // 調整前津貼

  preLaborSalary = null; // 調整前職保薪資

  newSalary = null; // 調整後實際提報工資

  newSubsidy = null; // 調整後津貼

  newLaborSalary = null; // 調整後職保薪資

  date = ''; // 變更日期

  preDate = ''; // 原變更日期

  empInfo = null;

  fromWhere = 0; // 異動編輯為1

	appNo = 0; // 受理號碼

	// 日期加一
	// transformRocDate(date: string): string {
	// 	const dateNumber: string[] = date.split(/\D/g);
	// 	return `${Number.parseInt(dateNumber[0]) - 1911}/${dateNumber[1]}/${(Number.parseInt(dateNumber[2]) + 1).toString().padStart(2, '0')}`;
	// }

	async created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	const query = JSON.parse(decryptString);
  	this.empInfo = query.empInfo;
  	this.scIns = query.scIns;
  	this.viewSalary = query.viewSalary;
  	this.viewSubsidy = query.viewSubsidy;
  	this.viewLaborSalary = query.viewLaborSalary;
  	this.preSalary = query.preSalary;
  	this.preSubsidy = query.preSubsidy;
  	this.preLaborSalary = query.preLaborSalary;
  	this.newSalary = query.newSalary;
  	this.newSubsidy = query.newSubsidy;
  	this.newLaborSalary = query.newLaborSalary;
  	this.preDate = query.date;
  	this.date = query.date;
  	this.fromWhere = query.fromWhere;
  	this.appNo = query.appNo;
	}

	// 上一步
	onBack() {
  	this.$router.back();
	}

	formatDate(date) {
  	// return moment(date).toISOString();
		return moment(DateTimeFormmat.transformDate(date)).format(
  		'YYYY-MM-DDTHH:mm:ss.sssZ',
  	);
	}

	send() {
  	const loginInfo = this.$user.getMe();
  	const data = {
  		appOcDate: this.formatDate(this.preDate),
  		input: this.empInfo.input,
  		newSalary: this.newSalary,
  		policyModel: this.$userInfo.getPolicyModel(),
  		preSalary: this.preSalary,
			preScInsAmt: this.preLaborSalary,
			preAllowance: this.preSubsidy,
  		userId: loginInfo.userId,
  	};

  	let key;

  	if (this.viewSubsidy) {
  		key = 'newAllowance';
  		data[key] = this.newSubsidy;
  	}

  	if (this.viewLaborSalary) {
  		key = 'newScInsAmt';
  		data[key] = this.newLaborSalary;
  	}

  	if (this.fromWhere) {
  		key = 'appNo';
  		data[key] = this.appNo;
  	}

  	this.setLoading(true);

  	// 變更員工薪資
  	this.$empFamilyPolicyChangeApi.changeEmpSalaryUsingPOST(data)
  		.then((resp) => {
  			// 傳員工姓名到下一頁
  			if (resp.data.status === 200) {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'EmployeeSalarySuccess',
  					query: {
  						empName: this.empInfo.insName,
  						message: resp.data.message,
  					},
  				});
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'EmployeeSalaryFail',
  					query: {
  						empName: this.empInfo.insName,
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

	// 下一步
	onNext() {
  	this.send();
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
.query__title {
  font-size: 18px;
  color: #4CAAF5;
  font-weight: 600;
  margin-top: 60px;
}
.card {
  padding: 0;
  border-radius: 4px;
  opacity: 1;
}
.card__before {
  border: 1px solid #D9D9D9;
}
.card__after {
  border: 1px solid #7CACD3;
}
.card-header {
  font-weight: 600;
  color: white;
  padding-left: 40px;
}
.card-header__before {
  background-color: #D9D9D9;
}
.card-header__after {
  background-color: #7CACD3;
}
.card-text {
  padding-left: 40px;
}
.text__money {
  margin-right: 40px;
  font-weight: 600;
}
.date--ls {
  letter-spacing: 0.32px;
}
</style>
