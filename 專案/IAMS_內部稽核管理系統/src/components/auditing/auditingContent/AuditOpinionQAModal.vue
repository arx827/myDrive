<template>
  <InfoModal
    title="提問及回覆問題"
    :visible="visible"
    body-size="large"
    padding-size="small"
    :closable="true"
    :centered="true"
    @closeModal="close"
  >
    <template slot="content">
      <div class="content mt-2">
        <div class="list">
          <!-- 提問框 -->
          <div
            v-if="canSendFlag"
            class="list__item"
          >
            <div class="list__item__info">
              <img
                class="list__item__img"
                src="@/assets/images/icon_question.svg"
                alt=""
              >
              <div class="list__item__title mt-3">
                {{ role }}
              </div>
              <div class="list__item__title">
                {{ name }}
              </div>
            </div>
            <div class="list__item__content d-flex flex-column justify-content-end">
              <div class="list__item__subtitle">
                <a-form-model
                  ref="formRef"
                  :model="form"
                  :hide-required-mark="true"
                  :rules="formRules"
                >
                  <a-form-model-item
                    prop="message"
                  >
                    <a-textarea
                      v-model="form.message"
                      class="list__item__textarea"
                      :rows="4"
                    />
                  </a-form-model-item>
                </a-form-model>
              </div>
              <button
                class="btn--primary mt-2 align-self-end"
                @click="confirm"
              >
                送出
              </button>
            </div>
          </div>
          <div
            v-for="(item,index) in QAData"
            :key="type==='draft'? item.auditDraftContentQaId+index : item.auditOpinionId + index"
            class="list__item"
          >
            <div class="list__item__info">
              <img
                class="list__item__img"
                :src="index%2==0?require('@/assets/images/icon_question1.svg'):require('@/assets/images/icon_question.svg')"
                alt=""
              >
              <div class="list__item__title mt-3">
                {{ item.updateRole.name }}
              </div>
              <div class="list__item__title">
                {{ item.updateUser.name }}
              </div>
            </div>

            <div class="list__item__content align-self-start">
              <div class="list__item__subtitle">
                <span>{{ item.updateDateTime }}</span>
              </div>
              <div class="list__item__text">
                {{ item.content }}
              </div>
            </div>
          </div>
          <div
            v-if="(QAData && QAData.length === 0 && !canSendFlag) "
            class="d-flex m-3 flex-column justify-content-center align-items-center comp__empty"
          >
            <img
              src="@/assets/images/icon/icon-no-found.svg"
              alt=""
            >
            <div class="comp__empty--text">
              無資料
            </div>
          </div>
        </div>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch, PropSync,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import {
	AddAuditorOpinionQaRequest, AuditDraftContentDetailResponseDto,
} from '@fubonlife/iams-api-axios-sdk';
import { AuditOpinionFrontEndDto } from '@/pages/auditing/models';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';

const modalModule = namespace('modalControl');

@Component({
	components: {
		InfoModal,
	},
})
export default class AuditOpinionQAModal extends Vue {
  @Action('setLoading') setLoading;

  @modalModule.Action('setModalState') setModalState;

  @PropSync('auditOpinion')
  auditOpinionSync: AuditOpinionFrontEndDto;

  @PropSync('auditDraftContent')
  auditDraftContentSync: AuditDraftContentDetailResponseDto;

  @Prop()
  visible: boolean;

  @Prop()
  type: string;

  canSendFlag: boolean = false;

  name: string = '';

  role: string = '';

  roleId: string = '';

  QAData = null;

  form = {
  	message: '',
  };

  formRules: { [key: string]: ValidationRule[] } ={
  	message: [{ required: true, message: '請填寫訊息', trigger: 'change' }],
  }

  /**
   * 監聽
   */
  @Watch('visible', { deep: true, immediate: true })
  watchVisible(newValue) {
  	if (newValue) {
  		if (this.type === 'opinion') {
  			this.getOpinionQAContent(this.auditOpinionSync.auditOpinionId);
  		} else if (this.type === 'draft') {
  			this.getDraftQAContent(this.auditDraftContentSync.auditDraftContentId);
  		}
  	}
  }

  /**
   * Hooks
   */
  created() {
  	this.name = this.$user.getMe().employee.name;
  	this.role = this.$global.getCurrentRole().name;
  	this.roleId = this.$global.getCurrentRoleId();
  }

  // API: 取得 查核意見 提問內容
  getOpinionQAContent(auditOpinionId: string) {
  	this.setLoading(true);
  	this.$workPaperApi.getAuditOpinionQaUsingGET(auditOpinionId)
  		.then((resp) => {
  			this.QAData = resp.data.auditOpinions.map((auditOpinion) => ({
  				...auditOpinion,
  				updateDateTime: DateTimeFormmat.transformRocDate(auditOpinion.updateDateTime),
  			}));
  			console.log('QAData', this.QAData);
  			this.canSendFlag = resp.data.canSendFlag;
  			// 如果是回覆提問，且不為查核人員（身份為長官），必須先已讀（更改狀態）
  			if (this.auditOpinionSync.redQaStatusFlag && this.roleId !== 'ROLE_Auditor') {
  				this.updateOpinionQAStatus(this.auditOpinionSync);
  			}
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
    			resultModal: {
    				visible: true,
    				type: 'error',
    				title: '查詢提問/回覆提問內容失敗',
  					content: null,
    			},
    		});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 取得 查核內容 提問內容
  getDraftQAContent(auditDraftContentId: string) {
  	this.setLoading(true);
  	this.$workPaperApi.getDraftContentQaUsingGET(auditDraftContentId)
  		.then((resp) => {
  			this.QAData = resp.data.result.auditDraftContentQas.map((auditDraftContentQa) => ({
  				...auditDraftContentQa,
  				updateDateTime: DateTimeFormmat.transformRocDate(auditDraftContentQa.updateDatetime),
  			}));
  			this.canSendFlag = resp.data.result.canSendFlag;
  			// 如果是回覆提問，且不為查核人員（身份為長官），必須先已讀（更改狀態）
  			if (this.auditDraftContentSync.redQaStatusFlag && this.roleId !== 'ROLE_Auditor') {
  				this.updateDraftQAStatus(this.auditDraftContentSync);
  			}
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
    			resultModal: {
    				visible: true,
    				type: 'error',
    				title: '查詢提問/回覆提問內容失敗',
    			},
    		});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查核意見 變更QA狀態，已讀回覆的訊息
  updateOpinionQAStatus(opinion: AuditOpinionFrontEndDto) {
  	this.setLoading(true);
  	this.$workPaperApi.setOpinionQaStatusInWorkPaperUsingPOST({ auditOpinionId: opinion.auditOpinionId })
  		.then((resp) => {
  			if (resp.data) {
  				// 成功表示已讀，將紅色狀態取消
  				// this.auditOpinionSync.redQaStatusFlag = false;
  				this.$emit('updateAuditOpinion', {
  					auditOpinionId: opinion.auditOpinionId,
  					subRelMainId: opinion.subRelMainId,
  				});
  			} else {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: '已讀訊息失敗',
  					},
  				});
  			}
  		})
  		.catch(() => {
  			console.error();
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查核內容 變更QA狀態，已讀回覆的訊息
  updateDraftQAStatus(auditDraftContent: AuditDraftContentDetailResponseDto) {
  	this.setLoading(true);
  	this.$workPaperApi.updateDraftContentQaUsingPOST({ auditDraftContentId: auditDraftContent.auditDraftContentId })
  		.then((resp) => {
  			if (resp.data) {
    			// TODO: 待測試 更新前端畫面
  				// 成功表示已讀，將紅色狀態取消
  				// auditDraftContent.redQaStatusFlag = false;
  				this.$emit('reloadDraft');
  			} else {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: '已讀訊息失敗',
  					},
  				});
  			}
  		})
  		.catch(() => {
  			console.error();
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 送出 查核意見 問題、回覆
  sendOpinionMessage() {
  	this.setLoading(true);
  	const request: AddAuditorOpinionQaRequest = {
  		auditOpinionId: this.auditOpinionSync.auditOpinionId,
  		content: this.form.message,
  	};
  	this.$workPaperApi.addAuditorOpinionQaUsingPOST(request)
  		.then((resp) => {
  			// 成功後重新reload message
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '新增提問/回覆提問成功',
  					autoClose: 3,
  				},
  			});
  			this.form.message = null;
  			if (this.roleId === 'ROLE_Auditor') { // 查核人員回覆過問題後，redQaStatusFlag要改為false
  				// this.auditOpinionSync.redQaStatusFlag = false;
  				this.$emit('updateAuditOpinion', {
  					auditOpinionId: this.auditOpinionSync.auditOpinionId,
  					subRelMainId: this.auditOpinionSync.subRelMainId,
  				});
  			}
  			this.getOpinionQAContent(this.auditOpinionSync.auditOpinionId);
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '新增提問/回覆提問失敗',
  					autoClose: 3,
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 送出 查核內容 問題、回覆
  sendDraftMessage() {
  	this.setLoading(true);
  	const request = {
  		auditDraftContentId: this.auditDraftContentSync.auditDraftContentId,
  		content: this.form.message,
  	};
  	this.$workPaperApi.addDraftContentQaUsingPOST(request)
  		.then((resp) => {
  			// 成功後重新reload message
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '新增提問/回覆提問成功',
  					autoClose: 3,
  				},
  			});
  			this.form.message = null;
  			if (this.roleId === 'ROLE_Auditor') { // 查核人員回覆過問題後，redQaStatusFlag要改為false
  				this.auditDraftContentSync.redQaStatusFlag = false;
  			}
  			this.getDraftQAContent(this.auditDraftContentSync.auditDraftContentId);
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '新增提問/回覆提問失敗',
  					autoClose: 3,
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
   * Event
   */
  confirm() {
  	(this.$refs.formRef as any).validate(async (valid) => {
  		if (valid) {
  			(this.type === 'draft') ? this.sendDraftMessage() : this.sendOpinionMessage();
  		}
  	});
  }

  reset() {
  	this.form.message = null;
  	this.QAData = null;
  	this.canSendFlag = false;
  }

  close() {
  	this.reset();
  	this.$emit('closeModal');
  }
}
</script>

<style lang="scss" scoped>
.content{
  background-color: $BG-LIGHT;
  padding: 24px 40px;
  .list__item{
    background-color: $COLOR-LIGHT;
    padding: 20px;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #D9D9D9;
  }
  .list__item:first-child{
    align-items: flex-start;
  }
  .list__item:last-child{
    border-bottom: none;
  }
  .list__item__content{
    padding-left: 24px;
    flex: 1;
  }

  .list__item__info{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 105px;
    .list__item__title:nth-child(1){
      margin-top: 9px;
    }
  }
  .list__item__img{
    width: 36px;
  }
  .list__item__textarea{
    width: 100%;
    border-width: 2px;
    border-style: solid;
    white-space: pre-line;
  }
  .list__item__title{
    font-size: 14px;
    color: $COLOR-MAIN1;
    text-align: center;
  }
  .list__item__subtitle{
    margin-bottom: 7px;
    color: $COLOR-MAIN1;
    font-size: 14px;
    span:nth-child(2){
      margin-left: 30px;
    }
  }

}
.comp__empty{
	.comp__empty--text{
		margin-left: -17px;
		color: #000000A6;
		margin-top: 5px;
	}
}
::v-deep .ant-form-item-control {
  &:not(.has-error) {
    .list__item__textarea{
      border-color: $COLOR-MAIN1;
    }
  }
}
</style>
