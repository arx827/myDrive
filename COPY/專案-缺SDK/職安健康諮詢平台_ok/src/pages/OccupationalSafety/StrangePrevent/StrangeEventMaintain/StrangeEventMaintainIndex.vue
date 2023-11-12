<template>
  <div>
    <div
      v-if="content"
      class="container"
    >
      <div class="d-flex justify-content-between">
        <div class="page__title">
          活動內容維護
        </div>
        <div class="pt-4">
          <button
            class="btn__radius--primary--outline--small"
            @click="goEdit"
          >
            編輯
          </button>
        </div>
      </div>
      <div class="event__block">
        <div class="block__title">
          活動說明
        </div>
        <div class="block__content">
          <a-card class="block__content__card">
            <template #cover>
              <div>
                <img
                  :src="content.bannerFile"
                >
              </div>
            </template>
            <a-card-meta class="block__content__card__content editor__preview">
              <template #description>
                <p v-html="content.desc" />
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
      <div class="event__block">
        <div class="block__title">
          個資聲明 (表1_負荷評估量表)
        </div>
        <div
          class="block__content editor__preview"
          v-html="content.statementOverload"
        />
      </div>
      <div class="event__block">
        <div class="block__title">
          個資聲明 (表2_十年內心血管疾病發病風險評估量表)
        </div>
        <div
          class="block__content editor__preview"
          v-html="content.statementFRisk"
        />
      </div>
      <div class="event__block">
        <div class="block__title">
          備註 (相關醫師面談)
        </div>
        <div
          class="block__content editor__preview"
          v-html="content.piDescPhy"
        />
      </div>
      <div class="event__block">
        <div class="block__title">
          個資聲明 (相關醫師面談)
        </div>
        <div
          class="block__content editor__preview"
          v-html="content.piStatementPhy"
        />
      </div>
      <div class="event__block">
        <div class="block__title">
          疾病風險參考
        </div>
        <div class="block__content">
          <!-- <p class="block__content__title">
            檔名：{{ content.picSpec }}
          </p> -->
          <img
            :src="content.picBase64Spec"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { VueEditor, Quill } from 'vue2-editor';
import notification from '@/plugins/notification/infoNotification';

@Component({ components: { VueEditor } })
export default class StrangeEventMaintainIndex extends Vue {
  @Action('setLoading') setLoading;

  content: any = null // 內容

  goEdit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'StrangeEventMaintainEdit',
  		query: this.content,
  	});
  }

  getData() {
  	this.setLoading(true);
  	this.$AlEmpAlCaseFillOutControllerApi.getHealthOverLoadConfigUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.content = resp.data.data;
  				console.log(resp.data.data);
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
  }
}
</script>

<style lang="scss" scoped>
  .event__block {
    margin-bottom: 20px;
  }
  .block__title {
    color: $COLOR-MAIN1;
    margin-bottom: 5px;
    font-weight: $TEXT-BOLD;
  }
	.ant-card-cover img {
    border-radius: 10px 10px 0 0;
	}
	.block__content__card{
		width: 100%;
		border: 0.5px solid #CED4D9;
		border-radius: 10px;
		box-shadow: 0px 3px 0px #C9C9C9;
		.block__content__card__content{
			padding-left: calc(92/1088*100%);
      padding-right: calc(92/1088*100%);
		}
	}
  .agree__card{
		border: 0.5px solid #CED4D9;
		border-radius: 10px;
		padding-top: 20px;
    margin-bottom: 40px;
		.card__title {
			max-width: 536px;
      margin: auto;
			color: $COLOR-MAIN1;
			margin-bottom: 20px;
			font-size: 20px;
			text-align: center;
      padding: 10px;
  	}
		.card__radio{
			width: calc(352/1088*100%);
      min-width: 80px;
      height: 60px;
			background-color: #F5F5F6;
			margin-bottom: 20px;
		}
		.card__footer{
			max-width: 345px;
      margin: auto;
			margin-bottom: 20px;
			color: #9A9A99;
			font-size: 12px;
			text-align: center;
      padding: 10px;
		}
	}
</style>
