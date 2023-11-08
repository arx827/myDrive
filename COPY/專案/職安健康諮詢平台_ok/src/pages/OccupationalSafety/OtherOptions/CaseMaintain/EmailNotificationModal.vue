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
      <div class="modal-container">
        <div class="modal-container__title d-flex justify-content-between">
          <div class="modal-container__title__main">
            Email表單填寫通知內容
          </div>
          <div class="modal-container__title__sub d-flex align-items-end">
            如欲編輯請至「其他_通知內容維護」處理
          </div>
        </div>
        <a-form-model
          ref="formRef"
          :model="form"
        >
          <div class="modal-container__cate__block">
            <div class="option row mb-0">
              <div class="option__title col-2 pt-2">
                通知類別
              </div>
              <div class="col-10">
                <a-form-model-item
                  prop="cate"
                >
                  <a-select
                    v-model="form.listId"
                    class="select__block"
                    :options="formData"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
          <div class="modal-container__other__block">
            <div class="option row">
              <div class="option__title col-2">
                主旨
              </div>
              <div class="col-10">
                {{ form.listId?mailDropList.find((e)=>e.contenId===form.listId).subject:'' }}
                <!-- {{ mailDropList[form.listId-1] && mailDropList[form.listId-1].subject }} -->
              </div>
            </div>
            <div class="option row">
              <div class="option__title col-2">
                內容
              </div>
              <div class="col-10">
                {{ form.listId?mailDropList.find((e)=>e.contenId===form.listId).content:'' }}
              </div>
            </div>
            <!-- <div class="option row mb-0">
              <div class="option__title col-2">
                資訊上傳
              </div>
              <div class="col-10 d-flex">
                <a-icon
                  type="paper-clip"
                  theme="outlined"
                  class="pt-1"
                />
                <div style="margin-left: 5px; color: #4D86FF">
                  OOOO表單資訊.pdf
                </div>
              </div>
            </div> -->
          </div>
        </a-form-model>
        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary--outline mb-2"
            @click="onClose"
          >
            取消
          </button>
          <button
            class="btn__radius--primary mb-2"
            :disabled="!form.listId"
            @click="onSubmit"
          >
            發送
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
import { CaseMaintainNoticeSenderInputDto, MonPlanCaseIdAndFormIdDto } from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';

@Component({ components: { FblDataGrid } })
export default class ViewNurseRecordModal extends Vue {
  @Action('setLoading') setLoading;

  formData = [];

  @Prop()
  visible: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  @Prop()
  userData

  sendUser = null;

  @Watch('userData')
  onChangeSend(val) {
  	this.sendUser = val;
  }

  @Prop()
  sendCaseId

  caseId = null;

  @Watch('sendCaseId')
  onChangeCaseId(val) {
  	this.caseId = val;
  }

  @Prop()
  sendFormId

  @Prop()
  sendFormStatus

  @Prop()
	mailDropList

  @Watch('mailDropList')
  setData(val) {
  	this.formData = [];
  	this.form.listId = null;
  	this.mailDropList.forEach((item, index) => {
  		const block = {
  			value: item.contenId,
  			label: item.subject,
  		};
  		this.formData.push(block);
  	});
  	// this.form.cate = 1;
  }

  onSubmit() {
  	this.setLoading(true);
  	console.log('this.sendFormStatus => ', this.sendFormStatus);
  	const sendData: CaseMaintainNoticeSenderInputDto = {
  		contentId: this.form.listId,
  		caseId: this.caseId,
  		receiveUid: this.sendUser,
  	};
  	console.log(sendData);
  	this.$CaseMaintainUtilityApi.humanFactorCaseNoticeSenderUsingPOST(sendData)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				const motherData: MonPlanCaseIdAndFormIdDto = {
  				  caseId: this.caseId,
  				  formId: this.sendFormId,
  				};
  				if (this.sendFormStatus && this.sendFormStatus === 1) {
  					this.$MONPLANRpnMaintainApi.reNewByCaseIdUsingPOST(motherData)
  					.then((resp) => {
  						if (resp.data.status === 200) {
  							this.$global.changeRouterAndaddParam({
  								toRouter: 'CaseMaintainResult',
  								params: {
  									type: 'email',
  								},
  								query: {
  									result: 'success',
  								},
  							});
  						}
  					})
  					.catch((error) => {
  						console.log('error status = ', error);
  					})
  					.finally(() => {
  						console.log('finish = ');
  					});
  				} else {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'CaseMaintainResult',
  						params: {
  							type: 'email',
  						},
  						query: {
  							result: 'success',
  						},
  					});
  				}
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'CaseMaintainResult',
  					params: {
  						type: 'email',
  					},
  					query: {
  						result: 'fail',
  						message: this.$global.getApiErrorMsg(resp.data.apiError),
  					},
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status= ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  	console.log('form', this.form);
  	// this.$router.push({ path: '/occupationSafety/Other/caseMaintain/email/result' });
  }

  onClose() {
  	this.$emit('closeModal');
  }

  // 表單欄位資料
  form = {
  	listId: null,
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
    padding-top: 10px;
    .modal-container__title {
      margin-bottom: 20px;
			.modal-container__title__main {
				font-size: 30px;
      	font-weight: $TEXT-BOLD;
			}
			.modal-container__title__sub {
				font-size: 16px;
				color: $COLOR-MAIN1;
			}
    }
		.modal-container__cate__block {
			background-color: $COLOR-MAIN10;
			border-radius: 10px;
			width: 100%;
			margin-bottom: 20px;
			padding-top: 30px;
			padding-bottom: 10px;
			padding-left: calc(92/1088*100%);
			padding-right: calc(92/1088*100%);
		}
		.modal-container__other__block {
			background-color: $COLOR-MAIN10;
			border-radius: 10px;
			width: 100%;
			margin-bottom: 30px;
			padding-top: 30px;
			padding-bottom: 10px;
			padding-left: calc(92/1088*100%);
			padding-right: calc(92/1088*100%);
		}
		.option {
				width: 100%;
				margin-bottom: 20px;
				.option__title {
					font-size: 16px;
					font-weight: $TEXT-BOLD;
				}
			}
		.select__block {
			width: 100%;
		}
  }
  ::v-deep {
    .ant-table-tbody > tr > td {
      vertical-align: top;
    }
  }
</style>
