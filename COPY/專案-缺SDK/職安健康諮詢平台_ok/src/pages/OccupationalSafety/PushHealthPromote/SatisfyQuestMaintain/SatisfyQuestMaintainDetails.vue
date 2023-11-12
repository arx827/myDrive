<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        {{ name }}:版號{{ version }}
      </div>
      <div class="serviceTime__btnGroup pt-4">
        <button
          class="btn__radius--primary--outline--small"
          @click="handleEdit"
        >
          編輯
        </button>
      </div>
    </div>
    <div class="page__card page__card--shadow p-0">
      <div
        class="page__card__img__Title"
      >
        <img :src="bannerBase64" alt="">
      </div>
      <div
        class="info__wrap"
      >
        <div v-html="questDesc" />
        <a-divider />
        <div v-html="personalInfoStatement" />
      </div>
    </div>
    <br>
    <template
      v-for="(item,index) in itemList"
    >
      <div
        v-if="item.type === 0"
        :key="index"
        :class="itemList[index+1].type === 7?'matrix':''"
        class="form__card quest__form__title form__card--top"
      >
        {{ item.title }}
      </div>
      <div
        v-if="item.type === 1"
        :key="index"
        :class="!itemList[index+1]||(itemList[index+1].type === 0)?'form__card--bottom':''"
        class="form__card"
      >
        <p
          class="quest__form__subTitle"
          :class="item.isAnswer==='Y'?'answer__required':''"
        >
          {{ item.title }}
        </p>
        <a-input
          :placeholder="'請輸入'+item.title"
          class="quest__form__item"
        />
      </div>
      <div
        v-if="item.type === 2"
        :key="index"
        :class="!itemList[index+1]||(itemList[index+1].type === 0)?'form__card--bottom':''"
        class="form__card"
      >
        <p
          class="quest__form__subTitle"
          :class="item.isAnswer==='Y'?'answer__required':''"
        >
          {{ item.title }}
        </p>
        <a-textarea
          placeholder="簡述即可，字數上限250字。"
          :max-length="250"
          :auto-size="{ minRows: 6 }"
          class="addingWish__input__style"
        />
      </div>
      <div
        v-if="item.type === 3"
        :key="index"
        :class="!itemList[index+1]||(itemList[index+1].type === 0)?'form__card--bottom':''"
        class="form__card"
      >
        <p
          class="quest__form__subTitle"
          :class="item.isAnswer==='Y'?'answer__required':''"
        >
          {{ item.title }}
        </p>
        <a-radio-group
          class="radio__group row col-12 gx-3 gy-3"
        >
          <div
            v-for="(radioOption,radioIndex) in item.healthActSatisfyQuestOptSingleDtoList"
            :key="radioIndex"
            :class="optionClass(radioIndex,item)"
            class="col-12"
          >
            <a-radio
              class="col-12"
              :value="radioOption.optId"
            >
              {{ radioOption.optDesc }}
              <a-input
                v-if="radioOption.isDesc=='Y'"
                class="option__input"
                style="width:90%"
                :max-length="50"
              />
            </a-radio>
          </div>
        </a-radio-group>
      </div>
      <div
        v-if="item.type === 4"
        :key="index"
        :class="!itemList[index+1]||(itemList[index+1].type === 0)?'form__card--bottom':''"
        class="form__card"
      >
        <p
          class="quest__form__subTitle"
          :class="item.isAnswer==='Y'?'answer__required':''"
        >
          {{ item.title }}
        </p>
        <a-checkbox-group class="col-12">
          <div class="row gy-3 gx-3">
            <div
              v-for="(checkOpt,checkIndex) in item.healthActSatisfyQuestOptSingleDtoList"
              :key="checkOpt.optId"
              :class="optionClass(checkIndex,item)"
              class="col-12"
            >
              <div class="d-flex col-12 checkbox__item">
                <a-checkbox
                  :value="checkOpt.optId"
                >
                  {{ checkOpt.optDesc }}
                  <a-input
                    v-if="checkOpt.isDesc=='Y'"
                    class="option__input"
                    style="width:90%"
                    :max-length="50"
                  />
                </a-checkbox>
              </div>
            </div>
          </div>
        </a-checkbox-group>
      </div>
      <div
        v-if="item.type === 5"
        :key="index"
        :class="!itemList[index+1]||(itemList[index+1].type === 0)?'form__card--bottom':''"
        class="form__card"
      >
        <p
          class="quest__form__subTitle"
          :class="item.isAnswer==='Y'?'answer__required':''"
        >
          {{ item.title }}
        </p>
        <a-input-number :placeholder="'請輸入'+item.title" />
      </div>
      <div
        v-if="item.type === 6"
        :key="index"
        :class="!itemList[index+1]||(itemList[index+1].type === 0)?'form__card--bottom':''"
        class="form__card"
      >
        <p
          class="quest__form__subTitle"
          :class="item.isAnswer==='Y'?'answer__required':''"
        >
          {{ item.title }}
        </p>
        <a-rate :count="5">
          <a-icon
            slot="character"
            type="star"
          />
        </a-rate>
      </div>
      <div
        v-if="item.type === 7"
        :key="index"
        :class="!itemList[index+1]||(itemList[index+1].type === 0)?'form__card--bottom':''"
        class="form__card"
      >
        <!-- 第一個matrix題前要加權重標題 -->
        <div
          v-if="itemList[index-1].type===0"
          class="matrix__header d-none d-md-flex row"
        >
          <div class="col-md-5" />
          <div
            class="d-flex align-items-lg-center col-7"
          >
            <label
              v-for="(opt,optIndex) in item.healthActSatisfyQuestOptSingleDtoList"
              :key="optIndex"
              class="col matrix__header__title"
            >
              {{ opt.optDesc }}
            </label>
          </div>
        </div>
        <div
          class="row matrix__item"
        >
          <div
            :class="item.isAnswer==='Y'?'answer__required':''"
            class="col-12 col-md-5 matrix__item__subtitle"
          >
            {{ item.title }}
          </div>
          <a-radio-group
            class="col-12 col-md-7 matrix__group"
          >
            <a-radio
              v-for="(option, key) in item.healthActSatisfyQuestOptSingleDtoList"
              :key="key"
              :value="key"
              class="col-12 col-md matrix__group__radio"
            >
              <div class="d-inline d-md-none">
                {{ option.optDesc }}
              </div>
            </a-radio>
          </a-radio-group>
        </div>
      </div>
    </template>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="handleReturn"
      >
        返回
      </button>
    </div>
    <!-- <TodoButton /> -->
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';
import TodoButton from '@compononts/to-do/TodoButton.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { HealthActSatisfyQuestTopicSingleDto,	HealthQuerySatisfyQuestSingleDto } from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';
import { notification } from 'ant-design-vue';
import infoNotification from '@/plugins/notification/infoNotification';

@Component({
	components: { FblDataGrid, TodoButton },
})
export default class SatisfyQuestMaintainDetails extends Vue {
	@Action('setLoading') setLoading;

	/**
   * data
   */
  name: string = ''

  version: number = 0

  satisfyQuestId: number=0

  questDesc: string=''

  personalInfoStatement: string=''

  bannerBase64: string ='~@images/image_smallBanner.svg'

  // 原始資料
	questData: HealthQuerySatisfyQuestSingleDto = {
		healthActSatisfyQuestTopicSingleDtoList: [],
	}

  // 顯示的資料
  itemList: HealthActSatisfyQuestTopicSingleDto[] = []

  fakeSatisfyQuestData: HealthActSatisfyQuestTopicSingleDto[]=[
  	{
  		title: '一、基本資料填寫',
  		topicId: 1,
  		type: 0,
  		enable: 'Y',
  	},
  	{
  		title: '姓名',
  		topicId: 2,
  		type: 1,
  		isAnswer: 'Y',
  		enable: 'Y',
  	},
  	{
  		title: '性別',
  		topicId: 3,
  		type: 3,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '男性',
  				optId: 1,
  			},
  			{
  				optDesc: '女性',
  				optId: 2,
  			},
  		],
  	},
  	{
  		title: '您的年齡',
  		topicId: 4,
  		type: 3,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '21-25歲',
  				optId: 1,
  			},
  			{
  				optDesc: '26-30歲',
  				optId: 2,
  			},
  			{
  				optDesc: '31-35歲',
  				optId: 3,
  			},
  			{
  				optDesc: '36-40歲',
  				optId: 4,
  			},
  			{
  				optDesc: '41-45歲',
  				optId: 5,
  			},
  			{
  				optDesc: '46-40歲',
  				optId: 6,
  			},
  		],
  	},
  	{
  		title: '身分屬性',
  		topicId: 5,
  		type: 3,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '富邦人壽內勤同仁',
  				optId: 1,
  			},
  			{
  				optDesc: '富邦人壽外勤同仁',
  				optId: 2,
  			},
  		],
  	},
  	{
  		title: '二、資訊來源',
  		type: 0,
  		topicId: 6,
  		enable: 'Y',
  	},
  	{
  		title: '得知講座的管道(可複選)',
  		topicId: 7,
  		type: 4,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '富邦人壽同仁',
  				optId: 1,
  			},
  			{
  				optDesc: 'EDM線上行銷廣告',
  				optId: 2,
  			},
  			{
  				optDesc: '公告',
  				optId: 3,
  			},
  		],
  	},
  	{
  		title: '三、報名原因',
  		type: 0,
  		topicId: 8,
  		enable: 'Y',
  	},
  	{
  		title: '報名講座原因(可複選)',
  		topicId: 9,
  		type: 4,
  		isAnswer: 'N',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '講座題目吸引人',
  				optId: 1,
  			},
  			{
  				optDesc: '對講座內容有需求',
  				optId: 2,
  			},
  			{
  				optDesc: '主講者的專業',
  				optId: 3,
  			},
  			{
  				optDesc: '主講者的知名度',
  				optId: 4,
  			},
  			{
  				optDesc: '講座完全免費',
  				optId: 5,
  			},
  		],
  	},
  	{
  		title: '四、您對今日講座的滿意度',
  		topicId: 10,
  		type: 0,
  		enable: 'Y',
  	},
  	{
  		title: '對於主講者整體表現的滿意程度，您覺得',
  		topicId: 11,
  		type: 7,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '非常不滿意',
  				optId: 1,
  			},
  			{
  				optDesc: '不滿意',
  				optId: 2,
  			},
  			{
  				optDesc: '普通',
  				optId: 3,
  			},
  			{
  				optDesc: '滿意',
  				optId: 4,
  			},
  			{
  				optDesc: '非常滿意',
  				optId: 5,
  			},
  		],
  	},
  	{
  		title: '對於議題內容深淺程度及適用性，您覺得',
  		topicId: 11,
  		type: 7,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '非常不滿意',
  				optId: 1,
  			},
  			{
  				optDesc: '不滿意',
  				optId: 2,
  			},
  			{
  				optDesc: '普通',
  				optId: 3,
  			},
  			{
  				optDesc: '滿意',
  				optId: 4,
  			},
  			{
  				optDesc: '非常滿意',
  				optId: 5,
  			},
  		],
  	},
  	{
  		title: '整體而言，對此議題的滿意程度，您覺得',
  		topicId: 11,
  		type: 7,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '非常不滿意',
  				optId: 1,
  			},
  			{
  				optDesc: '不滿意',
  				optId: 2,
  			},
  			{
  				optDesc: '普通',
  				optId: 3,
  			},
  			{
  				optDesc: '滿意',
  				optId: 4,
  			},
  			{
  				optDesc: '非常滿意',
  				optId: 5,
  			},
  		],
  	},
  	{
  		title: '對於整體健康講座活動的滿意度，您覺得',
  		topicId: 11,
  		type: 7,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '非常不滿意',
  				optId: 1,
  			},
  			{
  				optDesc: '不滿意',
  				optId: 2,
  			},
  			{
  				optDesc: '普通',
  				optId: 3,
  			},
  			{
  				optDesc: '滿意',
  				optId: 4,
  			},
  			{
  				optDesc: '非常滿意',
  				optId: 5,
  			},
  		],
  	},
  	{
  		title: '五、未來活動的參與',
  		type: 0,
  		topicId: 12,
  		isAnswer: 'Y',
  		enable: 'Y',
  	},
  	{
  		title: '未來如有類似活動是否仍會參與活動',
  		topicId: 13,
  		type: 3,
  		isAnswer: 'Y',
  		enable: 'Y',
  		healthActSatisfyQuestOptSingleDtoList: [
  			{
  				optDesc: '依議題',
  				optId: 1,
  			},
  			{
  				optDesc: '願意',
  				optId: 2,
  			},
  			{
  				optDesc: '不願意',
  				optId: 3,
  			},
  		],
  	},
  	{
  		title: '六、其他建議',
  		type: 0,
  		topicId: 14,
  		isAnswer: 'Y',
  		enable: 'Y',
  	},
  	{
  		title: '希望增加的講課程',
  		topicId: 15,
  		type: 6,
  		isAnswer: 'Y',
  		enable: 'N',
  	},
  	{
  		title: '其他意見與建議(可填寫多項)',
  		topicId: 16,
  		type: 2,
  		isAnswer: 'Y',
  		enable: 'Y',
  	},
  ]

  optionClass(index, item) {
  	// 含簡述
  	if (item.healthActSatisfyQuestOptSingleDtoList[index].isDesc == 'Y') return 'col-md-12';
  	// 非最後選項，最後一個選項含簡述，總選項偶數倒數第二選項12欄
  	if ((index !== item.healthActSatisfyQuestOptSingleDtoList.length - 1) && (item.healthActSatisfyQuestOptSingleDtoList[item.healthActSatisfyQuestOptSingleDtoList.length - 1].isDesc == 'Y')) {
  		if ((index === item.healthActSatisfyQuestOptSingleDtoList.length - 2) && (item.healthActSatisfyQuestOptSingleDtoList.length % 2 === 0)) return 'col-md-12';
  	}
  	// 最後選項不含簡述，總數奇數選項12欄
  	if ((index === item.healthActSatisfyQuestOptSingleDtoList.length - 1) && (item.healthActSatisfyQuestOptSingleDtoList.length % 2 == 1)) {
  		return 'col-md-12';
  	}
  	return 'col-md-6';
  }

  created() {
  	if (this.$global.getQuery()) {
  		const query = this.$global.getQuery();
  	  this.name = query.name;
  	  this.version = query.version;
  		this.satisfyQuestId = query.satisfyQuestId;
  		// TEST:
  	  // this.satisfyQuestId = 53;
  	}
  	// 查詢單一滿意度問卷
  	this.setLoading(true);
  	this.$PHPRpnQuerySatisfyQuestApi.queryOneSatisfyQuestUsingPOST(this.satisfyQuestId).then((resp) => {
  		if (resp.data.status === 200) {
  			this.questDesc = resp.data.data.questDesc;
  			this.personalInfoStatement = resp.data.data.personalInfoStatement;
  			this.bannerBase64 = resp.data.data.bannerBase64;
  			this.questData = resp.data.data;
  			this.itemList = this.questData.healthActSatisfyQuestTopicSingleDtoList.filter((item) => item.enable == 'Y');
  		} else {
  			infoNotification.error({
  				content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  			});
  		}
  	}).catch((err) => {
  		console.log(err);
  	}).finally(() => {
  		this.setLoading(false);
  	});
  }

  handleEdit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'SatisfyQuestMaintainAddAndEdit',
  		query: {
  			satisfyQuestId: this.satisfyQuestId,
  			version: this.version,
  		},
  		params: {
  			type: 'edit',
  		},
  	});
  }

  handleReturn() {
  	this.$router.push({ name: 'SatisfyQuestMaintainIndex' });
  }

  updated() {
  	window.parseWord();
  }
}

</script>

<style lang="scss" scoped>
  .page__card__img__Title {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    // height: 32px;
    text-align: center;
    background: $COLOR-MAIN1;
    // @include rwd-sm {
    //   height: 88px;
    // }
    // @include rwd-xl {
    //   height: 110px;
    // }
    > img {
      margin: auto;
    }
  }
  .form__card {
    background: $COLOR-MAIN10;
    padding: 10px 30px;
    @include rwd-sm {
      padding: 10px 74px;
    }
    @include rwd-xl {
      padding: 15px 92px;
    }
  }
  .form__card--top{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding-top: 20px;
  }
  .form__card--bottom{
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding-bottom: 30px;
		margin-bottom: 20px;
  }
  .quest__form__title {
    font-size: 18px;
    line-height: 25px;
    font-weight: 600;
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
    font-weight: 600;
    padding: 0px;
    @include rwd-sm {
      line-height: 20px;
    }
  }
  .answer__required{
    &::after{
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 16px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: "*";
    }
  }

  .quest__form__item {
    height: 40px;
    line-height: 24px;
    @include rwd-sm {
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
  ::placeholder {
      color: $COLOR-GRAY10;
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
  // checkbox
	.checkbox__item {
    align-items: center;
    line-height: 40px;
    background: $COLOR-WHITE;
    padding-left: 15px;
    @include rwd-sm {
      display: flex;
      height: 40px;
    }
  }

  //radio
	::v-deep{
		.ant-radio-wrapper{
      @include rwd-md {
				text-align: center;
				min-height: 0px;
				background-color: rgba($color: #000000, $alpha: 0);
			}
		}
    .ant-checkbox-wrapper{
      width: 100%;
      display: flex;
      align-items: center;
      span:nth-child(2){
        display: flex;
        align-items: center;
      }
      .ant-checkbox + span {
        width: 100%;
      }
    }

    .option__input{
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #D1D1D1;
      margin-left: 8px;
    }

		.radio__group.ant-radio-group{
			.ant-radio-wrapper{
        width: 100%;
				margin-bottom: 0px;
				padding: 0px;
				background-color: #fff;
				min-height: 40px;
        padding-left:15px ;
        display: flex;
        align-items: center;
			}
      .ant-radio + span {
        width: 100%;
        text-align: left;
      }
		}
	}
  // rate
  ::v-deep{
    .ant-rate svg {
      font-size: 31px;
    }
  }
  // matrix
  .matrix ~ .form__card{
    @include rwd-md{
      &:nth-of-type(odd) .matrix__item{
        background-color: #fff;
      }
    }
  }
	.matrix__item{
    min-width: 60px;
  }

	.matrix__event {
    text-align: center;
    background: $COLOR-WHITE;
    font-size: 14px;
    line-height: 40px;
    font-weight: 600;
    color: $COLOR-MAIN12;
		margin-bottom: 0px;
    @include rwd-md {
      font-size: 20px;
      line-height: 60px;
    }
  }

  .matrix__item__subtitle {
		text-align: left;
    padding-top: 20px;
    font-size: 14px;
    font-weight: 600;
    padding-bottom: 14px;
    @include rwd-sm {
      padding-top: 0px;
      line-height: 40px;
      text-align: center;
      padding-bottom: 0px;
    }
    @include rwd-md {
      font-size: 16px;
      line-height: 60px;
    }
  }
	.matrix__header{
		min-height: 40px;
	}
  .matrix__header__title {
    font-weight: 600;
		line-height: 1em;
		padding-bottom: 20px;
		vertical-align: top;
		text-align: center;
		display: inline-block;
		@include rwd-md {
			vertical-align: middle;
		}

  }

  ::v-deep{
		.matrix__group.ant-radio-group{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
		}
    .matrix__group__radio.ant-radio-wrapper{
      display: flex;
      justify-content: flex-start;
      .ant-radio + span{
        padding: 0 8px;
      }
      padding-left: 15px;
      @include rwd-md{
        padding-left: 0;
        padding-right: 0;
        justify-content: center;
        .ant-radio + span{
          display: none;
        }
      }
    }
	}
</style>
