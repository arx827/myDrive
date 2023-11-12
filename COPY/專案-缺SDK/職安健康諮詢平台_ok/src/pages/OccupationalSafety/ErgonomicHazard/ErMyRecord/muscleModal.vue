<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="muscle__modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'80%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="modal-container">
        <div class="modal-container__top">
          <div class="modal-container__top__title">
            自覺肌肉骨骼不適症狀調查
          </div>
          <div class="card">
            <div class="card__header">
              依據您十五項身體各部位的不適感，給予實際情況的評分，0~5各分數相對應定義如下。
            </div>
            <div class="card__content">
              <div class="row">
                <div class="col-sm-6 col-12 card__content__left">
                  <div class="card__content__option">
                    0：不痛，可自由活動
                  </div>
                  <div class="card__content__option">
                    1：活動範圍約80%，可以忽略不適
                  </div>
                  <div class="card__content__option mb-sm-0">
                    2：活動範圍約60%，會痠痛可能影響工作
                  </div>
                </div>
                <div class="col-sm-6 col-12 card__content__right">
                  <div class="card__content__option">
                    3：活動範圍僅40%，會影響工作
                  </div>
                  <div class="card__content__option">
                    4：活動範圍僅20%，已影響自主能力
                  </div>
                  <div class="card__content__option mb-0">
                    5：完全無法自主活動
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-container__bottom">
          <div class="relevantSurvey__wrap">
            <a-form-model
              ref="ruleForm"
              :model="form"
              :layout="'vertical'"
            >
              <div class="row m-0">
                <div class="col-12 col-lg-6 img__block mb-2">
                  <div class="img__wrap">
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
                <div class="col-12 col-lg-6 padding__right padding__left">
                  <div class="radio__group">
                    <div class="table__title px-0">
                      <div class="row text-center m-0 radio__option__border">
                        <div class="col-5" />
                        <div class="col-7">
                          <div class="row">
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
                        </div>
                      </div>
                    </div>
                    <div
                      v-for="(item, index) in content"
                      :key="index"
                    >
                      <a-form-model-item :prop="item.ans">
                        <div class="radio__wrap">
                          <a-radio-group
                            :id="item.ans"
                            v-model="form[item.ans]"
                            class="row text-center m-0 pt-2 pb-2 radio__option__border"
                            :disabled="true"
                            @mouseover.native="$set(queryHover, index, true)"
                            @mouseleave.native="$set(queryHover, index, false)"
                          >
                            <div class="col-sm-5 col-12 text-sm-end text-start py-1 radio__option__title">
                              {{ index+1 }}.&nbsp;{{ item.qaTitle }}<span class="mark">＊</span>
                            </div>
                            <div class="col-sm-7 col-12">
                              <div class="row">
                                <div
                                  v-for="(optionItem, idx) in item.options"
                                  :key="idx"
                                  class="col-sm col-6"
                                  :class="{'padding__left': idx===0 || idx%2===0, 'padding__right': idx%2===1}"
                                >
                                  <div class="radio__option__block d-flex justify-content-sm-center">
                                    <a-radio
                                      :value="optionItem.optValue"
                                    />
                                    <div class="radio__option__block__content pt-1">
                                      {{ optionItem.optDesc }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a-radio-group>
                        </div>
                      </a-form-model-item>
                    </div>
                  </div>
                </div>
              </div>
            </a-form-model>
          </div>
        </div>
        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary mb-2"
            @click="onClose"
          >
            返回
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { Action } from 'vuex-class';
import { EmpFormFillOutRecordQueryDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { FblDataGrid } })
export default class ViewNurseRecordModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.getData();
  	}
  }

  @Prop()
  recordId: number

  onClose() {
  	this.$emit('closeMuscleModal');
  }

  // 表單內容
  form = {
  	query1: 0,
  	query2: 1,
  	query3: 2,
  	query4: 3,
  	query5: 4,
  	query6: 5,
  	query7: 0,
  	query8: 1,
  	query9: 2,
  	query10: 3,
  	query11: 4,
  	query12: 5,
  	query13: 0,
  	query14: 1,
  	query15: 2,
  };

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

  // 表單內容
  content = [];

  getData() {
  	this.setLoading(true);
  	this.content = [];
  	const queryData: EmpFormFillOutRecordQueryDto = {
  		recordId: this.recordId,
  		formName: 'F0202',
  	};
  	this.$EhEmpFormRecordControllerApi.queryFormFillOutRecordUsingPOST(queryData)
  		.then((resp) => {
  			console.log('resp.data.data => ', resp.data.data);
  			resp.data.data[0].topicAndOptsDtoList.forEach((item) => {
  				const option = {
  					qaTitle: item.topicDesc,
  					ansType: item.ansType,
  					ans: `question${item.topicId}`,
  					options: item.options,
  				};
  				this.$set(this.form, `question${item.topicId}`, item.ans ? item.ans : '');
  				this.content.push(option);
  			});
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
		margin-bottom: 16px;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    padding-top: 6px;
    .modal-container__top {
      padding-right: 30px;
      padding-left: 30px;
    }
    .modal-container__top__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $TEXT-BOLD;
    }
    .modal-container__bottom {
      @include rwd-sm {
        padding-right: 30px;
        padding-left: 30px;
      }
    }
  }
  .block--padding {
    margin: 0 30px;
    @include rwd-sm {
      margin: 0;
    }
  }
  .card {
    margin-bottom: 20px;
    border: 1px solid #D1D1D1;
    .card__header {
      background-color: $COLOR-MAIN1;
      color: white;
      font-size: 16px;
      font-weight: $TEXT-BOLD;
      padding-right: 20px;
      padding-left: 20px;
      padding-top: 12px;
      padding-bottom: 12px;
      @include rwd-md {
        padding-right: 0px;
        padding-left: 0px;
        text-align: center;
      }
    }
    .card__content {
      padding-top: 20px;
      padding-bottom: 20px;
      padding-right: 20px;
      padding-left: 20px;
      @include rwd-md {
        padding-right: 0px;
        padding-left: 0px;
      }
      .card__content__left {
        @include rwd-md {
          padding-left: calc(72/724*100%);
        }
        @include rwd-xl {
          padding-left: calc(92/904*100%);
        }
      }
      .card__content__right {
        @include rwd-md {
          padding-left: calc(16/724*100%);
        }
        @include rwd-xl {
          padding-left: calc(92/904*100%);
        }
      }
      .card__content__option {
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
  }
  .img__wrap {
    background-image: linear-gradient(to bottom, #BDC8D0, #BDC8D0, #D9E1E7);
    border-radius: 30px;
    height: 100%;
    @include rwd-md {
      min-height: 688px;
    }
  }
  .img__man {
    position: relative;
    height: 420px;
    width: 215px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    @include rwd-md {
      width: 350px;
      height: 591px;
    }
  }
  .image__adult {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 401px;
    @include rwd-md {
      height:fit-content
    }
  }
  .image__shadow {
    display: none;
    @include rwd-xl {
      display: block;
      position: absolute;
      top: 94%;
      left: 50%;
      transform: translateX(-50%);
    }
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
    display: none;
    @include rwd-sm {
      display: block;
      background-color: #FAFAFA;
      padding: 8px;
      font-size: 20px;
      font-weight: bold;
      margin-top: 20px;
    }
    @include rwd-md {
      margin-top: 0px;
    }
  }
  .radio__wrap:hover {
    background-color: #F4F8FC;
  }
  .image__point1 {
    position: absolute;
    left: 42%;
    top: 10%;
    width: 40px;
    @include rwd-md {
      left: 44%;
      top: 9%;
      width: fit-content;
    }
  }
  .image__point2 {
    position: absolute;
    left: 15%;
    top: 15%;
    width: 40px;
    @include rwd-md {
      left: 22%;
      top: 14%;
      width: fit-content;
    }
  }
  .image__point3 {
    position: absolute;
    left: 4%;
    top: 30%;
    width: 40px;
    @include rwd-md {
      left: 13%;
      top: 29%;
      width: fit-content;
    }
  }
  .image__point4 {
    position: absolute;
    left: -2%;
    top: 42%;
    width: 40px;
    @include rwd-md {
      left: 5%;
      top: 42%;
      width: fit-content;
    }
  }
  .image__point5 {
    position: absolute;
    left: 20%;
    top: 53%;
    width: 40px;
    @include rwd-md {
      left: 24%;
      top: 54%;
      width: fit-content;
    }
  }
  .image__point6 {
    position: absolute;
    left: 22%;
    top: 68%;
    width: 40px;
    @include rwd-md {
      left: 28%;
      top: 70%;
      width: fit-content;
    }
  }
  .image__point7 {
    position: absolute;
    left: 22%;
    top: 86%;
    width: 40px;
    @include rwd-md {
      left: 28%;
      top: 89%;
      width: fit-content;
    }
  }
  .image__point8 {
    position: absolute;
    left: 70%;
    top: 15%;
    width: 40px;
    @include rwd-md {
      left: 44%;
      top: 21%;
      width: fit-content;
    }
  }
  .image__point9 {
    position: absolute;
    left: 42%;
    top: 22%;
    width: 40px;
    @include rwd-md {
      left: 66%;
      top: 14%;
      width: fit-content;
    }
  }
  .image__point10 {
    position: absolute;
    left: 78%;
    top: 30%;
    width: 40px;
    @include rwd-md {
      left: 75%;
      top: 29%;
      width: fit-content;
    }
  }
  .image__point11 {
    position: absolute;
    left: 42%;
    top: 36%;
    width: 40px;
    @include rwd-md {
      left: 44%;
      top: 36%;
      width: fit-content;
    }
  }
  .image__point12 {
    position: absolute;
    left: 83%;
    top: 42%;
    width: 40px;
    @include rwd-md {
      left: 82%;
      top: 42%;
      width: fit-content;
    }
  }
  .image__point13 {
    position: absolute;
    left: 63%;
    top: 53%;
    width: 40px;
    @include rwd-md {
      left: 63%;
      top: 54%;
      width: fit-content;
    }
  }
  .image__point14 {
    position: absolute;
    left: 61%;
    top: 68%;
    width: 40px;
    @include rwd-md {
      left: 60%;
      top: 70%;
      width: fit-content;
    }
  }
  .image__point15 {
    position: absolute;
    left: 61%;
    top: 86%;
    width: 40px;
    @include rwd-md {
      left: 60%;
      top: 89%;
      width: fit-content;
    }
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
  .radio__option__block {
    background-color:white;
    width: 100%;
    padding-top: 13px;
    padding-bottom: 13px;
    padding-left: 10px;
    margin-bottom: 10px;
    @include rwd-sm {
      background-color: transparent;
      padding: 0px;
      margin-bottom: 0px;
    }
    .radio__option__block__content {
      margin-left: 5px;
      @include rwd-sm {
        display: none
      }
    }
  }
  .radio__option__border {
    @include rwd-sm {
      border-bottom: #00000017 solid 1px;
    }
  }
  .radio__group {
    background-color: #F5F8FC;
    padding-right: 30px;
    padding-left: 30px;
    @include rwd-sm {
      background-color: transparent;
      padding-right: 0px;
      padding-left: 0px;
    }
  }
  .radio__option__title {
    padding-left: 0px;
    @include rwd-sm {
      padding-left: 8px;
    }
  }
  .padding__right {
    padding-right: 0px;
    @include rwd-sm {
      padding-right: 8px;
    }
  }
  .padding__left {
    padding-left: 0px;
    @include rwd-sm {
      padding-left: 8px;
    }
  }
  .img__block {
    padding-right:30px;
    padding-left: 30px;
    @include rwd-sm {
      padding-right: 0px;
      padding-left: 0px;
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
