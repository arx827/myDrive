<template>
  <div class="container">
    <div class="page__title">
      填寫滿意度問卷
    </div>
    <div class="page__card page__card--shadow p-0">
      <div
        class="page__card__img__Title"
      >
        <img :src="questDescrip.edmBanner" alt="">
      </div>
      <div
        class="info__wrap"
      >
        <div class="first__part">
          <div v-html="questDescrip.personalInfoStatement" />
        </div>
        <a-divider />
        <div v-html="questDescrip.questDesc" />
      </div>
    </div>
    <br>

    <ul class="quest__list">
      <li
        v-for="(list, index) in questionnaire"
        :key="index"
        class="page__card form__card"
      >
        <span class="quest__form__title">
          {{ list.cateTitle }}
        </span>
        <a-form-model-item
          v-for="(item, idx) in list.quests"
          :key="idx"
          class="quest__form__subTitle"
          :label="item.type !== '7' ? item.title:''"
        >
          <a-input
            v-if="item.type === '1'"
            v-model="item.model"
            class="quest__form__item"
          />
          <a-textarea
            v-if="item.type === '2'"
            v-model="item.model"
            placeholder="簡述即可，字數上限250字。"
            :max-length="250"
            :auto-size="{ minRows: 6 }"
            class="addingWish__input__style"
          />
          <a-radio-group
            v-if="item.type === '3'"
            v-model="item.model"
            name="radioGroup"
            class="checkbox__group__whole"
          >
            <a-row
              type="flex"
              justify="space-between"
              :gutter="[16,8]"
            >
              <a-col
                v-for="(opt, optIdx) in item.optListDto"
                :key="optIdx"
                :class="item.size==='whole'? 'checkbox__group__whole':'checkbox__group__half'"
              >
                <a-row class="form__label__bg">
                  <a-radio
                    :value="opt.optId"
                  >
                    {{ opt.optDesc }}
                  </a-radio>
                </a-row>
              </a-col>
            </a-row>
          </a-radio-group>
          <a-checkbox-group
            v-if="item.type === '4'"
            v-model="item.model"
            class="checkbox__group__whole"
          >
            <a-row
              type="flex"
              justify="space-between"
              :gutter="[16,8]"
            >
              <a-col
                v-for="(opt, optIdx) in item.optListDto"
                :key="optIdx"
                class="checkbox__group__half"
              >
                <a-row class="form__label__bg">
                  <a-checkbox
                    class="checkbox__width"
                    :class="{'checkbox__width':item.showInput==='Y'}"
                    :value="opt.optId"
                  >
                    {{ opt.optDesc }}
                  </a-checkbox>
                  <!-- <a-input
                    v-if="item.showInput==='Y'"
                    :max-length="50"
                    class="input__style"
                    :placeholder="item.inputPlaceHolder"
                  /> -->
                </a-row>
              </a-col>
            </a-row>
          </a-checkbox-group>
          <a-input-number
            v-if="item.type === '5'"
            v-model="item.model"
          />
          <a-rate
            v-if="item.type === '6'"
            v-model="item.model"
          >
            <a-icon
              slot="character"
              type="star"
            />
          </a-rate>
          <div v-if="item.type === '7'">
            <!-- pc&ipad 滿意度選項名稱 -->
            <div class="d-none d-sm-block">
              <a-row
                v-if="idx === 0"
                class="satisfaction__title"
              >
                <a-col :span="9">
                  <a-row>
                    <a-col />
                  </a-row>
                </a-col>
                <a-col :span="15">
                  <a-row
                    type="flex"
                    justify="space-around"
                  >
                    <a-col
                      v-for="(opt, optIdx) in item.optListDto"
                      :key="optIdx"
                      :span="4"
                      class="option__title"
                    >
                      {{ opt.optDesc }}
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <!-- 滿意度題目&radio選項 -->
              <div>
                <a-row
                  type="flex"
                  justify="space-around"
                  class="satisfaction__item"
                  :class="{'with-white-bg': idx % 2 === 0}"
                >
                  <a-col :span="9">
                    {{ item.title }}
                  </a-col>
                  <a-col :span="15">
                    <a-radio-group
                      v-model="item.model"
                      name="radioGroup"
                      class="satisfaction__option"
                    >
                      <a-radio
                        v-for="(opt, optIdx) in item.optListDto"
                        :key="optIdx"
                        :value="opt.optId"
                        class="satisfaction__radio"
                      />
                    </a-radio-group>
                  </a-col>
                </a-row>
              </div>
            </div>
            <!-- Phone 滿意度選項名稱 -->
            <div class="d-block d-sm-none">
              <a-row>
                <a-col
                  :span="24"
                  class="satisfaction__title"
                >
                  {{ item.title }}
                </a-col>
                <a-radio-group
                  v-model="item.model"
                  name="radioGroup"
                  class="checkbox__group__whole"
                >
                  <a-row
                    type="flex"
                    justify="space-between"
                    :gutter="[16,8]"
                  >
                    <a-col
                      v-for="(opt, optIdx) in item.optListDto"
                      :key="optIdx"
                      class="checkbox__group__half"
                    >
                      <a-row class="form__label__bg">
                        <a-radio
                          :value="opt.optId"
                        >
                          {{ opt.optDesc }}
                        </a-radio>
                      </a-row>
                    </a-col>
                  </a-row>
                </a-radio-group>
              </a-row>
            </div>
          </div>
        </a-form-model-item>
      </li>
    </ul>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary--outline mx-2 mb-2"
        @click="cancelRegister()"
      >
        取消
      </button>
      <button
        class="btn__radius--primary mx-2 mb-2"
        @click="submitRegister()"
      >
        確認
      </button>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';
import { HealthActSatisfyQuestSaveDto, HealthActSatisfyAnswerSaveDto } from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({
	components: { FblDataGrid },
})
export default class MyRegistrationQuest extends Vue {
  @Action('setLoading') setLoading;
  /**
   * data
   */
  // 0:分類標題
  // 1:單行文字
  // 2:多行文字
  // 3:單選
  // 4:多選
  // 5:數字題
  // 6:星級評分
  // 7.矩陣題

  actID = null // 活動場次代碼

  satisfyQuestId = null; // 問券代碼

  questDescrip = {
  	edmBanner: null, // banner
  	personalInfoStatement: null, // 個資聲明文案
  	questDesc: null, // 問券說明
  };

  questionnaire = [
  	{
  		cateTitle: '',
  		quests: [],
  	},
  ]

  optionChecked = []

  /**
   * methods
   */

  // 填寫滿意度問卷，「取消」
  cancelRegister() {
  	// 回到我的報名頁面
  	this.$router.push({ name: 'MyRegistrationIndex' });
  }

  // 填寫滿意度問卷，『確認』
  submitRegister() {
  	// 單選、矩陣題(3、7)的直接存答案id(opt_id)
  	// 多選(4)的存逗號拼接的答案id(opt_id)
  	// 單行文字/多行文字/分數/星級(1、2、5、6)直接是內容
  	// 標題(0)不需要存answer
  	const data: HealthActSatisfyQuestSaveDto = {
  		actId: this.actID,
  		satisfyQuestId: this.satisfyQuestId,
  		answerDto: [],
  	};

  	let passValidate = true; // 檢核是否有未填

  	this.questionnaire.forEach((element) => {
  		element.quests.forEach((ele) => {
  			if (!ele.model) passValidate = false;
  			if (ele.type === '1' || ele.type === '2' || ele.type === '5' || ele.type === '6') {
  				data.answerDto.push({
  					answer: ele.model,
  					optId: null,
  					topicId: ele.topicId,
  					type: ele.type,
  				});
  			} else if (ele.type === '3' || ele.type === '4' || ele.type === '7') {
  				data.answerDto.push({
  					answer: null,
  					optId: typeof (ele.model) == 'string' ? [ele.model] : ele.model,
  					topicId: ele.topicId,
  					type: ele.type,
  				});
  			}
  		});
  	});
  	if (!passValidate) {
  		InfoModal.alertError({
  			content: '尚有欄位未填，請完整填寫',
  		});
  		return;
  	}
  	this.setLoading(true);
  	this.$PHPEmpHealthActApi.saveSatisfyQuestUsingPOST(data)
  		.then((resp) => {
  			console.log(resp);
  			// 前往報名結果頁面
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'MyRegistrationResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'error',
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
  }

  // 取得問券內容
  getQuest() {
  	this.setLoading(true);
  	this.$PHPEmpHealthActApi.querySatisfyQuestUsingPOST(this.actID)
  		.then((resp: any) => {
  			// console.log(resp);
  			this.sortQuset(resp.data.data.topicListDto);
  			this.questDescrip.edmBanner = resp.data.data.edmBanner;
  			this.questDescrip.personalInfoStatement = resp.data.data.personalInfoStatement;
  			this.questDescrip.questDesc = resp.data.data.questDesc;
  			this.satisfyQuestId = resp.data.data.satisfyQuestId;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 整理問券陣列
  sortQuset(array) {
  	const cateIdx = [];
  	const questionnaire = [];
  	const arrLength = array.length;

  	// 依 type=0 區分區塊陣列
  	for (let index = 0; index < array.length; index++) {
  		const element = array[index];
  		if (element.type === '0') {
  			cateIdx.push(index);
  			questionnaire.push({ cateTitle: element.title, quests: [] });
  		}
  	}

  	if (cateIdx[0] !== 0) {
  		cateIdx.unshift(0);
  		questionnaire.unshift({ cateTitle: '', quests: [] });
  	}

  	// 將剩餘題型依序給入quests陣列
  	for (let index = 0; index < cateIdx.length; index++) {
  		const element = questionnaire[index];
  		const nowCateIdx = cateIdx[index];
  		const nextCateIdx = cateIdx[index + 1] ? cateIdx[index + 1] : null;

  		if (questionnaire.length === 0) {
  			this.questionnaire = questionnaire;
  		} else if (questionnaire.length === 1) {
  			for (let idx = 0; idx < array.length; idx++) {
  				const ele = array[idx];
  				if (ele.type !== '0') {
  					ele.model = null;
  					element.quests.push(array[idx]);
  				}
  			}
  			this.questionnaire = questionnaire;
  		} else {
  			for (let idx = 0; idx < array.length; idx++) {
  				const ele = array[idx];
  				if (idx < nextCateIdx && idx >= nowCateIdx && ele.type !== '0') {
  					// console.log(nextCateIdx);
  					ele.model = null;
  					element.quests.push(array[idx]);
  				} else if (!nextCateIdx && idx > nowCateIdx) {
  					ele.model = null;
  					element.quests.push(array[idx]);
  				}
  			}
  			this.questionnaire = questionnaire;
  		}
  	}
  	console.log(this.questionnaire);
  }

  created() {
  	const query = this.$global.getQuery();
  	this.actID = query.actID;
  	// this.actID = 1; // 先寫死
  	this.getQuest();
  }
}
</script>

<style lang="scss" scoped>
  // .quest__list {
  //   list-style-type: trad-chinese-informal;
  //   list-style-position: inside;
  // }
  .page__card__img__Title {
    // height: 32px;
    text-align: center;
    background: $COLOR-MAIN1;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    > img {
      margin: auto;
    }
    // @include rwd-sm {
    //   height: 88px;
    // }
    // @include rwd-xl {
    //   height: 110px;
    // }
  }
  .form__card {
    background: $COLOR-MAIN10;
    padding: 20px 30px;
    @include rwd-sm {
      padding: 20px 74px;
    }
    @include rwd-xl {
      padding: 30px 92px;
    }
  }
  .quest__form__title {
    font-size: 18px;
    line-height: 25px;
    font-weight: 600;
    margin-bottom: 20px;
    @include rwd-sm {
      font-size: 18px;
      line-height: 25px;
    }
    @include rwd-xl {
      font-size: 20px;
      line-height: 30px;
    }
  }
  .quest__form__subTitle {
    font-size: 14px;
    font-weight: 600;
    padding: 0px;
    @include rwd-sm {
      font-size: 14px;
      line-height: 20px;
    }
    @include rwd-xl {
      font-size: 20px;
      line-height: 28px;
    }
  }
  .quest__form__item {
    height: 40px;
    font-size: 14px;
    line-height: 24px;
    @include rwd-sm {
      font-size: 14px;
      line-height: 24px;
    }
    @include rwd-xl {
      font-size: 16px;
      line-height: 24px;
    }
  }
  .info__wrap {
    padding: 30px 23px;
    @include rwd-sm {
      padding: 30px 74px;
    }
    @include rwd-xl {
      padding: 30px 92px;
    }
  }
  .first__part {
    font-weight: 600;
    font-size: 16px;
    @include rwd-sm {
      font-size: 20px;
      line-height: 30px;
    }
    @include rwd-xl {
      font-size: 20px;
      line-height: 30px;
    }
  }
  .first__sentence {
    margin-bottom: 15px;
    @include rwd-sm {
      margin-bottom: 30px;
    }
    @include rwd-xl {
      margin-bottom: 30px;
    }
  }
  .second__sentence {
    font-weight: 600;
  }
  .last__sentence {
    float: right;
    margin-top: 10px;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 30px;
    @include rwd-xl {
      font-size: 20px;
    }
  }
  .inform__str {
    font-size: 14px;
    line-height: 21px;
    @include rwd-xl {
      font-size: 16px;
      line-height: 29px;
    }
  }
  .form__label__bg {
    align-items: center;
    line-height: 40px;
    background: $COLOR-WHITE;
    padding-left: 15px;
    @include rwd-sm {
      display: flex;
      height: 40px;
    }
  }
  .checkbox__group__whole {
    width: 100%;
  }
  .checkbox__group__half {
    width: 100%;
     @include rwd-sm {
      width: 50%;
    }
  }
  .checkbox__width {
    flex: 1;
  }
  .input__block {
    background: $COLOR-WHITE;
    line-height: 40px;
  }
  .input__style {
    font-size: 10px;
    margin-left: 25px;
    padding: 4px 3px;
    width: -webkit-fill-available;
    @include rwd-sm {
      font-size: 14px;
      flex: 10;
      margin-left: 0px;
      border: none;
      background:
      linear-gradient($COLOR-GRAY10, $COLOR-GRAY10) center bottom 1px /calc(100% - 10px) 1px no-repeat;
    }
    @include rwd-xl {
      font-size: 16px;
    }
  }
  .addingWish__input__style {
    font-size: 10px;
    @include rwd-sm {
      font-size: 14px;
    }
    @include rwd-xl {
      font-size: 16px;
    }
  }
  .event__title {
    text-align: center;
    background: $COLOR-WHITE;
    font-size: 14px;
    line-height: 40px;
    font-weight: 600;
    color: $COLOR-MAIN12;
    @include rwd-xl {
      font-size: 20px;
      line-height: 60px;
    }
  }
  .satisfaction__title {
    display: none;
    padding-top: 20px;
    font-size: 14px;
    font-weight: 600;
    @include rwd-sm {
      padding-top: 0px;
      line-height: 40px;
      text-align: center;
    }
    @include rwd-xl {
      font-size: 16px;
      line-height: 60px;
    }
    &:first-child {
      display: flex;
    }
  }
  .option__title {
    font-weight: 600;
    font-size: 14px;
  }

  ::placeholder {
      color: $COLOR-GRAY10;
    }

  ::v-deep {
    .ant-form-item-label > label {
      font-size: 14px;
      @include rwd-xl {
        font-size: 16px;
      }
    }
    .ant-form-item-control{
      line-height: 0px;
    }
    .satisfaction__item {
      text-align: center;
      line-height: 40px;
      font-size: 14px;
        // &:nth-child(2n+1) {
        //     background: $COLOR-WHITE;
        // }
        &.with-white-bg {
          background: $COLOR-WHITE;
        }
      @include rwd-xl {
        font-size: 16px;
        line-height: 60px;
      }
    }
    .satisfaction__option {
      display: flex;
      line-height: 40px;
      font-size: 14px;
      text-align: center;
      @include rwd-xl {
        font-size: 16px;
        line-height: 60px;
      }
    }
    .satisfaction__radio {
      flex: 1;
      line-height: 40px;
      @include rwd-xl {
        line-height: 60px;
      }
    }
  }

</style>
