<template>
  <div>
    <div class="container">
      <div class="page__title">
        母性健康計畫
      </div>
      <div class="event__block">
        <div class="block__content">
          <a-card class="block__content__card">
            <template #cover>
              <img
                alt="example"
                :src="content.MOM_ENTRANCE_IMG"
              >
            </template>
            <a-card-meta class="block__content__card__content editor__preview">
              <template #description>
                <p v-html="content.MOM_ENTRANCE_NOTE" />
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
      <div class="choice__block">
        <div class="choice__block__title">
          填單選擇：
        </div>
        <div class="row">
          <div class="col-sm-6 col-12 mb-4">
            <div
              class="choice__block__in d-flex flex-column align-items-center"
              :class="{'disabled': formAbled !== 'PREGNANT'}"
              :disabled="formAbled !== 'PREGNANT'"
              @click="selectForm('PREGNANT')"
            >
              <div class="choice__block__in__img d-flex align-items-end">
                <img src="~@images/image_pregnant.svg">
              </div>
              <div class="choice__block__in__title">
                媽咪妊娠中
              </div>
              <div class="choice__block__in__subtitle">
                懷孕期間健康情形自我評估表
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-12">
            <div
              class=" choice__block__in d-flex flex-column align-items-center"
              :class="{'disabled': formAbled !== 'MOTHER'}"
              :disabled="formAbled !== 'MOTHER'"
              @click="selectForm('MOTHER')"
            >
              <div class="choice__block__in__img d-flex align-items-end">
                <img src="~@images/image_mom.svg">
              </div>
              <div class="choice__block__in__title">
                產後未滿一年
              </div>
              <div class="choice__block__in__subtitle">
                分娩後一年內健康情形自我評估表
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import notification from '@/plugins/notification/infoNotification';
import { CheckDataLAAHealthInfoEnterDto } from '@fubonlife/oss-api-axios-sdk';

@Component({})
export default class MotherPlanIndex extends Vue {
@Action('setLoading') setLoading;

  disable: boolean = false; // true: 目前為不可填單狀態 false: 目前為可填單狀態

  motherFormDisable = true;

  pregnantFormDisable = true;

  formAbled = ''

  content = {
  	PERSONAL_INFO_STATEMENT: null,
  	MOM_ENTRANCE_IMG: null,
  	MOM_ENTRANCE_NOTE: null,
  }

  selectForm(formName) {
  	if (formName !== this.formAbled) return;
  	if (this.formAbled === 'MOTHER') {
  		this.$router.push({ name: 'MotherPlanAfterForm' });
  	} else {
  		this.$router.push({ name: 'MotherPlanPregnantForm' });
  	}
  }

  // 取得初始活動資料
  getData() {
  	this.setLoading(true);
  	this.$MONPLANRpnEventContentMaintainApi.queryEventContentRUsingPOST()
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				resp.data.data.forEach((element) => {
  					Object.keys(this.content).forEach((val) => {
  						if (element.code === val) {
  							this.content[element.code] = element.value;
  						}
  					});
  				});
  				console.log(this.content);
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 取得表單權限
  getListAuth() {
  	this.$MONPLANEmpFormApi.fillEvaluateFormFunctionEUsingPOST()
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.formAbled = resp.data.data.pregnantCategoryEnum;
  				// if (resp.data.data.pregnantCategoryEnum === 'MOTHER') {
  				// 	this.pregnantFormDisable = true;
  				// 	this.motherFormDisable = false;
  				// } else if (resp.data.data.pregnantCategoryEnum === 'PREGNANT') {
  				// 	this.pregnantFormDisable = false;
  				// 	this.motherFormDisable = true;
  				// } else if (!resp.data.data.pregnantCategoryEnum) {
  				// 	this.motherFormDisable = true;
  				// 	this.pregnantFormDisable = true;
  				// }
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  created() {
  	this.getData();
  	this.getListAuth();
  }
}
</script>

<style lang="scss" scoped>
  .event__block {
    margin-bottom: 30px;
  }
  .block__title {
    color: $COLOR-MAIN1;
    margin-bottom: 5px;
    font-weight: $TEXT-BOLD;
  }
  .ant-card-cover img {
    border-radius: 10px 10px 0 0;
	}
	.block__content__card {
		width: 100%;
		border: 0.5px solid #CED4D9;
		border-radius: 10px;
		box-shadow: 0px 3px 0px #C9C9C9;
		.block__content__card__content{
			padding-left: calc(92/1088*100%);
      padding-right: calc(92/1088*100%);
		}
	}
  .choice__block {
    margin-bottom: 40px;
    .choice__block__title {
      margin-bottom: 14px;
      font-size: 20px;
      font-weight: $TEXT-BOLD;
    }
    .choice__block__in {
      padding-top: 14px;
      background-color: #FDF8F0;
      border: 1px solid #CED4D9;
      box-shadow: 0px 0px 0px 2px transparent;
      border-radius: 10px;
      &:hover{
        cursor: pointer;
        box-shadow: 0px 0px 0px 2px rgba(35,196,168, 0.35);
        border: 1px solid #23C4A8;
      }
      .choice__block__in__img {
        height: 186px;
      }
      .choice__block__in__title{
        text-align: center;
        font-size: 30px;
      }
      .choice__block__in__subtitle{
        text-align: center;
        font-size: 20px;
        margin-bottom: 17px;
      }
      &.disabled {
        background-color: #F5F5F6;
        border: 0px;
        opacity: 0.6;
        &:hover{
          cursor: not-allowed;
          box-shadow: 0px 0px 0px 0px;
          border: 0px;
        }
      }
    }
  }

</style>
