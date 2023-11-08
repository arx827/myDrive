<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between align-items-center block--padding">
        <div class="page__title">
          填寫量表
        </div>
        <template v-if="nowStep=='frisk'">
          <button
            class="btn__radius--primary--outline--small"
            data-bs-toggle="modal"
            data-bs-target="#relevantScaleModel"
          >
            疾病風險參考
          </button>
        </template>
      </div>
      <div class="page__card p-0 block--padding">
        <div class="page__card__headerTitle" />
        <div class="card__info">
          小提醒：有 {{ totalStep }}項表單{{ memo.join('、') }}需要填寫，請完成填表後送出，謝謝！
        </div>
      </div>
      <template v-if="totalStep">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="formRules"
          :layout="'vertical'"
          :hide-required-mark="true"
        >
          <template v-if="nowStep === 'overload'">
            <h1 class="table__tittle block--padding">
              職業壓力過負荷評估量表
            </h1>
            <div class="relevantScale__wrap bg__light block--sm">
              <div
                v-for="info in overLoadOptList"
                :key="info.titleId"
                class="relevantScale__block"
              >
                <div
                  v-if="info.title"
                  class="block__title"
                >
                  {{ info.title }}
                </div>
                <a-row
                  type="flex"
                  justify="start"
                  :gutter="[16, 16]"
                >
                  <!-- 單選題 -->
                  <a-col
                    v-if="info.topicList[0].type == 1"
                    :span="'24'"
                  >
                    <div class="notMobile">
                      <div class="lable__title row title__wrap justify-content-center">
                        <div class="col-5" />
                        <div
                          v-for="opt in info.optList"
                          :key="opt.ansNo"
                          class="col-1 radio__title"
                        >
                          {{ opt.ansSpec }}
                        </div>
                      </div>
                      <div
                        v-for="topic in info.topicList"
                        :key="topic.topicId"
                      >
                        <a-form-model-item
                          :prop="`topic${topic.topicId}`"
                          :rules="[{ required: true, trigger: 'change', message: '此題不能空白'}]"
                        >
                          <a-radio-group
                            v-model="form[`topic${topic.topicId}`]"
                            class="query__wrap row radio__wrap align-items-center justify-content-center"
                          >
                            <div class="col-5 d-flex align-items-center">
                              <div class="mark me-2">
                                ＊
                              </div>
                              {{ topic.desc }}
                            </div>
                            <a-radio
                              v-for="opt in info.optList"
                              :key="opt.ansNo"
                              :value="JSON.stringify(opt.ansNo)"
                              class="col-1 text-center"
                            />
                          </a-radio-group>
                        </a-form-model-item>
                      </div>
                    </div>
                    <div class="isMobile">
                      <div
                        v-for="topic in info.topicList"
                        :key="topic.topicId"
                      >
                        <a-form-model-item
                          :prop="`topic${topic.topicId}`"
                          :rules="[{ required: true, trigger: 'change', message: '此題不能空白'}]"
                        >
                          <span slot="label">
                            {{ topic.desc }}<span class="mark">＊</span>
                          </span>
                          <a-radio-group
                            v-model="form[`topic${topic.topicId}`]"
                            class="row radio2__wrap"
                          >
                            <a-radio
                              v-for="opt in info.optList"
                              :key="opt.ansNo"
                              :value="JSON.stringify(opt.ansNo)"
                              class="query__wrap"
                            >
                              {{ opt.ansSpec }}
                            </a-radio>
                          </a-radio-group>
                        </a-form-model-item>
                      </div>
                    </div>
                  </a-col>
                  <!-- 勾選題 -->
                  <a-col
                    v-if="info.topicList[0].type == 2"
                    :span="'24'"
                  >
                    <div class="lable__title">
                      請問您的工作狀態是否符合以下情形？ (可複選)
                      <span class="mark">＊</span>
                    </div>
                    <a-form-model-item
                      prop="checkedList"
                      :rules="[{ required: true, validator: checkCheckedList}]"
                    >
                      <a-checkbox-group
                        v-model="checkedList"
                      >
                        <a-checkbox
                          v-for="item in info.topicList"
                          :key="item.topicId.toString()"
                          :value="item.topicId.toString()"
                          class="query__wrap d-flex align-items-center"
                          :disabled="checkedList.indexOf(topicIdOfIsOnlycheck) >= 0 && item.topicId.toString() != topicIdOfIsOnlycheck"
                        >
                          {{ item.desc }}
                        </a-checkbox>
                      </a-checkbox-group>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <hr v-if="info.titleNo < overLoadOptList.length">
              </div>
            </div>
          </template>
          <template v-else>
            <h1 class="table__tittle block--padding">
              十年內心血管疾病發病風險評估量表 (Framingham Risk Score)
            </h1>
            <div class="relevantScale__wrap bg__light block--sm">
              <a-row
                type="flex"
                justify="start"
                :gutter="[16, 16]"
                class="relevantScale__block"
              >
                <template v-for="friskOpt in friskOptList">
                  <!-- 是非題 -->
                  <a-col
                    v-if="friskOpt.type == 3"
                    :key="friskOpt.topicId"
                    :span="'24'"
                  >
                    <div class="lable__title">
                      {{ friskOpt.desc }}<span class="mark">＊</span>
                    </div>
                    <a-form-model-item
                      :prop="`topic${friskOpt.topicId}`"
                      :rules="[{ required: true, trigger: 'change', message: '此題不能空白'}]"
                    >
                      <a-radio-group
                        v-model="form[`topic${friskOpt.topicId}`]"
                        class="row radio2__wrap"
                      >
                        <a-radio
                          value="N"
                          class="col-sm query__wrap"
                        >
                          沒有
                        </a-radio>
                        <a-radio
                          value="Y"
                          class="col-sm query__wrap"
                        >
                          有
                        </a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                  </a-col>
                  <!-- 說明題 -->
                  <a-col
                    v-if="friskOpt.type == 4"
                    :key="friskOpt.topicId"
                    :xs="24"
                    :md="12"
                  >
                    <div class="lable__title">
                      {{ friskOpt.desc }}
                      <span
                        v-if="friskOpt.isRequire==='Y'"
                        class="mark"
                      >＊</span>
                    </div>
                    <a-form-model-item
                      :prop="`topic${friskOpt.topicId}`"
                      :rules="(friskOpt.isRequire==='Y') ? [{ required: true, trigger: 'change', message: '此題不能空白'}] : null"
                    >
                      <!-- <a-input
                        v-model="form[`topic${friskOpt.topicId}`]"
                        allow-clear
                        :placeholder="`請輸入${friskOpt.desc}`"
                      /> -->

                      <input
                        v-model="form[`topic${friskOpt.topicId}`]"
                        v-mask="'###'"
                        class="ant-input"
                        :placeholder="`請輸入${friskOpt.desc}`"
                      >
                    </a-form-model-item>
                  </a-col>
                </template>
              </a-row>
              <!-- 二擇一 group -->
              <a-row
                v-for="(friskgroup, index) in friskGroupList"
                :key="index"
                type="flex"
                justify="start"
                :gutter="[16, 8]"
                class="relevantScale__block"
              >
                <a-col :span="'24'">
                  <div class="title--green">
                    下列項目二擇一必填
                    <span class="mark">＊</span>
                  </div>
                </a-col>
                <a-col
                  v-for="(item) in friskgroup"
                  :key="item.topicId"
                  :xs="24"
                  :md="12"
                >
                  <div class="lable__title">
                    {{ item.desc }}
                  </div>
                  <a-form-model-item
                    :prop="`topic${item.topicId}`"
                    :rules="formRules[item.group]"
                  >
                    <input
                      v-model="form[`topic${item.topicId}`]"
                      v-mask="'###'"
                      class="ant-input"
                      :placeholder="`請輸入${item.desc}`"
                    >
                    <!-- <a-input
                      v-model="form[`topic${item.topicId}`]"
                      allow-clear
                      :placeholder="`請輸入${item.desc}`"
                    /> -->
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </template>
        </a-form-model>
        <div class="block--padding my-4">
          <div class="relevantScale__block bg__light tip__text py-3 py-lg-4">
            請再次確認填答內容，是否符合您的實際情況
          </div>
        </div>
        <div class="relevantScale__block-statement">
          <div class="lable__title">
            個資聲明：蒐集、處理及利用個人資料告知事項
          </div>
          <div
            v-if="nowStep=== 'overload'"
            v-html="pageInfo.statementOverload"
          />
          <div
            v-else
            v-html="pageInfo.statementFRisk"
          />
        </div>
      </template>
      <div class="block--padding">
        <div class="btn__wrap text-center">
          <button
            v-if="!totalStep"
            class="btn__radius--primary--outline--small"
            @click="handleCancel"
          >
            返回
          </button>
          <button
            v-if="totalStep"
            class="btn__temp btn__radius--primary--outline--small float-start"
            @click="saveForm(0)"
          >
            暫存
          </button>
          <button
            v-if="(totalStep > 1 && nowStep === 'overload') || totalStep === 1"
            class="btn__radius--primary--outline--small"
            @click="handleCancel"
          >
            取消
          </button>
          <button
            v-if="totalStep > 1 && nowStep === 'overload'"
            class="btn__radius--primary--outline--small"
            @click="handleNext"
          >
            下一步
          </button>
          <button
            v-if="totalStep > 1 && nowStep ==='frisk'"
            class="btn__radius--primary--outline--small"
            @click="handleBack"
          >
            上一步
          </button>
          <button
            v-if="totalStep === 1 || nowStep ==='frisk'"
            class="btn__radius--primary--outline--small"
            @click="handleSubmit"
          >
            送出
          </button>
        </div>
      </div>
    </div>
    <RelevantScaleModel :img-data="pageInfo.picBase64Spec" />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import RelevantScaleModel from '@/pages/OccupationalSafety/StrangePrevent/RelevantScale/RelevantScaleModel.vue';
import {
	EmpHealthOverLoadConfigDto, EmpCiIdDto, EmpFillOutFormSaveResultsDto, EmpOptAnsDto,
} from '@fubonlife/oss-api-axios-sdk';

require('bootstrap/js/dist/modal');

@Component({ components: { RelevantScaleModel } })
export default class RelevantScaleForm extends Vue {
  @Action('setLoading') setLoading;

  checkedList = [];

  topicIdOfIsOnlycheck: string = null;

  form = {};

  formRules = {};

  friskOptList = [];

  friskGroupList = [];

  overLoadOptList = null;

  respData = null;

  pageInfo: EmpHealthOverLoadConfigDto = {};

  screenWidth = 0;

  totalStep = 0;

  memo = [];

  nowStep = '';

  // API: 問卷回答儲存/暫存
  saveForm(status: 0 | 1) {
  	const optAnsDtoList = [];
  	this.checkedList.length > 0 && this.checkedList.forEach((el) => {
  		optAnsDtoList.push({
  			topicId: JSON.parse(el.replace('topic', '')),
  			ans: 'Y',
  		});
  	});
  	for (const [key, value] of Object.entries(this.form)) {
  		if (value) {
  			optAnsDtoList.push({
  				topicId: JSON.parse(key.replace('topic', '')),
  				ans: (typeof (value) == 'boolean') ? 'Y' : value.toString(),
  			});
  		}
  	}
  	const form: EmpFillOutFormSaveResultsDto = {
  		optAnsDtoList,
  		recordId: this.respData[this.nowStep].recordId,
  		status,
  	};
  	// TEST:
  	// console.log(JSON.stringify(form));
  	this.setLoading(true);
  	this.$AlEmpAlCaseFillOutControllerApi.saveFormDataUsingPOST(form)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (status === 0) {
  					this.$infoNotification.success({
  						content: '已成功暫存',
  						duration: 3,
  					});
  				} else if (this.totalStep === 2 && this.nowStep === 'overload') {
  					this.nowStep = 'frisk';
  				} else {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'RelevantScaleResult',
  						query: { infoId: this.respData[this.nowStep].infoId },
  					});
  				}
  			} else {
  				this.$infoNotification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
   			//  TEST:
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  setResultParam() {
  	const $query = this.$global.getQuery();
  	const { pageInfo, respData } = $query;
  	this.pageInfo = pageInfo;
  	this.respData = respData;
  	for (const [key, value] of Object.entries(respData)) {
  		if (value) {
  			switch (key) {
  			case 'overload':
  				this.totalStep += 1;
  				this.memo.push('「職業壓力過負荷評估量表」');
  				this.nowStep = 'overload';
  				break;
  			case 'frisk':
  				this.totalStep += 1;
  				this.memo.push('「疾病風險評估量表」');
  				this.nowStep = 'frisk';
  				break;
  			default:
  				break;
  			}
  			this.nowStep = (this.totalStep > 1) ? 'overload' : this.nowStep;
  		}
  	}
  }

  getOverloadForm(data) {
  	if (data.overLoadOptDtoList) {
  		this.overLoadOptList = JSON.parse(JSON.stringify(data.overLoadOptDtoList));
  		data.overLoadOptDtoList.forEach((overLoadOpt) => {
  			if (overLoadOpt.titleId == 'E0501') {
  				this.topicIdOfIsOnlycheck =	overLoadOpt.topicList.find((i) => i.isOnlyCheck == 'Y') && overLoadOpt.topicList.find((i) => i.isOnlyCheck == 'Y').topicId.toString();
  			}

  			// 判斷 session 有沒有資料
  			if (sessionStorage.getItem('form_step1')) {
  				this.form = JSON.parse(sessionStorage.getItem('form_step1')).form;
  				this.checkedList = JSON.parse(sessionStorage.getItem('form_step1')).checkedList;
  			} else {
  				const optList = overLoadOpt.optList && overLoadOpt.optList.map((i) => JSON.stringify(i.ansNo));
  				overLoadOpt.topicList.forEach((el) => {
  					switch (el.type) {
  					case 1:
  						// 單選題
  						// 若獲取的答案不在選項中，給空值
  						(el.ans && optList.indexOf(el.ans) >= 0) && this.$set(this.form, `topic${el.topicId}`, el.ans);
  						break;
  					case 2:
  						// 勾選題
  						(el.ans === 'Y') && this.checkedList.push(JSON.stringify(el.topicId));
  						break;
  					default:
  						break;
  					}
  				});
  			}
  		});
  	}
  }

  getFriskForm(data) {
  	const sortData = data.friskOptDtoList.sort((a, b) => (a.topicNo - b.topicNo));
  	const optList = [];
  	const obj = sortData.reduce((prev, curr) => {
  		if (curr.group) {
  			return { ...prev, [curr.group]: [] };
  		}
  	}, {});
  	sortData.forEach((el) => {
  		if (el.group) {
  			// 處理二擇一必填題目檢核
  			this.$set(this.formRules, el.group, [{
  				required: true,
  				validator: (rule, value, callback) => {
  					if (!this.form[`topic${sortData.filter((c) => c.group === el.group)[0].topicId}`] && !this.form[`topic${sortData.filter((c) => c.group === el.group)[1].topicId}`]) {
  						callback('此題不能空白');
  					} else {
  						callback();
  					}
  				},
  			}]);
  			obj[el.group].push(el);
  		} else {
  			optList.push(el);
  		}
  	  // 處理 form
  		(el.ans) && this.$set(this.form, `topic${el.topicId}`, el.ans);
  	});
  	this.friskOptList = optList;
  	this.friskGroupList = Object.values(obj);
  }

  reset() {
  	this.form = {};
  	this.checkedList = [];
  }

  created() {
  	this.setResultParam();
  }

  mounted() {
  	this.screenWidth = window.innerWidth;
  	window.onresize = () => {
  		this.screenWidth = window.innerWidth;
  	};
  }

  checkCheckedList(rule, value, callback) {
  	if (this.checkedList.length == 0) {
  		callback('此題不能空白');
  	} else {
  		callback();
  		if (this.checkedList.indexOf(this.topicIdOfIsOnlycheck) >= 0) {
  			this.checkedList = [this.topicIdOfIsOnlycheck];
  		}
  	}
  }

  handleSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.saveForm(1);
  		} else {
  		  const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  			return false;
  		}
  	});
  }

  handleCancel() {
  	this.$router.push({ name: 'RelevantScaleIndex' });
  }

  handleNext() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			sessionStorage.setItem('form_step1', JSON.stringify({ form: this.form, checkedList: this.checkedList }));
  			this.saveForm(1);
  			this.reset();
  		} else {
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  			return false;
  		}
  	});
  }

  handleBack() {
  	window.scrollTo(0, 0);
  	this.nowStep = 'overload';
  }

  @Watch('nowStep')
  onNowStepChange(val) {
  	const uid = this.$user.getMe().userId;
  	switch (val) {
  	case 'overload':
  		this.fetchOverloadForm(uid);
  		break;
  	case 'frisk':
  		this.fetchFriskForm(uid);
  		break;
  	default:
  		break;
  	}
  }

  // API: 異常工作填寫問卷
  async fetchOverloadForm(uid) {
  	this.setLoading(true);
  	await this.$AlEmpAlCaseFillOutControllerApi.getOverLoadFormDataUsingPOST({ uid })
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.getOverloadForm(resp.data.data);
  			}
  		})
  		.catch((error) => {
  			//  TEST:
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: F表問題與選項
  async fetchFriskForm(uid) {
  	this.setLoading(true);
  	await this.$AlEmpAlCaseFillOutControllerApi.getFriskFormDataUsingPOST({ uid })
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.getFriskForm(resp.data.data);
  			}
  		})
  		.catch((error) => {
   			//  TEST:
  			console.log('error status = ', error);
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
  .radio2--margin {
    margin-left: 0;
    @include rwd-sm {
      margin-left: 8px;
    }
  }
  .page__card {
    border: 0.5px solid #CED4D9;
    margin-bottom: 10px;
    margin-top: 0;
    width: auto;
    @include rwd-lg {
      margin-bottom: 20px;
    }
  }
  .page__card__headerTitle {
    height: 20px;
  }
  .card__info {
    color: #363636;
    font-weight: 600;
    text-align: center;
    padding: 20px 30px;
    font-size: 14px;
    @include rwd-lg {
      font-size: 20px;
    }
  }
  .table__tittle {
    color: #24C7A7;
    margin-bottom: 10px;
    font-size: 18px;
    @include rwd-lg {
      font-size: 24px;
    }
  }
  .lable__title {
    color: #000000;
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
  .notMobile {
    display: none;
    @include rwd-sm {
      display: block;
    }
  }
  .isMobile {
    @include rwd-sm {
      display: none;
    }
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
    color: #24C7A7;
    margin-top: 10px;
    font-weight: 600;
  }
  .tip__text {
    color: #59CBD0;
    text-align: center;
    font-size: 16px;
    @include rwd-sm {
      font-size: 14px;
    }
    @include rwd-lg {
      font-size: 20px;
    }
  }
  .radio__wrap {
    margin-right: 0;
    margin-left: 0;
  }
  .radio2__wrap {
    margin-left: 0;
  }
  .title__wrap {
    padding: 0 10px;
    margin-right: 0;
    margin-left: 0;
  }
  .relevantScale__wrap {
    counter-reset: No;
    margin: 10px 0;
    padding: 30px 10%;
    @include rwd-lg {
      margin: 20px 0;
    }
    .radio__title {
      margin-right: 8px;
      padding-left: 10px;
      text-align: center;
    }
    ::v-deep {
      .ant-checkbox {
        vertical-align: middle;
      }
      .ant-form-vertical .ant-form-item {
        padding: 0;
        margin: 0;
      }
      .ant-input {
        height: 40px;
      }
    }
  }
  .relevantScale__block {
    line-height: 28px;
    border-radius: 10px;
    .block__title {
      color: #000000;
      font-weight: 600;
      font-size: 18px;
      &::before {
        content: counter(No, simp-chinese-informal) '、';
        counter-increment: No;
      }
      @include rwd-lg {
        font-size: 20px;
      }
    }
    hr {
      border: 0;
      border-bottom: 1px solid #D1D1D1;
      margin: 20px 0;
      @include rwd-sm {
        margin: 30px 0;
      }
    }
  }
  .relevantScale__block-statement {
    margin: 0 30px;
    @include rwd-md {
      margin: 0;
    }
  }
  .btn__radius--primary--outline--small {
    padding: 7px 20px;
  }

  .block--sm {
    border-radius: 0px;
    @include rwd-sm {
      border-radius: 10px;
    }
  }

  .btn__wrap {
    margin: 50px 100px 50px 0;
    width: 100%;
    padding: 0;
    // @include rwd-md {
    //   padding-right: 108px;
    // }
    button {
      width: 98px;
      @include rwd-md {
        width: 200px;
        margin-right: 10px;
      }
      max-width: 100%;
      margin-right: 5px;
    }
    .btn__temp {
      width: 98px;
    }
  }
  .text-wrapper {
    white-space: pre-wrap;
  }
  ::v-deep {
    .ant-form-item {
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .ant-checkbox-group {
      width: 100%;
    }
    .ant-checkbox-wrapper {
      margin-left: 0;
    }
  }
</style>
