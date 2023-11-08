<template>
  <a-modal
    v-model="modalVisible"
    class="common__modal preview__modal"
    :mask-closable="false"
    :after-close="handleClose"
    :footer="null"
    :width="'70%'"
  >
    <template slot="closeIcon">
      <a-icon type="close" />
    </template>
    <div class="modal__wrap">
      <div class="page__card page__card--shadow p-0 mt-0">
        <div
          class="page__card__img"
          :style="`background-image:url(${pic})`"
        />
        <div class="info__wrap">
          <div class="info__item">
            <!-- 問卷文案 -->
            <div class="editor__preview">
              <div v-html="questDesc" />
            </div>
            <a-divider />
            <!-- 個資聲明文案 -->
            <div class="editor__preview">
              <div v-html="personalInfoStatement" />
            </div>
          </div>
        </div>
      </div>
      <!-- 題目 -->
      <template
        v-for="(item, index) in itemList"
      >
        <div
          v-if="item.enabled=='Y'"
          :key="index"
          class="form__card"
          :class="classBind(item,index)"
        >
          <!-- 單行文字 -->
          <div v-if="item.type === 1">
            <p
              class="question__form__subTitle"
              :class="item.isAnswer==='Y'?'answer__required':''"
            >
              {{ item.title }}
            </p>
            <a-input
              type="text"
              :placeholder="'請輸入'+item.title"
            />
          </div>
          <!-- 多行文字 -->
          <div v-else-if="item.type === 2">
            <p
              class="question__form__subTitle d-flex"
              :class="item.isAnswer==='Y'?'answer__required':''"
            >
              {{ item.title }}
            </p>
            <a-textarea
              :placeholder="'請簡述'+item.title+'，文字上限50字。'"
            />
          </div>
          <!-- 單選 -->
          <div v-else-if="item.type === 3">
            <p
              class="question__form__subTitle d-flex"
              :class="item.isAnswer==='Y'?'answer__required':''"
            >
              {{ item.title }}
            </p>

            <a-radio-group class="d-block">
              <div class="row gy-2">
                <div
                  v-for="(option,index2) in item.optDescList"
                  :key="index2"
                  :class="optionClass(index2,item)"
                  class="col-12"
                >
                  <div class="question__form__label__bg">
                    <a-radio :value="option">
                      {{ option.content }}
                      <a-input
                        v-if="option.isDesc"
                        class="option__input"
                        style="width:90%"
                        :max-length="50"
                      />
                    </a-radio>
                  </div>
                </div>
              </div>
            </a-radio-group>
          </div>
          <!-- 多選 -->
          <div v-else-if="item.type === 4">
            <p
              class="question__form__subTitle d-flex"
              :class="item.isAnswer==='Y'?'answer__required':''"
            >
              {{ item.title }}
            </p>
            <div class="row gy-2">
              <div
                v-for="(option,index3) in item.optDescList"
                :key="index3"
                :class="optionClass(index3,item)"
                class="col-12"
              >
                <div class="col-12 question__form__label__bg">
                  <a-checkbox>
                    {{ option.content }}
                    <a-input
                      v-if="option.isDesc"
                      class="option__input"
                      style="width:90%"
                      :placeholder="'請簡述，文字上限50字'"
                      :max-length="50"
                    />
                  </a-checkbox>
                </div>
              </div>
            </div>
          </div>
          <!-- 數字 -->
          <div v-else-if="item.type === 5">
            <p
              :class="item.isAnswer==='Y'?'answer__required':''"
              class="question__form__subTitle"
            >
              {{ item.title }}
            </p>
            <a-input-number
              class="col-6"
              :placeholder="'請輸入'+item.title"
            />
          </div>
          <!-- 星級評等 -->
          <div v-else-if="item.type === 6">
            <p
              class="question__form__subTitle"
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
          <!-- 分類標題 -->
          <div v-else-if="item.type === 0">
            <div
              class="question__form__title"
            >
              {{ item.title }}
            </div>
          </div>
          <!-- 矩陣題 -->
          <div v-else-if="item.type === 7">
            <div
              class="question__form__title"
            >
              {{ item.title }}
            </div>
            <div class="matrix__container">
              <!-- 第一個matrix題前要加權重標題 -->
              <a-row
                class="matrix"
              >
                <a-col
                  :span="9"
                  class="matrix__block"
                />
                <a-col
                  :span="14"
                  class="d-flex"
                >
                  <div
                    v-for="(weightItem, weightItemIndex) in item.weightingList"
                    :key="weightItemIndex"
                    class="col matrix__label matrix__label--top"
                  >
                    {{ weightItem }}
                  </div>
                </a-col>
                <a-col
                  :span="1"
                />
              </a-row>
              <a-row
                v-for="(opt,idx) in item.optDescList"
                :key="idx"
                class="matrix matrix__item"
              >
                <!-- 題目 -->
                <a-col
                  :span="9"
                  :class="item.isAnswer==='Y'?'answer__required':''"
                  class="matrix__block matrix__label matrix__label--left"
                >
                  {{ opt.content }}
                </a-col>
                <!-- radio -->
                <a-col
                  :span="14"
                >
                  <a-radio-group class="d-flex">
                    <a-radio
                      v-for="(weight, weightIndex) in item.weightingList"
                      :key="weightIndex"
                      :value="weightIndex"
                      class="col"
                    />
                  </a-radio-group>
                </a-col>
                <a-col
                  :span="1"
                />
              </a-row>
            </div>
          </div>
        </div>
      </template>
    </div>
  </a-modal>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class PreviewModal extends Vue {
  @Prop()
  pic: string

  @Prop()
  questDesc: string

  @Prop()
  personalInfoStatement: string

  @Prop()
  itemList

  list=[]

  @Prop()
  visible: boolean

  modalVisible = false;

  @Watch('visible')
  	onChange(val) {
  	this.modalVisible = val;
  	}

  @Watch('itemList')
  listChange() {
  	const new_list = this.itemList.filter((item) => item.topicStatus != 'N');
  	this.list = new_list;
  }

  handleClose() {
  	this.$emit('closeModal');
  }

  /**
   * data
   */

  classBind(item, index) {
  	let new_class = '';
  	// 分類標題
  	if (item.type === 0 || item.type === 7) {
  		new_class = 'card__wrap';
  	} else if (!this.itemList[index + 1] || this.itemList[index + 1].type === 0 || this.itemList[index + 1].type === 7) {
  		new_class = 'card__bottom';
  	}
  	return new_class;
  }

  optionClass(index, item) {
  	// 含簡述
  	if (item.optDescList[index].isDesc) return 'col-md-12';
  	// 非最後選項，最後一個選項含簡述，總選項偶數倒數第二選項12欄
  	if ((index !== item.optDescList.length - 1) && (item.optDescList[item.optDescList.length - 1].isDesc)) {
  		if ((index === item.optDescList.length - 2) && (item.optDescList.length % 2 === 0)) {
  			return 'col-md-12';
  		}
  	}
  	// 最後選項不含簡述，總數奇數選項12欄
  	if ((index === item.optDescList.length - 1) && (item.optDescList.length % 2 == 1)) {
  		return 'col-md-12';
  	}
  	return 'col-md-6';
  }

	/**
   * func
   */

	/**
   * Event
   */
}
</script>
<style lang="scss" scoped>
::v-deep .preview__modal{
  .ant-modal-body {
    padding: 30px;
  }
}
.page__card__img {
  height: 110px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.info__wrap {
  max-width: 900px;
  margin: auto;
}
.info__item {
  padding: 0 25px;
  line-height: 29px;
  color: $COLOR-BLACK;
  @include rwd-md{
    padding: 0 53px;
  }
}
.form__card {
  background: $COLOR-MAIN10;
  padding: 20px 50px 10px 50px;
}
.question__form__title {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
  // text-indent: 0.6em;
}
.form__title-matrix{
  background-color: $COLOR-WHITE;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $COLOR-MAIN12;
  padding: 16px 0px;
}
.question__form__subTitle {
  font-size: 16px;
  font-weight: $TEXT-BOLD;
  margin: 0;
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
.question__form__label__bg {
  background-color: $COLOR-WHITE;
  border-radius: 4px;
  padding: 10px;
  padding-right: 0;
}
::v-deep {
  .ant-modal-body {
    padding: 30px;
  }
  .ant-input {
    width: 94%;
  }
  .ant-rate{
    svg{
      font-size: 31px !important;
    }
  }
  .matrix {
    width: 100%;
    text-align: center;
    // height: 100%;
    // line-height: 60px;
  }
  .matrix__container{
    .matrix__item:nth-of-type(even){
      background-color: $COLOR-WHITE;
    }
  }
  .matrix__item {
    padding: 10px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
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
  .matrix__label--top {
    text-align: center;
    font-weight: 600;
    padding: 20px 0;
  }
  .ant-radio-group {
    width: 100%;
  }
  .ant-radio-wrapper {
    margin-right: 0px !important;
    width: 100%;
    .ant-radio + span {
        width: 100%;
        text-align: left;
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

  .card__wrap {
    margin-top: 20px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .card__bottom{
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
</style>
