<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between align-items-center block--padding">
        <div class="page__title">
          {{ formTitle }}
        </div>
      </div>
      <div class="page__card p-0 block--padding">
        <div class="page__card__title page__card__headerTitle">
          依據您十五項身體各部位的不適感，給予實際情況的評分，0~5各分數相對應定義如下。
        </div>
        <div class="row card__info">
          <div class="col-md">
            <div
              v-for="(item, idx) in contentLevA"
              :key="idx"
              class="row"
              :class="{'mb-2': idx<contentLevA.length-1}"
            >
              {{ item.score }}：{{ item.desc }}
            </div>
          </div>
          <div class="col-md">
            <div
              v-for="(item, idx) in contentLevB"
              :key="idx"
              class="row"
              :class="{'mb-2': idx<contentLevB.length-1}"
            >
              {{ item.score }}：{{ item.desc }}
            </div>
          </div>
        </div>
      </div>
      <div class="relevantSurvey__wrap">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="formRules"
          :layout="'vertical'"
        >
          <div class="row">
            <div class="col-md">
              <div class="img__wrap block--padding">
                <div class="img__man">
                  <img
                    src="~@images/image_shadow.png"
                    class="image__shadow"
                  >
                  <img
                    src="~@images/image_adult.png"
                    class="image__adult"
                  >
                  <div
                    v-for="i in 15"
                    :key="i"
                    :class="'image__point'+i"
                  >
                    <div class="point__text">
                      {{ i }}
                    </div>
                    <img
                      v-if="!queryHover[i-1]"
                      src="~@images/image_greenPoint.png"
                    >
                    <img
                      v-else
                      src="~@images/image_redPoint.png"
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md notMobile">
              <div class="row table__title text-center me-0 border-bottom">
                <div class="col-4" />
                <div class="col border-end">
                  0
                </div>
                <div class="col border-end">
                  1
                </div>
                <div class="col border-end">
                  2
                </div>
                <div class="col border-end">
                  3
                </div>
                <div class="col border-end">
                  4
                </div>
                <div class="col">
                  5
                </div>
              </div>
              <div
                v-for="(item, index) in content"
                :key="index"
              >
                <a-form-model-item :prop="item.ans">
                  <a-radio-group
                    :id="item.ans"
                    v-model="form[item.ans]"
                    class="row text-center me-0 p-2 border-bottom radio__wrap"
                    @mouseover.native="$set(queryHover, index, true)"
                    @mouseleave.native="$set(queryHover, index, false)"
                  >
                    <div class="col-4 text-end py-1">
                      {{ item.qaTitle }}<span class="mark">＊</span>
                    </div>
                    <a-radio
                      value="0"
                      class="col"
                    />
                    <a-radio
                      value="1"
                      class="col"
                    />
                    <a-radio
                      value="2"
                      class="col"
                    />
                    <a-radio
                      value="3"
                      class="col"
                    />
                    <a-radio
                      value="4"
                      class="col"
                    />
                    <a-radio
                      value="5"
                      class="col"
                    />
                  </a-radio-group>
                </a-form-model-item>
              </div>
            </div>
            <div class="isMobile bg__light relevantSurvey__block">
              <div
                v-for="(item, index) in content"
                :key="index"
              >
                <a-form-model-item :prop="item.key">
                  <div class="mt-3">
                    {{ item.qaTitle }}<span class="mark">＊</span>
                  </div>
                  <a-radio-group
                    :id="item.ans"
                    v-model="form[item.ans]"
                    class="row"
                    @mouseover.native="$set(queryHover, index, true)"
                    @mouseleave.native="$set(queryHover, index, false)"
                  >
                    <div
                      v-for="(option, idx) in item.descOption"
                      :key="idx"
                      class="col-6 mt-2"
                    >
                      <a-radio

                        :value="option.value"
                        class="query__wrap"
                      >
                        {{ option.desc }}
                      </a-radio>
                    </div>
                  </a-radio-group>
                </a-form-model-item>
              </div>
            </div>
          </div>
        </a-form-model>
      </div>
      <div class="block--padding">
        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary--outline"
            @click="handleBack"
          >
            上一步
          </button>
          <button
            class="btn__radius--primary"
            @click="handleNext"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component,
} from 'vue-property-decorator';
import InfoModal from '@/plugins/notification/infoModal';
import { Action } from 'vuex-class';
import { EmpErgonomicFormQueryDto, EmpSaveFormFillOutResultDto } from '@fubonlife/oss-api-axios-sdk';

@Component({})
export default class RelevantSurveyForm2 extends Vue {
  @Action('setLoading') setLoading;

  // 等級內容
  contentLev = null;

  contentLevA = null;

  contentLevB = null;

  // 表單內容
  content = [];

  contentA = null;

  // 個案編號
  caseId = null;

  formTitle = '自覺肌肉骨骼不適症狀調查';

  // 是否可編輯
  isEdit = true;

  // 紀錄編號
  recordId = null;

  recordIdA = null;

  // 表單內容
  form = {};

  formA = null;

  // 檢核規則
  formRules = {};

  pullOption= [];

  // 選項
  optionGroup = [
  	{ label: '1. 頸部', key: 'query1' },
  	{ label: '2. 左肩', key: 'query2' },
  	{ label: '3. 左手肘/左前臂', key: 'query3' },
  	{ label: '4. 左手/左前腕', key: 'query4' },
  	{ label: '5. 左臀/左大腿', key: 'query5' },
  	{ label: '6. 左膝', key: 'query6' },
  	{ label: '7. 左腳踝/左腳', key: 'query7' },
  	{ label: '8. 上背', key: 'query8' },
  	{ label: '9. 右肩', key: 'query9' },
  	{ label: '10. 右手肘/右前臂', key: 'query10' },
  	{ label: '11. 下背', key: 'query11' },
  	{ label: '12. 右手/右手腕', key: 'query12' },
  	{ label: '13. 右臀/右大腿', key: 'query13' },
  	{ label: '14. 右膝', key: 'query14' },
  	{ label: '15. 右腳踝/右腳', key: 'query15' },
  ];

  queryHover = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

  // 全部都已勾選
  isOk = true;

  // 上一步
  handleBack() {
  	this.$router.push({ name: 'RelevantSurveyForm1' });
  }

  // 下一步
  handleNext() {
  	this.isOk = true;
  	(this.$refs.ruleForm as any).validate((valid) => {
  		this.optionGroup.forEach((item) => {
  			if (this.form[item.key] === '') {
  				this.isOk = false;
  			}
  		});
  		if (valid && this.isOk) {
  			for (let i = 0; i < Object.keys(this.form).length; i++) {
  				if (parseInt(this.form[Object.keys(this.form)[i]]) > 0) {
  					const option = {
  						desc: this.content[i].qaTitle,
  						topicId: this.content[i].topicId,
  					};
  					this.pullOption.push(option);
  				}
  			}
  			sessionStorage.setItem('form_step2', JSON.stringify(this.form));
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'RelevantSurveyForm3',
  				query: {
  					pullOption: this.pullOption,
  					caseId: this.caseId,
  					contentA: this.contentA,
  					contentB: this.content,
  					recordIdA: this.recordIdA,
  					recordIdB: this.recordId,
  					formA: this.formA,
  					formB: this.form,
  				},
  			});
  		} else {
  			InfoModal.alertError({
  				title: '必填欄位尚未填寫',
  				confirm: false,
  				content: '檢測到必填欄位尚未填寫，請填寫完成，再進行下一步，謝謝。',
  			});
  			return false;
  		}
  	});
  }

  created() {
  	this.setLoading(true);
  	this.caseId = this.$global.getQuery().caseId;
  	this.contentA = this.$global.getQuery().contentA;
  	this.recordIdA = this.$global.getQuery().recordIdA;
  	this.formA = this.$global.getQuery().formA;
  	const queryData: EmpErgonomicFormQueryDto = {
  		caseId: this.caseId,
  		formName: 'F0202',
  	};
  	this.$EhEmpFormFillOutControllerApi.queryMuscleBoneAbnormalSymptomLevelUsingPOST()
  		.then((resp) => {
  			this.contentLev = resp.data.data;
  			const arrlen = this.contentLev.length / 2;
  			this.contentLevA = this.contentLev.slice(0, arrlen);
  			this.contentLevB = this.contentLev.slice(3, this.contentLev.length);
  			this.$EhEmpFormFillOutControllerApi.queryErgonomicFormUsingPOST(queryData)
  				.then((resp) => {
  					console.log('result', resp.data.data);
  					// if (resp.data.data.formStatus === 'E0302') {
  					// 	this.isEdit === false;
  					// }
  					this.formTitle = resp.data.data.formName;
  					this.recordId = resp.data.data.recordId;
  					resp.data.data.empFormDtoList[0].topicAndOptsDtoList.forEach((item, index) => {
  						const subOption = {
  							qaTitle: `${index + 1}.${item.topicDesc}`,
  							ans: `question${item.topicId}`,
  							descOption: [],
  							topicId: item.topicId,
  						};
  						this.$set(this.form, `question${item.topicId}`, item.ans ? item.ans : '');
  						this.formRules[`question${item.topicId}`] = [{ required: true, message: '請勾選', trigger: 'change' }];
  						item.options.forEach((qaOption, qaIdx) => {
  							const qaSubOption = {
  								desc: qaOption.optDesc,
  								value: qaOption.optValue,
  							};
  							subOption.descOption.push(qaSubOption);
  						});
  						this.content.push(subOption);
  					});
  					console.log('content', this.content);
  					if (sessionStorage.getItem('form_step2')) {
  						this.form = JSON.parse(sessionStorage.getItem('form_step2'));
  						console.log('form => ', this.form);
  					}
  				})
  				.catch((error) => {
  					console.log('error status= ', error);
  				});
  		})
  		.catch((error) => {
  			console.log(error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 0;
    @include rwd-sm {
      padding-right: var(--bs-gutter-x, 8px);
      padding-left: var(--bs-gutter-x, 8px);
    }
  }
  .block--padding {
    margin: 0 30px;
    @include rwd-sm {
      margin: 0;
    }
  }
  .page__card {
    border: 0.5px solid #CED4D9;
    margin-bottom: 20px;
    margin-top: 0;
    width: auto;
    border-radius: 0;
  }
  .notMobile {
    display: none;
    @include rwd-md {
      display: block;
    }
  }
  .isMobile {
    @include rwd-md {
      display: none;
    }
  }
  .query__wrap {
    background-color: #fff;
    padding: 8px 10px;
    width: 100%;
    border-radius: 4px;
  }
  .relevantSurvey__block {
    margin-top: 20px;
    padding: 20px 10%;
    line-height: 28px;
    border-radius: 10px;
  }
  .img__wrap {
    background-image: linear-gradient(to bottom, #BDC8D0, #BDC8D0, #D9E1E7);
    border-radius: 30px;
    min-height: 688px;
    height: 100%;
  }
  .img__man {
    position: relative;
    width: 350px;
    height: 591px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .image__adult {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .image__shadow {
    position: absolute;
    top: 94%;
    left: 50%;
    transform: translateX(-50%);
  }
  .point__text {
    position:absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }
  .card__info {
    padding: 20px 30px;
    @include rwd-lg {
      padding: 20px 100px;
    }
  }
  .table__title {
    background-color: #FAFAFA;
    padding: 8px;
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;
    @include rwd-md {
      margin-top: 0px;
    }
  }
  .radio__wrap:hover {
    background-color: #F4F8FC;
  }
  .image__point1 {
    position: absolute;
    left: 44%;
    top: 9%;
  }
  .image__point2 {
    position: absolute;
    left: 22%;
    top: 14%;
  }
  .image__point3 {
    position: absolute;
    left: 13%;
    top: 29%;
  }
  .image__point4 {
    position: absolute;
    left: 6%;
    top: 42%;
  }
  .image__point5 {
    position: absolute;
    left: 24%;
    top: 54%;
  }
  .image__point6 {
    position: absolute;
    left: 28%;
    top: 70%;
  }
  .image__point7 {
    position: absolute;
    left: 28%;
    top: 89%;
  }
  .image__point8 {
    position: absolute;
    left: 44%;
    top: 21%;
  }
  .image__point9 {
    position: absolute;
    left: 66%;
    top: 14%;
  }
  .image__point10 {
    position: absolute;
    left: 75%;
    top: 29%;
  }
  .image__point11 {
    position: absolute;
    left: 44%;
    top: 36%;
  }
  .image__point12 {
    position: absolute;
    left: 80%;
    top: 42%;
  }
  .image__point13 {
    position: absolute;
    left: 63%;
    top: 54%;
  }
  .image__point14 {
    position: absolute;
    left: 60%;
    top: 70%;
  }
  .image__point15 {
    position: absolute;
    left: 60%;
    top: 89%;
  }
  .mark {
    width: 16px;
    height: 20px;
    color: #FC001A;
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 21px;
  }
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 130px;
      padding: 10px 20px;
      margin: 0 5px;
      @include rwd-md {
        width: 200px;
      }
    }
  }
  ::v-deep {
    .ant-radio-wrapper {
      margin-right: 0;
    }
    .ant-form-item {
      margin: 0;
      padding: 0;
    }
  }
</style>
