<template>
  <InfoModal
    :title="title"
    :visible="visible"
    :centered="true"
    :width="950"
    @closeModal="close"
  >
    <template slot="content">
      <div>
        <div
          v-if="(type === 'adminReturn' || type === 'supervisorReturn')
            && (!itemOptions || itemOptions.length === 0)"
          class="d-flex my-3 flex-column justify-content-center align-items-center comp__empty"
        >
          <img
            src="@/assets/images/icon/icon-no-found.svg"
            alt=""
          >
          <div class="comp__empty--text">
            無可退回的查核項目
          </div>
        </div>
        <a-form-model
          v-else
          ref="formRef"
          class="mt-4 form--light"
          :model="form"
          :rules="formRules"
          :hide-required-mark="true"
        >
          <a-form-model-item
            v-if="type === 'adminReturn' || type === 'supervisorReturn'"
            prop="auditItems"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 6 }"
          >
            <span slot="label">
              查核項目：
            </span>
            <a-select
              v-model="form.auditItems"
              placeholder="請選擇查核項目"
              class="w-100"
              :allow-clear="true"
              :options="itemOptions"
              mode="multiple"
              :dropdown-match-select-width="false"
            />
          </a-form-model-item>

          <div class="row">
            <a-form-model-item
              prop="applyRemark"
              class="col-7"
              :label-col="{ span: 24 }"
              :wrapper-col="{ span: 24 }"
            >
              <span slot="label">
                {{ `${label}：` }}
              </span>
              <div class="confirm-message">
                <img
                  class="confirm-message__img"
                  :src="type === 'approval'?require(`@/assets/images/icon_recogniz.svg`):require(`@/assets/images/icon_not_recogniz.svg`)"
                  alt=""
                >
                <a-textarea
                  v-model="form.applyRemark"
                  :auto-size="{minRows:14}"
                />
              </div>
            </a-form-model-item>

            <ResponseMessage
              class="content__msg ps-2 col-5"
              @select="addResponseMessage"
            />
          </div>
        </a-form-model>
        <div class="d-flex mt- justify-content-end">
          <button
            v-if="!((type === 'adminReturn' || type === 'supervisorReturn')
              && (!itemOptions || itemOptions.length === 0))"
            class="btn--primary me-2"
            @click="submit"
          >
            確認
          </button>
          <button
            class="btn--dark ms-2"
            @click="close"
          >
            取消
          </button>
        </div>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { Action } from 'vuex-class';
import { SearchAuditPlan } from '@fubonlife/iams-api-axios-sdk';

@Component({ components: { ResponseMessage, InfoModal } })
export default class CompareDataModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

  @Prop({ default: 'approval' })
  type: 'leaderApproval' | 'leaderReturn' | 'leaderDelete' | 'adminReturn' | 'supervisorReturn';

  @Prop()
  title: string;

  @Prop()
  label: string;

  @Prop()
  year: number;

  @Prop()
  yapId: string;

  // @Prop()
  // auditItemList;

  @Watch('visible', { immediate: true })
  watchVisible(value) {
  	if (value && this.type === 'adminReturn') this.setAuditItemsData(); // 行政組組長退回
  	if (value && this.type === 'supervisorReturn') this.getSupervisorReturnAuditItem(); // 主管級退回
  }

  // @Watch('auditItemList', { deep: true })
  // onAuditItemListChanged(value) {
  // 	this.itemOptions = value;
  // }

  // 查核項目選項
  itemOptions = []

  form = {
  	applyRemark: undefined,
  	auditItems: undefined,
  };

  formRules: { [key: string]: ValidationRule[] } = {
  	auditItems: [{ required: true, message: '請選擇查核項目', trigger: 'change' }],
  	applyRemark: [{ trigger: 'change', validator: this.applyRemarkValidator }],
  };

  applyRemarkValidator(rule, value, callback) {
  	console.log('value', value);

  	if (!value) {
  		if (this.type === 'leaderReturn' || this.type === 'supervisorReturn' || this.type === 'adminReturn') return callback('請輸入退回意見');
  		if (this.type === 'leaderDelete') return callback('請輸入刪除意見');
  		return callback();
  	}
  	callback();
  }

  /**
   * Event
   */

  // API: 查詢年度查核項目
  setAuditItemsData() {
  	this.setLoading(true);
  		this.$auditPlanApi.searchAuditItemInAuditPlanUsingGET(this.year.toString(), false)
  		.then((resp) => {
  			this.itemOptions = resp.data.result;
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  getSupervisorReturnAuditItem() {
  	// this.$emit('getSupervisorReturnAuditItem');
  	this.setLoading(true);
  	this.$auditPlanApi.searchYapModifiableInAuditPlanUsingGET(this.year.toString(), false)
  		.then((resp) => {
  			this.itemOptions = resp.data.result;
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  close() {
  	console.log('關閉');

  	this.reset();
  	this.$emit('closeModal');
  }

  reset() {
  	this.form = {
  		auditItems: undefined,
  	  applyRemark: undefined,
  	};
  }

  submit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			switch (this.type) {
  			case 'adminReturn':
  				this.$emit('click', { type: 'return', payload: this.form });
  				break;

  			case 'supervisorReturn':
  				this.$emit('click', { type: 'return', payload: this.form });
  				break;

  			case 'leaderDelete':
  				this.$emit('click', { type: 'leaderDelete', payload: this.form.applyRemark });
  				break;

  			case 'leaderReturn':
  				this.$emit('click', {
  					type: 'leaderReturn',
  					payload: {
  						yapId: this.yapId,
  						remark: this.form.applyRemark,
  				  },
  				});
  				break;
  			case 'leaderApproval':
  				this.$emit('click', {
  					type: 'leaderApproval',
  					payload: {
  						yapId: this.yapId,
  						remark: this.form.applyRemark,
  				  },
  				});
  				break;
  	    }
  			this.close();
  		}
  	});
  }

  // 新增罐頭語
  addResponseMessage(value) {
  	this.form.applyRemark ? this.form.applyRemark += value : this.form.applyRemark = value;
  }
}
</script>

<style lang="scss" scoped>
  .confirm-message__img{
    position: absolute;
    top: -45px;
    right: 8px;
    width: 70px;
  }
  .content__form{
    flex-grow: 6;
  }
  .content__msg{
    // flex-grow: 5;
    margin-top: 32px;
  }
  .comp__empty{
  background-color: $BG_LIGHT;
  padding: 2.5em 0em;
	.comp__empty--text{
		margin-left: -17px;
		color: #000000A6;
		margin-top: 5px;
	}
}
</style>
