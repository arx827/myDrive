<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          相關問卷填寫
        </div>
      </div>
      <div
        v-if="content"
        class="event__block"
      >
        <div class="block__content">
          <a-card class="card__wrap">
            <template #cover>
              <img
                alt="smallBanner3"
                :src="content.picBase64"
              >
            </template>
            <a-card-meta class="card__content">
              <template #description>
                <div class="editor__preview">
                  <div v-html="content.desc" />
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary"
          :disabled="canWrite==='N'"
          @click="onSubmit"
        >
          開始填寫
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component({})
export default class RelevantSurveyIndex extends Vue {
  @Action('setLoading') setLoading;

  content: any = null // 內容

  canWrite = 'Y';

  caseId = null;

  onSubmit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'RelevantSurveyForm1',
  		query: this.caseId,
  	});
  }

  created() {
  	this.setLoading(true);
  	this.$EhEmpFormFillOutControllerApi.getErgonomicHazardConfigUsingPOST()
  		.then((resp) => {
  			this.content = resp.data.data;
  			// const userId = 55; // 測試用
  	    const userId = this.$user.getMe().userId;
  			this.$EhEmpFormFillOutControllerApi.checkFillOutFormNeedUsingPOST(userId)
  				.then((resp) => {
  					this.canWrite = resp.data.data.isWrite;
  					this.caseId = resp.data.data.caseId;
  				})
  				.catch((error) => {
  					console.log('error status= ', error);
  				})
  				.finally(() => {
  					console.log('finish');
  				});
  		})
  		.catch((error) => {
  			console.log('error status= ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
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
