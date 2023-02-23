<template>
  <div>
    <a-modal
      v-model="modalVisible"
      class="password__modal alert-modal"
      :closable="false"
      close-icon=" "
      :footer="null"
      :width="430"
      :mask-closable="false"
    >
      <div>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :layout="'vertical'"
          :rules="formRules"
        >
          <div class="alert__modal__title pb-4">
            <span class="modal__icon modal__icon--alert" />
            <span>密碼驗證</span>
          </div>
          <a-form-model-item prop="password">
            <a-input
              v-model="form.password"
              placeholder="8-12位數密碼，請留意英文大小寫"
              :class="{'has-error': !passwordIsValid}"
              :type="isHideMode?'password':'text'"
              @change="$event.target.value?hasValue=true:hasValue=false"
            >
              <a
                slot="suffix"
                href="#"
                @click.prevent="isHideMode = !isHideMode"
              >
                <img
                  v-if="!hasValue"
                  src="@/assets/button_eye_noTyping.svg"
                  alt=""
                >
                <img
                  v-if="hasValue && !isHideMode"
                  src="@/assets/button_eye_off.svg"
                  alt=""
                >
                <img
                  v-if="hasValue && isHideMode"
                  src="@/assets/button_eye_on.svg"
                  alt=""
                >
              </a>
            </a-input>
            <div
              v-if="!passwordIsValid"
              style="font-size: 13px; color: #ED7D7D"
            >
              密碼錯誤，請再次輸入。
            </div>
          </a-form-model-item>
          <div class="ant-modal-footer border-0 p-0">
            <a-button
              key="back"
              @click="handleCancel"
            >
              取消
            </a-button>
            <a-button
              key="submit"
              type="danger"
              :disabled="isLoading"
              @click="handleOk"
            >
              確定
            </a-button>
          </div>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Modal } from 'ant-design-vue';
import notification from '@/plugins/info/infoNotification';

@Component
export default class ModalPassword extends Vue {
  @Prop()
  form: {
    password: null;
  }

  @Prop()
  visible: boolean;

  @Prop()
  passwordValid: boolean;

  @Prop()
  selected: any;

  hasValue = false;

  isHideMode = true;

  modalVisible = false;

  passwordIsValid = true;

  isLoading = false;

  formRules = {
  	password: [{ required: true, message: '請填入有效密碼' }, { min: 8, message: '密碼不符，請再次輸入' }, { max: 12, message: '密碼不符，請再次輸入' }],
  }

  @Action('setLoading') setLoading;

  @Watch('visible', { deep: true })
  onValueChange(val) {
  	this.modalVisible = val;
  }

  @Watch('form', { deep: true })
  onChange(val) {
  	this.passwordIsValid = true;
  }

  created() {
  	this.modalVisible = this.visible;
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.isLoading = true;
  			this.$rePrintDownloadApi.coPasswordCheckUsingPOST(this.form.password)
  				.then((resp) => {
  					console.log(resp);
  					if (resp.data.status === 200) {
  						if (resp.data.data) {
  							// 驗證通過
  							this.passwordIsValid = true;
  			        this.$emit('submitPassword', this.selected);
  						} else {
  							this.passwordIsValid = false;
  						}
  					} else {
  						notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  					}
  				})
  				.catch((error) => {
  					console.log('error status = ', error);
  				})
  				.finally(() => {
  					this.isLoading = false;
  				});
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  handleOk() {
  	this.onSubmit();
  }

  handleCancel() {
  	// this.modalVisible = false;
  	this.$emit('closeModal');
  }
}
</script>

<style lang="scss" scoped>

</style>
