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
            十年內心血管疾病發病風險評估量表
          </div>
          <div class="modal-container__event__block mb-0">
            <div
              v-for="(c, idx) in radioDataList"
              :key="idx"
            >
              <div class="modal-container__event__block__option">
                <div class="modal-container__event__block__option__title d-flex">
                  <div>{{ c.desc }}</div>
                  <div class="mark-required">
                    *
                  </div>
                </div>
                <a-form-model-item
                  :prop="c.ans"
                >
                  <a-radio-group
                    v-model="form[c.ans]"
                    :default-value="form[c.ans]"
                    class="row"
                  >
                    <div class="col-md-6 col-12">
                      <a-radio
                        :value="1"
                        class="radio__block mb-2 mb-sm-0"
                        :disabled="true"
                      >
                        沒有
                      </a-radio>
                    </div>
                    <div class="col-md-6 col-12">
                      <a-radio
                        :value="2"
                        class="radio__block"
                        :disabled="true"
                      >
                        有
                      </a-radio>
                    </div>
                  </a-radio-group>
                </a-form-model-item>
              </div>
            </div>
            <div class="modal-container__event__block__option">
              <div class="row">
                <div
                  v-for="(c, idx) in inputDataList"
                  :key="idx"
                  class="col-md-6 col-12"
                >
                  <div class="modal-container__event__block__option__title d-flex">
                    <div>{{ c.desc }}</div>
                    <div
                      v-if="c.required==='Y'"
                      class="mark-required"
                    >
                      *
                    </div>
                  </div>
                  <a-form-model-item
                    :prop="c.ans"
                  >
                    <a-input
                      v-model="form[c.ans]"
                      class="input__block mb-2 mb-sm-0"
                      :disabled="true"
                    />
                  </a-form-model-item>
                </div>
              </div>
            </div>
            <hr class="hr__line hr__line--margin">
            <div
              v-for="(a, index) in groupList"
              :key="'a'+index"
            >
              <div class="desc d-flex">
                <div class="title">
                  下列項目二擇一必填
                </div>
                <div
                  v-if="a.required==='Y'"
                  class="mark-required"
                >
                  *
                </div>
              </div>
              <div class="modal-container__event__block__option mb-0">
                <div class="row">
                  <div
                    v-for="(b, idx) in groupList[index]"
                    :key="'b'+idx"
                    class="col-md-6 col-12"
                  >
                    <div class="modal-container__event__block__option__title d-flex">
                      <div>{{ b.desc }}</div>
                      <div
                        v-if="b.required==='Y'"
                        class="mark-required"
                      >
                        *
                      </div>
                    </div>
                    <a-form-model-item
                      :prop="b.ans"
                    >
                      <a-input
                        v-model="form[b.ans]"
                        class="input__block mb-2 mb-sm-0"
                        :disabled="true"
                      />
                    </a-form-model-item>
                  </div>
                </div>
              </div>
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

  modalVisible = false;

  @Prop()
  recordId: number

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
  	this.$emit('closeYearModal');
  }

  // 表單欄位資料
  form = {
  	smoke: null,
  	sugar: null,
  	sp: null,
  	dp: null,
  	highChol: null,
  	totalChol: null,
  	lowChol: null,
  }

  radioDataList = [];

  inputDataList = [];

  groupDataList = [];

  groupList = [];

  getData() {
  	this.setLoading(true);
  	this.radioDataList = [];
  	this.inputDataList = [];
  	this.groupDataList = [];
  	this.groupList = [];
  	const recordData: EmpHealthOverloadCiIdDto = {
  	recordId: this.recordId,
  	};
  	this.$AlEmpAlCaseRecordInquireControllerApi.getFriskFormDataUsingPOST1(recordData)
  		.then((resp) => {
  			console.log(resp.data.data);
  			if (resp.data.status === 200) {
  				resp.data.data.forEach((item, index) => {
  					if (item.type === 3) {
  						if (item.ans === 'Y') {
  							this.form[`query${item.topicNo}`] = 2;
  						} else if (item.ans === 'N') {
  							this.form[`query${item.topicNo}`] = 1;
  						}
  						const option = {
  							desc: item.desc,
  							ans: `query${item.topicNo}`,
  							required: item.isRequire,
  						};
  						this.radioDataList.push(option);
  					} else if (item.type === 4 && item.group === null) {
  						this.form[`query${item.topicNo}`] = item.ans;
  						const option = {
  							desc: item.desc,
  							ans: `query${item.topicNo}`,
  							required: item.isRequire,
  						};
  						this.inputDataList.push(option);
  					} else if (item.type === 4 && item.group !== null) {
  						this.form[`query${item.topicNo}`] = item.ans;
  						const option = {
  							desc: item.desc,
  							ans: `query${item.topicNo}`,
  							groupNo: item.group,
  							required: item.isRequire,
  						};
  						this.groupDataList.push(option);
  					}
  				});
  				this.handleGroup();
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

  handleGroup() {
  	const groupNo = [];
  	// this.groupDataList.filter(item=>item.groupNo===1)
  	this.groupDataList.forEach((item, index) => {
  		groupNo.push(item.groupNo);
  	});
  	const uniqueGroupNo = [...new Set(groupNo)];
  	uniqueGroupNo.forEach((item) => {
  		const sameData = this.groupDataList.filter((subitem) => subitem.groupNo === item);
  		this.groupList.push(sameData);
  	});
  	console.log('yes', this.groupDataList);
  	console.log('no', this.form);
  	console.log('same', this.groupList);
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
    }
    .input__block {
      width: 100%
    }
		.mark-required {
      color: $ERROR-COLOR;
      vertical-align: top;
      margin-left: 5px;
    }
    .hr__line--margin {
      margin-bottom: 20px;
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
