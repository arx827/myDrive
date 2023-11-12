<template>
  <InfoModal
    title="審核退回"
    :visible="visible"
    :centered="true"
    :width="950"
    @closeModal="closeModal"
  >
    <template slot="content">
      <fragment>
        <div class="d-flex">
          <a-form-model
            ref="formRef"
            class="mt-4 form--light content__form claim-form"
            :model="form"
            :hide-required-mark="true"
          >
            <a-form-model-item
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
                  src="@/assets/images/icon_not_recogniz.svg"
                  alt=""
                >
                <a-textarea
                  v-model="form.remark"
                  :auto-size="{minRows:11}"
                />
              </div>
            </a-form-model-item>
          </a-form-model>
          <ResponseMessage
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
	Vue, Component, Prop,
} from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';
import { Action } from 'vuex-class';

@Component({
	components: { IconTextButton, InfoModal, ResponseMessage },
})
export default class NotClaimModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

  form = {
  	remark: '',
  };

  clearForm() {
  	this.form = {
  		remark: '',
  	};
  }

  closeModal() {
  	this.$emit('closeModal');
  }

  // 新增罐頭語
  addResponseMessage(value) {
  	this.form.remark += value;
  }

  // 確認
  submit() {
  	this.$emit('submit', this.form.remark);
  }

  clear() {
  	this.form.remark = '';
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
}
.claim-form{
  ::v-deep{
    .ant-form-item{
      display: block;
      width: auto;
    }
  }
}
</style>
