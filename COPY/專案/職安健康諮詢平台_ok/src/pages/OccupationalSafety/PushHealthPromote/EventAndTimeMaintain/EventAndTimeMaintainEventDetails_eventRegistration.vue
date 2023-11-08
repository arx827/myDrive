<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        活動與場次維護：報名表
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline--small"
          :disabled="actStatus == '進行中' || actStatus == '已結束'"
          @click="goEdit"
        >
          編輯
        </button>
      </div>
    </div>
    <div class="page__card form__card">
      <div class="previewModal__wrap">
        <div
          v-for="(item, infoIndex) in dataGroup"
          :key="infoIndex"
          class="quest__item"
        >
          <template v-if="item.enabled=='Y'">
            <div
              v-if="item.type!=0"
              class="previewForm__label"
            >
              <label>{{ item.title }}</label>
              <span
                v-if="item.isAnswer=='Y'"
                class="mark-required"
              >*</span>
            </div>
            <div class="previewForm__desc">
              <template v-if="item.type == 0">
                <h2 class="classification__label">
                  {{ item.title }}
                </h2>
              </template>
              <template v-if="item.type == 1">
                <a-input
                  allow-clear
                  :placeholder="item.optDescList && item.optDescList.length > 0 ? item.optDescList && item.optDescList[0].optionContent : '請填入文字'"
                />
              </template>
              <template v-if="item.type == 2">
                <a-textarea placeholder="請填入文字" />
              </template>
              <template v-if="item.type == 3">
                <a-row :gutter="[16,8]">
                  <a-radio-group class="w-100">
                    <template v-for="(mcOpt, mcIndex) in item.optDescList">
                      <a-col
                        v-if="mcOpt.isDesc=='Y'"
                        :key="mcIndex"
                        :span="24"
                      >
                        <a-radio class="radioFormItem__default formItem__hasDesc">
                          {{ mcOpt.optionContent }}
                          <a-input
                            class="input_desc"
                            allow-clear
                            placeholder="請簡述原因，文字上限50字。"
                          />
                        </a-radio>
                      </a-col>
                      <a-col
                        v-else
                        :key="mcIndex"
                        :span="(item.title=='欲報名場次') ? 24 : 12"
                      >
                        <a-radio
                          class="radioFormItem__default"
                          :class="{'radioFormItem__session':item.title=='欲報名場次'}"
                          :value="mcOpt.sort"
                        >
                          {{ mcOpt.optionContent }}
                        </a-radio>
                      </a-col>
                    </template>
                  </a-radio-group>
                </a-row>
              </template>
              <template v-if="item.type == 4">
                <div
                  v-for="(mcqOpt, mcqIndex) in item.optDescList"
                  :key="mcqIndex"
                >
                  <a-checkbox :value="mcqOpt.value">
                    {{ mcqOpt.optionContent }}
                  </a-checkbox>
                </div>
              </template>
              <template v-if="item.type == 5">
                <a-input
                  allow-clear
                  placeholder="請填入數字"
                />
              </template>
              <template v-if="item.type == 6">
                <a-rate
                  allow-half
                />
              </template>
              <template v-if="item.type == 7">
                <div class="row justify-content-center">
                  <div class="col-5" />
                  <div
                    v-for="(weightItem, weightItemIndex) in item.weightingList"
                    :key="weightItemIndex"
                    class="col matrix__label matrix__label--top"
                  >
                    {{ weightItem }}
                  </div>
                </div>
                <div
                  v-for="(radioItem, radioIndex) in item.optDescList"
                  :key="radioIndex"
                  class="matrix matrix__item"
                >
                  <a-radio-group
                    class="query__wrap row radio__wrap align-items-center justify-content-center"
                  >
                    <div class="col-5 d-flex align-items-center">
                      <div class="mark-required">
                        ＊
                      </div>
                      {{ radioItem.optionContent }}
                    </div>
                    <div
                      v-for="(weight, weightIndex) in item.weightingList"
                      :key="weightIndex"
                      class="col"
                    >
                      <a-radio
                        class="col"
                        :value="weight"
                      />
                    </div>
                  </a-radio-group>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="handlePrevStep()"
      >
        返回
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { Action } from 'vuex-class';

@Component({})
export default class EventAndTimeMaintainEventDetails_eventRegistration extends Vue {
  @Action('setLoading') setLoading;

  /**
   * data
   */
  actId = null;

  actStatus = '';

  form = {
  	session: 'session1', // 報名場次
  	name: '許亮亮 (自動帶入)', // 報名人姓名
  	department: 'dep1', // 部門
  	unit: 'unit1', // 單位
  	telNo: '', // 連絡電話
  	email: '', // 聯絡信箱
  }

  // 預設的前五項
  dataGroup = [
  	{
  		title: '欲報名場次',
  		sort: 1,
  		type: 3,
  		optDescList: [],
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  	{
  		title: '報名人姓名',
  		sort: 2,
  		type: 1,
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  	{
  		title: '部門/單位',
  		sort: 3,
  		type: 1,
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  	{
  		title: '聯絡電話',
  		sort: 4,
  		type: 1,
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  	{
  		title: '聯絡信箱',
  		sort: 5,
  		type: 1,
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  ]

  rateCount: number = 5;

  /**
   * func
   */
  setResultParam() {
  	const query = this.$global.getQuery();
  	this.actId = query?.actId;
  	this.actStatus = query?.actStatus;
  }

  // API: 查詢健康促進活動問卷-編輯活動場次使用
  getQuesInfo() {
  	this.setLoading(true);
  	this.$PHPRpnEventSessionMaintainApi.getHealthActQuestForModifyUsingPOST(this.actId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const getData = JSON.parse(JSON.stringify(resp.data.data));
  				if (getData && getData.length > 0) {
  					this.dataGroup = getData;
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢場次資訊API
  getSessionInfo() {
  	this.setLoading(true);
  	this.$PHPRpnEventSessionMaintainApi.getHealthActSessionDetailUsingPOST(this.actId)
  	.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				// TEST:
  				// console.log(getData);
  				if (getData.length > 0) {
  					this.dataGroup[0].optDescList = getData.map((i) => {
  						const { sessionName, location, sessionType } = i;
  						const type = sessionType == 1 ? '實體場' : '線上場';
  						return {
  							isDesc: null,
  							optionContent: sessionName ? `【${sessionName}_${type}】${location}` : location,
  						};
  					});
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
   * Event
   */
  goEdit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventAddAndEditStep3',
  		params: {
  			type: 'edit',
  		},
  		query: { actId: this.actId },
  	});
  }

  // 點擊按鈕，『反回』
  handlePrevStep() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventDetails_eventTime',
  		query: { actId: this.actId, actStatus: this.actStatus },
  	});
  }

  /**
   * Hook
   */
  created() {
  	this.setResultParam();
  	this.getQuesInfo();
  	this.getSessionInfo();
  }

  updated() {
  	window.parseWord();
  }
}
</script>
<style lang="scss" scoped>
.btn__wrap {
  margin: 50px 0;
  button {
    width: 200px;
    max-width: 100%;
    margin: 0 5px;
  }
  .btn__view {
    width: 100px;
    margin: 0;
  }
}
.form__card {
  background: $COLOR-MAIN10;
  padding: 30px 92px;
}
.radioFormItem__default {
  width: 50%;
  font-weight: 400;
  &.radioFormItem__session {
    width: 100%;
    display: flex;
    align-items: center;
    background: $COLOR-WHITE;
    margin-bottom: 10px;
    padding: 15px;
    white-space: initial;
  }
}
.quest__item {
  margin: 20px 0;
  font-weight: $TEXT-BOLD;
  color: $COLOR-BLACK;
}
.classification__label {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
  margin: 15px 0;
  color: $COLOR-BLACK;
}
::v-deep {
  input.ant-input{
    height: 40px;
  }
  .ant-rate{
    svg{
      font-size: 31px !important;
    }
  }
  .matrix__item {
    padding: 10px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-child(2n) {
      background-color: $COLOR-WHITE;
    }
    .ant-radio-wrapper {
      text-align: center;
    }
  }
  .matrix__block {
    flex: 1;
  }
  .matrix__label {
    white-space: initial;
    line-height: 2;
  }
  .matrix__label--left {
    text-align: left;
    padding-left: 10px;
  }
  .ant-radio-group {
    width: 100%;
  }
  .ant-radio-wrapper {
    margin-right: 0px !important;
  }
}
</style>
