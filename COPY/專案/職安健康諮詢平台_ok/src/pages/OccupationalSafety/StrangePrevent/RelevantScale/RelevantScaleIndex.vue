<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          相關量表填寫
        </div>
      </div>
      <div class="event__block">
        <div class="block__content">
          <a-card class="card__wrap">
            <template #cover>
              <img
                :alt="overLoadInfo.bannerFilename"
                :src="overLoadInfo.bannerFile"
              >
            </template>
            <a-card-meta
              class="card__content editor__preview"
              v-html="overLoadInfo.desc"
            />
          </a-card>
        </div>
      </div>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary"
          :disabled="!hasOverLoadForm && !hasFriskForm"
          @click="goToForm"
        >
          {{ (!hasOverLoadForm && !hasFriskForm) ? '無量表填寫' : '開始填寫' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { EmpHealthOverLoadConfigDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: {} })
export default class RelevantScaleIndex extends Vue {
  @Action('setLoading') setLoading;

  overLoadInfo: EmpHealthOverLoadConfigDto = {
  	desc: '',
  }

  totalStep = 0;

  nowStep = 0;

  memo = '';

  respData = {
  	overload: null,
  	frisk: null,
  };

  hasOverLoadForm = false;

  hasFriskForm = false;

  publicMail = null;

  // API: 查詢異常工作入口
  async queryOverload() {
   	await this.$AlEmpAlCaseFillOutControllerApi.getHealthOverLoadConfigUsingPOST()
   		.then((resp) => {
   			//  TEST:
   			// console.log(resp);
  			if (resp.data.data) {
  				this.overLoadInfo = resp.data.data;
  			}
   		})
   		.catch((error) => {
   			//  TEST:
  			console.log('error status = ', error);
  		});
  }

  // API: 異常工作填寫問卷
  async fetchOverloadForm(uid) {
  	await this.$AlEmpAlCaseFillOutControllerApi.getOverLoadFormDataUsingPOST({ uid })
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.respData.overload = JSON.parse(JSON.stringify(resp.data.data));
  				this.hasOverLoadForm = true;
  			}
  		})
  		.catch((error) => {
   			//  TEST:
  			console.log('error status = ', error);
  		});
  }

  // API: F表問題與選項
  async fetchFriskForm(uid) {
  	await this.$AlEmpAlCaseFillOutControllerApi.getFriskFormDataUsingPOST({ uid })
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.respData.frisk = JSON.parse(JSON.stringify(resp.data.data));
  				this.hasFriskForm = true;
  			}
  		})
  		.catch((error) => {
   			//  TEST:
  			console.log('error status = ', error);
  		});
  }

  goToForm() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'RelevantScaleForm',
  		query: {
  			respData: this.respData,
  			pageInfo: this.overLoadInfo,
  		},
  	});
  }

  async created() {
  	this.setLoading(true);
      	const uid = this.$user.getMe().userId;
  	sessionStorage.removeItem('form_step1');
  	await this.queryOverload();
  	await this.fetchOverloadForm(uid);
  	await this.fetchFriskForm(uid);
	  this.publicMail = await this.$global.getPublicEmail();
  	this.setLoading(false);
  }
}
</script>

<style lang="scss" scoped>
  .event__block {
    margin-bottom: 20px;
  }
	.card__wrap{
		width: 100%;
		border: 0.5px solid #CED4D9;
		border-radius: 10px;
		box-shadow: 0px 3px 0px #C9C9C9;
		.card__content{
			padding-left: calc(92/1088*100%);
      padding-right: calc(92/1088*100%);
      p {
        color: #363636;
      }
		}
	}
	.ant-card-cover img {
    border-radius: 10px 10px 0 0;
	}
  .btn__wrap {
    margin: 40px 0;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
