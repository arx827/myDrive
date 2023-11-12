<!-- 審核通過/退回彈窗 -->
<template>
  <InfoModal
    :title="`審核${typeStr }`"
    :visible="getReviewCommitModal.visible"
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
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import { DataConfirmRequestDto } from '@fubonlife/iams-api-axios-sdk';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';

const modalControl = namespace('modalControl');
const detailModule = namespace('crawlerDataDetailVuex');

@Component({
	components: { InfoModal, ResponseMessage },
})
export default class ReviewCommitModal extends Vue {
	@Action('setLoading') setLoading;

  @modalControl.Action('setModalState') setModalState;

  @detailModule.Action('setDetailModalState') setDetailModalState;

  @detailModule.Getter('getReviewCommitModal') getReviewCommitModal;

  // 取得 通過/退回 vuex
	@detailModule.Getter('getConfirmData') getConfirmData;

	get isConfirm() {
  	return this.getReviewCommitModal.type === 'confirm';
	}

	get typeStr() {
  	return this.isConfirm ? '通過' : '退回';
	}

	msg = '';

	reset() {
		this.msg = '';
	}

	// API: 覆核退回/覆核通過 資料確認覆核API
	getApi_DataConfirm(agree) {
		// console.log(this.getConfirmData);
  	this.setLoading(true);
  	const formData: DataConfirmRequestDto = this.getConfirmData;
		// 變更 agree 狀態
		formData.agree = agree;
		// 變更 備註訊息
		formData.remark = this.msg;
		formData.roleId = null; // 後端傳入角色id
  	this.$dataCollectApi.dataConfirmInDataCollectUsingPOST(formData)
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
  		.catch((error) => {
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
		this.setDetailModalState({
			reviewCommitModal: {
				visible: false,
			},
		});
	}

	// 新增罐頭語
	addResponseMessage(value) {
  	this.msg += value;
	}

	async submit() {
		await this.getApi_DataConfirm(this.isConfirm);
		this.closeModal();
	}

	@Watch('getReviewCommitModal.visible')
	watchVisible() {
		this.reset();
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
