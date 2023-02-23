<template>
  <a-modal
    :class="modalClass"
    :visible="visible"
    :closable="false"
    :footer="null"
    :wrap-class-name="wrapClassName"
    :width="!bodySize? (width || 600): null"
    :centered="centered || false"
    :mask-closable="maskClosable===false?false:true"
    @cancel="handleCancel"
  >
    <div
      v-if="closable || false"
      class="modal__close flex-center"
      @click="handleCancel"
    >
      <img
        src="@/assets/images/icon/icon_window_close.svg"
        alt=""
      >
    </div>
    <div
      class="modal__content"
    >
      <div
        v-if="title || false"
        class="modal__content__title"
      >
        {{ title }}
      </div>
      <slot name="content" />
      <div
        v-if="footer || false"
        class="d-flex mt-4 justify-content-end"
      >
        <button
          class="btn--primary me-2"
          @click="handleConfirm"
        >
          確認
        </button>
        <button
          class="btn--dark ms-2"
          @click="handleCancel"
        >
          取消
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Prop, Watch, Component,
} from 'vue-property-decorator';

@Component({})
export default class InfoModal extends Vue {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  visible: boolean;

  @Prop()
  autoClose: string;

  @Prop()
  width: string;

  @Prop()
  closable: boolean;

  @Prop()
  centered: boolean;

  @Prop()
  paddingSize: 'small' | 'normal';

  @Prop()
  bodySize: 'small' | 'normal' | 'large';

  @Prop()
  heightFullScreen: boolean;

  @Prop()
  footer: boolean;

  @Prop()
  maskClosable: boolean;

  modalClass: string = '';

  get wrapClassName() {
  	return (this.closable) ? 'modal__primary hasClose' : 'modal__primary';
  }

  created() {
  	if (this.autoClose) {
  		this.autoCloseModal(this.autoClose);
  	}
  	// 處理 max-height body的padding class
  	if (this.heightFullScreen || false) {
  		this.modalClass += 'modal--height--full';
  	}
  	if (!this.paddingSize) {
  		this.modalClass += ' modal--padding--normal';
  	} else {
  		this.modalClass += ` modal--padding--${this.paddingSize}`;
  	}

  	if (this.bodySize) {
  		this.modalClass += ` modal__body--${this.bodySize}`;
  	}
  }

  handleConfirm() {
  	this.$emit('confirmModal');
  }

  handleCancel() {
  	this.$emit('closeModal');
  }

  autoCloseModal(second) {
  	setTimeout(this.handleCancel, second * 1000);
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .hasClose {
    .ant-modal {
      padding-top: 60px;
      padding-bottom: 30px;
    }
  }
}
</style>
