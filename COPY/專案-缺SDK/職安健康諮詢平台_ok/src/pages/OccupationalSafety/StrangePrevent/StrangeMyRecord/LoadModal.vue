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
            負荷評估量表
          </div>
          <div class="modal-container__event__block mb-0">
            <div
              v-for="(item, index) in dataList"
              :key="'A'+index"
            >
              <div v-if="item.type===2">
                <div class="modal-container__event__block__title">
                  {{ item.formTitle }}
                </div>
                <div class="modal-container__event__block__option">
                  <div class="modal-container__event__block__option__title d-flex">
                    <div>請問您的工作狀態是否符合以下情形？ (可複選)</div>
                    <div class="mark-required">
                      *
                    </div>
                  </div>
                  <a-form-model-item
                    prop="workStatus"
                  >
                    <a-checkbox-group
                      v-model="form.workStatus"
                      class="row"
                      :value="form.workStatus"
                      :disabled="true"
                    >
                      <div class="col-12">
                        <div
                          v-for="(optionItem, index_a) in item.option"
                          :key="'A'+index_a"
                          class="checkbox__block d-flex"
                          :class="{'mb-0': index_a===item.option.length-1}"
                        >
                          <a-checkbox
                            :value="optionItem.no"
                            name="type"
                          />
                          <div class="checkbox__block__content">
                            {{ optionItem.desc }}
                          </div>
                        </div>
                      </div>
                    </a-checkbox-group>
                  </a-form-model-item>
                </div>
              </div>
              <div v-if="item.type===1">
                <div class="modal-container__event__block__title">
                  {{ item.formTitle }}
                </div>
                <div class="table__title">
                  <div class="row text-center me-0">
                    <div class="col-6" />
                    <div
                      v-for="(optionItem_a, index_a) in item.option"
                      :key="'ba'+index_a"
                      class="col"
                    >
                      {{ optionItem_a.title }}
                    </div>
                  </div>
                </div>
                <div
                  v-for="(descItem, index_b) in item.desc"
                  :key="'B'+index_b"
                >
                  <a-form-model-item :prop="item.key">
                    <div class="radio__wrap">
                      <a-radio-group
                        :id="descItem.key"
                        v-model="form[descItem.key]"
                        class="row"
                        :disabled="true"
                      >
                        <div class="col-sm-6 col-12 d-flex text-start mb-2 mb-sm-0">
                          <div class="mark-required">
                            *
                          </div>
                          <div>{{ descItem.label }}</div>
                        </div>
                        <div
                          v-for="(optionItem_c, index_c) in item.option"
                          :key="'bb'+index_c"
                          class="radio__option__block col-sm col-12 d-flex justify-content-sm-center"
                        >
                          <a-radio
                            :value="optionItem_c.value"
                          />
                          <div class="radio__option__block__content pt-1">
                            {{ optionItem_c.title }}
                          </div>
                        </div>
                      </a-radio-group>
                    </div>
                  </a-form-model-item>
                </div>
              </div>
              <hr
                v-if="index<dataList.length-1"
                class="hr__line hr__line--margin"
              >
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
import { EmpHealthOverloadCiIdDto } from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';

@Component({ components: { FblDataGrid } })
export default class ViewNurseRecordModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  @Prop()
  recordId: number

  modalVisible = false;

  recordid = null;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.getData();
  	}
  }

  @Watch('recordId')
  onIdChange(val) {
  	this.recordid = val;
  }

  onClose() {
  	this.$emit('closeLoadModal');
  }

  // 表單欄位資料
  form = {
  	workStatus: [],
  }

  dataList = [];

  getData() {
  	this.dataList = [];
  	const recordData: EmpHealthOverloadCiIdDto = {
  		recordId: this.recordId,
  	};
  	this.setLoading(true);
  	this.$AlEmpAlCaseRecordInquireControllerApi.getOverLoadFormDataUsingPOST1(recordData)
  		.then((resp) => {
  			// console.log(resp.data.data);
  			if (resp.data.status === 200) {
  				resp.data.data.forEach((item, index) => {
  					if (item.topicPersonalList[0].type === 1) {
  						const table = {
  							formNo: item.titleNo,
  							formTitle: item.title,
  							option: [],
  							desc: [],
  							type: item.topicPersonalList[0].type,
  						};
  						item.optPersonalList.forEach((item, index) => {
  							const optionItem = {
  								title: item.ansSpec,
  								value: item.ansNo,
  							};
  							table.option.push(optionItem);
  						});
  						item.topicPersonalList.forEach((item, index) => {
  							const qa = {
  								label: item.desc,
  								key: `query${item.topicId.toString()}`,
  							};
  							table.desc.push(qa);
  							if (item.ans === '5') {
  								this.form[`query${item.topicId.toString()}`] = 5;
  							} else if (item.ans === '4') {
  								this.form[`query${item.topicId.toString()}`] = 4;
  							} else if (item.ans === '3') {
  								this.form[`query${item.topicId.toString()}`] = 3;
  							} else if (item.ans === '2') {
  								this.form[`query${item.topicId.toString()}`] = 2;
  							} else if (item.ans === '1') {
  								this.form[`query${item.topicId.toString()}`] = 1;
  							}
  						});
  						this.dataList.push(table);
  					} else if (item.topicPersonalList[0].type === 2) {
  						const table = {
  							formNo: item.titleNo,
  							formTitle: item.title,
  							option: [],
  							type: item.topicPersonalList[0].type,
  						};
  						item.topicPersonalList.forEach((item, index) => {
  							if (item.ans === 'Y') {
  								this.form.workStatus.push(item.topicNo.toString());
  							}
  							const qa = {
  								desc: item.desc,
  								no: item.topicNo.toString(),
  							};
  							table.option.push(qa);
  						});
  						this.dataList.push(table);
  					}
  				});
  				this.dataList.sort((a, b) => a.formNo - b.formNo);
  			} else {
  				this.$infoNotification.error({
  					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  				this.onClose();
  			}
  		})
  		.catch((error) => {
  			console.log('error status=', error);
  			this.onClose();
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
			margin-bottom: 20px;
			padding-top: 30px;
			padding-bottom: 20px;
			padding-left: calc(92/1088*100%);
			padding-right: calc(92/1088*100%);
      .modal-container__event__block__title {
        font-size: 20px;
        margin-bottom: 20px;
        font-weight: $TEXT-BOLD;
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
		.mark-required {
      color: $ERROR-COLOR;
      vertical-align: top;
      margin-right: 5px;
    }
    .hr__line--margin {
      margin-top: 20px;
      margin-bottom: 20px;
      @include rwd-lg {
        margin-top: 30px;
        margin-bottom: 30px;
      }
    }
    .checkbox__block {
      width: 100%;
      background-color: #FFFFFF;
      border-radius: 4px;
      margin-bottom: 10px;
      padding-top: 12px;
      padding-bottom:12px;
      padding-left: 12px;
      .checkbox__block__content {
        margin-left: 10px;
        padding-right: 16px;
        width: 100%;
      }
    }
    .table__title {
      display: none;
      @include rwd-sm {
        display: block;
        padding-left: 38px;
        font-size: 16px;
        font-weight: $TEXT-BOLD;
        margin-bottom: 16px;
      }
    }
    .radio__wrap {
      @include rwd-sm {
        background-color: white;
        padding-top: 19px;
        padding-bottom: 19px;
        padding-left: 38px;
        margin-bottom: 10px;
      }
    }
    .radio__option__block {
      background-color: white;
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
        @include rwd-sm {
          display: none
        }
      }
    }
  }
  ::v-deep {
    .ant-form-item {
      margin: 0px;
    }
  }
</style>
