<template>
  <InfoModal
    title="提問及回覆問題"
    :visible="visible"
    body-size="large"
    padding-size="small"
    :closable="true"
    :centered="false"
    @closeModal="close"
  >
    <template slot="content">
      <div class="content mt-2">
        <div class="list">
          <!-- 如果狀態為組長＋QAstatus !== Q，彈窗則無法提問問題 -->
          <div
            v-if="isEdit"
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
            :key="index"
            class="list__item"
          >
            <div class="list__item__info">
              <img
                class="list__item__img"
                :src="index%2==0?require('@/assets/images/icon_question1.svg'):require('@/assets/images/icon_question.svg')"
                alt=""
              >
              <div class="list__item__title mt-3">
                {{ item.updateRole }}
              </div>
              <div class="list__item__title">
                {{ item.updateUser }}
              </div>
            </div>

            <div class="list__item__content align-self-start">
              <div class="list__item__subtitle">
                <span>{{ item.updateDatetime }}</span>
              </div>
              <div class="list__item__text">
                {{ yapPointAuditItemId? item.yapPointAuditItemQAContent : item.yapProjectScopeQAContent }}
              </div>
            </div>
          </div>
          <div
            v-if="(!QAData || QAData.length === 0) && !isEdit"
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
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import {
	YapProjectScopeQADto,
} from '@fubonlife/iams-api-axios-sdk';

const modalModule = namespace('modalControl');

@Component({
	components: {
		InfoModal,
	},
})
export default class QAModal extends Vue {
  @Action('setLoading') setLoading;

  @modalModule.Action('setModalState') setModalState;

  @Prop()
  visible: boolean;

  @Prop()
  QAStatus: string;

  @Prop()
  QAData: [];

  @Prop()
  yapId: string;

  @Prop()
  yapStatus: string;

  @Prop()
  yapPointAuditItemId: string;

  @Prop()
  isSupervisor: boolean;

  @Prop()
  reviewLevel: string;

  @Prop()
  rejectFlag: boolean

  name: string = '';

  role: string = '';

  roleId: string = '';

  form = {
  	message: '',
  };

  modalQAStatus: string = '';

  formRules: { [key: string]: ValidationRule[] } ={
  	message: [
  		{
  		  required: true, message: '請填寫訊息', trigger: 'change',
  	  },
  	],
  }

  get isEdit() {
  	if (this.yapStatus === 'C' && !this.rejectFlag) {
  		if (this.roleId === 'ROLE_Audit_Team_Head' && this.QAStatus === 'Q') return true;
  		if (this.QAStatus !== 'Q') {
  			if (this.roleId === 'ROLE_Audit_Department_Head' && this.reviewLevel === '1') return true;
  			if (this.roleId === 'ROLE_Audit_Office_Boss_Vice' && this.reviewLevel === '2') return true;
  			if (this.roleId === 'ROLE_Audit_Office_Boss' && this.reviewLevel === '3') return true;
  		}
  	}
  	return false;
  }

  // API: create 專案查核範圍 提問/回覆提問
  getApi_createYapProjectScopeQA() {
  	this.$auditPlanApi.createQAOfYapProjectScopeInAuditPlanUsingPOST({
  		qaContent: this.form.message,
  		yapId: this.yapId,
  	})
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '新增提問/回覆提問成功',
  					autoClose: 3,
  				},
  			});
  			this.form.message = '';
  			this.$emit('getYapProjectScopeQA', {
  				yapId: this.yapId,
  				QAStatus: this.QAStatus,
  				yapStatus: this.yapStatus,
  			});
  			this.$emit('changeYapProjectScopeQAStatus', this.yapId);
  		})
  		.catch((error) => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: error.response.data.message,
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: create 重點查核項目 提問/回覆提問
  getApi_createYapItemScopeQA() {
  	this.$auditPlanApi.createQAOfYapPointAuditItemInAuditPlanUsingPOST({
  		qaContent: this.form.message,
  		yapPointAuditItemId: this.yapPointAuditItemId,
  	})
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '新增提問/回覆提問成功',
  					autoClose: 3,
  				},
  			});
  			this.form.message = '';
  			this.$emit('getYapItemScopeQA', {
  				yapPointAuditItemId: this.yapPointAuditItemId,
  				QAStatus: this.QAStatus,
  				yapStatus: this.yapStatus,
  			});
  			this.$emit('changeYapItemScopeQAStatus', this.yapId);
  		})
  		.catch((error) => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: error.response.data.message,
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
  			if (this.yapPointAuditItemId) {
  				// console.log('重點查核項目 送出提問');
  				this.getApi_createYapItemScopeQA();
  			} else {
  				// console.log('專案查核範圍送出提問');
  				this.getApi_createYapProjectScopeQA();
  			}
  		}
  	});
  }

  close() {
  	this.$emit('closeModal');
  }

  /**
   * 監聽
   */
  @Watch('visible', { deep: true, immediate: true })
  watchVisible(nV) {
  	if (nV) {
  		// 初始化 message
  		this.form.message = '';
  		this.name = this.$user.getMe().employee.name;
  		this.role = this.$global.getCurrentRole().name;
  		this.roleId = this.$global.getCurrentRoleId();
  	}
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
