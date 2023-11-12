<template>
  <InfoModal
    :title="title"
    :visible="syncedVisible"
    :centered="true"
    :width="950"
    @closeModal="close"
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
              prop="message"
              :label-col="{ span: 24 }"
              :wrapper-col="{ span: 24 }"
            >
              <span slot="label">
                {{ `${label}：` }}
              </span>
              <div class="confirm-message">
                <img
                  class="confirm-message__img"
                  :src="
                    type === 'approval'
                      ? require(`@/assets/images/icon_recogniz.svg`)
                      : require(`@/assets/images/icon_not_recogniz.svg`)
                  "
                  alt=""
                >
                <a-textarea
                  v-model="form.applyRemark"
                  class="input_area"
                  placeholder="請填寫退回意見"
                  :auto-size="{ minRows: 14 }"
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
            @click="syncedVisible = false"
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
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { Getter, Action, namespace } from 'vuex-class';

const modalControl = namespace('modalControl');

@Component({ components: { ResponseMessage, InfoModal } })
export default class NoticeReviewCommit extends Vue {
  @modalControl.Action('setModalState') setModalState;

  @PropSync('visible')
  syncedVisible: boolean;

  @Prop({ default: 'approval' })
  type: 'approval' | 'return' | 'delete';

  @Prop()
  title: string;

  @Prop()
  label: string;

  @Watch('syncedVisible')
  watchSyncedVisible() {
  	this.reset();
  }

  form = {
  	applyRemark: '',
  };

  formRules: { [key: string]: ValidationRule[] } = {
  	confirmUser: [
  		{ required: true, message: '請選擇資料確認人員', trigger: 'change' },
  	],
  };

  /**
   * Event
   */
  close() {
  	this.syncedVisible = false;
  }

  reset() {
  	this.form = {
  		applyRemark: '',
  	};
  }

  submit() {
  	this.syncedVisible = false;

  	if (this.type) {
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'success',
  				title: '審核退回成功',
  				autoClose: 3,
  			},
  		});
  		console.log('Show ResultModal (activated by RevCM)');
  	} else {
  		console.log('some message');
  	}

  	this.close();
  }

  // 新增罐頭語
  addResponseMessage(value) {
  	this.form.applyRemark += value;
  }
}
</script>

<style lang="scss" scoped>
.confirm-message__img {
  position: absolute;
  top: -45px;
  right: 8px;
  width: 70px;
}
.content__form {
  flex-grow: 6;
}
.content__msg {
  flex-grow: 5;
  margin-top: 55px;
}
.input_area {
  padding-top: 10px;
}
</style>
