<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'80%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <a-form-model
        ref="formRef"
        :model="form"
      >
        <div class="modal-container">
          <div class="modal-container__title">
            症狀及病史說明
          </div>
          <a-form-model
            ref="formRef"
            :model="form"
          >
            <div class="row">
              <div class="col-sm-6 col-12 mb-2 mb-sm-0">
                <div class="modal-container__event__block">
                  <div class="modal-container__event__block__title">
                    第一項 (必填)
                  </div>
                  <div
                    v-for="(info, index) in contentA"
                    :key="index"
                  >
                    <div
                      class="modal-container__event__block__option"
                      :class="{'mb-0': index===contentA.length-1}"
                    >
                      <div class="modal-container__event__block__option__title">
                        {{ info.qaTitle }}<span class="mark">＊</span>
                      </div>
                      <div v-if="info.ansType === 3">
                        <a-form-model-item
                          :prop="info.ans"
                        >
                          <a-select
                            v-model="form[`${info.ans}`]"
                            :default-value="form.partA"
                            class="input__block"
                            :disabled="true"
                          >
                            <a-select-option :value="info.ans">
                              {{ info.ans }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                      </div>
                      <div v-if="info.ansType === 2">
                        <a-form-model-item
                          :prop="info.ans"
                        >
                          <a-radio-group
                            v-model="form[info.ans]"
                            :disabled="true"
                          >
                            <a-radio
                              v-for="(option, idx) in info.options"
                              :key="idx"
                              :value="option.optValue"
                              class="radio__block"
                              :class="{'mb-0': idx===info.options.length-1}"
                            >
                              {{ option.optDesc }}
                            </a-radio>
                          </a-radio-group>
                        </a-form-model-item>
                      </div>
                      <div v-if="info.ansType === 4">
                        <a-form-model-item
                          :prop="info.ans"
                        >
                          <a-textarea
                            v-model="form[info.ans]"
                            :auto-size="{ minRows: 6 }"
                            :disabled="true"
                          />
                        </a-form-model-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-12">
                <div class="modal-container__event__block">
                  <div class="modal-container__event__block__title">
                    第二項 (選填)
                  </div>
                  <div
                    v-for="(info, index) in contentB"
                    :key="index"
                  >
                    <div
                      class="modal-container__event__block__option"
                      :class="{'mb-0': index===contentA.length-1}"
                    >
                      <div class="modal-container__event__block__option__title">
                        {{ info.qaTitle }}
                      </div>
                      <div v-if="info.ansType === 3">
                        <a-form-model-item
                          :prop="info.ans"
                        >
                          <a-select
                            v-model="form[`${info.ans}`]"
                            :default-value="form.partA"
                            class="input__block"
                            :disabled="true"
                          >
                            <a-select-option :value="info.ans">
                              {{ info.ans }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                      </div>
                      <div v-if="info.ansType === 2">
                        <a-form-model-item
                          :prop="info.ans"
                        >
                          <a-radio-group
                            v-model="form[info.ans]"
                            :disabled="true"
                          >
                            <a-radio
                              v-for="(option, idx) in info.options"
                              :key="idx"
                              :value="option.optValue"
                              class="radio__block"
                              :class="{'mb-0': idx===info.options.length-1}"
                            >
                              {{ option.optDesc }}
                            </a-radio>
                          </a-radio-group>
                        </a-form-model-item>
                      </div>
                      <div v-if="info.ansType === 4">
                        <a-form-model-item
                          :prop="info.ans"
                        >
                          <a-textarea
                            v-model="form[info.ans]"
                            :auto-size="{ minRows: 6 }"
                            :disabled="true"
                          />
                        </a-form-model-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-form-model>

          <div class="btn__wrap text-center">
            <button
              class="btn__radius--primary mb-2"
              @click="onClose"
            >
              返回
            </button>
          </div>
        </div>
      </a-form-model>
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
  	this.$emit('closeDescModal');
  }

  // 表單欄位資料
  form = {
  	partA: 1,
  	periodA: 1,
  	descA: '看電腦頸部扭傷，無法動彈。',
  	partB: 1,
  	periodB: 1,
  	descB: '請輸入症狀及病史說明，如可能造成的原因、是否就醫、就醫科別、就醫已持續多久、是否有改善...等，上限字數100字。',
  }

  // 表單內容
  contentA = [];

  contentB = [];

  getData() {
  	this.setLoading(true);
  	this.contentA = [];
  	this.contentB = [];
  	const queryData: EmpFormFillOutRecordQueryDto = {
  		recordId: this.recordId,
  		formName: 'F0203',
  	};
  	this.$EhEmpFormRecordControllerApi.queryFormFillOutRecordUsingPOST(queryData)
  		.then((resp) => {
  			resp.data.data[0].topicAndOptsDtoList.forEach((item) => {
  				const option = {
  					qaTitle: item.topicDesc,
  					ansType: item.ansType,
  					ans: `question${item.topicId}`,
  					options: item.options,
  				};
  				this.$set(this.form, `question${item.topicId}`, item.ans ? item.ans : '');
  				this.contentA.push(option);
  			});
  			resp.data.data[1].topicAndOptsDtoList.forEach((item) => {
  				const option = {
  					qaTitle: item.topicDesc,
  					ansType: item.ansType,
  					ans: `question${item.topicId}`,
  					options: item.options,
  				};
  				this.$set(this.form, `question${item.topicId}`, item.ans ? item.ans : '');
  				this.contentB.push(option);
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
    .modal-container__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $TEXT-BOLD;
    }
		.modal-container__event__block {
			background-color: $COLOR-MAIN10;
			border-radius: 10px;
			width: 100%;
			padding-top: 20px;
			padding-bottom: 20px;
      padding-left: calc(38/444*100%);
      padding-right: calc(38/444*100%);
      .modal-container__event__block__title {
        font-size: 20px;
        color: $COLOR-MAIN1;
        margin-bottom: 20px;
      }
      .modal-container__event__block__option {
        font-size: 16px;
        margin-bottom: 20px;
        .modal-container__event__block__option__title {
          margin-bottom: 10px;
          font-weight: $TEXT-BOLD;
        }
      }
		}
    .radio__block {
      width: 100%;
      background-color: #FFFFFF;
      border-radius: 4px;
      padding-top: 9px;
      padding-bottom:9px;
      padding-left: 12px;
      margin-bottom: 10px;
    }
    .input__block {
      width: 100%
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
    .hr__line {
      margin-bottom: 20px;
      border: 1px solid #D1D1D1;
    }
    .desc {
      margin-bottom: 20px;
      font-size: 16px;
      .title {
        color: $COLOR-MAIN1;
      }
    }
  }
  ::v-deep {
    .ant-input {
      height: 42px;
    }
    .ant-form-item {
      margin: 0px;
    }
  }
</style>
