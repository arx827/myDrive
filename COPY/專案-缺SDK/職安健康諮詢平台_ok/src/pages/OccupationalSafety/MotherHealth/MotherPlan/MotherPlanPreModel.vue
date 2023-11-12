<template>
  <div v-if="modalVisible">
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      :footer="null"
      :closable="false"
    >
      <div class="modal-container">
        <div class="model-container__header">
          <div class="row">
            <div class="col-sm-1 col-12 model-container__header__icon d-flex justify-content-sm-start justify-content-center">
              <div style="padding-top: 5px;">
                <a-icon
                  type="exclamation-circle"
                  theme="filled"
                  class="title__icon"
                />
              </div>
            </div>
            <div class="col-sm-11 col-12 model-container__header__title d-flex justify-content-sm-start justify-content-center">
              醫師諮詢需求詢問
            </div>
          </div>
        </div>
        <div class="model-container__content">
          <div class="model-container__content__qa">
            請問您是否有預約醫師諮詢服務的需求？
          </div>
          <a-form-model
            ref="ruleForm"
            :rules="formRules"
            :model="form"
          >
            <a-form-model-item
              prop="isPhyConsult"
            >
              <a-radio-group
                v-model="form.isPhyConsult"
                class="radio-group"
                :default-value="data.isPhyConsult"
              >
                <div class="model-container__content__radio-block">
                  <a-radio
                    :value="true"
                    class="radio__block"
                  >
                    是，需要
                  </a-radio>
                  <div class="model-container__content__sub-radio-block">
                    <hr>
                    <p>選擇此項，系統將引導您進入醫師諮詢預約畫面。</p>
                  </div>
                </div>
                <div class="model-container__content__radio-block">
                  <a-radio
                    :value="false"
                    class="radio__block"
                  >
                    否，不需要
                  </a-radio>
                  <div
                    v-if="!form.isPhyConsult"
                    class="model-container__content__sub-radio-block"
                  >
                    <hr>
                    <p>選擇此項，請選擇下方項目，說明不需要的原因。</p>
                    <a-form-model-item
                      prop="unPhyConsultReason"
                    >
                      <a-radio-group
                        v-model="form.unPhyConsultReason"
                        class="radio-group"
                      >
                        <div class="radio__block--margin">
                          <div class="d-flex">
                            <a-radio
                              :value="1"
                            />
                            <p style="padding-top: 3px;">
                              目前身體狀況良好，暫不需要
                            </p>
                          </div>
                        </div>
                        <div class="radio__block--margin">
                          <div class="d-flex">
                            <a-radio
                              :value="2"
                            />
                            <p style="padding-top: 3px;">
                              已有於婦產科或其他專科院所追蹤中
                            </p>
                          </div>
                        </div>
                        <div class="radio__input d-flex">
                          <a-radio
                            :value="3"
                            class="radio__input__radio"
                          >
                            其他
                          </a-radio>
                          <a-input
                            v-model="form.unPhyConsultDesc"
                            placeholder="請簡述不諮詢原因"
                            class="radio__input__input"
                          />
                        </div>
                      </a-radio-group>
                    </a-form-model-item>
                  </div>
                </div>
              </a-radio-group>
            </a-form-model-item>
          </a-form-model>
          <div style="text-align: right;">
            <div class="buttom__wrap">
              <button
                class="btn__radius--primary--small"
                @click="onSubmit"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { MonPlanPhyConsultDto } from '@fubonlife/oss-api-axios-sdk';
import notification from '@/plugins/notification/infoNotification';

@Component({})
export default class MotherPlanPreModal extends Vue {
@Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  @Prop()
  data

  modalVisible = false;

  // 表單欄位資料
  form = {
  	isPhyConsult: null,
  	unPhyConsultDesc: null,
  	unPhyConsultReason: null,
  }

  // 表單欄位規則
  formRules= {
  	isPhyConsult: [{ required: true, message: '此欄位為必填', trigger: 'change' }],
  	unPhyConsultReason: [{ required: true, message: '此欄位為必填', trigger: 'change' }],
  }

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.form = this.data;
  	}
  	console.log(val);
  }

  onClose() {
  	this.$emit('closeModal');
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.confirm();
  		} else {
  			console.log('error search!!');
  			return false;
  		}
  	});
  }

  confirm() {
  	const data: MonPlanPhyConsultDto = {
  		caseId: this.data.caseId,
  		email: this.data.email,
  		isPhyConsult: this.form.isPhyConsult,
  		isRecord: this.data.isRecord,
  		unPhyConsultDesc: this.form.unPhyConsultDesc,
  		unPhyConsultReason: this.form.unPhyConsultReason,
  	};
  	this.setLoading(true);
  	this.$MONPLANEmpFormApi.savePhyConsultEUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (data.isPhyConsult) {
  					// 導向醫師預約 傳入參數:個案維護ID、TYPE(D0102)、護理師email
  					sessionStorage.setItem('caseInfo', JSON.stringify({
  						caseId: resp.data.data.caseId,
  						srcFrom: 'D0102',
  						nurseEmail: resp.data.data.email,
  					}));
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'MotherPlanDoctorReservationStep1',
  						query: {
  							caseId: resp.data.data.caseId,
  							srcFrom: 'D0102',
  							nurseEmail: resp.data.data.email,
  						},
  					});
  				} else {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'MotherPlanFormResult',
  						query: {
  							result: 'success',
  						},
  					});
  				}
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'MotherPlanFormResult',
  					query: {
  						result: 'fail',
  						errorMsg: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					},
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
  .modal-container {
    padding-top: 30px;
    padding-bottom: 30px;
    padding-left: calc(28/300*100%);
    padding-right: calc(28/300*100%);
    @include rwd-sm {
      padding-left: calc(42/500*100%);
      padding-right: calc(74/500*100%);
    }
    @include rwd-xl {
      padding-left: calc(42/500*100%);
      padding-right: calc(42/500*100%);
    }
		.model-container__header {
			margin-bottom: 10px;
			.model-container__header__icon {
				color: $COLOR-MAIN1;
			}
			.model-container__header__title{
				font-size: 20px;
        padding-left: 0px;
			}
		}
		.model-container__content {
      @include rwd-sm {
        padding-left: calc(34/500*100%);
      }
			.model-container__content__qa {
				margin-bottom: 10px;
			}
			.model-container__content__radio-block {
				width: 100%;
				padding-top: 20px;
				padding-bottom: 20px;
				padding-left: calc(15/500*100%);
				background-color: #F4F8FC;
				border-radius: 4px;
				margin-bottom: 10px;
				.model-container__content__sub-radio-block {
					width: 100%;
					padding-left: calc(31/500*100%);
					padding-right: calc(34/500*100%);
					p {
						font-size: 14px;
					}
				}
			}
		}
	}
	hr {
		margin-bottom: 10px;
		margin-top: 10px;
	}
	.radio-group {
		width: 100%;
	}
	.radio__block--margin {
		margin-bottom: 10px;
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 4px;
		padding-top: 9px;
		padding-bottom:9px;
		padding-left: 12px;
	}
	.buttom__wrap{
		margin-top: 10px;
	}
  .title__icon {
    ::v-deep {
      svg {
        font-size: 30px;
        @include rwd-sm {
          font-size: 20px;
        }
      }
    }
  }
	::v-deep {
    .ant-modal-body {
      padding: 0px;
    }
		.radio__input {
      width: 100%;
      background-color: #FFFFFF;
      border-radius: 4px;
      padding-left: 12px;
      .radio__input__radio {
        padding-top: 9px;
        padding-bottom:9px;
      }
      .ant-input {
        border-color: #ffffff;
				padding-top: 10px;
        padding-left: 0px;
        padding-bottom: 0px;
        &:focus {
          border-right-width: 1px !important;
          outline: 0;
          box-shadow: 0 0 0 2px transparent;
        }
      }
      .radio__input__input {
        margin-left: 5px;
        width: 100%;
        border-bottom: #999999 0.5px solid;
      }
    }
	}
</style>
