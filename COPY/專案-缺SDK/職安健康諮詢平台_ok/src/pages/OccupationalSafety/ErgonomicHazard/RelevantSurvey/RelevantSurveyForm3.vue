<template>
  <div>
    <div class="container">
      <div class="block--padding">
        <div class="page__title mb-2">
          {{ formTitle }}
        </div>
        <div class="page__tip">
          請依上表填寫項目中個人覺得最嚴重的1-2個部位之症狀、病史說明於下。
        </div>
      </div>
      <div class="relevantSurvey__wrap">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="formRules"
          :layout="'vertical'"
          :hide-required-mark="true"
        >
          <div class="row">
            <div class="col-md">
              <div
                class="relevantSurvey__block bg__light"
              >
                <div class="block__title">
                  第一項 (必填)
                </div>
                <div
                  v-for="(item, index) in content"
                  :key="index"
                >
                  <div v-if="item.ansType===3">
                    <a-form-model-item :prop="item.ans">
                      <div class="lable__title">
                        {{ item.qaTitle }}<span class="mark">＊</span>
                      </div>
                      <a-select
                        v-model="form[item.ans]"
                        placeholder="您剛才填寫分數超過0以上的不適部位"
                        class="select"
                      >
                        <a-select-option
                          v-for="(optionItem, idx) in pullOption"
                          :key="idx"
                          :value="optionItem.desc"
                        >
                          {{ optionItem.desc }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </div>
                  <div v-if="item.ansType===2">
                    <a-form-model-item :prop="item.ans">
                      <div class="lable__title">
                        {{ item.qaTitle }}<span class="mark">＊</span>
                      </div>
                      <a-radio-group
                        v-for="subitem in item.descOption"
                        :key="subitem.value"
                        v-model="form[item.ans]"
                        class="row radio__wrap"
                      >
                        <a-radio
                          :value="subitem.value"
                          class="query__wrap"
                        >
                          {{ subitem.desc }}
                        </a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                  </div>
                  <div v-if="item.ansType===4">
                    <a-form-model-item
                      :prop="item.ans"
                      class="mb-0"
                    >
                      <span
                        slot="label"
                        class="lable__title"
                      >
                        {{ item.qaTitle }}<span class="mark">*</span>
                      </span>
                      <!-- <div class="lable__title">
                        {{ item.qaTitle }}<span class="mark">＊</span>
                      </div> -->
                      <a-textarea
                        v-model="form[item.ans]"
                        placeholder="請輸入症狀及病史說明，上限字數100字。"
                        :max-length="100"
                        :auto-size="{ minRows: 6 }"
                      />
                    </a-form-model-item>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md">
              <div class="relevantSurvey__block bg__light">
                <div class="block__title">
                  第二項 (選填)
                </div>
                <div
                  v-for="(item, index) in content2"
                  :key="index"
                >
                  <div v-if="item.ansType===3">
                    <a-form-model-item :prop="item.ans">
                      <div class="lable__title">
                        {{ item.qaTitle }}
                      </div>
                      <a-select
                        v-model="form[item.ans]"
                        placeholder="您剛才填寫分數超過0以上的不適部位"
                        class="select"
                      >
                        <a-select-option
                          v-for="(optionItem, idx) in pullOption"
                          :key="idx"
                          :value="optionItem.desc"
                        >
                          {{ optionItem.desc }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </div>
                  <div v-if="item.ansType===2">
                    <a-form-model-item :prop="item.ans">
                      <div class="lable__title">
                        {{ item.qaTitle }}
                      </div>
                      <a-radio-group
                        v-for="subitem in item.descOption"
                        :key="subitem.value"
                        v-model="form[item.ans]"
                        class="row radio__wrap"
                      >
                        <a-radio
                          :value="subitem.value"
                          class="query__wrap"
                        >
                          {{ subitem.desc }}
                        </a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                  </div>
                  <div v-if="item.ansType===4">
                    <a-form-model-item
                      :prop="item.ans"
                      class="mb-0"
                    >
                      <div class="lable__title">
                        {{ item.qaTitle }}
                      </div>
                      <a-textarea
                        v-model="form[item.ans]"
                        placeholder="請輸入症狀及病史說明，上限字數100字。"
                        :max-length="100"
                        :auto-size="{ minRows: 6 }"
                      />
                    </a-form-model-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-form-model>
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
              @click="handleSubmit"
            >
              送出
            </button>
          </div>
        </div>
      </div>
      <ReserveCheckModal
        :visible="modalVisible"
        @closeModal="closeModal"
        @modalSubmit="modalSubmit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { EmpErgonomicFormQueryDto, EmpSaveFormFillOutResultDto } from '@fubonlife/oss-api-axios-sdk';
import notification from '@/plugins/notification/infoNotification';
import ReserveCheckModal from '@/components/modal/ReserveCheckModal.vue';

@Component({ components: { ReserveCheckModal } })
export default class RelevantSurveyForm3 extends Vue {
  @Action('setLoading') setLoading;

  modalVisible = false;

  // 表單內容
  content = [];

  content2 = [];

  contentA = null;

  contentB = null;

  // 個案編號
  caseId = null;

  formTitle = '症狀及病史說明';

  // 紀錄編號
  recordId = null;

  recordIdA = null;

  recordIdB = null;

  pullOption = null;

  // 表單內容
  form = {};

  formA = null;

  formB = null;

  // 檢核規則
  formRules = {};

  result = null;

  errorMsg = null;

  // 上一步
  handleBack() {
  	this.$router.push({ name: 'RelevantSurveyForm2' });
  }

  // 送出
  handleSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			const formDataA: EmpSaveFormFillOutResultDto = {
  				formName: 'F0201',
  				recordId: this.recordIdA,
  				empFormDtoList: [],
  			};
  			this.contentA.forEach((item, index) => {
  				const block = {
  					topicType: item.blockTitle,
  					topicAndOptsDtoList: [],
  				};
  				item.qa.forEach((qaOption, idx) => {
  					const subBlock = {
  						ans: this.formA[qaOption.ans],
  						ansType: item.qaType,
  						topicId: qaOption.topicId,
  					};
  					block.topicAndOptsDtoList.push(subBlock);
  				});
  				formDataA.empFormDtoList.push(block);
  			});
  			// secondForm
  			const formDataB: EmpSaveFormFillOutResultDto = {
  				formName: 'F0202',
  				recordId: this.recordIdB,
  				empFormDtoList: [],
  			};
  			const firstIt = {
  				topicAndOptsDtoList: [],
  			};
  			this.contentB.forEach((item, index) => {
  				const blockB = {
  					ans: this.formB[item.ans],
  					ansType: 2,
  			    topicId: item.topicId,
  				};
  				firstIt.topicAndOptsDtoList.push(blockB);
  			});
  			formDataB.empFormDtoList.push(firstIt);
  			// thirdForm
  			const formDataC: EmpSaveFormFillOutResultDto = {
  				formName: 'F0203',
  				recordId: this.recordId,
  				empFormDtoList: [],
  			};
  			const secondIt = {
  				topicAndOptsDtoList: [],
  			};
  			this.content.forEach((item, index) => {
  				const blockC = {
  					ans: this.form[item.ans] !== undefined ? this.form[item.ans] : '',
  					ansType: item.ansType,
  			    topicId: item.topicId,
  				};
  				secondIt.topicAndOptsDtoList.push(blockC);
  			});
  			formDataC.empFormDtoList.push(secondIt);

  			const secondItB = {
  				topicAndOptsDtoList: [],
  			};
  			this.content2.forEach((item, index) => {
  				const blockC = {
  					ans: this.form[item.ans] !== undefined ? this.form[item.ans] : '',
  					ansType: item.ansType,
  			    topicId: item.topicId,
  				};
  				secondItB.topicAndOptsDtoList.push(blockC);
  			});
  			formDataC.empFormDtoList.push(secondItB);

  			// saveData
  			this.setLoading(true);
  			this.$EhEmpFormFillOutControllerApi.saveErgonomicFormUsingPOST(formDataA)
  				.then((resp) => {
  					const errorMsgA = resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join('');
  					if (errorMsgA === null) {
  						this.$EhEmpFormFillOutControllerApi.saveErgonomicFormUsingPOST(formDataB)
  							.then((resp) => {
  								const errorMsgB = resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join('');
  								if (errorMsgB === null) {
  									this.$EhEmpFormFillOutControllerApi.saveErgonomicFormUsingPOST(formDataC)
  										.then((resp) => {
  											const errorMsgC = resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join('');
  											if (errorMsgC === null) {
   												this.result = resp.data.status === 200 ? 'success' : 'fail';
  												this.errorMsg = resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join('');
  												this.openModal();
  											} else {
  												notification.error({ content: errorMsgC });
  											}
  										})
  										.catch((error) => {
  											console.log('error statusC = ', error);
  										});
  								} else {
  									notification.error({ content: errorMsgB });
  								}
  							})
  							.catch((error) => {
  								console.log('error statusB = ', error);
  							});
  					} else {
  						notification.error({ content: errorMsgA });
  					}
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

  openModal() {
  	this.modalVisible = true;
  }

  closeModal() {
  	this.modalVisible = false;
  }

  // API: 醫生諮詢需求詢問儲存
  modalSubmit(modalForm) {
  	this.setLoading(true);
  	this.$EhEmpFormFillOutControllerApi.savePhyConsultResultUsingPOST(modalForm)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (modalForm.isPhyConsult === 2) {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'RelevantSurveyResult',
  						query: {
  							result: this.result,
  							errorMsg: this.errorMsg,
  						},
  					});
  					sessionStorage.removeItem('form_step1');
  					sessionStorage.removeItem('form_step2');
  				} else if (modalForm.isPhyConsult === 1) {
  					sessionStorage.removeItem('form_step1');
  					sessionStorage.removeItem('form_step2');
  					sessionStorage.setItem('doceservation', 'RelevantSurveyIndex');
  					// this.$router.push({ name: 'RelevantSurveyReservation' });
  					// 導向醫師預約 傳入參數:個案維護ID、TYPE(D0104)
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'RelevantSurveyReservationStep1',
  						query: {
  							srcFrom: 'D0104',
  							caseId: this.caseId,
  						},
  					});
  				}
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
  	this.setLoading(true);
  	this.caseId = this.$global.getQuery().caseId;
  	this.pullOption = this.$global.getQuery().pullOption;
  	this.contentA = this.$global.getQuery().contentA;
  	this.contentB = this.$global.getQuery().contentB;
  	this.recordIdA = this.$global.getQuery().recordIdA;
  	this.recordIdB = this.$global.getQuery().recordIdB;
  	this.formA = this.$global.getQuery().formA;
  	this.formB = this.$global.getQuery().formB;
  	console.log(this.caseId);
  	const queryData: EmpErgonomicFormQueryDto = {
  		caseId: this.caseId,
  		formName: 'F0203',
  	};
  	this.$EhEmpFormFillOutControllerApi.queryErgonomicFormUsingPOST(queryData)
  		.then((resp) => {
  			this.formTitle = resp.data.data.formName;
  			this.recordId = resp.data.data.recordId;
  			console.log(resp.data.data);
  			resp.data.data.empFormDtoList.forEach((item, index) => {
  				const option = {
  					qa: [],
  				};
  				item.topicAndOptsDtoList.forEach((subItem, idx) => {
  					const subOption = {
  						qaTitle: subItem.topicDesc,
  						ans: `question${subItem.topicId}`,
  						descOption: [],
  						topicId: subItem.topicId,
  						ansType: subItem.ansType,
  					};
  					this.$set(this.form, `question${subItem.topicId}`, subItem.ans ? subItem.ans : '');
  					if (subItem.ansType === 3) {
  						if (this.form[`question${subItem.topicId}`] === '') {
  							this.form[`question${subItem.topicId}`] = undefined;
  						}
  					}
  					if (item.topicType === '1') {
  						if (subItem.ansType === 3) {
  							this.formRules[`question${subItem.topicId}`] = [{ required: true, message: '請選擇', trigger: 'change' }];
  						} else if (subItem.ansType === 2) {
  							this.formRules[`question${subItem.topicId}`] = [{ required: true, message: '請勾選', trigger: 'change' }];
  						} else if (subItem.ansType === 4) {
  							// this.$set(this.formRules, `question${subItem.topicId}`, [{ required: true, message: '請填入描述' }]);
  							this.formRules[`question${subItem.topicId}`] = [{ required: true, message: '請填入描述', trigger: 'change' }];
  						}
  					}
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
  			this.content2 = this.content[1].qa;
  			this.content.pop();
  			this.content = this.content[0].qa;
  			console.log('content', this.content);
  			console.log('this.formRules => ', this.formRules);
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
  .lable__title {
    font-weight: 600;
    margin-bottom: 10px;
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
    margin-bottom: 10px;
  }
  .page__tip {
    color: #24C7A7;
    margin-bottom: 20px;
  }
  .radio__wrap {
    margin-left: 0;
    margin-right: 0;
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
    color: #24C7A7;
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
</style>
