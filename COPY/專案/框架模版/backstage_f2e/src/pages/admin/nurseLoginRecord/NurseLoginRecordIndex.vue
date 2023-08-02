<template>
  <div class="container">
    <div class="page__title">
      護理師登入紀錄
    </div>
    <div class="text-center page__subtitle">
      您想找的紀錄範圍？
    </div>
    <!-- <div class="form__container">
      <a-form-model
        ref="formRef"
        :model="form"
      >
        <div class="row option__block">
          <div class="col-12 col-xl-7 mb-2">
            <div class="row">
              <div class="col-6">
                <div class="input__title">
                  登入人員AD帳號
                </div>
                <a-form-model-item
                  prop="loginAd"
                >
                  <a-input
                    v-model="form.loginAd"
                    class="input__block"
                    :disabled="curRole === '2' || !isManager"
                    placeholder="e.g. B1234"
                  />
                </a-form-model-item>
              </div>
              <div class="col-6">
                <div class="input__title">
                  登入人員姓名
                </div>
                <a-form-model-item
                  prop="loginName"
                >
                  <a-input
                    v-model="form.loginName"
                    class="input__block"
                    vue="true"
                    alt="webfont"
                    :disabled="curRole === '2' || !isManager"
                    placeholder="e.g. 林曉春"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
          <div class="col-6 col-xl-5 mb-2">
            <div class="input__title">
              登入時間起訖
            </div>
            <a-form-model-item
              prop="loginDuration"
            >
              <date-picker
                v-model="form.loginDuration"
                placeholder="e.g. 2022/01/01～2022/02/01"
                :range="true"
                :format="'YYYY/MM/DD'"
                :allow-clear="true"
                class="input__block"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="row option__block">
          <div class="col-12 col-xl-7 mb-2">
            <div class="row">
              <div class="col-6">
                <div class="input__title">
                  覆核人員AD帳號
                </div>
                <a-form-model-item
                  prop="checkAD"
                >
                  <a-input
                    v-model="form.checkAD"
                    class="input__block"
                    placeholder="e.g. B1235"
                  />
                </a-form-model-item>
              </div>
              <div class="col-6">
                <div class="input__title">
                  覆核人員姓名
                </div>
                <a-form-model-item
                  prop="checkName"
                >
                  <a-input
                    v-model="form.checkName"
                    vue="true"
                    alt="webfont"
                    class="input__block"
                    placeholder="e.g. 林曉春"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
          <div class="col-6 col-xl-5 mb-2">
            <div class="input__title">
              覆核時間起訖
            </div>
            <a-form-model-item
              prop="checkDuration"
            >
              <date-picker
                v-model="form.checkDuration"
                placeholder="e.g. 2022/01/01～2022/02/01"
                :range="true"
                :format="'YYYY/MM/DD'"
                :allow-clear="true"
                class="input__block"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="input__title">
          覆核結果
        </div>
        <a-form-model-item
          prop="checkResult"
        >
          <a-radio-group
            v-model="form.checkResult"
            class="row"
          >
            <div class="col-12 col-xl-7 mb-2">
              <div class="row">
                <div class="col-6">
                  <a-radio
                    class="radio__block"
                  >
                    全部(預設)
                  </a-radio>
                </div>
                <div class="col-6">
                  <a-radio
                    class="radio__block"
                    :value="1"
                  >
                    同意
                  </a-radio>
                </div>
              </div>
            </div>
            <div class="col-12 col-xl-5">
              <div class="row">
                <div class="col-6 col-xl-8">
                  <a-radio
                    class="radio__block"
                    :value="2"
                  >
                    退回
                  </a-radio>
                </div>
              </div>
            </div>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="handleSearch()"
      >
        查詢
      </button>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import DateTimeFormmat from '@/plugins/backStagePlugins/DateTimeFormmat/dateTimeFormmat';

@Component({ components: { } })
export default class NurseLoginRecordIndex extends Vue {
	// curRole: string = '0';

	// isManager: boolean = false;

	// form = {
	// 	loginAd: null,
	// 	loginName: null,
	// 	loginDuration: null,
	// 	checkAD: null,
	// 	checkName: null,
	// 	checkDuration: null,
	// 	checkResult: null, // 取得使用者角色： 0-待覆核, 1-同意, 2-退回
	// }

	// // 護理師僅可查詢自己的登入紀錄
	// initForm() {
	// 	// 判斷是否有主管身分(權限)
	// 	this.$AdminControlManagerApi.checkUserRoleUsingPOST()
	// 		.then((resp) => {
	// 			if (resp.status == 200) {
	// 				const rawData = resp.data.data;
	// 				// console.log(rawData);
	// 				this.isManager = rawData.isManager;
	// 			} else {
	// 				console.log('Error: ', resp.data.apiError);
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('Error:', error);
	// 		})
	// 		.finally(() => {
	// 			console.log('isManager:', this.isManager);
	// 		});
	// 	// 取得使用者角色： 1-員工, 2-護理師, 3-主管, 4-系統管理員
	// 	this.curRole = this.$user.getSelectedRole();
	// 	console.log('curRole:', this.curRole);

	// 	if (this.curRole === '2') {
	// 		// 取得使用者 AD 及姓名
	// 		// console.log(this.$user.getMe());
	// 		this.form.loginAd = this.$user.getMe().adId;
	// 		this.form.loginName = this.$user.getMe().name;
	// 	}
	// }

	// /* Event */
	// handleSearch() {
	// 	console.log('checkResult:', this.form.checkResult);
	// 	this.$global.changeRouterAndaddParam({
	// 		toRouter: 'NurseLoginRecordResult',
	// 		query: {
	// 			adId: this.form.loginAd,
	// 			name: this.form.loginName,
	// 			loginStartDt: this.form.loginDuration && DateTimeFormmat.formatStringDateDault(this.form.loginDuration[0]), // []: truthy
	// 			loginEndDt: this.form.loginDuration && DateTimeFormmat.formatStringDateDault(this.form.loginDuration[1]),
	// 			reviewAdId: this.form.checkAD,
	// 			reviewName: this.form.checkName,
	// 			reviewStartDt: this.form.checkDuration && DateTimeFormmat.formatStringDateDault(this.form.checkDuration[0]),
	// 			reviewEndDt: this.form.checkDuration && DateTimeFormmat.formatStringDateDault(this.form.checkDuration[1]),
	// 			certPassLogProvedEnum: this.form.checkResult,
	// 		},
	// 	});
	// }

	// created() {
	// 	this.initForm();
	// }

	// updated() {
	// 	window.parseWord();
	// }
}
</script>

<style lang="scss" scoped>
  .page__subtitle {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .form__container {
    border-radius: 10px;
    // background-color: $BS-COLOR-MAIN10;
    margin-bottom: 40px;
    padding: 30px (92/1088)*100%;
    padding-bottom: 22px;
  }
  .btn__wrap {
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
  .input__title {
    font-size: 16px;
    margin-bottom: 10px;
    // font-weight: $BS-TEXT-BOLD;
  }
  .input__block {
    width: 100%;
  }
  .option__block {
    margin-bottom: 12px;
  }
  ::v-deep {
    .ant-form-item {
      margin-bottom: 0px;
    }
  }
</style>
