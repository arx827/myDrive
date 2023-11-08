<template>
  <div>
    <div class="container relevantSurvey">
      <div class="d-flex justify-content-between align-items-center block--padding">
        <div class="page__title">
          {{ formTitle }}
        </div>
      </div>
      <div class="page__card p-0 block--padding">
        <div class="page__card__title page__card__headerTitle">
          基本資料
        </div>
        <div class="row card__info">
          <div class="col-md card__info__col">
            <div class="row mb-2">
              <div class="col-3 title--green">
                員工姓名
              </div>
              <div class="col-9">
                {{ infoData.empName }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-3 title--green">
                性別
              </div>
              <div class="col-9">
                {{ infoData.sex }}
              </div>
            </div>
          </div>
          <div class="col-md card__info__col">
            <div class="row mb-2">
              <div class="col-3 title--green">
                職稱
              </div>
              <div class="col-9">
                {{ infoData.jobPos }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-3 title--green">
                員工編號
              </div>
              <div class="col-9">
                {{ infoData.empNum }}
              </div>
            </div>
            <div class="row">
              <div class="col-3 title--green">
                部門/單位
              </div>
              <div class="col-9">
                {{ infoData.dep }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relevantSurvey__wrap">
        <div class="relevantSurvey__block bg__light">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="formRules"
            :layout="'vertical'"
            :hide-required-mark="true"
          >
            <div
              v-for="(info, index) in content"
              :key="index"
            >
              <!-- title -->
              <div class="block__title">
                {{ info.blockTitle }}
              </div>
              <!-- radio -->
              <div v-if="info.qaType===1">
                <div
                  v-for="(option, idx) in info.qa"
                  :key="idx"
                >
                  <a-form-model-item
                    :prop="option.ans"
                  >
                    <span
                      slot="label"
                      class="lable__title"
                    >
                      {{ option.qaTitle }}<span class="mark">*</span>
                    </span>
                    <a-radio-group
                      v-model="form[option.ans]"
                      class="row radio__wrap"
                      :disabled="!isEdit"
                    >
                      <a-radio
                        v-for="item in option.descOption"
                        :key="item.value"
                        :value="item.value"
                        class="col-sm query__wrap"
                      >
                        {{ item.desc }}
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </div>
              </div>
              <!-- hr -->
              <hr v-if="index !== content.length-1">
            </div>
          </a-form-model>
        </div>
        <div class="block--padding">
          <div class="btn__wrap text-center">
            <button
              class="btn__radius--primary--outline"
              @click="handleCancel"
            >
              取消
            </button>
            <button
              v-if="form.question3==='Y' && form.question4==='Y' && form.question5==='Y'"
              class="btn__radius--primary"
              @click="handleNext"
            >
              下一步
            </button>
            <button
              v-else
              class="btn__radius--primary"
              @click="onSubmit"
            >
              完成填寫
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { EmpErgonomicFormQueryDto, EmpSaveFormFillOutResultDto } from '@fubonlife/oss-api-axios-sdk';

@Component({})
export default class RelevantSurveyForm1 extends Vue {
  @Action('setLoading') setLoading;

  // 表單內容
  content = [];

  formTitle = '人因性危害預防計畫問卷';

  // 紀錄編號
  recordId = null;

  // 個案編號
  caseId = null

  // 是否可編輯
  isEdit = true;

  // 基本資料
  infoData = {
  	empName: this.$user.getMe().name,
  	sex: this.$user.getMe().sex === 'F' ? '女性' : '男性',
  	jobPos: this.$user.getMe().title,
  	empNum: this.$user.getMe().adId,
  	dep: this.$user.getMe().dptName,
  }

  // 表單內容
  form = {};

  // 檢核規則
  formRules = {
  	workType: [{ required: true, message: '請勾選您的作業名稱' }],
  };

  // 表單類別項目
  dataGroup: {key?: string; property?: string; label?: string; type: string}[] = [
  	{
  		label: '一、個人相關',
  		type: 'title',
  	},
  	{
  		key: 'workType',
  		property: 'workType',
  		label: '作業名稱',
  		type: 'radio',
  	},
  	{
  		key: 'handType',
  		property: 'handType',
  		label: '您的慣用手',
  		type: 'radio',
  	},
  	{
  		type: 'hr',
  	},
  	{
  		label: '二、症狀相關',
  		type: 'title',
  	},
  	{
  		key: 'symptom1',
  		property: 'symptom1',
  		label: '您在過去的一年內，身體是否有長達「兩星期以上」的疲勞、痠痛、發麻、刺痛等不舒服，或關節活動受到限制？',
  		type: 'radio',
  	},
  	{
  		key: 'symptom2',
  		property: 'symptom2',
  		label: '症狀再確認：您目前是否仍具有「肌肉痠痛」或「骨骼關節活動受限」之不適症狀？',
  		type: 'radio',
  	},
  	{
  		key: 'symptom3',
  		property: 'symptom3',
  		label: '您認為上揭症狀是否可能與目前的工作有關？',
  		type: 'radio',
  	},
  ]

  // 選項
  optionEnum = {
  	workType: [
  		{ value: 'clericalWork', label: '行政作業' },
  		{ value: 'outWork', label: '外勤' },
  	],
  	handType: [
  		{ value: 'right', label: '右手' },
  		{ value: 'left', label: '左手' },
  	],
  	symptom1: [
  		{ value: 0, label: '否' },
  		{ value: 1, label: '是' },
  	],
  	symptom2: [
  		{ value: 0, label: '否' },
  		{ value: 1, label: '是' },
  	],
  	symptom3: [
  		{ value: 0, label: '否' },
  		{ value: 1, label: '是' },
  	],
  }

  // 取消
  handleCancel() {
  	this.$router.push({ name: 'RelevantSurveyIndex' });
  }

  // 下一步
  handleNext() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			sessionStorage.setItem('form_step1', JSON.stringify(this.form));
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'RelevantSurveyForm2',
  				query: {
  					caseId: this.caseId,
  					contentA: this.content,
  					recordIdA: this.recordId,
  					formA: this.form,
  				},
  			});
  		} else {
  			console.log('error search!!');
  			return false;
  		}
  	});
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			const formData: EmpSaveFormFillOutResultDto = {
  				formName: 'F0201',
  				recordId: this.recordId,
  				empFormDtoList: [],
  			};
  			this.content.forEach((item, index) => {
  				const block = {
  					topicType: item.blockTitle,
  					topicAndOptsDtoList: [],
  				};
  				item.qa.forEach((qaOption, idx) => {
  					const subBlock = {
  						ans: this.form[`${qaOption.ans}`],
  						ansType: item.qaType,
  						topicId: qaOption.topicId,
  					};
  					block.topicAndOptsDtoList.push(subBlock);
  				});
  				formData.empFormDtoList.push(block);
  			});
  			this.setLoading(true);
  			this.$EhEmpFormFillOutControllerApi.saveErgonomicFormUsingPOST(formData)
  				.then((resp) => {
  					console.log('result', resp.data.data);
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'RelevantSurveyResult',
  						query: {
  							result: resp.data.status === 200 ? 'success' : 'fail',
  							errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  						},
  					});
  				})
  				.catch((error) => {
  					console.log('error status = ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else {
  			console.log('error search!!');
  			return false;
  		}
  	});
  }

  created() {
  	this.setLoading(true);
  	this.caseId = this.$global.getQuery();
  	const queryData: EmpErgonomicFormQueryDto = {
  		caseId: this.caseId,
  		formName: 'F0201',
  	};
  	this.$EhEmpFormFillOutControllerApi.queryErgonomicFormUsingPOST(queryData)
  		.then((resp) => {
  			// if (resp.data.data.formStatus === 'E0302') {
  			// 	this.isEdit = false;
  			// }
  			this.recordId = resp.data.data.recordId;
  			this.formTitle = resp.data.data.formName;
  			resp.data.data.empFormDtoList.forEach((item, index) => {
  				const option = {
  					blockTitle: item.topicType,
  					qaType: item.topicAndOptsDtoList[0].ansType,
  					qa: [],
  				};
  				item.topicAndOptsDtoList.forEach((subItem, idx) => {
  					const subOption = {
  						qaTitle: subItem.topicDesc,
  						ans: `question${subItem.topicId}`,
  						descOption: [],
  						topicId: subItem.topicId,
  					};
  					this.$set(this.form, `question${subItem.topicId}`, subItem.ans ? subItem.ans : '');
  					if (subItem.topicId === 1) {
  						this.form[`question${subItem.topicId}`] = 'F0501';
  					}
  					if (subItem.topicId === 2) {
  						this.form[`question${subItem.topicId}`] = 'F0503';
  					}
  					this.formRules[`question${subItem.topicId}`] = [{ required: true, message: '請勾選', trigger: 'change' }];
  					subItem.options.forEach((qaOption, qaIdx) => {
  						const qaSubOption = {
  							desc: qaOption.optDesc,
  							value: qaOption.optValue,
  						};
  						subOption.descOption.push(qaSubOption);
  					});
  					option.qa.push(subOption);
  				});
  				this.content.push(option);
  			});
  			if (sessionStorage.getItem('form_step1')) {
  				this.form = JSON.parse(sessionStorage.getItem('form_step1'));
  				console.log('form => ', this.form);
  			}
  		})
  		.catch((error) => {
  			console.log('error status= ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  updated() {
  	window.parseWord();
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
  .card__info {
    padding: 20px;
  }
  .card__info__col {
    padding-left: 0;
    @include rwd-md {
      padding-left: 30px;
    }
    &:nth-child(1) {
      border: 0;
      @include rwd-md {
        border-right: 1px solid #D1D1D1;
      }
    }
    @include rwd-lg {
      padding-left: 90px;
    }
  }
  .lable__title {
    font-weight: 600;
  }
  .mark {
    width: 20px;
    height: 20px;
    color: #FC001A;
    font-size: 25px;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 27px;
  }
  .query__wrap {
    border-radius: 4px;
    background-color: #FFFFFF;
    padding: 10px;
    margin-top: 10px;
    label {
      cursor: pointer;
      padding-left: 10px;
      font-size: 14px;
      @include rwd-xl {
        font-size: 16px;
      }
    }
  }
  .title--green {
    color: #23C4A8;
    font-weight: 600;
  }
  .radio__wrap {
    margin-left: 0;
  }
  .relevantSurvey__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 0px;
    @include rwd-sm {
      border-radius: 10px;
    }
    hr {
      border: 0;
      border-bottom: 1px solid #D1D1D1;
      margin-top: 22px;
      margin-bottom: 30px;
    }
  }
  .block__title {
    color: #000000;
    font-weight: 600;
    margin-bottom: 20px;
    font-size: 18px;
    @include rwd-lg {
      font-size: 20px;
    }
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
    .relevantSurvey {
      .col-3 {
        width: 26%;
      }
      .col-9 {
        width: 74%;
      }
    }
  }
</style>
