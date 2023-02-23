<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div
        class="page__title primary__txt float-start"
      >
        請確認以下變更內容
      </div>
      <div class="float-end mt-3">
        「<span class="mark">＊</span>」符號表示變更項目
      </div>
      <div class="clearfix" />
      <div
        v-if="form!==null"
        class="coInfo__edit__table bg__blue"
      >
        <div class="coInfo__edit__info">
          <div class="coInfo__edit__info__content">
            <div>若更改「營業類別」、「統一編號」，請附上「營利事業登記證影本」</div>
            <div>若更改「職災編號」，請附上最近一期「勞工保險局勞工保險費暨附收工資墊價基金提繳費繳款單」影本及【防制洗錢及打擊資恐風險辨識聲明書(團險暨旅平險法人適用)】</div>
            <div>若更改「匯款帳號」，請提供變更後之「存摺影本」</div>
            <div>若變更要保單位名稱、負責人、統一編號、登記地址，請提供證明及【防制洗錢及打擊資恐風險辨識聲明書(團險暨旅平險法人適用)】</div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">保單號碼-序號</label>
              <div>{{ form.poliId }}-{{ form.poliSeq }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">保險期間</label>
              <div>{{ form.strDate }} - {{ form.endDate }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">要保單位中文名稱<span
                v-if="form.fullName !== fromApiForm.fullName"
                class="mark"
              >＊</span></label>
              <div>{{ form.fullName }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">要保單位英文名稱<span
                v-if="form.corpName !== fromApiForm.corpName"
                class="mark"
              >＊</span></label>
              <div>{{ form.corpName }}</div>
            </div>
          </div>
        </div>
        <hr class="mb-4">
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">負責人姓名<span
                v-if="form.bossName !== fromApiForm.bossName"
                class="mark"
              >＊</span></label>
              <div>{{ form.bossName }}</div>
              <hr class="mt-4">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">匯款銀行<span
                v-if="form.bankNoName !== fromApiForm.bankNoName"
                class="mark"
              >＊</span></label>
              <div>{{ form.bankNoName }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">分行代碼<span
                v-if="form.duizc2 !== fromApiForm.duizc2"
                class="mark"
              >＊</span></label>
              <div>{{ form.duizc2 && form.duizc2.length > 0 ? form.duizc2:'-' }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">匯款帳號<span
                v-if="form.duknc2 !== fromApiForm.duknc2"
                class="mark"
              >＊</span></label>
              <div>{{ form.duknc2 && form.duknc2.length > 0 ? form.duknc2:'-' }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">統一編號<span
                v-if="form.applId !== fromApiForm.applId"
                class="mark"
              >＊</span></label>
              <div>{{ form.applId }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">職災編號/營業類別<span
                v-if="form.agcyTypeName !== fromApiForm.agcyTypeName"
                class="mark"
              >＊</span></label>
              <div>{{ form.agcyTypeName }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">公司登記地址</label><span
                v-if="form.zipCode !== fromApiForm.zipCode || form.addr !== fromApiForm.addr"
                class="mark"
              >＊</span>
              <div>{{ form.zipCode }} {{ form.addr }}</div>
            </div>
          </div>
        </div>
        <!-- <div class="row">
          <div class="col">
            <hr class="line">
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">公司通訊地址<span
                v-if="form.crflc3 !== initForm.crflc3 || form.crfmc3 !== initForm.crfmc3"
                class="mark"
              >＊</span></label>
              <div>{{ form.crflc3 }} {{ form.crfmc3 }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">聯絡電話(區碼/電話/分機)<span
                v-if="form.applTel !== initForm.applTel"
                class="mark"
              >＊</span></label>
              <div class="position-relative">
                <div>{{ form.applTel }}</div>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">傳真號碼<span
                v-if="form.faxNo !== initForm.faxNo"
                class="mark"
              >＊</span></label>
              <div>{{ form.faxNo }}</div>
            </div>
          </div>
        </div> -->
      </div>
      <div
        v-if="isDownload"
        class="coInfo__print__wrap"
      >
        <div class="row">
          <div class="col">
            <div class="coInfo__print__title">
              原印鑑
            </div>
          </div>
          <div class="col">
            <div class="coInfo__print__title">
              新印鑑
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="coInfo__print__content">
              <div class="row">
                <div class="col text-center">
                  （公司章）
                </div>
                <div class="col text-center">
                  （負責人章）
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="coInfo__print__content">
              <div class="row">
                <div class="col text-center">
                  （公司章）
                </div>
                <div class="col text-center">
                  （負責人章）
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="block__btns text-center">
        <router-link
          :to="'/coInsuranceUnit/coInsuranceUnitEdit'"
        >
          <button class="btn__radius--primary--outline">
            上一步
          </button>
        </router-link>
        <button
          class="btn__radius--primary"
          @click="download"
        >
          {{ isDownload?'儲存並下載':'儲存' }}
        </button>
      </div>
      <div class="reminder__txt text-center">
        <p>請列印此畫面，且加蓋印鑑，並將正本郵寄至本公司</p>
        <p>11049 台北市信義區東興路71號3樓</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import notification from '@/plugins/info/infoNotification';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class CoInsuranceUnitView extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  form = null; // 變更後資料

  initForm = null; // 上一動更改資料

  fromApiForm = null; // API原始資料

  stamp = null; // 是否變更印鑑

  isDownload = true; // 控制若更改欄位非藍色區塊，僅儲存不下載

  download() {
  	this.$coInsuranceUnitApi.updateUnitUsingPOST(this.stamp, this.form, { responseType: this.isDownload ? 'blob' : 'application/json' })
  		.then((resp) => {
  			console.log(resp);
  			if (resp.status === 200) {
  				if (this.isDownload) {
  					let filename = '';
  					const disposition = resp.headers['content-disposition'];
  					if (disposition) {
  						if (disposition.indexOf('attachment') !== -1) {
  							const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  							const matches = filenameRegex.exec(disposition);
  							if (matches != null && matches[1]) {
  								filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  							}
  						}
  						this.$blobUtils.download(
                resp.data as Blob,
                '要保單位基本資料.pdf',
                resp.headers['content-type'],
  						);
  					} else {
  						this.$coInsuranceUnitApi.updateUnitUsingPOST(this.stamp, this.form)
  							.then((resp) => {
  								const respData = JSON.stringify(resp);
  								const apiErrorMsg = JSON.parse(respData).data.apiError;
  								notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  							}).catch((err) => {
  								console.log(err);
  							}).finally();
  					}
  				} else {
  					notification.success({
  						Content: '儲存成功',
  					});
  				}
  			} else {
  				notification.error({
  					Content: '系統忙碌中，請稍後再試',
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.isDownloading = false;
  		});
  }

  async getCoInsuranceInfo() {
  	const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	const query = JSON.parse(decryptString);
  	console.log(query);
  	this.form = query.form;
  	this.initForm = query.initForm;
  	this.fromApiForm = query.fromApiForm;
  	this.stamp = query.stamp;
  }

  checkIfDownload() {
  	// 若更改欄位非藍色區塊，僅儲存不下載
  	const form = JSON.stringify(this.form);
  	const apiForm = JSON.stringify(this.fromApiForm);
  	const newForm = JSON.parse(form);
  	const apiNewForm = JSON.parse(apiForm);
  	['faxNo', 'applTel', 'crflc3', 'crfmc3'].forEach((e) => delete newForm[e]);
  	['faxNo', 'applTel', 'crflc3', 'crfmc3'].forEach((e) => delete apiNewForm[e]);

  	if (JSON.stringify(newForm) === JSON.stringify(apiNewForm) && !this.stamp) {
  		this.isDownload = false;
  	}
  }

  async created() {
  	await this.getCoInsuranceInfo();
  	this.checkIfDownload();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.line {
  border: 0;
  border-bottom: 1px #CECECE dashed;
  margin-bottom: 30px;
}
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
  margin-top: 10px;
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
  word-break: break-word;
  margin-bottom: 25px;
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
.coInfo__print__content {
  padding-top: 230px;
  border-bottom: 1px #ddd dashed;
  padding-bottom: 10px;
}
.coInfo__print__wrap {
  margin: 25px 0 80px 0;
}
.coInfo__print__title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  background-color: #F5F5F5;
  border-radius: 4px;
  padding: 6px 0;
}
.reminder__txt {
  margin-bottom: 40px;
  p {
    font-size: 14px;
    margin-bottom: 5px;
  }
}
hr {
  border: 0;
  border-bottom: 1px #CECECE dashed;
  outline: 0;
}
</style>
