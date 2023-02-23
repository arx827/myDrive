<template>
  <InfoModal
    :title="isClaim? '資料蒐集(認列)' : '資料蒐集(非本組認列)'"
    :visible="visible"
    :centered="true"
    :width="isClaim? 460:950"
    @closeModal="closeModal"
  >
    <template slot="content">
      <fragment>
        <div class="d-flex">
          <a-form-model
            ref="formRef"
            class="mt-4 form--light content__form"
            :model="form"
            :rules="formRules"
            :hide-required-mark="true"
          >
            <a-form-model-item
              v-if="isClaim"
              prop="confirmUser"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
            >
              <span slot="label">
                資料確認人員
              </span>
              <a-select
                v-model="form.confirmUser"
                class="input--select"
              >
                <a-select-option
                  v-for="item in confirmUserList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              v-if="!isClaim"
              prop="message"
              :label-col="{ span: 24 }"
              :wrapper-col="{ span: 24 }"
            >
              <span slot="label">
                簽核意見：
              </span>
              <div class="confirm-message">
                <img
                  class="confirm-message__img"
                  :src="isClaim?require(`@/assets/images/icon_recogniz.svg`):require(`@/assets/images/icon_not_recogniz.svg`)"
                  alt=""
                >
                <a-textarea
                  v-model="form.applyRemark"
                  :auto-size="{minRows:14}"
                />
              </div>
            </a-form-model-item>
          </a-form-model>
          <ResponseMessage
            v-if="!isClaim"
            class="content__msg ps-2"
            @select="addResponseMessage"
          />
        </div>
        <div class="d-flex mt-4 justify-content-end">
          <button
            class="btn--primary me-2"
            @click="submit"
          >
            確認
          </button>
          <button
            class="btn--dark ms-2"
            @click="closeModal"
          >
            取消
          </button>
        </div>
      </fragment>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';
import {
	GetAuditorTeamRequest, SelectOptionDto, RoleDto, SendClaimRequest,
} from '@fubonlife/iams-api-axios-sdk';
import { Action } from 'vuex-class';

// export interface todoListDataInterface{
//   img: string;
//   title: string;
//   count: number;
// }

@Component({
	components: { IconTextButton, InfoModal, ResponseMessage },
})
export default class ClaimForm extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

  @Prop()
  isClaim: boolean;

  @Prop()
  crawlerDataId: string[];

  @Watch('isClaim', { immediate: true, deep: true })
  onIsClaimChanged(val) {
  	if (val) {
  		this.getAuditorTeam();
  	}
  }

  // TODO: type:SendClaimRequest
  form = {
  	confirmUser: null,
  	crawlerDataId: null,
  	group: null,
  	applyRemark: '',
  };

  formRules: { [key: string]: ValidationRule[] } = {
  	confirmUser: [{ required: true, message: '請選擇資料確認人員', trigger: 'change' }],
  };

  // 資料確認人員清單
  confirmUserList: SelectOptionDto[] = null;

  // 當前角色
  currentRole: RoleDto = null;

  // API: 取得確認人員清單
  async getAuditorTeam() {
  	this.setLoading(true);
  	this.currentRole = await this.$global.getCurrentRole();
  	const request: GetAuditorTeamRequest = {
  		roleId: this.currentRole.id,
  		unitCode: this.currentRole.roleUnits && this.currentRole.roleUnits.length > 0 && this.currentRole.roleUnits[0].auditorTeamCode,
  	};
  	this.$dataCollectApi.getAuditorTeamInDataCollectUsingPOST(request)
  		.then((resp) => {
  			this.confirmUserList = resp.data.result;
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // 確認
  submit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			if (this.isClaim) {
  				// 認列
  				this.$emit('claim', this.form.confirmUser);
  			} else {
  				// 非認列
  				this.$emit('notClaim', this.form.applyRemark);
  			}
  		}
  	});
  }

  clearForm() {
  	this.form = {
  		confirmUser: null,
  		crawlerDataId: null,
  		group: null,
  		applyRemark: '',
  	};
  }

  closeModal() {
  	this.$emit('closeModal');
  }

  // 新增罐頭語
  addResponseMessage(value) {
  	this.form.applyRemark += value;
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
  flex-grow: 5;
  margin-top: 55px;
}
</style>
