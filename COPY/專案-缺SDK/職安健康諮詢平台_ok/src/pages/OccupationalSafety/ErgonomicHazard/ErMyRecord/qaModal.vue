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
            人因性危害預防計畫問卷
          </div>
          <div class="modal-container__event__block mb-0">
            <div
              v-for="(info, index) in content"
              :key="index"
            >
              <!-- title -->
              <div class="modal-container__event__block__title">
                {{ info.blockTitle }}
              </div>
              <!-- radio -->
              <div v-if="info.qaType===1">
                <div
                  v-for="(option, idx) in info.qa"
                  :key="idx"
                  class="modal-container__event__block__option"
                  :class="{'mb-0': idx === info.qa.length-1}"
                >
                  <div class="modal-container__event__block__option__title">
                    {{ option.qaTitle }}
                    <div class="mark-required">
                      *
                    </div>
                  </div>
                  <a-form-model-item
                    :prop="option.ans"
                  >
                    <a-radio-group
                      v-model="form[option.ans]"
                      class="row"
                      :disabled="true"
                    >
                      <div
                        v-for="(item, opidx) in option.descOption"
                        :key="opidx"
                        class="col-sm-6 col-12"
                        :class="{'mb-2': opidx<opidx.length-1, 'mb-sm-0':opidx<opidx.length-1}"
                      >
                        <a-radio
                          :value="item.value"
                          class="radio__block"
                        >
                          {{ item.desc }}
                        </a-radio>
                      </div>
                    </a-radio-group>
                  </a-form-model-item>
                </div>
              </div>
              <hr
                v-if="index !== content.length-1"
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
  	this.$emit('closeQaModal');
  }

  // 表單欄位資料
  form = {
  	workName: 1,
  	hand: 1,
  	pastYear: 1,
  	doubleCheck: 1,
  	relation: 1,
  }

  // 表單內容
  content = [];

  getData() {
  	this.setLoading(true);
  	this.content = [];
  	console.log(this.recordId);
  	const queryData: EmpFormFillOutRecordQueryDto = {
  		recordId: this.recordId,
  		formName: 'F0201',
  	};
  	this.$EhEmpFormRecordControllerApi.queryFormFillOutRecordUsingPOST(queryData)
  		.then((resp) => {
  			resp.data.data.forEach((item) => {
  			  const option = {
  			    blockTitle: item.topicType,
  					qaType: item.topicAndOptsDtoList[0].ansType,
  					qa: [],
  			  };
  				item.topicAndOptsDtoList.forEach((subItem) => {
  					const subOption = {
  						qaTitle: subItem.topicDesc,
  						ans: `question${subItem.topicId}`,
  						descOption: [],
  					};
  					this.$set(this.form, `question${subItem.topicId}`, subItem.ans ? subItem.ans : '');
  					subItem.options.forEach((qaItem) => {
  						const qaOption = {
  							desc: qaItem.optDesc,
  							value: qaItem.optValue,
  						};
  						subOption.descOption.push(qaOption);
  					});
  					option.qa.push(subOption);
  				});
  				this.content.push(option);
  			});
  			console.log('this.content=>', this.content);
  		})
  		.catch((error) => {
  			console.log('errror status => ', error);
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
        font-weight: $TEXT-BOLD;
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
      margin-top: 20px;
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
