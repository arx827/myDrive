<!-- 新增查核內容 彈窗 -->
<template>
  <InfoModal
    :title="'新增查核'"
    :visible="syncedVisible"
    :centered="true"
    :width="950"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div class="bgLight__wrap mt-4">
        <a-form-model
          ref="formRef"
          class="content__form"
          :model="form"
          :rules="formRules"
          :hide-required-mark="true"
        >
          <a-form-model-item
            prop="auditContent"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <span slot="label">
              查核內容
            </span>
            <div class="confirm-message">
              <a-textarea
                v-model="form.auditContent"
                :auto-size="{minRows: 6}"
              />
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div
        class="d-flex mt-4 justify-content-end"
      >
        <button
          class="btn--primary me-2"
          @click="submit"
        >
          送出
        </button>
        <button
          class="btn--dark ms-2"
          @click="closeModal"
        >
          取消
        </button>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import { Getter, Action, namespace } from 'vuex-class';
import { DataConfirmRequestDto } from '@fubonlife/iams-api-axios-sdk';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';

const modalControl = namespace('modalControl');

@Component({
	components: { InfoModal, ResponseMessage, FblDataGrid },
})
export default class ReviewCommitModal extends Vue {
	@Action('setLoading') setLoading;

  @modalControl.Action('setModalState') setModalState;

  @PropSync('visible')
  syncedVisible!: boolean;

  @Prop({ required: true })
  auditDraftSectionId: string;

  form = {
  	auditContent: '',
  }

  formRules: { [key: string]: ValidationRule[] } = {
  	auditContent: [{ required: true, message: '請選擇查核內容', trigger: 'change' }],
  };

  // API: 新增查核內容
  getApi_addAuditing() {
  	this.setLoading(true);
  	this.$workPaperApi.createAuditDraftUsingPOST(this.auditDraftSectionId, this.form.auditContent)
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '新增查核成功',
  					autoClose: 3,
  				},
  			});
  	    this.closeModal();
  			this.$emit('updateData');
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  /**
	* Event
	*/
  closeModal() {
  	this.syncedVisible = false;
  }

  async submit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.getApi_addAuditing();
  		}
  	});
  }

  /**
	* 監聽
	*/
  @Watch('syncedVisible')
  watchVisible(nV) {
  	if (nV) {
  		// this.getApi_auditing();
  		this.form.auditContent = '';
  	}
  }
}
</script>

<style lang="scss" scoped>
  .bgLight__wrap {
    background-color: $BG-LIGHT;
    padding: 25px 30px 20px;
  }
</style>
