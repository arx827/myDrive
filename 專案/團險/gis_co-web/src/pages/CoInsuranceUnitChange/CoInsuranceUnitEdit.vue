<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div
        class="page__title"
      >
        要保單位基本資料變更
      </div>
      <div class="clearfix" />
      <a-form-model
        ref="ruleForm"
        :model="form"
        :layout="'vertical'"
        :rules="formRules"
      >
        <div class="coInfo__edit__table bg__blue">
          <div class="coInfo__edit__info">
            <div class="coInfo__edit__info__title">
              <span>變動此區資料需檢附紙本</span> <span><u>證明文件及變更表格</u></span>
            </div>
            <div class="coInfo__edit__info__content">
              <div>若更改「營業類別」、「統一編號」，請附上「營利事業登記證影本」</div>
              <div>若更改「職災編號」，請附上最近一期「勞工保險局勞工保險費暨附收工資墊價基金提繳費繳款單」影本及【防制洗錢及打擊資恐風險辨識聲明書(團險暨旅平險法人適用)】</div>
              <div>若更改「匯款帳號」，請提供變更後之「存摺影本」</div>
              <div>若變更要保單位名稱、負責人、統一編號、登記地址，請提供證明及【防制洗錢及打擊資恐風險辨識聲明書(團險暨旅平險法人適用)】</div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <a-form-model-item prop="">
                <div class="form__line">
                  <label for="">保單號碼-序號</label>
                  <div>{{ form.poliId }}-{{ form.poliSeq }}</div>
                </div>
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item prop="">
                <div class="form__line">
                  <label for="">保險期間</label>
                  <div>{{ form.strDate }} - {{ form.endDate }}</div>
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="fullName">
                <div class="form__line">
                  <label for="">要保單位中文名稱</label>
                  <a-textarea
                    v-model="form.fullName"
                    auto-size
                    vue="true"
                    alt="webfont"
                  />
                  <!-- 不直接變更，套印變更文件及蓋公司大小章 -->
                </div>
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item prop="corpName">
                <div class="form__line">
                  <label for="">要保單位英文名稱</label>
                  <a-textarea
                    v-model="form.corpName"
                    auto-size
                  />
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="bossName">
                <div class="form__line">
                  <label for="">負責人姓名</label>
                  <a-popover
                    trigger="click"
                    placement="top"
                  >
                    <template slot="content">
                      <div>原住民特殊字元可以複製以下字元使用</div>
                      <div>ʼ &emsp; ⌃ &emsp; ṟ &emsp; é &emsp; ɨ &emsp; ʉ</div>
                    </template>
                    <a-icon
                      type="info-circle"
                      :style="{ color: '#4CAAF5' }"
                      @click="isreplyTypeModal = true"
                    />
                  </a-popover>
                  <a-textarea
                    v-model="form.bossName"
                    auto-size
                    vue="true"
                    alt="webfont"
                  />
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="bankNoName">
                <div class="form__line">
                  <label for="">匯款銀行</label>
                  <a-select
                    v-model="form.bankNoName"
                    placeholder="請選擇"
                  >
                    <!-- <a-select-option>請選擇</a-select-option> -->
                    <a-select-option
                      v-for="(bank, index) in bank"
                      :key="index"
                      :value="bank"
                    >
                      {{ bank }}
                    </a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item prop="duknc2">
                <div class="form__line">
                  <label for="">分行代碼</label>
                  <a-input
                    v-model="form.duizc2"
                    type="text"
                  />
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="duknc2">
                <div class="form__line">
                  <label for="">匯款帳號</label>
                  <a-input
                    v-model="form.duknc2"
                  />
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="applId">
                <div class="form__line">
                  <label for="">統一編號</label>
                  <a-input
                    v-model="form.applId"
                    type="text"
                  />
                </div>
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item prop="agcyTypeName">
                <div class="form__line">
                  <label for="">職災編號/營業類別</label>
                  <a-select
                    v-model="form.agcyTypeName"
                  >
                    <a-select-option
                      v-for="(agcy, index) in agcy"
                      :key="index"
                      :value="agcy"
                    >
                      {{ agcy }}
                    </a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="form__line">
                <label for="">公司登記地址</label>
                <div class="row">
                  <div class="col-2">
                    <a-form-model-item prop="zipCode">
                      <a-input
                        v-model="form.zipCode"
                        type="text"
                      />
                    </a-form-model-item>
                  </div>
                  <div class="col-10 ps-0">
                    <a-form-model-item prop="addr">
                      <a-textarea
                        v-model="form.addr"
                        auto-size
                      />
                    </a-form-model-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="">
                <div class="form__line">
                  <a-checkbox
                    v-model="stamp"
                  >
                    變更印鑑
                  </a-checkbox>
                </div>
              </a-form-model-item>
            </div>
          </div>
        </div>
        <!-- <div
          class="coInfo__edit__table"
          style="padding-top: 0;"
        >
          <div class="row">
            <div class="col">
              <div class="form__line">
                <label for="">公司通訊地址</label>
                <div class="row">
                  <div class="col-2">
                    <a-form-model-item prop="crflc3">
                      <a-input
                        v-model="form.crflc3"
                        type="text"
                      />
                    </a-form-model-item>
                  </div>
                  <div class="col-10 ps-0">
                    <a-form-model-item prop="crfmc3">
                      <a-textarea
                        v-model="form.crfmc3"
                        auto-size
                      />
                    </a-form-model-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="applTel">
                <div class="form__line">
                  <label for="">聯絡電話(區碼/電話/分機)</label>
                  <a-input
                    v-model="form.applTel"
                    type="text"
                  />
                </div>
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item prop="faxNo">
                <div class="form__line">
                  <label for="">傳真號碼</label>
                  <a-input
                    v-model="form.faxNo"
                    type="text"
                  />
                </div>
              </a-form-model-item>
            </div>
          </div>
        </div> -->
      </a-form-model>
      <div class="block__btns text-center">
        <router-link
          :to="'/coInsuranceUnit/coInsuranceUnitIndex'"
        >
          <button class="btn__radius--primary--outline">
            上一步
          </button>
        </router-link>
        <button
          class="btn__radius--primary"
          @click="onSubmit"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { CoPolicyShowDto } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import notification from '@/plugins/info/infoNotification';

@Component({ components: { Breadcrumb } })
export default class CoInsuranceUnitEdit extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  policyId = null;

  policySeq = null;

  bank = null;

  agcy = null;

  form: CoPolicyShowDto = {
  	addr: '',
  	agcyName: '',
  	agcyType: '',
  	agcyTypeName: '',
  	applId: '',
  	bankNoName: '',
  	bossName: '',
  	corpName: '',
  	duf3ig: '',
  	duiyc2: '',
  	duizc2: '',
  	duknc2: '',
  	endDate: '',
  	fullName: '',
  	poliId: 0,
  	poliSeq: '',
  	strDate: '',
  	times: 0,
  	zipCode: '',
  }

  initForm = null;

  fromApiForm = null;

  stamp = false;

  formRules = {
  	fullName: [{ required: true, message: '請填入要保單位中文名稱' }],
  	// corpName: [{ required: true, message: '請填入要保單位英文名稱' }],
  	bossName: [{ required: true, message: '請填入負責人姓名' }],
  	// duknc2: [{ required: true, message: '請填入匯款帳號' }],
  	applId: [{ required: true, message: '請填入統一編號' }],
  	zipCode: [{ required: true, message: '請填入郵遞區號' }],
  	addr: [{ required: true, message: '請填入公司登記地址' }],
  	// crflc3: [{ required: true, message: '請填入郵遞區號' }],
  	// crfmc3: [{ required: true, message: '請填入公司通訊地址' }],
  	// applTel: [{ required: true, message: '請填入聯絡電話' }],
  	// faxNo: [{ required: true, message: '請填入傳真號碼' }],
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  	    this.$global.clearParam();
  			this.toNextPage();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  async toNextPage() {
  	// 若不做任何欄位更動(與原始資料比對)且未勾選變更印鑑，不進到下一頁
  	if (JSON.stringify(this.form) == JSON.stringify(this.fromApiForm) && !this.stamp) {
  		notification.error({
  			Content: '請變更欲更動欄位',
  		});
  		return;
  	}
  	this.form.duiyc2 = this.form.bankNoName.substring(0, 3);
  	const selfQuery = {
  		form: this.form,
  		fromApiForm: this.fromApiForm,
  	};
  	const query = {
  		form: this.form,
  		initForm: this.initForm,
  		stamp: this.stamp,
  		fromApiForm: this.fromApiForm,
  	};
  	this.setLoading(true);
  	const selfEncryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(selfQuery));
  	const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
  	this.$global.clearParam();
  	// 儲存當前變更資料於當前router, 用於下一頁(瀏覽頁)點擊返回時取得資料使用
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'self',
  		query: selfEncryptQuery,
  	});
  	// 儲存原始資料(用於資料比對)與變更後資料, 轉跳至瀏覽頁
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CoInsuranceUnitView',
  		query: encryptQuery,
  	});
  	this.setLoading(false);
  	// await this.$coInsuranceUnitApi.updateUnitUsingPOST(this.stamp, this.form)
  	// 	.then((resp) => {
  	// 		const res = resp as any;
  	// 		console.log(resp);
  	// 		if (res.data.apiError) {
  	// 			notification.error({
  	// 				Content: this.$global.getApiErrorMsg(res.data.apiError).join(''),
  	// 			});
  	// 		} else {
  	// 			this.$global.clearParam();
  	// 			// 儲存當前變更資料於當前router, 用於下一頁(瀏覽頁)點擊返回時取得資料使用
  	// 			this.$global.changeRouterAndaddParam({
  	// 				toRouter: 'self',
  	// 				query: selfEncryptQuery,
  	// 			});
  	// 			// 儲存原始資料(用於資料比對)與變更後資料, 轉跳至瀏覽頁
  	// 			this.$global.changeRouterAndaddParam({
  	// 				toRouter: 'CoInsuranceUnitView',
  	// 				query: encryptQuery,
  	// 			});
  	// 		}
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		// this.isDownloading = false;
  	// 		this.setLoading(false);
  	// 	});
  }

  async getCoInsuranceInfo() {
  	// 取得要保單位基本機料
  	const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	this.initForm = JSON.parse(decryptString).form;
  	this.form = JSON.parse(decryptString).form;
  	this.fromApiForm = JSON.parse(decryptString).fromApiForm;
  	// 取得銀行資料
  	this.$coInsuranceUnitApi.getBankUsingPOST()
    	.then((resp) => {
  			if (resp.status === 200) {
  				this.bank = resp.data.data;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.isDownloading = false;
  		});
  	// 取得營業類別/職災編號
  	this.$coInsuranceUnitApi.getAgcyTypeNameUsingPOST()
    	.then((resp) => {
  			if (resp.status === 200) {
  				this.agcy = resp.data.data;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.isDownloading = false;
  		});
  }

  created() {
  	this.getCoInsuranceInfo();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.coInfo__edit__info__title {
  background-color: #4CAAF5;
  border-radius: 4px;
  text-align: center;
  padding: 7px 0;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 15px;
}
.coInfo__edit__info__content {
  color: #2F6A9A;
  border: 1px #2F6A9A solid;
  border-radius: 4px;
  padding: 15px 50px;
  font-size: 14px;
  margin-bottom: 25px;
  line-height: 25px;
}
.page__title {
  margin-bottom: 25px;
}
.notice__txt {
  position: absolute;
  top: -24px;
  right: 0;
  font-size: 12px;
}
.form__line {
  label {
    font-weight: 400;
  }
  div {
    font-weight: 600;
    color: #000000;
  }
}
.coInfo__table__wrap {
  padding-bottom: 33px;
  padding-top: 27px;
}
.coInfo__edit__table {
  padding: 25px 90px;
  margin-bottom: 40px;
  border-radius: 4px;
}
.block__btns {
  margin: 40px 0;
  button {
    width: 150px;
    max-width: 100%;
    margin: 0 5px;
  }
}
</style>
