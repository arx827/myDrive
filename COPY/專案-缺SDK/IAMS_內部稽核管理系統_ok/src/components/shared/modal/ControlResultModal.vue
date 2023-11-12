<template>
  <a-modal
    :visible="getResultModal.visible"
    :closable="false"
    :footer="null"
    :width="changeWidth"
    :centered="true"
    :z-index="1080"
    :destroy-on-close="true"
    wrap-class-name="modal__primary"
  >
    <div
      class="modal__close flex-center"
      @click="handleCancel"
    >
      <img src="@/assets/images/icon/icon_window_close.svg">
    </div>
    <div class="content flex-center flex-column">
      <img
        v-if="typeEnum.includes(getResultModal.type)"
        :src="require(`@images/${iconObj[getResultModal.type]}.svg`)"
        class="content__img"
      >
      <div class="content__title">
        {{ getResultModal.title }}
      </div>
      <div
        v-if="getResultModal.contentHtml"
        class="content__text"
        v-html="getResultModal.contentHtml"
      />
      <div
        v-if="getResultModal.content"
        class="content__text"
      >
        <span>{{ getResultModal.content }}</span>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Prop, Watch, Component,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';

const modalControl = namespace('modalControl');

@Component({})
export default class SuccessResultModalModal extends Vue {
  @modalControl.Action('setModalState') setModalState;

  @modalControl.Action('closeModal') closeModal;

  @modalControl.Getter('getResultModal') getResultModal;

  // type 對應圖片檔名
  iconObj = {
  	success: 'icon_recogniz_ok',
  	error: 'icon_recogniz_no',
  	warning: 'icon_remind',
  }

  // 圖片type enum，非表列中的 不顯示
  typeEnum = ['success', 'error', 'warning'];

  // width enum，非表列中的 不轉換 number
  widthEnum = {
  	lg: 1200,
  	md: 600,
  	sm: 470,
  };

  $setTimeOut;

  // width 轉換
  get changeWidth() {
  	if (Object.keys(this.widthEnum).includes(this.getResultModal.width)) {
  		// 若 prop width 為表列的參數 就轉為數值
  		return this.widthEnum[this.getResultModal.width];
  	}
  	return this.getResultModal.width;
  }

  // 關閉彈窗
  handleCancel() {
  	this.closeModal('resultModal');
  }

  // 自動關閉彈窗
  autoCloseModal(second) {
  	this.$setTimeOut = setTimeout(this.handleCancel, second * 1000);
  }

  /**
   * 監聽
   */
  // 監聽彈窗開啟/關閉 觸發自動關閉彈窗時間 機制
  @Watch('getResultModal.visible', { immediate: true, deep: true })
  watchVisible(val) {
  	clearTimeout(this.$setTimeOut);
  	if (this.getResultModal.autoClose && typeof this.getResultModal.autoClose === 'number') {
  		if (!this.getResultModal.content) {
  			this.setModalState({
  				resultModal: {
  					content: `訊息${this.getResultModal.autoClose}秒自動關閉`,
  				},
  			});
  		}
  		this.autoCloseModal(this.getResultModal.autoClose);
  	}
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .ant-modal-body{
    background-color: $BG-PRIMARY;
    padding: 50px;
    border-radius: 4px;
  }
}
.content{
  background-color: $BG-LIGHT;
  padding: 60px 0px;
  .content__img{
    margin-bottom: 20px;
    width: 70px;
  }
  .content__title{
    font-size: 27px;
    text-align: center;
    line-height: 40px;
    color: $FONT-PRIMARY;
    font-weight: bold;
    white-space: pre-line;
  }
  .content__text{
    padding: 0px 76px;
    margin-top: 20px;
    font-size: 16px;
    color: $FONT-PRIMARY;
    white-space: pre-line;
  }
  .modal__close{
    position: absolute;
    top: -5px;
    right: 0;
    transform: translate(0, -100%);
    cursor: pointer;
    width: 48px;
    height: 48px;
  }
}
</style>
