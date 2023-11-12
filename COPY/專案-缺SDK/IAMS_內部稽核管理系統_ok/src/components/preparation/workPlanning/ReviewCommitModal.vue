<!-- 審核通過/退回彈窗 -->
<template>
  <InfoModal
    :title="`覆核${typeStr}`"
    :visible="visible"
    :centered="true"
    :width="950"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div class="d-flex">
        <div class="modal__main">
          <div class="modal__main__header d-flex align-items-end justify-content-between">
            <div class="main__header__label">
              {{ typeStr }}意見：
            </div>
          </div>
          <div class="confirm-message">
            <div class="main__header__icon">
              <img
                v-if="isConfirm"
                class="img-fluid"
                src="~@images/icon_recogniz.svg"
              >
              <img
                v-else
                class="img-fluid"
                src="~@images/icon_not_recogniz.svg"
              >
            </div>
            <a-textarea
              v-model="msg"
              class="audit__textarea"
              placeholder="請詳細填寫內容"
              :rows="11"
            />
          </div>
        </div>
        <ResponseMessage
          class="content__msg ps-2"
          @select="addResponseMessage"
        />
      </div>
      <div
        class="d-flex mt-4 justify-content-end"
      >
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
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import { DataConfirmRequestDto } from '@fubonlife/iams-api-axios-sdk';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';

const modalControl = namespace('modalControl');

@Component({
	components: { InfoModal, ResponseMessage },
})
export default class ReviewCommitModal extends Vue {
  @modalControl.Action('setModalState') setModalState;

	@Action('setLoading') setLoading;

  @PropSync('visible')
  syncedVisible: boolean;

  @Prop({ default: 'reject' })
  type: 'reject' | 'pass';

  @Prop()
  quarterWorkMId;

  @Prop()
  status;

  get typeStr() {
  	return this.type === 'pass' ? '通過' : '退回';
  }

  get isConfirm() {
  	return this.type === 'pass';
  }

	msg = '';

	reset() {
		this.msg = '';
	}

	// API: 覆核通過
	getApi_passWorkPlanInPreparation() {
  	this.$preparationApi.passWorkPlanInPreparationUsingPOST({
  		quarterWorkMId: this.quarterWorkMId,
			remark: this.msg,
  	})
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: `覆核${this.typeStr}成功`,
  					autoClose: 3,
  				},
  			});
				this.$router.go(-1);
  		})
  		.catch((err) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: `覆核${this.typeStr}失敗`,
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 覆核退回
	getApi_rejectWorkPlanInPreparation() {
  	this.$preparationApi.rejectWorkPlanInPreparationUsingPOST({
  		quarterWorkMId: this.quarterWorkMId,
			remark: this.msg,
  	})
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: `覆核${this.typeStr}成功`,
  					autoClose: 3,
  				},
  			});
				this.$router.go(-1);
  		})
  		.catch((err) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: `覆核${this.typeStr}失敗`,
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
	closeModal() {
		this.syncedVisible = false;
	}

	// 新增罐頭語
	addResponseMessage(value) {
  	this.msg += value;
	}

	async submit() {
		if (this.type === 'pass') {
			await this.getApi_passWorkPlanInPreparation();
		} else if (this.type === 'reject') {
			await this.getApi_rejectWorkPlanInPreparation();
		}
		this.closeModal();
	}

	@Watch('syncedVisible')
	watchVisible(nV) {
		if (nV) {
			this.reset();
		}
	}
}
</script>

<style lang="scss" scoped>
  .modal__main {
    display: flex;
    flex-direction: column;
    flex-grow: 6;
    .modal__main__header {
      margin-top: 22px;
      padding-left: 5px;
      padding-right: 8px;
      .main__header__label {
        color: $COLOR-LIGHT;
        padding: 5px 0;
      }
    }
    .confirm-message {
      flex: 1;
      margin-bottom: 17px;
      .main__header__icon {
        width: 70px;
        margin-bottom: -1px;
        position: absolute;
        top: -45px;
        right: 8px;
      }
    }
    .audit__textarea {
      height: 100%;
      font-size: 16px;
    }
  }
  .content__msg {
    flex-grow: 5;
    margin-top: 55px;
  }
</style>
