<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '填表完成':'填表失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <p>親愛的同仁您好，</p>
        <!-- 成功訊息 -->
        <div v-if="result === 'success'">
          <div class="mb-4">
            <p>您的表單已完成送出，感謝您的耐心填寫！</p>
            <p>系統也將您所填答的回饋，初步評估了您過勞的狀況。提供您做為參考，資訊如下。</p>
          </div>
          <hr>
          <div class="img__wrap">
            <img
              src="@/assets/images/image_sixPeople.svg"
              class="m-auto pt-2 ps-3 pe-3"
            >
          </div>
          <div
            v-for="(resp,indexOfResp) in respData"
            :key="indexOfResp"
          >
            <hr
              v-if="indexOfResp > 0"
              class="hr--none"
            >
            <div class="title--green">
              <!-- TEST: -->
              <!-- {{ resp.type=='E0401' ? '負荷評估量表自我篩檢結果': '十年內心血管疾病發病風險評估量表結果' }} -->
              {{ resp.type }}
            </div>
            <div class="row">
              <div
                v-for="(formType, indexOfFormTypeList) in resp.formTypeList"
                :key="indexOfFormTypeList"
                :class="{'col-md-6 col-12': resp.type=='負荷評估量表自我篩檢結果'}"
              >
                <div class="title--black">
                  {{ formType.fromType }}
                </div>
                <div
                  class="block__wrap bg__light"
                  :class="{'block--height': resp.type=='負荷評估量表自我篩檢結果'}"
                >
                  <div class="block__title">
                    {{ formType.level }}
                  </div>
                  <div class="block__content">
                    {{ formType.levelDesc }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 失敗訊息 -->
        <div v-if="result === 'fail'">
          <p>您欲填寫的表單，{{ errorMsg }}因素無法進行。</p>
          <p>如尚需填寫，請您再次嘗試。或與相關服務人員聯繫，謝謝您！</p>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/AbnormalLoad/relevantScale/index">
          <button class="btn__radius--primary btn__back">
            返回主頁
          </button>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class RelevantScaleResult extends Vue {
  @Action('setLoading') setLoading;

  result: 'success' | 'fail' = null;

  respData = null;

  errorMsg = '';

  setResultParam() {
  	const query = this.$global.getQuery();
  	this.getResult(query.infoId);
  }

  // API: 異常負荷綜合計算結果
  getResult(infoId) {
  	this.setLoading(true);
  	this.$AlEmpAlCaseFillOutControllerApi.queryResultUsingPOST({ infoId })
    	.then((resp) => {
  			if (!resp.data.errors) {
  				this.result = 'success';
  			  this.respData = resp.data.data;
  			} else {
  				this.result = 'fail';
  				const getError = resp.data.errors;
  				this.errorMsg = getError && this.$global.getApiErrorMsg(getError).join('');
  			}
  		})
  		.catch((error) => {
  			this.result = 'fail';
   			//  TEST:
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  created() {
  	this.setResultParam();
  }
}
</script>

<style lang="scss" scoped>
  .img__wrap {
    background-color: #F8F4EF;
    border-radius: 4px;
    margin-bottom: 30px;
  }
  .title--green {
    color: #24C7A7;
    font-size: 24px;
    margin-bottom: 20px;
  }
  .title--black {
    margin-bottom: 10px;
  }
  .block__wrap {
    padding: 20px 40px;
    border-radius: 4px;
  }
  .block--height {
    margin-bottom: 20px;
    min-height: 235px;
    @include rwd-lg {
      min-height: 200px;
    }
  }
  .block__title {
    font-weight: 600;
    font-size: 24px;
    margin-bottom: 10px;
    color: #363637;
  }
  hr {
    border: 1px solid #D1D1D1;
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .hr--none {
    display: none;
    @include rwd-md {
      display: block;
      border: 1px solid #D1D1D1;
      margin-top: 10px;
      margin-bottom: 30px;
    }
  }
  p {
    margin-bottom: 5px;
  }
  .btn__back {
    padding: 8px 60px;
  }
</style>
